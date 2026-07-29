import type { DriftSeverity, DriftType } from "./types";

export interface DriftRule {
  type: DriftType;
  severity: DriftSeverity;
  patterns: RegExp[];
  reason: string;
}

export const DRIFT_RULES: DriftRule[] = [
  {
    type: "advice_drift",
    severity: "high",
    reason: "Output gives advice or direction.",
    patterns: [
      /\byou should\b/i,
      /\byou need to\b/i,
      /\bi recommend\b/i,
      /\btry to\b/i,
      /\bit may help to\b/i,
      /\bone thing you can do\b/i,
      /\byou could\b/i,
      // Imperative do/don't decision takeover (sentence-initial; catches "Don't hand…")
      /(?:^|[.!?]\s*)don'?t\s+[a-z]/i,
      /(?:^|[.!?]\s*)do not\s+[a-z]/i,
      /\bdon'?t (force|make|quit|decide|choose|hand)\b/i,
      /\bdo not (force|make|quit|decide|choose|hand)\b/i,
      /你应该/,
      /你可以先/,
      /先把/,
      /先处理/,
      /先别/,
      /下一步/,
      /试着去/,
      /建议你/,
    ],
  },
  {
    type: "coaching_drift",
    severity: "high",
    reason: "Output turns into coaching or action planning.",
    patterns: [
      /\blet'?s make a plan\b/i,
      /\bnext step\b/i,
      /\bstep 1\b/i,
      /\bgoal\b/i,
      /\bstrategy\b/i,
      /\baction plan\b/i,
    ],
  },
  {
    type: "companion_drift",
    severity: "high",
    reason: "Output accepts companion or emotional-support-AI framing.",
    patterns: [
      /\bi'?m (right )?here with you\b/i,
      /\bi(?:'ll| will) (stay|keep|be) (here|with you)\b/i,
      /\bi can stay with\b/i,
      /\bi can stay for\b/i,
      /\bi will stay\b/i,
      /\bstay with what'?s real\b/i,
      /\bstay with you\b/i,
      /\byou(?:'re| are) not alone\b/i,
      /\bkeep you company\b/i,
      /\bi(?:'m| am) (here|with you) if you need\b/i,
      /我在这里陪你/,
      /陪着你/,
      /你并不孤单/,
    ],
  },
  {
    type: "therapy_drift",
    severity: "medium",
    reason: "Output becomes therapeutic or emotionally supportive.",
    patterns: [
      /\byour feelings are valid\b/i,
      /\bit makes sense that you feel\b/i,
      /\bi hear how painful\b/i,
      /\bthis sounds like trauma\b/i,
      /\binner child\b/i,
      /\bhealing\b/i,
    ],
  },
  {
    type: "pseudo_depth_drift",
    severity: "medium",
    reason: "Output becomes abstract, inflated, or pseudo-spiritual.",
    patterns: [
      /\bthe universe\b/i,
      /\byour soul is\b/i,
      /\bdivine\b/i,
      /\bfrequency\b/i,
      /\benergy field\b/i,
      /\bhigher self\b/i,
    ],
  },
  {
    type: "continuity_drift",
    severity: "high",
    reason: "Output sounds like memory or narrative continuation.",
    patterns: [
      /\bas you mentioned before\b/i,
      /\blast time\b/i,
      /\bi remember\b/i,
      /\byou have been\b/i,
      /\bthis pattern in your life\b/i,
    ],
  },
];

