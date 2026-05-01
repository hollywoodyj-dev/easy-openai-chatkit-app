/**
 * Wisewave marketing homepage copy (English).
 * Source: Wisewave landing calibration — Nova handoff (constants + JSON parity).
 */

export type LandingCopy = {
  hero: {
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    supportLines: string[];
  };
  resonance: {
    sectionTitle: string;
    body: string[];
    closingLine: string;
  };
  whatIs: {
    sectionTitle: string;
    body: string[];
    shortLine: string;
  };
  difference: {
    sectionTitle: string;
    cards: { title: string; body: string }[];
  };
  benefits: {
    sectionTitle: string;
    items: { title: string; body: string }[];
  };
  useCases: {
    sectionTitle: string;
    items: string[];
  };
  howItWorks: {
    sectionTitle: string;
    steps: { title: string; body: string[] }[];
  };
  beliefs: {
    sectionTitle: string;
    items: string[];
    closingLine: string;
  };
  boundaries: {
    sectionTitle: string;
    body: string[];
    supportLine: string;
  };
  finalCta: {
    sectionTitle: string;
    body: string[];
    ctaPrimary: string;
    ctaSecondary: string;
  };
  footer: {
    line: string;
    subline: string;
  };
  implementationNotes: {
    designDirection: string[];
    ctaToneAvoid: string[];
    boundaryVisibility: string[];
  };
};

export const wisewaveLandingCopy: LandingCopy = {
  hero: {
    headline: "A quiet space to hear yourself more clearly.",
    subheadline:
      "Wisewave offers a low-pressure reflection space where thoughts, emotions, and inner tension can become a little easier to notice.",
    ctaPrimary: "Start a conversation",
    ctaSecondary: "See how it works",
    supportLines: [
      "Not a search engine.",
      "Not a productivity tool.",
      "Not therapy.",
      "Not coaching.",
      "Just a quieter space for reflection.",
    ],
  },

  resonance: {
    sectionTitle: "Sometimes the difficulty is not a lack of answers.",
    body: [
      "You may already have thought about it deeply.",
      "You may have searched, analyzed, or tried to make sense of what you feel.",
      "And still, something may remain unclear.",
      "Sometimes the difficulty is not missing information.",
      "It is that too much is happening at once.",
      "You may feel something strongly but struggle to name it.",
      "You may keep thinking without becoming clearer.",
      "You may say a lot, while still not reaching the part that matters most.",
    ],
    closingLine:
      "Wisewave does not explain your life for you. It offers space to notice what is already there.",
  },

  whatIs: {
    sectionTitle: "What is Wisewave?",
    body: [
      "Wisewave is a quiet reflection space.",
      "You can begin with whatever is present: a thought, a feeling, a question, a confusion, or something you cannot fully name yet.",
      "It does not rush to answer.",
      "It does not tell you what to do.",
      "Instead, it responds lightly to what is already in your words — what may be felt, where things seem unclear, and what may be starting to come into view.",
    ],
    shortLine:
      "It does not think for you. It helps you hear yourself more clearly.",
  },

  difference: {
    sectionTitle: "Most AI tries to do more. Wisewave does less.",
    cards: [
      {
        title: "No rush to answer",
        body: "Many AI systems move quickly toward advice or solutions. Wisewave begins by making more room for what you are already saying.",
      },
      {
        title: "No need to be fixed",
        body: "It does not treat you like a problem to solve. Sometimes what is needed is not correction, but clearer attention.",
      },
      {
        title: "No polished language over complexity",
        body: "It does not smooth over difficult or mixed experience with ready-made reassurance.",
      },
      {
        title: "No takeover of direction",
        body: "It does not decide what your experience means. You remain the one who determines what feels true.",
      },
    ],
  },

  benefits: {
    sectionTitle: "Sometimes, a little clarity is enough.",
    items: [
      {
        title: "A clearer sense of what is happening inside",
        body: 'From "everything feels tangled" to a more specific sense of where the tension is.',
      },
      {
        title: "More honest emotional awareness",
        body: "Feelings that were hard to name, pushed aside, or explained away may become easier to notice.",
      },
      {
        title: "A little more inner space",
        body: "Not being rushed past what is real, but having room to stay with it more clearly.",
      },
      {
        title: "A steadier understanding of yourself",
        body: "Not a final answer, but a quieter return to what feels true for you.",
      },
    ],
  },

  useCases: {
    sectionTitle:
      "Use Wisewave when you need a space that does not interrupt you.",
    items: [
      "When you feel a lot, but cannot quite say why",
      "When you keep returning to the same inner loop",
      "When something feels stuck, but the stuck point is unclear",
      "When you do not want more advice yet",
      "When you need a space that does not define, judge, or push you",
    ],
  },

  howItWorks: {
    sectionTitle: "The way in is simple.",
    steps: [
      {
        title: "Start from what is real now",
        body: [
          "You do not need to organize it first.",
          "You do not need to say it perfectly.",
          "Start wherever you are.",
        ],
      },
      {
        title: "Wisewave reflects lightly",
        body: [
          "It responds to the emotions, tensions, and small signals already present in your words.",
        ],
      },
      {
        title: "Something may become clearer",
        body: [
          "Not all at once.",
          "Not by being explained.",
          "But through a conversation with enough room to notice.",
        ],
      },
      {
        title: "Clarity can bring you closer to yourself",
        body: [
          "Wisewave does not push you forward.",
          "It simply helps keep the space open.",
        ],
      },
    ],
  },

  beliefs: {
    sectionTitle: "Wisewave believes",
    items: [
      "Clarity matters more than quick answers",
      "People do not always need guidance in order to understand themselves",
      "Inner noise is not a sign of failure",
      "Some understanding only appears when there is enough space",
      "A system does not need to take over in order to be useful",
    ],
    closingLine:
      "Wisewave is not here to optimize you. It offers a quiet space to return to yourself with a little more clarity.",
  },

  boundaries: {
    sectionTitle: "What Wisewave is not",
    body: [
      "Wisewave is not therapy.",
      "It is not a medical service.",
      "It is not crisis support.",
      "It is not coaching.",
      "It is not an authority on your life.",
      "It does not diagnose you.",
      "It does not treat you.",
      "It does not tell you what to do.",
      "It does not decide what is true for you.",
    ],
    supportLine:
      "If you are in serious psychological distress, immediate danger, or need clinical support, please contact a qualified human professional or your local emergency services.",
  },

  finalCta: {
    sectionTitle:
      "If you do not need more answers right now, only a little more room to hear yourself.",
    body: [
      "You can begin with one simple conversation.",
      "No preparation needed.",
      "No need to be clear first.",
      "Start from what is real now.",
    ],
    ctaPrimary: "Start using Wisewave",
    ctaSecondary: "Enter the reflection space",
  },

  footer: {
    line: "Wisewave",
    subline: "A quiet reflection space for clearer self-understanding.",
  },

  implementationNotes: {
    designDirection: [
      "Keep the page visually quiet, spacious, and low-pressure.",
      "Avoid heavy gradients, emotional-performance imagery, or wellness-app signals.",
      "Avoid making the product feel like a chatbot assistant, therapy platform, coaching service, or self-optimization tool.",
    ],
    ctaToneAvoid: [
      "Transform yourself",
      "Get answers",
      "Heal now",
      "Unlock your potential",
      "Start your journey",
      "Feel better fast",
    ],
    boundaryVisibility: [
      "not therapy",
      "not crisis support",
      "not coaching",
      "not advice",
    ],
  },
};
