import type { Metadata } from "next";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingClosing } from "@/components/wisewave-site/SeoLandingClosing";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";

const SEO_TITLE = "Reflection AI without advice or coaching | Wisewave";
const SEO_DESCRIPTION =
  "Wisewave is a low-presence reflection AI for people who want clarity without advice, coaching, or companion-style AI.";

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  alternates: { canonical: "/reflection-ai" },
  ...wisewaveMarketingSocialMetadata(SEO_TITLE, SEO_DESCRIPTION, "/reflection-ai"),
};

const faqItems = [
  {
    question: "Is Wisewave an AI coach?",
    answer:
      "No. Wisewave does not give advice, direction, goals, or action plans.",
  },
  {
    question: "Is Wisewave therapy?",
    answer:
      "No. Wisewave is not therapy, diagnosis, treatment, or crisis support.",
  },
  {
    question: "Is Wisewave an AI journal?",
    answer:
      "Not exactly. It can support reflection, but it is not a prompt-driven journaling tool.",
  },
  {
    question: "What does Wisewave actually do?",
    answer:
      "It reflects what you share in a restrained way, so you can see your own thoughts more clearly.",
  },
];

/** Visible hero H1 — same string in BreadcrumbList leaf `name`. */
const PAGE_HEADLINE = "Reflection AI without taking over";

export default function ReflectionAiPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(PAGE_HEADLINE, "/reflection-ai")}
      />
      <SeoLandingHero title={PAGE_HEADLINE}>
        <p>
          Wisewave is not here to guide, advise, or fix you. It reflects what you
          share in a restrained way, so you can see your own thoughts more
          clearly.
        </p>
        <p>
          No coaching. No direction. No companion-style AI. Just a quieter space
          for reflection.
        </p>
      </SeoLandingHero>

      <Section title="What reflection AI usually becomes">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Many AI tools for reflection become more active over time.</p>
          <p>
            They ask more questions, make more suggestions, offer more
            interpretations, and try to prove their value by becoming more
            involved.
          </p>
          <p>That is not what Wisewave is for.</p>
          <p className="text-[#171717]">
            Wisewave is built around a different idea: sometimes clarity comes
            not from more system activity, but from less.
          </p>
        </div>
      </Section>

      <Section title="What Wisewave does">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>You bring something that is not fully clear yet.</p>
          <p>Wisewave reflects it back lightly.</p>
          <p>Not as analysis. Not as coaching. Not as advice.</p>
          <p>
            Just enough to help you notice what is there without moving in front
            of your own thinking.
          </p>
        </div>
      </Section>

      <Section title="What makes it different">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "Low presence",
              "Wisewave does not keep trying to prove its usefulness. It steps back so your own words stay in front.",
            ],
            [
              "Non-directive",
              "It does not tell you the next step. It does not turn reflection into guidance.",
            ],
            [
              "Preserves authorship",
              "Your experience remains your own. Wisewave does not define it for you.",
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

      <Section title="Who it is for">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="mb-4 text-base font-medium text-[#171717]">
            Wisewave may fit if:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            <li>you want space without advice</li>
            <li>you are tired of being guided</li>
            <li>you want reflection without companion-style AI</li>
            <li>you want clarity without being managed</li>
          </ul>
        </div>
      </Section>

      <Section title="FAQ">
        <AccordionFaq items={faqItems} />
      </Section>

      <SeoLandingClosing
        lead="If you are looking for reflection without advice, you can begin here."
        from="seo_reflection_ai"
        relatedHref="/reflection-without-advice"
        relatedLabel="Reflection without advice"
      />
    </>
  );
}
