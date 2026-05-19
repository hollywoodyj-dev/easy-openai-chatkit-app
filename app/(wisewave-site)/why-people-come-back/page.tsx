import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { MarketingInternalLinks } from "@/components/wisewave-site/MarketingInternalLinks";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";
import { wisewaveLandingCopy as copy } from "@/lib/wisewave-site/wisewave-landing-copy";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { WISEWAVE_WHY_PEOPLE_COME_BACK_SEO } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";

const PAGE_HEADLINE = "Why people come back";

export const metadata: Metadata = {
  title: WISEWAVE_WHY_PEOPLE_COME_BACK_SEO.title,
  description: WISEWAVE_WHY_PEOPLE_COME_BACK_SEO.description,
  alternates: {
    canonical: WISEWAVE_WHY_PEOPLE_COME_BACK_SEO.canonicalPath,
  },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_WHY_PEOPLE_COME_BACK_SEO.title,
    WISEWAVE_WHY_PEOPLE_COME_BACK_SEO.description,
    WISEWAVE_WHY_PEOPLE_COME_BACK_SEO.canonicalPath,
  ),
};

const listClass =
  "list-disc space-y-3 pl-5 text-base leading-[1.75] text-[#5c5c5c] marker:text-[#9a9a9a]";

export default function WhyPeopleComeBackPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          PAGE_HEADLINE,
          WISEWAVE_WHY_PEOPLE_COME_BACK_SEO.canonicalPath,
        )}
      />
      <PageHero
        title={PAGE_HEADLINE}
        body="People return to Wisewave for quieter reflection when clear judgment matters — not for more advice, stimulation, or system activity."
      />
      <Section title="Less interference, not more output">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            {copy.whyReturn.body[0]}
          </p>
          <p>
            They return because some moments need a quieter place to return to:
          </p>
          <ul className={listClass}>
            {copy.whyReturn.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>
      <Section title="When reflection matters again">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">
          {copy.whyReturn.subscriptionLine}
        </p>
      </Section>
      <Section title="Related reading">
        <MarketingInternalLinks title="" excludeHref="/why-people-come-back" />
      </Section>
    </>
  );
}
