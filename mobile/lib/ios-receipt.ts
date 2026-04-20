import * as RNIap from "react-native-iap";

export const IOS_RECEIPT_RETRY_DELAYS_MS = [0, 700, 1200, 1800, 2500];

export type IapPurchaseLike = {
  productId?: string;
  id?: string;
  sku?: string;
  transactionReceipt?: string;
  receipt?: string;
  originalTransactionReceipt?: string;
  purchaseToken?: string;
  transactionDate?: number | string;
  purchaseTime?: number | string;
  subscriptionOfferDetailsAndroid?: unknown;
  subscriptionOfferDetails?: unknown;
};

/** Nitro / native purchase objects may throw on missing keys; never assume plain JS objects. */
function readPurchaseField(o: Record<string, unknown>, key: string): unknown {
  try {
    return Reflect.get(o, key);
  } catch {
    return undefined;
  }
}

function receiptStringsFromPurchase(p: unknown): {
  transactionReceipt?: string;
  receipt?: string;
  originalTransactionReceipt?: string;
} {
  if (!p || typeof p !== "object") return {};
  const o = p as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : undefined);
  return {
    transactionReceipt: str(readPurchaseField(o, "transactionReceipt")),
    receipt: str(readPurchaseField(o, "receipt")),
    originalTransactionReceipt: str(readPurchaseField(o, "originalTransactionReceipt")),
  };
}

export function productIdOf(p: unknown): string {
  if (!p || typeof p !== "object") return "";
  const o = p as Record<string, unknown>;
  return String(
    readPurchaseField(o, "productId") ??
      readPurchaseField(o, "id") ??
      readPurchaseField(o, "sku") ??
      ""
  );
}

export function matchesProductId(p: unknown, productId: string): boolean {
  return productIdOf(p) === productId;
}

function asAppleIdString(v: unknown): string | null {
  if (typeof v === "string" && v.trim().length > 0) return v.trim();
  if (typeof v === "number" && Number.isFinite(v)) return String(Math.trunc(v));
  return null;
}

function decodeB64UrlJsonSegment(segment: string): unknown {
  try {
    const b64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    if (typeof Buffer !== "undefined") {
      return JSON.parse(Buffer.from(padded, "base64").toString("utf8")) as unknown;
    }
    if (typeof globalThis.atob === "function") {
      const bin = globalThis.atob(padded);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i) & 0xff;
      const text = new TextDecoder("utf-8").decode(bytes);
      return JSON.parse(text) as unknown;
    }
  } catch {
    return null;
  }
  return null;
}

/** True when string looks like a compact JWS (StoreKit 2 transaction / OpenIAP), not a raw receipt blob. */
function looksLikeCompactJws(s: string): boolean {
  const parts = s.split(".");
  if (parts.length < 3) return false;
  const head = decodeB64UrlJsonSegment(parts[0]);
  return (
    head != null &&
    typeof head === "object" &&
    head !== null &&
    ("alg" in (head as Record<string, unknown>) || "typ" in (head as Record<string, unknown>))
  );
}

function extractIdsFromTransactionJws(jws: string): {
  transactionId: string | null;
  originalTransactionId: string | null;
} {
  if (!looksLikeCompactJws(jws)) {
    return { transactionId: null, originalTransactionId: null };
  }
  const parts = jws.split(".");
  const payload = decodeB64UrlJsonSegment(parts[1]);
  if (!payload || typeof payload !== "object") {
    return { transactionId: null, originalTransactionId: null };
  }
  const p = payload as Record<string, unknown>;
  return {
    transactionId: asAppleIdString(p.transactionId),
    originalTransactionId: asAppleIdString(p.originalTransactionId),
  };
}

function collectPurchaseRecordBlobs(o: Record<string, unknown>): string[] {
  const keys = [
    "jwsRepresentation",
    "jwsRepresentationIOS",
    "verificationResultIOS",
    "signedTransactionInfo",
    "deviceVerification",
    "appTransactionId",
  ] as const;
  const out: string[] = [];
  for (const k of keys) {
    const v = readPurchaseField(o, k);
    if (typeof v === "string" && v.length > 0) out.push(v);
  }
  return out;
}

function purchaseObjectLayers(purchase: unknown): Record<string, unknown>[] {
  const layers: Record<string, unknown>[] = [];
  if (!purchase || typeof purchase !== "object") return layers;
  const root = purchase as Record<string, unknown>;
  layers.push(root);
  const nested = ["native", "ios", "transaction", "purchase"] as const;
  for (const k of nested) {
    const v = readPurchaseField(root, k);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      layers.push(v as Record<string, unknown>);
    }
  }
  return layers;
}

/**
 * `requestPurchase` may resolve to a bare `Purchase`, `{ purchase: Purchase }`, or `[Purchase]`.
 * Always pass the inner purchase to `finishTransaction` / verify helpers.
 */
