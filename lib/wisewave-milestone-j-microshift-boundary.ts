/**
 * Milestone J — OctopusMind admissibility / suppression / conflict map (v1) + compact evaluator.
 * Pairs with:
 * - lib/wisewave-milestone-j-microshift-boundary-map-v1.json (source of truth)
 * - docs/HC_OS_V1_Milestone_J_OctopusMind_Boundary_Handoff.md
 * - docs/HC_OS_V1_Milestone_J_Addendum_Micro_Shift_Embodied_Effect_Layer.md
 *
 * `evaluateMilestoneJBoundary` gates J emission in `/api/chat/turn` when ENABLE_J_MICROSHIFT is on.
 * Set `conflictState` to non-"none" when H or I already emitted on the same turn (prefer H·I; J loses first).
 */

import type { ExtractedReflectionState } from "@/lib/wisewave-extract";
import {
  looksUtilitarianOrFactual,
  userHasReflectiveStructureForCarryover,
} from "@/lib/wisewave-milestone-i-soft-continuity-carryover";
import { assistantContainsJBlockedPattern } from "@/lib/wisewave-milestone-j-microshift";
import rawBoundary from "./wisewave-milestone-j-microshift-boundary-map-v1.json";

export const J_MICROSHIFT_BOUNDARY_MAP_MARKER = "j_microshift_boundary_v1";

export const J_MICROSHIFT_BOUNDARY_MAP_V1 = rawBoundary;

export type JEligibility =
  | "inadmissible"
  | "weak_candidate"
  | "admissible"
  | "strong_but_still_light";

export type JTurnType =
  | "reflective"
  | "mixed"
  | "factual"
  | "utilitarian"
  | "logistical";

export type JConflictState =
  | "none"
  | "h_active"
  | "i_active"
  | "h_and_i_active";

export interface JBoundaryInput {
  turnType: JTurnType;
  currentTurnSupportsShift: boolean;
  directiveWordingNeeded: boolean;
  presenceRisk: boolean;
  authorshipRisk: boolean;
  guidanceRisk: boolean;
  mainReflectionAlreadySufficient: boolean;
  conflictState: JConflictState;
  removalFeelsCleaner: boolean;
  shiftStrength: "none" | "weak" | "moderate" | "strong";
}

export interface JBoundaryDecision {
  eligible: boolean;
  eligibility: JEligibility;
  suppress: boolean;
  allowRenderMode: "none" | "ultra_light" | "soft";
  reasons: string[];
  rollbackRisk: boolean;
}

export function evaluateMilestoneJBoundary(
  input: JBoundaryInput
): JBoundaryDecision {
  const reasons: string[] = [];

  if (["factual", "utilitarian", "logistical"].includes(input.turnType)) {
    reasons.push("non_reflective_turn");
  }
  if (!input.currentTurnSupportsShift) {
    reasons.push("no_shift_support");
  }
  if (input.directiveWordingNeeded) {
    reasons.push("directive_wording_needed");
  }
  if (input.presenceRisk) {
    reasons.push("presence_risk");
  }
  if (input.authorshipRisk) {
    reasons.push("authorship_risk");
  }
  if (input.guidanceRisk) {
    reasons.push("guidance_risk");
  }
  if (input.mainReflectionAlreadySufficient) {
    reasons.push("main_reflection_sufficient");
  }
  if (input.conflictState !== "none") {
    reasons.push(`conflict:${input.conflictState}`);
  }
  if (input.removalFeelsCleaner) {
    reasons.push("removal_cleaner");
  }

  const hardSuppress =
    reasons.includes("non_reflective_turn") ||
    reasons.includes("no_shift_support") ||
    reasons.includes("directive_wording_needed") ||
    reasons.includes("presence_risk") ||
    reasons.includes("authorship_risk") ||
    reasons.some((r) => r.startsWith("conflict:"));

  const strongSuppress =
    reasons.includes("main_reflection_sufficient") ||
    reasons.includes("guidance_risk") ||
    reasons.includes("removal_cleaner");

  const rollbackRisk =
    reasons.includes("directive_wording_needed") ||
    reasons.includes("presence_risk") ||
    reasons.includes("authorship_risk") ||
    reasons.includes("guidance_risk");

  if (hardSuppress) {
    return {
      eligible: false,
      eligibility: "inadmissible",
      suppress: true,
      allowRenderMode: "none",
      reasons,
      rollbackRisk,
    };
  }

  if (strongSuppress || input.shiftStrength === "weak") {
    return {
      eligible: true,
      eligibility: "weak_candidate",
      suppress: true,
      allowRenderMode: "none",
      reasons,
      rollbackRisk,
    };
  }

  if (input.shiftStrength === "strong") {
    return {
      eligible: true,
      eligibility: "strong_but_still_light",
      suppress: false,
      allowRenderMode: "soft",
      reasons,
      rollbackRisk,
    };
  }

  return {
    eligible: true,
    eligibility: "admissible",
    suppress: false,
    allowRenderMode: "ultra_light",
    reasons,
    rollbackRisk,
  };
}

