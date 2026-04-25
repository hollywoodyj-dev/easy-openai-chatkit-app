import type { DriftLintResult, DriftType } from "./types";

export interface DriftSummaryReport {
  total: number;
  passed: number;
  failed: number;
  highSeverity: number;
  mediumSeverity: number;
  byType: Record<DriftType, number>;
}

export function buildDriftSummary(results: DriftLintResult[]): DriftSummaryReport {
  const byType: Record<DriftType, number> = {
    advice_drift: 0,
    coaching_drift: 0,
    therapy_drift: 0,
    over_presence_drift: 0,
    tone_drift: 0,
    pseudo_depth_drift: 0,
    continuity_drift: 0,
  };

  let highSeverity = 0;
  let mediumSeverity = 0;
  let failed = 0;

  for (const result of results) {
    if (!result.passed) failed += 1;
    for (const violation of result.violations) {
      byType[violation.type] += 1;
      if (violation.severity === "high") highSeverity += 1;
      if (violation.severity === "medium") mediumSeverity += 1;
    }
  }

  return {
    total: results.length,
    passed: results.length - failed,
    failed,
    highSeverity,
    mediumSeverity,
    byType,
  };
}

