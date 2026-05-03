import { WISEWAVE_MARKETING_SITE_ORIGIN } from "@/lib/wisewave-site/wisewave-marketing-jsonld-site";

export type WisewaveBreadcrumbCrumb = {
  name: string;
  item: string;
};

/**
 * Two-level BreadcrumbList: brand home + current page.
 * `leafName` must match the visible page title (hero / PageHero), not SEO meta title alone.
 */
export function wisewaveMarketingBreadcrumbTwo(
  leafVisibleTitle: string,
  pathname: `/${string}`,
): readonly WisewaveBreadcrumbCrumb[] {
  return [
    { name: "Wisewave", item: `${WISEWAVE_MARKETING_SITE_ORIGIN}/` },
    {
      name: leafVisibleTitle,
      item: `${WISEWAVE_MARKETING_SITE_ORIGIN}${pathname}`,
    },
  ];
}
