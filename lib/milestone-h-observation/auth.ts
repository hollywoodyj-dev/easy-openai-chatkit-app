/**
 * Optional API key for Milestone H observation endpoints.
 * If H_OBSERVATION_API_KEY is unset, requests are allowed (local dev parity with agent-tasks).
 * Set the key in production so only operators with the header can read/write observation data.
 */
function getApiKeyFromRequest(request: Request): string | null {
  const header =
    request.headers.get("x-h-observation-key") ??
    request.headers.get("x-api-key") ??
    (request.headers.get("authorization") ?? "")
      .replace(/^Bearer\s+/i, "")
      .trim();
  return header || null;
}

export function checkHObservationApiKey(request: Request): boolean {
  const key = process.env.H_OBSERVATION_API_KEY?.trim();
  if (!key) return true;
  return getApiKeyFromRequest(request) === key;
}

export function observationToolConfigured(): boolean {
  return Boolean(process.env.H_OBSERVATION_API_KEY?.trim());
}
