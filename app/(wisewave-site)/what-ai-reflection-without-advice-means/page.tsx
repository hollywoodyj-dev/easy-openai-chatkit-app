import {
  TopicClusterSupportPage,
  buildTopicSupportMetadata,
} from "@/components/wisewave-site/TopicClusterSupportPage";
import { REFLECTION_WITHOUT_ADVICE_SUPPORT_PAGES } from "@/lib/wisewave-site/wisewave-reflection-without-advice-cluster";

const entry = REFLECTION_WITHOUT_ADVICE_SUPPORT_PAGES[1];

export const metadata = buildTopicSupportMetadata(entry);

export default function WhatAiReflectionWithoutAdviceMeansPage() {
  return (
    <TopicClusterSupportPage
      headline={entry.headline}
      canonicalPath={entry.canonicalPath}
      from="seo_what_ai_reflection_without_advice_means"
      hero={
        <>
          <p>
            AI reflection without advice means the system reflects what you
            share without rushing to guide, coach, or replace your judgment.
          </p>
        </>
      }
      sections={[
        {
          title: "What it is not",
          body: (
            <>
              <p>It is not companion-style emotional support.</p>
              <p>It is not therapy or clinical care.</p>
              <p>It is not a productivity assistant with a softer tone.</p>
            </>
          ),
        },
        {
          title: "What Wisewave does",
          body: (
            <p>
              Wisewave stays low-presence: you reflect without advice, see your
              own thinking more clearly, and keep authorship of what matters.
            </p>
          ),
        },
      ]}
    />
  );
}
