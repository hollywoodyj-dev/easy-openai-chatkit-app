import { Alert, Platform } from "react-native";
import * as RNIap from "react-native-iap";
import type { ActiveSubscription } from "react-native-iap";
import { matchesProductId, productIdOf, type IapPurchaseLike } from "./ios-receipt";
import { verifyIosSubscriptionServerFirst } from "./verify-ios-subscription";
import {
  ENABLE_IOS_RECEIPT_VERIFY,
  IOS_RECEIPT_VERIFY_DISABLED_MESSAGE,
} from "./ios-subscription-flags";

type FinishTransactionPurchase = Parameters<typeof RNIap.finishTransaction>[0]["purchase"];

function formatVerifyIosFailureMessage(res: Response, json: Record<string, unknown>): string {
  const serverError =
    (typeof json.error === "string" && json.error) ||
    (typeof json.message === "string" && json.message) ||
    "";
  const appleStatus =
    typeof json.appleStatus === "number" ? ` (apple status ${json.appleStatus})` : "";
  if (res.status === 409 && json.code === "subscription_account_mismatch") {
    const base =
      serverError ||
      "This Apple subscription is already linked to another Wisewave account.";
    return `${base}\n\nAsk your steward to open the admin page, use Clear ref on Wisewave rows that should not own this Apple subscription, then try Sync again.`;
  }
  return serverError
    ? `${serverError}${appleStatus}`
    : `Could not verify subscription with the server (HTTP ${res.status}).`;
}

function planLabelFromProductId(productId: string): string {
  const p = productId.toLowerCase();
  return p.includes("year") ? "Yearly" : "Monthly";
}

function formatExpirationMs(ms: number | null | undefined): string {
  if (ms == null || !Number.isFinite(ms)) return "Unknown";
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return "Unknown";
  }
}

/**
 * Opens the platform subscription management UI (App Store “Subscriptions” on iOS,
 * Play Store subscription center on Android when package/sku are provided).
 */
export async function openStoreSubscriptionManagement(options?: {
  androidPackageName?: string;
  androidSku?: string;
}): Promise<void> {
  if (Platform.OS === "android") {
    await RNIap.deepLinkToSubscriptions({
      packageNameAndroid: options?.androidPackageName,
      skuAndroid: options?.androidSku,
    });
    return;
  }
  if (Platform.OS === "ios") {
    try {
      await RNIap.deepLinkToSubscriptions();
    } catch (e) {
      console.warn("[openStoreSubscriptionManagement] deepLinkToSubscriptions failed", e);
    }
  }
}

/**
 * Active Wisewave subscription rows for this store account (Apple ID / Play account),
 * as reported by the store SDK (not Wisewave’s database).
 *
 * **Diagnostic only:** `getActiveSubscriptions` can lag or disagree with Settings →
 * Apple ID → Subscriptions after purchase or in sandbox/TestFlight. Do not treat an
 * empty list as proof that Apple has no active sub.
 */
export async function fetchStoreAccountSubscriptionSnapshot(
  subscriptionProductIds: readonly string[]
): Promise<ActiveSubscription[]> {
  const ids = [...subscriptionProductIds].filter((id) => id.length > 0);
  if (ids.length === 0) return [];
  return RNIap.getActiveSubscriptions(ids);
}

export function formatStoreAccountSnapshotForAlert(subs: ActiveSubscription[]): string {
  if (!subs.length) {
    return (
      "The in-app store snapshot did not list an active Wisewave subscription for these product IDs.\n\n" +
      "That can be wrong right after purchase or in TestFlight (SDK lag). If **Settings → Apple ID → Subscriptions** shows Wisewave as active, trust that over this screen.\n\n" +
      "If your plan ended, use Subscribe with Apple again or Manage subscriptions in Settings. After Apple shows active, use **Sync Wisewave** to update our servers."
    );
  }
  return subs
    .map((s) => {
      const renew =
        s.renewalInfoIOS?.willAutoRenew === true
          ? "Auto-renew on"
          : s.renewalInfoIOS?.willAutoRenew === false
            ? "Auto-renew off (access may continue until expiry)"
            : "Renewal: unknown";
      const pending = s.renewalInfoIOS?.pendingUpgradeProductId
        ? `\nPending change: ${s.renewalInfoIOS.pendingUpgradeProductId}`
        : "";
      return (
        `Plan: ${planLabelFromProductId(s.productId)}\n` +
        `Product ID: ${s.productId}\n` +
        `Store status: ${s.isActive ? "Active" : "Not active"}\n` +
        `Period end / expiry: ${formatExpirationMs(s.expirationDateIOS ?? null)}\n` +
        `${renew}${pending}`
      );
    })
    .join("\n\n—\n\n");
}

function pickProductIdForReceiptSync(
  subs: ActiveSubscription[],
  monthlyId: string,
  yearlyId: string
): string {
  const active = subs.filter((s) => s.isActive);
  const pool = active.length > 0 ? active : subs;
  const preferred = pool[0];
  if (preferred?.productId) return preferred.productId;
  return monthlyId;
}

