import * as RNIap from "react-native-iap";
import {
  getIosReceiptWithRetry,
  iosPurchaseTransactionIds,
  logIosPurchaseDiagnostics,
  matchesProductId,
  normalizeRequestPurchaseResult,
} from "./ios-receipt";

export const VERIFY_IOS_RECEIPT_DATA_REQUIRED = "receipt_data_required";
export const VERIFY_IOS_RECEIPT_UNAVAILABLE = "receipt_unavailable";

type VerifyIosJson = Record<string, unknown>;

/**
 * Reads transaction IDs from the purchase object, then from `getAvailablePurchases()`
 * for the same SKU when the resolved purchase omits IDs (common StoreKit / RN-IAP lag).
 */
export async function resolveIosPurchaseTransactionIds(
  productId: string,
  purchase: unknown
): Promise<{ transactionId: string | null; originalTransactionId: string | null }> {
  let ids = iosPurchaseTransactionIds(purchase);
  if (ids.transactionId || ids.originalTransactionId) {
    return ids;
  }
  try {
    const available = await RNIap.getAvailablePurchases();
    const match = available.find((p: unknown) => matchesProductId(p, productId));
    if (match) {
      ids = iosPurchaseTransactionIds(match);
    }
  } catch (e) {
    console.warn("[WisewaveIapPurchase] getAvailablePurchases id fallback failed", e);
  }
  return ids;
}

/**
 * Calls `/api/subscription/verify-ios` with Apple Server API first when transaction
 * IDs exist (no receipt on the wire), then loads receipt only if the server returns
 * `receipt_data_required`. Avoids eager `getReceiptIOS()` on the primary purchase path.
 */
export async function verifyIosSubscriptionServerFirst(options: {
  apiBaseUrl: string;
  token: string;
  productId: string;
  bundleId: string;
  purchase: unknown;
}): Promise<{ res: Response; json: VerifyIosJson }> {
  const { apiBaseUrl, token, productId, bundleId } = options;
  const purchase =
    normalizeRequestPurchaseResult(options.purchase) ?? options.purchase;
  const ids = await resolveIosPurchaseTransactionIds(productId, purchase);
  if (!ids.transactionId && !ids.originalTransactionId) {
    logIosPurchaseDiagnostics(productId, purchase, ids);
  }

  const post = async (body: Record<string, unknown>) => {
    const res = await fetch(`${apiBaseUrl}/api/subscription/verify-ios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as VerifyIosJson;
    return { res, json };
  };

  const base: Record<string, unknown> = {
    subscriptionId: productId,
    bundleId,
    transactionId: ids.transactionId,
    originalTransactionId: ids.originalTransactionId,
  };

  if (ids.transactionId || ids.originalTransactionId) {
    let { res, json } = await post(base);
    if (!res.ok && json.code === VERIFY_IOS_RECEIPT_DATA_REQUIRED) {
      const receiptData = await getIosReceiptWithRetry(productId, purchase);
      if (receiptData) {
        ({ res, json } = await post({ ...base, receiptData }));
      } else {
        return {
          res: new Response(JSON.stringify({}), { status: 400 }),
          json: {
            error:
              "Could not load an app receipt for backup verification. Wait a moment and try again, or use Restore purchase.",
            code: VERIFY_IOS_RECEIPT_UNAVAILABLE,
          },
        };
      }
    }
    return { res, json };
  }

  const receiptData = await getIosReceiptWithRetry(productId, purchase);
  if (!receiptData) {
    return {
      res: new Response(JSON.stringify({}), { status: 400 }),
      json: {
        error:
          "The App Store has not returned transaction details or a refreshable receipt yet (common right after purchase in TestFlight). Wait a few seconds and try again, or tap Restore purchase.",
        code: VERIFY_IOS_RECEIPT_UNAVAILABLE,
      },
    };
  }
  return post({ ...base, receiptData });
}
