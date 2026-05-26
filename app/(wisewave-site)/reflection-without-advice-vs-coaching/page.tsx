import {
  TopicClusterSupportPage,
  buildTopicSupportMetadata,
} from "@/components/wisewave-site/TopicClusterSupportPage";
import { REFLECTION_WITHOUT_ADVICE_SUPPORT_PAGES } from "@/lib/wisewave-site/wisewave-reflection-without-advice-cluster";

const entry = REFLECTION_WITHOUT_ADVICE_SUPPORT_PAGES[0];

export const metadata = buildTopicSupportMetadata(entry);

export default function ReflectionWithoutAdviceVsCoachingPage() {
  return (
    <TopicClusterSupportPage
      headline={entry.headline}
      canonicalPath={entry.canonicalPath}
      from="seo_reflection_without_advice_vs_coaching"
      hero={
        <>
          <p>
            Coaching and reflection without advice answer different needs.
            Coaching moves you forward. Reflection without advice gives your
            thinking room before direction arrives.
          </p>
        </>
      }
      sections={[
        {
          title: "Where coaching and reflection diverge",
          body: (
            <>
              <p>
                Coaching often assumes goals, accountability, and someone
                shaping the process. That can help when you already know you want
                change.
              </p>
              <p>
                Reflection without advice assumes you may not be ready for a
                plan yet — you need to see your own view more clearly first.
              </p>
            </>
          ),
        },
        {
          title: "How Wisewave fits",
          body: (
            <p>
              Wisewave does not coach, prescribe, or optimize. It reflects with
              restraint so your judgment stays central — a quieter self
              reflection space without pressure to perform.
            </p>
          ),
        },
      ]}
    />
  );
}
