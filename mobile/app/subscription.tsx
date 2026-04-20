import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import * as RNIap from "react-native-iap";
import { API_BASE_URL } from "../config";
import {
  presentAppleSubscriptionAccountHub,
  presentAppleSubscriptionCancellationFlow,
  runAppleSubscriptionAccountSequential,
} from "../lib/apple-subscription-account";
import {
  getIosReceiptWithRetry,
  matchesProductId,
  productIdOf,
  type IapPurchaseLike,
} from "../lib/ios-receipt";
import {
  ENABLE_IOS_RECEIPT_VERIFY,
  IOS_RECEIPT_VERIFY_DISABLED_MESSAGE,
} from "../lib/ios-subscription-flags";

const MONTHLY_PRICE = 29;
const YEARLY_PRICE = 299;

const IAP_UNAVAILABLE_MSG =
  "Google Play Billing couldn't be loaded. Please ensure:\n\n" +
  "• You installed this app from the Google Play Store (internal test link)\n" +
  "• You're signed in with a tester account\n" +
  "• You have the latest app version\n\n" +
  "Try reinstalling from the internal test page if the problem persists.";

// Must match product IDs in each store console (Play vs App Store Connect).
const GOOGLE_PLAY_PRODUCT_IDS = {
  monthly: "wisewave_monthly",
  yearly: "wisewave_yearly",
} as const;

const APP_STORE_PRODUCT_IDS = {
  monthly: "wisewave_ios_monthly",
  yearly: "wisewave_ios_yearly",
} as const;

/** Shown under the title so you can confirm this JS bundle loaded (not a stale cache). Bump when verifying installs. */
const SUBSCRIPTION_SCREEN_BUILD_TAG = "9caed14 · subscribe-ui-2026-04-20-b6";

type FinishTransactionPurchase = Parameters<
  typeof RNIap.finishTransaction
>[0]["purchase"];

