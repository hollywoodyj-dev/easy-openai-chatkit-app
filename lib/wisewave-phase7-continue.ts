import {
  classifyPhase6ReturnPatternHint,
  type Phase6ReturnPatternHint,
} from "@/lib/wisewave-phase6-continue";
import { isContinueReentryContinuationUtterance } from "@/lib/wisewave-continue-reentry-turn";

export const PHASE7_TAXONOMY_VERSION = "phase7_v1";

export type Phase7ReturnPatternId =
  | "unfinished_emotional_residue"
  | "delayed_reply_replay"
  | "worth_pressure_loop"
  | "interrupted_articulation"
  | "recent_unfinished_return"
  | "low_verbal_resumable_return"
  | "other";

export function classifyPhase7ReturnPatternId(message: string): Phase7ReturnPatternId {
  if (isContinueReentryContinuationUtterance(message)) {
    return "low_verbal_resumable_return";
  }
  const hint = classifyPhase6ReturnPatternHint(message);
  return mapPhase6HintToPhase7ReturnPatternId(hint);
}

function mapPhase6HintToPhase7ReturnPatternId(
  hint: Phase6ReturnPatternHint
): Phase7ReturnPatternId {
  switch (hint) {
    case "interrupted_articulation_return":
      return "interrupted_articulation";
    case "emotional_interruption_return":
      return "unfinished_emotional_residue";
    case "unresolved_reflection_return":
      return "recent_unfinished_return";
    case "short_pause_return":
      return "low_verbal_resumable_return";
    case "medium_pause_return":
      return "recent_unfinished_return";
    default:
      return "other";
  }
}

export type Phase7ContinueListMeta = {
  taxonomy_version: typeof PHASE7_TAXONOMY_VERSION;
  return_pattern_id: Phase7ReturnPatternId;
  /**
   * Event-field atoms for normalized rate computation in downstream analytics.
   * These fields are not user-facing and do not affect product behavior.
   */
  exposure_numerator_event: 0 | 1;
  exposure_denominator_event: 1;
  zero_surface_success_event: 0 | 1;
  weak_case_suppressed_event: 0 | 1;
  option_count: number;
};

export function buildPhase7ContinueListMeta(input: {
  lastUserMessage: string;
  optionCount: number;
  suppressedWeakTail: boolean;
}): Phase7ContinueListMeta {
  const shown = input.optionCount > 0;
  return {
    taxonomy_version: PHASE7_TAXONOMY_VERSION,
    return_pattern_id: classifyPhase7ReturnPatternId(input.lastUserMessage),
    exposure_numerator_event: shown ? 1 : 0,
    exposure_denominator_event: 1,
    zero_surface_success_event:
      input.suppressedWeakTail || input.optionCount === 0 ? 1 : 0,
    weak_case_suppressed_event: input.suppressedWeakTail ? 1 : 0,
    option_count: input.optionCount,
  };
}

export type Phase7TurnDebugMeta = {
  taxonomy_version: typeof PHASE7_TAXONOMY_VERSION;
  return_pattern_id: Phase7ReturnPatternId;
  continue_reentry_selected: boolean;
  short_ack_reentry: boolean;
  strong_path_event: boolean;
};

export function buildPhase7TurnDebugMeta(input: {
  userMessage: string;
  phase3ThreadReentry: boolean;
  continueReentryContinuationTurn: boolean;
  threadState: "new_thread" | "same_thread" | "borderline";
}): Phase7TurnDebugMeta {
  const strongPathEvent =
    input.phase3ThreadReentry &&
    input.continueReentryContinuationTurn &&
    input.threadState === "same_thread";
  return {
    taxonomy_version: PHASE7_TAXONOMY_VERSION,
    return_pattern_id: classifyPhase7ReturnPatternId(input.userMessage),
    continue_reentry_selected: input.phase3ThreadReentry,
    short_ack_reentry: input.continueReentryContinuationTurn,
    strong_path_event: strongPathEvent,
  };
}
