import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingClosing } from "@/components/wisewave-site/SeoLandingClosing";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { WISEWAVE_SELF_REFLECTION_APP_SEO } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";
import { MarketingInternalLinks } from "@/components/wisewave-site/MarketingInternalLinks";
import { TopicClusterHubLink } from "@/components/wisewave-site/TopicClusterHubLink";
import { WISEWAVE_SELF_REFLECTION_APP_INTERNAL_LINKS } from "@/lib/wisewave-site/wisewave-week3-page-internal-links";

export const metadata: Metadata = {
  title: WISEWAVE_SELF_REFLECTION_APP_SEO.title,
  description: WISEWAVE_SELF_REFLECTION_APP_SEO.description,
  alternates: { canonical: WISEWAVE_SELF_REFLECTION_APP_SEO.canonicalPath },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_SELF_REFLECTION_APP_SEO.title,
    WISEWAVE_SELF_REFLECTION_APP_SEO.description,
    WISEWAVE_SELF_REFLECTION_APP_SEO.canonicalPath,
  ),
};

const PAGE_HEADLINE =
  "A self reflection app for people who do not want to be guided";

export default function SelfReflectionAppPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          PAGE_HEADLINE,
          "/self-reflection-app",
        )}
      />
      <TopicClusterHubLink context="self-reflection-app" />
      <SeoLandingHero title={PAGE_HEADLINE}>
        <p>
          Wisewave is a self reflection app, but not in the usual sense. It does
          not try to coach you, improve you, or lead you through a process.
        </p>
        <p>
          It gives you a quieter space to reflect, so your own thoughts can come
          forward more clearly.
        </p>
      </SeoLandingHero>

      <Section title="Reflection without structure taking over">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Some people want prompts, frameworks, and guided exercises.</p>
          <p>Others do not.</p>
          <p>
            If too much structure makes reflection feel managed, Wisewave offers a
            different kind of space — one that stays more restrained and leaves
            more room for your own process.
          </p>
        </div>
      </Section>

      <Section title="When self-reflection feels crowded">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Self-reflection is not always hard because there is nothing there.
          </p>
          <p>Sometimes it is hard because there is too much:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>too many thoughts</li>
            <li>too many interpretations</li>
            <li>too many voices</li>
            <li>too many systems trying to help</li>
          </ul>
          <p className="pt-2">Wisewave does less, so you can hear more clearly.</p>
        </div>
      </Section>

      <Section title="What you receive">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="mb-4 text-base font-medium text-[#171717]">
            With Wisewave, you receive:
          </p>
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            <li>a little more clarity</li>
            <li>a little less noise</li>
            <li>a reflection that does not take over</li>
            <li>a space that stays low-presence</li>
          </ul>
        </div>
      </Section>

      <Section title="Fit and boundaries">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          This page is for the self reflection app query—space without prompts or
          guidance. For audience fit, see{" "}
          <Link
            href="/who-its-for"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            who Wisewave is for
          </Link>
          ; for boundaries, see the{" "}
          <Link
            href="/faq"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            FAQ
          </Link>
          .
        </p>
      </Section>

      <Section title="Related reading">
        <MarketingInternalLinks
          title=""
          excludeHref="/self-reflection-app"
          links={WISEWAVE_SELF_REFLECTION_APP_INTERNAL_LINKS}
        />
      </Section>

      <SeoLandingClosing
        lead="If you want space, not instructions, you can begin here."
        from="seo_self_reflection_app"
        relatedHref="/reflection-without-advice"
        relatedLabel="Reflection without advice"
        extraRelatedLinks={[
          { href: "/journaling-alternative", label: "Journaling alternative" },
          { href: "/who-its-for", label: "Who Wisewave is for" },
          { href: "/faq", label: "Common questions about Wisewave" },
        ]}
      />
    </>
  );
}
