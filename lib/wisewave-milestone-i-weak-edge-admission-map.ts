/**
 * Milestone I — Weak-edge Admission Map
 *
 * Purpose:
 * Decide whether a weak self-blame thread is still alive enough
 * in the current turn to be admitted as a real continuity candidate
 * before survival corridor / ultra-light carry-over is considered.
 */

export type ThreadFamily =
  | "self_blame"
  | "over_effort"
  | "bracing"
  | "unknown";

export type FamilyConfidence = "strong" | "weak" | "none";

export type WeakEdgeAdmissionDecision =
  | "reject"
  | "admit_fragile"
  | "admit_strong_weak_edge";

export type SelfTurnStrength =
  | "none"
  | "faint"
  | "clear_but_faint"
  | "clear";

export interface WeakEdgeAdmissionInput {
  family: ThreadFamily;
  family_confidence: FamilyConfidence;

  direction_toward_self: boolean;
  current_turn_has_live_self_turn: boolean;
  current_turn_self_turn_strength: SelfTurnStrength;

  purely_historical: boolean;
  main_reflection_sufficient: boolean;
  visibility_risk_high: boolean;

  e_sufficient: boolean;
  h_sufficient: boolean;

  removal_cleaner: boolean;
  family_shift_detected: boolean;
  explicit_recall_needed: boolean;
}

export interface WeakEdgeAdmissionResult {
  decision: WeakEdgeAdmissionDecision;
  reasons: string[];
  admitted: boolean;
}

export interface WeakEdgeAdmissionMap {
  milestone: "I";
  feature: "weak_edge_admission";
  version: string;

  governing_rule: string;
  purpose: string;

  admission_requirements: string[];
  hard_blockers: string[];

  family_scope: string;
  downstream_rule: string;

  qa_checks: string[];
}

export const MILESTONE_I_WEAK_EDGE_ADMISSION_MAP: WeakEdgeAdmissionMap = {
  milestone: "I",
  feature: "weak_edge_admission",
  version: "v1",

  governing_rule:
    "A weak self-blame thread is admissible only when the current turn still quietly bends toward self in a live enough way.",

  purpose:
    "Admit weak-edge self-blame only when it is still alive in the present turn, not merely connected in hindsight.",

  admission_requirements: [
    "family === self_blame",
    "family_confidence === weak",
    "direction_toward_self === true",
    "current_turn_has_live_self_turn === true",
    "purely_historical === false",
    "main_reflection_sufficient === false",
    "visibility_risk_high === false",
    "e_sufficient === false",
    "h_sufficient === false",
    "removal_cleaner === false",
    "family_shift_detected === false",
    "explicit_recall_needed === false",
  ],

  hard_blockers: [
    "no toward-self direction",
    "no live self-turn now",
    "purely historical wording",
    "main reflection already sufficient",
    "visibility risk too high",
    "E already sufficient",
    "H already sufficient",
    "removal is cleaner",
    "family shift detected",
    "explicit recall would be needed",
  ],

  family_scope:
    "self_blame only — do not reuse this rule unchanged for bracing or over_effort",

  downstream_rule:
    "Admission does not render carry-over by itself. It only allows the case to proceed into weak-family survival corridor logic.",

  qa_checks: [
    "true weak-edge self-blame no longer dies too early at admission",
    "false weak-edge admissions do not rise materially",
    "D-bucket no longer fully collapses",
    "admission remains narrow and present-tense",
    "weight and visibility remain flat downstream",
  ],
};

export function resolveWeakEdgeSelfBlameAdmission(
  input: WeakEdgeAdmissionInput
): WeakEdgeAdmissionResult {
  const reasons: string[] = [];

  if (input.family !== "self_blame") {
    reasons.push("not_self_blame_family");
    return { decision: "reject", reasons, admitted: false };
  }
  if (input.family_confidence !== "weak") {
    reasons.push("not_weak_family");
    return { decision: "reject", reasons, admitted: false };
  }
  if (!input.direction_toward_self) {
    reasons.push("no_toward_self_direction");
    return { decision: "reject", reasons, admitted: false };
  }
  if (!input.current_turn_has_live_self_turn) {
    reasons.push("no_live_self_turn_now");
    return { decision: "reject", reasons, admitted: false };
  }
  if (input.purely_historical) {
    reasons.push("purely_historical");
    return { decision: "reject", reasons, admitted: false };
  }
  if (input.main_reflection_sufficient) {
    reasons.push("main_reflection_sufficient");
    return { decision: "reject", reasons, admitted: false };
  }
  if (input.visibility_risk_high) {
    reasons.push("visibility_risk_high");
    return { decision: "reject", reasons, admitted: false };
  }
  if (input.e_sufficient) {
    reasons.push("e_sufficient");
    return { decision: "reject", reasons, admitted: false };
  }
  if (input.h_sufficient) {
    reasons.push("h_sufficient");
    return { decision: "reject", reasons, admitted: false };
  }
  if (input.removal_cleaner) {
    reasons.push("removal_cleaner");
    return { decision: "reject", reasons, admitted: false };
  }
  if (input.family_shift_detected) {
    reasons.push("family_shift_detected");
    return { decision: "reject", reasons, admitted: false };
  }
  if (input.explicit_recall_needed) {
    reasons.push("explicit_recall_needed");
    return { decision: "reject", reasons, admitted: false };
  }

  if (input.current_turn_self_turn_strength === "clear_but_faint") {
    reasons.push("weak_edge_alive_clear_but_faint");
    return { decision: "admit_strong_weak_edge", reasons, admitted: true };
  }

  if (input.current_turn_self_turn_strength === "faint") {
    reasons.push("weak_edge_alive_faint");
    return { decision: "admit_fragile", reasons, admitted: true };
  }

  reasons.push("insufficient_self_turn_strength");
  return { decision: "reject", reasons, admitted: false };
}

export type WeakSurvivalEligibility =
  | "blocked_before_corridor"
  | "enter_corridor_fragile"
  | "enter_corridor_strong";

export function mapAdmissionToCorridorEligibility(
  result: WeakEdgeAdmissionResult
): WeakSurvivalEligibility {
  if (result.decision === "reject") return "blocked_before_corridor";
  if (result.decision === "admit_fragile") return "enter_corridor_fragile";
  return "enter_corridor_strong";
}
