"use client";

import Link from "next/link";
import { trackEvent, type AnalyticsEventName } from "@/lib/wisewave-analytics";

interface TrackButtonProps {
  href: string;
  children: React.ReactNode;
  className: string;
  eventName: AnalyticsEventName;
  eventPayload?: Record<string, string>;
}

export function TrackButton({
  href,
  children,
  className,
  eventName,
  eventPayload,
}: TrackButtonProps) {
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
