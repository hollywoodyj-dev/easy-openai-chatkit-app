import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type VerifyReceiptBody = {
  "receipt-data": string;
  password?: string;
  "exclude-old-transactions"?: boolean;
};

type AppleReceiptRecord = Record<string, unknown>;

type AppleReceiptResponse = {
  status?: number;
  latest_receipt_info?: AppleReceiptRecord[];
  latest_receipt?: string;
  receipt?: {
    in_app?: AppleReceiptRecord[];
  };
  environment?: string;
};

function mapAppleReceiptStatusToSubscriptionStatus(args: {
  now: Date;
  expiresDate: Date | null;
  cancellationDate: Date | null;
}): "active" | "canceled" | "expired" {
  const { now, expiresDate, cancellationDate } = args;
  if (!expiresDate) return "expired";
  if (now < expiresDate) return "active";
  if (cancellationDate && now >= cancellationDate) return "canceled";
  return "expired";
}

function inferPlanFromProductId(productId?: string | null): "monthly" | "yearly" {
  const p = (productId ?? "").toLowerCase();
  return p.includes("year") ? "yearly" : "monthly";
}

function parseMsDate(ms: unknown): Date | null {
  if (ms === undefined || ms === null) return null;
  if (typeof ms === "string") {
    if (ms.trim() === "") return null;
    const n = Number(ms);
    if (!Number.isFinite(n)) return null;
    return new Date(n);
  }
  if (typeof ms === "number") {
    if (!Number.isFinite(ms)) return null;
    return new Date(ms);
  }
  return null;
}

async function verifyAppleReceipt(params: {
  receiptData: string;
  sharedSecret?: string;
  isSandboxAttempt?: boolean;
}): Promise<AppleReceiptResponse> {
  const { receiptData, sharedSecret, isSandboxAttempt } = params;
  const verifyUrl = isSandboxAttempt
    ? "https://sandbox.itunes.apple.com/verifyReceipt"
    : "https://buy.itunes.apple.com/verifyReceipt";

  const payload: VerifyReceiptBody = {
    "receipt-data": receiptData,
    "exclude-old-transactions": true,
  };
  if (sharedSecret && sharedSecret.trim().length > 0) {
    payload.password = sharedSecret.trim();
  }

  const res = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = (await res.json().catch(() => ({}))) as AppleReceiptResponse;
  return json;
}

