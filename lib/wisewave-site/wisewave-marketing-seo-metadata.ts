/**
 * Google Search SEO metadata — Week 3 refinement (2026-06).
 * Source: Tree Week 3 title/meta pack + architecture plan.
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
    "Wisewave is a quiet reflection space for clearer thinking. No advice, no coaching, no takeover—just more room for your own judgment.",
  canonicalPath: "/",
};

export const WISEWAVE_WHO_ITS_FOR_SEO: WisewaveMarketingSeoEntry = {
  title: "Who Wisewave Is For | Quiet reflection for clearer thinking",
  description:
    "Wisewave is for people who want reflection without guidance, pressure, or companion-style AI. A quieter space for clearer thinking.",
  canonicalPath: "/who-its-for",
};

export const WISEWAVE_WHAT_IT_IS_NOT_SEO: WisewaveMarketingSeoEntry = {
  title: "What Wisewave Is Not | Not therapy, coaching, or companion AI",
  description:
    "Wisewave is a quiet reflection space — not therapy, not coaching, not companion AI, and not a generic chatbot.",
  canonicalPath: "/what-it-is-not",
};

/** Lumen watchpoint: "calmer alternative" — keep bounded; avoid wellness/support drift in variants. */
export const WISEWAVE_QUIET_REFLECTION_SEO: WisewaveMarketingSeoEntry = {
  title: "Quiet Reflection | A quiet space for reflection without advice",
  description:
    "Quiet reflection and a quiet space for reflection—not more advice or coaching. Support page; see reflection without advice for the primary topic guide.",
  canonicalPath: "/quiet-reflection",
};

/** Primary topic cluster page — reflection without advice (+ query variants). */
export const WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO: WisewaveMarketingSeoEntry = {
  title: "Reflection Without Advice | Wisewave",
  description:
    "Reflection without advice: a quieter form of Reflection AI that supports reflection without taking over interpretation or direction.",
  canonicalPath: "/reflection-without-advice",
};

/** AI-query bridge — defers to primary cluster URL. */
export const WISEWAVE_REFLECTION_AI_SEO: WisewaveMarketingSeoEntry = {
  title: "Reflection AI Without Coaching or Advice | Wisewave",
  description:
    "Looking for reflection AI without advice or coaching? Wisewave reflects with restraint so your thinking stays central.",
  canonicalPath: "/reflection-ai",
};

/** Market-category page — self reflection app intent. */
export const WISEWAVE_SELF_REFLECTION_APP_SEO: WisewaveMarketingSeoEntry = {
  title: "A Self Reflection App Without Guidance | Wisewave",
  description:
    "A self reflection app for people who do not want prompts, coaching, or guidance. Wisewave helps you think more clearly without taking over.",
  canonicalPath: "/self-reflection-app",
};

export const WISEWAVE_JOURNALING_ALTERNATIVE_SEO: WisewaveMarketingSeoEntry = {
  title: "A Journaling Alternative for People Tired of Prompts | Wisewave",
  description:
    "A journaling alternative for people who dislike blank-page pressure or guided prompts. Wisewave offers quieter reflection without coaching.",
  canonicalPath: "/journaling-alternative",
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
    "What Wisewave is, what it is not, who it fits, and where its limits are—answered clearly, without inflated claims.",
  canonicalPath: "/faq",
};

/** Calm internal links — primary concept first; homepage + support pages. */
export const WISEWAVE_CORE_INTERNAL_LINKS = [
  { href: "/reflection-without-advice", label: "Reflection without advice" },
  { href: "/self-reflection-app", label: "A self reflection app without guidance" },
  { href: "/reflection-ai", label: "Reflection AI without coaching or advice" },
  { href: "/journaling-alternative", label: "A journaling alternative" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/who-its-for", label: "Who Wisewave is for" },
  { href: "/what-it-is-not", label: "What Wisewave is not" },
  { href: "/faq", label: "FAQ" },
] as const;
