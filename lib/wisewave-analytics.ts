export type AnalyticsEventName =
  | "homepage_primary_cta_click"
  | "homepage_secondary_cta_click"
  | "section_view"
  | "section_view_hero"
  | "section_view_how_it_works"
  | "section_view_who_its_for"
  | "section_view_non_fit"
  | "sample_interaction_view"
  | "start_page_view"
  | "start_page_enter_click"
  | "faq_open"
  | "outbound_privacy_click"
  | "paid_landing_view"
  | "paid_landing_primary_cta_click"
  | "paid_landing_secondary_cta_click"
  | "app_store_download_click";

export type AnalyticsPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  payload: AnalyticsPayload = {}
) {
  if (typeof window === "undefined") return;

  const flat: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      flat[k] = v;
    } else {
      flat[k] = String(v);
    }
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", name, flat);
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...flat });
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", name, flat);
  }
}
