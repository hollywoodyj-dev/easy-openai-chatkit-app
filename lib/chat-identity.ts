import { verifyUserToken } from "@/lib/auth";

export const SESSION_COOKIE_NAME = "chatkit_session_id";
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Resolve chat user identity: Bearer token -> User.id; else cookie or generated anonymous id.
 * Used for create-session and chat messages API (persist anonymous users via cookie).
 */
export async function resolveChatUserId(request: Request): Promise<{
  userId: string;
  sessionCookie: string | null;
}> {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (token) {
    const userId = verifyUserToken(token);
    if (userId) {
      return { userId, sessionCookie: null };
    }
  }

  const existing = getCookieValue(
    request.headers.get("cookie"),
    SESSION_COOKIE_NAME
  );
  if (existing) {
    return { userId: existing, sessionCookie: null };
  }

  const generated =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return {
    userId: generated,
    sessionCookie: serializeSessionCookie(generated),
  };
}

export function getCookieValue(
  cookieHeader: string | null,
  name: string
): string | null {
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [rawName, ...rest] = cookie.split("=");
    if (!rawName || rest.length === 0) continue;
    if (rawName.trim() === name) return rest.join("=").trim();
  }
  return null;
}

export function serializeSessionCookie(value: string): string {
  const attributes = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${SESSION_COOKIE_MAX_AGE}`,
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (process.env.NODE_ENV === "production") {
    attributes.push("Secure");
  }
  return attributes.join("; ");
}
