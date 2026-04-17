import type { Metadata } from "next";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { PageHero } from "@/components/wisewave-site/PageHero";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Wisewave: fit, advice boundaries, data handling, and crisis limits. A low-presence reflection space, not an assistant.",
  alternates: { canonical: "/faq" },
};

const faqItems = [
  {
    question: "Is Wisewave an AI assistant?",
    answer:
      "No. Wisewave is not designed as an assistant. It is a low-presence reflection space, not a system for answering, organizing, or directing.",
  },
  {
    question: "Does Wisewave give advice?",
    answer:
      "No. Wisewave does not provide advice or tell you what to do. It reflects what you bring without moving into direction or instruction.",
  },
  {
    question: "Is Wisewave therapy or coaching?",
    answer:
      "No. Wisewave is not therapy, coaching, or a clinical service. It is also not a substitute for those forms of support.",
  },
  {
    question: "Am I the right fit for Wisewave?",
    answer:
      "Wisewave may fit if you want a quieter, more restrained reflection space and do not want the system to become highly directive or emotionally close.",
  },
  {
    question: "What if I want clear answers?",
    answer:
      "Wisewave may not be the right fit if what you want most is advice, clear action guidance, or a system that organizes answers for you.",
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
    question: "Is this suitable in a crisis?",
    answer:
      "No. Wisewave is not for crisis or emergency support. If you are in immediate danger or need urgent help, contact local emergency services or a qualified crisis support service right away.",
  },
];

export default function FAQPage() {
  return (
    <>
      <PageHero
        title="FAQ"
        body="Short answers to common questions about what Wisewave is, what it is not, and who it may fit."
      />
      <section className="pb-16 pt-0 sm:pb-24">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <AccordionFaq items={faqItems} />
        </div>
      </section>
    </>
  );
}
