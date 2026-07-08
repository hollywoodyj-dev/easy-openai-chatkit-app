/**
 * P0 Reflection Entry — hosted QA probes (Slice 1).
 *
 * Validates debug_p0_* on POST /api/chat/turn when ENABLE_P0_REFLECTION_ENTRY=1 on server.
 * Use a **Vercel Preview** deployment URL — Production stays off until Lumen full sign-off.
 *
 * Usage:
 *   set P0_BASE_URL=https://<preview-deployment-url>
 *   set P0_TOKEN=<jwt>
 *   set P0_VERCEL_PROTECTION_BYPASS=<secret from Vercel Deployment Protection>
 *   node scripts/p0-reflection-entry-hosted-probes.cjs
 *
 * Optional: set P0_VERBOSE=1
 * Optional: set P0_ALLOW_PRODUCTION=1 to run against prod after sign-off (expects allow key on server)
 *
 * Vercel Authentication on Preview: steward creates "Protection Bypass for Automation" in
 * Project Settings → Deployment Protection, then shares the secret with Lumen (never commit).
 * Also accepts VERCEL_AUTOMATION_BYPASS_SECRET (Vercel system env name).
 */

const BASE_URL = (process.env.P0_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const TOKEN = (process.env.P0_TOKEN || "").trim();
const VERCEL_BYPASS = (
  process.env.P0_VERCEL_PROTECTION_BYPASS ||
  process.env.VERCEL_AUTOMATION_BYPASS_SECRET ||
  ""
).trim();
const VERBOSE = process.env.P0_VERBOSE === "1";
const ALLOW_PRODUCTION = process.env.P0_ALLOW_PRODUCTION === "1";
const IS_VERCEL_HOST =
  BASE_URL.includes(".vercel.app") || BASE_URL.includes("wisewave.io");

if (BASE_URL.includes("wisewave.io") && !ALLOW_PRODUCTION) {
  console.error(
    "P0 hosted probes target Preview only. Set P0_BASE_URL to a Vercel Preview URL, not production."
  );
  console.error("After full Lumen sign-off, set P0_ALLOW_PRODUCTION=1 to probe production.");
  process.exit(1);
}

if (IS_VERCEL_HOST && !VERCEL_BYPASS) {
  console.error(
    "Missing P0_VERCEL_PROTECTION_BYPASS (or VERCEL_AUTOMATION_BYPASS_SECRET)."
  );
  console.error(
    "Preview is behind Vercel Authentication. Steward: Vercel → Project → Settings →"
  );
  console.error(
    "Deployment Protection → Protection Bypass for Automation → Create secret."
  );
  console.error("Share the secret with Lumen locally — do not commit it.");
  process.exit(1);
}

if (!TOKEN) {
  console.error("Missing P0_TOKEN (Bearer JWT with chat access).");
  process.exit(1);
}

function requestHeaders() {
  const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  };
  if (VERCEL_BYPASS) {
    headers["x-vercel-protection-bypass"] = VERCEL_BYPASS;
  }
  return headers;
}

function looksLikeVercelAuthWall(status, text) {
  if (status !== 401 && status !== 403) return false;
  const sample = text.slice(0, 500).toLowerCase();
  return (
    sample.includes("authentication required") ||
    sample.includes("vercel authentication") ||
    sample.includes("<!doctype html")
  );
}

function vercelAuthHelp() {
  return (
    "Blocked by Vercel Authentication before app code. " +
    "Set P0_VERCEL_PROTECTION_BYPASS to the Protection Bypass for Automation secret " +
    "(Project Settings → Deployment Protection)."
  );
}

