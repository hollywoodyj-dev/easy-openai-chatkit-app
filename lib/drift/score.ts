import type { DriftLintResult } from "./types";

export function hasHighSeverityDrift(result: DriftLintResult): boolean {
  return result.violations.some((v) => v.severity === "high");
}

