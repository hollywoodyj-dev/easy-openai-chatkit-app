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
const PAGE_HEADLINE = "FAQ";

export default function FAQPage() {
  return (
    <>
      <FaqPageJsonLd items={WISEWAVE_MARKETING_FAQ_ITEMS} />
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(PAGE_HEADLINE, "/faq")}
      />
      <PageHero
        title={PAGE_HEADLINE}
        body="Short, boundary-safe answers: what Wisewave is, what it is not, and a few practical limits—without expanding what the product promises."
      />
      <section className="pb-6 pt-0 sm:pb-8">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <AccordionFaq items={[...WISEWAVE_MARKETING_FAQ_ITEMS]} />
        </div>
      </section>
      <Section title="Related reading">
        <MarketingInternalLinks title="" excludeHref="/faq" />
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
    </>
  );
}
