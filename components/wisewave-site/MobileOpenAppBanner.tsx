"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import appIcon from "@/app/icon.png";
import { trackEvent } from "@/lib/wisewave-analytics";
import {
  detectMobilePlatform,
  getAndroidAppOpenUrl,
  getIosAppInstallFallbackUrl,
  getWisewaveAppDeepLink,
  MOBILE_OPEN_APP_BANNER_DISMISS_DAYS,
  MOBILE_OPEN_APP_BANNER_DISMISS_KEY,
  shouldShowMobileOpenAppBanner,
  type MobilePlatform,
} from "@/lib/wisewave-site/wisewave-mobile-app-open";

function readDismissed(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const until = localStorage.getItem(MOBILE_OPEN_APP_BANNER_DISMISS_KEY);
    if (!until) return false;
    return Date.now() < Number(until);
  } catch {
    return false;
  }
}

function writeDismissed(): void {
  try {
    const until = Date.now() + MOBILE_OPEN_APP_BANNER_DISMISS_DAYS * 86400000;
    localStorage.setItem(MOBILE_OPEN_APP_BANNER_DISMISS_KEY, String(until));
  } catch {
    /* ignore */
  }
}

function openIosApp(): void {
  const fallback = getIosAppInstallFallbackUrl();
  const deepLink = getWisewaveAppDeepLink();
  const started = Date.now();
  window.location.href = deepLink;
  window.setTimeout(() => {
    if (document.hidden || Date.now() - started > 2200) return;
    window.location.href = fallback;
  }, 1500);
}

function openMobileApp(platform: MobilePlatform): void {
  if (platform === "android") {
    window.location.href = getAndroidAppOpenUrl();
    return;
  }
  openIosApp();
}

export function MobileOpenAppBanner() {
  const pathname = usePathname();
  const [platform, setPlatform] = useState<MobilePlatform | null>(null);
  const [visible, setVisible] = useState(false);
  const [isNarrowViewport, setIsNarrowViewport] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const detected = detectMobilePlatform(ua);
    setPlatform(detected);

    const mq = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsNarrowViewport(mq.matches);
    updateViewport();
    mq.addEventListener("change", updateViewport);

    return () => mq.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!platform || !isNarrowViewport) {
      setVisible(false);
      return;
    }
    if (!shouldShowMobileOpenAppBanner(pathname)) {
      setVisible(false);
      return;
    }
    setVisible(!readDismissed());
  }, [platform, isNarrowViewport, pathname]);

  const dismiss = useCallback(() => {
    writeDismissed();
    setVisible(false);
    trackEvent("web_cta_click", {
      target: "mobile_open_app_banner_dismiss",
      path: pathname ?? "/",
    });
  }, [pathname]);

  const onOpen = useCallback(() => {
    if (!platform) return;
    trackEvent("web_cta_click", {
      target: "mobile_open_app_banner_open",
      platform,
      path: pathname ?? "/",
    });
    openMobileApp(platform);
  }, [platform, pathname]);

  if (!visible || !platform) return null;

  return (
    <div
      className="border-b border-[#e7e1d8] bg-[#fcfbf8] px-4 py-2.5 sm:px-6"
      role="region"
      aria-label="Open Wisewave app"
    >
      <div className="mx-auto flex max-w-[51rem] items-center gap-3">
        <Image
          src={appIcon}
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 shrink-0 rounded-[10px] object-cover"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#171717]">Wisewave</p>
          <p className="truncate text-xs text-[#5c5c5c]">
            Continue in the Wisewave app
          </p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="shrink-0 rounded-full bg-[#2d4b52] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#243d43] focus:outline-none focus:ring-2 focus:ring-[#2d4b52] focus:ring-offset-2 focus:ring-offset-[#fcfbf8]"
        >
          Open
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded p-1 text-[#7b746b] transition hover:bg-[#f0ebe3] hover:text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#2d4b52]"
          aria-label="Dismiss open app banner"
        >
          <span aria-hidden className="text-lg leading-none">
            ×
          </span>
        </button>
      </div>
    </div>
  );
}
