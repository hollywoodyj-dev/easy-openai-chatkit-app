import type { Metadata } from "next";
import { wisewaveDefaultShareImage } from "@/lib/wisewave-site/wisewave-default-share-image";

export type WisewaveMarketingTwitterCard =
  | "summary"
  | "summary_large_image";

/**
 * Open Graph + Twitter cards from the same title/description as the page.
 * Tree: no new positioning language; mechanical social preview only.
 * Includes default share image so `og:image` / `twitter:image` are not empty (Lumen 2026-05-02).
 *
 * **Homepage / link-in-bio:** use `twitterCard: "summary"` so X/Twitter shows the **description**
 * beside a small image; `summary_large_image` often reads as “logo only” because the image dominates.
 */
export function wisewaveMarketingSocialMetadata(
  title: string,
  description: string,
  canonicalPath: string,
  options?: { twitterCard?: WisewaveMarketingTwitterCard },
): Pick<Metadata, "openGraph" | "twitter"> {
  const twitterCard = options?.twitterCard ?? "summary_large_image";
  return {
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "website",
      siteName: "Wisewave",
      locale: "en_US",
      images: [wisewaveDefaultShareImage],
    },
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [wisewaveDefaultShareImage.url],
    },
  };
}
