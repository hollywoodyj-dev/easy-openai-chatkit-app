/** Single source of truth for `/faq` visible accordion + FAQPage JSON-LD (must match exactly). */

export type WisewaveMarketingFaqItem = {
  question: string;
  answer: string;
};

/** WISEWAVE_FAQ_BOUNDARY_LINES_v1 (primary + secondary) + minimal operational lines. */
export const WISEWAVE_MARKETING_FAQ_ITEMS: readonly WisewaveMarketingFaqItem[] = [
  {
    question: "Is Wisewave an AI journal?",
    answer:
      "Not exactly. Wisewave can support reflection, but it is not a journaling prompt engine. It reflects what you share without guiding or structuring your process.",
  },
  {
    question: "Is Wisewave a coach?",
    answer:
      "No. Wisewave does not give advice, direction, goals, or action plans.",
  },
  {
    question: "Is Wisewave therapy?",
    answer:
      "No. Wisewave is not therapy, diagnosis, treatment, or crisis support.",
  },
  {
    question: "Is Wisewave an AI companion?",
    answer:
      "No. It is not designed for emotional companionship or relational attachment. It is a quiet reflection space.",
  },
  {
    question: "What does Wisewave actually do?",
    answer:
      "It reflects what you share in a restrained way, so you can see your own thoughts more clearly without being guided.",
  },
  {
    question: "Who is Wisewave for?",
    answer:
      "People who want space, not instructions. It is especially useful when your thoughts feel crowded and you do not want another system telling you what to do.",
  },
  {
    question: "Does Wisewave give advice?",
    answer:
      "No. Wisewave does not tell you what to do. Its role is reflection, not direction.",
  },
  {
    question: "Does Wisewave ask guided prompts?",
    answer:
      "Not as its core role. Wisewave is not built as a guided prompt system. It stays more restrained so your own thinking can remain in front.",
  },
  {
    question: "Is Wisewave for mental health support?",
    answer:
      "No. Wisewave is not a mental health service, therapy tool, or crisis support system.",
  },
  {
    question: "Is Wisewave like talking to a supportive friend?",
    answer:
      "No. It is not designed as a relational or companion experience. It is a low-presence reflection space.",
  },
  {
    question: "Does Wisewave analyze me?",
    answer:
      "No. Wisewave is not meant to define you or interpret you deeply. It reflects lightly so you can notice what is there more clearly.",
  },
  {
    question: "Does Wisewave help with overthinking?",
    answer:
      "It can be useful when thoughts feel crowded, but it does not coach or manage you through them. It creates space for clearer reflection.",
  },
  {
    question: "What if I want clear answers or next steps?",
    answer:
      "Wisewave may not be the right fit if what you want most is advice, action guidance, or a system that organizes answers for you.",
  },
  {
    question: "Do I need to prepare anything before using it?",
    answer:
      "No special preparation is required. You can bring something that feels unclear, mixed together, or not yet fully named.",
  },
  {
    question: "How does Wisewave handle my data?",
    answer:
      "See the Privacy page and the full policy linked from there for collection, storage, retention, and deletion in plain language.",
  },
  {
    question: "Is Wisewave suitable in a crisis?",
    answer:
      "No. Wisewave is not for crisis or emergency support. If you are in immediate danger or need urgent help, contact local emergency services or a qualified human professional.",
  },
];
