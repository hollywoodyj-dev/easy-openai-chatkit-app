"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/wisewave-analytics";

export function NavEnterLink({
  className,
  mobile = false,
}: {
  className: string;
  mobile?: boolean;
}) {
  return (
    <Link
      href="/login?from=nav"
      className={className}
      onClick={() =>
        trackEvent("homepage_primary_cta_click", {
          location: mobile ? "nav_mobile" : "nav",
        })
      }
    >
      Enter Wisewave
    </Link>
  );
}