/**
 * Build boundary input from live turn signals. Conservative: H or I emission on this turn
 * sets conflict state so J is hard-suppressed (OctopusMind j_conflict_01 / j_conflict_02).
 */
export function buildJBoundaryInputForTurn(params: {
  userMessage: string;
  reflectionState: ExtractedReflectionState;
  awarenessCueEmitted: boolean;
  milestoneIEmitted: boolean;
  recurrenceCueEmitted: boolean;
  embodimentCueEmitted: boolean;
  mainReflectionSufficient: boolean | null;
  assistantBodyBeforeJ: string;
}): JBoundaryInput {
  const message = params.userMessage.trim();
  const insight = params.reflectionState.insight_candidate.trim();

  let turnType: JTurnType = "mixed";
  if (looksUtilitarianOrFactual(message)) {
    turnType = "utilitarian";
  } else if (
    insight.length >= 48 ||
    (insight.length >= 32 && userHasReflectiveStructureForCarryover(message))
  ) {
    turnType = "reflective";
  }

  const currentTurnSupportsShift =
    insight.length >= 28 && !looksUtilitarianOrFactual(message);

  const weak = new Set(["unknown", "uncertain", "", "—"]);
  const rs = params.reflectionState;
  const authorshipRisk =
    insight.length < 40 &&
    [rs.trigger_label, rs.emotion_label, rs.interpretation_label].every((l) =>
      weak.has((l || "").toLowerCase().trim())
    );

  const presenceRisk =
    params.recurrenceCueEmitted || params.embodimentCueEmitted;

  const guidanceRisk = assistantContainsJBlockedPattern(
    params.assistantBodyBeforeJ
  );

  const mainReflectionAlreadySufficient =
    params.mainReflectionSufficient === true;

  let conflictState: JConflictState = "none";
  if (params.awarenessCueEmitted && params.milestoneIEmitted) {
    conflictState = "h_and_i_active";
  } else if (params.awarenessCueEmitted) {
    conflictState = "h_active";
  } else if (params.milestoneIEmitted) {
    conflictState = "i_active";
  }

  let shiftStrength: "none" | "weak" | "moderate" | "strong" = "moderate";
  if (insight.length < 36) shiftStrength = "weak";
  else if (
    insight.length >= 110 &&
    userHasReflectiveStructureForCarryover(message)
  ) {
    shiftStrength = "strong";
  }

  return {
    turnType,
    currentTurnSupportsShift,
    directiveWordingNeeded: false,
    presenceRisk,
    authorshipRisk,
    guidanceRisk,
    mainReflectionAlreadySufficient,
    conflictState,
    removalFeelsCleaner: mainReflectionAlreadySufficient,
    shiftStrength,
  };
}
