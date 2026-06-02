import type { WisewaveMarketingSeoEntry } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";

/**
 * SEO topic cluster: "reflection without advice" (and variants).
 * Primary URL: /reflection-without-advice — satellite pages link here.
 * Source: Lumen SEO diagnosis (2026-05-26).
 */

export const REFLECTION_WITHOUT_ADVICE_PRIMARY_PATH =
  "/reflection-without-advice" as const;

type SupportPageEntry = WisewaveMarketingSeoEntry & {
  headline: string;
};

export const REFLECTION_WITHOUT_ADVICE_SUPPORT_PAGES: readonly SupportPageEntry[] =
  [
  {
    canonicalPath: "/reflection-without-advice-vs-coaching",
    title: "Reflection Without Advice vs Coaching | Wisewave",
    description:
      "When coaching helps versus reflection without advice—and where Wisewave fits if you want clarity without goals, accountability, or direction.",
    headline: "Reflection without advice vs coaching",
  },
  {
    canonicalPath: "/what-ai-reflection-without-advice-means",
    title: "What AI Reflection Without Advice Means | Wisewave",
    description:
      "What AI reflection without advice means in practice: restrained reflection, not direction, coaching, or companion-style AI.",
    headline: "What AI reflection without advice means",
  },
  {
    canonicalPath: "/self-reflection-without-guidance",
    title: "Self Reflection Without Guidance | Wisewave",
    description:
      "Why some people want self reflection without guidance—and how Wisewave stays low-presence when clarity matters.",
    headline: "Self reflection without guidance",
  },
];
