"use client";

import { Suspense } from "react";
import { MarketingPageView } from "@/components/wisewave-site/MarketingPageView";

/** Marketing-site analytics shell (page views + route context). */
export function MarketingSiteAnalytics() {
  return (
    <Suspense fallback={null}>
      <MarketingPageView />
    </Suspense>
  );
}
