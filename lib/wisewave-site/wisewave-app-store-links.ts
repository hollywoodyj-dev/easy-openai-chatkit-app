/** Android package from `mobile/app.json` — used for default Play Store URL. */
export const WISEWAVE_ANDROID_PACKAGE = "com.wisewave.chatkit";

export function getGooglePlayStoreUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_WISEWAVE_GOOGLE_PLAY_URL?.trim();
  if (fromEnv) return fromEnv;
  return `https://play.google.com/store/apps/details?id=${WISEWAVE_ANDROID_PACKAGE}`;
}

/** Set `NEXT_PUBLIC_WISEWAVE_IOS_APP_STORE_URL` when the App Store listing is live. */
export function getIosAppStoreUrl(): string | null {
  const fromEnv = process.env.NEXT_PUBLIC_WISEWAVE_IOS_APP_STORE_URL?.trim();
  return fromEnv || null;
}

export function hasIosAppStoreUrl(): boolean {
  return Boolean(getIosAppStoreUrl());
}
