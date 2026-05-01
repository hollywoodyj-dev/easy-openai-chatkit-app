import { AnalyticsView } from "@/components/wisewave-site/AnalyticsView";

export function SampleInteraction() {
  return (
    <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_10px_30px_rgba(0,0,0,0.03)]">
      <AnalyticsView section="sample_openings" />
      <div className="space-y-4 font-mono text-[15px] leading-7 text-[#171717]">
        <div>
          <p className="text-xs font-sans uppercase tracking-[0.16em] text-[#5c5c5c]">
            Your words
          </p>
          <p className="mt-2 font-sans text-base leading-8 text-[#171717]">
            I keep thinking about the same thing, but I can&apos;t tell what the
            real sticking point is.
          </p>
        </div>
        <div className="border-t border-[#e7e1d8] pt-4">
          <p className="text-xs font-sans uppercase tracking-[0.16em] text-[#5c5c5c]">
            Reflective return
          </p>
          <p className="mt-2">
            There may be a few different layers mixed together there. Which part
            feels most noticeable right now?
          </p>
        </div>
      </div>
      <p className="mt-4 font-sans text-sm leading-7 text-[#5c5c5c]">
        Not advice. Not analysis. Just a gentle way of separating what is
        there.
      </p>
    </div>
  );
}
