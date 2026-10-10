#!/usr/bin/env node
/**
 * Tree 2026-10-10 option 2 — P1 holdfix6 Preview hosted smoke.
 * Uses `vercel curl` so Vercel Authentication is satisfied.
 *
 * Usage:
 *   node scripts/p1-holdfix6-preview-smoke.cjs
 *   P1_PREVIEW_BASE_URL=https://... node scripts/p1-holdfix6-preview-smoke.cjs
 */
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const BASE =
  process.env.P1_PREVIEW_BASE_URL?.trim() ||
  "https://wisewave-chatkit-app-v2-q8oaa2tx8-jing-yangs-projects-db5d1ce8.vercel.app";
const EXPECTED_MARKER = "p1_response_calibration_v1_holdfix6";
const PROD = "https://www.wisewave.io";

const CONTINUE_STUCK_ZH =
  "你已经说出了看到的那一点。\n\n你刚说的里面，还有哪一句现在比较近？";

function vercelCurl(url, curlArgs) {
  const args = ["vercel", "curl", url, "--", ...curlArgs];
  const r = spawnSync("npx", args, {
    encoding: "utf8",
    maxBuffer: 8 * 1024 * 1024,
    shell: true,
  });
  // vercel curl may exit non-zero even on HTTP 200; callers validate the body file.
  return { stdout: r.stdout || "", stderr: r.stderr || "", status: r.status };
}

function parseHeadersAndBody(raw) {
  const idx = raw.indexOf("\r\n\r\n");
  const idx2 = idx < 0 ? raw.indexOf("\n\n") : idx;
  if (idx2 < 0) return { headers: "", body: raw };
  const sep = raw.slice(idx2, idx2 + 4).includes("\r\n") ? 4 : 2;
  return { headers: raw.slice(0, idx2), body: raw.slice(idx2 + sep) };
}

function createSession() {
  const jar = path.join(os.tmpdir(), `p1-jar-${Date.now()}.txt`);
  const tmp = path.join(os.tmpdir(), `p1-session-${Date.now()}.json`);
  const raw = vercelCurl(`${BASE}/api/chat/session`, [
    "-X",
    "POST",
    "-H",
    "Content-Type: application/json",
    "-d",
    "{}",
    "-c",
    jar,
    "-o",
    tmp,
  ]);
  if (!fs.existsSync(tmp)) {
    throw new Error(`session body missing: ${raw.stderr || raw.stdout}`);
  }
  const body = JSON.parse(fs.readFileSync(tmp, "utf8"));
  fs.unlinkSync(tmp);
  if (!body.session_id) throw new Error(`no session_id: ${JSON.stringify(body)}`);
  return { sessionId: body.session_id, jar };
}

function turn(sessionId, jar, message, lang) {
  const payloadPath = path.join(os.tmpdir(), `p1-turn-req-${Date.now()}.json`);
  const payload = {
    session_id: sessionId,
    message,
  };
  if (lang) payload.lang = lang;
  fs.writeFileSync(payloadPath, JSON.stringify(payload), "utf8");
  const tmp = path.join(os.tmpdir(), `p1-turn-${Date.now()}.json`);
  // Forward slashes avoid Windows path mangling under shell:true + curl @file.
  const payloadAt = `@${payloadPath.replace(/\\/g, "/")}`;
  const jarPath = jar.replace(/\\/g, "/");
  const outPath = tmp.replace(/\\/g, "/");
  const curlArgs = [
    "-X",
    "POST",
    "-H",
    "Content-Type: application/json",
    "--data-binary",
    payloadAt,
    "-b",
    jarPath,
    "-c",
    jarPath,
    "-o",
    outPath,
  ];
  const raw = vercelCurl(`${BASE}/api/chat/turn`, curlArgs);
  try {
    fs.unlinkSync(payloadPath);
  } catch {
    /* ignore */
  }
  if (!fs.existsSync(tmp)) {
    throw new Error(`turn body missing: ${raw.stderr || raw.stdout}`);
  }
  const body = JSON.parse(fs.readFileSync(tmp, "utf8"));
  fs.unlinkSync(tmp);
  if (body.error) {
    throw new Error(`turn error: ${JSON.stringify(body)}`);
  }
  return body;
}

