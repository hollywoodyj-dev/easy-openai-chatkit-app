import type { Metadata } from "next";
import Link from "next/link";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingClosing } from "@/components/wisewave-site/SeoLandingClosing";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";
import { MarketingInternalLinks } from "@/components/wisewave-site/MarketingInternalLinks";

export const metadata: Metadata = {
  title: WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.title,
  description: WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.description,
  alternates: {
    canonical: WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.canonicalPath,
  },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.title,
    WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.description,
    WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.canonicalPath,
  ),
};

const faqItems = [
  {
    question: "Does Wisewave give advice?",
    answer: "No. Its role is reflection, not direction.",
  },
  {
    question: "Is Wisewave a coach?",
    answer:
      "No. It does not give goals, plans, or action steps.",
  },
  {
    question: "Is Wisewave emotional support?",
    answer:
      "No. It is not designed as an emotional support or companion system.",
  },
  {
    question: "What does Wisewave do instead?",
    answer:
      "It reflects what you share in a restrained way so you can see your own thoughts more clearly.",
  },
];

const PAGE_HEADLINE = "Reflection without advice";

export default function ReflectionWithoutAdvicePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          PAGE_HEADLINE,
          "/reflection-without-advice",
        )}
      />
      <SeoLandingHero title={PAGE_HEADLINE}>
        <p>Not every thought needs advice.</p>
        <p>
          Sometimes what helps most is not more direction, but a little more
          space.
        </p>
        <p>
          Wisewave reflects what you share without coaching, planning, or telling
          you what to do.
        </p>
      </SeoLandingHero>

      <Section title="Why advice is not always what people need">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Advice can be useful.</p>
          <p>But there are moments when advice arrives too early.</p>
          <p>Before something is clear.</p>
          <p>Before the real shape of the thought has surfaced.</p>
          <p>Before your own view has had room to form.</p>
          <p className="text-[#171717]">
            Wisewave is built for that kind of moment.
          </p>
        </div>
      </Section>

      <Section title="What Wisewave does instead">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Instead of giving direction, Wisewave reflects lightly.</p>
          <p>It does not try to conclude for you.</p>
          <p>It does not turn your thoughts into an action plan.</p>
          <p>It does not explain you back to yourself.</p>
          <p>It leaves more room for clarity to emerge.</p>
        </div>
      </Section>

      <Section title="A different kind of usefulness">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Wisewave is useful not because it does more than other systems. It is
            useful because it stays restrained:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>no advice</li>
            <li>no coaching</li>
            <li>no direction</li>
            <li>no manufactured companionship</li>
          </ul>
        </div>
      </Section>

      <Section title="For people who are tired of being guided">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Some people do not need another framework, another prompt set, or
            another system telling them what to do.
          </p>
          <p>
            They need a reflection space that does not move in front of them.
          </p>
          <p className="text-[#171717]">That is where Wisewave fits.</p>
        </div>
      </Section>

      <Section title="FAQ">
        <AccordionFaq items={faqItems} />
      </Section>

      <Section title="Related reading">
        <MarketingInternalLinks
          title=""
          excludeHref="/reflection-without-advice"
        />
        <p className="mt-6 text-base leading-[1.75] text-[#5c5c5c]">
          More context:{" "}
          <Link
            href="/reflection-ai"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            Reflection AI without advice or coaching
          </Link>
          ,{" "}
          <Link
            href="/self-reflection-app"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            A self reflection app
          </Link>
          ,{" "}
          <Link
            href="/journaling-alternative"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            A journaling alternative
          </Link>
          .
        </p>
      </Section>

      <SeoLandingClosing
        lead="If you want reflection without advice, Wisewave is designed for that."
        from="seo_reflection_without_advice"
        relatedHref="/reflection-ai"
        relatedLabel="Reflection AI without advice or coaching"
        extraRelatedLinks={[
          { href: "/self-reflection-app", label: "A self reflection app" },
          { href: "/journaling-alternative", label: "A journaling alternative" },
          { href: "/faq", label: "FAQ" },
        ]}
      />
    </>
  );
}
