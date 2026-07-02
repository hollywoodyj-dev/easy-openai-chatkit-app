import {
  WISEWAVE_MARKETING_SITE_ORIGIN,
  WISEWAVE_ORGANIZATION_JSONLD_ID,
} from "@/lib/wisewave-site/wisewave-marketing-jsonld-site";

/**
 * SoftwareApplication JSON-LD — PREPARED, NOT MOUNTED (Aurora 2026-07-02).
 *
 * Implementation readiness only. Facts-only fields: name, url, publisher,
 * platforms. Deliberately ABSENT until Tree + Wisewave lock category language
 * (semantic governance freeze):
 *   - applicationCategory / applicationSubCategory
 *   - description
 *   - keywords
 * Do not mount this component or add those fields without that lock.
 */
export const WISEWAVE_SOFTWARE_APPLICATION_JSONLD_ID =
  `${WISEWAVE_MARKETING_SITE_ORIGIN}/#software-application` as const;

export function SoftwareApplicationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": WISEWAVE_SOFTWARE_APPLICATION_JSONLD_ID,
    name: "Wisewave",
    url: WISEWAVE_MARKETING_SITE_ORIGIN,
    publisher: { "@id": WISEWAVE_ORGANIZATION_JSONLD_ID },
    operatingSystem: "Web, iOS, Android",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
