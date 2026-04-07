/**
 * Tree Phase 4 — one-turn window after Continue selection.
 * Short / low-information user lines should inherit the chosen unfinished direction
 * instead of resetting thread state or tripping utilitarian-length gates.
 */

/** Max length for a single utterance we treat as a Continue carry / ack line. */
export const CONTINUE_REENTRY_ACK_MAX_LEN = 88;

/**
 * True when `message` reads as a brief continuation of the resumed direction
 * (not a new topic or factual request). Used only when `phase_3_thread_reentry` is already true.
 */
export function isContinueReentryContinuationUtterance(message: string): boolean {
  const raw = message.trim();
  if (raw.length === 0 || raw.length > CONTINUE_REENTRY_ACK_MAX_LEN) return false;

  const t = raw.replace(/\s+/g, " ");
  const lower = t.toLowerCase();

  if (/^(separate|different|new|another)\s+(question|topic)\b/i.test(lower)) return false;

  // Vocal / minimal ack
  if (/^(mm+|mhm|hm+|hmm+|uh|um|uh-?huh)\.?$/i.test(t)) return true;
  if (/^(yeah|yep|yup|nah|nope|ok|okay|sure)\s*\.{0,3}$/i.test(t)) return true;
  if (/^(嗯|唔|呃|哦|嗷|啊|诶)\s*$/u.test(t)) return true;

  // Brief stance / hedge continuations (unfinished-direction echo)
  if (/^(not really|sort of|kind of)\s*\.{0,3}$/i.test(t)) return true;
  if (/^i\s+guess(\s+so)?\s*\.{0,3}$/i.test(t)) return true;
  if (/^not\s+sure\s*\.{0,3}$/i.test(t)) return true;

  if (/\b(still there|still here|still with me|still with you|still in it)\b/i.test(lower))
    return true;

  // "Yeah, it's still there" — links acknowledgment + residue
  if (/yeah|yep|yup/.test(lower) && /\bstill\b/.test(lower)) return true;

  if (/[\u4e00-\u9fff]/.test(t)) {
    if (t.length <= 28 && /(还在|還在|还是这样|還是|还在的)/.test(t)) return true;
  }

  return false;
}
