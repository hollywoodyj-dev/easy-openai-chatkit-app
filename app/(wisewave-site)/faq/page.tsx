import type { Metadata } from "next";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { FaqPageJsonLd } from "@/components/wisewave-site/FaqPageJsonLd";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { WISEWAVE_MARKETING_FAQ_ITEMS } from "@/lib/wisewave-site/wisewave-marketing-faq-items";
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

export default function FAQPage() {
  return (
    <>
      <FaqPageJsonLd items={WISEWAVE_MARKETING_FAQ_ITEMS} />
      <PageHero
        title="FAQ"
        body="Short, boundary-safe answers: what Wisewave is, what it is not, and a few practical limits—without expanding what the product promises."
      />
      <section className="pb-12 pt-0 sm:pb-16">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <AccordionFaq items={[...WISEWAVE_MARKETING_FAQ_ITEMS]} />
        </div>
      </section>
    </>
  );
}
