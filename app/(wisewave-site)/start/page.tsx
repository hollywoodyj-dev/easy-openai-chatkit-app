import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AnalyticsView } from "@/components/wisewave-site/AnalyticsView";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { StartEnterLink } from "@/components/wisewave-site/StartEnterLink";

export const metadata: Metadata = {
  title: "Begin your first reflection",
  description:
    "A short expectation-setting page before entering Wisewave. A low-presence reflection space — not advice, not coaching, not direction.",
  alternates: { canonical: "/start" },
};

function EnterFallback() {
  return (
    <Link
      href="/chat"
      className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-6 py-3.5 text-sm font-medium text-white transition hover:opacity-95"
    >
      Enter Wisewave
    </Link>
  );
}

export default function StartPage() {
  return (
    <>
      <AnalyticsView event="start_page_view" />
      <PageHero
        title="Begin your first reflection"
        body="Wisewave does not provide answers, advice, or direction. It gently reflects what you bring, allowing what is still unclear to gradually become clearer."
      >
        <div className="max-w-2xl rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
          <p className="text-base leading-[1.75] text-[#171717]">
            <span className="font-medium">
              If what you want is space rather than answers, you can begin here.
            </span>
          </p>
          <p className="mt-4 text-base leading-[1.75] text-[#5c5c5c]">
            If you are looking for advice, guidance, or emotional support, this
            may not be the right place.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Suspense fallback={<EnterFallback />}>
              <StartEnterLink />
            </Suspense>
            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-3 text-sm font-medium text-[#171717] transition hover:bg-white"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </PageHero>
    </>
  );
}
