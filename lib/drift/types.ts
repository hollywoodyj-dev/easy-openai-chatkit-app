export type DriftType =
  | "advice_drift"
  | "coaching_drift"
  | "therapy_drift"
  | "over_presence_drift"
  | "tone_drift"
  | "pseudo_depth_drift"
  | "continuity_drift";

export type DriftSeverity = "low" | "medium" | "high";

export interface DriftViolation {
  type: DriftType;
  severity: DriftSeverity;
  matched: string;
  reason: string;
}

export interface DriftLintResult {
  passed: boolean;
  score: number;
  violations: DriftViolation[];
  notes: string[];
}

