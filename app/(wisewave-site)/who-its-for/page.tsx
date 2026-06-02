import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { MarketingInternalLinks } from "@/components/wisewave-site/MarketingInternalLinks";
import { WISEWAVE_WHO_ITS_FOR_INTERNAL_LINKS } from "@/lib/wisewave-site/wisewave-week3-page-internal-links";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { WISEWAVE_WHO_ITS_FOR_SEO } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";

const PAGE_HEADLINE = "Who Wisewave is for";

export const metadata: Metadata = {
  title: WISEWAVE_WHO_ITS_FOR_SEO.title,
  description: WISEWAVE_WHO_ITS_FOR_SEO.description,
  alternates: { canonical: WISEWAVE_WHO_ITS_FOR_SEO.canonicalPath },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_WHO_ITS_FOR_SEO.title,
    WISEWAVE_WHO_ITS_FOR_SEO.description,
    WISEWAVE_WHO_ITS_FOR_SEO.canonicalPath,
  ),
};

export default function WhoItsForPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          PAGE_HEADLINE,
          WISEWAVE_WHO_ITS_FOR_SEO.canonicalPath,
        )}
      />
      <PageHero
        title={PAGE_HEADLINE}
        body="Wisewave is not for everyone. It is built for people who want a quieter, more restrained form of reflection."
      />
      <Section title="It may fit people like this">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [
              "Quiet thinker",
              "You are already reflective. What you need is less interruption, not more system activity.",
            ],
            [
              "Over-advised person",
              "You have taken in enough methods, suggestions, and frameworks. Another layer of instruction is not what you need.",
            ],
            [
              "Journaling dropout",
              "You may want reflection, but not the friction of prompts, blank pages, or turning it into a task.",
            ],
            [
              "Uncomfortable with companion-style AI",
              "You want something restrained, not something that gets close to you or becomes emotionally sticky.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{title}</h3>
              <p className="mt-2 text-base leading-[1.75] text-[#5c5c5c]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="It may not fit if you want clear answers">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            If what you want most is advice, action guidance, emotional support,
            or a system that organizes answers for you, Wisewave may not be the
            right fit.
          </p>
        </div>
      </Section>
      <Section title="Related reading">
        <MarketingInternalLinks
          title=""
          excludeHref="/who-its-for"
          links={WISEWAVE_WHO_ITS_FOR_INTERNAL_LINKS}
        />
      </Section>
    </>
  );
}
