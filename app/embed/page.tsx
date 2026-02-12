"use client";

import { useCallback } from "react";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import type { ColorScheme } from "@/hooks/useColorScheme";

/**
 * Minimal chat-only page for embedding in iframes (e.g. Wix, other sites).
 * Use this URL in your iframe src for a clean chat widget.
 */
export default function EmbedPage() {
  const handleWidgetAction = useCallback(async (_action: FactAction) => {}, []);
  const handleResponseEnd = useCallback(() => {}, []);
  const handleThemeRequest = useCallback((_scheme: ColorScheme) => {}, []);

  return (
    <main className="flex h-[100vh] w-full flex-col bg-white dark:bg-slate-900">
      <div className="flex h-full w-full flex-col p-2 sm:p-4">
        <ChatKitPanel
          theme="light"
          onWidgetAction={handleWidgetAction}
          onResponseEnd={handleResponseEnd}
          onThemeRequest={handleThemeRequest}
        />
      </div>
    </main>
  );
}
