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

const FAQ_TITLE = "FAQ";
const FAQ_DESCRIPTION =
  "Boundary-safe answers about Wisewave: reflection space, not coach, therapy, companion, or crisis support. Data and fit in plain language.";

export const metadata: Metadata = {
  title: FAQ_TITLE,
  description: FAQ_DESCRIPTION,
  alternates: { canonical: "/faq" },
  ...wisewaveMarketingSocialMetadata(FAQ_TITLE, FAQ_DESCRIPTION, "/faq"),
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
      <Section title="Related pages">
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>
            <Link
              href="/what-it-is-not"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              What Wisewave is not
            </Link>
          </li>
          <li>
            <Link
              href="/how-it-works"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              How Wisewave works
            </Link>
          </li>
          <li>
            <Link
              href="/privacy"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Privacy overview
            </Link>
          </li>
          <li>
            <Link
              href="/reflection-without-advice"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Reflection without advice
            </Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
