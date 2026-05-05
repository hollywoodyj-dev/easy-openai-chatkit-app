/**
 * Wisewave marketing homepage copy (English).
 * Source: Wisewave landing calibration — Nova handoff (constants + JSON parity).
 */

export type LandingCopy = {
  hero: {
    headline: string;
    subheadline: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  problem: {
    sectionTitle: string;
    body: string[];
  };
  whatIs: {
    sectionTitle: string;
    body: string[];
    shortLine: string;
  };
  whatYouReceive: {
    sectionTitle: string;
    cards: { title: string; body: string }[];
  };
  whoItsFor: {
    sectionTitle: string;
    intro: string;
    fitTitle: string;
    fitItems: string[];
    notFitTitle: string;
    notFitItems: string[];
  };
  whyReturn: {
    sectionTitle: string;
    body: string[];
    items: string[];
    shortLine: string;
    cta: string;
  };
  boundaries: {
    sectionTitle: string;
    intro: string;
    items: string[];
    shortLine: string;
  };
  closing: {
    headline: string;
    body: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  faq: {
    sectionTitle: string;
    items: { question: string; answer: string }[];
  };
  footer: {
    shortLine: string;
    extendedLine: string;
  };
};

export const wisewaveLandingCopy: LandingCopy = {
  hero: {
    headline: "Less advice. Less interference. More room to see clearly.",
    subheadline: [
      "Wisewave is a reflection space for people who want clarity without having their thinking taken over.",
      "It does not guide, coach, or push.",
      "It reflects with restraint, so clarity can emerge without replacing your judgment.",
    ],
    ctaPrimary: "Try Wisewave",
    ctaSecondary: "See how it works",
  },

  problem: {
    sectionTitle: "When AI becomes too present, clarity gets harder.",
    body: [
      "Most AI systems are built to do more: more answers, more suggestions, more direction.",
      "That can be useful. But in moments of uncertainty or inner complexity, more system activity is not always what helps.",
      "Sometimes what is needed is less interference.",
      "Wisewave is built for those moments.",
    ],
  },

  whatIs: {
    sectionTitle: "A quieter kind of reflection",
    body: [
      "Wisewave is not an assistant that acts for you.",
      "It is not a coach that directs you.",
      "It is not a system designed to become the strongest voice in the room.",
      "It creates just enough structure for you to see more clearly for yourself.",
    ],
    shortLine: "Not more direction. More space for authorship.",
  },

  whatYouReceive: {
    sectionTitle: "What the experience offers",
    cards: [
      {
        title: "A quieter cognitive space",
        body: "Less output, less pressure, more room for your own thinking to come forward.",
      },
      {
        title: "Precise reflection",
        body: "It does not expand your thoughts with generic advice. It reflects what matters, with restraint.",
      },
      {
        title: "Preserved judgment",
        body: "It does not decide for you or tell you what to do next.",
      },
      {
        title: "Low system presence",
        body: "It is designed to stay light, so you can remain the author of your own seeing.",
      },
    ],
  },

  whoItsFor: {
    sectionTitle: "Who Wisewave is for",
    intro: "Wisewave is for people who already feel the cost of too much direction.",
    fitTitle: "It may fit if you want:",
    fitItems: [
      "reflection without guidance",
      "clarity without pressure",
      "space without emotional takeover",
      "language that helps you see, not follow",
    ],
    notFitTitle: "It may not fit if you are looking for:",
    notFitItems: [
      "direct advice",
      "coaching",
      "motivational guidance",
      "step-by-step action plans",
      "an AI that tells you what to do next",
    ],
  },

  whyReturn: {
    sectionTitle: "Why people subscribe",
    body: [
      "People do not subscribe to Wisewave for more stimulation or more system activity.",
      "They subscribe for something quieter: a trustworthy place to come back to when clear thinking matters.",
      "Wisewave is built for repeated use in meaningful moments:",
    ],
    items: [
      "before moments that need clear thinking",
      "during periods of inner confusion",
      "when outside noise becomes too strong",
      "when reflection is needed without takeover",
    ],
    shortLine: "Not optimized to take over. Designed to step back.",
    cta: "Start with Wisewave",
  },

  boundaries: {
    sectionTitle: "Built with boundaries",
    intro: "Wisewave is designed:",
    items: [
      "not to dominate the interaction",
      "not to cultivate dependence",
      "not to substitute for therapy",
      "not to simulate emotional attachment",
      "not to turn reflection into performance",
    ],
    shortLine: "These boundaries are not added afterward. They are part of how Wisewave works.",
  },

  closing: {
    headline:
      "In a world full of answers, some people need a place to see.",
    body: [
      "Wisewave is for those people.",
      "A reflection space that steps back, leaves room, and helps you see more clearly for yourself.",
    ],
    ctaPrimary: "Try Wisewave",
    ctaSecondary: "Read the founder note",
  },

  faq: {
    sectionTitle: "Frequently asked",
    items: [
      {
        question: "How is Wisewave different from other AI systems?",
        answer:
          "Wisewave is not designed to advise, direct, or take over your thinking. It is designed to reflect with restraint, so you can see more clearly without handing over authorship.",
      },
      {
        question: "Does Wisewave give advice?",
        answer:
          "No. Wisewave does not provide advice, coaching, or step-by-step direction. Its purpose is reflection, not instruction.",
      },
      {
        question: "Is Wisewave therapy?",
        answer:
          "No. Wisewave is not therapy and does not replace professional care. It is a reflection space designed to preserve clarity and agency.",
      },
      {
        question: "Who is Wisewave for?",
        answer:
          "Wisewave is for people who want reflection without guidance, clarity without pressure, and space without takeover.",
      },
      {
        question: "Why is the language so minimal?",
        answer:
          "Because restraint is part of how the product works. Wisewave is designed to reduce interference, not increase verbal pressure.",
      },
    ],
  },

  footer: {
    shortLine: "A quieter reflection space.",
    extendedLine:
      "Wisewave is designed to help people see more clearly without replacing their judgment.",
  },
};
