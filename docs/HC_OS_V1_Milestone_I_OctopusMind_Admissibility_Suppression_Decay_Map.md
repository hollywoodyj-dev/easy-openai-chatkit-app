# HC-OS V1 — Milestone I (OctopusMind) Admissibility / Suppression / Decay Map

Owner: OctopusMind

Purpose:
Define the admissibility, suppression, decay, and conflict boundaries for Milestone I so that carry-over remains:

- narrow
- invisible / subordinate
- re-earned from the current turn
- quickly decaying (no ambient persistence)

Boundary intent:

- I may lightly preserve a felt thread across nearby moments
- I must not feel like memory, replay, or visible continuity behavior
- if uncertain, suppress
- if I overlaps with E or H, suppress I first

---

## Types / evaluator shapes

```ts
export type MilestoneIEligibility =
  | "inadmissible"
  | "weak_candidate"
  | "admissible"
  | "strong_but_still_light";

export type ThreadStrength = "none" | "weak" | "moderate" | "strong";
export type TurnType =
  | "reflective"
  | "mixed"
  | "factual"
  | "utilitarian"
  | "logistical";
export type ConflictState =
  | "none"
  | "e_active"
  | "h_active"
  | "e_and_h_active";
export type DecayState =
  | "fresh"
  | "soft_decay"
  | "near_expiry"
  | "expired";

export interface AdmissibilityCondition {
  id: string;
  description: string;
  required: boolean;
}

export interface SuppressionCondition {
  id: string;
  description: string;
  priority: "hard" | "strong" | "soft";
}

export interface DecayRule {
  id: string;
  description: string;
}

export interface ConflictRule {
  id: string;
  description: string;
  action: "suppress_i" | "prefer_e" | "prefer_h" | "suppress_all_optional";
}

export interface MilestoneIBoundaryMap {
  milestone: "I";
  feature: "soft_continuity_boundary";
  version: string;
  governing_rule: string;
  strategic_definition: string;
  proof_target: string;

  admissibility: {
    required_conditions: AdmissibilityCondition[];
    grading_rules: Record<MilestoneIEligibility, string>;
  };

  suppression: {
    hard_suppression: SuppressionCondition[];
    strong_suppression: SuppressionCondition[];
    soft_suppression: SuppressionCondition[];
    uncertainty_rule: string;
    default_posture: string;
  };

  decay: {
    governing_rule: string;
    states: Record<DecayState, string>;
    rules: DecayRule[];
  };

  conflict_rules: ConflictRule[];

  persistence_limits: {
    max_near_turn_window: string;
    cumulative_strengthening: string;
    explicit_recall_dependency: string;
    visibility_cap: string;
  };

  implementation_flags: {
    require_current_turn_support: boolean;
    suppress_under_uncertainty: boolean;
    suppress_on_feature_visibility_risk: boolean;
    suppress_on_e_or_h_overlap: boolean;
    allow_long_window_carryover: boolean;
  };

  qa_checks: string[];
}

export const MILESTONE_I_BOUNDARY_MAP: MilestoneIBoundaryMap = {
  milestone: "I",
  feature: "soft_continuity_boundary",
  version: "v1",

  governing_rule:
    "Milestone I succeeds only if continuity is felt without becoming visible.",

  strategic_definition:
    "Milestone I is a carry-over milestone, not a memory milestone. It may lightly preserve a felt thread across nearby moments, but may not create visible recall, replay, tracking-feel, or continuity-feature behavior.",

  proof_target:
    "A meaningful reflective thread can remain faintly present across nearby moments without increasing system presence.",

  admissibility: {
    required_conditions: [
      {
        id: "i_adm_01",
        description:
          "Current turn remains in a clearly related inner thread or reflective atmosphere.",
        required: true,
      },
      {
        id: "i_adm_02",
        description:
          "Carry-over can work without explicit recall, replay, or reference to earlier turns.",
        required: true,
      },
      {
        id: "i_adm_03",
        description:
          "The continuity effect can remain faint, indirect, and subordinate to the main reflection.",
        required: true,
      },
      {
        id: "i_adm_04",
        description:
          "Current turn provides enough support to re-earn continuity; continuity does not rely on stale state alone.",
        required: true,
      },
      {
        id: "i_adm_05",
        description:
          "Continuity wording would reduce reset-feel without increasing feature visibility.",
        required: true,
      },
      {
        id: "i_adm_06",
        description:
          "Neither E pattern surfacing nor H micro-awareness is already sufficient on this turn.",
        required: true,
      },
    ],

    grading_rules: {
      inadmissible:
        "One or more required conditions fail, or the turn is factual/utilitarian, or continuity would require explicit recall to work.",
      weak_candidate:
        "Continuity is plausible but weak; only ultra-light carry-over may be considered, and suppression is still preferred under ambiguity.",
      admissible:
        "Current turn clearly supports a faint continuity thread, and the effect can remain unannounced, low-claim, and subordinate.",
      strong_but_still_light:
        "Continuity is strongly supported by the current turn, but must still render as quiet carry-over rather than visible continuity behavior.",
    },
  },

  suppression: {
    hard_suppression: [
      {
        id: "i_sup_hard_01",
        description: "Turn is factual, utilitarian, logistical, or non-reflective.",
        priority: "hard",
      },
      {
        id: "i_sup_hard_02",
        description:
          "Continuity would need explicit recall, replay, or recognizable prior-language reuse to work.",
        priority: "hard",
      },
      {
        id: "i_sup_hard_03",
        description:
          "Output would become noticeable as continuity behavior or memory behavior.",
        priority: "hard",
      },
      {
        id: "i_sup_hard_04",
        description:
          "Continuity duplicates or competes with E pattern surfacing already active in the turn.",
        priority: "hard",
      },
      {
        id: "i_sup_hard_05",
        description:
          "Continuity duplicates or competes with H micro-awareness already active in the turn.",
        priority: "hard",
      },
    ],

    strong_suppression: [
      {
        id: "i_sup_strong_01",
        description:
          "Thread has weakened materially and current turn no longer clearly re-supports it.",
        priority: "strong",
      },
      {
        id: "i_sup_strong_02",
        description:
          "Continuity line would compete with the main reflection or make the response feel layered.",
        priority: "strong",
      },
      {
        id: "i_sup_strong_03",
        description:
          "Carry-over feels cleaner when removed than when kept.",
        priority: "strong",
      },
      {
        id: "i_sup_strong_04",
        description:
          "Continuity risk of sounding repeated, categorized, or pattern-replay-like is high.",
        priority: "strong",
      },
    ],

    soft_suppression: [
      {
        id: "i_sup_soft_01",
        description:
          "Continuity is only weakly plausible and may not add enough coherence to justify presence.",
        priority: "soft",
      },
      {
        id: "i_sup_soft_02",
        description:
          "Main reflection already lands cleanly and continuity adds little beyond atmosphere polishing.",
        priority: "soft",
      },
      {
        id: "i_sup_soft_03",
        description:
          "Wording risk is not fatal, but still drifts toward visible mechanism.",
        priority: "soft",
      },
    ],

    uncertainty_rule: "If uncertain, suppress.",
    default_posture:
      "Default-off. I must be re-earned from the current turn rather than assumed from previous state.",
  },

  decay: {
    governing_rule:
      "Carry-over must weaken quickly and disappear by default unless clearly re-supported by the current turn.",

    states: {
      fresh:
        "Continuity is newly supported by the current turn and may be considered if all admissibility conditions hold.",
      soft_decay:
        "Continuity is fading; only lighter indirect shaping is allowed.",
      near_expiry:
        "Continuity is barely supportable; ultra-light fallback only, with suppression strongly preferred.",
      expired:
        "Continuity is no longer active and must not render.",
    },

    rules: [
      {
        id: "i_decay_01",
        description:
          "Continuity decays every turn by default unless current-turn support clearly renews it.",
      },
      {
        id: "i_decay_02",
        description:
          "No automatic persistence across unrelated turns or topic shifts.",
      },
      {
        id: "i_decay_03",
        description:
          "If explicit recall would be required to preserve continuity, continuity has already decayed too far and must be suppressed.",
      },
      {
        id: "i_decay_04",
        description:
          "Decay should bias toward disappearance rather than continuity survival.",
      },
      {
        id: "i_decay_05",
        description:
          "A weakly supported thread should move quickly to near_expiry or expired rather than remain ambient indefinitely.",
      },
    ],
  },

  conflict_rules: [
    {
      id: "i_conflict_01",
      description:
        "If E pattern surfacing is already sufficient, suppress I first.",
      action: "prefer_e",
    },
    {
      id: "i_conflict_02",
      description:
        "If H micro-awareness is already sufficient, suppress I first.",
      action: "prefer_h",
    },
    {
      id: "i_conflict_03",
      description:
        "If I would make the response more layered when E or H is active, suppress all optional I behavior.",
      action: "suppress_i",
    },
    {
      id: "i_conflict_04",
      description:
        "If the main reflection already preserves coherence well enough, suppress I rather than decorate the response.",
      action: "suppress_all_optional",
    },
  ],

  persistence_limits: {
    max_near_turn_window: "Near-turn only. No long-window continuity carry-over is allowed.",
    cumulative_strengthening:
      "Disallowed unless current-turn support clearly re-earns continuity. No passive accumulation.",
    explicit_recall_dependency:
      "If I depends on explicit recall to remain legible, I must be suppressed.",
    visibility_cap:
      "Continuity must remain harder to notice than to benefit from.",
  },

  implementation_flags: {
    require_current_turn_support: true,
    suppress_under_uncertainty: true,
    suppress_on_feature_visibility_risk: true,
    suppress_on_e_or_h_overlap: true,
    allow_long_window_carryover: false,
  },

  qa_checks: [
    "I appears only when current-turn support clearly exists",
    "I suppresses under uncertainty",
    "I decays quickly by default",
    "I never requires explicit recall to function",
    "I is suppressed when E or H is sufficient",
    "I does not increase system presence",
    "I does not feel like replay, memory, or tracking",
    "removal is preferred over refinement when mixed",
    "I remains subordinate to the main reflection",
  ],
};
```

