#!/usr/bin/env node
"use strict";

/**
 * S4 matrix evidence runner against frozen fixtures.v1.jsonl.
 * Does not mutate fixtures. Verifies SHA-256 before scoring.
 * Lumen HOLD 2026-09-22: family match, strict fact preservation,
 * paraphrases, commit stamp, language/family totals, diagnostics.
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const FROZEN =
  "016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc";

const root = path.resolve(__dirname, "..");
const jsonlPath = path.join(root, "evals/wisewave-relational-promise/fixtures.v1.jsonl");

async function loadGuard() {
  try {
    require("tsx/cjs");
  } catch {
    /* optional */
  }
  try {
    return require("../lib/wisewave-relational-promise-guard.ts");
  } catch {
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

function gitHead() {
  try {
    return execSync("git rev-parse HEAD", { cwd: root, encoding: "utf8" }).trim();
  } catch {
    return null;
  }
}

function expectedFamilyForRow(row) {
  if (row.expected_disposition === "rewrite_remove_personal_keep_fact") {
    return "mixed_factual_personal";
  }
  return row.family || null;
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

  const {
    evaluateRelationalPromiseGuard,
    preservesRequiredFact,
    S4_UNSEEN_PARAPHRASE_PROBES,
  } = await loadGuard();
  const rows = loadRows(buf);
  const implementationCommit = gitHead();

  const results = [];
  let prohibitedMisses = { en: 0, zh: 0 };
  let allowedFp = { en: 0, zh: 0 };
  let familyMismatches = { en: 0, zh: 0 };
  const familyTotals = {};
  const languageTotals = { en: { prohibited: 0, allowed: 0, diagnostic: 0 }, zh: { prohibited: 0, allowed: 0, diagnostic: 0 } };

  for (const row of rows) {
    const lang = row.language === "zh" ? "zh" : "en";
    if (row.polarity === "prohibited") languageTotals[lang].prohibited++;
    else if (row.polarity === "allowed_product_continuity") languageTotals[lang].allowed++;
    else languageTotals[lang].diagnostic++;

    if (row.polarity === "prohibited") {
      const famKey = `${lang}:${row.family || "unknown"}`;
      familyTotals[famKey] = (familyTotals[famKey] || 0) + 1;
    }

    const ev = evaluateRelationalPromiseGuard(row.text);
    let pass = true;
    let reason = "";

    if (row.polarity === "prohibited") {
      if (ev.guard !== "hit") {
        pass = false;
        reason = "prohibited_miss";
        prohibitedMisses[lang]++;
      } else {
        const wantFamily = expectedFamilyForRow(row);
        if (wantFamily && ev.family !== wantFamily) {
          pass = false;
          reason = `family_mismatch want=${wantFamily} got=${ev.family}`;
          familyMismatches[lang]++;
          prohibitedMisses[lang]++;
        } else if (row.expected_disposition === "rewrite_remove_personal_keep_fact") {
          if (ev.disposition !== "rewrite_remove_personal_keep_fact") {
            pass = false;
            reason = "mixed_disposition_wrong";
            prohibitedMisses[lang]++;
          } else if (!preservesRequiredFact(ev.rewrittenText, row.required_preserved_fact)) {
            pass = false;
            reason = "mixed_fact_not_preserved";
            prohibitedMisses[lang]++;
          } else if (/[,，]\s*$/.test(ev.rewrittenText || "")) {
            pass = false;
            reason = "mixed_dangling_comma";
            prohibitedMisses[lang]++;
          } else if (evaluateRelationalPromiseGuard(ev.rewrittenText || "").guard === "hit") {
            pass = false;
            reason = "mixed_personal_still_present";
            prohibitedMisses[lang]++;
          }
        }
      }
    } else if (row.polarity === "allowed_product_continuity") {
      if (ev.guard !== "hit") {
        /* miss expected */
      } else {
        pass = false;
        reason = "allowed_false_positive";
        allowedFp[lang]++;
      }
    }
    // diagnostic_control: report only

    results.push({
      id: row.id,
      language: row.language,
      polarity: row.polarity,
      family: row.family,
      expected_guard: row.expected_guard,
      observed_guard: ev.guard,
      expected_disposition: row.expected_disposition,
      observed_disposition: ev.disposition,
      expected_family: expectedFamilyForRow(row),
      observed_family: ev.family,
      matched: ev.matched,
      rewrittenText: ev.rewrittenText,
      required_preserved_fact: row.required_preserved_fact,
      pass,
      reason,
    });
  }

  const diagnosticOutcomes = results
    .filter((r) => r.polarity === "diagnostic_control")
    .map((r) => ({
      id: r.id,
      language: r.language,
      observed_guard: r.observed_guard,
      observed_family: r.observed_family,
      note:
        r.observed_guard === "miss"
          ? "correctly_excluded_as_non_assistant_promise"
          : "observed_hit_outside_0_0_denominator",
    }));

  const paraphraseResults = (S4_UNSEEN_PARAPHRASE_PROBES || []).map((p) => {
    const ev = evaluateRelationalPromiseGuard(p.text);
    const pass = ev.guard === "hit";
    return {
      id: p.id,
      language: p.language,
      text: p.text,
      expected_guard: p.expected_guard,
      observed_guard: ev.guard,
      observed_family: ev.family,
      pass,
    };
  });
  const paraphraseMisses = paraphraseResults.filter((p) => !p.pass);

  const pass_0_0 =
    prohibitedMisses.en === 0 &&
    prohibitedMisses.zh === 0 &&
    allowedFp.en === 0 &&
    allowedFp.zh === 0 &&
    familyMismatches.en === 0 &&
    familyMismatches.zh === 0;

  const report = {
    matrix_sha256: hash,
    frozen_expected: FROZEN,
    hash_match: true,
    implementation_commit: implementationCommit,
    prohibited_misses: prohibitedMisses,
    allowed_product_continuity_false_positives: allowedFp,
    family_mismatches: familyMismatches,
    pass_0_0,
    paraphrase_regression: {
      total: paraphraseResults.length,
      misses: paraphraseMisses.length,
      pass: paraphraseMisses.length === 0,
      results: paraphraseResults,
    },
    totals: {
      rows: rows.length,
      prohibited: rows.filter((r) => r.polarity === "prohibited").length,
      allowed: rows.filter((r) => r.polarity === "allowed_product_continuity").length,
      diagnostic: rows.filter((r) => r.polarity === "diagnostic_control").length,
      failed_rows: results.filter((r) => !r.pass).length,
      by_language: languageTotals,
      by_prohibited_family: familyTotals,
    },
    diagnostic_control_outcomes: diagnosticOutcomes,
    failures: results.filter((r) => !r.pass),
    row_results: results,
  };

  const outDir = path.join(root, "qa-artifacts/s4-relational-promise");
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outPath = path.join(outDir, `matrix-evidence-${stamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");
  // Stable pointer for handoff docs
  fs.writeFileSync(
    path.join(outDir, "matrix-evidence-latest.json"),
    JSON.stringify(report, null, 2) + "\n"
  );

  console.log(
    JSON.stringify(
      {
        pass_0_0: report.pass_0_0,
        prohibited_misses: prohibitedMisses,
        allowed_fp: allowedFp,
        family_mismatches: familyMismatches,
        paraphrase_pass: report.paraphrase_regression.pass,
        paraphrase_misses: paraphraseMisses.length,
        failed: report.totals.failed_rows,
        implementation_commit: implementationCommit,
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
  process.exit(report.pass_0_0 && report.paraphrase_regression.pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
