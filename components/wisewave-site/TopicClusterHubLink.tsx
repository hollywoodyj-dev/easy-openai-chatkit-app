import Link from "next/link";
import { REFLECTION_WITHOUT_ADVICE_PRIMARY_PATH } from "@/lib/wisewave-site/wisewave-reflection-without-advice-cluster";

/**
 * Points satellite SEO pages at the primary topic URL (reduces cannibalization).
 */
export function TopicClusterHubLink({
  context,
}: {
  context: "reflection-ai" | "self-reflection-app" | "journaling";
}) {
  const lead =
    context === "reflection-ai"
      ? "If you searched for reflection AI without advice or coaching, start with our primary guide on the topic."
      : context === "self-reflection-app"
        ? "If you searched for a self reflection app without guidance, start with our primary guide on reflection without advice."
        : "If you want reflection without prompts taking over, see our primary guide on reflection without advice.";

  return (
    <div className="mx-auto mb-10 w-full max-w-[48rem] px-6 sm:px-8">
      <div className="max-w-3xl rounded-lg border border-[#e7e1d8] bg-[#fcfbf8] px-5 py-5 sm:px-6">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">{lead}</p>
        <p className="mt-3 text-base leading-[1.75]">
          <Link
            href={REFLECTION_WITHOUT_ADVICE_PRIMARY_PATH}
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            Reflection without advice
          </Link>
          <span className="text-[#5c5c5c]"> — the primary guide on this topic.</span>
        </p>
      </div>
    </div>
  );
}
