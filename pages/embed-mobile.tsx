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
const SCRIPT_WAIT_MS = 20000;

const EmbedMobilePage: NextPage = () => {
  const router = useRouter();
  const [scriptReady, setScriptReady] = useState(false);
  const [scriptTimedOut, setScriptTimedOut] = useState(false);

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

  useEffect(() => {
    if (scriptReady) return;
    const t = window.setTimeout(() => setScriptTimedOut(true), SCRIPT_WAIT_MS);
    return () => window.clearTimeout(t);
  }, [scriptReady]);

  if (!router.isReady) {
    return (
      <main
        className="flex min-h-[100vh] w-full flex-col items-center justify-center bg-slate-50 p-6"
        style={{ minHeight: "100vh" }}
      >
        <p className="text-center text-lg text-slate-600">Loading...</p>
      </main>
    );
  }

  if (!token) {
    return (
      <main
        className="flex min-h-[100vh] w-full flex-col items-center justify-center bg-slate-50 p-6"
        style={{ minHeight: "100vh" }}
      >
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
      <main
        className="flex min-h-[100vh] w-full flex-col bg-white dark:bg-slate-900"
        style={{ minHeight: "100vh" }}
      >
        <div className="flex min-h-[80vh] w-full flex-col p-2 sm:p-4">
          {scriptTimedOut && !scriptReady ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
              <p className="text-center text-slate-700">
                Chat script did not load in time. This can be caused by browser
                security (e.g. Content Security Policy) or network issues.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="rounded bg-slate-800 px-4 py-2 text-white"
              >
                Reload page
              </button>
            </div>
          ) : scriptReady ? (
            <ChatKitPanel
              theme="light"
              onWidgetAction={handleWidgetAction}
              onResponseEnd={handleResponseEnd}
              onThemeRequest={handleThemeRequest}
              authToken={token}
            />
          ) : (
            <div
              className="flex min-h-[60vh] w-full flex-1 items-center justify-center bg-slate-50"
              style={{ minHeight: "300px" }}
            >
              <p className="text-center text-lg text-slate-600">Loading chat...</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default EmbedMobilePage;

