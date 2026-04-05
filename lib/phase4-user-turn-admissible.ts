/**
 * Phase 4 marker admissibility for the **current user turn** only.
 * Narrower than `allowContinuityLayers`: last_insight / soft_continuity / H / I stay
 * gated by `looksUtilitarianOrFactual`; Phase 4 may admit a quiet marker when the
 * utilitarian heuristic false-positives on short, clearly affective turns.
 *
 * Tree follow-up: improve reach without weakening constitution — carve-out must stay
 * small and suppression-first everywhere else.
 */

import { looksUtilitarianOrFactual } from "@/lib/wisewave-milestone-h-micro-awareness";

const UTIL_BLOCKLIST =
  /\b(recipe|pasta|cook|ingredients?|dinner|email|document|schedule|meeting|deadline|ticket|bug|deploy|api|code|function|error\s+log)\b/i;

/**
 * English / Chinese turns that `looksUtilitarianOrFactual` can mark utilitarian only
 * because of length &lt; 40 or missing first-person token, but are still affective.
 */
export function phase4NarrowReflectiveCarveOut(message: string): boolean {
  const t = message.trim();
  if (t.length < 14 || t.length > 600) return false;
  if (UTIL_BLOCKLIST.test(t)) return false;

  const lower = t.toLowerCase();

  if (
    /^(feeling|wondering|thinking|noticing|struggling|processing)\b/i.test(lower) &&
    /\b(overwhelm|overwhelmed|anxious|anxiety|sad|down|low|lost|stuck|heavy|empty|tired|restless|alone|lonely|scared|worried|stressed|pressure|numb|drained|hopeless|fragile)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  if (
    /^(hard to|difficult to|can'?t seem to|unable to)\b/i.test(lower) &&
    /\b(sleep|rest|focus|stop|think|feel|settle|calm|breathe|quiet)\b/i.test(lower)
  ) {
    return true;
  }

  if (/[\u4e00-\u9fff]/.test(t)) {
    if (/(怎么写|如何实现|什么是|如何安装|请帮我|帮我写)/.test(t)) {
      return false;
    }
    if (/^(感觉|觉得|心里|有种|有点|好像|说不清|不知道怎么说|说不出来)/.test(t)) {
      return true;
    }
    if (/^(总有一种|好像总|老是觉得)/.test(t)) {
      return true;
    }
  }

  return false;
}

/** Same-thread only; true when Phase 4 marker may be evaluated for this turn. */
export function allowPhase4MarkerForUserTurn(
  threadState: "same_thread" | "new_thread" | "borderline",
  message: string
): boolean {
  if (threadState !== "same_thread") return false;
  if (!looksUtilitarianOrFactual(message)) return true;
  return phase4NarrowReflectiveCarveOut(message);
}
