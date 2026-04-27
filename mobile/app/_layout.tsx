import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackTitle: "Back",
          contentStyle: styles.stackContent,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Sign in" }} />
        <Stack.Screen name="register" options={{ title: "Create account" }} />
        <Stack.Screen name="chat" options={{ title: "Chat", headerBackVisible: true }} />
        <Stack.Screen name="subscription" options={{ title: "Subscribe" }} />
        <Stack.Screen name="oauth/[provider]" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  stackContent: {
    flex: 1,
  },
});
