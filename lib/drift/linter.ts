import { DRIFT_RULES } from "./rules";
import type { DriftLintResult, DriftViolation } from "./types";

function sentenceCount(text: string): number {
  return text
    .split(/[.!?。！？]/)
    .map((s) => s.trim())
    .filter(Boolean).length;
}

export function lintWisewaveOutput(output: string): DriftLintResult {
  const text = output.trim();
  const violations: DriftViolation[] = [];
  const notes: string[] = [];

  if (!text) {
    return {
      passed: true,
      score: 1,
      violations,
      notes,
    };
  }

  for (const rule of DRIFT_RULES) {
    for (const pattern of rule.patterns) {
      const match = text.match(pattern);
      if (!match) continue;
      violations.push({
        type: rule.type,
        severity: rule.severity,
        matched: match[0],
        reason: rule.reason,
      });
    }
  }

  const count = sentenceCount(text);
  if (count > 3) {
    violations.push({
      type: "over_presence_drift",
      severity: "medium",
      matched: `${count} sentences`,
      reason: "Wisewave output should usually remain within 1-3 sentences.",
    });
  }

  if (text.length > 280) {
    violations.push({
      type: "over_presence_drift",
      severity: "medium",
      matched: `${text.length} characters`,
      reason: "Output is too long for Wisewave low-presence standard.",
    });
  }

  const high = violations.filter((v) => v.severity === "high").length;
  const medium = violations.filter((v) => v.severity === "medium").length;
  const low = violations.filter((v) => v.severity === "low").length;

  let score = 1;
  score -= high * 0.5;
  score -= medium * 0.25;
  score -= low * 0.1;
  score = Math.max(0, score);

  return {
    passed: violations.length === 0,
    score,
    violations,
    notes,
  };
}

