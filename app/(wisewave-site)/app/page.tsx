import type { Metadata } from "next";
import Link from "next/link";
import { AppStoreDownloadLinks } from "@/components/wisewave-site/AppStoreDownloadLinks";
import { PageHero } from "@/components/wisewave-site/PageHero";
import { Section } from "@/components/wisewave-site/Section";
import { wisewaveMarketingSocialMetadata } from "@/lib/wisewave-site/wisewave-marketing-social-metadata";

const TITLE = "Get the Wisewave app | iOS and Android";
const DESCRIPTION =
  "Download Wisewave on the App Store or Google Play — or start in your browser first. Reflection without advice, coaching, or takeover.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/app" },
  ...wisewaveMarketingSocialMetadata(TITLE, DESCRIPTION, "/app"),
};

export default async function WisewaveAppDownloadPage({
  searchParams,
}: {
  searchParams?: Promise<{ from?: string; lp?: string }>;
}) {
  const resolved = (await searchParams) ?? {};
  const fromPaid = resolved.from === "paid_lp";
  const lp = resolved.lp?.trim() || undefined;
  const analyticsSource = fromPaid ? "paid_lp" : "app_page";
  const startHref = lp
    ? `/start?from=paid_lp&lp=${encodeURIComponent(lp)}`
    : "/start?from=app_page";

  return (
    <>
      <PageHero
        title="Get Wisewave on your phone"
        body="Prefer the app after you have tried reflection in the browser — or download when you are ready. Wisewave is not therapy, coaching, or companion AI."
      >
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-[#171717]">
              Start in your browser (recommended first)
            </p>
            <p className="mt-2 text-base leading-[1.75] text-[#5c5c5c]">
              No install required. Open Wisewave on the web, write what is on
              your mind, and begin your first reflection in minutes.
            </p>
            <Link
              href={startHref}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-[#2d4b52] px-6 py-3.5 text-sm font-medium text-white transition hover:opacity-95"
            >
              Start a reflection in your browser
            </Link>
          </div>

          <div className="rounded-2xl border border-[#e7e1d8] bg-[#fcfbf8] p-6 sm:p-8">
            <p className="text-sm font-medium text-[#171717]">Mobile apps</p>
            <p className="mt-2 text-base leading-[1.75] text-[#5c5c5c]">
              Download for iOS or Android. Subscription and in-app purchase are
              handled through the respective app store.
            </p>
            <div className="mt-5">
              <AppStoreDownloadLinks
                source={analyticsSource}
                lp={lp}
                layout="stack"
              />
            </div>
          </div>
        </div>
      </PageHero>

      <Section title="What Wisewave is not">
        <ul className="list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c]">
          <li>Not therapy, counselling, or crisis support.</li>
          <li>Not an AI coach or emotional companion.</li>
          <li>Not a journaling prompt engine or productivity assistant.</li>
        </ul>
        <p className="mt-4 text-sm text-[#5c5c5c]">
          <Link
            href="/what-it-is-not"
            className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
          >
            Read full boundaries
          </Link>
        </p>
      </Section>
    </>
  );
}
