import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsView } from "@/components/wisewave-site/AnalyticsView";
import { SampleInteraction } from "@/components/wisewave-site/SampleInteraction";
import { Section } from "@/components/wisewave-site/Section";
import { TrackButton } from "@/components/wisewave-site/TrackButton";

/** Landing copy source: Wisewave — English Final Calibration (doc 1/2). */
export const metadata: Metadata = {
  title: "Wisewave — A quiet space to hear yourself more clearly",
  description:
    "Wisewave does not give advice, guide you, or draw conclusions for you. It gently reflects what you bring so your thoughts, emotions, and inner tension can become a little clearer.",
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
              <span className="block">Not an AI that answers for you.</span>
              <span className="mt-3 block text-[1.65rem] leading-tight sm:text-4xl">
                A quiet space to hear yourself more clearly.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5c5c5c]">
              Wisewave does not give advice, guide you, or draw conclusions for
              you. It gently reflects what you bring into the conversation, so
              your thoughts, emotions, and inner tension can become a little
              clearer.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <TrackButton
                href="/login?from=hero"
                className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="homepage_primary_cta_click"
                eventPayload={{ location: "hero" }}
              >
                Start a conversation
              </TrackButton>
              <TrackButton
                href="#sample-openings"
                className="inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-[#fcfbf8] focus:outline-none focus:ring-2 focus:ring-[#2d4b52]/25 focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="homepage_secondary_cta_click"
                eventPayload={{ location: "hero" }}
              >
                See how it responds
              </TrackButton>
            </div>
            <div className="mt-8 space-y-1 text-sm leading-7 text-[#5c5c5c]">
              <p>Not a search engine.</p>
              <p>Not a productivity assistant.</p>
              <p>Not therapy.</p>
              <p>Not coaching.</p>
              <p className="pt-1">Just a quieter space for reflection.</p>
            </div>
          </div>
        </div>
      </section>

      <Section title="Often, you do not need more answers." intro="You need to hear yourself more clearly.">
        <AnalyticsView section="user_resonance" />
        <div className="space-y-5 text-base leading-[1.75] text-[#5c5c5c]">
          <p>You may have already thought about it a lot.</p>
          <p>
            You may have read, searched, analyzed, or tried to understand. But
            sometimes the problem is not a lack of information. It is that
            things feel too crowded inside.
          </p>
          <p>You may feel something, but not know how to name it.</p>
          <p>You may keep thinking, but feel less clear.</p>
          <p>
            You may say many things, while still not touching the part that
            matters most.
          </p>
          <p className="pt-2 text-[#171717]">
            Wisewave does not explain your life for you. It gives you a space to
            notice what is already happening.
          </p>
        </div>
      </Section>

      <Section title="What is Wisewave?">
        <AnalyticsView section="what_wisewave_is" />
        <div className="space-y-5 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Wisewave is a quiet self-reflection space.</p>
          <p>
            You can bring whatever is present: a thought, a feeling, a question,
            a confusion, or something you cannot fully name yet. It will not rush
            to give you an answer. It will not tell you what to do.
          </p>
          <p>
            It responds lightly to what is already in your language: what you
            may be feeling, where things feel unclear, and what may be starting to
            come into focus.
          </p>
          <p className="text-[#171717]">
            It does not think for you. It helps you hear yourself more clearly.
          </p>
        </div>
      </Section>

      <Section title="Most AI tries to do more." intro="Wisewave does less.">
        <AnalyticsView section="differentiation" />
        <div className="grid gap-4 md:grid-cols-2">
          {[
            [
              "1) It does not rush to answer",
              "Many AI systems move quickly toward advice. Wisewave first helps you notice what you are saying.",
            ],
            [
              "2) It does not treat you like a problem",
              "You are not something to be fixed. Sometimes you only need space to hear what is happening inside.",
            ],
            [
              "3) It does not cover complexity with polished words",
              "It will not use standard comfort language to skip over what is real.",
            ],
            [
              "4) It does not take over your direction",
              "Wisewave will not tell you where to go. You remain the author of your own experience.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{title}</h3>
              <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Sometimes, a little clarity is enough.">
        <AnalyticsView section="what_you_receive" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [
              "A clearer sense of what is happening inside",
              "From “I feel all over the place” to “I can see where the confusion is.”",
            ],
            [
              "More honest emotional awareness",
              "Noticing feelings that may have been pushed down, explained away, or hard to name.",
            ],
            [
              "A little more inner space",
              "Not being comforted past what is real, but allowing what is complex to be seen.",
            ],
            [
              "A steadier understanding of yourself",
              "Not a one-time answer, but a slower return to what is true for you.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{title}</h3>
              <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Use Wisewave when you need a space that does not interrupt you.">
        <AnalyticsView section="when_to_use" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            <li>When you feel a lot, but cannot quite say why</li>
            <li>When you keep returning to the same inner loop</li>
            <li>When something feels stuck, but the stuck point is unclear</li>
            <li>When you do not want more advice yet</li>
            <li>
              When you need a space that does not define, judge, or push you
            </li>
          </ul>
        </div>
      </Section>

      <Section id="how-it-works" title="The way in is simple.">
        <AnalyticsView section="how_it_works" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            [
              "1. Start from what is real now",
              "You do not need to organize it first. You do not need to say it perfectly. Start wherever you are.",
            ],
            [
              "2. Wisewave reflects lightly",
              "It mirrors the emotions, tensions, and small signals already present in your words.",
            ],
            [
              "3. Something may become clearer",
              "Not all at once. Not by being explained. But through a conversation that leaves room for you to notice.",
            ],
            [
              "4. Clarity leaves you closer to yourself",
              "Wisewave does not push you forward. It simply keeps the space open.",
            ],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6"
            >
              <h3 className="text-lg font-medium text-[#171717]">{title}</h3>
              <p className="mt-3 text-base leading-[1.75] text-[#5c5c5c]">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="sample-openings" title="See how it responds">
        <SampleInteraction />
      </Section>

      <Section title="Wisewave believes">
        <AnalyticsView section="beliefs" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
            <li>Clarity matters more than quick answers</li>
            <li>People do not always need guidance to change</li>
            <li>Inner noise is not a sign that you are failing</li>
            <li>Some answers only appear when there is enough space</li>
            <li>
              You do not need a system to take over in order to return to yourself
            </li>
          </ul>
          <p className="mt-6 text-base leading-[1.75] text-[#171717]">
            Wisewave is not here to make you more optimized. It offers a quiet
            space to come back to yourself more clearly.
          </p>
        </div>
      </Section>

      <Section title="What Wisewave is not">
        <AnalyticsView section="boundaries" />
        <div className="space-y-5 text-base leading-[1.75] text-[#5c5c5c]">
          <p>Wisewave is not a replacement for therapy.</p>
          <p>
            It is not a medical service. It is not crisis support. It is not
            coaching. It is not an authority on your life. It does not diagnose
            you. It does not treat you. It does not tell you what to do. It does
            not decide what is true for you.
          </p>
          <p className="text-sm leading-7 text-[#5c5c5c]">
            If you are in serious psychological distress, immediate danger, or
            need professional clinical support, please seek help from a
            qualified human professional or local emergency services.
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

      <Section title="If you do not need more answers right now, only a little more room to hear yourself.">
        <AnalyticsView section="final_cta" />
        <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="max-w-2xl text-base leading-[1.75] text-[#5c5c5c]">
            You can begin with one simple conversation. No preparation needed. No
            need to be clear first. Start from what is real now.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <TrackButton
              href="/login?from=final_cta"
              className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-7 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
              eventName="homepage_primary_cta_click"
              eventPayload={{ location: "final_cta" }}
            >
              Start using Wisewave
            </TrackButton>
            <TrackButton
              href="/start?from=homepage_final_secondary"
              className="inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d4b52]/25 focus:ring-offset-2"
              eventName="homepage_secondary_cta_click"
              eventPayload={{ location: "final_cta" }}
            >
              Enter the reflection space
            </TrackButton>
          </div>
        </div>
      </Section>
    </>
  );
}
