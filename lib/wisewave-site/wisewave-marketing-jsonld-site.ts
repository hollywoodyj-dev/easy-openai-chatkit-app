/**
 * Canonical marketing host for JSON-LD (matches root `metadata.metadataBase`).
 */
export const WISEWAVE_MARKETING_SITE_ORIGIN = "https://www.wisewave.io" as const;

export const WISEWAVE_ORGANIZATION_JSONLD_ID =
  `${WISEWAVE_MARKETING_SITE_ORIGIN}/#organization` as const;
export const WISEWAVE_WEBSITE_JSONLD_ID =
  `${WISEWAVE_MARKETING_SITE_ORIGIN}/#website` as const;

/** Logo URL already used for OG / public site; no new claims. */
export const WISEWAVE_ORGANIZATION_LOGO_URL =
  `${WISEWAVE_MARKETING_SITE_ORIGIN}/brand/wisewave-app-logo.png` as const;
