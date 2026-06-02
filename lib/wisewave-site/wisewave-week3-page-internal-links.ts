/**
 * Week 3 per-page internal links (H1 companion) — distinct anchors, reduced cannibalization.
 * Source: Tree second implementation pack (2026-06).
 */

export type WisewavePageInternalLink = {
  href: `/${string}`;
  label: string;
};

export const WISEWAVE_HOME_INTERNAL_LINKS: readonly WisewavePageInternalLink[] = [
  { href: "/reflection-without-advice", label: "Reflection without advice" },
  { href: "/how-it-works", label: "How Wisewave works" },
  { href: "/who-its-for", label: "Who Wisewave is for" },
  { href: "/faq", label: "Common questions about Wisewave" },
];

export const WISEWAVE_REFLECTION_WITHOUT_ADVICE_INTERNAL_LINKS: readonly WisewavePageInternalLink[] =
  [
    { href: "/how-it-works", label: "How Wisewave works" },
    { href: "/what-it-is-not", label: "What Wisewave is not" },
    { href: "/self-reflection-app", label: "Self reflection app" },
    { href: "/faq", label: "Common questions about Wisewave" },
  ];

export const WISEWAVE_SELF_REFLECTION_APP_INTERNAL_LINKS: readonly WisewavePageInternalLink[] =
  [
    { href: "/reflection-without-advice", label: "Reflection without advice" },
    { href: "/journaling-alternative", label: "Journaling alternative" },
    { href: "/who-its-for", label: "Who Wisewave is for" },
    { href: "/faq", label: "Common questions about Wisewave" },
  ];

export const WISEWAVE_JOURNALING_ALTERNATIVE_INTERNAL_LINKS: readonly WisewavePageInternalLink[] =
  [
    { href: "/self-reflection-app", label: "Self reflection app" },
    { href: "/reflection-without-advice", label: "Reflection without advice" },
    { href: "/who-its-for", label: "Who Wisewave is for" },
  ];

export const WISEWAVE_REFLECTION_AI_INTERNAL_LINKS: readonly WisewavePageInternalLink[] = [
  { href: "/reflection-without-advice", label: "Reflection without advice" },
  { href: "/how-it-works", label: "How Wisewave works" },
  { href: "/what-it-is-not", label: "What Wisewave is not" },
];

export const WISEWAVE_WHO_ITS_FOR_INTERNAL_LINKS: readonly WisewavePageInternalLink[] = [
  { href: "/how-it-works", label: "How Wisewave works" },
  { href: "/reflection-without-advice", label: "Reflection without advice" },
  { href: "/faq", label: "Common questions about Wisewave" },
];

export const WISEWAVE_FAQ_INTERNAL_LINKS: readonly WisewavePageInternalLink[] = [
  { href: "/what-is-wisewave", label: "What Wisewave is" },
  { href: "/what-it-is-not", label: "What Wisewave is not" },
  { href: "/how-it-works", label: "How Wisewave works" },
  { href: "/who-its-for", label: "Who Wisewave is for" },
  { href: "/reflection-without-advice", label: "Reflection without advice" },
];
