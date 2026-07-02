import { PERSISTED_CONVERSION_EVENT_NAMES } from "@/lib/wisewave-conversion-tracking";

export type AnalyticsEventName =
  | "page_view"
  | "homepage_view"
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
  | "app_store_download_click"
  | "signup_completed"
  | "first_reflection_started"
  | "first_reflection_completed"
  | "subscription_completed"
  | "checkout_started"
  | "payment_button_clicked"
  | "web_cta_click";

export type AnalyticsPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

/**
 * Payload key carrying the user's auth JWT so the conversion beacon can be
 * attributed to an account server-side. Stripped before anything is sent to
 * GA4/dataLayer and never stored in event metadata.
 */
export const AUTH_TOKEN_PAYLOAD_KEY = "auth_token";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function persistConversionBeacon(
  name: string,
  payload: AnalyticsPayload,
): void {
  if (!PERSISTED_CONVERSION_EVENT_NAMES.has(name)) return;
  if (typeof window === "undefined") return;

  const { [AUTH_TOKEN_PAYLOAD_KEY]: authToken, ...metadata } = payload;

  const body = {
    eventName: name,
    token: typeof authToken === "string" ? authToken : undefined,
    source: typeof payload.source === "string" ? payload.source : undefined,
    lp: typeof payload.lp === "string" ? payload.lp : undefined,
    adGroup:
      typeof payload.ad_group === "string"
        ? payload.ad_group
        : typeof payload.adGroup === "string"
          ? payload.adGroup
          : undefined,
    platform:
      typeof payload.platform === "string" ? payload.platform : undefined,
    path:
      typeof payload.path === "string"
        ? payload.path
        : window.location.pathname,
    metadata,
  };

  void fetch("/api/marketing/conversion-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    /* best-effort */
  });
}

export function trackEvent(
  name: AnalyticsEventName,
  payload: AnalyticsPayload = {},
) {
  if (typeof window === "undefined") return;

  const flat: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(payload)) {
    if (k === AUTH_TOKEN_PAYLOAD_KEY) continue;
    if (v === null || v === undefined) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      flat[k] = v;
    } else {
      flat[k] = String(v);
    }
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", name, flat);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...flat });
  } else if (process.env.NODE_ENV !== "production") {
    console.info("[analytics]", name, flat);
  }

  persistConversionBeacon(name, payload);

  if (
    name === "paid_landing_primary_cta_click" ||
    name === "start_page_enter_click" ||
    name === "homepage_primary_cta_click"
  ) {
    persistConversionBeacon("web_cta_click", {
      ...payload,
      web_cta_source: name,
    });
    if (typeof window.gtag === "function") {
      window.gtag("event", "web_cta_click", {
        ...flat,
        web_cta_source: name,
      });
    }
  }
}
