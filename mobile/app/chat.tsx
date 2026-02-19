import { useLayoutEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getEmbedMobileUrl } from "../config";
import { WebView } from "react-native-webview";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Redirect, useRouter, useNavigation } from "expo-router";

const SUBSCRIPTION_MESSAGE_TYPE = "open_subscription";

export default function ChatScreen() {
  const { token, signOut } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            await signOut();
            router.replace("/login");
          }}
          style={{ marginRight: 12 }}
        >
          <Text style={{ color: "#0f172a", fontSize: 16 }}>Sign out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, signOut, router]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  const uri = getEmbedMobileUrl(token);

  const handleWebViewMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data) as { type?: string };
      if (payload?.type === SUBSCRIPTION_MESSAGE_TYPE) {
        router.push("/subscription");
      }
    } catch {
      // ignore non-JSON or unknown messages
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri }}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled={false}
        originWhitelist={["https://*"]}
        onMessage={handleWebViewMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
