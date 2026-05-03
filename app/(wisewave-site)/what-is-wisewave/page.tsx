import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "What Wisewave Is",
  description:
    "What Wisewave is: a low-presence reflection space, not an assistant, not coaching, and not therapy.",
  alternates: { canonical: "/what-is-wisewave" },
};

export default function WhatIsWisewavePage() {
  return (
    <>
      <PageHero
        title="What Wisewave is"
        body="Wisewave is a low-presence reflection space. It is designed to leave more room for what you bring, rather than becoming more active inside it."
      />
      <Section title="A restrained kind of AI interaction">
        <div className="space-y-4">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            Wisewave is not organized around answers, advice, or interpretation.
            It is organized around reflection.
          </p>
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            You bring something that is not fully clear yet. Wisewave reflects
            it gently, without rushing to explain, direct, or conclude for you.
          </p>
        </div>
      </Section>
      <Section title="Why that matters">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "It leaves more space",
              "Your own content stays in front instead of being replaced by system output.",
            ],
            [
              "It stays non-directive",
              "It does not move you toward a prescribed conclusion.",
            ],
            [
              "It preserves authorship",
              "Your experience remains your own, rather than being interpreted for you.",
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
      <Section title="Related pages">
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>
            <Link
              href="/what-it-is-not"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              What Wisewave is not
            </Link>
            {" — "}therapy, coaching, companion, and productivity boundaries.
          </li>
          <li>
            <Link
              href="/how-it-works"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              How Wisewave works
            </Link>
            {" — "}conversation handling in plain language.
          </li>
          <li>
            <Link
              href="/reflection-without-advice"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Reflection without advice
            </Link>
          </li>
          <li>
            <Link
              href="/privacy"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Privacy overview
            </Link>
            {" — "}data handling summary and link to the full policy.
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
