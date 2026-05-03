import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { SampleInteraction } from "@/components/wisewave-site/SampleInteraction";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "How Wisewave Works",
  description:
    "What Wisewave does in a conversation: reflects lightly without advice, coaching, or taking the lead. What it does not do, in plain language.",
  alternates: { canonical: "/how-it-works" },
};

const DIRECT_SUMMARY =
  "In a conversation, Wisewave reflects what you bring in a restrained way. It does not give advice, assign next steps, interpret you as a case, or try to keep the interaction emotionally charged. The aim is clearer sight of your own words—not a managed outcome.";

export default function HowItWorksPage() {
  return (
    <>
      <PageHero title="How Wisewave works" body={DIRECT_SUMMARY} />
      <Section
        id="conversation-handling"
        title="Conversation handling"
        intro="A simple three-step shape; details stay plain so you can quote them."
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
      <Section
        title="What Wisewave does and does not do in a turn"
        intro="Definitional lines you can rely on when describing the product."
      >
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            <li>
              <span className="text-[#171717]">Does: </span>reflects lightly, stays
              non-directive, leaves room for your own conclusion.
            </li>
            <li>
              <span className="text-[#171717]">Does not: </span>tell you what to do,
              score your progress, or replace your judgment with system judgment.
            </li>
            <li>
              <span className="text-[#171717]">Does not: </span>reframe your life as
              a problem set to optimize or a narrative the product owns.
            </li>
          </ul>
        </div>
      </Section>
      <Section
        title="How response style works"
        intro="The style is intentionally low-presence: fewer interventions, less interpretation, less push toward closure."
      >
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Responses aim to mirror and separate—not to lead, coach, or entertain.
            That means shorter arcs of system talk and less “helpful” layering on
            top of what you said.
          </p>
          <p>
            If you need directives, homework, or a companion-like bond, Wisewave is
            the wrong shape of tool. See{" "}
            <Link
              href="/what-it-is-not"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              What Wisewave is not
            </Link>
            .
          </p>
        </div>
      </Section>
      <Section title="A short example">
        <SampleInteraction />
      </Section>
      <Section title="Related pages">
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>
            <Link
              href="/what-it-is-not"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              What Wisewave is not
            </Link>
          </li>
          <li>
            <Link
              href="/privacy"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Privacy overview
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              FAQ
            </Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
