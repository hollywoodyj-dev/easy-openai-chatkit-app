"use client";

import { useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import type { ColorScheme } from "@/hooks/useColorScheme";

/**
 * Minimal chat-only page for embedding in iframes (e.g. Wix, other sites).
 * Use this URL in your iframe src for a clean chat widget.
 *
 * Optional: Add ?token=<JWT> to use authenticated user's chat history
 * (otherwise uses anonymous/cookie-based session).
 */
function EmbedContent() {
  const searchParams = useSearchParams();
  const token = useMemo(
    () => searchParams?.get("token")?.trim() || null,
    [searchParams]
  );
  const isEmbedMobile = searchParams?.get("embed") === "mobile";

  const handleWidgetAction = useCallback(
    async (action: FactAction) => { void action; },
    []
  );
  const handleResponseEnd = useCallback(() => {}, []);
  const handleThemeRequest = useCallback(
    (scheme: ColorScheme) => { void scheme; },
    []
  );

  const handleSubscriptionRequired = useCallback(() => {
    if (typeof window === "undefined") return;
    if (isEmbedMobile && (window as unknown as { ReactNativeWebView?: { postMessage: (msg: string) => void } }).ReactNativeWebView) {
      (window as unknown as { ReactNativeWebView: { postMessage: (msg: string) => void } }).ReactNativeWebView.postMessage(
        JSON.stringify({ type: "open_subscription" })
      );
    } else {
      const q = token ? `?token=${encodeURIComponent(token)}` : "";
      window.location.href = `/subscribe${q}`;
    }
  }, [isEmbedMobile, token]);

  return (
    <main
      className="flex h-screen w-full flex-col bg-white dark:bg-slate-900"
      style={{ paddingTop: "env(safe-area-inset-top)", minHeight: "100dvh" }}
    >
      <div className="flex h-full w-full min-h-0 flex-col p-2 sm:p-4">
        <ChatKitPanel
          theme="light"
          onWidgetAction={handleWidgetAction}
          onResponseEnd={handleResponseEnd}
          onThemeRequest={handleThemeRequest}
          authToken={token ?? undefined}
          onSubscriptionRequired={handleSubscriptionRequired}
          fullPage
        />
      </div>
    </main>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={
      <main
        className="flex h-[100dvh] w-full flex-col bg-white dark:bg-slate-900"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-slate-500">Loading...</p>
        </div>
      </main>
    }>
      <EmbedContent />
    </Suspense>
  );
}
