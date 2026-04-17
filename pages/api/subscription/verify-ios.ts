import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";

type VerifyReceiptBody = {
  "receipt-data": string;
  password: string;
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
  // Sandbox / production response may include additional fields.
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
  sharedSecret: string;
  isSandboxAttempt?: boolean;
}): Promise<AppleReceiptResponse> {
  const { receiptData, sharedSecret, isSandboxAttempt } = params;
  const verifyUrl = isSandboxAttempt
    ? "https://sandbox.itunes.apple.com/verifyReceipt"
    : "https://buy.itunes.apple.com/verifyReceipt";

  const payload: VerifyReceiptBody = {
    "receipt-data": receiptData,
    password: sharedSecret,
    "exclude-old-transactions": true,
  };

  const res = await fetch(verifyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Apple returns 200 even for invalid receipts; status code is inside JSON.
  const json = (await res.json().catch(() => ({}))) as AppleReceiptResponse;
  return json;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization ?? "";
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (!token) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const userId = verifyUserToken(token);
    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { receiptData, subscriptionId, bundleId } = (req.body ?? {}) as {
      receiptData?: string;
      subscriptionId?: string;
      bundleId?: string;
    };

    if (!receiptData || typeof receiptData !== "string") {
      return res.status(400).json({ error: "receiptData is required" });
    }
    if (!subscriptionId || typeof subscriptionId !== "string") {
      return res.status(400).json({ error: "subscriptionId is required" });
    }

    const sharedSecret = process.env.APPLE_SHARED_SECRET;
    if (!sharedSecret) {
      return res.status(501).json({
        error: "Apple receipt verification not configured",
        message: "Set APPLE_SHARED_SECRET in Vercel. (Receipt verification endpoint requires it.)",
      });
    }

    const bundle = (bundleId as string | undefined) ?? process.env.APPLE_BUNDLE_ID;
    if (bundle && typeof bundle === "string" && bundle.trim().length > 0) {
      // We don't strictly validate bundleId here because Apple receipt payloads can vary,
      // but we keep the field wired for future tighter checks.
    }

    // Apple flow:
    // - Try production verifyReceipt first
    // - If status=21007 => sandbox receipt, retry sandbox endpoint
    const productionRes = await verifyAppleReceipt({
      receiptData,
      sharedSecret,
      isSandboxAttempt: false,
    });

    const status = productionRes.status ?? null;
    let receiptRes: AppleReceiptResponse = productionRes;

    if (status === 21007) {
      receiptRes = await verifyAppleReceipt({
        receiptData,
        sharedSecret,
        isSandboxAttempt: true,
      });
    }

    if ((receiptRes.status ?? 1) !== 0) {
      return res.status(400).json({
        error: "Invalid or unverified Apple receipt",
        appleStatus: receiptRes.status ?? null,
      });
    }

    const now = new Date();
    const latestInfo = Array.isArray(receiptRes.latest_receipt_info)
      ? receiptRes.latest_receipt_info
      : [];
    const inAppInfo = Array.isArray(receiptRes.receipt?.in_app)
      ? receiptRes.receipt?.in_app ?? []
      : [];
    const candidateRecords =
      latestInfo.length > 0
        ? latestInfo
        : inAppInfo;
    if (!Array.isArray(candidateRecords) || candidateRecords.length === 0) {
      return res.status(400).json({
        error: "Receipt missing transaction records",
        appleStatus: receiptRes.status ?? null,
        appleEnvironment: receiptRes.environment ?? null,
      });
    }

    // Pick the latest by expires_date_ms (most recent renewal).
    const sorted = [...candidateRecords].sort((a, b) => {
      const ea = parseMsDate(a?.expires_date_ms)?.getTime() ?? 0;
      const eb = parseMsDate(b?.expires_date_ms)?.getTime() ?? 0;
      return eb - ea;
    });
    const record = sorted[0] ?? {};

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
    const externalSubscriptionId =
      (typeof record.original_transaction_id === "string" && record.original_transaction_id) ||
      (typeof record.transaction_id === "string" && record.transaction_id) ||
      subscriptionId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!user) return res.status(401).json({ error: "User not found" });

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

    return res.status(200).json({
      success: true,
      message: "Apple receipt verified and synced.",
      plan: inferredPlan,
      subscriptionState: receiptRes.status ?? null,
      currentPeriodEnd: expiresDate,
      platform: "app_store",
    });
  } catch (error) {
    console.error("[verify-ios] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

