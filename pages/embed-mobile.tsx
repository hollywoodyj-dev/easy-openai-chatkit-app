import { useCallback, useMemo } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import type { ColorScheme } from "@/hooks/useColorScheme";

/**
 * Embed page for the mobile app WebView (Pages Router).
 * ChatKit script is injected in pages/_document.tsx for this path so it loads before hydration.
 *
 * Expected usage: /embed-mobile?token=<JWT>
 */
const EmbedMobilePage: NextPage = () => {
  const router = useRouter();

  const token = useMemo(() => {
    const raw = router.query.token;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return (value ?? "").trim() || null;
  }, [router.query.token]);

  const handleWidgetAction = useCallback(async (_action: FactAction) => {}, []);
  const handleResponseEnd = useCallback(() => {}, []);
  const handleThemeRequest = useCallback((_scheme: ColorScheme) => {}, []);

  if (!token) {
    return (
      <main className="flex h-[100vh] w-full flex-col items-center justify-center bg-white p-4">
        <p className="text-center text-slate-600">
          Missing token. Open this page from the app with ?token=...
        </p>
      </main>
    );
  }

  return (
    <main className="flex h-[100vh] w-full flex-col bg-white dark:bg-slate-900">
      <div className="flex h-full w-full flex-col p-2 sm:p-4">
        <ChatKitPanel
            theme="light"
            onWidgetAction={handleWidgetAction}
            onResponseEnd={handleResponseEnd}
            onThemeRequest={handleThemeRequest}
            authToken={token}
          />
        </div>
    </main>
  );
};

export default EmbedMobilePage;

