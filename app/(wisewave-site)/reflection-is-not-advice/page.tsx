import type { Metadata } from "next";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";

export const metadata: Metadata = {
  title: "Reflection Is Not Advice",
  description:
    "Why reflection space is a different category from advice-giving systems — and why mixing them changes what you can see clearly.",
  alternates: { canonical: "/reflection-is-not-advice" },
};

export default function ReflectionIsNotAdvicePage() {
  return (
    <>
      <PageHero
        title="Reflection is not advice"
        body="Reflection makes room for what is already forming. Advice proposes a move. The two can coexist in life, but they are not the same function — and a system should not pretend they are."
      />
      <Section title="What reflection tends to do here">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <ul className="list-disc space-y-3 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            <li>Holds attention on what you brought, without replacing it.</li>
            <li>Lets parts of an experience separate slowly, without forcing closure.</li>
            <li>Keeps authorship with you — the meaning stays yours to find.</li>
          </ul>
        </div>
      </Section>
      <Section title="What advice tends to do">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <ul className="list-disc space-y-3 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            <li>Selects a path from outside your situation.</li>
            <li>Compresses complexity into a recommended move.</li>
            <li>Introduces an external standard of what counts as progress.</li>
          </ul>
        </div>
      </Section>
      <Section title="Why mixing them breaks clarity">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          If reflection and advice arrive in the same shape, the quieter work
          stops being readable. What needs time starts feeling like a problem to
          solve. What needs space starts feeling like a draft to optimize.
        </p>
        <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">
          Wisewave stays on the reflection side of the line — not because answers
          are “bad,” but because this product is built for a different job.
        </p>
      </Section>
      <Section title="Why that matters for fit">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          If you are primarily seeking clear recommendations or next-step
          guidance, a reflection-shaped interaction will feel incomplete — and
          it should, because it is intentionally incomplete in that direction.
        </p>
      </Section>
    </>
  );
}
