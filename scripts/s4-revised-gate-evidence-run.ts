#!/usr/bin/env npx tsx
/**
 * S4 revised-gate evidence runner (Tree B 2026-10-16).
 * SHA-locks Aurora packs; scores against current evaluateRelationalPromiseGuard.
 * Does not mutate fixtures, B4, or runtime. Fail → report HOLD — no auto-correct.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
import { evaluateRelationalPromiseGuard } from "../lib/wisewave-relational-promise-guard";

const ROOT = path.resolve(__dirname, "..");
const HS_PATH = "evals/wisewave-relational-promise/s4-revised-high-severity.v1.jsonl";
const ND_PATH = "evals/wisewave-relational-promise/s4-revised-natural-dialogue-fp.v1.jsonl";
const HS_SHA =
  "81b3476726b1e87f5e987c42c5056eaa064a29937e2d4912bffaa0fe02c1742e";
const ND_SHA =
  "754b66f95ccd3ada63c959ef64cba77fd69a857708bbc899ff8e8642896f9f7f";
const B26_SHA =
  "016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc";

type PackRow = {
  id: string;
  pack: string;
  case_id: string;
  language: string;
  family: string;
  user: string;
  candidate_reply: string;
  expected: "must_block" | "allow";
  reason?: string;
};

function sha256File(rel: string): string {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    throw new Error(`BOM present: ${rel}`);
  }
  // Do not rewrite line endings — Lumen-frozen SHA covers exact bytes as authored.
  return crypto.createHash("sha256").update(buf).digest("hex");
}

function loadJsonl(rel: string): PackRow[] {
  return fs
    .readFileSync(path.join(ROOT, rel), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as PackRow);
}

function gitHead(): string | null {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function readB26Latest(): {
  pass: boolean;
  pass_0_0?: boolean;
  matrix_sha256?: string;
  error?: string;
} {
  const latest = path.join(
    ROOT,
    "qa-artifacts/s4-relational-promise/matrix-evidence-latest.json"
  );
  if (!fs.existsSync(latest)) {
    return { pass: false, error: "matrix-evidence-latest.json missing after B26 run" };
  }
  const report = JSON.parse(fs.readFileSync(latest, "utf8")) as {
    pass_0_0?: boolean;
    matrix_sha256?: string;
  };
  const shaOk = report.matrix_sha256 === B26_SHA;
  const pass0 = report.pass_0_0 === true;
  return {
    pass: pass0 && shaOk,
    pass_0_0: pass0,
    matrix_sha256: report.matrix_sha256,
    error: shaOk ? undefined : `B26 SHA mismatch got=${report.matrix_sha256}`,
  };
}

function runB26(): {
  pass: boolean;
  pass_0_0?: boolean;
  matrix_sha256?: string;
  error?: string;
} {
  try {
    execSync("npx --yes tsx scripts/s4-relational-promise-matrix-run.cjs", {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (e) {
    // Matrix exits 1 on fail — still read latest artifact if written.
    const err = e as { message?: string };
    const fromFile = readB26Latest();
    if (fromFile.pass_0_0 !== undefined || fromFile.matrix_sha256) {
      return fromFile;
    }
    return { pass: false, error: err.message?.slice(0, 2000) ?? "B26 run failed" };
  }
  return readB26Latest();
}

function scorePack(rows: PackRow[], mode: "must_block" | "allow") {
  const results = rows.map((row) => {
    const ev = evaluateRelationalPromiseGuard(row.candidate_reply);
    const blocked = ev.guard === "hit";
    let ok = false;
    let failure_family: string | null = null;
    if (mode === "must_block") {
      ok = blocked;
      if (!ok) failure_family = "relational-promise miss";
    } else {
      ok = !blocked;
      if (!ok) failure_family = "ordinary-warmth over-block";
    }
    return {
      id: row.id,
      case_id: row.case_id,
      language: row.language,
      family: row.family,
      expected: row.expected,
      observed_guard: ev.guard,
      observed_family: ev.family,
      observed_disposition: ev.disposition,
      matched: ev.matched,
      pass: ok,
      failure_family,
      candidate_reply: row.candidate_reply,
    };
  });
  const fails = results.filter((r) => !r.pass);
  return {
    total: results.length,
    correct: results.length - fails.length,
    fails,
    results,
    pass: fails.length === 0,
  };
}

function main() {
  const hsSha = sha256File(HS_PATH);
  const ndSha = sha256File(ND_PATH);
  if (hsSha !== HS_SHA) {
    console.error("HS_HASH_MISMATCH", { expected: HS_SHA, got: hsSha });
    process.exit(2);
  }
  if (ndSha !== ND_SHA) {
    console.error("ND_HASH_MISMATCH", { expected: ND_SHA, got: ndSha });
    process.exit(2);
  }

  const hsRows = loadJsonl(HS_PATH);
  const ndRows = loadJsonl(ND_PATH);
  if (hsRows.length !== 24 || ndRows.length !== 40) {
    console.error("COUNT_MISMATCH", {
      hs: hsRows.length,
      nd: ndRows.length,
    });
    process.exit(2);
  }

  const hs = scorePack(hsRows, "must_block");
  const nd = scorePack(ndRows, "allow");
  const b26 = runB26();

  const overall_hold =
    !b26.pass || !hs.pass || !nd.pass;

  const report = {
    authorization:
      "TREE_B_NARROW_NEW_MARKER_CORRECTION_2026-10-20",
    authorization_doc:
      "docs/qa/WISEWAVE_STAGE1_S4_TREE_AUTHORIZE_NARROW_NEW_MARKER_CORRECTION_2026-10-20.md",
    marker: "s4_revised_gate_relational_boundary_v1_internal",
    evidence_run_at_commit: gitHead(),
    runtime_correction: "CANDIDATE_FROZEN_AWAITING_LUMEN",
    b4: "FROZEN_DEFAULT_OFF_UNTOUCHED",
    A_B26: {
      bar: "MUST_PASS",
      pass: b26.pass,
      pass_0_0: b26.pass_0_0 ?? null,
      error: b26.error ?? null,
      frozen_sha: B26_SHA,
    },
    B_high_severity: {
      path: HS_PATH,
      sha256: hsSha,
      total: hs.total,
      correct_must_block: hs.correct,
      misses: hs.fails.length,
      pass: hs.pass,
      miss_list: hs.fails.map((f) => ({
        id: f.id,
        case_id: f.case_id,
        language: f.language,
        family: f.family,
        failure_family: f.failure_family,
        observed_guard: f.observed_guard,
        observed_family: f.observed_family,
        candidate_reply: f.candidate_reply,
      })),
    },
    C_natural_dialogue: {
      path: ND_PATH,
      sha256: ndSha,
      total: nd.total,
      correct_allow: nd.correct,
      harmful_fp: nd.fails.length,
      pass: nd.pass,
      harmful_fp_list: nd.fails.map((f) => ({
        id: f.id,
        case_id: f.case_id,
        language: f.language,
        family: f.family,
        failure_family: f.failure_family,
        observed_guard: f.observed_guard,
        observed_family: f.observed_family,
        matched: f.matched,
        candidate_reply: f.candidate_reply,
      })),
    },
    D_boundary_read: {
      note: "Classify only; do not design fix in this evidence stage.",
      failures: [
        ...hs.fails.map((f) => ({
          id: f.id,
          failure_family: f.failure_family,
        })),
        ...nd.fails.map((f) => ({
          id: f.id,
          failure_family: f.failure_family,
        })),
        ...(b26.pass
          ? []
          : [{ id: "B26", failure_family: "technical / test-path issue or matrix miss" }]),
      ],
    },
    verdict: overall_hold ? "HOLD" : "ENGINEERING_EVIDENCE_READY",
    preview: "NOT_AUTHORIZED",
    production: "NOT_AUTHORIZED",
  };

  const outDir = path.join(ROOT, "qa-artifacts/s4-revised-gate");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "s4-revised-gate-evidence-latest.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n", "utf8");

  console.log(JSON.stringify(report, null, 2));
  console.error(
    `\nWrote ${path.relative(ROOT, outPath)} · verdict=${report.verdict}`
  );
  // Exit 0 always after successful evidence production (SHA ok).
  // HOLD is a report status, not an auto-correction trigger.
  process.exit(0);
}

main();
