import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";
import jwt from "jsonwebtoken";

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

type AppleServerApiTransactionPayload = {
  transactionId?: string;
  originalTransactionId?: string;
  productId?: string;
  expiresDate?: number;
  revocationDate?: number;
  purchaseDate?: number;
  /** Present on JWSTransactionDecodedPayload from Apple ("Sandbox" | "Production", etc.). */
  environment?: string;
};

type AppleSubscriptionStatusBody = {
  data?: Array<{
    lastTransactions?: Array<{
      signedTransactionInfo?: string;
    }>;
  }>;
};

type AppleServerApiConfig = {
  issuerId: string;
  keyId: string;
  privateKey: string;
  bundleId: string;
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

function parseAppleServerApiConfig(bundleIdFromRequest?: string): AppleServerApiConfig | null {
  const issuerId = process.env.APPLE_SERVER_API_ISSUER_ID?.trim();
  const keyId = process.env.APPLE_SERVER_API_KEY_ID?.trim();
  const privateKeyRaw = process.env.APPLE_SERVER_API_PRIVATE_KEY?.trim();
  const bundleId =
    bundleIdFromRequest?.trim() ||
    process.env.APPLE_BUNDLE_ID?.trim() ||
    process.env.APPLE_SERVER_API_BUNDLE_ID?.trim();

  if (!issuerId || !keyId || !privateKeyRaw || !bundleId) return null;
  const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
  return { issuerId, keyId, privateKey, bundleId };
}

function decodeJwtPayload<T>(jws: string): T | null {
  const parts = jws.split(".");
  if (parts.length < 2) return null;
  const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  try {
    const json = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

function createAppleServerApiToken(config: AppleServerApiConfig): string {
  const now = Math.floor(Date.now() / 1000);
  return jwt.sign(
    {
      iss: config.issuerId,
      iat: now,
      exp: now + 300,
      aud: "appstoreconnect-v1",
      bid: config.bundleId,
    },
    config.privateKey,
    { algorithm: "ES256", keyid: config.keyId }
  );
}

async function fetchAppleServerTransaction(
  transactionId: string,
  config: AppleServerApiConfig,
  useSandbox: boolean
): Promise<AppleServerApiTransactionPayload | null> {
  const host = useSandbox
    ? "https://api.storekit-sandbox.itunes.apple.com"
    : "https://api.storekit.itunes.apple.com";
  const token = createAppleServerApiToken(config);
  const res = await fetch(`${host}/inApps/v1/transactions/${encodeURIComponent(transactionId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) return null;
  const json = (await res.json().catch(() => ({}))) as {
    signedTransactionInfo?: string;
  };
  if (!json.signedTransactionInfo) return null;
  return decodeJwtPayload<AppleServerApiTransactionPayload>(json.signedTransactionInfo);
}

/**
 * Subscription status (renewals, grace, family groups): lists signed JWS payloads per group.
 * See Apple App Store Server API — Get All Subscription Statuses.
 */
async function fetchAppleSubscriptionTransactionPayloads(
  originalTransactionId: string,
  config: AppleServerApiConfig,
  useSandbox: boolean
): Promise<AppleServerApiTransactionPayload[]> {
  const host = useSandbox
    ? "https://api.storekit-sandbox.itunes.apple.com"
    : "https://api.storekit.itunes.apple.com";
  const token = createAppleServerApiToken(config);
  const res = await fetch(
    `${host}/inApps/v1/subscriptions/${encodeURIComponent(originalTransactionId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) return [];
  const body = (await res.json().catch(() => ({}))) as AppleSubscriptionStatusBody;
  const out: AppleServerApiTransactionPayload[] = [];
  for (const group of body.data ?? []) {
    const rows = Array.isArray(group.lastTransactions) ? group.lastTransactions : [];
    for (const lt of rows) {
      if (!lt?.signedTransactionInfo) continue;
      const p = decodeJwtPayload<AppleServerApiTransactionPayload>(lt.signedTransactionInfo);
      if (p?.productId) out.push(p);
    }
  }
  return out;
}

function pickLatestPayloadForProduct(
  payloads: AppleServerApiTransactionPayload[],
  subscriptionProductId: string
): AppleServerApiTransactionPayload | null {
  const want = subscriptionProductId.trim();
  const matching = payloads.filter((p) => p.productId === want);
  if (matching.length === 0) return null;
  matching.sort((a, b) => (b.expiresDate ?? 0) - (a.expiresDate ?? 0));
  return matching[0] ?? null;
}

function applePayloadEnvironment(
  payload: AppleServerApiTransactionPayload,
  usedSandboxHost: boolean
): "sandbox" | "production" {
  const env = String(payload.environment ?? "").toLowerCase();
  if (env.includes("sandbox")) return "sandbox";
  if (env.includes("production")) return "production";
  return usedSandboxHost ? "sandbox" : "production";
}

async function verifyWithAppleServerApi(params: {
  transactionId?: string | null;
  originalTransactionId?: string | null;
  subscriptionId: string;
  bundleId?: string;
}): Promise<
  | {
      ok: true;
      record: AppleReceiptRecord;
      environment: "sandbox" | "production";
      source: "apple_server_api";
    }
  | { ok: false; reason: string }
> {
  const transactionId = params.transactionId?.trim() ?? "";
  const originalTransactionId = params.originalTransactionId?.trim() ?? "";
  if (!transactionId && !originalTransactionId) {
    return { ok: false, reason: "missing_transaction_id" };
  }
  const subscriptionProductId = params.subscriptionId.trim();
  const config = parseAppleServerApiConfig(params.bundleId);
  if (!config) return { ok: false, reason: "server_api_not_configured" };

  const tryTransactionIds = Array.from(
    new Set([transactionId, originalTransactionId].filter((id) => id.length > 0))
  );

  let payload: AppleServerApiTransactionPayload | null = null;
  let environment: "sandbox" | "production" = "production";

  for (const id of tryTransactionIds) {
    const p = await fetchAppleServerTransaction(id, config, false);
    if (p?.productId === subscriptionProductId) {
      payload = p;
      environment = applePayloadEnvironment(p, false);
      break;
    }
  }
  if (!payload) {
    for (const id of tryTransactionIds) {
      const p = await fetchAppleServerTransaction(id, config, true);
      if (p?.productId === subscriptionProductId) {
        payload = p;
        environment = applePayloadEnvironment(p, true);
        break;
      }
    }
  }

  if (!payload && originalTransactionId) {
    const prodPayloads = await fetchAppleSubscriptionTransactionPayloads(
      originalTransactionId,
      config,
      false
    );
    const picked = pickLatestPayloadForProduct(prodPayloads, subscriptionProductId);
    if (picked) {
      payload = picked;
      environment = applePayloadEnvironment(picked, false);
    }
  }
  if (!payload && originalTransactionId) {
    const sandPayloads = await fetchAppleSubscriptionTransactionPayloads(
      originalTransactionId,
      config,
      true
    );
    const picked = pickLatestPayloadForProduct(sandPayloads, subscriptionProductId);
    if (picked) {
      payload = picked;
      environment = applePayloadEnvironment(picked, true);
    }
  }

  if (!payload?.productId) {
    return { ok: false, reason: "transaction_not_found" };
  }

  const fallbackTxKey = transactionId || originalTransactionId;
  const record: AppleReceiptRecord = {
    product_id: payload.productId,
    transaction_id: payload.transactionId ?? fallbackTxKey,
    original_transaction_id:
      payload.originalTransactionId ?? originalTransactionId ?? fallbackTxKey,
    expires_date_ms:
      typeof payload.expiresDate === "number" ? String(payload.expiresDate) : undefined,
    cancellation_date_ms:
      typeof payload.revocationDate === "number"
        ? String(payload.revocationDate)
        : undefined,
    purchase_date_ms:
      typeof payload.purchaseDate === "number" ? String(payload.purchaseDate) : undefined,
  };
  return { ok: true, record, environment, source: "apple_server_api" };
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
      transactionId?: string | null;
      originalTransactionId?: string | null;
    };
    const { receiptData, subscriptionId, bundleId, transactionId, originalTransactionId } =
      body;

    if (!receiptData || typeof receiptData !== "string") {
      return NextResponse.json({ error: "receiptData is required" }, { status: 400 });
    }
    if (!subscriptionId || typeof subscriptionId !== "string") {
      return NextResponse.json({ error: "subscriptionId is required" }, { status: 400 });
    }

    const bundle = (bundleId as string | undefined) ?? process.env.APPLE_BUNDLE_ID;
    if (bundle && typeof bundle === "string" && bundle.trim().length > 0) {
      // Bundle field kept for future stricter validation.
    }

    let verificationSource: "receipt_verify" | "apple_server_api" = "receipt_verify";
    let appleEnvironment: string | null = null;
    let candidateRecords: AppleReceiptRecord[] = [];
    const serverApiResult = await verifyWithAppleServerApi({
      transactionId,
      originalTransactionId,
      subscriptionId,
      bundleId: bundle,
    });
    if (serverApiResult.ok) {
      verificationSource = "apple_server_api";
      appleEnvironment = serverApiResult.environment;
      candidateRecords = [serverApiResult.record];
    } else {
      const sharedSecrets = getAppleSharedSecrets();
      if (sharedSecrets.length === 0) {
        return NextResponse.json(
          {
            error: "Apple verification not configured",
            message:
              "Set APPLE_SERVER_API_ISSUER_ID/KEY_ID/PRIVATE_KEY for Apple Server API, or APPLE_SHARED_SECRET for legacy receipt verification.",
          },
          { status: 501 }
        );
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
            serverApiReason: serverApiResult.reason,
          },
          { status: 400 }
        );
      }

      appleEnvironment = receiptRes.environment ?? null;
      const latestInfo = Array.isArray(receiptRes.latest_receipt_info)
        ? receiptRes.latest_receipt_info
        : [];
      const inAppInfo = Array.isArray(receiptRes.receipt?.in_app)
        ? receiptRes.receipt?.in_app ?? []
        : [];
      candidateRecords = latestInfo.length > 0 ? latestInfo : inAppInfo;
      if (!Array.isArray(candidateRecords) || candidateRecords.length === 0) {
        return NextResponse.json(
          {
            error: "Receipt missing transaction records",
            appleEnvironment,
          },
          { status: 400 }
        );
      }
    }

    const now = new Date();
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
    const originalTransactionIdFromRecord =
      typeof record.original_transaction_id === "string"
        ? record.original_transaction_id
        : null;
    const transactionIdFromRecord =
      typeof record.transaction_id === "string"
        ? record.transaction_id
        : null;
    const externalSubscriptionId =
      originalTransactionIdFromRecord ||
      transactionIdFromRecord ||
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
    const ownershipKey = originalTransactionIdFromRecord || transactionIdFromRecord;
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
      message:
        verificationSource === "apple_server_api"
          ? "Apple Server API transaction verified and synced."
          : "Apple receipt verified and synced.",
      plan: inferredPlan,
      subscriptionState: verificationSource === "apple_server_api" ? "server_api_ok" : "receipt_ok",
      currentPeriodEnd: expiresDate,
      platform: "app_store",
      verificationSource,
      appleEnvironment,
    });
  } catch (error) {
    console.error("[app/api/subscription/verify-ios] unexpected error", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
