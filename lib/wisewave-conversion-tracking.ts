/**
 * Paid search + marketing conversion tracking catalog and server persistence.
 */

export type ConversionEventTier = "required" | "recommended" | "funnel";

export type ConversionEventCatalogEntry = {
  name: string;
  label: string;
  tier: ConversionEventTier;
  description: string;
};

export const CONVERSION_EVENT_CATALOG: ConversionEventCatalogEntry[] = [
  {
    name: "signup_completed",
    label: "Signup / account created",
    tier: "required",
    description: "New Wisewave account (email signup or OAuth create).",
  },
  {
    name: "first_reflection_started",
    label: "First reflection started",
    tier: "required",
    description: "Primary early KPI — user sent first chat turn and received a response.",
  },
  {
    name: "subscription_completed",
    label: "Paid conversion / subscription completed",
    tier: "required",
    description: "Web PayPal subscription captured or equivalent paid activation.",
  },
  {
    name: "first_reflection_completed",
    label: "Completed first reflection",
    tier: "recommended",
    description: "First assistant reflection returned after user's first message.",
  },
  {
    name: "checkout_started",
    label: "Checkout started",
    tier: "recommended",
    description: "User opened subscribe flow with auth (PayPal / plan selection).",
  },
  {
    name: "app_store_download_click",
    label: "App download click",
    tier: "recommended",
    description: "App Store or Google Play outbound click.",
  },
  {
    name: "web_cta_click",
    label: "Web CTA click",
    tier: "recommended",
    description: "Paid LP or /start enter click toward first reflection.",
  },
  {
    name: "paid_landing_view",
    label: "Paid landing view",
    tier: "funnel",
    description: "View of /lp/* with ad_group context.",
  },
  {
    name: "paid_landing_primary_cta_click",
    label: "Paid LP primary CTA",
    tier: "funnel",
    description: "Start a reflection click on paid LP.",
  },
  {
    name: "paid_landing_secondary_cta_click",
    label: "Paid LP Get the app",
    tier: "funnel",
    description: "Secondary CTA on paid LP (store or app path).",
  },
  {
    name: "start_page_enter_click",
    label: "Start page enter",
    tier: "funnel",
    description: "Enter Wisewave from /start.",
  },
];

export const PERSISTED_CONVERSION_EVENT_NAMES = new Set(
  CONVERSION_EVENT_CATALOG.map((e) => e.name),
);

export type RecordConversionEventInput = {
  eventName: string;
  userId?: string | null;
  sessionId?: string | null;
  source?: string | null;
  lp?: string | null;
  adGroup?: string | null;
  platform?: string | null;
  path?: string | null;
  metadata?: Record<string, string | number | boolean | null | undefined>;
};

export function getGa4MeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id || null;
}
