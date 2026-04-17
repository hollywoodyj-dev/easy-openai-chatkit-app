import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsView } from "@/components/wisewave-site/AnalyticsView";
import { SampleInteraction } from "@/components/wisewave-site/SampleInteraction";
import { Section } from "@/components/wisewave-site/Section";
import { TrackButton } from "@/components/wisewave-site/TrackButton";

export const metadata: Metadata = {
  title: "Wisewave — A quieter space for reflection",
  description:
    "A low-presence reflection space. Not advice, not coaching, not therapy — Wisewave gently reflects what you bring.",
  alternates: { canonical: "/" },
};

export default function WisewaveMarketingHome() {
  return (
    <>
      <section className="pb-12 pt-12 sm:pb-16 sm:pt-16">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <AnalyticsView section="hero" />
          <div className="max-w-3xl">
            <p className="text-sm tracking-[0.02em] text-[#5c5c5c]">Wisewave</p>
            <h1 className="mt-3 text-4xl font-medium leading-tight tracking-[-0.03em] text-[#171717] sm:text-5xl">
              Not here to give you answers
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c5c5c]">
              Wisewave doesn&apos;t guide, advise, or fix you. It reflects — so
              you can see more clearly for yourself.
            </p>
            <p className="mt-4 text-base leading-8 text-[#5c5c5c]">
              No advice. No coaching. No direction. Just a quieter space to
              think.
            </p>
            <p className="mt-4 text-base leading-8 text-[#5c5c5c]">
              You do not need to follow anything here.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <TrackButton
                href="/start?from=home"
                className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="homepage_primary_cta_click"
                eventPayload={{ location: "hero" }}
              >
                Enter Wisewave
              </TrackButton>
              <TrackButton
                href="#sample-openings"
                className="inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-[#fcfbf8] focus:outline-none focus:ring-2 focus:ring-[#2d4b52]/25 focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="homepage_secondary_cta_click"
                eventPayload={{ location: "hero" }}
              >
                See example openings
              </TrackButton>
            </div>
            <p className="mt-5 text-sm leading-7 text-[#5c5c5c]">
              You can begin with anything — even something unclear.
            </p>
            <p className="mt-2 text-sm leading-7 text-[#5c5c5c]">
              Useful when you feel crowded inside — not when you need
              instructions.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
            <h2 className="text-2xl font-medium tracking-[-0.02em] text-[#171717] sm:text-3xl">
              What you receive
            </h2>
            <div className="mt-6 space-y-3 text-base leading-[1.75] text-[#5c5c5c]">
              <p>A little more clarity.</p>
              <p>A little less inner noise.</p>
              <p>A space that does not take over.</p>
            </div>
            <p className="mt-6 text-sm leading-7 text-[#5c5c5c]">
              Sometimes that small shift is enough.
            </p>
          </div>
        </div>
      </section>

      <Section
        title="When many systems become more active, Wisewave steps back"
        intro="It does not explain you, direct you, or take over your thinking. It simply gives what is mixed together a chance to gradually become clearer."
      >
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            Wisewave is designed to stay restrained. It is not trying to prove
            itself by becoming more present, more interpretive, or more
            emotionally involved.
          </p>
        </div>
      </Section>

      <Section
        title="This is not an assistant. Not therapy. Not coaching."
        intro="Wisewave is not here to give you answers. It will not tell you what to do, assign meaning for you, or place itself inside your inner space."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            "Not an assistant",
            "Not therapy",
            "Not coaching",
            "Not companionship",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <p className="text-base font-medium text-[#171717]">{item}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-base leading-[1.75] text-[#5c5c5c]">
          It is closer to a low-presence reflection space. You bring the
          content. It gently reflects.
        </p>
      </Section>

      <Section id="how-it-works" title="How it works">
        <AnalyticsView section="how_it_works" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: "Step 1",
              text: "You bring something you have not fully clarified yet. It may be a recurring thought, something vaguely stuck, or a mixture of feelings and judgments that have not separated yet.",
            },
            {
              step: "Step 2",
              text: "Wisewave gently reflects it. It does not rush to explain, categorize, or push you toward an answer.",
            },
            {
              step: "Step 3",
              text: "Some things begin to grow clearer through reflection. The point is not to lead you somewhere, but to let what is there emerge more plainly.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <p className="text-sm font-medium text-[#5c5c5c]">{item.step}</p>
              <p className="mt-3 text-base leading-[1.75] text-[#171717]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="sample-openings" title="It does not conclude for you">
        <SampleInteraction />
      </Section>

      <Section title="It may fit people like this">
        <AnalyticsView section="who_its_for" />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [
              "Quiet thinker",
              "You are not lacking thought. You just want a space that does not interrupt it.",
            ],
            [
              "Over-advised person",
              "You have already heard too many methods, suggestions, and frameworks. What you need now is not one more voice.",
            ],
            [
              "Journaling dropout",
              "It is not that you do not want reflection. You may simply be tired of blank pages, prompts, and turning expression into a task.",
            ],
            [
              "Uncomfortable with companion-style AI",
              "You do not want AI to get close to you, understand you, or accompany you. You want something more restrained than that.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{title}</h3>
              <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="It may not fit everyone">
        <AnalyticsView section="non_fit" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="text-base leading-[1.75] text-[#5c5c5c]">
            If you are looking for clear advice, action guidance, emotional
            support, a sense of companionship, or a system that organizes answers
            for you, Wisewave may not be for you.
          </p>
          <p className="mt-5 text-base leading-[1.75] text-[#171717]">
            It is not here to take over. It is here to leave space for
            reflection.
          </p>
        </div>
      </Section>

      <Section title="Wisewave is different not because it does more">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            [
              "Low presence",
              "It does not keep trying to prove its value. It steps back so your own content stays in front.",
            ],
            [
              "Non-directive",
              "It does not tell you the next step. No advice. No direction.",
            ],
            [
              "Preserves authorship",
              "Your experience remains your own. Wisewave does not define or interpret it for you.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{title}</h3>
              <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">
                {body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Clear boundaries are a form of trust">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <ul className="grid gap-3 text-base text-[#171717] sm:grid-cols-2">
            <li>No advice</li>
            <li>No coaching</li>
            <li>No therapy</li>
            <li>No manufactured companionship</li>
            <li>No interpreting you for you</li>
          </ul>
          <p className="mt-6 text-base leading-[1.75] text-[#5c5c5c]">
            Wisewave does not create value by entering you more deeply. Its
            value comes from knowing where it should not enter.
          </p>
        </div>
      </Section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
            <h2 className="text-xl font-medium tracking-[-0.02em] text-[#171717] sm:text-2xl">
              Before you begin
            </h2>
            <p className="mt-4 text-base leading-[1.75] text-[#5c5c5c]">
              You can read how conversations are handled, how privacy works, and
              how account or subscription access is managed before entering
              Wisewave.
            </p>
            <ul className="mt-5 flex flex-col gap-2 text-sm text-[#171717] sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
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
                  href="/legal/privacy"
                  className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
                >
                  Conversation handling
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
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

      <Section title="Not here to give answers. Here to leave space for reflection.">
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="max-w-2xl text-base leading-[1.75] text-[#5c5c5c]">
            If you are looking for something quieter, more restrained, and less
            intrusive, you can begin here.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <TrackButton
              href="/start?from=home"
              className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
              eventName="homepage_primary_cta_click"
              eventPayload={{ location: "final_cta" }}
            >
              Enter Wisewave
            </TrackButton>
            <TrackButton
              href="/who-its-for"
              className="inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d4b52]/25 focus:ring-offset-2"
              eventName="homepage_secondary_cta_click"
              eventPayload={{ location: "final_cta" }}
            >
              See whether it fits you
            </TrackButton>
          </div>
        </div>
      </Section>
    </>
  );
}
