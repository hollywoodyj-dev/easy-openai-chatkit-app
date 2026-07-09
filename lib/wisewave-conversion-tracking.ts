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
    name: "payment_button_clicked",
    label: "Payment button clicked",
    tier: "funnel",
    description:
      "PayPal button clicked on /subscribe (splits 'opened pricing' from 'attempted payment').",
  },
  {
    name: "day_7_return",
    label: "Day-7 return",
    tier: "recommended",
    description:
      "First reflective chat turn at least 7 days after account creation (once per user).",
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
  {
    name: "page_view",
    label: "Page view",
    tier: "funnel",
    description: "Marketing page load (path in event metadata).",
  },
  {
    name: "homepage_view",
    label: "Homepage view",
    tier: "funnel",
    description: "View of / homepage.",
  },
  {
    name: "homepage_primary_cta_click",
    label: "Homepage / nav primary CTA",
    tier: "funnel",
    description: "Enter Wisewave click from homepage or header nav.",
  },
  {
    name: "homepage_secondary_cta_click",
    label: "Homepage secondary CTA",
    tier: "funnel",
    description: "See if it fits / who-its-for link from homepage.",
  },
  {
    name: "start_page_view",
    label: "Start page view",
    tier: "funnel",
    description: "View of /start expectations page.",
  },
  {
    name: "entry_type_detected",
    label: "P0 entry type detected",
    tier: "recommended",
    description:
      "Internal opening classification on early turn (observation for P1; no user message text).",
  },
  {
    name: "reflection_mode_selected",
    label: "P0 reflection mode selected",
    tier: "recommended",
    description: "Ephemeral entry mode applied (mirror/clarify/deepen/etc.; internal only).",
  },
  {
    name: "slash_command_used",
    label: "P0 slash command used",
    tier: "funnel",
    description: "Optional /slow or /mirror entry friction reduction.",
  },
  {
    name: "conversation_started",
    label: "P0 conversation started",
    tier: "recommended",
    description: "First user turn in a chat session (P0 entry observation).",
  },
  {
    name: "reflection_started",
    label: "P0 reflection started",
    tier: "recommended",
    description:
      "Authentic reflection begun (P0); complements first_reflection_started for entry path observation.",
  },
  {
    name: "conversation_entered_reflection",
    label: "P0 entered reflection",
    tier: "recommended",
    description: "Entry assistance cleared; user reflection underway.",
  },
  {
    name: "reflection_depth_reached",
    label: "P0 reflection depth reached",
    tier: "funnel",
    description: "Turn 3+ depth signal for P1 prep (non-gamified).",
  },
  {
    name: "conversation_abandoned_before_reflection",
    label: "P0 abandoned before reflection",
    tier: "recommended",
    description:
      "Session left before reflection began (client beacon; friction signal, not retention trigger).",
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
