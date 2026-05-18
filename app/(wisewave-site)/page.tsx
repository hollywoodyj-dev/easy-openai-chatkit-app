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
const HOME_DESCRIPTION =
  "A quiet reflection space for reflection without advice. Wisewave is for people who want clarity without being guided, coached, or taken over.";

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
      <section className="pb-10 pt-10 sm:pb-14 sm:pt-14">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <AnalyticsView section="hero" />
          <div className="max-w-3xl">
            <p className="text-sm tracking-[0.02em] text-[#5c5c5c]">Wisewave</p>
            <h1 className="mt-3 text-4xl font-medium leading-tight tracking-[-0.03em] text-[#171717] sm:text-5xl">
              {copy.hero.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-[#171717]">
              {copy.hero.spineLine}
            </p>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-[#5c5c5c]">
              {copy.hero.supportLine}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <TrackButton
                href="/login?from=hero"
                className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="homepage_primary_cta_click"
                eventPayload={{ location: "hero" }}
              >
                {copy.hero.ctaPrimary}
              </TrackButton>
              <TrackButton
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-[#fcfbf8] focus:outline-none focus:ring-2 focus:ring-[#2d4b52]/25 focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="homepage_secondary_cta_click"
                eventPayload={{ location: "hero" }}
              >
                {copy.hero.ctaSecondary}
              </TrackButton>
            </div>
          </div>
        </div>
      </section>

      <Section title={copy.selfRecognition.sectionTitle}>
        <AnalyticsView section="self_recognition" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            {copy.selfRecognition.fitItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-5 text-base leading-[1.75] text-[#171717]">
            {copy.selfRecognition.exitLine}
          </p>
        </div>
      </Section>

      <Section title={copy.whatYouReceive.sectionTitle}>
        <AnalyticsView section="what_you_receive" />
        <div className="grid gap-4 md:grid-cols-2">
          {copy.whatYouReceive.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{card.title}</h3>
              <p className="mt-2 text-base leading-[1.75] text-[#5c5c5c]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={copy.whatIsNot.sectionTitle}>
        <AnalyticsView section="what_is_not" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">{copy.whatIsNot.intro}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            {copy.whatIsNot.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-[1.75] text-[#171717]">
            {copy.whatIsNot.shortLine}
          </p>
        </div>
      </Section>

      <Section title={copy.whyReturn.sectionTitle}>
        <AnalyticsView section="why_people_return" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <div className="space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
            {copy.whyReturn.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            {copy.whyReturn.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-[1.75] text-[#171717]">
            {copy.whyReturn.subscriptionLine}
          </p>
          <div className="mt-6">
            <TrackButton
              href="/login?from=why_return"
              className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-6 py-3 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
              eventName="homepage_primary_cta_click"
              eventPayload={{ location: "why_return" }}
            >
              {copy.whyReturn.cta}
            </TrackButton>
          </div>
        </div>
      </Section>

      <Section title={copy.boundaries.sectionTitle}>
        <AnalyticsView section="boundaries" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">{copy.boundaries.intro}</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            {copy.boundaries.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-[1.75] text-[#171717]">
            {copy.boundaries.shortLine}
          </p>
        </div>
      </Section>

      <Section title={copy.faq.sectionTitle}>
        <AnalyticsView section="faq" />
        <AccordionFaq items={copy.faq.items} />
        <div className="mt-4 text-sm text-[#5c5c5c]">
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
