import {
  TopicClusterSupportPage,
  buildTopicSupportMetadata,
} from "@/components/wisewave-site/TopicClusterSupportPage";
import { REFLECTION_WITHOUT_ADVICE_SUPPORT_PAGES } from "@/lib/wisewave-site/wisewave-reflection-without-advice-cluster";

const entry = REFLECTION_WITHOUT_ADVICE_SUPPORT_PAGES[2];

export const metadata = buildTopicSupportMetadata(entry);

export default function SelfReflectionWithoutGuidancePage() {
  return (
    <TopicClusterSupportPage
      headline={entry.headline}
      canonicalPath={entry.canonicalPath}
      from="seo_self_reflection_without_guidance"
      hero={
        <>
          <p>
            Some people want self reflection without guidance — space to think
            in writing without prompts, frameworks, or a system steering the
            process.
          </p>
        </>
      }
      sections={[
        {
          title: "Why guidance can feel like interference",
          body: (
            <>
              <p>
                When structure arrives too early, reflection can feel managed
                — as if the tool is leading and you are following.
              </p>
              <p>
                Self reflection without guidance keeps your thinking in front:
                fewer implied goals, fewer pushes toward optimization.
              </p>
            </>
          ),
        },
        {
          title: "How Wisewave fits",
          body: (
            <p>
              Wisewave offers a quieter self reflection space: reflect without
              advice, without coaching, and without companion-style closeness.
            </p>
          ),
        },
      ]}
    />
  );
}
