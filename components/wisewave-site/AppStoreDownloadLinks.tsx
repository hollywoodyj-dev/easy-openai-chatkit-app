"use client";

import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/wisewave-analytics";
import {
  getGooglePlayStoreUrl,
  getIosAppStoreUrl,
  hasIosAppStoreUrl,
} from "@/lib/wisewave-site/wisewave-app-store-links";

const buttonClass =
  "inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-white px-5 py-3 text-sm font-medium text-[#171717] transition hover:bg-[#fcfbf8] focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#f7f5f1]";

type AppStoreDownloadLinksProps = {
  /** Analytics source, e.g. `app_page` or `paid_lp` */
  source: string;
  lp?: string;
  layout?: "row" | "stack";
};

export function AppStoreDownloadLinks({
  source,
  lp,
  layout = "row",
}: AppStoreDownloadLinksProps) {
  const iosUrl = getIosAppStoreUrl();
  const playUrl = getGooglePlayStoreUrl();
  const payload = { source, ...(lp ? { lp } : {}) };

  const onStoreClick = (platform: "ios" | "android") => {
    trackEvent("app_store_download_click", { ...payload, platform });
  };

  const wrapClass =
    layout === "stack"
      ? "flex flex-col gap-3"
      : "flex flex-col gap-3 sm:flex-row sm:flex-wrap";

  return (
    <div className={wrapClass}>
      {hasIosAppStoreUrl() && iosUrl ? (
        <a
          href={iosUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
          onClick={() => onStoreClick("ios")}
        >
          Download on the App Store
        </a>
      ) : (
        <span
          className={`${buttonClass} cursor-not-allowed opacity-60`}
          title="Set NEXT_PUBLIC_WISEWAVE_IOS_APP_STORE_URL when the listing is live"
        >
          App Store — link coming soon
        </span>
      )}
      <a
        href={playUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        onClick={() => onStoreClick("android")}
      >
        Get it on Google Play
      </a>
    </div>
  );
}

/** Compact row used on paid LPs — links to full /app page if only one store is configured. */
export function PaidGetAppLink({
  lp,
  adGroup,
  className,
}: {
  lp: string;
  adGroup: string;
  className?: string;
}) {
  const [platform, setPlatform] = useState<"ios" | "android">("android");

  useEffect(() => {
    const ua = navigator.userAgent || "";
    if (/iPad|iPhone|iPod/i.test(ua)) {
      setPlatform("ios");
      return;
    }
    if (/Android/i.test(ua)) {
      setPlatform("android");
    }
  }, []);

  const iosUrl = getIosAppStoreUrl();
  const playUrl = getGooglePlayStoreUrl();
  const hasIos = platform === "ios" && iosUrl;

  const href = hasIos ? iosUrl : playUrl;
  const target = hasIos ? "app_store" : "google_play";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "inline-flex items-center justify-center rounded-full border border-[#e7e1d8] bg-transparent px-5 py-3 text-sm font-medium text-[#171717] transition hover:bg-white"
      }
      onClick={() =>
        trackEvent("paid_landing_secondary_cta_click", {
          lp,
          ad_group: adGroup,
          target,
        })
      }
    >
      Get the app
    </a>
  );
}
