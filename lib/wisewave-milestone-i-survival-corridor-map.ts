/**
 * Milestone I — Weak-family Survival Corridor Map
 *
 * Purpose:
 * Give weak-family a narrow, real survival window
 * without increasing visibility, weight, or false carry.
 */

export type ThreadFamily =
  | "self_blame"
  | "over_effort"
  | "bracing"
  | "unknown";

export type FamilyConfidence = "strong" | "weak" | "none";
export type CorridorDecision = "suppress" | "ultra_light_survival";
export type CorridorTemplateAllowance = "none" | "ultra_light_only";

export interface SurvivalCorridorInput {
  family: ThreadFamily;
  family_confidence: FamilyConfidence;

  movement_match: boolean;
  direction_match: boolean;

  current_turn_has_live_movement: boolean;
  same_family_still_alive: boolean;

  main_reflection_sufficient: boolean;
  visibility_risk_high: boolean;

  e_sufficient: boolean;
  h_sufficient: boolean;

  removal_cleaner: boolean;
  family_shift_detected: boolean;

  explicit_recall_needed: boolean;
}

export interface SurvivalCorridorResult {
  decision: CorridorDecision;
  template_allowance: CorridorTemplateAllowance;
  reasons: string[];
}

export interface SurvivalCorridorMap {
  milestone: "I";
  feature: "weak_family_survival_corridor";
  version: string;

  governing_rule: string;
  purpose: string;

  admission_requirements: string[];
  hard_blockers: string[];

  allowed_templates: string[];
  disallowed_templates: string[];

  family_notes: Record<
    Exclude<ThreadFamily, "unknown">,
    {
      weak_survival_hint: string;
      caution: string;
    }
  >;

  qa_checks: string[];
}

export const MILESTONE_I_SURVIVAL_CORRIDOR_MAP: SurvivalCorridorMap = {
  milestone: "I",
  feature: "weak_family_survival_corridor",
  version: "v1",

  governing_rule:
    "Weak-family does not earn continuity. It earns only a very small chance not to disappear.",

  purpose:
    "Allow some true weak-family second-turn cases to survive into ultra-light carry-over without turning Milestone I into visible continuity behavior.",

  admission_requirements: [
    "family_confidence === weak",
    "movement_match === true",
    "direction_match === true",
    "current_turn_has_live_movement === true",
    "same_family_still_alive === true",
    "main_reflection_sufficient === false",
    "visibility_risk_high === false",
    "e_sufficient === false",
    "h_sufficient === false",
    "removal_cleaner === false",
    "family_shift_detected === false",
    "explicit_recall_needed === false",
  ],

  hard_blockers: [
    "main reflection already sufficient",
    "no live movement in current turn",
    "family shift detected",
    "visibility risk high",
    "E already sufficient",
    "H already sufficient",
    "removal is cleaner",
    "explicit recall would be needed",
  ],

  allowed_templates: [
    "ultra_light_fallback",
    "residual_background_presence",
    "faint_same_space_coherence",
  ],

  disallowed_templates: [
    "softened_continuation",
    "explicit_same_thread_language",
    "pattern_replay_language",
    "anything_that_sounds_like_this_is_still_the_same_issue",
  ],

  family_notes: {
    self_blame: {
      weak_survival_hint:
        "Allow survival when inward self-turn is still faintly present, especially in indirect ZH phrasing.",
      caution:
        "Do not require explicit blame wording; do not make the cue sound like a remembered pattern.",
    },
    over_effort: {
      weak_survival_hint:
        "Allow survival only when faint push/non-release is still alive in the turn.",
      caution:
        "High drift risk into advice or coaching. Keep narrower than self_blame.",
    },
    bracing: {
      weak_survival_hint:
        "Allow survival when anticipatory tightening is still faintly active.",
      caution:
        "Do not turn lingering readiness into explanation.",
    },
  },

  qa_checks: [
    "at least some true weak-family cases survive",
    "survival stays ultra-light",
    "weight remains flat",
    "no visible continuity mechanism appears",
    "false carry does not increase",
  ],
};

export function resolveWeakFamilySurvival(
  input: SurvivalCorridorInput
): SurvivalCorridorResult {
  const reasons: string[] = [];

  if (input.family_confidence !== "weak") {
    reasons.push("not_weak_family");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (!input.movement_match) {
    reasons.push("movement_mismatch");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (!input.direction_match) {
    reasons.push("direction_mismatch");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (!input.current_turn_has_live_movement) {
    reasons.push("no_live_movement_now");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (!input.same_family_still_alive) {
    reasons.push("thread_not_alive");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (input.main_reflection_sufficient) {
    reasons.push("main_reflection_sufficient");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (input.visibility_risk_high) {
    reasons.push("visibility_risk_high");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (input.e_sufficient) {
    reasons.push("e_sufficient");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (input.h_sufficient) {
    reasons.push("h_sufficient");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (input.removal_cleaner) {
    reasons.push("removal_cleaner");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (input.family_shift_detected) {
    reasons.push("family_shift_detected");
    return { decision: "suppress", template_allowance: "none", reasons };
  }
  if (input.explicit_recall_needed) {
    reasons.push("explicit_recall_needed");
    return { decision: "suppress", template_allowance: "none", reasons };
  }

  reasons.push("weak_family_survival_corridor_open");
  return {
    decision: "ultra_light_survival",
    template_allowance: "ultra_light_only",
    reasons,
  };
}

export function getWeakSurvivalAllowedTemplates(
  result: SurvivalCorridorResult
): string[] {
  if (result.decision !== "ultra_light_survival") return [];
  return [
    "ultra_light_fallback",
    "residual_background_presence",
    "faint_same_space_coherence",
  ];
}
