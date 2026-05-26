import type { Metadata } from "next";

/** Paid LPs are not indexed — SEO pages stay at organic paths. */
export function wisewavePaidLandingMetadata(title: string): Metadata {
  return {
    title,
    description:
      "Paid landing — begin reflection in your browser. Not therapy, coaching, or companion AI.",
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
    alternates: undefined,
  };
}
