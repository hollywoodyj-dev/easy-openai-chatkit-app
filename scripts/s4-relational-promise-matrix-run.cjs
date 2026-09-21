#!/usr/bin/env node
"use strict";

/**
 * S4 matrix evidence runner against frozen fixtures.v1.jsonl.
 * Does not mutate fixtures. Verifies SHA-256 before scoring.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const FROZEN =
  "016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc";

const root = path.resolve(__dirname, "..");
const jsonlPath = path.join(root, "evals/wisewave-relational-promise/fixtures.v1.jsonl");

// Register ts via project's path — use compiled-style require of built logic by
// spawning through vitest-compatible dynamic import of the .ts via jiti if present,
// else evaluate a minimal duplicate. Prefer loading through node + tsx/ts-node.
async function loadGuard() {
  try {
    require("tsx/cjs");
  } catch {
    /* optional */
  }
  try {
    return require("../lib/wisewave-relational-promise-guard.ts");
  } catch {
    // Fall back to registering via vitest's deps — run with npx tsx
    throw new Error("Run with: npx tsx scripts/s4-relational-promise-matrix-run.cjs");
  }
}

function loadRows(buf) {
  return buf
    .toString("utf8")
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));
}

function factPreserved(rewritten, required) {
  if (!required) return true;
  const norm = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[.。！？!?]+$/g, "")
      .replace(/\s+/g, " ")
      .trim();
  const r = norm(rewritten || "");
  const f = norm(required);
  return r.includes(f) || f.includes(r);
}

async function main() {
  const buf = fs.readFileSync(jsonlPath);
  if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
    throw new Error("BOM present");
  }
  if (buf.includes(0x0d)) throw new Error("CR present");
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  if (hash !== FROZEN) {
    console.error("HASH_MISMATCH", { expected: FROZEN, got: hash });
    process.exit(2);
  }

  const { evaluateRelationalPromiseGuard } = await loadGuard();
  const rows = loadRows(buf);

  const results = [];
  let prohibitedMisses = { en: 0, zh: 0 };
  let allowedFp = { en: 0, zh: 0 };

  for (const row of rows) {
    const ev = evaluateRelationalPromiseGuard(row.text);
    let pass = true;
    let reason = "";

    if (row.polarity === "prohibited") {
      if (ev.guard !== "hit") {
        pass = false;
        reason = "prohibited_miss";
        prohibitedMisses[row.language]++;
      } else if (row.expected_disposition === "rewrite_remove_personal_keep_fact") {
        if (ev.disposition !== "rewrite_remove_personal_keep_fact") {
          pass = false;
          reason = "mixed_disposition_wrong";
          prohibitedMisses[row.language]++;
        } else if (!factPreserved(ev.rewrittenText, row.required_preserved_fact)) {
          pass = false;
          reason = "mixed_fact_not_preserved";
          prohibitedMisses[row.language]++;
        } else if (evaluateRelationalPromiseGuard(ev.rewrittenText || "").guard === "hit") {
          // Rewritten text must not still be a personal promise
          pass = false;
          reason = "mixed_personal_still_present";
          prohibitedMisses[row.language]++;
        }
      }
    } else if (row.polarity === "allowed_product_continuity") {
      if (ev.guard !== "miss") {
        pass = false;
        reason = "allowed_false_positive";
        allowedFp[row.language]++;
      }
    }
    // diagnostic_control: report only, not in 0/0 denominator

    results.push({
      id: row.id,
      language: row.language,
      polarity: row.polarity,
      family: row.family,
      expected_guard: row.expected_guard,
      observed_guard: ev.guard,
      expected_disposition: row.expected_disposition,
      observed_disposition: ev.disposition,
      observed_family: ev.family,
      matched: ev.matched,
      rewrittenText: ev.rewrittenText,
      required_preserved_fact: row.required_preserved_fact,
      pass,
      reason,
    });
  }

  const report = {
    matrix_sha256: hash,
    frozen_expected: FROZEN,
    hash_match: true,
    implementation_commit: null,
    prohibited_misses: prohibitedMisses,
    allowed_product_continuity_false_positives: allowedFp,
    pass_0_0:
      prohibitedMisses.en === 0 &&
      prohibitedMisses.zh === 0 &&
      allowedFp.en === 0 &&
      allowedFp.zh === 0,
    totals: {
      rows: rows.length,
      prohibited: rows.filter((r) => r.polarity === "prohibited").length,
      allowed: rows.filter((r) => r.polarity === "allowed_product_continuity").length,
      diagnostic: rows.filter((r) => r.polarity === "diagnostic_control").length,
      failed_rows: results.filter((r) => !r.pass).length,
    },
    failures: results.filter((r) => !r.pass),
    row_results: results,
  };

  const outDir = path.join(root, "qa-artifacts/s4-relational-promise");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `matrix-evidence-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");
  console.log(
    JSON.stringify(
      {
        pass_0_0: report.pass_0_0,
        prohibited_misses: prohibitedMisses,
        allowed_fp: allowedFp,
        failed: report.totals.failed_rows,
        outPath,
        failures: report.failures.map((f) => ({
          id: f.id,
          reason: f.reason,
          observed_guard: f.observed_guard,
          observed_family: f.observed_family,
        })),
      },
      null,
      2
    )
  );
  process.exit(report.pass_0_0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
