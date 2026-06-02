import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingClosing } from "@/components/wisewave-site/SeoLandingClosing";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { WISEWAVE_REFLECTION_AI_SEO } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";
import { MarketingInternalLinks } from "@/components/wisewave-site/MarketingInternalLinks";
import { TopicClusterHubLink } from "@/components/wisewave-site/TopicClusterHubLink";
import { WISEWAVE_REFLECTION_AI_INTERNAL_LINKS } from "@/lib/wisewave-site/wisewave-week3-page-internal-links";

export const metadata: Metadata = {
  title: WISEWAVE_REFLECTION_AI_SEO.title,
  description: WISEWAVE_REFLECTION_AI_SEO.description,
  alternates: { canonical: WISEWAVE_REFLECTION_AI_SEO.canonicalPath },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_REFLECTION_AI_SEO.title,
    WISEWAVE_REFLECTION_AI_SEO.description,
    WISEWAVE_REFLECTION_AI_SEO.canonicalPath,
  ),
};

/** Visible hero H1 — same string in BreadcrumbList leaf `name`. */
const PAGE_HEADLINE = "Reflection AI without taking over";

export default function ReflectionAiPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(PAGE_HEADLINE, "/reflection-ai")}
      />
      <TopicClusterHubLink context="reflection-ai" />
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

      <Section title="How people describe what they want here">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Many people arrive while searching for reflection AI without advice
            or reflection AI without coaching. The through-line is the same: a
            quiet reflection space where the system stays restrained and your own
            words stay in front.
          </p>
        </div>
      </Section>

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

      <Section title="Related reading">
        <MarketingInternalLinks
          title=""
          excludeHref="/reflection-ai"
          links={WISEWAVE_REFLECTION_AI_INTERNAL_LINKS}
        />
      </Section>

      <SeoLandingClosing
        lead="If you are looking for reflection without advice, you can begin here."
        from="seo_reflection_ai"
        relatedHref="/reflection-without-advice"
        relatedLabel="Reflection without advice"
        extraRelatedLinks={[
          { href: "/how-it-works", label: "How Wisewave works" },
          { href: "/what-it-is-not", label: "What Wisewave is not" },
        ]}
      />
    </>
  );
}
