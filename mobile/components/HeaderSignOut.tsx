import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export function HeaderSignOut() {
  const { signOut } = useAuth();
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={async () => {
        await signOut();
        router.replace("/login");
      }}
      accessibilityRole="button"
      accessibilityLabel="Sign out"
      activeOpacity={0.85}
      style={styles.headerSignOut}
    >
      <Text style={styles.headerSignOutText}>Sign out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Plain bar-button style: avoids a second pill stacking under iOS header-right chrome.
  headerSignOut: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  headerSignOutText: {
    color: "#0f172a",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 16,
    includeFontPadding: false,
  },
});
