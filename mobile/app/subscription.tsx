import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

/**
 * Subscription screen: shown when user taps "Subscribe" from the chat (subscription required).
 * Opens Google Play subscription or app page. Replace PLAY_STORE_SUBSCRIPTION_URL with your in-app product deep link when using Google Play Billing.
 */
const PLAY_STORE_APP_URL = "https://play.google.com/store/apps/details?id=com.wisewave.chat";
const PLAY_STORE_SUBSCRIPTION_URL = PLAY_STORE_APP_URL; // Replace with your subscription product URL when configured

export default function SubscriptionScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const handleSubscribe = () => {
    Linking.openURL(PLAY_STORE_SUBSCRIPTION_URL).catch(() => {
      Alert.alert("Error", "Could not open Google Play.");
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscribe to continue</Text>
      <Text style={styles.subtitle}>
        Your trial has ended. Subscribe via Google Play to keep using chat and your history.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
        <Text style={styles.buttonText}>Subscribe with Google Play</Text>
      </TouchableOpacity>
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
    justifyContent: "center",
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
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: "#059669",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    padding: 16,
    alignItems: "center",
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
