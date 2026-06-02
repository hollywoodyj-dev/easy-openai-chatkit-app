import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingClosing } from "@/components/wisewave-site/SeoLandingClosing";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";
import { MarketingInternalLinks } from "@/components/wisewave-site/MarketingInternalLinks";
import { WISEWAVE_REFLECTION_WITHOUT_ADVICE_INTERNAL_LINKS } from "@/lib/wisewave-site/wisewave-week3-page-internal-links";

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
          space — a quiet reflection space where you can{" "}
          <strong className="font-medium text-[#171717]">
            reflect without advice
          </strong>
          .
        </p>
        <p>
          Wisewave reflects what you share without coaching, planning, or telling
          you what to do. If you are looking for{" "}
          <strong className="font-medium text-[#171717]">
            AI reflection without advice
          </strong>{" "}
          or{" "}
          <strong className="font-medium text-[#171717]">
            self reflection without advice
          </strong>
          , this page is the primary guide to how Wisewave fits that need.
        </p>
      </SeoLandingHero>

      <Section title="What reflection without advice means">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Reflection without advice means your thinking stays in front. The
            system does not rush to interpret, instruct, or replace your
            judgment.
          </p>
          <p>
            It is not anti-help. It is a different moment: before direction is
            useful, when you need clarity more than a next step.
          </p>
          <p className="text-[#171717]">
            Quieter reflection, in this sense, is reflection with less
            interference — not silence for its own sake.
          </p>
        </div>
      </Section>

      <Section title="How AI reflection without advice is different from coaching">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Coaching assumes forward motion: goals, plans, accountability, and
            someone steering the process.
          </p>
          <p>
            AI reflection without advice assumes the opposite need: room to see
            what you already think before anything is decided for you.
          </p>
          <p>
            Wisewave does not tell you what to do, optimize your life, or hold
            you through an emotional arc. It reflects with restraint so your own
            words stay central.
          </p>
        </div>
      </Section>

      <Section title="A self reflection space without pressure or direction">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Some people want a self reflection app with prompts, frameworks, and
            guided exercises. Others want space without guidance.
          </p>
          <p>
            Wisewave is built for the second case: a self reflection space
            without pressure to perform, improve, or follow a program.
          </p>
          <p className="text-[#171717]">
            Your judgment stays central. The system steps back enough for clarity
            to emerge on your terms.
          </p>
        </div>
      </Section>

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

      <Section title="Common questions">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          For therapy, coaching, journaling, and advice boundaries, see{" "}
          <Link
            href="/faq"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            common questions about Wisewave
          </Link>
          .
        </p>
      </Section>

      <Section title="Related reading">
        <MarketingInternalLinks
          title=""
          excludeHref="/reflection-without-advice"
          links={WISEWAVE_REFLECTION_WITHOUT_ADVICE_INTERNAL_LINKS}
        />
        <p className="mt-6 text-base leading-[1.75] text-[#5c5c5c]">
          Also see{" "}
          <Link
            href="/reflection-without-advice-vs-coaching"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            reflection without advice vs coaching
          </Link>
          ,{" "}
          <Link
            href="/reflection-ai"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            reflection AI without taking over
          </Link>
          .
        </p>
      </Section>

      <SeoLandingClosing
        lead="If you want reflection without advice, Wisewave is designed for that."
        from="seo_reflection_without_advice"
        relatedHref="/how-it-works"
        relatedLabel="How Wisewave works"
        extraRelatedLinks={[
          { href: "/what-it-is-not", label: "What Wisewave is not" },
          { href: "/self-reflection-app", label: "Self reflection app" },
          { href: "/faq", label: "Common questions about Wisewave" },
        ]}
      />
    </>
  );
}