async function syncWisewaveUsingStoreSnapshot(
  token: string,
  o: {
    apiBaseUrl: string;
    bundleId: string;
    monthlyProductId: string;
    yearlyProductId: string;
  }
): Promise<{ ok: true } | { ok: false; message: string }> {
  const ids = [o.monthlyProductId, o.yearlyProductId] as const;
  let subs: ActiveSubscription[] = [];
  try {
    subs = await fetchStoreAccountSubscriptionSnapshot(ids);
  } catch {
    subs = [];
  }
  const preferred = pickProductIdForReceiptSync(subs, o.monthlyProductId, o.yearlyProductId);
  return syncWisewaveSubscriptionFromIosReceipt({
    token,
    apiBaseUrl: o.apiBaseUrl,
    bundleId: o.bundleId,
    monthlyProductId: o.monthlyProductId,
    yearlyProductId: o.yearlyProductId,
    preferredProductId: preferred,
  });
}

/**
 * Refreshes Wisewave’s subscription row from the App Store receipt for this Apple ID
 * (same server contract as “Restore purchase”).
 */
export async function syncWisewaveSubscriptionFromIosReceipt(options: {
  token: string;
  apiBaseUrl: string;
  bundleId: string;
  monthlyProductId: string;
  yearlyProductId: string;
  /** When set, prefer this SKU for receipt verification if it appears in available purchases. */
  preferredProductId?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const { token, apiBaseUrl, bundleId, monthlyProductId, yearlyProductId, preferredProductId } =
    options;
  const activeIds = new Set<string>([monthlyProductId, yearlyProductId]);

  const available = await RNIap.getAvailablePurchases();
  if (!Array.isArray(available) || available.length === 0) {
    return {
      ok: false,
      message: "No App Store purchases were returned for this Apple ID. Nothing to sync.",
    };
  }

  const matching = available.filter((p: unknown) => activeIds.has(productIdOf(p)));
  const candidates = matching.length > 0 ? matching : available;
  const sorted = [...candidates].sort((a: unknown, b: unknown) => {
    const pa = a as IapPurchaseLike;
    const pb = b as IapPurchaseLike;
    const ta = Number(pa.transactionDate ?? pa.purchaseTime ?? 0);
    const tb = Number(pb.transactionDate ?? pb.purchaseTime ?? 0);
    return tb - ta;
  });

  let latestPurchase = sorted[0];
  let productId = productIdOf(latestPurchase) || monthlyProductId;

  if (
    preferredProductId &&
    activeIds.has(preferredProductId) &&
    sorted.some((p) => matchesProductId(p, preferredProductId))
  ) {
    const match = sorted.find((p) => matchesProductId(p, preferredProductId));
    if (match) {
      latestPurchase = match;
      productId = preferredProductId;
    }
  }

  const { res, json } = await verifyIosSubscriptionServerFirst({
    apiBaseUrl,
    token,
    productId,
    bundleId,
    purchase: latestPurchase,
  });

  if (!res.ok) {
    return { ok: false, message: formatVerifyIosFailureMessage(res, json) };
  }

  try {
    await RNIap.finishTransaction({
      purchase: latestPurchase as FinishTransactionPurchase,
      isConsumable: false,
    });
  } catch {
    // Ignore if already finished.
  }

  return { ok: true };
}

export type AppleSubscriptionAccountHubOptions = {
  token: string | null;
  apiBaseUrl: string;
  bundleId: string;
  monthlyProductId: string;
  yearlyProductId: string;
  androidPackageName?: string;
  /** Called after a successful Wisewave sync (e.g. navigate to chat). */
  onWisewaveSynced?: () => void;
};

/**
 * Presents a small menu: open Apple subscription management, show store-reported
 * status for this Apple ID, or sync Wisewave’s DB from the receipt.
 */
export function presentAppleSubscriptionAccountHub(options: AppleSubscriptionAccountHubOptions): void {
  if (Platform.OS !== "ios") {
    Alert.alert("Not available", "This menu is for Apple subscriptions on iOS.");
    return;
  }
  if (!options.token) {
    Alert.alert("Sign in required", "Please sign in first.");
    return;
  }

  const token = options.token;
  const ids = [options.monthlyProductId, options.yearlyProductId] as const;

  Alert.alert(
    "Apple subscription (this Apple ID)",
    "Manage the subscription in the App Store, see what Apple reports for this device, or sync Wisewave from your receipt.",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Manage subscriptions",
        onPress: () => {
          void openStoreSubscriptionManagement();
        },
      },
      {
        text: "Show store status",
        onPress: () => {
          void (async () => {
            try {
              const subs = await fetchStoreAccountSubscriptionSnapshot(ids);
              Alert.alert("App Store (this Apple ID)", formatStoreAccountSnapshotForAlert(subs));
            } catch (e) {
              const msg =
                e instanceof Error ? e.message : "Could not read subscription status from the App Store.";
              Alert.alert("Could not load status", msg);
            }
          })();
        },
      },
      {
        text: "Sync Wisewave",
        onPress: () => {
          void (async () => {
            if (!ENABLE_IOS_RECEIPT_VERIFY) {
              Alert.alert("Sync unavailable", IOS_RECEIPT_VERIFY_DISABLED_MESSAGE);
              return;
            }
            try {
              const result = await syncWisewaveUsingStoreSnapshot(token, {
                apiBaseUrl: options.apiBaseUrl,
                bundleId: options.bundleId,
                monthlyProductId: options.monthlyProductId,
                yearlyProductId: options.yearlyProductId,
              });
              if (!result.ok) {
                Alert.alert("Sync failed", result.message);
                return;
              }
              Alert.alert("Synced", "Wisewave subscription was updated from your App Store receipt.");
              options.onWisewaveSynced?.();
            } catch (e) {
              const msg =
                e instanceof Error ? e.message : "Could not sync Wisewave from the App Store.";
              Alert.alert("Sync failed", msg);
            }
          })();
        },
      },
    ]
  );
}

