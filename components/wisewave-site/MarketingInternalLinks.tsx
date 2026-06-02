import Link from "next/link";
import { WISEWAVE_CORE_INTERNAL_LINKS } from "@/lib/wisewave-site/wisewave-marketing-seo-metadata";
import type { WisewavePageInternalLink } from "@/lib/wisewave-site/wisewave-week3-page-internal-links";

/**
 * Low-density internal links for Google IA + fit-user navigation.
 * Omit `excludeHref` on a page to avoid self-link (e.g. on /faq).
 * Pass `links` for Week 3 per-page anchor sets (overrides site-wide default list).
 */
export function MarketingInternalLinks({
  title = "Related reading",
  excludeHref,
  links: linksOverride,
}: {
  title?: string;
  excludeHref?: string;
  links?: readonly WisewavePageInternalLink[];
}) {
  const source = linksOverride ?? WISEWAVE_CORE_INTERNAL_LINKS;
  const links = source.filter((item) => item.href !== excludeHref);
  if (links.length === 0) return null;

  return (
    <nav aria-label={title || "Related reading"} className="max-w-2xl">
      {title ? (
        <h2 className="text-lg font-medium text-[#171717]">{title}</h2>
      ) : null}
      <ul
        className={`list-disc space-y-2 pl-5 text-base leading-[1.75] text-[#5c5c5c] ${title ? "mt-4" : ""}`}
      >
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-medium text-[#171717] underline decoration-[#e7e1d8] underline-offset-4 hover:decoration-[#171717]"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
