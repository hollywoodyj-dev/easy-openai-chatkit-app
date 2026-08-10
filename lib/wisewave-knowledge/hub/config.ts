/**
 * Canonical Reflection AI Hub config.
 * Hub URL remains existing `/reflection-ai` — no second hub route.
 * Slice 1: config only; no Production Hub content rewrite.
 */

import type { HubConfig } from "../types";

export const REFLECTION_AI_HUB_CONFIG: HubConfig = {
  canonical_path: "/reflection-ai",
  selected_reading: [
    { articleSlug: "dont-come-with-a-question" },
    { articleSlug: "how-to-ask-without-giving-away-your-knowing" },
  ],
  glossary_highlights: ["reflection-ai", "low-presence", "authorship"],
  faq_path: "/faq",
  identity_correction_path: "/reflection-without-advice",
  research_path: null,
};
