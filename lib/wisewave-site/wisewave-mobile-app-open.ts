import {
  getGooglePlayStoreUrl,
  getIosAppStoreUrl,
  WISEWAVE_ANDROID_PACKAGE,
} from "@/lib/wisewave-site/wisewave-app-store-links";

export type MobilePlatform = "ios" | "android";

export const WISEWAVE_APP_SCHEME =
  process.env.NEXT_PUBLIC_WISEWAVE_APP_SCHEME?.trim() || "wisewave";

export const MOBILE_OPEN_APP_BANNER_DISMISS_KEY =
  "wisewave_mobile_open_app_banner_dismissed_until";

/** Days to hide the banner after dismiss. */
export const MOBILE_OPEN_APP_BANNER_DISMISS_DAYS = 7;

export function detectMobilePlatform(userAgent: string): MobilePlatform | null {
  if (/iPad|iPhone|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return null;
}

export function getWisewaveAppDeepLink(path = ""): string {
  const normalized = path.replace(/^\//, "");
  return normalized
    ? `${WISEWAVE_APP_SCHEME}://${normalized}`
    : `${WISEWAVE_APP_SCHEME}://`;
}

/** Android intent URL opens the app when installed, else Play Store. */
export function getAndroidAppOpenUrl(fallbackUrl?: string): string {
  const playUrl = encodeURIComponent(fallbackUrl ?? getGooglePlayStoreUrl());
  return (
    `intent://open#Intent;scheme=${WISEWAVE_APP_SCHEME};` +
    `package=${WISEWAVE_ANDROID_PACKAGE};` +
    `S.browser_fallback_url=${playUrl};end`
  );
}

/** Store or on-site fallback when the app is not installed (iOS). */
export function getIosAppInstallFallbackUrl(): string {
  return getIosAppStoreUrl() ?? "/app";
}

export function shouldShowMobileOpenAppBanner(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname.startsWith("/app")) return false;
  return true;
}
