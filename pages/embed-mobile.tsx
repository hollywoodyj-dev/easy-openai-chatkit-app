import { useCallback, useEffect, useMemo, useState } from "react";
import type { NextPage } from "next";
import Script from "next/script";
import { useRouter } from "next/router";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import type { ColorScheme } from "@/hooks/useColorScheme";

const CHATKIT_SCRIPT_URL =
  "https://cdn.platform.openai.com/deployments/chatkit/chatkit.js";

/**
 * Embed page for the mobile app WebView (Pages Router).
 * We load the ChatKit script from the CDN here and only render ChatKitPanel
 * once the script has loaded, so the web component is available (avoids race with _document defer).
 *
 * Expected usage: /embed-mobile?token=<JWT>
 */
const EmbedMobilePage: NextPage = () => {
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);

  const token = useMemo(() => {
    const raw = router.query.token;
    const value = Array.isArray(raw) ? raw[0] : raw;
    return (value ?? "").trim() || null;
  }, [router.query.token]);

  const handleWidgetAction = useCallback(
    async (action: FactAction) => { void action; },
    []
  );
  const handleResponseEnd = useCallback(() => {}, []);
  const handleThemeRequest = useCallback(
    (scheme: ColorScheme) => { void scheme; },
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.customElements?.get("openai-chatkit")) {
      setScriptReady(true);
      return;
    }
    const onDefined = (): void => setScriptReady(true);
    customElements.whenDefined("openai-chatkit").then(onDefined);
    return () => {};
  }, []);

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
    <>
      <Script
        src={CHATKIT_SCRIPT_URL}
        strategy="afterInteractive"
        onLoad={() => {
          customElements.whenDefined("openai-chatkit").then(() => setScriptReady(true));
        }}
      />
      <main className="flex h-[100vh] w-full flex-col bg-white dark:bg-slate-900">
        <div className="flex h-full w-full flex-col p-2 sm:p-4">
          {scriptReady ? (
            <ChatKitPanel
              theme="light"
              onWidgetAction={handleWidgetAction}
              onResponseEnd={handleResponseEnd}
              onThemeRequest={handleThemeRequest}
              authToken={token}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500">
              Loading chat...
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default EmbedMobilePage;

