import type { Metadata } from "next";

/**
 * Open Graph + Twitter cards from the same title/description as the page.
 * Tree: no new positioning language; mechanical social preview only.
 */
export function wisewaveMarketingSocialMetadata(
  title: string,
  description: string,
  canonicalPath: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
