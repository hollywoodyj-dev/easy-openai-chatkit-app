/**
 * P0 Reflection Entry — hosted QA probes (Slice 1).
 *
 * Validates debug_p0_* on POST /api/chat/turn when ENABLE_P0_REFLECTION_ENTRY=1 on server.
 *
 * Usage:
 *   set P0_BASE_URL=https://www.wisewave.io
 *   set P0_TOKEN=<jwt>
 *   node scripts/p0-reflection-entry-hosted-probes.cjs
 *
 * Optional: set P0_VERBOSE=1
 */

const BASE_URL = (process.env.P0_BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const TOKEN = (process.env.P0_TOKEN || "").trim();
const VERBOSE = process.env.P0_VERBOSE === "1";

if (!TOKEN) {
  console.error("Missing P0_TOKEN (Bearer JWT with chat access).");
  process.exit(1);
}

function authHeaders() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function jfetch(path, init) {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const text = await res.text();
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
    headers: authHeaders(),
    body: "{}",
  });
  assert(typeof data?.session_id === "string", "session_id missing", data);
  return data.session_id;
}

async function sendTurn(sessionId, message) {
  return jfetch("/api/chat/turn", {
    method: "POST",
    headers: authHeaders(),
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
    assert(turn.debug_p0_reflection_entry_enabled === true, "P0 flag off on server", turn);
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
