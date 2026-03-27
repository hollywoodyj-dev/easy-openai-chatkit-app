/**
 * Milestone I — Residual Movement Map
 *
 * Purpose:
 * Detect whether a weak self-blame thread is no longer strongly active,
 * but still directionally alive enough in the current turn to count as
 * live-enough continuity for corridor evaluation.
 */

export type ThreadFamily =
  | "self_blame"
  | "over_effort"
  | "bracing"
  | "unknown";

export type ResidualMovementDecision =
  | "no_residual_movement"
  | "residual_movement_present";

export interface ResidualMovementInput {
  family: ThreadFamily;
  direction_toward_self: boolean;
  current_turn_has_live_self_turn: boolean;
  faint_residual_self_turn_present: boolean;
  purely_historical: boolean;
  family_shift_detected: boolean;
  subtle_self_questioning?: boolean;
  inward_attribution_language?: boolean;
  still_first_kind_of_language?: boolean;
}

export interface ResidualMovementResult {
  decision: ResidualMovementDecision;
  live_enough: boolean;
  reasons: string[];
}

export interface ResidualMovementMap {
  milestone: "I";
  feature: "residual_movement_detection";
  version: string;
  governing_rule: string;
  purpose: string;
  required_conditions: string[];
  hard_blockers: string[];
  positive_examples: {
    en: string[];
    zh: string[];
  };
  negative_examples: {
    en: string[];
    zh: string[];
  };
  downstream_rule: string;
  qa_checks: string[];
}

export const MILESTONE_I_RESIDUAL_MOVEMENT_MAP: ResidualMovementMap = {
  milestone: "I",
  feature: "residual_movement_detection",
  version: "v1",
  governing_rule:
    "A weak thread may still be alive if the present turn quietly leans in the same direction.",
  purpose:
    "Allow weak self-blame to count as live-enough when strong live movement is absent but faint inward self-turning is still present now.",
  required_conditions: [
    "family === self_blame",
    "direction_toward_self === true",
    "current_turn_has_live_self_turn === false",
    "faint_residual_self_turn_present === true",
    "purely_historical === false",
    "family_shift_detected === false",
  ],
  hard_blockers: [
    "family is not self_blame",
    "no toward-self direction",
    "already strong live movement (residual layer not needed)",
    "purely historical wording",
    "family shift detected",
    "no faint residual self-turn present",
  ],
  positive_examples: {
    en: [
      "I still kind of turn it back on myself.",
      "Part of me still goes there a little.",
      "I still question myself first.",
      "It still leans back toward me a bit.",
    ],
    zh: [
      "我还是会先往自己身上想。",
      "我会先怀疑是不是自己哪里不对。",
      "心里还是会有一点转到自己这边。",
      "还是会先觉得是不是我。",
    ],
  },
  negative_examples: {
    en: [
      "I feel off.",
      "I feel weird.",
      "Maybe I'm overthinking.",
      "I was like that earlier.",
    ],
    zh: [
      "我有点乱。",
      "我只是有点不舒服。",
      "可能是我想太多。",
      "之前我是这样。",
    ],
  },
  downstream_rule:
    "Residual movement does not render carry-over by itself. It only upgrades weak self-blame from not-live to live-enough for corridor evaluation.",
  qa_checks: [
    "some D-bucket weak cases no longer fail only on no_live_movement_now",
    "residual movement is not triggered by vague emotional residue alone",
    "direction toward self remains required",
    "purely historical cases remain blocked",
    "weight stays flat downstream",
  ],
};

export function resolveResidualSelfBlameMovement(
  input: ResidualMovementInput
): ResidualMovementResult {
  const reasons: string[] = [];

  if (input.family !== "self_blame") {
    reasons.push("not_self_blame_family");
    return { decision: "no_residual_movement", live_enough: false, reasons };
  }
  if (!input.direction_toward_self) {
    reasons.push("no_toward_self_direction");
    return { decision: "no_residual_movement", live_enough: false, reasons };
  }
  if (input.current_turn_has_live_self_turn) {
    reasons.push("already_has_strong_live_self_turn");
    return { decision: "no_residual_movement", live_enough: false, reasons };
  }
  if (input.purely_historical) {
    reasons.push("purely_historical");
    return { decision: "no_residual_movement", live_enough: false, reasons };
  }
  if (input.family_shift_detected) {
    reasons.push("family_shift_detected");
    return { decision: "no_residual_movement", live_enough: false, reasons };
  }
  if (!input.faint_residual_self_turn_present) {
    reasons.push("no_faint_residual_self_turn");
    return { decision: "no_residual_movement", live_enough: false, reasons };
  }

  reasons.push("residual_self_turn_present");
  return { decision: "residual_movement_present", live_enough: true, reasons };
}

export interface LiveEnoughInput {
  current_turn_has_live_movement: boolean;
  residual_result: ResidualMovementResult;
}

export function resolveCurrentTurnLiveEnough(input: LiveEnoughInput): boolean {
  return (
    input.current_turn_has_live_movement === true ||
    input.residual_result.live_enough === true
  );
}
