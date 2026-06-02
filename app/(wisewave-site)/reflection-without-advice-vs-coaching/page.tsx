import Link from "next/link";
import { AccordionFaq } from "@/components/wisewave-site/AccordionFaq";
import {
  TopicClusterSupportPage,
  buildTopicSupportMetadata,
} from "@/components/wisewave-site/TopicClusterSupportPage";
import { REFLECTION_WITHOUT_ADVICE_SUPPORT_PAGES } from "@/lib/wisewave-site/wisewave-reflection-without-advice-cluster";

const entry = REFLECTION_WITHOUT_ADVICE_SUPPORT_PAGES[0];

const vsCoachingFaq = [
  {
    question: "Is Wisewave coaching?",
    answer: "No. Wisewave does not set goals, assign homework, or push next steps.",
  },
  {
    question: "Can I use Wisewave instead of a coach?",
    answer:
      "Only if you want reflection space—not direction. If you want accountability or a plan, coaching or another format may fit better.",
  },
  {
    question: "Where should I read more?",
    answer:
      "See our primary guide on reflection without advice for the full concept, or the FAQ for boundaries.",
  },
] as const;

export const metadata = buildTopicSupportMetadata(entry);

export default function ReflectionWithoutAdviceVsCoachingPage() {
  return (
    <TopicClusterSupportPage
      headline={entry.headline}
      canonicalPath={entry.canonicalPath}
      from="seo_reflection_without_advice_vs_coaching"
      hero={
        <p>
          Coaching and reflection without advice answer different needs. Coaching
          moves you forward with goals and accountability. Reflection without
          advice gives your thinking room before direction arrives.
        </p>
      }
      sections={[
        {
          title: "What coaching is",
          body: (
            <>
              <p>
                Coaching usually assumes you want progress toward something:
                clearer goals, accountability, feedback, and often explicit next
                steps.
              </p>
              <p>
                A coach shapes the process—questions, frameworks, and momentum
                toward change. That can help when you already know you want
                movement.
              </p>
            </>
          ),
        },
        {
          title: "What reflection without advice is",
          body: (
            <>
              <p>
                Reflection without advice is quieter. You bring what is not fully
                clear yet; the space reflects it back lightly—not as a plan, not
                as direction.
              </p>
              <p>
                The point is to see your own view more clearly before anyone
                (including a system) tells you what to do next.
              </p>
            </>
          ),
        },
        {
          title: "When coaching helps",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>you want accountability toward a defined goal</li>
              <li>you are ready for feedback and structured next steps</li>
              <li>you want someone to help organize change, not just create space</li>
            </ul>
          ),
        },
        {
          title: "When reflection without advice helps",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>your thoughts feel crowded and you need room first</li>
              <li>you do not want prompts, plans, or pressure to perform</li>
              <li>you want clarity without handing authorship to a system</li>
            </ul>
          ),
        },
        {
          title: "Where Wisewave fits",
          body: (
            <p>
              Wisewave is built for the second path. It does not coach, prescribe,
              or optimize. It reflects with restraint so your judgment stays
              central. For the full concept, see{" "}
              <Link
                href="/reflection-without-advice"
                className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
              >
                reflection without advice
              </Link>
              .
            </p>
          ),
        },
        {
          title: "Who should not use Wisewave",
          body: (
            <ul className="list-disc space-y-2 pl-5">
              <li>you want a coach, therapist, or companion-style AI</li>
              <li>you need crisis or mental health support</li>
              <li>you mainly want clear answers, action plans, or guided prompts</li>
            </ul>
          ),
        },
        {
          title: "Short FAQ",
          body: <AccordionFaq items={[...vsCoachingFaq]} />,
        },
      ]}
    />
  );
}
