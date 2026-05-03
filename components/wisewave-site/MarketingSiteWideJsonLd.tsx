import {
  WISEWAVE_MARKETING_SITE_ORIGIN,
  WISEWAVE_ORGANIZATION_JSONLD_ID,
  WISEWAVE_ORGANIZATION_LOGO_URL,
  WISEWAVE_WEBSITE_JSONLD_ID,
} from "@/lib/wisewave-site/wisewave-marketing-jsonld-site";

/** Site-level Organization + WebSite; facts only (name, url, logo). */
export function MarketingSiteWideJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": WISEWAVE_ORGANIZATION_JSONLD_ID,
        name: "Wisewave",
        url: WISEWAVE_MARKETING_SITE_ORIGIN,
        logo: WISEWAVE_ORGANIZATION_LOGO_URL,
      },
      {
        "@type": "WebSite",
        "@id": WISEWAVE_WEBSITE_JSONLD_ID,
        name: "Wisewave",
        url: WISEWAVE_MARKETING_SITE_ORIGIN,
        publisher: { "@id": WISEWAVE_ORGANIZATION_JSONLD_ID },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