export function normalizeRequestPurchaseResult(result: unknown): unknown {
  if (result == null) return result;
  if (Array.isArray(result)) {
    return result.length > 0 ? normalizeRequestPurchaseResult(result[0]) : null;
  }
  if (typeof result !== "object") return result;
  const o = result as Record<string, unknown>;
  const innerPurchase = readPurchaseField(o, "purchase");
  if (innerPurchase != null && typeof innerPurchase === "object") {
    return innerPurchase;
  }
  const innerTx = readPurchaseField(o, "transaction");
  if (innerTx != null && typeof innerTx === "object") {
    return innerTx;
  }
  return result;
}

/**
 * Best-effort IDs for App Store Server API. Field names differ across react-native-iap /
 * Nitro / StoreKit 2; some builds nest under `native` or put signed payloads in `jwsRepresentation`.
 */
export function iosPurchaseTransactionIds(p: unknown): {
  transactionId: string | null;
  originalTransactionId: string | null;
} {
  let transactionId: string | null = null;
  let originalTransactionId: string | null = null;

  const tryAssign = (tx: string | null, orig: string | null) => {
    if (tx && !transactionId) transactionId = tx;
    if (orig && !originalTransactionId) originalTransactionId = orig;
  };

  for (const layer of purchaseObjectLayers(purchase)) {
    tryAssign(
      asAppleIdString(readPurchaseField(layer, "transactionId")) ??
        asAppleIdString(readPurchaseField(layer, "transactionIdentifierIOS")) ??
        asAppleIdString(readPurchaseField(layer, "transactionIdentifier")) ??
        asAppleIdString(readPurchaseField(layer, "transactionIdentifierStringIOS")),
      asAppleIdString(readPurchaseField(layer, "originalTransactionIdentifierIOS")) ??
        asAppleIdString(readPurchaseField(layer, "originalTransactionIdIOS")) ??
        asAppleIdString(readPurchaseField(layer, "originalTransactionId")) ??
        asAppleIdString(readPurchaseField(layer, "originalTransactionIdentifier"))
    );

    for (const blob of collectPurchaseRecordBlobs(layer)) {
      const fromJws = extractIdsFromTransactionJws(blob);
      tryAssign(fromJws.transactionId, fromJws.originalTransactionId);
    }

    if (transactionId && originalTransactionId) break;
  }

  return { transactionId, originalTransactionId };
}

/**
 * Logs when transaction IDs could not be read (TestFlight / Xcode console).
 * Does not print receipt or JWS bodies.
 */
export function logIosPurchaseDiagnostics(
  productId: string,
  purchase: unknown,
  ids: { transactionId: string | null; originalTransactionId: string | null }
): void {
  if (ids.transactionId || ids.originalTransactionId) return;
  if (!purchase || typeof purchase !== "object") {
    console.warn("[WisewaveIapPurchase] missing_tx_ids", { productId, purchaseType: typeof purchase });
    return;
  }
  const o = purchase as Record<string, unknown>;
  let keys: string[] = [];
  try {
    keys = Object.keys(o).sort();
  } catch {
    keys = ["<Object.keys threw; likely native purchase host object>"];
  }
  const types: Record<string, string> = {};
  for (const k of keys) {
    try {
      const v = readPurchaseField(o, k);
      types[k] =
        v === null ? "null" : Array.isArray(v) ? "array" : typeof v === "object" ? "object" : typeof v;
    } catch {
      types[k] = "<read threw>";
    }
  }
  console.warn("[WisewaveIapPurchase] missing_tx_ids", { productId, keys, types });
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getIosReceiptWithRetry(
  productId: string,
  purchase: unknown
): Promise<string | undefined> {
  const direct = receiptStringsFromPurchase(purchase);
  const directReceipt =
    direct.transactionReceipt ?? direct.receipt ?? direct.originalTransactionReceipt;
  if (directReceipt) return directReceipt;

  const tryAvailablePurchasesOnce = async (): Promise<string | undefined> => {
    try {
      const available = await RNIap.getAvailablePurchases();
      const matching = available.find((p: unknown) => matchesProductId(p, productId));
      const r = receiptStringsFromPurchase(matching);
      return r.transactionReceipt ?? r.receipt ?? r.originalTransactionReceipt;
    } catch {
      return undefined;
    }
  };

  for (let i = 0; i < IOS_RECEIPT_RETRY_DELAYS_MS.length; i++) {
    const waitMs = IOS_RECEIPT_RETRY_DELAYS_MS[i];
    if (waitMs > 0) {
      await sleep(waitMs);
    }

    try {
      const receipt = await RNIap.getReceiptIOS();
      if (receipt) {
        return receipt;
      }
    } catch {
      // Keep retrying; receipt may still be propagating.
    }

    const isLast = i === IOS_RECEIPT_RETRY_DELAYS_MS.length - 1;
    if (isLast) {
      const fallback = await tryAvailablePurchasesOnce();
      if (fallback) return fallback;
    }
  }

  return undefined;
}
