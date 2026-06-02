import type { Metadata } from "next";
import Link from "next/link";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { FaqPageJsonLd } from "@/components/wisewave-site/FaqPageJsonLd";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";
import { WISEWAVE_MARKETING_FAQ_ITEMS } from "@/lib/wisewave-site/wisewave-marketing-faq-items";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { WISEWAVE_FAQ_SEO } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";
import { MarketingInternalLinks } from "@/components/wisewave-site/MarketingInternalLinks";
import { WISEWAVE_FAQ_INTERNAL_LINKS } from "@/lib/wisewave-site/wisewave-week3-page-internal-links";

export const metadata: Metadata = {
  title: WISEWAVE_FAQ_SEO.title,
  description: WISEWAVE_FAQ_SEO.description,
  alternates: { canonical: WISEWAVE_FAQ_SEO.canonicalPath },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_FAQ_SEO.title,
    WISEWAVE_FAQ_SEO.description,
    WISEWAVE_FAQ_SEO.canonicalPath,
  ),
};

/** Visible PageHero H1 — same string as BreadcrumbList leaf `name`. */
const PAGE_HEADLINE = "Frequently asked questions";

export default function FAQPage() {
  return (
    <>
      <FaqPageJsonLd items={WISEWAVE_MARKETING_FAQ_ITEMS} />
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(PAGE_HEADLINE, "/faq")}
      />
      <PageHero
        title={PAGE_HEADLINE}
        body="Direct answers about what Wisewave is, what it is not, who it fits, and where its limits are—without therapy, coaching, or companion framing."
      />
      <section className="pb-6 pt-0 sm:pb-8">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <AccordionFaq items={[...WISEWAVE_MARKETING_FAQ_ITEMS]} />
        </div>
      </section>
      <Section title="Related reading">
        <MarketingInternalLinks
          title=""
          excludeHref="/faq"
          links={WISEWAVE_FAQ_INTERNAL_LINKS}
        />
        <p className="mt-6 text-base leading-[1.75] text-[#5c5c5c]">
          Comparison:{" "}
          <Link
            href="/reflection-without-advice-vs-coaching"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            Reflection without advice vs coaching
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
