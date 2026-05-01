"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEventName } from "@/lib/wisewave-analytics";

type SectionKey =
  | "hero"
  | "user_resonance"
  | "what_wisewave_is"
  | "differentiation"
  | "what_you_receive"
  | "when_to_use"
  | "how_it_works"
  | "who_its_for"
  | "non_fit"
  | "sample_openings"
  | "beliefs"
  | "boundaries"
  | "final_cta";

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