---

## Compact example evaluator shape (Nova / Lumen helper)

```ts
export interface ContinuityBoundaryInput {
  turnType: TurnType;
  threadStrength: ThreadStrength;
  explicitRecallNeeded: boolean;
  visibilityRisk: boolean;
  conflictState: ConflictState;
  mainReflectionAlreadySufficient: boolean;
  currentTurnSupportsCarryover: boolean;
  removalFeelsCleaner: boolean;
}

export interface ContinuityBoundaryDecision {
  eligible: boolean;
  eligibility: MilestoneIEligibility;
  suppress: boolean;
  reasons: string[];
  decayState: DecayState;
}

export function evaluateMilestoneIBoundary(
  input: ContinuityBoundaryInput
): ContinuityBoundaryDecision {
  const reasons: string[] = [];

  if (["factual", "utilitarian", "logistical"].includes(input.turnType)) {
    reasons.push("non_reflective_turn");
  }
  if (input.explicitRecallNeeded) {
    reasons.push("explicit_recall_needed");
  }
  if (input.visibilityRisk) {
    reasons.push("visibility_risk");
  }
  if (input.conflictState !== "none") {
    reasons.push(`conflict:${input.conflictState}`);
  }
  if (!input.currentTurnSupportsCarryover) {
    reasons.push("no_current_turn_support");
  }
  if (input.mainReflectionAlreadySufficient) {
    reasons.push("main_reflection_sufficient");
  }
  if (input.removalFeelsCleaner) {
    reasons.push("removal_cleaner");
  }

  const hardSuppress =
    reasons.includes("non_reflective_turn") ||
    reasons.includes("explicit_recall_needed") ||
    reasons.includes("visibility_risk") ||
    reasons.some((r) => r.startsWith("conflict:"));

  let decayState: DecayState = "expired";
  if (input.threadStrength === "strong" && input.currentTurnSupportsCarryover) {
    decayState = "fresh";
  } else if (
    input.threadStrength === "moderate" &&
    input.currentTurnSupportsCarryover
  ) {
    decayState = "soft_decay";
  } else if (input.threadStrength === "weak") {
    decayState = "near_expiry";
  }

  if (hardSuppress) {
    return {
      eligible: false,
      eligibility: "inadmissible",
      suppress: true,
      reasons,
      decayState,
    };
  }

  if (
    input.threadStrength === "weak" ||
    reasons.includes("main_reflection_sufficient") ||
    reasons.includes("removal_cleaner")
  ) {
    return {
      eligible: true,
      eligibility: "weak_candidate",
      suppress: true,
      reasons,
      decayState,
    };
  }

  if (input.threadStrength === "strong") {
    return {
      eligible: true,
      eligibility: "strong_but_still_light",
      suppress: false,
      reasons,
      decayState,
    };
  }

  return {
    eligible: true,
    eligibility: "admissible",
    suppress: false,
    reasons,
    decayState,
  };
}
```

---

## Core OctopusMind rule statement

The core OctopusMind rule stays very simple:

- I must be re-earned from the current turn
- decay quickly
- lose any conflict with E or H

This keeps Milestone I narrow, invisible, and governed by suppression-first logic instead of growth logic.

The Milestone I template map and boundary map fit together as a pair:

- Wisewave / Nova map = what soft carry-over may sound like when allowed
- OctopusMind map = when it is allowed, when it must disappear, and how it decays

