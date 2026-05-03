/**
 * Default Open Graph / Twitter preview asset (repo `public/` path).
 * Resolved to absolute URL via root `metadata.metadataBase`.
 */
export const WISEWAVE_DEFAULT_SHARE_IMAGE_PATH = "/brand/wisewave-app-logo.png";

export const wisewaveDefaultShareImage = {
  url: WISEWAVE_DEFAULT_SHARE_IMAGE_PATH,
  alt: "Wisewave",
} as const;
