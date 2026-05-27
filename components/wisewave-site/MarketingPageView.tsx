"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/wisewave-analytics";

function pageSlug(pathname: string): string {
  if (pathname === "/") return "homepage";
  if (pathname.startsWith("/lp/")) return pathname.slice(1);
  return pathname.slice(1).replace(/\//g, "_") || "unknown";
}

/** Fires once per marketing route with path + query context. */
export function MarketingPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;

    const from = searchParams?.get("from")?.trim();
    const lp = searchParams?.get("lp")?.trim();
    const adGroup = searchParams?.get("ad_group")?.trim();

    trackEvent("page_view", {
      path: pathname,
      page: pageSlug(pathname),
      ...(from ? { from } : {}),
      ...(lp ? { lp } : {}),
      ...(adGroup ? { ad_group: adGroup } : {}),
    });

    if (pathname === "/") {
      trackEvent("homepage_view", { path: pathname });
    }
  }, [pathname, searchParams]);

  return null;
}
