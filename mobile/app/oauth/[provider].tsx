import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../../context/AuthContext";

function asSingle(value: string | string[] | undefined): string | null {
  if (!value) return null;
  return Array.isArray(value) ? value[0] ?? null : value;
}

export default function OAuthCallbackScreen() {
  const { setToken } = useAuth();
  const params = useLocalSearchParams<{
    provider?: string | string[];
    token?: string | string[];
    error?: string | string[];
  }>();
  const [message, setMessage] = useState("Finishing sign in...");

  const provider = useMemo(() => asSingle(params.provider), [params.provider]);
  const token = useMemo(() => asSingle(params.token), [params.token]);
  const error = useMemo(() => asSingle(params.error), [params.error]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (error) {
        setMessage("Could not complete social login. Please try again.");
        setTimeout(() => {
          if (!cancelled) router.replace("/login");
        }, 1200);
        return;
      }
      if (!token) {
        setMessage("Sign-in token was missing. Please try again.");
        setTimeout(() => {
          if (!cancelled) router.replace("/login");
        }, 1200);
        return;
      }
      try {
        await setToken(token);
        if (cancelled) return;
        router.replace("/chat");
      } catch {
        setMessage("Could not save your sign-in. Please try again.");
        setTimeout(() => {
          if (!cancelled) router.replace("/login");
        }, 1200);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [error, token, setToken]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#4A5568" />
      <Text style={styles.title}>Connecting {provider ?? "account"}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#FAF9F6",
  },
  title: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "500",
    color: "#2D3748",
  },
  message: {
    marginTop: 8,
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
  },
});
