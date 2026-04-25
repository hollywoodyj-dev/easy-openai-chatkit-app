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

