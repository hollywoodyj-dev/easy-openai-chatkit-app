/**
 * Wisewave Article 1 — usage education (not SEO landing, not marketing pitch).
 * Authority: Wisewave product task — posture calibration for trial users.
 */

import type { WisewaveMarketingSeoEntry } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";

export const WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO: WisewaveMarketingSeoEntry =
  {
    title:
      "Don’t Come With a Question. Come With What Is Real Right Now. | Wisewave",
    description:
      "How to begin in Wisewave: bring what is real right now—not a request for advice, answers, or someone to decide for you.",
    canonicalPath: "/articles/dont-come-with-a-question",
  };

/** Visible H1 — must match BreadcrumbList leaf. */
export const WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_HEADLINE =
  "Don’t Come With a Question. Come With What Is Real Right Now.";

export const WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_CTA = {
  lead: "Begin with what is real right now.",
  buttonLabel: "Open Wisewave",
  from: "article-dont-come-with-a-question",
} as const;
