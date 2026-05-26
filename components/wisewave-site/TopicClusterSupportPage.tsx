import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingClosing } from "@/components/wisewave-site/SeoLandingClosing";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { REFLECTION_WITHOUT_ADVICE_PRIMARY_PATH } from "@/lib/wisewave-site/wisewave-reflection-without-advice-cluster";

const bodyClass = "space-y-4 text-base leading-[1.75] text-[#5c5c5c]";

export function buildTopicSupportMetadata(entry: {
  title: string;
  description: string;
  canonicalPath: `/${string}`;
}): Metadata {
  return {
    title: entry.title,
    description: entry.description,
    alternates: { canonical: entry.canonicalPath },
    ...wisewaveMarketingSocialMetadata(
      entry.title,
      entry.description,
      entry.canonicalPath,
    ),
  };
}

export function TopicClusterSupportPage({
  headline,
  canonicalPath,
  hero,
  sections,
  from,
}: {
  headline: string;
  canonicalPath: `/${string}`;
  hero: ReactNode;
  sections: { title: string; body: ReactNode }[];
  from: string;
}) {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(headline, canonicalPath)}
      />
      <SeoLandingHero title={headline}>{hero}</SeoLandingHero>

      <div className="mx-auto -mt-4 mb-8 w-full max-w-[48rem] px-6 sm:px-8">
        <p className="max-w-3xl text-base leading-[1.75] text-[#5c5c5c]">
          This page supports our primary guide on{" "}
          <Link
            href={REFLECTION_WITHOUT_ADVICE_PRIMARY_PATH}
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            reflection without advice
          </Link>
          .
        </p>
      </div>

      {sections.map((section) => (
        <Section key={section.title} title={section.title}>
          <div className={bodyClass}>{section.body}</div>
        </Section>
      ))}

      <SeoLandingClosing
        lead="For the full picture on reflection without advice, start with the primary guide."
        from={from}
        relatedHref={REFLECTION_WITHOUT_ADVICE_PRIMARY_PATH}
        relatedLabel="Reflection without advice"
        extraRelatedLinks={[
          { href: "/reflection-ai", label: "Reflection AI without advice or coaching" },
          { href: "/quiet-reflection", label: "Quiet reflection" },
        ]}
      />
    </>
  );
}
