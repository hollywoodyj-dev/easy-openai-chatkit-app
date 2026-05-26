/**
 * Paid Search Launch v1 — landing copy only.
 * Served at /lp/* (noindex). Organic SEO pages are unchanged.
 */

export type PaidLandingSlug =
  | "self-reflection-app"
  | "ai-reflection"
  | "reflection-without-advice";

export type PaidLandingConfig = {
  slug: PaidLandingSlug;
  /** Google Ads ad group id for analytics */
  adGroup: "ag1_self_reflection_app" | "ag2_ai_reflection" | "ag3_reflection_without_advice";
  headline: string;
  subhead: string;
  /** Four questions above the fold (Wisewave brief) */
  answers: readonly {
    question: string;
    answer: string;
  }[];
  boundariesTitle: string;
  boundaries: readonly string[];
  whyNow: string;
  /** Indexed sibling for optional footer link */
  organicPath: `/${string}`;
  organicLabel: string;
};

export const PAID_LANDING_SELF_REFLECTION: PaidLandingConfig = {
  slug: "self-reflection-app",
  adGroup: "ag1_self_reflection_app",
  headline: "A self reflection space — without being guided",
  subhead:
    "You searched for a reflection app. Wisewave works in your browser first: write what is on your mind and hear your own thinking more clearly — without coaching prompts or direction.",
  answers: [
    {
      question: "What is Wisewave?",
      answer:
        "A quiet reflection space in your browser. You write; Wisewave reflects with restraint — it does not coach, advise, or take over your process.",
    },
    {
      question: "What is it not?",
      answer:
        "Not therapy, not counselling, not an AI coach, not emotional companionship, and not a journaling prompt engine.",
    },
    {
      question: "How do I begin?",
      answer:
        "Start in your browser — no app required. Open Wisewave, enter a few lines, and begin your first reflection in minutes.",
    },
    {
      question: "Why use it now?",
      answer:
        "When your thoughts feel crowded and you want space rather than more input, a short reflection can help you notice what is already there.",
    },
  ],
  boundariesTitle: "Clear boundaries",
  boundaries: [
    "Browser-first — use Wisewave on the web; mobile app is optional later.",
    "No advice, coaching, or life guidance.",
    "Not for crisis or clinical care — if you need urgent support, use appropriate local services.",
  ],
  whyNow:
    "If you want a reflection tool that stays out of your way, begin in the browser and see whether the fit feels honest.",
  organicPath: "/self-reflection-app",
  organicLabel: "Read the site guide on self reflection apps",
};

export const PAID_LANDING_AI_REFLECTION: PaidLandingConfig = {
  slug: "ai-reflection",
  adGroup: "ag2_ai_reflection",
  headline: "AI reflection — kept simple and restrained",
  subhead:
    "You are open to AI for reflection but may not want advice-heavy or coaching-style AI. Wisewave reflects what you write without directing you.",
  answers: [
    {
      question: "What is Wisewave?",
      answer:
        "Reflection AI with a low-presence stance: it mirrors and clarifies what you bring instead of pushing goals, tips, or emotional support.",
    },
    {
      question: "What is it not?",
      answer:
        "Not an AI coach, therapist substitute, companion, or generic chat assistant. Not built to fix anxiety or transform your life.",
    },
    {
      question: "How do I begin?",
      answer:
        "Try Wisewave in your browser first. Sign in when you are ready, write what is on your mind, and start your first reflection.",
    },
    {
      question: "Why use it now?",
      answer:
        "When AI tools feel too directive, a calmer reflection space can help you think without another voice taking over.",
    },
  ],
  boundariesTitle: "Category caution (AI reflection)",
  boundaries: [
    "Wisewave does not provide mental health support or clinical guidance.",
    "It will not tell you what to do, how to heal, or how to improve yourself.",
    "Browser access is the fastest path to a first honest reflection.",
  ],
  whyNow:
    "Test whether this kind of AI reflection matches what you actually wanted from the search.",
  organicPath: "/reflection-ai",
  organicLabel: "Read the site guide on reflection AI",
};

export const PAID_LANDING_REFLECTION_WITHOUT_ADVICE: PaidLandingConfig = {
  slug: "reflection-without-advice",
  adGroup: "ag3_reflection_without_advice",
  headline: "Reflection without advice",
  subhead:
    "You want reflection — not another voice telling you what to do. Wisewave offers a quieter space to hear your own thinking more clearly.",
  answers: [
    {
      question: "What is Wisewave?",
      answer:
        "A reflection space where the system stays restrained: it reflects what you share without advice, coaching, or takeover.",
    },
    {
      question: "What is it not?",
      answer:
        "Not therapy, not coaching, not companion AI, and not a productivity or life-guidance assistant.",
    },
    {
      question: "How do I begin?",
      answer:
        "Start in your browser. No download required for your first reflection — enter Wisewave and write what is already on your mind.",
    },
    {
      question: "Why use it now?",
      answer:
        "When you are tired of advice-heavy tools, a short reflection without direction can restore room for your own judgment.",
    },
  ],
  boundariesTitle: "What Wisewave will not do",
  boundaries: [
    "No prescriptions, action plans, or “you should” guidance.",
    "No emotional companionship or relational attachment framing.",
    "Browser-first; app download is secondary.",
  ],
  whyNow:
    "If “reflection without advice” is what you were looking for, begin here and see if the first turn feels right.",
  organicPath: "/reflection-without-advice",
  organicLabel: "Read the full site guide",
};

export const PAID_LANDING_BY_SLUG: Record<PaidLandingSlug, PaidLandingConfig> = {
  "self-reflection-app": PAID_LANDING_SELF_REFLECTION,
  "ai-reflection": PAID_LANDING_AI_REFLECTION,
  "reflection-without-advice": PAID_LANDING_REFLECTION_WITHOUT_ADVICE,
};
