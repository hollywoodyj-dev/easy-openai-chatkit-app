import Link from "next/link";
import { Section } from "@/components/wisewave-site/Section";
import { TrackButton } from "@/components/wisewave-site/TrackButton";

/**
 * Low-pressure CTA + required internal links (WISEWAVE_SEO_LANDING_PAGES_v1 / Nova 指令 5/5).
 */
export function SeoLandingClosing({
  lead,
  from,
  relatedHref,
  relatedLabel,
}: {
  lead: string;
  from: string;
  relatedHref: string;
  relatedLabel: string;
}) {
  return (
    <Section title="When you are ready">
      <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
        <p className="max-w-2xl text-base leading-[1.75] text-[#5c5c5c]">{lead}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <TrackButton
            href={`/login?from=${from}`}
            className="inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-6 py-3 text-sm font-medium text-white transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]"
            eventName="homepage_primary_cta_click"
            eventPayload={{ location: from }}
          >
            Begin here
          </TrackButton>
          <Link
            href={`/start?from=${from}`}
            className="text-sm font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            Expectations before you enter
          </Link>
        </div>
        <nav
          aria-label="Related pages"
          className="mt-8 border-t border-[#e7e1d8] pt-6 text-sm leading-7 text-[#5c5c5c]"
        >
          <p className="font-medium text-[#171717]">Related</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link
                href="/"
                className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
              >
                Homepage
              </Link>
            </li>
            <li>
              <Link
                href={relatedHref}
                className="underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
              >
                {relatedLabel}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Section>
  );
}
