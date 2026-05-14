import type { Metadata } from "next";
import Link from "next/link";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import { AnalyticsView } from "@/components/wisewave-site/AnalyticsView";
import { Section } from "@/components/wisewave-site/Section";
import { TrackButton } from "@/components/wisewave-site/TrackButton";
import { wisewaveLandingCopy as copy } from "@/lib/wisewave-site/wisewave-landing-copy";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";

/** Canonical strings: `lib/wisewave-site/wisewave-landing-copy.ts` (+ JSON twin). */
const HOME_TITLE = "Wisewave — A quiet space to hear yourself more clearly";
/** Micro SEO reinforcement (Lumen): primary cluster, no scope expansion. */
const HOME_DESCRIPTION = `A quiet reflection space for reflection without advice. ${copy.hero.subheadline[0]}`;

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  ...wisewaveMarketingSocialMetadata(HOME_TITLE, HOME_DESCRIPTION, "/", {
    /** X / Twitter: show subheadline beside image, not logo-only large card. */
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
            <div className="mt-5 max-w-2xl space-y-3 text-lg leading-8 text-[#5c5c5c]">
              {copy.hero.subheadline.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
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

      <Section title={copy.problem.sectionTitle}>
        <AnalyticsView section="problem" />
        <div className="space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
          {copy.problem.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>

      <Section title={copy.whatIs.sectionTitle}>
        <AnalyticsView section="what_wisewave_is" />
        <div className="space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
          {copy.whatIs.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="text-[#171717]">{copy.whatIs.shortLine}</p>
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

      <Section title={copy.whoItsFor.sectionTitle}>
        <AnalyticsView section="who_its_for" />
        <div className="space-y-5">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">{copy.whoItsFor.intro}</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6">
              <h3 className="text-base font-medium text-[#171717]">
                {copy.whoItsFor.fitTitle}
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
                {copy.whoItsFor.fitItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6">
              <h3 className="text-base font-medium text-[#171717]">
                {copy.whoItsFor.notFitTitle}
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
                {copy.whoItsFor.notFitItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
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
            {copy.whyReturn.shortLine}
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

      <Section title={copy.closing.headline}>
        <AnalyticsView section="closing" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <div className="max-w-2xl space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
            {copy.closing.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <TrackButton
              href="/login?from=final_cta"
              className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
              eventName="homepage_primary_cta_click"
              eventPayload={{ location: "closing" }}
            >
              {copy.closing.ctaPrimary}
            </TrackButton>
            <TrackButton
              href="/about/founder-note?from=homepage_closing_secondary"
              className="inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d4b52]/25 focus:ring-offset-2"
              eventName="homepage_secondary_cta_click"
              eventPayload={{ location: "closing" }}
            >
              {copy.closing.ctaSecondary}
            </TrackButton>
          </div>
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

      <Section title="Related reading">
        <AnalyticsView section="related_reading" />
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>
            <Link
              href="/reflection-without-advice"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Reflection without advice
            </Link>
          </li>
          <li>
            <Link
              href="/reflection-ai"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Reflection AI without advice or coaching
            </Link>
          </li>
          <li>
            <Link
              href="/self-reflection-app"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              A self reflection app
            </Link>
          </li>
          <li>
            <Link
              href="/journaling-alternative"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              A journaling alternative
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              Full FAQ
            </Link>
          </li>
        </ul>
      </Section>
    </>
  );
}
