import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "What Wisewave Is Not",
  description:
    "Wisewave is not therapy, coaching, companion AI, or a productivity assistant. Plain-language boundary definitions you can quote.",
  alternates: { canonical: "/what-it-is-not" },
};

const DIRECT_ANSWER =
  "Wisewave is a low-presence reflection space. It is not therapy, not coaching, not companion-style AI, and not a tool for optimizing your schedule or output. It does not sell answers, plans, or emotional closeness as the product.";

export default function WhatItIsNotPage() {
  return (
    <>
      <PageHero title="What Wisewave is not" body={DIRECT_ANSWER} />
      <Section
        title="Four boundaries"
        intro="Each line below is a deliberate limit on what the product tries to be."
      >
        <div className="space-y-8">
          <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
            <h3 className="text-lg font-medium text-[#171717]">Not therapy</h3>
            <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">
              Wisewave is not clinical care, diagnosis, treatment, or crisis
              support. It does not replace a qualified professional when you need
              one.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
            <h3 className="text-lg font-medium text-[#171717]">Not coaching</h3>
            <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">
              It does not set goals, assign homework, or steer you toward outcomes.
              There is no “program” to complete and no accountability layer for
              your life decisions.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
            <h3 className="text-lg font-medium text-[#171717]">
              Not companion-style AI
            </h3>
            <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">
              It is not built for relational attachment, emotional dependence, or
              the feeling of a persistent friend who “knows” you. Presence stays
              low so your own words stay in front.
            </p>
          </div>
          <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
            <h3 className="text-lg font-medium text-[#171717]">
              Not productivity optimization or task assistance
            </h3>
            <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">
              It is not an assistant that answers requests, manages your calendar,
              or improves throughput. It does not frame reflection as performance or
              efficiency.
            </p>
          </div>
        </div>
      </Section>
      <Section title="What Wisewave does instead">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            It reflects what you share in a restrained way—enough to help you see
            your own thinking more clearly, without directing it.
          </p>
          <p className="text-[#171717]">
            That role is narrow on purpose. The boundaries above are how that
            narrow role stays honest.
          </p>
        </div>
      </Section>
      <Section title="Why these boundaries matter">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            When a tool blurs therapy, coaching, companionship, or productivity, it
            asks for more trust than its design can justify. Wisewave keeps those
            lanes separate so you are not nudged into dependence, advice, or
            hidden agendas.
          </p>
          <p>
            The product does not create value by pushing deeper into your life. It
            creates value by knowing where not to go.
          </p>
        </div>
      </Section>
      <Section title="Related pages">
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>
            <Link
              href="/how-it-works"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              How Wisewave works
            </Link>
            {" — "}conversation shape and handling.
          </li>
          <li>
            <Link
              href="/reflection-without-advice"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Reflection without advice
            </Link>
            {" — "}how reflection stays non-directive.
          </li>
          <li>
            <Link
              href="/faq"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              FAQ
            </Link>
            {" — "}short boundary Q&amp;As.
          </li>
          <li>
            <Link
              href="/privacy"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Privacy overview
            </Link>
            {" — "}data handling in plain language; link to the full policy.
          </li>
        </ul>
      </Section>
    </>
  );
}
