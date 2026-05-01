import type { Metadata } from "next";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { SampleInteraction } from "@/components/wisewave-site/SampleInteraction";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "How Wisewave Works",
  description:
    "How Wisewave works: you bring something unclear, Wisewave reflects it gently, and some things become clearer through reflection — without advice or coaching.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        title="How Wisewave works"
        body="Wisewave does not organize a session around advice or direction. It works by reflecting what you bring, without rushing to conclude for you."
      />
      <Section
        id="conversation-handling"
        title="The basic shape"
        intro="How Wisewave handles a conversation: reflect lightly, without rushing to conclude or direct you."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "1. You bring something unclear",
              "A recurring thought, an unresolved tension, or something still mixed together.",
            ],
            [
              "2. Wisewave reflects it",
              "No forced framing. No advice. No pressure toward a neat answer.",
            ],
            [
              "3. More separation becomes possible",
              "Sometimes what is there begins to appear more plainly through reflection.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{title}</h3>
              <p className="mt-2 text-base leading-[1.75] text-[#5c5c5c]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="A simple example">
        <SampleInteraction />
      </Section>
    </>
  );
}
