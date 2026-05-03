import type { WisewaveBreadcrumbCrumb } from "@/lib/wisewave-site/wisewave-marketing-breadcrumbs";

/** BreadcrumbList — `items` must match a hierarchy users can infer (e.g. header home + current page). */
export function BreadcrumbJsonLd({
  items,
}: {
  items: readonly WisewaveBreadcrumbCrumb[];
}) {
  if (items.length < 2) {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
