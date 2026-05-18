import type { Metadata } from "next";
import Link from "next/link";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { AnalyticsView } from "@/components/wisewave-site/AnalyticsView";
import { Section } from "@/components/wisewave-site/Section";
import { TrackButton } from "@/components/wisewave-site/TrackButton";
import { wisewaveLandingCopy as copy } from "@/lib/wisewave-site/wisewave-landing-copy";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";

/** Canonical strings: `lib/wisewave-site/wisewave-landing-copy.ts` (+ JSON twin). */
const HOME_TITLE = "Wisewave — A quiet reflection space";
const HOME_DESCRIPTION = copy.hero.subheadline;

const listClass =
  "list-disc space-y-3 pl-5 text-base leading-[1.8] text-[#5c5c5c] marker:text-[#9a9a9a]";
const bodyClass = "text-base leading-[1.8] text-[#5c5c5c]";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  ...wisewaveMarketingSocialMetadata(HOME_TITLE, HOME_DESCRIPTION, "/", {
    twitterCard: "summary",
  }),
};

export default function WisewaveMarketingHome() {
  return (
    <>
      <section className="pb-16 pt-12 sm:pb-20 sm:pt-16">
        <div className="mx-auto w-full max-w-[44rem] px-6 sm:px-8">
          <AnalyticsView section="hero" />
          <div />
          <div className="max-w-2xl">
            <p className="text-sm tracking-[0.02em] text-[#5c5c5c]">Wisewave</p>
            <h1 className="mt-4 text-4xl font-medium leading-[1.15] tracking-[-0.03em] text-[#171717] sm:text-[2.75rem]">
              {copy.hero.headline}
            </h1>
            <p className={`mt-6 max-w-xl ${bodyClass}`}>{copy.hero.subheadline}</p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <TrackButton
                href="/login?from=hero"
                className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="homepage_primary_cta_click"
                eventPayload={{ location: "hero" }}
              >
                {copy.hero.ctaPrimary}
              </TrackButton>
              <Link
                href="/who-its-for"
                className="text-sm text-[#5c5c5c] underline decoration-[#e7e1d8] underline-offset-4 transition hover:text-[#171717] hover:decoration-[#171717]"
              >
                {copy.hero.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[44rem] px-6 sm:px-8">
          <AnalyticsView section="transition" />
          <h2 className="max-w-xl text-2xl font-medium leading-snug tracking-[-0.02em] text-[#171717] sm:text-3xl">
            {copy.transition.headline}
          </h2>
          <p className={`mt-5 max-w-xl ${bodyClass}`}>{copy.transition.body}</p>
        </div>
      </section>

      <Section title={copy.selfRecognition.sectionTitle} spacious>
        <AnalyticsView section="self_recognition" />
        <ul className={listClass}>
          {copy.selfRecognition.fitItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={copy.whatYouReceive.sectionTitle} spacious>
        <AnalyticsView section="what_you_receive" />
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-10">
          {copy.whatYouReceive.cards.map((card) => (
            <div key={card.title}>
              <h3 className="text-base font-medium text-[#171717]">{card.title}</h3>
              <p className={`mt-2 ${bodyClass}`}>{card.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={copy.useCases.sectionTitle} spacious>
        <AnalyticsView section="use_cases" />
        <ul className={listClass}>
          {copy.useCases.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>

      <Section title={copy.whatIsNot.sectionTitle} spacious>
        <AnalyticsView section="what_is_not" />
        <div className="max-w-2xl rounded-lg bg-[#f3f1ec]/80 px-5 py-6 sm:px-6 sm:py-7">
          <p className={bodyClass}>{copy.whatIsNot.intro}</p>
          <ul className={`mt-4 ${listClass}`}>
            {copy.whatIsNot.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-base leading-[1.8] text-[#171717]">
            {copy.whatIsNot.shortLine}
          </p>
        </div>
      </Section>

      <Section title={copy.whyReturn.sectionTitle} spacious>
        <AnalyticsView section="why_people_return" />
        <div className="max-w-2xl space-y-4">
          {copy.whyReturn.body.map((p) => (
            <p key={p} className={bodyClass}>
              {p}
            </p>
          ))}
          <ul className={listClass}>
            {copy.whyReturn.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-base leading-[1.8] text-[#171717]">
            {copy.whyReturn.subscriptionLine}
          </p>
          <div className="pt-2">
            <TrackButton
              href="/login?from=why_return"
              className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
              eventName="homepage_primary_cta_click"
              eventPayload={{ location: "why_return" }}
            >
              {copy.whyReturn.cta}
            </TrackButton>
          </div>
        </div>
      </Section>

      <Section title={copy.boundaries.sectionTitle} spacious>
        <AnalyticsView section="boundaries" />
        <div className="max-w-2xl">
          <p className={bodyClass}>{copy.boundaries.intro}</p>
          <ul className={`mt-4 ${listClass}`}>
            {copy.boundaries.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-base leading-[1.8] text-[#171717]">
            {copy.boundaries.shortLine}
          </p>
        </div>
      </Section>

      <Section title={copy.faq.sectionTitle} spacious>
        <AnalyticsView section="faq" />
        <AccordionFaq items={copy.faq.items} />
        <div className="mt-5 text-sm text-[#5c5c5c]">
          <Link
            href="/faq"
            className="underline decoration-[#e7e1d8] underline-offset-4 hover:text-[#171717] hover:decoration-[#171717]"
          >
            View full FAQ
          </Link>
        </div>
      </Section>
    </>
  );
}
