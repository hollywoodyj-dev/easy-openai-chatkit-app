/**
 * Milestone I — I x H Overlap Routing Map
 *
 * Purpose:
 * Resolve narrow overlap cases where:
 * - weak-edge self-blame continuity is valid for I
 * - H is also plausibly eligible
 * and decide which quiet layer should win.
 */

export type ThreadFamily =
  | "self_blame"
  | "over_effort"
  | "bracing"
  | "unknown";

export type OverlapRoutingDecision =
  | "prefer_I"
  | "prefer_H"
  | "suppress_both_optional";

export interface OverlapRoutingInput {
  family: ThreadFamily;
  weak_edge_admission_passed: boolean;
  current_turn_is_live_enough: boolean;
  family_shift_detected: boolean;
  visibility_risk_high: boolean;
  main_reflection_sufficient: boolean;
  h_candidate: boolean;
  i_removal_cleaner?: boolean;
  h_removal_cleaner?: boolean;
}

export interface OverlapRoutingResult {
  decision: OverlapRoutingDecision;
  allow_i: boolean;
  allow_h: boolean;
  suppress_i: boolean;
  suppress_h: boolean;
  i_valid: boolean;
  i_invalid_reasons: string[];
  reasons: string[];
}

export interface OverlapRoutingMap {
  milestone: "I";
  feature: "i_h_overlap_routing";
  version: string;
  governing_rule: string;
  purpose: string;
  i_valid_requirements: string[];
  h_override_conditions: string[];
  suppress_both_conditions: string[];
  qa_checks: string[];
}

export const MILESTONE_I_H_OVERLAP_ROUTING_MAP: OverlapRoutingMap = {
  milestone: "I",
  feature: "i_h_overlap_routing",
  version: "v1",
  governing_rule:
    "When weak-edge self-blame continuity is truly alive, route it through I-not H.",
  purpose:
    "Prevent valid weak-edge self-blame continuity from being diverted into H-overlap by default.",
  i_valid_requirements: [
    "family === self_blame",
    "weak_edge_admission_passed === true",
    "current_turn_is_live_enough === true",
    "family_shift_detected === false",
    "visibility_risk_high === false",
    "main_reflection_sufficient === false",
    "i_removal_cleaner !== true",
  ],
  h_override_conditions: [
    "weak-edge admission failed",
    "current turn is not live-enough for continuity",
    "family shifted",
    "I would become too visible",
    "main reflection already sufficient",
    "I is decorative / removal cleaner",
  ],
  suppress_both_conditions: [
    "I is not truly valid",
    "H is not truly valid",
    "both optional layers are weak / uncertain",
  ],
  qa_checks: [
    "valid weak-edge self-blame no longer defaults to H-overlap",
    "EN overlap cases route to I more consistently",
    "cue weight remains flat after routing change",
    "H quality remains stable outside overlap zone",
    "no new visible continuity drift appears",
  ],
};

export function resolveIHOverlapRouting(
  input: OverlapRoutingInput
): OverlapRoutingResult {
  const reasons: string[] = [];
  const iInvalidReasons: string[] = [];

  if (input.family !== "self_blame") iInvalidReasons.push("family_not_self_blame");
  if (!input.weak_edge_admission_passed) iInvalidReasons.push("weak_edge_admission_failed");
  if (!input.current_turn_is_live_enough) iInvalidReasons.push("current_turn_not_live_enough");
  if (input.family_shift_detected) iInvalidReasons.push("family_shift_detected");
  if (input.visibility_risk_high) iInvalidReasons.push("visibility_risk_high");
  if (input.main_reflection_sufficient) iInvalidReasons.push("main_reflection_sufficient");
  if (input.i_removal_cleaner === true) iInvalidReasons.push("i_removal_cleaner");

  const iValid =
    input.family === "self_blame" &&
    input.weak_edge_admission_passed === true &&
    input.current_turn_is_live_enough === true &&
    input.family_shift_detected === false &&
    input.visibility_risk_high === false &&
    input.main_reflection_sufficient === false &&
    input.i_removal_cleaner !== true;

  const hValid = input.h_candidate === true && input.h_removal_cleaner !== true;

  if (iValid && hValid) {
    reasons.push("valid_weak_edge_self_blame_overlap");
    reasons.push("prefer_i_over_h");
    return {
      decision: "prefer_I",
      allow_i: true,
      allow_h: false,
      suppress_i: false,
      suppress_h: true,
      i_valid: true,
      i_invalid_reasons: [],
      reasons,
    };
  }

  if (iValid && !hValid) {
    reasons.push("i_valid_h_not_valid");
    return {
      decision: "prefer_I",
      allow_i: true,
      allow_h: false,
      suppress_i: false,
      suppress_h: true,
      i_valid: true,
      i_invalid_reasons: [],
      reasons,
    };
  }

  if (!iValid && hValid) {
    reasons.push("i_not_valid_h_valid");
    return {
      decision: "prefer_H",
      allow_i: false,
      allow_h: true,
      suppress_i: true,
      suppress_h: false,
      i_valid: false,
      i_invalid_reasons: iInvalidReasons,
      reasons,
    };
  }

  reasons.push("both_optional_layers_not_sufficient");
  return {
    decision: "suppress_both_optional",
    allow_i: false,
    allow_h: false,
    suppress_i: true,
    suppress_h: true,
    i_valid: false,
    i_invalid_reasons: iInvalidReasons,
    reasons,
  };
}