/**
 * Runs all three steps in order for this Apple ID:
 * 1) Opens App Store subscription management
 * 2) Shows an alert with store-reported plan, status, and expiry
 * 3) Syncs Wisewave’s database from the receipt (same as Restore, with SKU aligned to the snapshot when possible)
 */
export async function runAppleSubscriptionAccountSequential(
  options: Omit<AppleSubscriptionAccountHubOptions, "token"> & { token: string }
): Promise<void> {
  if (Platform.OS !== "ios") {
    Alert.alert("Not available", "This flow is for Apple subscriptions on iOS.");
    return;
  }

  const ids = [options.monthlyProductId, options.yearlyProductId] as const;

  await openStoreSubscriptionManagement();

  let subs: ActiveSubscription[] = [];
  try {
    subs = await fetchStoreAccountSubscriptionSnapshot(ids);
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : "Could not read subscription status from the App Store.";
    Alert.alert("Step 2 skipped", `${msg}\n\nContinuing to sync from receipt.`);
  }

  Alert.alert("App Store (this Apple ID)", formatStoreAccountSnapshotForAlert(subs));

  if (!ENABLE_IOS_RECEIPT_VERIFY) {
    Alert.alert("Sync unavailable", IOS_RECEIPT_VERIFY_DISABLED_MESSAGE);
    return;
  }

  const result = await syncWisewaveUsingStoreSnapshot(options.token, {
    apiBaseUrl: options.apiBaseUrl,
    bundleId: options.bundleId,
    monthlyProductId: options.monthlyProductId,
    yearlyProductId: options.yearlyProductId,
  });

  if (!result.ok) {
    Alert.alert("Sync failed", result.message);
    return;
  }
  Alert.alert("Synced", "Wisewave subscription was updated from your App Store receipt.");
  options.onWisewaveSynced?.();
}

/**
 * Apple does not allow third-party apps to cancel or delete an App Store subscription
 * programmatically. This flow opens Apple’s subscription UI and offers a receipt sync
 * so Wisewave matches Apple after the user turns off auto-renew (or after expiry).
 */
export function presentAppleSubscriptionCancellationFlow(
  options: AppleSubscriptionAccountHubOptions
): void {
  if (Platform.OS !== "ios") {
    Alert.alert("Not available", "Apple subscription cancellation is managed on iOS.");
    return;
  }
  if (!options.token) {
    Alert.alert("Sign in required", "Please sign in first.");
    return;
  }

  const token = options.token;
  const base = {
    apiBaseUrl: options.apiBaseUrl,
    bundleId: options.bundleId,
    monthlyProductId: options.monthlyProductId,
    yearlyProductId: options.yearlyProductId,
  };

  Alert.alert(
    "Cancel Apple subscription",
    "Wisewave cannot turn off or remove an App Store subscription for you. Only Apple’s subscription screen can cancel auto-renew or end billing.\n\n" +
      "Turn off auto-renew there to stop future charges. You usually keep access until the current paid period ends. Refunds, if any, are handled only by Apple.\n\n" +
      "After you cancel (or when the period ends), tap Sync so Wisewave updates from your receipt.",
    [
      { text: "Close", style: "cancel" },
      {
        text: "Open App Store subscriptions",
        onPress: () => {
          void openStoreSubscriptionManagement();
        },
      },
      {
        text: "Sync Wisewave from receipt",
        onPress: () => {
          void (async () => {
            if (!ENABLE_IOS_RECEIPT_VERIFY) {
              Alert.alert("Sync unavailable", IOS_RECEIPT_VERIFY_DISABLED_MESSAGE);
              return;
            }
            try {
              const result = await syncWisewaveUsingStoreSnapshot(token, base);
              if (!result.ok) {
                Alert.alert("Sync failed", result.message);
                return;
              }
              Alert.alert("Synced", "Wisewave was updated from your App Store receipt.");
              options.onWisewaveSynced?.();
            } catch (e) {
              const msg =
                e instanceof Error ? e.message : "Could not sync Wisewave from the App Store.";
              Alert.alert("Sync failed", msg);
            }
          })();
        },
      },
    ]
  );
}
