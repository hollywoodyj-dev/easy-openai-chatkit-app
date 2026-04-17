"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/wisewave-analytics";

type SectionKey =
  | "hero"
  | "how_it_works"
  | "who_its_for"
  | "non_fit"
  | "sample_openings";

export function AnalyticsView({
  event,
  payload,
  section,
}: {
  event?: AnalyticsEventName;
  payload?: Record<string, string>;
  /** Emits `section_view` with `{ section }` (v1.1 decision-grade shape). */
  section?: SectionKey;
}) {
  useEffect(() => {
    if (section) {
      trackEvent("section_view", { section });
      return;
    }
    if (event) {
      trackEvent(event, payload);
    }
  }, [event, payload, section]);

  return null;
}
