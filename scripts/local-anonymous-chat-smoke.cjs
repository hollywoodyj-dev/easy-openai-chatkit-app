/**
 * Local anonymous API smoke: one cookie identity for session → messages → turn → reflection.
 *
 * Proves: missing Set-Cookie on follow-ups (new anonymous id per call) is what triggers
 * 404 "Conversation not found or access denied" for anonymous callers.
 *
 * Prereqs: Next running; DATABASE_URL + applied schema; OPENAI_API_KEY (server) for turn + reflection.
 *
 * Usage:
 *   npm run local-anonymous:smoke
 *   BASE_URL=http://localhost:3000 npm run local-anonymous:smoke
 */

/* eslint-disable no-console */

const COOKIE_NAME = "chatkit_session_id";

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

function getSetCookieLines(res) {
  if (typeof res.headers.getSetCookie === "function") {
    return res.headers.getSetCookie();
  }
  const sc = res.headers.get("set-cookie");
  if (!sc) return [];
  return [sc];
}

/** First chatkit_session_id value from Set-Cookie lines (name=value before first `;`). */
function takeSessionCookieValue(setCookieLines) {
  const prefix = `${COOKIE_NAME}=`;
  for (const line of setCookieLines) {
    const first = String(line).split(";")[0].trim();
    if (first.toLowerCase().startsWith(prefix.toLowerCase())) {
      return first.slice(COOKIE_NAME.length + 1);
    }
  }
  return null;
}

function cookieHeaderFromValue(value) {
  return `${COOKIE_NAME}=${value}`;
}

async function readJsonOrThrow(res, label) {
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`${label}: non-JSON body (${res.status}): ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    const err = body.error || body.message || res.statusText;
    throw new Error(`${label} failed (${res.status}): ${typeof err === "string" ? err : JSON.stringify(err)}`);
  }
  return body;
}

async function main() {
  console.log("Base URL:", baseUrl);

  // 1) Create session (anonymous; no Cookie → server should Set-Cookie)
  const sessionRes = await fetch(`${baseUrl}/api/chat/session`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const setLines = getSetCookieLines(sessionRes);
  const cookieValue = takeSessionCookieValue(setLines);
  const sessionBody = await readJsonOrThrow(sessionRes, "POST /api/chat/session");
  const sessionId = sessionBody.session_id;

  if (!sessionId || typeof sessionId !== "string") {
    throw new Error("POST /api/chat/session: missing session_id in JSON");
  }
  if (!cookieValue) {
    throw new Error(
      "No chatkit_session_id in Set-Cookie. If you used Bearer auth on session, that path does not set this cookie; run without Authorization for anonymous smoke."
    );
  }

  const cookie = cookieHeaderFromValue(decodeURIComponent(cookieValue));

  console.log("session_id:", sessionId);
  console.log("Anonymous cookie: present (length %d)", cookie.length);

  const authHeaders = {
    "Content-Type": "application/json",
    Cookie: cookie,
  };

  // 2) GET messages
  const msgGetUrl = new URL("/api/chat/messages", baseUrl);
  msgGetUrl.searchParams.set("session_id", sessionId);
  const getRes = await fetch(msgGetUrl, { headers: { Cookie: cookie } });
  const getBody = await readJsonOrThrow(getRes, "GET /api/chat/messages");
  const count = Array.isArray(getBody.messages) ? getBody.messages.length : 0;
  console.log("GET messages: ok, count =", count);

  // 3) POST turn
  const turnRes = await fetch(`${baseUrl}/api/chat/turn`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      session_id: sessionId,
      message: "Short smoke test: name one thing you notice about this message in one sentence.",
    }),
  });
  const turnBody = await readJsonOrThrow(turnRes, "POST /api/chat/turn");
  if (typeof turnBody.assistant_message !== "string" || !turnBody.assistant_message.trim()) {
    console.warn("Turn returned empty assistant_message; continuing.");
  } else {
    console.log("POST turn: ok (assistant length", turnBody.assistant_message.length, ")");
  }

  // 4) POST reflection
  const reflRes = await fetch(`${baseUrl}/api/chat/reflection`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({ session_id: sessionId, user_reflection: "Smoke: checkpoint" }),
  });
  const reflBody = await readJsonOrThrow(reflRes, "POST /api/chat/reflection");
  if (typeof reflBody.summary === "string" && reflBody.summary.trim()) {
    console.log("POST reflection: ok (summary length", reflBody.summary.length, ")");
  } else {
    console.log("POST reflection: ok (checkpoint_id:", reflBody.checkpoint_id, ")");
  }

  console.log("\nSmoke passed: one anonymous cookie carried session → messages → turn → reflection.");
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
