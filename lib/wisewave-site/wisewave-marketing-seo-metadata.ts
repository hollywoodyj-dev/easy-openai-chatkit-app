/**
 * Google Search SEO metadata v1 — category-true, bounded layer.
 * Source: Tree `GOOGLE_SEARCH_SEO_BRIEF_WISEWAVE_V1` + Lumen execution read (2026-05-19).
 * Positioning spine remains `wisewave-landing-copy.ts` (not replaced by this file).
 */

export type WisewaveMarketingSeoEntry = {
  /** Next.js metadata title */
  title: string;
  /** Meta description (~150–160 chars target) */
  description: string;
  canonicalPath: `/${string}`;
};

/** Homepage — category-shaping title; concrete meta (not hero poetry alone). */
export const WISEWAVE_HOME_SEO: WisewaveMarketingSeoEntry = {
  title: "Wisewave | Quiet reflection for clearer thinking",
  description:
    "A quiet reflection space that helps you hear your own thinking more clearly — without advice, coaching, or takeover.",
  canonicalPath: "/",
};

export const WISEWAVE_WHO_ITS_FOR_SEO: WisewaveMarketingSeoEntry = {
  title: "Who Wisewave Is For | Quiet reflection for clearer thinking",
  description:
    "See who Wisewave fits best: people who want clearer thinking, less interference, and reflection without advice-heavy AI.",
  canonicalPath: "/who-its-for",
};

export const WISEWAVE_WHAT_IT_IS_NOT_SEO: WisewaveMarketingSeoEntry = {
  title: "What Wisewave Is Not | Not therapy, coaching, or companion AI",
  description:
    "Wisewave is a quiet reflection space — not therapy, not coaching, not companion AI, and not a generic chatbot.",
  canonicalPath: "/what-it-is-not",
};

/** Lumen watchpoint: "calmer alternative" — keep bounded; avoid wellness/support drift in variants. */
export const WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO: WisewaveMarketingSeoEntry = {
  title: "Reflection Without Advice | A calmer alternative to advice-heavy AI",
  description:
    "Explore a quieter way to reflect. Wisewave helps you think more clearly without coaching, takeover, or too much advice.",
  canonicalPath: "/reflection-without-advice",
};

export const WISEWAVE_WHY_PEOPLE_COME_BACK_SEO: WisewaveMarketingSeoEntry = {
  title: "Why People Come Back | Quiet reflection when judgment matters",
  description:
    "Why people return to Wisewave: less interference, clearer thinking, and a quiet reflection space — not more advice or stimulation.",
  canonicalPath: "/why-people-come-back",
};

export const WISEWAVE_FAQ_SEO: WisewaveMarketingSeoEntry = {
  title: "Wisewave FAQ | What it is, who it fits, and what it is not",
  description:
    "Answers about how Wisewave works, who it is for, when it helps, and why it is not therapy, coaching, or companion AI.",
  canonicalPath: "/faq",
};

/** Calm internal links — homepage + support pages (truthful anchor text). */
export const WISEWAVE_CORE_INTERNAL_LINKS = [
  { href: "/who-its-for", label: "See if it fits" },
  { href: "/what-it-is-not", label: "What Wisewave is not" },
  { href: "/reflection-without-advice", label: "Reflection without advice" },
  { href: "/why-people-come-back", label: "Why people come back" },
  { href: "/faq", label: "Read the FAQ" },
] as const;
