"use client";

import Link from "next/link";
import { trackEvent, type AnalyticsEventName } from "@/lib/wisewave-analytics";

interface TrackLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  eventName: AnalyticsEventName;
  eventPayload?: Record<string, string>;
}

export function TrackLink({
  href,
  children,
  className,
  eventName,
  eventPayload,
}: TrackLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent(eventName, eventPayload)}
    >
      {children}
    </Link>
  );
}