async function jfetch(path, init) {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const text = await res.text();
  if (looksLikeVercelAuthWall(res.status, text)) {
    throw new Error(vercelAuthHelp());
  }
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`${path} non-JSON ${res.status}: ${text.slice(0, 200)}`);
  }
  if (!res.ok) {
    throw new Error(`${path} ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

function logStep(label, obj) {
  if (VERBOSE) console.log(label, obj);
}

function assert(cond, msg, detail) {
  if (!cond) {
    console.error("ASSERT FAIL:", msg, detail ?? "");
    process.exitCode = 1;
    throw new Error(msg);
  }
}

async function createSession() {
  const data = await jfetch("/api/chat/session", {
    method: "POST",
    headers: requestHeaders(),
    body: "{}",
  });
  assert(typeof data?.session_id === "string", "session_id missing", data);
  return data.session_id;
}

async function sendTurn(sessionId, message) {
  return jfetch("/api/chat/turn", {
    method: "POST",
    headers: requestHeaders(),
    body: JSON.stringify({ session_id: sessionId, message }),
  });
}

async function main() {
  let failed = 0;
  const run = async (id, fn) => {
    try {
      await fn();
      console.log(`PASS ${id}`);
    } catch (e) {
      failed += 1;
      console.log(`FAIL ${id}:`, e.message);
    }
  };

  await run("P0-hosted-enabled-marker", async () => {
    const sessionId = await createSession();
    const turn = await sendTurn(sessionId, "Hi");
    logStep("turn", turn);
    assert(turn.debug_p0_reflection_entry_flag_set === true, "P0 flag not set on server", turn);
    assert(turn.debug_p0_reflection_entry_enabled === true, "P0 not enabled on server", turn);
    assert(turn.debug_p0_reflection_entry_active === true, "P0 not active on turn", turn);
    assert(
      turn.debug_p0_reflection_entry_blocked_on_production !== true,
      "P0 blocked on production guard",
      turn
    );
    assert(
      turn.debug_p0_reflection_entry_build_marker === "p0_reflection_entry_v1_slice1",
      "unexpected build marker",
      turn
    );
  });

  await run("P0-hosted-greeting-mirror", async () => {
    const sessionId = await createSession();
    const turn = await sendTurn(sessionId, "Hi");
    assert(turn.debug_p0_opening_type === "greeting", "opening type", turn);
    assert(turn.debug_p0_reflection_mode === "mirror", "mode", turn);
    assert(turn.debug_p0_mode_applied === true, "mode not applied", turn);
    assert(turn.debug_p0_reflection_begun === false, "reflection begun too early", turn);
  });

  await run("P0-hosted-emotional-deepen-t1", async () => {
    const sessionId = await createSession();
    const turn = await sendTurn(
      sessionId,
      "I'm worried that I will not be able to make it"
    );
    assert(turn.debug_p0_opening_type === "emotional_opening", "opening type", turn);
    assert(turn.debug_p0_reflection_mode === "deepen", "mode", turn);
    assert(turn.debug_p0_mode_applied === true, "mode not applied", turn);
    assert(turn.debug_p0_reflection_begun === false, "reflection begun on t1", turn);
  });

  await run("P0-hosted-mode-clears-t2", async () => {
    const sessionId = await createSession();
    await sendTurn(sessionId, "I'm worried that I will not be able to make it");
    const turn2 = await sendTurn(sessionId, "It still feels heavy when I think about tomorrow");
    assert(turn2.debug_p0_reflection_begun === true, "reflection should be begun", turn2);
    assert(turn2.debug_p0_mode_applied === false, "mode should clear", turn2);
    assert(turn2.debug_p0_mode_cleared === true, "mode_cleared flag", turn2);
  });

  await run("P0-hosted-question-clarify", async () => {
    const sessionId = await createSession();
    const turn = await sendTurn(
      sessionId,
      "I need self reflection could you ask me some questions"
    );
    assert(turn.debug_p0_opening_type === "question_request", "opening type", turn);
    assert(turn.debug_p0_reflection_mode === "clarify", "mode", turn);
  });

  await run("P0-hosted-safety-override", async () => {
    const sessionId = await createSession();
    const turn = await sendTurn(sessionId, "I want to kill myself");
    assert(turn.debug_p0_safety_override === true, "safety override", turn);
    assert(turn.debug_p0_mode_applied === false, "mode should not apply", turn);
  });

  console.log(`\n${6 - failed}/6 hosted probes passed (failures: ${failed})`);
  if (failed) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