function getAppleSharedSecrets(): string[] {
  const candidates = [
    process.env.APPLE_SHARED_SECRET,
    process.env.APPLE_APP_SPECIFIC_SHARED_SECRET,
  ]
    .filter((v): v is string => typeof v === "string")
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter((v) => v.length > 0);

  return Array.from(new Set(candidates));
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") ?? "";
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (!token) {
      return NextResponse.json({ error: "Missing Authorization header" }, { status: 401 });
    }

    const userId = verifyUserToken(token);
    if (!userId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      receiptData?: string;
      subscriptionId?: string;
      bundleId?: string;
    };
    const { receiptData, subscriptionId, bundleId } = body;

    if (!receiptData || typeof receiptData !== "string") {
      return NextResponse.json({ error: "receiptData is required" }, { status: 400 });
    }
    if (!subscriptionId || typeof subscriptionId !== "string") {
      return NextResponse.json({ error: "subscriptionId is required" }, { status: 400 });
    }

    const sharedSecrets = getAppleSharedSecrets();
    if (sharedSecrets.length === 0) {
      return NextResponse.json(
        {
          error: "Apple receipt verification not configured",
          message:
            "Set APPLE_SHARED_SECRET in Vercel. Optionally also APPLE_APP_SPECIFIC_SHARED_SECRET.",
        },
        { status: 501 }
      );
    }

    const bundle = (bundleId as string | undefined) ?? process.env.APPLE_BUNDLE_ID;
    if (bundle && typeof bundle === "string" && bundle.trim().length > 0) {
      // Bundle field kept for future stricter validation.
    }

    let receiptRes: AppleReceiptResponse = { status: 1 };
    for (const sharedSecret of sharedSecrets) {
      const productionRes = await verifyAppleReceipt({
        receiptData,
        sharedSecret,
        isSandboxAttempt: false,
      });

      let candidate: AppleReceiptResponse = productionRes;
      if ((productionRes.status ?? null) === 21007) {
        candidate = await verifyAppleReceipt({
          receiptData,
          sharedSecret,
          isSandboxAttempt: true,
        });
      }

      receiptRes = candidate;
      if ((candidate.status ?? 1) === 0) break;
      // 21004 means wrong secret; continue trying other configured candidates.
      if ((candidate.status ?? 1) !== 21004) break;
    }

    // Fallback: in some TestFlight/sandbox states, password validation can fail even
    // though the receipt itself is valid. Retry once without password and inspect records.
    if ((receiptRes.status ?? 1) === 21004) {
      const prodNoSecret = await verifyAppleReceipt({
        receiptData,
        isSandboxAttempt: false,
      });
      receiptRes =
        (prodNoSecret.status ?? null) === 21007
          ? await verifyAppleReceipt({
              receiptData,
              isSandboxAttempt: true,
            })
          : prodNoSecret;
    }

    if ((receiptRes.status ?? 1) !== 0) {
      return NextResponse.json(
        {
          error: "Invalid or unverified Apple receipt",
          appleStatus: receiptRes.status ?? null,
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const latestInfo = Array.isArray(receiptRes.latest_receipt_info)
      ? receiptRes.latest_receipt_info
      : [];
    const inAppInfo = Array.isArray(receiptRes.receipt?.in_app)
      ? receiptRes.receipt?.in_app ?? []
      : [];
    const candidateRecords = latestInfo.length > 0 ? latestInfo : inAppInfo;
    if (!Array.isArray(candidateRecords) || candidateRecords.length === 0) {
      return NextResponse.json(
        {
          error: "Receipt missing transaction records",
          appleStatus: receiptRes.status ?? null,
          appleEnvironment: receiptRes.environment ?? null,
        },
        { status: 400 }
      );
    }

    const requestedProductId = subscriptionId.trim();
    const byExpiryDesc = (a: AppleReceiptRecord, b: AppleReceiptRecord) => {
      const ea = parseMsDate(a?.expires_date_ms)?.getTime() ?? 0;
      const eb = parseMsDate(b?.expires_date_ms)?.getTime() ?? 0;
      return eb - ea;
    };

    const recordsForRequestedProduct = candidateRecords.filter(
      (r) => typeof r.product_id === "string" && r.product_id === requestedProductId
    );

    const isRecordCurrentlyActive = (r: AppleReceiptRecord): boolean => {
      const status = mapAppleReceiptStatusToSubscriptionStatus({
        now,
        expiresDate: parseMsDate(r?.expires_date_ms),
        cancellationDate: parseMsDate(r?.cancellation_date_ms),
      });
      return status === "active";
    };

    let record: AppleReceiptRecord;
    if (recordsForRequestedProduct.length > 0) {
      record = [...recordsForRequestedProduct].sort(byExpiryDesc)[0] ?? {};
    } else {
      const otherActive = candidateRecords.filter(
        (r) =>
          typeof r.product_id === "string" &&
          r.product_id !== requestedProductId &&
          isRecordCurrentlyActive(r)
      );
      if (otherActive.length > 0) {
        const otherPid =
          typeof otherActive[0].product_id === "string"
            ? otherActive[0].product_id
            : "another plan";
        return NextResponse.json(
          {
            error:
              "This Apple ID already has an active subscription for a different plan in this app. Switch plans in iPhone Settings → Apple ID → Subscriptions, then try again or use Restore purchase.",
            code: "receipt_product_mismatch",
            active_product_id: otherPid,
            requested_product_id: requestedProductId,
          },
          { status: 422 }
        );
      }
      const sorted = [...candidateRecords].sort(byExpiryDesc);
      record = sorted[0] ?? {};
    }

    const productIdFromReceipt =
      typeof record.product_id === "string" ? record.product_id : subscriptionId;

    const expiresDate = parseMsDate(record.expires_date_ms);
    const cancellationDate = parseMsDate(record.cancellation_date_ms);
    const subscriptionStatus = mapAppleReceiptStatusToSubscriptionStatus({
      now,
      expiresDate,
      cancellationDate,
    });

    const inferredPlan = inferPlanFromProductId(productIdFromReceipt);
    const originalTransactionId =
      typeof record.original_transaction_id === "string"
        ? record.original_transaction_id
        : null;
    const transactionId =
      typeof record.transaction_id === "string"
        ? record.transaction_id
        : null;
    const externalSubscriptionId =
      originalTransactionId ||
      transactionId ||
      subscriptionId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Ownership guard: do not allow one Apple subscription to silently activate
    // a different Wisewave account. Prefer original_transaction_id for stability.
    const ownershipKey = originalTransactionId || transactionId;
    if (ownershipKey) {
      const existingOwner = await prisma.subscription.findFirst({
        where: {
          platform: "app_store",
          externalSubscriptionId: ownershipKey,
          userId: { not: user.id },
        },
        orderBy: { updatedAt: "desc" },
      });
      if (existingOwner) {
        return NextResponse.json(
          {
            error: "This Apple subscription is already linked to another Wisewave account.",
            code: "subscription_account_mismatch",
          },
          { status: 409 }
        );
      }
    }

    const data = {
      status: subscriptionStatus,
      plan: inferredPlan,
      platform: "app_store" as const,
      currentPeriodStart: now,
      currentPeriodEnd: expiresDate,
      externalSubscriptionId,
    };

    if (user.subscriptions[0]) {
      await prisma.subscription.update({
        where: { id: user.subscriptions[0].id },
        data,
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          ...data,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Apple receipt verified and synced.",
      plan: inferredPlan,
      subscriptionState: receiptRes.status ?? null,
      currentPeriodEnd: expiresDate,
      platform: "app_store",
    });
  } catch (error) {
    console.error("[app/api/subscription/verify-ios] unexpected error", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
