import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";
import * as WebBrowser from "expo-web-browser";

// Complete OAuth flow properly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { setToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        Alert.alert("Sign in failed", data?.error ?? "Invalid email or password.");
        return;
      }
      const token = data?.token;
      if (!token) {
        Alert.alert("Error", "No token received.");
        return;
      }
      await setToken(token);
      router.replace("/chat");
    } catch (e) {
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "facebook" | "x") => {
    setOauthLoading(provider);
    try {
      // Open OAuth flow with mobile state parameter
      const oauthUrl = `${API_BASE_URL}/api/auth/oauth/${provider}?state=mobile`;
      const result = await WebBrowser.openAuthSessionAsync(
        oauthUrl,
        "wisewave://oauth"
      );

      if (result.type === "success" && result.url) {
        // Extract token from deep link callback URL
        // Format: wisewave://oauth/google?token=...
        const url = new URL(result.url.replace("wisewave://", "https://"));
        const token = url.searchParams.get("token");
        if (token) {
          await setToken(token);
          router.replace("/chat");
        } else {
          Alert.alert("Error", "Could not complete sign in.");
        }
      } else if (result.type === "cancel") {
        // User cancelled - no error needed
      } else {
        Alert.alert("Error", "Could not complete sign in. Please try again.");
      }
    } catch (e) {
      Alert.alert("Error", "Could not complete sign in. Please try again.");
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            A space to pause, breathe, and return to yourself
          </Text>
        </View>

        <View style={styles.form}>
          {/* Social Login Buttons */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={[
                styles.socialButton,
                styles.googleButton,
                oauthLoading === "google" && styles.buttonDisabled,
              ]}
              onPress={() => handleOAuth("google")}
              disabled={!!oauthLoading || loading}
            >
              {oauthLoading === "google" ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                styles.facebookButton,
                oauthLoading === "facebook" && styles.buttonDisabled,
              ]}
              onPress={() => handleOAuth("facebook")}
              disabled={!!oauthLoading || loading}
            >
              {oauthLoading === "facebook" ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                styles.xButton,
                oauthLoading === "x" && styles.buttonDisabled,
              ]}
              onPress={() => handleOAuth("x")}
              disabled={!!oauthLoading || loading}
            >
              {oauthLoading === "x" ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.socialButtonText}>Continue with X</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email/Password Form */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading && !oauthLoading}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            editable={!loading && !oauthLoading}
          />
          <TouchableOpacity
            style={[
              styles.button,
              (loading || oauthLoading) && styles.buttonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!!loading || !!oauthLoading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign in</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push("/register")}
            disabled={!!loading || !!oauthLoading}
          >
            <Text style={styles.linkText}>
              Don't have an account?{" "}
              <Text style={styles.linkTextBold}>Create one</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6", // Soft beige/cream background
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    color: "#2D3748", // Soft dark gray
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#718096", // Muted gray
    textAlign: "center",
    lineHeight: 22,
    fontStyle: "italic",
  },
  form: {
    gap: 16,
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  facebookButton: {
    backgroundColor: "#1877F2",
  },
  xButton: {
    backgroundColor: "#000000",
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#9CA3AF",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#2D3748",
  },
  button: {
    backgroundColor: "#4A5568", // Soft dark gray-brown
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    minHeight: 52,
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  link: {
    alignItems: "center",
    padding: 12,
    marginTop: 8,
  },
  linkText: {
    color: "#718096",
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: "600",
    color: "#4A5568",
  },
});
