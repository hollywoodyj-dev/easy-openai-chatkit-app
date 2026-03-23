"use client";

const STORAGE_KEY = "hObservationApiKey";

export function getObservationApiKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(STORAGE_KEY) ?? "";
}

export function setObservationApiKey(key: string): void {
  if (typeof window === "undefined") return;
  if (key.trim()) localStorage.setItem(STORAGE_KEY, key.trim());
  else localStorage.removeItem(STORAGE_KEY);
}

export function observationFetchInit(
  init: RequestInit = {}
): RequestInit {
  const key = getObservationApiKey();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (key) headers.set("x-h-observation-key", key);
  return { ...init, headers };
}

export async function observationFetch(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(path, observationFetchInit(init));
}
