"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/wisewave-analytics";

export function StartEnterLink() {
  const searchParams = useSearchParams();
  const from = searchParams?.get("from") ?? null;
  const source =
    from === "home" || from === "hero" || from === "final_cta" || from === "nav"
      ? "homepage"
      : "direct";

  return (
    <Link
      href="/login?from=start"
      className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-6 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
      onClick={() => trackEvent("start_page_enter_click", { source })}
    >
      Enter Wisewave
    </Link>
  );
}
