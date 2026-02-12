"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import type { ColorScheme } from "@/hooks/useColorScheme";

/**
 * Embed page for mobile app WebView. Requires ?token=<JWT> in the URL.
 * The app obtains the JWT from /api/auth/login or /api/auth/register,
 * then loads this URL so ChatKit uses /api/mobile/create-session.
 */
export default function EmbedMobilePage() {
  const searchParams = useSearchParams();
  const token = useMemo(
    () => searchParams.get("token") ?? null,
    [searchParams]
  );

  const handleWidgetAction = useCallback(async (_action: FactAction) => {}, []);
  const handleResponseEnd = useCallback(() => {}, []);
  const handleThemeRequest = useCallback((_scheme: ColorScheme) => {}, []);

  if (!token?.trim()) {
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
}
