import type { Metadata } from "next";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { MarketingInternalLinks } from "@/components/wisewave-site/MarketingInternalLinks";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingClosing } from "@/components/wisewave-site/SeoLandingClosing";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { WISEWAVE_QUIET_REFLECTION_SEO } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";

export const metadata: Metadata = {
  title: WISEWAVE_QUIET_REFLECTION_SEO.title,
  description: WISEWAVE_QUIET_REFLECTION_SEO.description,
  alternates: { canonical: WISEWAVE_QUIET_REFLECTION_SEO.canonicalPath },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_QUIET_REFLECTION_SEO.title,
    WISEWAVE_QUIET_REFLECTION_SEO.description,
    WISEWAVE_QUIET_REFLECTION_SEO.canonicalPath,
  ),
};

/** Visible H1 — matches BreadcrumbList leaf. */
const PAGE_HEADLINE = "Quiet reflection";

const faqItems = [
  {
    question: "Is quiet reflection the same as therapy?",
    answer:
      "No. Quiet reflection here means room to think in writing—not diagnosis, treatment, or clinical care.",
  },
  {
    question: "Does Wisewave give advice during quiet reflection?",
    answer: "No. It reflects with restraint so your judgment stays central.",
  },
  {
    question: "Is this a wellness or self-help app?",
    answer:
      "No. It is not built for healing journeys, habit coaching, or motivational programs.",
  },
  {
    question: "Who is quiet reflection for?",
    answer:
      "People who want clearer thinking with less interference—not more direction from an AI.",
  },
];

export default function QuietReflectionPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          PAGE_HEADLINE,
          WISEWAVE_QUIET_REFLECTION_SEO.canonicalPath,
        )}
      />
      <SeoLandingHero title={PAGE_HEADLINE}>
        <p>
          Quiet reflection is reflection with less noise: room to hear what you
          already think, without advice, coaching, or takeover.
        </p>
        <p>
          Wisewave is built for that kind of space—not for more stimulation, more
          guidance, or a stronger system voice.
        </p>
      </SeoLandingHero>

      <Section title="What quiet reflection means here">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            In everyday use, &ldquo;quiet reflection&rdquo; often gets blurred into
            wellness, journaling prompts, or emotional care products.
          </p>
          <p>
            On Wisewave it means something narrower: a{" "}
            <strong className="font-medium text-[#171717]">
              low-interference reflection space
            </strong>{" "}
            where you can sort thinking in writing and see it more clearly.
          </p>
          <p>
            The system stays restrained. It does not rush to interpret, instruct,
            or replace your judgment.
          </p>
        </div>
      </Section>

      <Section title="Reflection without advice or takeover">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Many AI tools move quickly to advice, frameworks, or next steps. That
            can help in some contexts—but it can also arrive before your own view
            has formed.
          </p>
          <p>
            Quiet reflection assumes the opposite need:{" "}
            <strong className="font-medium text-[#171717]">
              clarity without takeover
            </strong>
            . Wisewave reflects what you share without telling you what to do.
          </p>
        </div>
      </Section>

      <Section title="Why less interference matters">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            When interference is high, reflection turns into reaction—to the
            tool&apos;s suggestions, tone, or implied goals.
          </p>
          <p>
            Less interference keeps your thinking in front: fewer prompts to
            perform, fewer pushes toward optimization, fewer companion-style
            closeness cues.
          </p>
          <p className="text-[#171717]">
            That is the practical difference quiet reflection is aiming at—not
            silence for its own sake, but mental legibility.
          </p>
        </div>
      </Section>

      <Section title="Who quiet reflection fits">
        <ul className="list-disc space-y-3 pl-5 text-base leading-[1.75] text-[#5c5c5c] marker:text-[#9a9a9a]">
          <li>you want reflection without being guided</li>
          <li>your thoughts feel crowded and you do not want more advice</li>
          <li>you think in writing and want language that sorts, not directs</li>
          <li>you are tired of advice-heavy AI that interprets too fast</li>
          <li>you want your own judgment to stay central</li>
        </ul>
        <p className="mt-5 text-base leading-[1.75] text-[#5c5c5c]">
          It may not fit if you want coaching, emotional companionship, clinical
          care, or a productivity assistant.
        </p>
      </Section>

      <Section title="What Wisewave is not">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Quiet reflection on Wisewave is not:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>therapy or clinical treatment</li>
            <li>coaching or goal programs</li>
            <li>companion-style or emotional-dependence AI</li>
            <li>wellness, healing, or self-help motivation</li>
            <li>a generic chatbot or task assistant</li>
          </ul>
          <p>
            Boundaries are part of the product shape—not a disclaimer added after
            the fact.
          </p>
        </div>
      </Section>

      <Section title="Common questions">
        <AccordionFaq items={faqItems} />
      </Section>

      <Section title="Related reading">
        <MarketingInternalLinks title="" excludeHref="/quiet-reflection" />
      </Section>

      <SeoLandingClosing
        lead="If quiet reflection without advice is what you are looking for, Wisewave is built for that."
        from="seo_quiet_reflection"
        relatedHref="/reflection-without-advice"
        relatedLabel="Reflection without advice"
        extraRelatedLinks={[
          { href: "/who-its-for", label: "See if it fits" },
          { href: "/what-it-is-not", label: "What Wisewave is not" },
          { href: "/reflection-ai", label: "Reflection AI without advice or coaching" },
        ]}
      />
    </>
  );
}
