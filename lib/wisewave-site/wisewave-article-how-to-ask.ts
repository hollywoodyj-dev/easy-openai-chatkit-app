/**
 * Wisewave Article 2 — usage education (ask without giving away knowing).
 * Authority: Wisewave / Aurora approved usage-orientation sequence part 2.
 */

import type { WisewaveMarketingSeoEntry } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";

export const WISEWAVE_ARTICLE_HOW_TO_ASK_SEO: WisewaveMarketingSeoEntry = {
  title: "How to Ask Wisewave Without Giving Away Your Own Knowing | Wisewave",
  description:
    "Wisewave works best when you bring something real, not when you ask it to decide for you. This article explains how to ask reflectively while keeping your own knowing intact.",
  canonicalPath: "/articles/how-to-ask-without-giving-away-your-knowing",
};

/** Visible H1 — must match BreadcrumbList leaf. */
export const WISEWAVE_ARTICLE_HOW_TO_ASK_HEADLINE =
  "How to Ask Wisewave Without Giving Away Your Own Knowing";

export const WISEWAVE_ARTICLE_HOW_TO_ASK_CTA = {
  lead: "Try reflecting with Wisewave.",
  buttonLabel: "Open Wisewave",
  from: "article-how-to-ask",
} as const;
