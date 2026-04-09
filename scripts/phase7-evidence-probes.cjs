/**
 * Phase 7 evidence QA probes (instrumentation coherence).
 *
 * Purpose:
 * - Validate `meta.phase_7` on GET /api/chat/threads.
 * - Validate `debug_phase_7` on POST /api/chat/turn.
 * - Confirm weak-tail suppression and strong-path debug consistency.
 *
 * Usage:
 *   # Requires running app server and a valid token with chat access.
 *   set PHASE7_BASE_URL=http://127.0.0.1:3000&& set PHASE7_TOKEN=...&& node scripts/phase7-evidence-probes.cjs
 *
 * Optional:
 *   set PHASE7_VERBOSE=1
 */

const BASE_URL = (process.env.PHASE7_BASE_URL || "http://127.0.0.1:3000").replace(
  /\/$/,
  ""
);
const TOKEN = (process.env.PHASE7_TOKEN || "").trim();
const VERBOSE = process.env.PHASE7_VERBOSE === "1";

const TAXONOMY_VERSION = "phase7_v1";

if (!TOKEN) {
  console.error("Missing PHASE7_TOKEN.");
  process.exit(1);
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  };
}

async function jfetch(path, init = {}) {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { _raw: text };
  }
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${path}`);
    err.response = json;
    throw err;
  }
  return json;
}

function assert(cond, message, details) {
  if (!cond) {
    const err = new Error(message);
    err.details = details;
    throw err;
  }
}

function logStep(name, payload) {
  console.log(`\n[phase7-probe] ${name}`);
  if (VERBOSE && payload !== undefined) {
    console.log(JSON.stringify(payload, null, 2));
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

async function sendTurn(sessionId, message, extra = {}) {
  const payload = {
    session_id: sessionId,
    message,
    ...extra,
  };
  return jfetch("/api/chat/turn", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
}

async function getThreads(sessionId) {
  return jfetch(`/api/chat/threads?session_id=${encodeURIComponent(sessionId)}`, {
    method: "GET",
    headers: authHeaders(),
  });
}

async function selectContinue(sessionId, threadId) {
  return jfetch("/api/chat/threads", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ session_id: sessionId, thread_id: threadId }),
  });
}

async function main() {
  try {
    const sessionId = await createSession();
    logStep("session created", { sessionId });

    // Probe 1: normal strong substrate should expose phase_7 list meta.
    await sendTurn(
      sessionId,
      "After that slow reply, I keep replaying what I said and it still pulls inward."
    );
    const normalThreads = await getThreads(sessionId);
    logStep("normal threads", normalThreads.meta?.phase_7);

    const p7a = normalThreads?.meta?.phase_7;
    assert(p7a, "meta.phase_7 missing on normal threads", normalThreads);
    assert(
      p7a.taxonomy_version === TAXONOMY_VERSION,
      "phase_7 taxonomy_version mismatch",
      p7a
    );
    assert(p7a.exposure_denominator_event === 1, "exposure_denominator_event != 1", p7a);
    assert(
      p7a.exposure_numerator_event === (Array.isArray(normalThreads.threads) && normalThreads.threads.length > 0 ? 1 : 0),
      "exposure_numerator_event mismatch with thread count",
      { p7: p7a, count: normalThreads.threads?.length }
    );

    // Probe 2: weak-tail suppression should mark weak_case_suppressed_event + zero_surface_success_event.
    await sendTurn(sessionId, "Thanks.");
    const suppressedThreads = await getThreads(sessionId);
    logStep("suppressed threads", suppressedThreads.meta);

    const p7b = suppressedThreads?.meta?.phase_7;
    assert(p7b, "meta.phase_7 missing on suppressed threads", suppressedThreads);
    assert(
      suppressedThreads?.meta?.continue_suppressed_last_user_turn === true,
      "continue_suppressed_last_user_turn should be true",
      suppressedThreads.meta
    );
    assert(p7b.exposure_numerator_event === 0, "suppressed exposure_numerator_event should be 0", p7b);
    assert(p7b.weak_case_suppressed_event === 1, "weak_case_suppressed_event should be 1", p7b);
    assert(p7b.zero_surface_success_event === 1, "zero_surface_success_event should be 1", p7b);

    // Probe 3: strong-path turn debug (select Continue -> low-verbal reentry).
    await sendTurn(
      sessionId,
      "I am still carrying that same pressure from the delayed reply."
    );
    const candidateThreads = await getThreads(sessionId);
    const first = candidateThreads?.threads?.[0];
    assert(first?.id, "No continue thread available for strong-path probe", candidateThreads);
    await selectContinue(sessionId, first.id);
    const reentry = await sendTurn(sessionId, "mm", {
      phase_3_thread_reentry: true,
    });
    logStep("turn debug_phase_7", reentry.debug_phase_7);

    const p7c = reentry?.debug_phase_7;
    assert(p7c, "debug_phase_7 missing on turn response", reentry);
    assert(
      p7c.taxonomy_version === TAXONOMY_VERSION,
      "debug_phase_7 taxonomy_version mismatch",
      p7c
    );
    assert(
      p7c.return_pattern_id === "low_verbal_resumable_return",
      "return_pattern_id should be low_verbal_resumable_return for 'mm'",
      p7c
    );
    assert(p7c.short_ack_reentry === true, "short_ack_reentry should be true", p7c);
    assert(
      p7c.strong_path_event === true,
      "strong_path_event should be true for selected short-ack same-thread resume",
      { phase7: p7c, threadState: reentry?.debug_thread_state }
    );

    console.log("\n[phase7-probe] PASS: phase_7 evidence instrumentation coherence checks passed.");
  } catch (error) {
    console.error("\n[phase7-probe] FAIL:", error.message);
    if (error.details) console.error(JSON.stringify(error.details, null, 2));
    if (error.response) console.error(JSON.stringify(error.response, null, 2));
    process.exit(1);
  }
}

main();
