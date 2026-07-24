import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { TrackButton } from "@/components/wisewave-site/TrackButton";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import {
  WISEWAVE_ARTICLE_HOW_TO_ASK_CTA,
  WISEWAVE_ARTICLE_HOW_TO_ASK_HEADLINE,
  WISEWAVE_ARTICLE_HOW_TO_ASK_SEO,
} from "@/lib/wisewave-site/wisewave-article-how-to-ask";

export const metadata: Metadata = {
  title: WISEWAVE_ARTICLE_HOW_TO_ASK_SEO.title,
  description: WISEWAVE_ARTICLE_HOW_TO_ASK_SEO.description,
  alternates: {
    canonical: WISEWAVE_ARTICLE_HOW_TO_ASK_SEO.canonicalPath,
  },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_ARTICLE_HOW_TO_ASK_SEO.title,
    WISEWAVE_ARTICLE_HOW_TO_ASK_SEO.description,
    WISEWAVE_ARTICLE_HOW_TO_ASK_SEO.canonicalPath,
  ),
};

const prose =
  "text-[17px] leading-[1.85] text-[#4a4a4a] sm:text-lg sm:leading-[1.9]";
const quote =
  "border-l border-[#d4cec4] pl-5 text-[16px] leading-[1.8] text-[#5c5c5c] italic sm:pl-6";

export default function HowToAskArticlePage() {
  const { lead, buttonLabel, from } = WISEWAVE_ARTICLE_HOW_TO_ASK_CTA;

  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          WISEWAVE_ARTICLE_HOW_TO_ASK_HEADLINE,
          WISEWAVE_ARTICLE_HOW_TO_ASK_SEO.canonicalPath,
        )}
      />

      <article className="pb-16 pt-10 sm:pb-24 sm:pt-14">
        <div className="mx-auto w-full max-w-[38rem] px-6 sm:px-8">
          <p className="text-sm tracking-[0.04em] text-[#8a847a]">
            Article · Usage orientation
          </p>
          <h1 className="mt-4 text-[1.85rem] font-medium leading-[1.25] tracking-[-0.03em] text-[#171717] sm:text-[2.35rem] sm:leading-[1.2]">
            {WISEWAVE_ARTICLE_HOW_TO_ASK_HEADLINE}
          </h1>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>Most AI tools train us to ask for answers.</p>
            <p>
              We ask what to do.
              <br />
              We ask what something means.
              <br />
              We ask for a plan, a summary, a decision, a diagnosis, a next step.
            </p>
            <p>That can be useful in many places.</p>
            <p>But Wisewave is not built for that kind of use.</p>
            <p>
              Wisewave is not here to become the strongest voice in your
              reflection. It is not designed to tell you what your life means,
              what choice to make, or what kind of person you should become.
            </p>
            <p>
              It works best when you do not hand over your knowing too early.
            </p>
            <p>A better way to begin is not:</p>
          </div>

          <div className={`mt-8 ${quote}`}>
            <p>&ldquo;What should I do?&rdquo;</p>
          </div>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>A better way to begin is:</p>
          </div>

          <div className={`mt-8 space-y-5 ${quote}`}>
            <p>
              &ldquo;There is something here I do not fully understand yet.&rdquo;
            </p>
            <p>Or:</p>
            <p>&ldquo;I keep returning to this moment.&rdquo;</p>
            <p>Or:</p>
            <p>
              &ldquo;I noticed this in myself, but I do not know what it is.&rdquo;
            </p>
          </div>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>The difference matters.</p>
            <p>
              When you ask for an answer, the center of gravity moves away from
              you. The system becomes the one that knows. You become the one
              waiting to receive.
            </p>
            <p>When you bring something real, the center stays with you.</p>
            <p>
              Wisewave can then help reflect what is already present, without
              taking over the meaning of it.
            </p>
            <p>This is why the question you ask matters.</p>
            <p>
              A useful Wisewave question often begins close to experience:
            </p>
          </div>

          <div className={`mt-8 space-y-4 ${quote}`}>
            <p>&ldquo;What am I actually sensing here?&rdquo;</p>
            <p>&ldquo;What part of this feels unclear?&rdquo;</p>
            <p>&ldquo;What am I avoiding naming?&rdquo;</p>
            <p>
              &ldquo;What is the real moment underneath this thought?&rdquo;
            </p>
            <p>&ldquo;What is still unresolved in me?&rdquo;</p>
            <p>
              &ldquo;What do I already know, but have not accepted clearly?&rdquo;
            </p>
          </div>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>
              These are not questions that ask Wisewave to decide for you.
            </p>
            <p>
              They are questions that keep you in contact with your own
              perception.
            </p>
            <p>That is the posture Wisewave is built around.</p>
            <p>
              Not outsourcing.
              <br />
              Not advice-seeking.
              <br />
              Not being guided toward a conclusion.
            </p>
            <p>
              Just staying close enough to what is real that something can become
              clearer.
            </p>
            <p>
              If you ask Wisewave, &ldquo;What should I do about this
              relationship?&rdquo; you may already be moving too quickly away from
              your own ground.
            </p>
            <p>Try instead:</p>
          </div>

          <div className={`mt-8 ${quote}`}>
            <p>
              &ldquo;When I think about this relationship, what feels most true
              but difficult to say?&rdquo;
            </p>
          </div>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>
              If you ask, &ldquo;How do I fix my life?&rdquo; the question may be
              too large, too abstract, and too ready to hand authority away.
            </p>
            <p>Try instead:</p>
          </div>

          <div className={`mt-8 ${quote}`}>
            <p>
              &ldquo;What is one moment from today that shows me where I feel
              divided?&rdquo;
            </p>
          </div>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>
              If you ask, &ldquo;Why am I like this?&rdquo; the question can become
              heavy, totalizing, and self-explaining too quickly.
            </p>
            <p>Try instead:</p>
          </div>

          <div className={`mt-8 ${quote}`}>
            <p>
              &ldquo;What happened in me just before I reacted that way?&rdquo;
            </p>
          </div>

          <div className={`mt-10 space-y-6 ${prose}`}>
            <p>
              Wisewave is most useful when the question still leaves room for
              you.
            </p>
            <p>
              Room for your memory.
              <br />
              Room for your hesitation.
              <br />
              Room for your own language.
              <br />
              Room for the answer not to arrive too quickly.
            </p>
            <p>This is different from asking an AI to be wise for you.</p>
            <p>
              Wisewave is not trying to replace your judgment with better
              judgment. It is trying to protect the space where your own judgment
              can return.
            </p>
            <p>
              So when you use it, do not rush to ask for the conclusion.
            </p>
            <p>
              Bring the unfinished sentence.
              <br />
              Bring the moment that keeps echoing.
              <br />
              Bring the feeling you do not want to over-explain.
              <br />
              Bring the question that still belongs to you.
            </p>
            <p>
              A good Wisewave question does not give away your knowing.
            </p>
            <p>It helps you stay near it long enough to hear it.</p>
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
                href="/articles/dont-come-with-a-question"
                className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#8a847a]"
              >
                Part 1: Come with what is real right now
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
