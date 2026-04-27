import { useLayoutEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getEmbedMobileUrl } from "../config";
import { WebView } from "react-native-webview";
import { View, StyleSheet } from "react-native";
import { Redirect, useRouter, useNavigation } from "expo-router";
import { HeaderSignOut } from "../components/HeaderSignOut";

const SUBSCRIPTION_MESSAGE_TYPE = "open_subscription";

export default function ChatScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderSignOut />,
      headerRightContainerStyle: {
        backgroundColor: "transparent",
      },
    });
  }, [navigation]);

  if (!token) {
    return <Redirect href="/login" />;
  }

  const uri = getEmbedMobileUrl(token);

  const handleWebViewMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const payload = JSON.parse(event.nativeEvent.data) as {
        type?: string;
        plan?: "monthly" | "yearly";
      };
      if (payload?.type === SUBSCRIPTION_MESSAGE_TYPE) {
        const plan = payload.plan === "yearly" ? "yearly" : payload.plan === "monthly" ? "monthly" : null;
        if (plan) {
          router.push(`/subscription?plan=${plan}&autostart=1`);
          return;
        }
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
    width: "100%",
    alignSelf: "stretch",
  },
  webview: {
    flex: 1,
    width: "100%",
  },
});
