import type { Metadata } from "next";
import Link from "next/link";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingClosing } from "@/components/wisewave-site/SeoLandingClosing";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";

const SEO_TITLE = "A journaling alternative for people tired of prompts | Wisewave";
const SEO_DESCRIPTION =
  "Wisewave is a journaling alternative for people who want reflection without guided prompts, coaching, or companion-style AI. A quiet reflection space.";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: { canonical: "/journaling-alternative" },
  ...wisewaveMarketingSocialMetadata(
    SEO_TITLE,
    SEO_DESCRIPTION,
    "/journaling-alternative",
  ),
};

const faqItems = [
  {
    question: "Is Wisewave a journaling app?",
    answer:
      "Not exactly. It can support reflection, but it is not a guided prompt engine.",
  },
  {
    question: "Does Wisewave replace journaling?",
    answer:
      "Not necessarily. It offers a different kind of reflection space for people who do not want blank-page pressure or guided prompts.",
  },
  {
    question: "Is Wisewave coaching?",
    answer: "No. It does not guide, coach, or plan for you.",
  },
  {
    question: "Who is this for?",
    answer:
      "People who want a quieter alternative to prompt-driven journaling.",
  },
];

const PAGE_HEADLINE =
  "A journaling alternative when prompts are not what you want";

export default function JournalingAlternativePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          PAGE_HEADLINE,
          "/journaling-alternative",
        )}
      />
      <SeoLandingHero title={PAGE_HEADLINE}>
        <p>Journaling helps some people think clearly.</p>
        <p>
          For others, a blank page feels too open — and guided prompts feel too
          controlling.
        </p>
        <p>Wisewave offers a different kind of reflection space:</p>
        <p>
          not blank-page pressure, not prompt-driven structure, not AI coaching.
          Just a quieter way to think through what is there.
        </p>
      </SeoLandingHero>

      <Section title="When journaling does not quite fit">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Sometimes journaling does not work because the page stays blank.</p>
          <p>Sometimes it does not work because the structure feels imposed.</p>
          <p>If both extremes miss the mark, Wisewave may fit in between.</p>
        </div>
      </Section>

      <Section title="Not a prompt engine">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Wisewave is not built as a journaling prompt system.</p>
          <p>
            It does not try to lead your reflection through a sequence of
            questions or exercises. It stays more restrained so your own process
            can remain in front.
          </p>
        </div>
      </Section>

      <Section title="Not a coach, not a companion">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Wisewave is also not:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>an AI coach</li>
            <li>a therapist-like guide</li>
            <li>a companion AI</li>
            <li>a motivational system</li>
          </ul>
          <p className="pt-2">
            Its role is smaller and clearer: to reflect what you share, lightly.
          </p>
        </div>
      </Section>

      <Section title="What makes it different">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "Less pressure",
              "You do not need to perform insight.",
            ],
            [
              "Less direction",
              "You are not pushed through a system.",
            ],
            [
              "More authorship",
              "Your words and your thinking remain in front.",
            ],
          ].map(([t, b]) => (
            <div
              key={t}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{t}</h3>
              <p className="mt-2 text-base leading-[1.75] text-[#5c5c5c]">{b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="FAQ">
        <AccordionFaq items={faqItems} />
      </Section>

      <Section title="Related reading">
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>
            <Link
              href="/"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Wisewave homepage
            </Link>
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
              href="/reflection-ai"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Reflection AI without advice or coaching
            </Link>
          </li>
          <li>
            <Link
              href="/self-reflection-app"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              A self reflection app
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Full FAQ
            </Link>
          </li>
        </ul>
      </Section>

      <SeoLandingClosing
        lead="If you are looking for a quieter alternative to prompt-driven journaling, you can begin here."
        from="seo_journaling_alternative"
        relatedHref="/self-reflection-app"
        relatedLabel="A self reflection app"
        extraRelatedLinks={[
          { href: "/reflection-without-advice", label: "Reflection without advice" },
          { href: "/reflection-ai", label: "Reflection AI without advice or coaching" },
          { href: "/faq", label: "FAQ" },
        ]}
      />
    </>
  );
}
