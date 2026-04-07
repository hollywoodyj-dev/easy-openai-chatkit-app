/**
 * Phase 6 — Continue adoption tuning: non-UX instrumentation + segmentation hints.
 * Spec: docs/HC_OS_V1_Phase_6_Execution_Memo.md, docs/HC_OS_V1_Phase_6_Task_Adoption_Tuning_Without_Identity_Drift.md
 * Does not change surfacing rules; only exposes observability for Lumen/Tree analytics.
 */

import { isStrongEmotionalReturnLabel } from "@/lib/wisewave-continue-list";
import { isContinueReentryContinuationUtterance } from "@/lib/wisewave-continue-reentry-turn";

/** Heuristic only — segment repeat-use and impressions; not used for product decisions. */
export type Phase6ReturnPatternHint =
  | "fresh_start"
  | "short_pause_return"
  | "medium_pause_return"
  | "emotional_interruption_return"
  | "interrupted_articulation_return"
  | "unresolved_reflection_return"
  | "unknown";

export type Phase6ContinueListMeta = {
  return_pattern_hint: Phase6ReturnPatternHint;
  option_count: number;
  /** Labels that match strong emotional-return family (Continue picker vocabulary). */
  strong_option_count: number;
  /** True when GET /api/chat/threads returns [] due to weak-tail last user line. */
  suppressed_weak_tail: boolean;
  /**
   * Product-quality signal (Task addendum): empty Continue in weak/no-candidate cases is success, not failure.
   */
  zero_continue_surface: boolean;
  /**
   * Phase 6: last user line matches low-verbal Continue re-entry ack (not a suppression tail).
   */
  low_verbal_reentry_ack: boolean;
};

/**
 * Classify last user message for return-pattern segmentation (Workstream B).
 * Conservative: prefer unknown when unclear.
 */
export function classifyPhase6ReturnPatternHint(message: string): Phase6ReturnPatternHint {
  const t = message.trim();
  if (!t) return "unknown";
  const lower = t.toLowerCase();

  if (
    /^(hi|hey|hello|good morning|morning|evening)\b/.test(lower) &&
    lower.length < 48
  ) {
    return "fresh_start";
  }

  if (
    /\b(was saying|lost (my |the )?(train|thread)|forgot what i|where was i|cut me off|got interrupted)\b/i.test(
      lower
    )
  ) {
    return "interrupted_articulation_return";
  }

  if (
    /\b(suddenly overwhelmed|flooded all at once|too much (right )?now|something just came up|had to stop mid-thought)\b/i.test(
      lower
    )
  ) {
    return "emotional_interruption_return";
  }

  if (
    lower.length <= 18 &&
    /^(yeah|yep|mm|mhm|uh huh|ok|okay|ok\.|thanks\.?|thank you|ty|thx)\b/i.test(
      lower
    )
  ) {
    return "short_pause_return";
  }

  if (
    /\b(still (thinking|processing|not sure)|don'?t know yet|haven'?t finished sorting|unfinished here|to be continued)\b/i.test(
      lower
    )
  ) {
    return "unresolved_reflection_return";
  }

  if (lower.length > 40 && lower.length < 360) {
    return "medium_pause_return";
  }

  return "unknown";
}

export function buildPhase6ContinueListMeta(input: {
  lastUserMessage: string;
  pickedLabels: string[];
  suppressedWeakTail: boolean;
}): Phase6ContinueListMeta {
  const optionCount = input.pickedLabels.length;
  const strongOptionCount = input.pickedLabels.filter((l) =>
    isStrongEmotionalReturnLabel(l)
  ).length;
  return {
    return_pattern_hint: classifyPhase6ReturnPatternHint(input.lastUserMessage),
    option_count: optionCount,
    strong_option_count: strongOptionCount,
    suppressed_weak_tail: input.suppressedWeakTail,
    zero_continue_surface: optionCount === 0,
    low_verbal_reentry_ack: isContinueReentryContinuationUtterance(
      input.lastUserMessage
    ),
  };
}
