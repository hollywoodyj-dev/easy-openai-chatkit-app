import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { TrackButton } from "@/components/wisewave-site/TrackButton";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import {
  WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_CTA,
  WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_HEADLINE,
  WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO,
} from "@/lib/wisewave-site/wisewave-article-dont-come-with-a-question";

export const metadata: Metadata = {
  title: WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO.title,
  description: WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO.description,
  alternates: {
    canonical: WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO.canonicalPath,
  },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO.title,
    WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO.description,
    WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO.canonicalPath,
  ),
};

const prose = "text-[17px] leading-[1.85] text-[#4a4a4a] sm:text-lg sm:leading-[1.9]";
const quote =
  "border-l border-[#d4cec4] pl-5 text-[16px] leading-[1.8] text-[#5c5c5c] italic sm:pl-6";

export default function DontComeWithAQuestionArticlePage() {
  const { lead, buttonLabel, from } = WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_CTA;

  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_HEADLINE,
          WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_SEO.canonicalPath,
        )}
      />

      <article className="pb-16 pt-10 sm:pb-24 sm:pt-14">
        <div className="mx-auto w-full max-w-[38rem] px-6 sm:px-8">
          <p className="text-sm tracking-[0.04em] text-[#8a847a]">Article</p>
          <h1 className="mt-4 text-[1.85rem] font-medium leading-[1.25] tracking-[-0.03em] text-[#171717] sm:text-[2.35rem] sm:leading-[1.2]">
            {WISEWAVE_ARTICLE_DONT_COME_WITH_A_QUESTION_HEADLINE}
          </h1>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>
              Many people open Wisewave for the first time and naturally treat it
              like an AI that answers questions.
            </p>
            <p>That makes sense.</p>
            <p>
              We have become used to using AI this way:
              <br />
              ask a question, get an answer;
              <br />
              describe a problem, receive advice;
              <br />
              enter a goal, expect a plan.
            </p>
            <p>But Wisewave is not meant to be used in that way.</p>
            <p>
              If you come to Wisewave with &ldquo;Tell me what I should do,&rdquo;
              it may not respond the way you expect. Not because it is lacking
              intelligence, but because it is not designed to take over your
              judgment.
            </p>
            <p>Wisewave works better with a different kind of beginning.</p>
            <p>
              Not a clever question.
              <br />
              A real moment.
            </p>
            <p>For example:</p>
          </div>

          <div className={`mt-8 space-y-5 ${quote}`}>
            <p>&ldquo;I&apos;ve felt tense all day, but I don&apos;t really know why.&rdquo;</p>
            <p>
              &ldquo;I just finished talking with someone, and something in me
              feels heavy.&rdquo;
            </p>
            <p>
              &ldquo;I did everything I was supposed to do, but something still
              feels unresolved.&rdquo;
            </p>
            <p>
              &ldquo;I don&apos;t know why this matters, but I keep returning to
              it.&rdquo;
            </p>
          </div>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>These are not polished questions.</p>
            <p>But they are real entrances.</p>
            <p>
              Wisewave is not there to quickly turn your experience into advice.
              It is not there to tell you what your next step should be. It is
              there for the moments when something is already present in you, but
              not yet fully visible.
            </p>
            <p>It does not rush to name your experience.</p>
            <p>It does not flatten complexity into a conclusion.</p>
            <p>It does not push you toward an action.</p>
            <p>That matters.</p>
            <p>
              Because often, what we need is not a faster answer. We need not to
              leave ourselves too quickly.
            </p>
            <p>When you use Wisewave, try explaining less.</p>
            <p>
              You do not need to give the full background.
              <br />
              You do not need to justify what you feel.
              <br />
              You do not need to begin with &ldquo;What should I do?&rdquo;
              <br />
              You do not need to organize everything before you start.
            </p>
            <p>You can begin with one small, true sentence.</p>
          </div>

          <div className={`mt-8 space-y-5 ${quote}`}>
            <p>&ldquo;Something feels blocked here.&rdquo;</p>
            <p>
              &ldquo;I don&apos;t want to admit it, but I think I care.&rdquo;
            </p>
            <p>
              &ldquo;I don&apos;t know if this matters, but it keeps staying with
              me.&rdquo;
            </p>
            <p>
              &ldquo;I want to approach this, but part of me resists.&rdquo;
            </p>
          </div>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>
              These kinds of sentences often work better than a well-formed
              question.
            </p>
            <p>Because Wisewave is not here to think for you.</p>
            <p>
              It helps you hear what is already moving inside your own experience.
            </p>
            <p>
              That also means you do not need to measure each conversation by
              whether it produces an outcome.
            </p>
            <p>
              Sometimes, a good use of Wisewave does not end with an answer. It
              ends with a shift in seeing.
            </p>
            <p>You may notice:</p>
          </div>

          <div className={`mt-8 space-y-5 ${quote}`}>
            <p>
              &ldquo;I am not only stuck in this problem. I am stuck in my
              reaction to it.&rdquo;
            </p>
            <p>Or:</p>
            <p>
              &ldquo;I keep asking how to solve this, but I have not yet seen why
              I am in such a hurry.&rdquo;
            </p>
          </div>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>
              That kind of seeing may not immediately become action.
            </p>
            <p>But it changes your relationship to the problem.</p>
            <p>This is the posture Wisewave asks for:</p>
            <p>
              Come with what is real right now.
              <br />
              Let language slow down.
              <br />
              Notice what is already happening.
              <br />
              Before reaching for an answer, do not hand yourself over.
            </p>
            <p>You remain the author.</p>
            <p>
              Wisewave should not live your life for you.
              <br />
              It should not decide for you.
              <br />
              It should not become a voice you depend on.
            </p>
            <p>
              It simply helps you hear your own experience more clearly.
            </p>
          </div>

          <footer className="mt-16 border-t border-[#e7e1d8] pt-10">
            <p className="text-base leading-7 text-[#5c5c5c]">{lead}</p>
            <div className="mt-5">
              <TrackButton
                href={`/login?from=${from}`}
                className="inline-flex items-center justify-center rounded-full border border-[#cfc8bc] bg-transparent px-6 py-3 text-sm font-medium text-[#171717] transition hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#2d4b52]/30 focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
                eventName="web_cta_click"
                eventPayload={{ location: from, label: buttonLabel }}
              >
                {buttonLabel}
              </TrackButton>
            </div>
            <p className="mt-8 text-sm leading-7 text-[#8a847a]">
              <Link
                href="/start"
                className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#8a847a]"
              >
                Expectations before you enter
              </Link>
              {" · "}
              <Link
                href="/what-it-is-not"
                className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#8a847a]"
              >
                What Wisewave is not
              </Link>
            </p>
          </footer>
        </div>
      </article>
    </>
  );
}
