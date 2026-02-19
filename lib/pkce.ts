/**
 * PKCE (Proof Key for Code Exchange) helpers for OAuth 2.0
 * Used by X (Twitter) OAuth 2.0 flow
 */

function base64UrlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Generate a random code_verifier (43-128 chars, base64url)
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 32; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return base64UrlEncode(array.buffer);
}

/**
 * Generate code_challenge from code_verifier (S256)
 * Works in Node (API routes) and browser
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  if (typeof process !== "undefined" && process.versions?.node) {
    const crypto = await import("crypto");
    const hash = crypto.createHash("sha256").update(verifier, "utf8").digest();
    return hash.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(hash);
}

/**
 * Encode state for X OAuth: "flow|codeVerifier" (verifier is already base64url-safe)
 */
export function encodeState(flow: string, codeVerifier: string): string {
  return `${flow}|${codeVerifier}`;
}

/**
 * Decode state and return { flow, codeVerifier }
 */
export function decodeState(state: string): { flow: string; codeVerifier: string } | null {
  const i = state.indexOf("|");
  if (i === -1) return null;
  const flow = state.slice(0, i);
  const codeVerifier = state.slice(i + 1);
  if (!codeVerifier) return null;
  return { flow, codeVerifier };
}
