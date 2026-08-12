import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/wisewave-site/BreadcrumbJsonLd";
import { Section } from "@/components/wisewave-site/Section";
import { SeoLandingHero } from "@/components/wisewave-site/SeoLandingHero";
import { TrackButton } from "@/components/wisewave-site/TrackButton";
import { wisewaveMarketingBreadcrumbTwo } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";
import { WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";

/**
 * Identity page — locked EN semantic copy (Tree narrow impl auth 2026-08-13).
 * Baseline: docs/NOVA_CORRECTED_FINAL_EN_COPY_REFLECTION_WITHOUT_ADVICE_IDENTITY_DEEPEN_2026-08-11.md
 * No semantic rewrite; Hosted Preview / Production not authorized by that auth.
 */
export const metadata: Metadata = {
  title: WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.title,
  description: WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.description,
  alternates: {
    canonical: WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.canonicalPath,
  },
  ...wisewaveMarketingSocialMetadata(
    WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.title,
    WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.description,
    WISEWAVE_REFLECTION_WITHOUT_ADVICE_SEO.canonicalPath,
  ),
};

const PAGE_HEADLINE = "Reflection without advice";
const FROM = "seo_reflection_without_advice";

export default function ReflectionWithoutAdvicePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={wisewaveMarketingBreadcrumbTwo(
          PAGE_HEADLINE,
          "/reflection-without-advice",
        )}
      />

      {/* 1. Hero */}
      <SeoLandingHero title={PAGE_HEADLINE}>
        <p>Not every thought needs advice.</p>
        <p>
          Wisewave is a Reflection AI built around a quieter premise:
          <br />
          reflection does not have to begin with advice.
        </p>
        <p>
          It can reflect what you bring without coaching, directing, or taking
          over the meaning of your experience.
        </p>
      </SeoLandingHero>

      {/* 2. What that means */}
      <Section title="What that means">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Reflection without advice does not mean less support.
            <br />
            It means support without taking over interpretation or direction.
          </p>
          <p>
            The purpose is not to leave you without support.
            <br />
            It is to leave the meaning of your experience with you.
          </p>
        </div>
      </Section>

      {/* 3. Reflection AI, in Wisewave's form */}
      <Section title="Reflection AI, in Wisewave’s form">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            {
              "Reflection AI describes a form of AI interaction centered on reflection rather than answers, direction, or task completion."
            }
          </p>
          <p>
            Wisewave takes a narrower position within that category: reflection
            without advice.
          </p>
        </div>
      </Section>

      {/* 4. Low Presence */}
      <Section title="Low Presence">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            Low Presence means the system stays quieter than the experience you
            came to notice.
          </p>
          <p>
            It does not need to occupy the reflection in order to support it.
          </p>
        </div>
      </Section>

      {/* 5. Your experience remains yours */}
      <Section title="Your experience remains yours">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            When something becomes clearer, the recognition should still feel
            like yours.
          </p>
          <p className="text-[#171717]">
            Wisewave does not remove support from reflection. It removes the
            assumption that support must take over.
          </p>
          <p className="text-[#171717]">Your own seeing remains yours.</p>
        </div>
      </Section>

      {/* 6. Not coaching. Not takeover. */}
      <Section title="Not coaching. Not takeover.">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p>
            {
              "Wisewave is not designed to become your therapist, coach, personal adviser, or companion."
            }
          </p>
          <p>
            It does not organize the interaction around telling you what to do,
            what your experience means, or who you are.
          </p>
          <p>
            Support here means staying with what you bring — not taking over
            interpretation or direction.
          </p>
        </div>
      </Section>

      {/* 7. Quiet close / Enter Wisewave (+ footer-adjacent related) */}
      <Section title="Enter Wisewave">
        <div className="space-y-4 text-base leading-[1.75] text-[#5c5c5c]">
          <p className="text-[#171717]">You can begin anywhere.</p>
          <div className="pt-2">
            <TrackButton
              href={`/login?from=${FROM}`}
              className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-6 py-3 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
              eventName="homepage_primary_cta_click"
              eventPayload={{ location: FROM }}
            >
              Open Wisewave
            </TrackButton>
          </div>
        </div>
        <nav
          aria-label="Related pages"
          className="mt-10 border-t border-[#e7e1d8] pt-6 text-sm leading-7 text-[#5c5c5c]"
        >
          <p className="font-medium text-[#171717]">Related</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href={`/how-it-works?from=${FROM}`}
                className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
              >
                How Wisewave works
              </Link>
            </li>
            <li>
              <Link
                href={`/what-it-is-not?from=${FROM}`}
                className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
              >
                What Wisewave is not
              </Link>
            </li>
            <li>
              <Link
                href="/reflection-ai"
                className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
              >
                Reflection AI
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
              >
                Common questions
              </Link>
            </li>
          </ul>
        </nav>
      </Section>
    </>
  );
}
