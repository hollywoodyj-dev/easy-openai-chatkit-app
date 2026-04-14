import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import * as RNIap from "react-native-iap";
import type { Purchase } from "react-native-iap";
import { API_BASE_URL } from "../config";

const MONTHLY_PRICE = 29;
const YEARLY_PRICE = 299;

const PLAY_STORE_APP_URL = "https://play.google.com/store/apps/details?id=com.wisewave.chat";
const APP_STORE_APP_URL = "https://apps.apple.com/app/wisewave-chat/id"; // Replace with your App Store ID

const IAP_UNAVAILABLE_MSG =
  "Google Play Billing couldn't be loaded. Please ensure:\n\n" +
  "• You installed this app from the Google Play Store (internal test link)\n" +
  "• You're signed in with a tester account\n" +
  "• You have the latest app version\n\n" +
  "Try reinstalling from the internal test page if the problem persists.";

export default function SubscriptionScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [iapReady, setIapReady] = useState(false);
  const [iapChecking, setIapChecking] = useState(Platform.OS === "android");

  useEffect(() => {
    if (Platform.OS !== "android") {
      setIapChecking(false);
      return;
    }

    (async () => {
      try {
        await RNIap.initConnection();
        // Clear any failed purchases from cache on Android
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (RNIap as any).flushFailedPurchasesCachedAsPendingAndroid?.();
        const hasFetchProducts = typeof RNIap.fetchProducts === "function";
        const hasRequestPurchase = typeof RNIap.requestPurchase === "function";
        setIapReady(hasFetchProducts && hasRequestPurchase);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("IAP init error", e);
      } finally {
        setIapChecking(false);
      }
    })();

    return () => {
      if (Platform.OS === "android") {
        RNIap.endConnection();
      }
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

    // Google Play product IDs (must match Play Console)
    const productId = plan === "monthly" ? "wisewave_monthly" : "wisewave_yearly";

    try {
      // react-native-iap v14: use fetchProducts + requestPurchase (no getSubscriptions/requestSubscription)
      let purchase: any;
      if (Platform.OS === "android") {
        let subs: any[];
        try {
          const raw = await RNIap.fetchProducts({
            skus: [productId],
            type: "subs",
          });
          subs = Array.isArray(raw) ? raw : [];
        } catch (fetchErr) {
          const errMsg =
            fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
          // eslint-disable-next-line no-console
          console.warn("fetchProducts error", errMsg, fetchErr);
          Alert.alert(
            "Error",
            "Could not load subscription products. Please try again."
          );
          return;
        }

        const product = subs.find(
          (p: any) => (p.productId ?? p.id ?? p.sku) === productId
        ) ?? subs[0];
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
        purchase = await new Promise<any>((resolve, reject) => {
          const cleanup = () => {
            subUpdated.remove();
            subError.remove();
          };
          const subUpdated = RNIap.purchaseUpdatedListener((p) => {
            if ((p.productId ?? p.id) === productId) {
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
        purchase = await new Promise<any>((resolve, reject) => {
          const cleanup = () => {
            subUpdated.remove();
            subError.remove();
          };
          const subUpdated = RNIap.purchaseUpdatedListener((p) => {
            if ((p.productId ?? p.id) === productId) {
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

      const purchaseToken: string | undefined =
        purchase?.purchaseToken ?? purchase?.transactionReceipt;

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
      // eslint-disable-next-line no-console
      console.warn("Google Play subscription error", e);
      Alert.alert(
        "Error",
        "Could not start Google Play subscription. Please try again."
      );
    }
  };

  const openStore = async (plan: "monthly" | "yearly") => {
    if (Platform.OS === "android") {
      await startGooglePlaySubscription(plan);
      return;
    }

    const url = APP_STORE_APP_URL;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "Could not open the store.");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscribe to continue</Text>
      <Text style={styles.subtitle}>
        Your trial has ended. Choose a plan to keep using chat and your history.
      </Text>

      <View style={styles.card}>
        <Text style={styles.planName}>Monthly</Text>
        <Text style={styles.price}>${MONTHLY_PRICE}</Text>
        <Text style={styles.interval}>per month</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openStore("monthly")}
        >
          <Text style={styles.buttonText}>
            {Platform.OS === "android"
              ? "Subscribe with Google Play"
              : "Subscribe with Apple"}
          </Text>
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
          style={styles.button}
          onPress={() => openStore("yearly")}
        >
          <Text style={styles.buttonText}>
            {Platform.OS === "android"
              ? "Subscribe with Google Play"
              : "Subscribe with Apple"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.secondaryButton}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    padding: 24,
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
    marginBottom: 24,
    lineHeight: 24,
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
});
