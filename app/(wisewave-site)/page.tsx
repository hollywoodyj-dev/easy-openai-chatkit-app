import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsView } from "@/components/wisewave-site/AnalyticsView";
import { SampleInteraction } from "@/components/wisewave-site/SampleInteraction";
import { Section } from "@/components/wisewave-site/Section";
import { TrackButton } from "@/components/wisewave-site/TrackButton";
import { wisewaveLandingCopy as copy } from "@/lib/wisewave-site/wisewave-landing-copy";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";

/** Canonical strings: `lib/wisewave-site/wisewave-landing-copy.ts` (+ JSON twin). */
const HOME_TITLE = "Wisewave — A quiet space to hear yourself more clearly";
const HOME_DESCRIPTION = copy.hero.subheadline;

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
  const { hero } = copy;
  const supportLast = hero.supportLines[hero.supportLines.length - 1];
  const supportRest = hero.supportLines.slice(0, -1);

  return (
    <>
      <section className="pb-10 pt-10 sm:pb-14 sm:pt-14">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <AnalyticsView section="hero" />
          <div className="max-w-3xl">
            <p className="text-sm tracking-[0.02em] text-[#5c5c5c]">Wisewave</p>
            <h1 className="mt-3 text-4xl font-medium leading-tight tracking-[-0.03em] text-[#171717] sm:text-5xl">
              {hero.headline}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5c5c5c]">
              {hero.subheadline}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <TrackButton
                href="/login?from=hero"
                className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="homepage_primary_cta_click"
                eventPayload={{ location: "hero" }}
              >
                {hero.ctaPrimary}
              </TrackButton>
              <TrackButton
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-[#fcfbf8] focus:outline-none focus:ring-2 focus:ring-[#2d4b52]/25 focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="homepage_secondary_cta_click"
                eventPayload={{ location: "hero" }}
              >
                {hero.ctaSecondary}
              </TrackButton>
            </div>
            <div className="mt-8 space-y-1 text-sm leading-7 text-[#5c5c5c]">
              {supportRest.map((line) => (
                <p key={line}>{line}</p>
              ))}
              <p className="pt-1">{supportLast}</p>
            </div>
          </div>
        </div>
      </section>

      <Section title={copy.resonance.sectionTitle}>
        <AnalyticsView section="user_resonance" />
        <div className="space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
          {copy.resonance.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="pt-2 text-[#171717]">{copy.resonance.closingLine}</p>
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

      <Section title={copy.difference.sectionTitle}>
        <AnalyticsView section="differentiation" />
        <div className="grid gap-4 md:grid-cols-2">
          {copy.difference.cards.map((card) => (
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

      <Section title={copy.benefits.sectionTitle}>
        <AnalyticsView section="what_you_receive" />
        <div className="grid gap-4 sm:grid-cols-2">
          {copy.benefits.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{item.title}</h3>
              <p className="mt-2 text-base leading-[1.75] text-[#5c5c5c]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={copy.useCases.sectionTitle}>
        <AnalyticsView section="when_to_use" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            {copy.useCases.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section id="how-it-works" title={copy.howItWorks.sectionTitle}>
        <AnalyticsView section="how_it_works" />
        <div className="grid gap-4 sm:grid-cols-2">
          {copy.howItWorks.steps.map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{step.title}</h3>
              <div className="mt-2 space-y-2 text-base leading-[1.75] text-[#5c5c5c]">
                {step.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="sample-openings" title="A short example">
        <AnalyticsView section="sample_openings" />
        <SampleInteraction />
      </Section>

      <Section title={copy.beliefs.sectionTitle}>
        <AnalyticsView section="beliefs" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            {copy.beliefs.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-base leading-[1.75] text-[#171717]">
            {copy.beliefs.closingLine}
          </p>
        </div>
      </Section>

      <Section title={copy.boundaries.sectionTitle}>
        <AnalyticsView section="boundaries" />
        <div className="space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
          {copy.boundaries.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="text-sm leading-7 text-[#5c5c5c]">
            {copy.boundaries.supportLine}
          </p>
        </div>
      </Section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
            <h2 className="text-xl font-medium tracking-[-0.02em] text-[#171717] sm:text-2xl">
              Before you begin
            </h2>
            <p className="mt-4 text-base leading-[1.75] text-[#5c5c5c]">
              You can read boundaries, how conversations are handled, how privacy
              works, and how account or subscription access is managed before
              entering Wisewave.
            </p>
            <ul className="mt-5 flex flex-col gap-2 text-sm text-[#171717] sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
              <li>
                <Link
                  href="/what-it-is-not"
                  className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
                >
                  What Wisewave is not
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works#conversation-handling"
                  className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
                >
                  Conversation handling
                </Link>
              </li>
              <li>
                <Link
                  href="/subscribe"
                  className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
                >
                  Account &amp; subscription
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@wisewave.io"
                  className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
                >
                  Support
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-6 text-[#5c5c5c]">
              Wisewave is not crisis or emergency support.
            </p>
          </div>
        </div>
      </section>

      <Section title={copy.finalCta.sectionTitle}>
        <AnalyticsView section="final_cta" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <div className="max-w-2xl space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
            {copy.finalCta.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <TrackButton
              href="/login?from=final_cta"
              className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
              eventName="homepage_primary_cta_click"
              eventPayload={{ location: "final_cta" }}
            >
              {copy.finalCta.ctaPrimary}
            </TrackButton>
            <TrackButton
              href="/start?from=homepage_final_secondary"
              className="inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d4b52]/25 focus:ring-offset-2"
              eventName="homepage_secondary_cta_click"
              eventPayload={{ location: "final_cta" }}
            >
              {copy.finalCta.ctaSecondary}
            </TrackButton>
          </div>
        </div>
      </Section>
    </>
  );
}
