/**
 * Milestone I — Promotion Rule Map (Nova-ready)
 * Sits between thread family detection and template rendering.
 */

export type ThreadFamily = "self_blame" | "over_effort" | "bracing" | "unknown";

export type FamilyConfidence = "strong" | "weak" | "none";

export type DecayState = "fresh" | "soft_decay" | "near_expiry" | "expired";

export type PromotionState = "none" | "weak_promotion" | "strong_promotion";

export type TemplateAllowance = "none" | "ultra_light_only" | "light_family_set";

export interface PromotionInput {
  family: ThreadFamily;
  family_confidence: FamilyConfidence;
  current_turn_supports_thread: boolean;
  decay_state: DecayState;
  main_reflection_sufficient: boolean;
  visibility_risk_high: boolean;
  e_sufficient: boolean;
  h_sufficient: boolean;
  removal_cleaner: boolean;
  same_family_still_alive: boolean;
  current_turn_has_live_movement: boolean;
}

export interface PromotionDecision {
  promotion_state: PromotionState;
  template_allowance: TemplateAllowance;
  should_render_carryover: boolean;
  reasons: string[];
}

export interface PromotionRuleDefinition {
  id: string;
  description: string;
  required: boolean;
}

export interface PromotionMap {
  milestone: "I";
  feature: "promotion_rule";
  version: string;
  governing_rule: string;
  strong_family_rule: string;
  weak_family_rule: string;
  weak_output_cap: string;
  prerequisites: PromotionRuleDefinition[];
  failure_conditions: string[];
  template_policies: {
    strong_promotion: string[];
    weak_promotion: string[];
    disallowed_for_weak: string[];
  };
  qa_checks: string[];
}

export const MILESTONE_I_PROMOTION_MAP: PromotionMap = {
  milestone: "I",
  feature: "promotion_rule",
  version: "v1",
  governing_rule:
    "Recognized family is necessary, but not sufficient. Promotion is allowed only when the thread is still alive in the current turn and carry-over can remain faint and non-visible.",
  strong_family_rule:
    "Strong family may promote only when current-turn support is live, decay has not gone too far, main reflection is not already sufficient, visibility risk is low, and removal would make the turn materially less coherent.",
  weak_family_rule:
    "Weak family should not collapse immediately to no-carry, but may only promote into ultra-light carry-over when a faint live thread is still present and visibility risk remains low.",
  weak_output_cap:
    "Weak-family promotion may authorize faint atmosphere carry-over only, not articulated continuity.",
  prerequisites: [
    {
      id: "i_prom_01",
      description: "Recognized same-family thread is present at strong or weak confidence.",
      required: true,
    },
    {
      id: "i_prom_02",
      description: "Current turn still supports the thread as a live movement, not just historical context.",
      required: true,
    },
    {
      id: "i_prom_03",
      description: "Thread has not decayed too far to carry forward.",
      required: true,
    },
    {
      id: "i_prom_04",
      description: "Main reflection is not already sufficient on its own.",
      required: true,
    },
    {
      id: "i_prom_05",
      description: "Carry-over can remain non-visible and non-memory-like.",
      required: true,
    },
    {
      id: "i_prom_06",
      description: "E and H are not already sufficient and cleaner.",
      required: true,
    },
    {
      id: "i_prom_07",
      description: "Removal would make the turn meaningfully worse, not just less elegant.",
      required: true,
    },
  ],
  failure_conditions: [
    "family_confidence = none",
    "thread not alive in current turn",
    "decay_state = near_expiry or expired",
    "main_reflection_sufficient = true",
    "visibility_risk_high = true",
    "e_sufficient = true",
    "h_sufficient = true",
    "removal_cleaner = true",
    "carry-over would sound like recall or repeated pattern replay",
  ],
  template_policies: {
    strong_promotion: [
      "ultra_light_fallback",
      "residual_background_presence",
      "softened_continuation",
      "same_space_coherence",
    ],
    weak_promotion: [
      "ultra_light_fallback",
      "residual_background_presence",
      "faint_same_space_coherence",
    ],
    disallowed_for_weak: [
      "explicit_same_thread_language",
      "softened_continuation_if_too_formed",
      "anything_that_sounds_like_this_is_still_the_same_issue",
    ],
  },
  qa_checks: [
    "strong_family can promote repeatably when it should",
    "weak_family gets an ultra-light chance before collapsing to suppression",
    "promotion remains invisible",
    "promotion stays subordinate to main reflection",
    "recognized family no longer collapses back to suppression by default",
    "removal is still preferred when promotion adds no real value",
  ],
};

