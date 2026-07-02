import fs from "node:fs";
import path from "node:path";
import { scanTextForDistortionViolations } from "./distortion-check";
import {
  getExpiredExperimentalEntries,
  getEscalatedEntries,
  textContainsCategoryOrDiscoveryPhrase,
  textContainsIdentityAnchor,
  textContainsReflectionAi,
} from "./phrase-registry";
import {
  fileHasAcquisitionSurface,
  fileHasIdentitySensitiveSurface,
} from "./surface-map";

export type SemanticIssueKind =
  | "distortion"
  | "pairing_rule"
  | "expired_experimental"
  | "acquisition_missing_identity_anchor"
  | "escalated_inventory";

export type SemanticIssue = {
  kind: SemanticIssueKind;
  severity: "error" | "warning";
  file: string;
  message: string;
  detail?: string;
};

export type SemanticCheckResult = {
  ok: boolean;
  errors: SemanticIssue[];
  warnings: SemanticIssue[];
  scannedFiles: string[];
};

const REPO_ROOT = path.resolve(__dirname, "../..");

const MARKETING_GLOBS: readonly string[] = [
  "lib/wisewave-site",
  "app/(wisewave-site)",
  "docs/Wisewave_App_Store_and_Play_Listing_Copy_v1.md",
  "mobile/app.json",
];

function collectFiles(dir: string, acc: string[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      collectFiles(full, acc);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") ||
        entry.name.endsWith(".tsx") ||
        entry.name.endsWith(".json") ||
        entry.name.endsWith(".md"))
    ) {
      if (entry.name.includes(".test.")) continue;
      acc.push(full);
    }
  }
}

export function getMarketingCopyFiles(): string[] {
  const files: string[] = [];
  for (const rel of MARKETING_GLOBS) {
    const abs = path.join(REPO_ROOT, rel);
    if (rel.endsWith(".md") || rel.endsWith(".json")) {
      if (fs.existsSync(abs)) files.push(abs);
    } else {
      collectFiles(abs, files);
    }
  }
  return files.sort();
}

function toRepoRelative(absPath: string): string {
  return path.relative(REPO_ROOT, absPath).replace(/\\/g, "/");
}

export function runSemanticGovernanceCheck(): SemanticCheckResult {
  const errors: SemanticIssue[] = [];
  const warnings: SemanticIssue[] = [];
  const scannedFiles = getMarketingCopyFiles();

  for (const absPath of scannedFiles) {
    const rel = toRepoRelative(absPath);
    const content = fs.readFileSync(absPath, "utf8");

    for (const hit of scanTextForDistortionViolations(content, rel)) {
      errors.push({
        kind: "distortion",
        severity: "error",
        file: rel,
        message: `${hit.reason}: "${hit.matched}" (line ${hit.line}, col ${hit.column})`,
        detail: hit.class,
      });
    }

    if (
      fileHasIdentitySensitiveSurface(rel) &&
      textContainsReflectionAi(content) &&
      !textContainsIdentityAnchor(content)
    ) {
      errors.push({
        kind: "pairing_rule",
        severity: "error",
        file: rel,
        message:
          "Reflection AI on identity-sensitive surface without an identity anchor in the same file (pairing rule)",
      });
    }

    if (
      fileHasAcquisitionSurface(rel) &&
      textContainsCategoryOrDiscoveryPhrase(content) &&
      !textContainsIdentityAnchor(content)
    ) {
      warnings.push({
        kind: "acquisition_missing_identity_anchor",
        severity: "warning",
        file: rel,
        message:
          "Acquisition surface uses category/discovery language without an identity anchor in the same file (Lock v1.1 — warn only in v1)",
      });
    }
  }

  for (const entry of getExpiredExperimentalEntries()) {
    errors.push({
      kind: "expired_experimental",
      severity: "error",
      file: "lib/semantic-governance/phrase-registry.json",
      message: `Experimental registry entry expired: "${entry.phrase}" (review ${entry.review})`,
    });
  }

  for (const entry of getEscalatedEntries()) {
    warnings.push({
      kind: "escalated_inventory",
      severity: "warning",
      file: "lib/semantic-governance/phrase-registry.json",
      message: `Escalated live phrase pending Tree ruling: "${entry.phrase}"`,
      detail: entry.notes,
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    scannedFiles: scannedFiles.map(toRepoRelative),
  };
}

export function formatSemanticCheckReport(result: SemanticCheckResult): string {
  const lines: string[] = [
    "=== Wisewave semantic:check ===",
    `Scanned ${result.scannedFiles.length} marketing copy files`,
    `Errors: ${result.errors.length} | Warnings: ${result.warnings.length}`,
    "",
  ];

  if (result.errors.length) {
    lines.push("--- ERRORS ---");
    for (const e of result.errors) {
      lines.push(`[${e.kind}] ${e.file}: ${e.message}`);
    }
    lines.push("");
  }

  if (result.warnings.length) {
    lines.push("--- WARNINGS ---");
    for (const w of result.warnings) {
      lines.push(`[${w.kind}] ${w.file}: ${w.message}`);
      if (w.detail) lines.push(`  ${w.detail}`);
    }
    lines.push("");
  }

  lines.push(
    result.ok
      ? "PASS"
      : "FAIL — route to escalation per docs/Wisewave_Semantic_Escalation_Path_v1.md",
  );
  return lines.join("\n");
}
