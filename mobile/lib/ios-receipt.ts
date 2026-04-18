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

function receiptStringsFromPurchase(p: unknown): {
  transactionReceipt?: string;
  receipt?: string;
  originalTransactionReceipt?: string;
} {
  if (!p || typeof p !== "object") return {};
  const o = p as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" && v.length > 0 ? v : undefined);
  return {
    transactionReceipt: str(o.transactionReceipt),
    receipt: str(o.receipt),
    originalTransactionReceipt: str(o.originalTransactionReceipt),
  };
}

export function productIdOf(p: unknown): string {
  if (!p || typeof p !== "object") return "";
  const x = p as IapPurchaseLike;
  return String(x.productId ?? x.id ?? x.sku ?? "");
}

export function matchesProductId(p: unknown, productId: string): boolean {
  return productIdOf(p) === productId;
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