function pickDebug(body) {
  return {
    enabled: body.debug_p1_turn_handoff_enabled,
    applied: body.debug_p1_turn_handoff_applied,
    marker: body.debug_p1_turn_handoff_build_marker,
    vercel_env: body.debug_p1_turn_handoff_vercel_env,
    flag_set: body.debug_p1_turn_handoff_flag_set,
    allow_preview: body.debug_p1_turn_handoff_allow_hosted_preview_set,
    blocked_preview: body.debug_p1_turn_handoff_blocked_on_preview,
    blocked_production: body.debug_p1_turn_handoff_blocked_on_production,
    blocked_hosted: body.debug_p1_turn_handoff_blocked_on_hosted,
    continue_stuck: body.debug_p1_continue_stuck_locked_reply_applied,
    two_sided: body.debug_p1_two_sided_locked_reply_applied,
    correction: body.debug_p1_correction_locked_reply_applied,
    repeat: body.debug_p1_repeat_locked_reply_applied,
    missing_prior: body.debug_p1_missing_prior_locked_reply_applied,
    unfinished: body.debug_p1_unfinished_fragment_repaired,
    sanitized: body.debug_p1_visible_reply_sanitized,
    drift_suppressed: body.debug_drift_suppressed ?? body.debug_unified_drift_suppressed,
    assistant: body.assistant_message || body.response?.main_reflection || "",
  };
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

async function main() {
  const results = [];
  const fail = [];

  // --- Production isolation (must stay off) ---
  try {
    const prodSessionRaw = spawnSync(
      "curl",
      [
        "-sS",
        "-X",
        "POST",
        `${PROD}/api/chat/session`,
        "-H",
        "Content-Type: application/json",
        "-d",
        "{}",
        "-c",
        path.join(os.tmpdir(), "p1-prod-cookies.txt"),
      ],
      { encoding: "utf8", shell: true }
    );
    const prodSession = JSON.parse(prodSessionRaw.stdout || "{}");
    const prodTurnRaw = spawnSync(
      "curl",
      [
        "-sS",
        "-X",
        "POST",
        `${PROD}/api/chat/turn`,
        "-H",
        "Content-Type: application/json",
        "-b",
        path.join(os.tmpdir(), "p1-prod-cookies.txt"),
        "-d",
        JSON.stringify({
          session_id: prodSession.session_id,
          message: "She didn’t reply. I feel awful.",
        }),
      ],
      { encoding: "utf8", shell: true }
    );
    const prodBody = JSON.parse(prodTurnRaw.stdout || "{}");
    // Production must not apply handoff. Code may be absent on prod (fields undefined) or present-but-blocked.
    const prodOk =
      prodBody.debug_p1_turn_handoff_enabled !== true &&
      prodBody.debug_p1_turn_handoff_applied !== true;
    results.push({
      id: "PROD-ISOLATION",
      pass: prodOk,
      debug: {
        enabled: prodBody.debug_p1_turn_handoff_enabled ?? null,
        applied: prodBody.debug_p1_turn_handoff_applied ?? null,
        blocked_production: prodBody.debug_p1_turn_handoff_blocked_on_production ?? null,
        vercel_env: prodBody.debug_p1_turn_handoff_vercel_env ?? null,
        flag_set: prodBody.debug_p1_turn_handoff_flag_set ?? null,
        note:
          prodBody.debug_p1_turn_handoff_enabled === undefined
            ? "P1 handoff fields absent on Production (branch not merged) — treated as isolated"
            : "P1 fields present; enabled must stay false",
      },
    });
    if (!prodOk) fail.push("PROD-ISOLATION");
  } catch (e) {
    results.push({ id: "PROD-ISOLATION", pass: false, error: String(e) });
    fail.push("PROD-ISOLATION");
  }

  function runCase(id, turns) {
    const { sessionId, jar } = createSession();
    const turnResults = [];
    for (const t of turns) {
      const body = turn(sessionId, jar, t.user, t.lang);
      const d = pickDebug(body);
      turnResults.push({ user: t.user, ...d });
      assert(d.vercel_env === "preview", `${id}: vercel_env=${d.vercel_env}`);
      assert(d.enabled === true, `${id}: enabled!=true`);
      assert(d.flag_set === true, `${id}: flag_set!=true`);
      assert(d.allow_preview === true, `${id}: allow_preview!=true`);
      assert(d.blocked_production === false, `${id}: blocked_production`);
      assert(d.blocked_preview === false, `${id}: blocked_preview`);
      assert(d.marker === EXPECTED_MARKER, `${id}: marker=${d.marker}`);
      if (t.expect) t.expect(d, id);
    }
    results.push({ id, pass: true, turns: turnResults });
  }

  try {
    runCase("TH-11", [
      {
        user: "对，我好像终于知道自己在纠结什么了。可是我不知道接下来怎么谈。",
        lang: "zh",
        expect(d, id) {
          assert(d.continue_stuck === true, `${id}: continue_stuck not locked`);
          assert(
            String(d.assistant).replace(/\r\n/g, "\n").trim() === CONTINUE_STUCK_ZH,
            `${id}: reply mismatch: ${JSON.stringify(d.assistant)}`
          );
          assert(d.drift_suppressed !== true, `${id}: drift_suppressed`);
        },
      },
    ]);
  } catch (e) {
    results.push({ id: "TH-11", pass: false, error: String(e) });
    fail.push("TH-11");
  }

  try {
    runCase("TH-10-EN", [
      {
        user: "Part of me thinks this may not be right for me, but I still can't let it go.",
        lang: "en",
        expect(d, id) {
          assert(d.two_sided === true || d.applied === true, `${id}: no two-sided/applied`);
        },
      },
    ]);
  } catch (e) {
    results.push({ id: "TH-10-EN", pass: false, error: String(e) });
    fail.push("TH-10-EN");
  }

  try {
    runCase("TH-10-ZH", [
      {
        user: "我知道这段关系可能不适合我，但我就是放不下。",
        lang: "zh",
        expect(d, id) {
          assert(d.two_sided === true || d.applied === true, `${id}: no two-sided/applied`);
        },
      },
    ]);
  } catch (e) {
    results.push({ id: "TH-10-ZH", pass: false, error: String(e) });
    fail.push("TH-10-ZH");
  }

  try {
    runCase("TH-13", [
      {
        // ASCII apostrophes — matches unit fixture / looksLikeP1UserCorrection.
        user: "That's not what I meant. I'm not afraid of leaving — I think it's unfair.",
        lang: "en",
        expect(d, id) {
          assert(d.correction === true, `${id}: correction lock missing`);
          assert(!String(d.assistant).includes("}"), `${id}: stray brace`);
          assert(
            /had that wrong|unfair/i.test(String(d.assistant)),
            `${id}: correction reply shape`
          );
        },
      },
    ]);
  } catch (e) {
    results.push({ id: "TH-13", pass: false, error: String(e) });
    fail.push("TH-13");
  }

  try {
    runCase("TH-03", [
      {
        user: "They haven't replied since yesterday. I keep moving between 'they don't care' and 'maybe they're simply busy.'",
        lang: "en",
        expect(d, id) {
          assert(d.applied === true, `${id}: not applied`);
          assert(d.unfinished !== true || !/\.\.\.$/.test(d.assistant), `${id}: unfinished fragment`);
        },
      },
    ]);
  } catch (e) {
    results.push({ id: "TH-03", pass: false, error: String(e) });
    fail.push("TH-03");
  }

  try {
    runCase("TH-15", [
      {
        user: "I keep circling the same point and nothing new is coming.",
        lang: "en",
        expect() {},
      },
      {
        user: "I keep circling the same point and nothing new is coming.",
        lang: "en",
        expect(d, id) {
          assert(d.repeat === true || d.applied === true, `${id}: repeat path`);
        },
      },
    ]);
  } catch (e) {
    results.push({ id: "TH-15", pass: false, error: String(e) });
    fail.push("TH-15");
  }

  try {
    runCase("TH-16", [
      {
        user: "Can we continue what we talked about last time?",
        lang: "en",
        expect(d, id) {
          assert(d.missing_prior === true, `${id}: missing-prior lock missing`);
        },
      },
    ]);
  } catch (e) {
    results.push({ id: "TH-16", pass: false, error: String(e) });
    fail.push("TH-16");
  }

  // EN/ZH utilitarian controls — handoff should suppress
  for (const [id, user, lang] of [
    ["CTRL-EN", "Summarize what I said in three bullets.", "en"],
    ["CTRL-ZH", "把我刚才说的总结成三点。", "zh"],
  ]) {
    try {
      const { sessionId, jar } = createSession();
      const body = turn(sessionId, jar, user, lang);
      const d = pickDebug(body);
      const ok =
        d.marker === EXPECTED_MARKER &&
        d.enabled === true &&
        (body.debug_p1_turn_handoff_suppression_reason === "suppressed_utilitarian" ||
          d.applied === false);
      results.push({ id, pass: ok, debug: d, suppression: body.debug_p1_turn_handoff_suppression_reason });
      if (!ok) fail.push(id);
    } catch (e) {
      results.push({ id, pass: false, error: String(e) });
      fail.push(id);
    }
  }

  const out = {
    base: BASE,
    marker: EXPECTED_MARKER,
    generated_at: new Date().toISOString(),
    pass: fail.length === 0,
    fail,
    results,
  };
  const outDir = path.join(__dirname, "..", "qa-artifacts", "p1-turn-handoff");
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(outDir, `preview-smoke-holdfix6-${stamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  fs.writeFileSync(path.join(outDir, "preview-smoke-holdfix6-latest.json"), JSON.stringify(out, null, 2));
  console.log(JSON.stringify({ pass: out.pass, fail, outPath }, null, 2));
  process.exit(fail.length === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
