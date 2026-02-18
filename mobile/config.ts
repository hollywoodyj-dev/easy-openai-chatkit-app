/**
 * Backend base URL. Change this for staging or production.
 * No trailing slash.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "https://wisewave-chatkit-app-v2.vercel.app";

export const getEmbedMobileUrl = (token: string): string =>
  `${API_BASE_URL}/embed-mobile?token=${encodeURIComponent(token)}`;