async function waitForSubscriptionAccessReady(
  token: string,
  timeoutMs = 12000
): Promise<boolean> {
  const started = Date.now();
  const pollDelayMs = 1200;
  while (Date.now() - started <= timeoutMs) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/auth-check`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) return true;
      if (res.status !== 402) return false;
    } catch {
      // Keep polling; transient network failures can happen right after purchase.
    }
    await new Promise((resolve) => setTimeout(resolve, pollDelayMs));
  }
  return false;
}

function formatIosVerifyFailureMessage(
  res: Response,
  json: Record<string, unknown>
): string {
  const serverError =
    (typeof json.error === "string" && json.error) ||
    (typeof json.message === "string" && json.message) ||
    "";
  const appleStatus =
    typeof json.appleStatus === "number"
      ? ` (apple status ${json.appleStatus})`
      : "";
  if (res.status === 409 && json.code === "subscription_account_mismatch") {
    const base =
      serverError ||
      "This Apple subscription is already linked to another Wisewave account.";
    return `${base}\n\nAsk your steward to open the admin page, use Clear ref on Wisewave rows that should not own this Apple subscription, then tap Restore purchase here again.`;
  }
  return serverError
    ? `${serverError}${appleStatus}`
    : `Could not verify subscription with the server (HTTP ${res.status}).`;
}

function storeSubscriptionProductId(plan: "monthly" | "yearly"): string {
  if (Platform.OS === "ios") {
    return plan === "monthly"
      ? APP_STORE_PRODUCT_IDS.monthly
      : APP_STORE_PRODUCT_IDS.yearly;
  }
  return plan === "monthly"
    ? GOOGLE_PLAY_PRODUCT_IDS.monthly
    : GOOGLE_PLAY_PRODUCT_IDS.yearly;
}

export default function SubscriptionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ plan?: string; autostart?: string }>();
  const { token } = useAuth();
  const [iapReady, setIapReady] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<"monthly" | "yearly" | "restore" | null>(null);
  const autoStartTriggeredRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        await RNIap.initConnection();
        // Clear any failed purchases from cache on Android only
        if (Platform.OS === "android") {
          const iap = RNIap as typeof RNIap & {
            flushFailedPurchasesCachedAsPendingAndroid?: () => void | Promise<void>;
          };
          void iap.flushFailedPurchasesCachedAsPendingAndroid?.();
        }
        const hasFetchProducts = typeof RNIap.fetchProducts === "function";
        const hasRequestPurchase = typeof RNIap.requestPurchase === "function";
        setIapReady(hasFetchProducts && hasRequestPurchase);
      } catch (e) {
        console.warn("IAP init error", e);
      } finally {
        // `iapReady` is the actual purchase gate.
      }
    })();

    return () => {
      RNIap.endConnection();
    };
  }, []);

  const startGooglePlaySubscription = async (plan: "monthly" | "yearly") => {
    if (!token) {
      Alert.alert("Sign in required", "Please sign in first.");
      router.replace("/login");
      return;
    }

    if (Platform.OS !== "android") {
      Alert.alert(
        "Not available",
        "Google Play subscriptions are only available on Android devices."
      );
      return;
    }

    if (!iapReady) {
      Alert.alert("Not available", IAP_UNAVAILABLE_MSG);
      return;
    }

    if (processingPlan) return;

    const productId = storeSubscriptionProductId(plan);
    setProcessingPlan(plan);

    try {
      // react-native-iap v14: use fetchProducts + requestPurchase (no getSubscriptions/requestSubscription)
      let purchase: unknown;
      if (Platform.OS === "android") {
        let subs: unknown[];
        try {
          const raw = await RNIap.fetchProducts({
            skus: [productId],
            type: "subs",
          });
          subs = Array.isArray(raw) ? raw : [];
        } catch (fetchErr) {
          const errMsg =
            fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
          console.warn("fetchProducts error", errMsg, fetchErr);
          Alert.alert(
            "Error",
            "Could not load subscription products. Please try again."
          );
          return;
        }

        const product = (subs.find((p: unknown) =>
          matchesProductId(p, productId)
        ) ?? subs[0]) as IapPurchaseLike | undefined;
        const offers =
          product?.subscriptionOfferDetailsAndroid ??
          product?.subscriptionOfferDetails ??
          [];
        const firstOffer = Array.isArray(offers) ? offers[0] : offers;
        const offerToken = firstOffer?.offerToken ?? firstOffer?.offerId;

        if (!offerToken) {
          Alert.alert(
            "Error",
            "Could not load subscription details. Install from Play Store (internal test) on a real device—emulator does not support purchases."
          );
          return;
        }

        // v14: requestPurchase is event-based; wait for purchase via listener
        purchase = await new Promise<unknown>((resolve, reject) => {
          const cleanup = () => {
            subUpdated.remove();
            subError.remove();
          };
          const subUpdated = RNIap.purchaseUpdatedListener((p) => {
            if (matchesProductId(p, productId)) {
              cleanup();
              resolve(p);
            }
          });
          const subError = RNIap.purchaseErrorListener((err) => {
            cleanup();
            reject(new Error(err.message ?? "Purchase failed"));
          });
          RNIap.requestPurchase({
            request: {
              google: {
                skus: [productId],
                subscriptionOffers: [{ sku: productId, offerToken }],
              },
            },
            type: "subs",
          }).catch((err) => {
            cleanup();
            reject(err);
          });
        });
      } else {
        purchase = await new Promise<unknown>((resolve, reject) => {
          const cleanup = () => {
            subUpdated.remove();
            subError.remove();
          };
          const subUpdated = RNIap.purchaseUpdatedListener((p) => {
            if (matchesProductId(p, productId)) {
              cleanup();
              resolve(p);
            }
          });
          const subError = RNIap.purchaseErrorListener((err) => {
            cleanup();
            reject(new Error(err.message ?? "Purchase failed"));
          });
          RNIap.requestPurchase({
            request: { apple: { sku: productId } },
            type: "subs",
          }).catch((err) => {
            cleanup();
            reject(err);
          });
        });
      }

      const purchaseRec = purchase as IapPurchaseLike;
      const purchaseToken: string | undefined =
        purchaseRec.purchaseToken ?? purchaseRec.transactionReceipt;

      if (!purchaseToken) {
        Alert.alert("Error", "No purchase token returned from Google Play.");
        return;
      }

      const res = await fetch(
        `${API_BASE_URL}/api/subscription/verify-android`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            purchaseToken,
            subscriptionId: productId,
            packageName: "com.wisewave.chatkit",
          }),
        }
      );
      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        Alert.alert("Success", "Subscription activated.");
        router.replace("/chat");
      } else {
        Alert.alert(
          "Error",
          (json as { error?: string }).error ??
            "Could not activate subscription. Please contact support."
        );
      }
    } catch (e) {
      console.warn("Google Play subscription error", e);
      Alert.alert(
        "Error",
        "Could not start Google Play subscription. Please try again."
      );
    } finally {
      setProcessingPlan(null);
    }
  };

  const startAppleSubscription = async (plan: "monthly" | "yearly") => {
    if (!token) {
      Alert.alert("Sign in required", "Please sign in first.");
      router.replace("/login");
      return;
    }

    if (Platform.OS !== "ios") {
      Alert.alert("Not available", "Apple subscriptions are only available on iOS.");
      return;
    }

    if (!iapReady) {
      Alert.alert("Not available", "In-app purchases are not ready yet. Please try again.");
      return;
    }

    if (processingPlan) return;

    const productId = storeSubscriptionProductId(plan);
    setProcessingPlan(plan);

    try {
      // Refresh StoreKit / App Store state (helps after a subscription has ended so
      // the next requestPurchase can surface the confirmation sheet reliably).
      try {
        if (typeof RNIap.syncIOS === "function") {
          await RNIap.syncIOS();
        }
      } catch (syncErr) {
        console.warn("syncIOS before purchase (non-fatal)", syncErr);
      }

      // Ensure the SKU exists in App Store Connect before attempting purchase.
      let subs: unknown[] = [];
      try {
        const raw = await RNIap.fetchProducts({
          skus: [productId],
          type: "subs",
        });
        subs = Array.isArray(raw) ? raw : [];
      } catch (fetchErr) {
        const errMsg =
          fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        console.warn("fetchProducts (iOS) error", errMsg, fetchErr);
        Alert.alert(
          "Error",
          "Could not load subscription products from the App Store. Check the product ID and App Store Connect status, then try again."
        );
        return;
      }

      const found = subs.some((p: unknown) => matchesProductId(p, productId));
      if (!found) {
        Alert.alert(
          "Error",
          `This subscription is not available from the App Store yet (SKU: ${productId}). In App Store Connect, finish subscription metadata and wait for processing, then try again.`
        );
        return;
      }

      // react-native-iap v15: requestPurchase resolves to Purchase | Purchase[] | null (event listeners optional).
      const unsubErr = RNIap.purchaseErrorListener((err) => {
        console.warn("Apple purchase error listener", err);
      });

      let result: unknown;
      try {
        result = await RNIap.requestPurchase({
          request: { apple: { sku: productId } },
          type: "subs",
        });
      } finally {
        unsubErr.remove();
      }

      if (result == null) {
        // User cancelled / no purchase to return.
        return;
      }

      const purchase = Array.isArray(result) ? result[0] : result;
      if (!ENABLE_IOS_RECEIPT_VERIFY) {
        try {
          await RNIap.finishTransaction({
            purchase: purchase as FinishTransactionPurchase,
            isConsumable: false,
          });
        } catch (finishErr) {
          console.warn("finishTransaction (iOS, verify disabled) warning", finishErr);
        }
        Alert.alert(
          "Purchase received",
          `${IOS_RECEIPT_VERIFY_DISABLED_MESSAGE}\n\nPlease use the upcoming Apple Server API sync flow, or ask steward/admin to set access for testing.`
        );
        return;
      }
      const receiptData = await getIosReceiptWithRetry(productId, purchase);

      if (!receiptData) {
        Alert.alert(
          "Error",
          "Purchase completed, but receipt sync is still pending. Please wait a few seconds and try again."
        );
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/subscription/verify-ios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiptData,
          subscriptionId: productId,
          bundleId: "com.wisewave.chatkit",
          transactionId:
            typeof (purchase as Record<string, unknown>)?.transactionId === "string"
              ? ((purchase as Record<string, unknown>).transactionId as string)
              : null,
          originalTransactionId:
            typeof (purchase as Record<string, unknown>)?.originalTransactionIdentifierIOS ===
            "string"
              ? ((purchase as Record<string, unknown>)
                  .originalTransactionIdentifierIOS as string)
              : null,
        }),
      });

      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (res.ok) {
        try {
          // Mark as finished so StoreKit does not keep replaying this purchase event.
          await RNIap.finishTransaction({
            purchase: purchase as FinishTransactionPurchase,
            isConsumable: false,
          });
        } catch (finishErr) {
          console.warn("finishTransaction (iOS) warning", finishErr);
        }
        const accessReady = await waitForSubscriptionAccessReady(token);
        if (!accessReady) {
          Alert.alert(
            "Purchase received",
            "Apple accepted the purchase, but subscription access is still syncing on this device (common in Sandbox).\n\nTap Restore purchase or Apple ID: sync, then try Continue again in a moment."
          );
          return;
        }
        const successBody =
          "Your Wisewave account is active.\n\n" +
          "Apple may not show a separate price sheet after the Apple ID prompt (common in Sandbox or when re-starting the same plan)—that is still a valid purchase if you see this success message.\n\n" +
          "Tap Continue to open chat.";
        Alert.alert("Success", successBody, [
          {
            text: "Continue",
            onPress: () => {
              // Defer navigation until after the alert closes, and briefly wait so
              // /chat WebView auth-check sees the updated subscription row.
              setTimeout(() => {
                router.replace("/chat");
              }, 400);
            },
          },
        ]);
      } else {
        Alert.alert("Error", formatIosVerifyFailureMessage(res, json));
      }
    } catch (e) {
      console.warn("Apple subscription error", e);
      const maybeCode =
        e && typeof e === "object" && "code" in e
          ? String((e as { code?: unknown }).code ?? "")
          : "";
      const maybeMessage =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message ?? "")
          : "";
      const lowerMsg = maybeMessage.toLowerCase();
      const userCancelled =
        maybeCode.toLowerCase().includes("cancel") ||
        maybeCode === "2" ||
        lowerMsg.includes("cancelled") ||
        lowerMsg.includes("user canceled") ||
        lowerMsg.includes("skerror code=2");
      if (userCancelled) {
        // User explicitly canceled Apple purchase flow; treat as no-op.
        return;
      }
      const msg =
        e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : e instanceof Error
            ? e.message
            : "Could not start Apple subscription. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setProcessingPlan(null);
    }
  };

  const openStore = async (plan: "monthly" | "yearly") => {
    if (Platform.OS === "android") {
      await startGooglePlaySubscription(plan);
      return;
    }
    await startAppleSubscription(plan);
  };

  const restoreAppleSubscription = async () => {
    if (Platform.OS !== "ios") {
      Alert.alert("Not available", "Restore is only available on iOS.");
      return;
    }

    if (!token) {
      Alert.alert("Sign in required", "Please sign in first.");
      router.replace("/login");
      return;
    }

    if (!iapReady) {
      Alert.alert("Not available", "In-app purchases are not ready yet. Please try again.");
      return;
    }

    if (processingPlan) return;
    setProcessingPlan("restore");

    try {
      if (!ENABLE_IOS_RECEIPT_VERIFY) {
        Alert.alert("Restore unavailable", IOS_RECEIPT_VERIFY_DISABLED_MESSAGE);
        return;
      }
      const available = await RNIap.getAvailablePurchases();
      if (!Array.isArray(available) || available.length === 0) {
        Alert.alert("No purchases found", "No App Store subscription receipt was found for this account.");
        return;
      }

      const activeIds = new Set<string>([
        APP_STORE_PRODUCT_IDS.monthly,
        APP_STORE_PRODUCT_IDS.yearly,
      ]);
      const matching = available.filter((p: unknown) =>
        activeIds.has(productIdOf(p))
      );

      const candidates = matching.length > 0 ? matching : available;
      const latestPurchase = [...candidates].sort((a: unknown, b: unknown) => {
        const pa = a as IapPurchaseLike;
        const pb = b as IapPurchaseLike;
        const ta = Number(pa.transactionDate ?? pa.purchaseTime ?? 0);
        const tb = Number(pb.transactionDate ?? pb.purchaseTime ?? 0);
        return tb - ta;
      })[0];

      const productId =
        productIdOf(latestPurchase) || APP_STORE_PRODUCT_IDS.monthly;

      const receiptData = await getIosReceiptWithRetry(productId, latestPurchase);
      if (!receiptData) {
        Alert.alert("Error", "No receipt data was available to restore yet. Please try again in a moment.");
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/subscription/verify-ios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiptData,
          subscriptionId: productId,
          bundleId: "com.wisewave.chatkit",
          transactionId:
            typeof (latestPurchase as Record<string, unknown>)?.transactionId === "string"
              ? ((latestPurchase as Record<string, unknown>).transactionId as string)
              : null,
          originalTransactionId:
            typeof (latestPurchase as Record<string, unknown>)
              ?.originalTransactionIdentifierIOS === "string"
              ? ((latestPurchase as Record<string, unknown>)
                  .originalTransactionIdentifierIOS as string)
              : null,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;

      if (!res.ok) {
        Alert.alert(
          "Restore failed",
          formatIosVerifyFailureMessage(res, json)
        );
        return;
      }

      try {
        await RNIap.finishTransaction({
          purchase: latestPurchase as FinishTransactionPurchase,
          isConsumable: false,
        });
      } catch {
        // Ignore if already finished.
      }

      Alert.alert("Restored", "Subscription restored successfully.");
      router.replace("/chat");
    } catch (e) {
      const msg =
        e && typeof e === "object" && "message" in e && typeof (e as { message: unknown }).message === "string"
          ? (e as { message: string }).message
          : e instanceof Error
            ? e.message
            : "Could not restore subscription. Please try again.";
      Alert.alert("Restore failed", msg);
    } finally {
      setProcessingPlan(null);
    }
  };

  useEffect(() => {
    if (autoStartTriggeredRef.current) return;
    if (params.autostart !== "1") return;
    const plan = params.plan === "yearly" ? "yearly" : "monthly";
    if (!token || !iapReady) return;
    autoStartTriggeredRef.current = true;
    void (async () => {
      if (Platform.OS === "android") {
        await startGooglePlaySubscription(plan);
        return;
      }
      if (Platform.OS === "ios") {
        await startAppleSubscription(plan);
      }
    })();
    // Intentionally omit subscription handlers: autostart runs once when gate opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.autostart, params.plan, token, iapReady]);

  return (
    <ScrollView
      style={styles.scrollRoot}
      contentContainerStyle={styles.scrollInner}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Subscribe to continue</Text>
      <Text style={styles.subtitle}>
        Your trial has ended. Choose a plan to keep using chat and your history.
      </Text>
      <Text style={styles.buildTag} selectable>
        {SUBSCRIPTION_SCREEN_BUILD_TAG}
      </Text>

      <View style={styles.card}>
        <Text style={styles.planName}>Monthly</Text>
        <Text style={styles.price}>${MONTHLY_PRICE}</Text>
        <Text style={styles.interval}>per month</Text>
        <TouchableOpacity
          style={[styles.button, processingPlan === "monthly" && styles.buttonDisabled]}
          disabled={processingPlan !== null}
          onPress={() => openStore("monthly")}
        >
          {processingPlan === "monthly" ? (
            <View style={styles.processingRow}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.buttonText}>Verifying purchase...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>
              {Platform.OS === "android"
                ? "Subscribe with Google Play"
                : "Subscribe with Apple"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.card, styles.cardHighlight]}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Save 14%</Text>
        </View>
        <Text style={styles.planName}>Yearly</Text>
        <Text style={styles.price}>${YEARLY_PRICE}</Text>
        <Text style={styles.interval}>per year</Text>
        <TouchableOpacity
          style={[styles.button, processingPlan === "yearly" && styles.buttonDisabled]}
          disabled={processingPlan !== null}
          onPress={() => openStore("yearly")}
        >
          {processingPlan === "yearly" ? (
            <View style={styles.processingRow}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.buttonText}>Verifying purchase...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>
              {Platform.OS === "android"
                ? "Subscribe with Google Play"
                : "Subscribe with Apple"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {Platform.OS === "ios" && (
        <Text style={styles.iosStoreHint}>
          Apple may ask you to sign in with your Apple ID before the price and confirm
          screen—that is normal, especially in Sandbox after a subscription has ended.
          After you enter your password, wait for the subscription sheet (or try again in
          a moment).
        </Text>
      )}

      {Platform.OS === "ios" && (
        <TouchableOpacity
          style={styles.secondaryButton}
          disabled={processingPlan !== null}
          onPress={() => {
            void restoreAppleSubscription();
          }}
        >
          <Text style={styles.secondaryButtonText}>
            {processingPlan === "restore" ? "Restoring purchase..." : "Restore purchase"}
          </Text>
        </TouchableOpacity>
      )}
      {Platform.OS === "ios" && (
        <>
          <TouchableOpacity
            style={styles.secondaryButton}
            disabled={processingPlan !== null}
            onPress={() =>
              presentAppleSubscriptionAccountHub({
                token,
                apiBaseUrl: API_BASE_URL,
                bundleId: "com.wisewave.chatkit",
                monthlyProductId: APP_STORE_PRODUCT_IDS.monthly,
                yearlyProductId: APP_STORE_PRODUCT_IDS.yearly,
                onWisewaveSynced: () => router.replace("/chat"),
              })
            }
          >
            <Text style={styles.secondaryButtonText}>Apple ID: manage, status, or sync…</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            disabled={processingPlan !== null}
            onPress={() => {
              if (!token) {
                Alert.alert("Sign in required", "Please sign in first.");
                router.replace("/login");
                return;
              }
              Alert.alert(
                "Apple subscription",
                "This opens App Store subscription management, then shows status for this Apple ID, then syncs Wisewave from your receipt.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Continue",
                    onPress: () =>
                      void runAppleSubscriptionAccountSequential({
                        token,
                        apiBaseUrl: API_BASE_URL,
                        bundleId: "com.wisewave.chatkit",
                        monthlyProductId: APP_STORE_PRODUCT_IDS.monthly,
                        yearlyProductId: APP_STORE_PRODUCT_IDS.yearly,
                        onWisewaveSynced: () => router.replace("/chat"),
                      }),
                  },
                ]
              );
            }}
          >
            <Text style={styles.secondaryButtonText}>Apple ID: run all steps</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            disabled={processingPlan !== null}
            onPress={() =>
              presentAppleSubscriptionCancellationFlow({
                token,
                apiBaseUrl: API_BASE_URL,
                bundleId: "com.wisewave.chatkit",
                monthlyProductId: APP_STORE_PRODUCT_IDS.monthly,
                yearlyProductId: APP_STORE_PRODUCT_IDS.yearly,
                onWisewaveSynced: () => router.replace("/chat"),
              })
            }
          >
            <Text style={styles.cancellationGuideText}>Cancel Apple subscription…</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.secondaryButton}
        disabled={processingPlan !== null}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryButtonText}>Back to chat</Text>
      </TouchableOpacity>
      {!token && (
        <TouchableOpacity
          style={styles.link}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.linkText}>Sign in</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollRoot: {
    flex: 1,
    backgroundColor: "#FAF9F6",
  },
  scrollInner: {
    padding: 24,
    paddingBottom: 48,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "300",
    color: "#2D3748",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
  },
  buildTag: {
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  iosStoreHint: {
    fontSize: 13,
    lineHeight: 20,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHighlight: {
    borderColor: "#059669",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#047857",
  },
  planName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  interval: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.85,
  },
  processingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#4A5568",
    fontSize: 16,
  },
  link: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    color: "#4A5568",
    fontSize: 14,
  },
  cancellationGuideText: {
    color: "#9a3412",
    fontSize: 16,
    textAlign: "center",
  },
});
