import type { Metadata } from "next";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "What Wisewave Is Not",
  description:
    "What Wisewave is not: not an assistant, not therapy, not coaching, and not manufactured companionship.",
  alternates: { canonical: "/what-it-is-not" },
};

export default function WhatItIsNotPage() {
  return (
    <>
      <PageHero
        title="What Wisewave is not"
        body="Part of understanding Wisewave clearly is understanding what it is not trying to be."
      />
      <Section title="What it is not trying to become">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [
              "Not an assistant",
              "It does not operate by answering, solving, or organizing tasks for you.",
            ],
            ["Not therapy", "It is not a clinical or therapeutic service."],
            [
              "Not coaching",
              "It does not direct you toward next steps or outcomes.",
            ],
            [
              "Not companionship",
              "It is not built to create emotional dependence or manufactured closeness.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{title}</h3>
              <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Why the boundaries matter">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            Wisewave does not create its value by entering you more deeply. Its
            value comes from knowing where it should not enter.
          </p>
        </div>
      </Section>
    </>
  );
}
