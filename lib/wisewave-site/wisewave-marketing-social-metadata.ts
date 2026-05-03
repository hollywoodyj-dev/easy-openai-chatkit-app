import type { Metadata } from "next";
import { wisewaveDefaultShareImage } from "@/lib/wisewave-site/wisewave-default-share-image";

/**
 * Open Graph + Twitter cards from the same title/description as the page.
 * Tree: no new positioning language; mechanical social preview only.
 * Includes default share image so `og:image` / `twitter:image` are not empty (Lumen 2026-05-02).
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
      images: [wisewaveDefaultShareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [wisewaveDefaultShareImage.url],
    },
  };
}