export function resolvePromotionState(input: PromotionInput): PromotionDecision {
  const reasons: string[] = [];

  if (input.family_confidence === "none" || input.family === "unknown") {
    reasons.push("no_supported_family");
    return {
      promotion_state: "none",
      template_allowance: "none",
      should_render_carryover: false,
      reasons,
    };
  }

  if (!input.current_turn_supports_thread || !input.same_family_still_alive || !input.current_turn_has_live_movement) {
    reasons.push("thread_not_alive_now");
    return {
      promotion_state: "none",
      template_allowance: "none",
      should_render_carryover: false,
      reasons,
    };
  }

  if (input.decay_state === "near_expiry" || input.decay_state === "expired") {
    reasons.push("thread_decayed_too_far");
    return {
      promotion_state: "none",
      template_allowance: "none",
      should_render_carryover: false,
      reasons,
    };
  }

  if (input.main_reflection_sufficient) {
    reasons.push("main_reflection_already_sufficient");
    return {
      promotion_state: "none",
      template_allowance: "none",
      should_render_carryover: false,
      reasons,
    };
  }

  if (input.visibility_risk_high) {
    reasons.push("visibility_risk_high");
    return {
      promotion_state: "none",
      template_allowance: "none",
      should_render_carryover: false,
      reasons,
    };
  }

  if (input.e_sufficient) {
    reasons.push("e_already_sufficient");
    return {
      promotion_state: "none",
      template_allowance: "none",
      should_render_carryover: false,
      reasons,
    };
  }

  if (input.h_sufficient) {
    reasons.push("h_already_sufficient");
    return {
      promotion_state: "none",
      template_allowance: "none",
      should_render_carryover: false,
      reasons,
    };
  }

  if (input.removal_cleaner) {
    reasons.push("removal_cleaner");
    return {
      promotion_state: "none",
      template_allowance: "none",
      should_render_carryover: false,
      reasons,
    };
  }

  if (input.family_confidence === "strong") {
    reasons.push("strong_family_promotable");
    return {
      promotion_state: "strong_promotion",
      template_allowance: "light_family_set",
      should_render_carryover: true,
      reasons,
    };
  }

  if (input.family_confidence === "weak") {
    reasons.push("weak_family_ultra_light_only");
    return {
      promotion_state: "weak_promotion",
      template_allowance: "ultra_light_only",
      should_render_carryover: true,
      reasons,
    };
  }

  reasons.push("fallback_none");
  return {
    promotion_state: "none",
    template_allowance: "none",
    should_render_carryover: false,
    reasons,
  };
}

export interface FamilyPromotionPolicy {
  family: ThreadFamily;
  weak_requires: string[];
  strong_requires: string[];
}

export const FAMILY_PROMOTION_POLICIES: FamilyPromotionPolicy[] = [
  {
    family: "self_blame",
    weak_requires: [
      "inward_fault_direction_still_present",
      "current_turn_still_bends_toward_self",
      "carryover_can_stay_indirect",
    ],
    strong_requires: [
      "clear_inward_fault_movement_now",
      "same_family_is_fresh_or_soft_decay",
      "carryover_reduces_reset_without_recall",
    ],
  },
  {
    family: "over_effort",
    weak_requires: [
      "faint_push_or_non_release_still_present",
      "no_pattern_replay_wording",
      "carryover_preserves_pressure_atmosphere_only",
    ],
    strong_requires: [
      "clear_internal_push_still_active",
      "current_turn_still_carries_drive_or_cannot_stop_energy",
      "carryover_softens_without_repeating_effort_language",
    ],
  },
  {
    family: "bracing",
    weak_requires: [
      "faint_anticipatory_tightening_still_present",
      "current_turn_still_signals_guarding_or_readiness",
      "carryover_remains_atmospheric",
    ],
    strong_requires: [
      "clear_preemptive_tightening_now",
      "same_family_still_alive_in_current_turn",
      "carryover_feels_like_lingering_readiness_not_explanation",
    ],
  },
];

export function getAllowedTemplateFamilies(decision: PromotionDecision): string[] {
  if (!decision.should_render_carryover) return [];

  if (decision.promotion_state === "strong_promotion") {
    return [
      "ultra_light_fallback",
      "residual_background_presence",
      "softened_continuation",
      "same_space_coherence",
    ];
  }

  if (decision.promotion_state === "weak_promotion") {
    return [
      "ultra_light_fallback",
      "residual_background_presence",
      "same_space_coherence",
    ];
  }

  return [];
}
