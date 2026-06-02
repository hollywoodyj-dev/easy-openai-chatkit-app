/** Paid search landing pages (`/lp/*`) — Innerpro branding for Google Ads review. */
export function isPaidLpPath(pathname: string | null | undefined): boolean {
  return Boolean(pathname?.startsWith("/lp/"));
}
