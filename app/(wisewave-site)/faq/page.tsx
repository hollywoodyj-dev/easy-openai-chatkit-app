import type { Metadata } from "next";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { PageHero } from "@/components/wisewave-site/PageHero";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Boundary-safe answers about Wisewave: reflection space, not coach, therapy, companion, or crisis support. Data and fit in plain language.",
  alternates: { canonical: "/faq" },
};

/** WISEWAVE_FAQ_BOUNDARY_LINES_v1 (primary + secondary) + minimal operational lines. */
const faqItems = [
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

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="FAQ"
        body="Short, boundary-safe answers: what Wisewave is, what it is not, and a few practical limits—without expanding what the product promises."
      />
      <section className="pb-12 pt-0 sm:pb-16">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <AccordionFaq items={faqItems} />
        </div>
      </section>
    </>
  );
}
