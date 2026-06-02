"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PaidGetAppLink } from "@/components/wisewave-site/AppStoreDownloadLinks";
import { Section } from "@/components/wisewave-site/Section";
import { trackEvent } from "@/lib/wisewave-analytics";
import type { PaidLandingConfig } from "@/lib/wisewave-site/wisewave-paid-landing-copy";

export function PaidLandingShell({ config }: { config: PaidLandingConfig }) {
  const startHref = `/start?from=paid_lp&lp=${encodeURIComponent(config.slug)}`;

  useEffect(() => {
    trackEvent("paid_landing_view", {
      lp: config.slug,
      ad_group: config.adGroup,
    });
  }, [config.slug, config.adGroup]);

  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <p className="text-sm tracking-[0.02em] text-[#5c5c5c]">
            Wisewave <span className="text-[#7b746b]">by Innerpro</span>
          </p>
          <h1 className="mt-3 text-4xl font-medium leading-tight tracking-[-0.03em] text-[#171717] sm:text-5xl">
            {config.headline}
          </h1>
          <p className="mt-5 text-lg leading-8 text-[#5c5c5c]">{config.subhead}</p>

          <div className="mt-8 space-y-5 rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
            {config.answers.map((item) => (
              <div key={item.question}>
                <h2 className="text-base font-medium text-[#171717]">
                  {item.question}
                </h2>
                <p className="mt-2 text-base leading-[1.75] text-[#5c5c5c]">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href={startHref}
              className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-6 py-3.5 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
              onClick={() =>
                trackEvent("paid_landing_primary_cta_click", {
                  lp: config.slug,
                  ad_group: config.adGroup,
                })
              }
            >
              Start a reflection
            </Link>
            <PaidGetAppLink lp={config.slug} adGroup={config.adGroup} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-[#5c5c5c]">
            Begin in your browser — no app required. Get the app is optional
            (App Store or Google Play).
          </p>
        </div>
      </section>

      <Section title={config.boundariesTitle}>
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          {config.boundaries.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Section>

      <Section title="Why start now">
        <p className="text-base leading-[1.75] text-[#5c5c5c]">{config.whyNow}</p>
        <div className="mt-6">
          <Link
            href={startHref}
            className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-6 py-3.5 text-sm font-medium text-white transition hover:opacity-95"
            onClick={() =>
              trackEvent("paid_landing_primary_cta_click", {
                lp: config.slug,
                ad_group: config.adGroup,
                location: "footer",
              })
            }
          >
            Start a reflection
          </Link>
        </div>
      </Section>

      <section className="border-t border-[#e7e1d8] py-10">
        <div className="mx-auto w-full max-w-[48rem] px-6 sm:px-8">
          <p className="text-sm text-[#5c5c5c]">
            <Link
              href={config.organicPath}
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              {config.organicLabel}
            </Link>
            {" · "}
            <Link
              href="/what-it-is-not"
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              What Wisewave is not
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
