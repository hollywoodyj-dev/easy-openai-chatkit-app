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

const MONTHLY_PRICE = 29;
const YEARLY_PRICE = 299;

const PLAY_STORE_APP_URL = "https://play.google.com/store/apps/details?id=com.wisewave.chat";
const APP_STORE_APP_URL = "https://apps.apple.com/app/wisewave-chat/id"; // Replace with your App Store ID

export default function SubscriptionScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const openStore = (plan: "monthly" | "yearly") => {
    const url = Platform.OS === "ios" ? APP_STORE_APP_URL : PLAY_STORE_APP_URL;
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
