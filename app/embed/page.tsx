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

  const handleWidgetAction = useCallback(
    async (action: FactAction) => { void action; },
    []
  );
  const handleResponseEnd = useCallback(() => {}, []);
  const handleThemeRequest = useCallback(
    (scheme: ColorScheme) => { void scheme; },
    []
  );

  return (
    <main className="flex h-[100vh] w-full flex-col bg-white dark:bg-slate-900">
      <div className="flex h-full w-full flex-col p-2 sm:p-4">
        <ChatKitPanel
          theme="light"
          onWidgetAction={handleWidgetAction}
          onResponseEnd={handleResponseEnd}
          onThemeRequest={handleThemeRequest}
          authToken={token ?? undefined}
        />
      </div>
    </main>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={
      <main className="flex h-[100vh] w-full flex-col bg-white dark:bg-slate-900">
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-slate-500">Loading...</p>
        </div>
      </main>
    }>
      <EmbedContent />
    </Suspense>
  );
}
