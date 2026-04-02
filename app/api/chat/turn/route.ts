import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";
import { verifyUserToken } from "@/lib/auth";
import { checkUserSubscriptionAccess } from "@/lib/subscription-access";
import {
  extractReflectionState,
  type ExtractedReflectionState,
} from "@/lib/wisewave-extract";
import { CHAT_SYSTEM_PROMPT as WISEWAVE_CHAT_PROMPT } from "@/lib/wisewave-prompts";
import {
  type ContinuityPatternFamily,
  detectContinuityPatternFamily,
} from "@/lib/wisewave-continuity-family";
import {
  embodimentCueTexts,
  type EmbodimentPatternKey,
} from "@/lib/wisewave-milestone-f-embodiment";
import {
  isMilestoneGIntegrationEnabled,
  milestoneGBuildMarker,
  milestoneGSystemAppendix,
} from "@/lib/wisewave-milestone-g-integration";
import {
  computeMicroAwarenessCue,
  hasReflectiveFirstPersonAnchor,
  isMilestoneHCueEnabled,
  looksUtilitarianOrFactual,
  milestoneHBuildMarker,
  type MicroAwarenessKind,
} from "@/lib/wisewave-milestone-h-micro-awareness";
import {
  computeMilestoneICarryoverCue,
  isMilestoneICarryoverEnabled,
  milestoneIBuildMarker,
  type MilestoneISuppressedReason,
  type MilestoneIOutcome,
} from "@/lib/wisewave-milestone-i-soft-continuity-carryover";
import {
  milestoneHLightModeBuildMarker,
  milestoneHLightModeSystemAppendix,
} from "@/lib/wisewave-milestone-h-light-mode";
import {
  isMilestoneJMicroshiftEnabled,
  milestoneJBuildMarker,
  pickJMicroshiftTemplate,
  type JRenderMode,
} from "@/lib/wisewave-milestone-j-microshift";
import {
  buildJBoundaryInputForTurn,
  evaluateMilestoneJBoundary,
} from "@/lib/wisewave-milestone-j-microshift-boundary";
import { normalizeModelTextForStorage } from "@/lib/normalize-model-text";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const DEFAULT_CHAT_MODEL = "gpt-5.4";
const RECENT_MESSAGES_COUNT = 8;
const SUMMARY_TRIGGER_EVERY = 10;

/**
 * Milestone E2 — numeric tuning below is PROVISIONAL (Wisewave / OctopusMind).
 * Acceptable for QA; not the final locked persistence-boundary rule until Tree governance says so.
 */
const E2_RECURRENCE_MAX_INSIGHT_AGE_MS = 10 * 24 * 60 * 60 * 1000; // provisional substrate window
/** Provisional stale decay: silence when newest aligned prior exceeds this age. */
const E2_NEWEST_ALIGNED_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
/**
 * Conservative anti-repeat heuristic only (not the core definition of persistence).
 * Same pattern_key + very short follow-up → suppress cue to avoid mechanical repetition.
 */
const E2_ANTI_REPEAT_MIN_USER_CHARS = 56;
/** Count threshold that may qualify for persistence wording — must pass relevance gates below. */
const E2_PERSISTENCE_ALIGNED_THRESHOLD = 3;
/** Minimum user message length to allow persistence-phase copy (present relevance / value-add). */
const E2_PERSISTENCE_MIN_USER_CHARS = 48;

const SUMMARY_SYSTEM_PROMPT = `You summarize conversations for memory.
The conversation summary must remain factual, concise, and non-therapeutic.

Purpose:
- preserve neutral context for downstream prompts
- capture the main topic, repeated themes, and relevant user-stated concerns
- support continuity without adding interpretive or supportive tone

Rules:
- use plain, neutral language
- summarize what was discussed, not what the user "really feels" beneath it
- do not diagnose
- do not use therapeutic framing
- do not use healing, coaching, or spiritual language
- do not infer hidden motives unless explicitly stated by the user
- do not add advice, encouragement, or reflective questions
- do not use soft self-help phrases

Avoid language such as:
- vulnerability
- validation
- acceptance
- self-worth
- fear of rejection
- not being enough
- protective mechanism
- inner child
- healing
- being seen
- peace
- ease
- self-acceptance
- letting go
- opening space

Prefer language such as:
- user discussed ongoing pressure to prove themselves
- user linked mental fatigue with repeated striving
- conversation focused on recurring patterns around achievement and pressure
- user asked for a less therapist-like and more grounded tone

Keep the summary under 120 words.
The summary should read like neutral context for a system, not like a therapist, coach, or guide.`;

// Light user-facing rephrasing for continuity text:
// 1) detect a small set of common pattern families
// 2) map each family to a short, natural reminder template
// 3) keep continuity selection logic unchanged
function lowerFirst(s: string): string {
  return s ? s.charAt(0).toLowerCase() + s.slice(1).trim() : s;
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).trim() : s;
}

function sentence(s: string): string {
  const trimmed = s.trim().replace(/[.]+$/, "");
  return trimmed ? trimmed + "." : trimmed;
}

type RecurrenceConfidence = "low" | "medium" | "high";

type LegibilityState = "light" | "clear";

type PatternId =
  | "pressure_to_get_it_right"
  | "fear_of_not_enough"
  | "over_efforting"
  | "avoidance_under_uncertainty"
  | "inner_conflict"
  | "self_worth_pressure"
  | "generic";

/**
 * Milestone E / E3 cue wording templates.
 * E3 changes the cue language quality without changing UI surface or Last insight strip.
 */
const E3_GENERIC_TEMPLATES: Record<
  LegibilityState,
  { en: string[]; zh: string[] }
> = {
  light: {
    en: [
      "This still seems close to a familiar pattern.",
      "A similar thread still seems to be present here.",
      "Something familiar may still be active here.",
      "This may still be carrying some of the same pressure.",
    ],
    zh: [
      "这似乎仍然和一个熟悉的模式很接近。",
      "这里似乎仍然带着一条相似的线索。",
      "某种熟悉的东西可能还在这里。",
      "这可能仍然承载着某种相似的压力。",
    ],
  },
  clear: {
    en: [
      "This still feels connected to something that has been recurring.",
      "A familiar pattern still seems to be active here.",
      "This still seems to be part of a familiar thread.",
      "The same underlying tension may still be present here.",
    ],
    zh: [
      "这似乎仍然和之前反复出现的某种东西有关。",
      "一个熟悉的模式似乎还在这里。",
      "这似乎仍然属于一条熟悉的线索。",
      "同一种底层张力可能仍然在这里。",
    ],
  },
};

const E3_PATTERN_TEMPLATES: Record<
  Exclude<PatternId, "generic">,
  Record<LegibilityState, { en: string[]; zh: string[] }>
> = {
  pressure_to_get_it_right: {
    light: {
      en: [
        "The pressure to get it right may still be present here.",
        "This still seems close to that familiar pressure around doing it correctly.",
      ],
      zh: [
        "那种想把事情做对的压力，可能还在这里。",
        "这似乎仍然很接近那种熟悉的“想把它做对”的压力。",
      ],
    },
    clear: {
      en: [
        "This still feels connected to that recurring pressure around doing it the right way.",
        "A familiar pressure to get it right still seems to be active here.",
      ],
      zh: [
        "这似乎仍然和那种反复出现的“需要把它做对”的压力连在一起。",
        "一种熟悉的“想把事情做对”的压力似乎还在这里。",
      ],
    },
  },
  fear_of_not_enough: {
    light: {
      en: [
        "This still seems close to that familiar sense of not being enough.",
        "The pressure around \"not enough\" may still be present here.",
      ],
      zh: [
        "这似乎仍然和那种“自己不够”的熟悉感觉很接近。",
        "那种围绕着“不够”的压力，可能还在这里。",
      ],
    },
    clear: {
      en: [
        "This still feels connected to that recurring tension around whether you are enough.",
        "A familiar \"not enough\" pressure still seems to be active here.",
      ],
      zh: [
        "这似乎仍然和那种反复出现的“我够不够”的张力连在一起。",
        "一种熟悉的“不够”的压力似乎还在这里。",
      ],
    },
  },
  over_efforting: {
    light: {
      en: [
        "The push to keep trying harder may still be active here.",
        "This still feels close to that familiar pressure to push through.",
      ],
      zh: [
        "那种继续逼自己更用力的推动感，可能还在这里。",
        "这似乎仍然很接近那种熟悉的“继续硬撑过去”的压力。",
      ],
    },
    clear: {
      en: [
        "This still feels connected to that recurring pressure to keep pushing harder.",
        "A familiar push to keep forcing things still seems to be present here.",
      ],
      zh: [
        "这似乎仍然和那种反复出现的“继续更用力一点”的压力连在一起。",
        "一种熟悉的、想继续硬推的力量似乎还在这里。",
      ],
    },
  },
  avoidance_under_uncertainty: {
    light: {
      en: [
        "This still seems close to that familiar hesitation around uncertainty.",
        "The uncertainty here may still be pulling toward the same pattern.",
      ],
      zh: [
        "这似乎仍然和面对不确定时的熟悉迟疑很接近。",
        "这里的不确定感，可能仍然把它带向同一种模式。",
      ],
    },
    clear: {
      en: [
        "This still feels connected to that recurring pull to hold back when things are unclear.",
        "A familiar hesitation around uncertainty still seems to be active here.",
      ],
      zh: [
        "这似乎仍然和那种反复出现的“当事情不清楚时想退回去”的拉力连在一起。",
        "一种面对不确定时的熟悉迟疑似乎还在这里。",
      ],
    },
  },
  inner_conflict: {
    light: {
      en: [
        "A similar inner pull still seems to be present here.",
        "This still feels close to that familiar inner split.",
      ],
      zh: [
        "一种相似的内在拉扯似乎还在这里。",
        "这似乎仍然很接近那种熟悉的内在分裂感。",
      ],
    },
    clear: {
      en: [
        "This still feels connected to that recurring split between different pulls.",
        "A familiar inner conflict still seems to be active here.",
      ],
      zh: [
        "这似乎仍然和那种反复出现的“两股力量之间的拉扯”连在一起。",
        "一种熟悉的内在冲突似乎还在这里。",
      ],
    },
  },
  self_worth_pressure: {
    light: {
      en: [
        "The pressure to prove your worth may still be present here.",
        "This still feels close to that familiar self-worth pressure.",
      ],
      zh: [
        "那种需要证明自己价值的压力，可能还在这里。",
        "这似乎仍然很接近那种熟悉的自我价值压力。",
      ],
    },
    clear: {
      en: [
        "This still feels connected to that recurring pressure to prove your value.",
        "A familiar self-worth pressure still seems to be active here.",
      ],
      zh: [
        "这似乎仍然和那种反复出现的“需要证明自己价值”的压力连在一起。",
        "一种熟悉的自我价值压力似乎还在这里。",
      ],
    },
  },
};

function e3CueTextFromTemplate(
  patternId: PatternId,
  legibilityState: LegibilityState,
  seed: string
): { en: string; zh: string } {
  if (patternId === "generic") {
    const enVariants = E3_GENERIC_TEMPLATES[legibilityState].en;
    const zhVariants = E3_GENERIC_TEMPLATES[legibilityState].zh;
    const idx = stableHashInt(seed) % enVariants.length;
    return {
      en: enVariants[idx] ?? enVariants[0],
      zh: zhVariants[idx] ?? zhVariants[0],
    };
  }

  const t = E3_PATTERN_TEMPLATES[patternId];
  const enVariants = t[legibilityState].en;
  const zhVariants = t[legibilityState].zh;
  const idx = stableHashInt(seed) % enVariants.length;
  return {
    en: enVariants[idx] ?? enVariants[0],
    zh: zhVariants[idx] ?? zhVariants[0],
  };
}

function rewriteEarnedValueAfterEffort(corePattern: string): string {
  const normalized = corePattern.trim().replace(/\s+/g, " ");

  const m = normalized.match(
    /^Even after (.*?), the user tends to interpret their (worth|value) as still needing to be earned[.]?$/i
  );
  if (m) {
    const afterPart = lowerFirst(m[1]);
    return sentence(
      `Even after ${afterPart}, it can still feel like your value has to be earned again.`
    );
  }

  return "Doing a lot can still leave the feeling that it is not enough yet.";
}

function fallbackContinuityReminder(corePattern: string): string {
  const text = corePattern.trim();

  const cleaned = text
    .replace(/\bthe user\b/gi, "you")
    .replace(/\btends to\b/gi, "can often")
    .trim();

  if (
    /you can often interpret|you can often assume|interpret their|value as/i.test(
      cleaned
    )
  ) {
    return sentence(
      "This pattern can come back quickly, especially when things feel uncertain."
    );
  }

  return sentence(cleaned);
}

function continuityReminderFromFamily(
  family: ContinuityPatternFamily,
  corePattern: string
): string {
  switch (family) {
    case "earned_value_after_effort":
      return rewriteEarnedValueAfterEffort(corePattern);

    case "delayed_reply_means_i_did_something_wrong":
      return "A delayed reply can quickly start to feel like proof you did something wrong.";

    case "rest_must_be_earned":
      return "Rest can quickly start to feel like something you still have to earn.";

    case "constant_pressure_keep_up":
      return "It can start to feel like you are only allowed to relax when you are keeping up.";

    case "replay_for_mistakes":
      return "Unclear moments can quickly turn into checking for what you might have done wrong.";

    case "fallback_generic":
    default:
      return fallbackContinuityReminder(corePattern);
  }
}

function toContinuityReminderText(corePattern: string): string {
  const family = detectContinuityPatternFamily(corePattern);
  return continuityReminderFromFamily(family, corePattern);
}

function normalizeInsightSimilarityText(input: string): string {
  return input
    .toLowerCase()
    .replace(/[\s\r\n\t]+/g, " ")
    .replace(/[.,!?;:'"()[\]{}\-_/\\|`~@#$%^&*+=<>]+/g, " ")
    .trim();
}

function isLastInsightTooSimilarToMainReflection(
  lastInsight: string,
  mainReflection: string
): boolean {
  const a = normalizeInsightSimilarityText(lastInsight);
  const b = normalizeInsightSimilarityText(mainReflection);
  if (!a || !b) return false;
  if (a.length >= 16 && b.includes(a)) return true;
  if (b.length >= 16 && a.includes(b)) return true;

  const aWords = new Set(a.split(" ").filter((w) => w.length >= 3));
  const bWords = new Set(b.split(" ").filter((w) => w.length >= 3));
  if (aWords.size >= 3 && bWords.size >= 3) {
    let overlap = 0;
    for (const w of aWords) {
      if (bWords.has(w)) overlap += 1;
    }
    const minSize = Math.min(aWords.size, bWords.size);
    if (minSize > 0 && overlap / minSize >= 0.72) return true;
  }

  return false;
}

function computeSecondaryOverlapScore(a: string, b: string): number {
  const na = normalizeInsightSimilarityText(a);
  const nb = normalizeInsightSimilarityText(b);
  if (!na || !nb) return 0;

  // Hard de-dup: if the normalized secondary string appears inside main reflection,
  // treat as full overlap regardless of how much other main reflection text exists.
  if (na.length >= 8 && nb.includes(na)) return 1;

  const aHasCjk = /[\u4e00-\u9fff]/.test(na);
  const bHasCjk = /[\u4e00-\u9fff]/.test(nb);
  const aTokens = aHasCjk ? na.replace(/\s+/g, "").split("") : na.split(" ").filter((w) => w.length >= 3);
  const bTokens = bHasCjk ? nb.replace(/\s+/g, "").split("") : nb.split(" ").filter((w) => w.length >= 3);
  const A = new Set(aTokens);
  const B = new Set(bTokens);
  if (A.size === 0 || B.size === 0) return 0;

  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  const union = A.size + B.size - inter;
  if (union <= 0) return 0;
  return inter / union;
}

const REJECTED_SPACE_PHRASE_RULES: Array<{ re: RegExp; replacement: string }> = [
  // Chinese: forbidden grounding phrase family
  { re: /一点空间/g, replacement: "有一瞬没有跟上" },
  { re: /留一点空间/g, replacement: "不要马上跳进去" },
  { re: /有空间了/g, replacement: "没有那么快被带走" },
  { re: /还留着一点空间/g, replacement: "中间好像停了一下" },
  { re: /多一点点空间/g, replacement: "好像没那么紧了" },

  // English: forbidden continuity softening phrases
  { re: /a little more space/gi, replacement: "a little less tight" },
  { re: /some space around this/gi, replacement: "a softer gap around this" },
];

function sanitizeRejectedSpacePhrases(text: string): { text: string; hit: boolean } {
  let out = text;
  let hit = false;
  for (const rule of REJECTED_SPACE_PHRASE_RULES) {
    if (rule.re.test(out)) hit = true;
    // Reset lastIndex because RegExp may be global.
    rule.re.lastIndex = 0;
    out = out.replace(rule.re, rule.replacement);
  }
  return { text: out, hit };
}

type ThreadState = "same_thread" | "new_thread" | "borderline";

type ThreadStructure = {
  emotion_signal: string | null;
  interpretation_pattern: string | null;
  tension_direction: string | null;
  intensity: "low" | "medium" | "high";
};

function labelTokens(label: string | null): string[] {
  const t = (label ?? "").toLowerCase().trim();
  if (!t) return [];
  const normalized = t.replace(/[^a-z0-9_]+/g, "_").replace(/_+/g, "_");
  return normalized
    .split("_")
    .map((x) => x.trim())
    .filter((x) => x.length >= 3);
}

function tokenJaccard(a: string | null, b: string | null): number {
  const A = new Set(labelTokens(a));
  const B = new Set(labelTokens(b));
  if (A.size === 0 || B.size === 0) return 0;
  if (a && b && a.trim().toLowerCase() === b.trim().toLowerCase()) return 1;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter += 1;
  const union = A.size + B.size - inter;
  if (union <= 0) return 0;
  return inter / union;
}

function extractThreadStructureFromReflectionState(
  reflection: ExtractedReflectionState | null
): ThreadStructure | null {
  if (!reflection) return null;
  const emotion = reflection.emotion_label?.trim() || null;
  const interpretation = reflection.interpretation_label?.trim() || null;
  const tension = `${reflection.regulation_label ?? ""}_${reflection.choice_label ?? ""}`.trim() || null;

  const intensity: ThreadStructure["intensity"] =
    emotion && /(anxiety|overwhelm|frustration|shame|anger|panic)/i.test(emotion)
      ? "high"
      : emotion && /(sad|uncertain|doubt|uncertainty|worry)/i.test(emotion)
        ? "medium"
        : "low";

  return {
    emotion_signal: emotion,
    interpretation_pattern: interpretation,
    tension_direction: tension,
    intensity,
  };
}

function decideThreadState(
  current: ThreadStructure | null,
  previous: ThreadStructure | null
): {
  state: ThreadState;
  emotionSimilarity: number;
  interpretationSimilarity: number;
  tensionSimilarity: number;
  weightedScore: number;
} {
  if (!current || !previous) {
    return {
      state: "borderline",
      emotionSimilarity: 0,
      interpretationSimilarity: 0,
      tensionSimilarity: 0,
      weightedScore: 0,
    };
  }

  const emotionSimilarity = tokenJaccard(current.emotion_signal, previous.emotion_signal);
  const interpretationSimilarity = tokenJaccard(
    current.interpretation_pattern,
    previous.interpretation_pattern
  );
  const tensionSimilarity = tokenJaccard(current.tension_direction, previous.tension_direction);

  const weightedScore =
    interpretationSimilarity * 0.5 +
    emotionSimilarity * 0.3 +
    tensionSimilarity * 0.2;

  if (weightedScore >= 0.68) {
    return {
      state: "same_thread",
      emotionSimilarity,
      interpretationSimilarity,
      tensionSimilarity,
      weightedScore,
    };
  }
  if (weightedScore <= 0.42) {
    return {
      state: "new_thread",
      emotionSimilarity,
      interpretationSimilarity,
      tensionSimilarity,
      weightedScore,
    };
  }

  return {
    state: "borderline",
    emotionSimilarity,
    interpretationSimilarity,
    tensionSimilarity,
    weightedScore,
  };
}

function mapContinuityFamilyToPatternId(
  family: ContinuityPatternFamily
): PatternId {
  switch (family) {
    case "constant_pressure_keep_up":
      return "pressure_to_get_it_right";
    case "replay_for_mistakes":
      return "avoidance_under_uncertainty";
    case "delayed_reply_means_i_did_something_wrong":
      return "inner_conflict";
    case "earned_value_after_effort":
      return "fear_of_not_enough";
    case "rest_must_be_earned":
      return "self_worth_pressure";
    case "fallback_generic":
    default:
      return "generic";
  }
}

function stableHashInt(input: string): number {
  // Simple deterministic hash for stable template variant selection.
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const GENERIC_TEMPLATES: Record<
  RecurrenceConfidence,
  { en: string[]; zh: string[] }
> = {
  low: {
    en: [
      "Something similar may be showing up again here.",
      "This may be close to something that has come up before.",
      "There may be a familiar thread here.",
      "A similar tension may be present again.",
    ],
    zh: [
      "这里可能又出现了一点相似的东西。",
      "这似乎和之前出现过的某种感受有些接近。",
      "这里可能有一条熟悉的线索。",
      "这里也许又带出了一种相似的张力。",
    ],
  },
  medium: {
    en: [
      "A similar pattern seems to be returning here.",
      "This feels close to something that has appeared before.",
      "There may be a repeating thread here.",
      "A familiar tension seems to be surfacing again.",
    ],
    zh: [
      "这里似乎又出现了一个相似的模式。",
      "这感觉和之前出现过的某种状态很接近。",
      "这里可能有一条正在重复出现的线索。",
      "一种熟悉的张力似乎又浮现出来了。",
    ],
  },
  high: {
    en: [
      "This has come up before in a similar way.",
      "A familiar pattern seems to be resurfacing here.",
      "This looks like a recurring inner pressure.",
      "Something that has shown up before seems to be here again.",
    ],
    zh: [
      "这和之前出现过的情况有些相似。",
      "一个熟悉的模式似乎又浮现出来了。",
      "这看起来像是一种反复出现的内在压力。",
      "某种之前出现过的东西，似乎又回来了。",
    ],
  },
};

const PATTERN_TEMPLATES: Record<
  Exclude<PatternId, "generic">,
  Record<RecurrenceConfidence, { en: string; zh: string }>
> = {
  pressure_to_get_it_right: {
    low: {
      en: "There may be a familiar pressure here around getting it right.\nSomething similar may be showing up here around trying to do this the right way.",
      zh: "这里可能又出现了一种想把事情做对的熟悉压力。\n这里似乎又带出了一点“想把它做好、做对”的感觉。",
    },
    medium: {
      en: "A similar pressure seems to be returning here around getting it right.\nThis feels close to a repeating pattern of needing to get this right.",
      zh: "这里似乎又出现了一种相似的压力，像是想把事情做对。\n这感觉像是在重复出现一种“需要把它做对”的模式。",
    },
    high: {
      en: "This has come up before as a pressure to get it right.\nA familiar pattern seems to be resurfacing here around needing to do this correctly.",
      zh: "这之前也曾以“想把事情做对”的压力出现过。\n一个熟悉的模式似乎又回来了，像是需要把这件事做好、做对。",
    },
  },
  fear_of_not_enough: {
    low: {
      en: "There may be a familiar worry here around not being enough.\nSomething close to “not enough” may be present again here.",
      zh: "这里可能又出现了一种“自己不够”的熟悉担心。\n这里似乎又带出了一点“不够好 / 不够”的感觉。",
    },
    medium: {
      en: "A similar pattern seems to be returning here around not being enough.\nThis feels close to a repeating tension around whether you are enough.",
      zh: "这里似乎又出现了一种“自己不够”的相似模式。\n这感觉像是在重复出现一种关于“我够不够”的张力。",
    },
    high: {
      en: "This has come up before as a pressure around not being enough.\nA familiar pattern seems to be resurfacing here around “not enough.”",
      zh: "这之前也曾以“自己不够”的压力出现过。\n一个熟悉的模式似乎又回来了，围绕着“我是不是不够”。",
    },
  },
  over_efforting: {
    low: {
      en: "There may be a familiar push here to try harder than needed.\nSomething similar may be showing up here around pushing through.",
      zh: "这里可能又出现了一种熟悉的“再更用力一点”的推动感。\n这里似乎又带出了一点想硬撑过去的感觉。",
    },
    medium: {
      en: "A similar pattern seems to be returning here around over-trying.\nThis feels close to a repeating pressure to keep pushing.",
      zh: "这里似乎又出现了一种相似的模式，像是在过度用力。\n这感觉像是在重复出现一种“继续往前硬推”的压力。",
    },
    high: {
      en: "This has come up before as a pattern of pushing too hard.\nA familiar pattern seems to be resurfacing here around over-efforting.",
      zh: "这之前也曾以“过度用力”的模式出现过。\n一个熟悉的模式似乎又回来了，像是在太用力地推动自己。",
    },
  },
  avoidance_under_uncertainty: {
    low: {
      en: "There may be a familiar hesitation here when things feel uncertain.\nSomething similar may be showing up here around uncertainty.",
      zh: "当事情变得不确定时，这里可能又出现了一种熟悉的迟疑。\n这里似乎又带出了一点面对不确定时的相似反应。",
    },
    medium: {
      en: "A similar pattern seems to be returning here around uncertainty and hesitation.\nThis feels close to a repeating tension around not knowing what comes next.",
      zh: "这里似乎又出现了一种和不确定、迟疑有关的相似模式。\n这感觉像是在重复出现一种面对未知时的张力。",
    },
    high: {
      en: "This has come up before as a pattern around uncertainty and pulling back.\nA familiar pattern seems to be resurfacing here when things feel unclear.",
      zh: "这之前也曾以面对不确定时想退回去的模式出现过。\n当事情变得不清楚时，一个熟悉的模式似乎又浮现出来了。",
    },
  },
  inner_conflict: {
    low: {
      en: "There may be a familiar split here between two pulls.\nSomething similar may be showing up here as an inner conflict.",
      zh: "这里可能又出现了一种熟悉的拉扯感。\n这里似乎又带出了一点内在冲突的感觉。",
    },
    medium: {
      en: "A similar inner conflict seems to be returning here.\nThis feels close to a repeating split between two different pulls.",
      zh: "这里似乎又出现了一种相似的内在拉扯。\n这感觉像是在重复出现一种两股力量之间的分裂感。",
    },
    high: {
      en: "This has come up before as a pattern of inner conflict.\nA familiar inner split seems to be resurfacing here.",
      zh: "这之前也曾以内在冲突的模式出现过。\n一种熟悉的内在拉扯似乎又浮现出来了。",
    },
  },
  self_worth_pressure: {
    low: {
      en: "There may be a familiar pressure here around needing to prove your value.\nSomething similar may be showing up here around worth.",
      zh: "这里可能又出现了一种熟悉的压力，像是需要证明自己的价值。\n这里似乎又带出了一点和价值感有关的相似压力。",
    },
    medium: {
      en: "A similar pattern seems to be returning here around needing to prove your worth.\nThis feels close to a repeating pressure around value and self-worth.",
      zh: "这里似乎又出现了一种相似的模式，像是需要证明自己的价值。\n这感觉像是在重复出现一种和价值感、自我价值有关的压力。",
    },
    high: {
      en: "This has come up before as a pressure to prove your worth.\nA familiar self-worth pressure seems to be resurfacing here.",
      zh: "这之前也曾以“需要证明自己价值”的压力出现过。\n一种熟悉的自我价值压力似乎又回来了。",
    },
  },
};

/** Milestone E2 (Wisewave persistence bar): “still present / gentle recognition”, not “returning again”. */
const GENERIC_PERSISTENCE_TEMPLATES: Record<
  RecurrenceConfidence,
  { en: string[]; zh: string[] }
> = {
  low: {
    en: ["This may still be close to something familiar here."],
    zh: ["这里也许仍然和某种熟悉的东西很接近。"],
  },
  medium: {
    en: [
      "This still seems close to a familiar pattern.",
      "A similar thread still seems to be present here.",
      "Something familiar seems to still be active here.",
    ],
    zh: [
      "这似乎仍然和一个熟悉的模式很接近。",
      "这里似乎仍然带着一条相似的线索。",
      "某种熟悉的东西似乎还在这里。",
    ],
  },
  high: {
    en: [
      "A familiar pattern still seems present in what you are describing.",
      "This still feels connected to an earlier repeating pressure.",
    ],
    zh: [
      "你所描述的里面，似乎仍然有一种熟悉的模式在场。",
      "这仍然和之前那种反复出现的压力有连结。",
    ],
  },
};

const PERSISTENCE_PATTERN_TEMPLATES: Record<
  Exclude<PatternId, "generic">,
  Record<RecurrenceConfidence, { en: string; zh: string }>
> = {
  pressure_to_get_it_right: {
    low: {
      en: "Some of that familiar pressure around getting it right may still be here.",
      zh: "那种想把事情做对的熟悉压力，也许还在这里。",
    },
    medium: {
      en: "The pressure to get it right still seems to be active here.",
      zh: "那种想把事情做对的压力，似乎还在这里。",
    },
    high: {
      en: "That familiar pressure to do this correctly still seems to be showing up.",
      zh: "那种想把这件事做对的熟悉压力，似乎还在出现。",
    },
  },
  fear_of_not_enough: {
    low: {
      en: "Something close to “not enough” may still be present here.",
      zh: "这里也许仍然有一点“不够”的感觉。",
    },
    medium: {
      en: "This still seems close to that familiar sense of not being enough.",
      zh: "这似乎仍然和那种“自己不够”的熟悉感觉很接近。",
    },
    high: {
      en: "The “not enough” pressure may still be active in this moment.",
      zh: "那种“不够”的压力，在这一刻似乎还在。",
    },
  },
  over_efforting: {
    low: {
      en: "A familiar push to keep trying harder may still be in the mix.",
      zh: "那种想再更用力一点的熟悉推动感，也许还在。",
    },
    medium: {
      en: "The push to keep trying harder may still be active here.",
      zh: "那种继续逼自己更用力的推动感，似乎还在这里。",
    },
    high: {
      en: "That over-efforting pull still seems close to the surface here.",
      zh: "那种过度用力的拉扯，似乎仍然很接近表面。",
    },
  },
  avoidance_under_uncertainty: {
    low: {
      en: "Some familiar hesitation around uncertainty may still be here.",
      zh: "面对不确定时的那种熟悉迟疑，也许还在这里。",
    },
    medium: {
      en: "This still seems close to that familiar hesitation around uncertainty.",
      zh: "这似乎仍然和面对不确定时的熟悉迟疑很接近。",
    },
    high: {
      en: "Uncertainty here may still be pulling toward that same familiar pattern.",
      zh: "这里的不确定感，也许仍然被带向同一种熟悉的模式。",
    },
  },
  inner_conflict: {
    low: {
      en: "A familiar inner split may still be present here.",
      zh: "那种熟悉的内在分裂感，也许还在这里。",
    },
    medium: {
      en: "A similar inner pull still seems to be present here.",
      zh: "一种相似的内在拉扯似乎还在这里。",
    },
    high: {
      en: "That familiar inner conflict still seems close to what you are describing.",
      zh: "那种熟悉的内在冲突，似乎仍然很接近你所说的。",
    },
  },
  self_worth_pressure: {
    low: {
      en: "Some familiar pressure around worth may still be active here.",
      zh: "和价值感有关的那种熟悉压力，也许还在这里。",
    },
    medium: {
      en: "The pressure to prove your worth may still be present here.",
      zh: "那种需要证明自己价值的压力，似乎还在这里。",
    },
    high: {
      en: "That familiar self-worth pressure still seems to be showing up.",
      zh: "那种熟悉的自我价值压力，似乎还在出现。",
    },
  },
};

type RecurrenceCuePhase = "recurrence" | "persistence";

function recurrenceCueTextFromTemplate(
  patternId: PatternId,
  confidence: RecurrenceConfidence,
  seed: string,
  phase: RecurrenceCuePhase
): { en: string; zh: string } {
  if (phase === "persistence") {
    if (patternId === "generic") {
      const enVariants = GENERIC_PERSISTENCE_TEMPLATES[confidence].en;
      const zhVariants = GENERIC_PERSISTENCE_TEMPLATES[confidence].zh;
      const idx = stableHashInt(seed + ":p") % Math.min(enVariants.length, zhVariants.length);
      return { en: enVariants[idx] ?? enVariants[0], zh: zhVariants[idx] ?? zhVariants[0] };
    }
    const t = PERSISTENCE_PATTERN_TEMPLATES[patternId];
    return t[confidence];
  }

  if (patternId === "generic") {
    const enVariants = GENERIC_TEMPLATES[confidence].en;
    const zhVariants = GENERIC_TEMPLATES[confidence].zh;
    const idx = stableHashInt(seed) % Math.min(enVariants.length, zhVariants.length);
    return { en: enVariants[idx] ?? enVariants[0], zh: zhVariants[idx] ?? zhVariants[0] };
  }

  const t = PATTERN_TEMPLATES[patternId];
  return t[confidence];
}

function sanitizeChineseOutputLeaks(text: string): string {
  // Narrow, explicit cleanup for common mixed-language leak words in ZH mode.
  // Keep this list conservative to avoid over-rewriting intended user content.
  const replacements: Array<[RegExp, string]> = [
    [/\bobeying\b/gi, "遵循"],
    [/\bobey\b/gi, "遵循"],
    [/\bobet\b/gi, "遵循"],
    [/\btrigger(?:_label)?\b/gi, "触发点"],
    [/\bemotion(?:_label)?\b/gi, "情绪"],
    [/\binterpretation(?:_label)?\b/gi, "解读"],
    [/\bregulation(?:_label)?\b/gi, "调节"],
    [/\bchoice(?:_label)?\b/gi, "下一步"],
    [/\binsight(?:_candidate)?\b/gi, "洞见"],
    [/\bpattern\b/gi, "模式"],
    [/\bloop\b/gi, "循环"],
    [/\bpressure\b/gi, "压力"],
    [/\brule\b/gi, "规则"],
  ];

  let cleaned = text;
  for (const [regex, value] of replacements) {
    cleaned = cleaned.replace(regex, value);
  }

  return cleaned
    .replace(/\b(?:Event|Feeling|Interpretation|Regulation|Next step|Insight)\s*:\s*/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function hasCjkContent(text: string): boolean {
  return /[\u4E00-\u9FFF]/.test(text);
}

function tryRepairMojibakeToUtf8(text: string): string | null {
  try {
    const repaired = Buffer.from(text, "latin1").toString("utf8");
    if (!repaired || repaired === text) return null;
    return repaired;
  } catch {
    return null;
  }
}

function normalizeIncomingUserMessage(text: string): {
  text: string;
  rawHasCjk: boolean;
  repairedApplied: boolean;
  repairedHasCjk: boolean;
  suspectedMojibake: boolean;
} {
  const nfc = text.normalize("NFC");
  const rawHasCjk = hasCjkContent(nfc);

  // Common UTF-8->latin1 mojibake signatures seen when transport/client encoding drifts.
  const suspectedMojibake = /Ã.|Â.|æ.|ä.|å.|ç.|é.|è.|ê.|ï.|ð./.test(nfc);

  if (rawHasCjk) {
    return {
      text: nfc,
      rawHasCjk,
      repairedApplied: false,
      repairedHasCjk: rawHasCjk,
      suspectedMojibake,
    };
  }

  const repaired = tryRepairMojibakeToUtf8(nfc);
  if (repaired && hasCjkContent(repaired)) {
    return {
      text: repaired,
      rawHasCjk,
      repairedApplied: true,
      repairedHasCjk: true,
      suspectedMojibake: true,
    };
  }

  return {
    text: nfc,
    rawHasCjk,
    repairedApplied: false,
    repairedHasCjk: false,
    suspectedMojibake,
  };
}

function summarizeIngressText(text: string): {
  length: number;
  utf8ByteLength: number;
  latin1ByteLength: number;
  preview: string;
  codepointHead: string[];
} {
  const clean = text ?? "";
  const preview = clean.slice(0, 80);
  const head = Array.from(preview)
    .slice(0, 12)
    .map((ch) => `U+${ch.codePointAt(0)!.toString(16).toUpperCase()}`);
  return {
    length: clean.length,
    utf8ByteLength: Buffer.byteLength(clean, "utf8"),
    latin1ByteLength: Buffer.byteLength(clean, "latin1"),
    preview,
    codepointHead: head,
  };
}

async function rewriteAssistantToChinese(params: {
  apiKey: string;
  model: string;
  sourceText: string;
}): Promise<string | null> {
  const { apiKey, model, sourceText } = params;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_completion_tokens: 512,
      messages: [
        {
          role: "system",
          content:
            "Rewrite the assistant text into natural Chinese only. Keep meaning and tone. " +
            "Do not add advice, do not add new interpretation, do not use English words.",
        },
        {
          role: "user",
          content: sourceText,
        },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const out = data.choices?.[0]?.message?.content?.trim();
  if (!out) return null;
  return normalizeModelTextForStorage(out);
}

async function refreshConversationSummary(
  conversationId: string,
  apiKey: string,
  model: string
): Promise<void> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { conversationSummary: true },
  });
  const allMessages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
  const recent = allMessages.slice(-10);
  if (recent.length === 0) return;

  const previousSummary = conversation?.conversationSummary?.trim() ?? "(none)";
  const recentText = recent
    .map((m) => `${m.role}: ${m.message}`)
    .join("\n\n");

  const userContent = `Existing summary:\n${previousSummary}\n\nRecent conversation:\n${recentText}\n\nUpdate the conversation summary.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      max_completion_tokens: 256,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.warn("[chat/turn] Summary refresh failed", res.status, err);
    return;
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const summary = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!summary) return;

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      conversationSummary: summary,
      summaryUpdatedAt: new Date(),
    },
  });
}

/**
 * Option B turn API: receive user message → save → call OpenAI for reply → save assistant → return.
 * To match the Wisewave (ChatKit workflow) chatbot: set OPENAI_CHAT_SYSTEM_PROMPT to the same
 * instructions as in Agent Builder, and OPENAI_CHAT_MODEL to the workflow model if known.
 *
 * POST body: {
 *   session_id,
 *   message,
 *   metadata?,
 *   insight_tags?,
 *   feedback?    // optional: feedback about a prior suggested action/outcome
 * }
 * Response: {
 *   assistant_message,
 *   reflection_state?,
 *   debug_*?,
 *   feedback_saved?: boolean
 * }
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;
  if (bearerToken) {
    const verifiedUserId = verifyUserToken(bearerToken);
    if (!verifiedUserId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const access = await checkUserSubscriptionAccess(verifiedUserId);
    if (!access.hasAccess) {
      return NextResponse.json(
        {
          error: "Subscription required",
          code: "subscription_required",
          effective_status: access.effectiveStatus,
        },
        { status: 402 }
      );
    }
  }

  const { userId, sessionCookie } = await resolveChatUserId(request);
  let body: {
    session_id?: string;
    conversation_id?: string;
    message?: string;
    lang?: "en" | "zh";
    debug?: boolean;
    client_context?: {
      last_insight_seen?: boolean;
    };
    metadata?: unknown;
    insight_tags?: unknown;
    feedback?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const sessionId = body.session_id ?? body.conversation_id;
  const rawMessage = body.message;

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid session_id/conversation_id" },
      { status: 400 }
    );
  }
  if (rawMessage === undefined || typeof rawMessage !== "string" || !rawMessage.trim()) {
    return NextResponse.json(
      { error: "Missing or invalid message" },
      { status: 400 }
    );
  }
  const inputNorm = normalizeIncomingUserMessage(rawMessage);
  const message = inputNorm.text;
  const rawIngressSummary =
    typeof rawMessage === "string" ? summarizeIngressText(rawMessage) : summarizeIngressText("");
  const normalizedIngressSummary = summarizeIngressText(message);

  const conversation = await prisma.conversation.findFirst({
    where: { id: sessionId, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found or access denied" },
      { status: 404 }
    );
  }

  const metadata =
    body.metadata !== undefined && body.metadata !== null
      ? (body.metadata as object)
      : undefined;
  const insightTags =
    body.insight_tags !== undefined && body.insight_tags !== null
      ? (body.insight_tags as object)
      : undefined;
  const rawFeedback =
    body.feedback !== undefined && body.feedback !== null
      ? (body.feedback as unknown)
      : undefined;

  // V1 persistence order: save user message before any AI processing so a failed model call never loses the user's reflection.
  let userMsg;
  try {
    userMsg = await prisma.message.create({
      data: {
        conversationId: sessionId,
        userId,
        role: "user",
        message: message.trim(),
        metadata: metadata ?? undefined,
        insightTags: insightTags ?? undefined,
      },
    });
    console.debug("[ticket7][chat/turn] message_save", {
      sessionId,
      userMessageId: userMsg.id,
      assistantMessageId: null,
      phase: "user",
      success: true,
    });
  } catch (e) {
    console.error("[chat/turn] user message save failed", e);
    console.debug("[ticket7][chat/turn] message_save", {
      sessionId,
      userMessageId: null,
      assistantMessageId: null,
      phase: "user",
      success: false,
      errorType:
        e instanceof Error
          ? e.name
          : typeof e === "object" && e !== null
          ? "object"
          : "unknown",
    });
    return NextResponse.json(
      { error: "Failed to save user message" },
      { status: 500 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 }
    );
  }
  const model = process.env.OPENAI_CHAT_MODEL?.trim() || DEFAULT_CHAT_MODEL;

  // V1 Ticket 2: extraction pipeline — structured reflection state for this message. Failure is non-blocking; we log and continue.
  let reflectionState: {
    trigger_label: string;
    emotion_label: string;
    interpretation_label: string;
    regulation_label: string;
    choice_label: string;
    insight_candidate: string;
  } | null = null;
  const extracted = await extractReflectionState(
    message.trim(),
    apiKey,
    model,
    conversation.conversationSummary
  );
  if (extracted) {
    reflectionState = extracted;
    try {
      await prisma.reflectionRun.create({
        data: {
          conversationId: sessionId,
          messageId: userMsg.id,
          triggerLabel: extracted.trigger_label,
          emotionLabel: extracted.emotion_label,
          interpretationLabel: extracted.interpretation_label,
          regulationLabel: extracted.regulation_label,
          choiceLabel: extracted.choice_label,
          insightCandidate: extracted.insight_candidate || null,
        },
      });
    } catch (e) {
      console.warn("[chat/turn] ReflectionRun save failed", e);
    }
  }
  // Ticket 7: lightweight, structured log for extraction outcome.
  console.debug("[ticket7][chat/turn] extraction", {
    sessionId,
    userMessageId: userMsg.id,
    hasReflectionState: !!reflectionState,
  });

  // 2. Get message count and optionally refresh conversation summary (every SUMMARY_TRIGGER_EVERY messages)
  const allMessages = await prisma.message.findMany({
    where: { conversationId: sessionId },
    orderBy: { createdAt: "asc" },
  });
  const messageCount = allMessages.length;

  if (
    messageCount >= SUMMARY_TRIGGER_EVERY &&
    messageCount % SUMMARY_TRIGGER_EVERY === 0
  ) {
    await refreshConversationSummary(sessionId, apiKey, model);
  }

  // 3. Reload conversation (to get latest summary) and take recent messages for context
  const conversationUpdated = await prisma.conversation.findFirst({
    where: { id: sessionId, userId },
    select: { conversationSummary: true },
  });

  // Minimal bilingual baseline: detect input language and instruct the model output language.
  // Canonical continuity meaning remains language-neutral (extraction returns English corePattern).
  const wantsChinese = hasCjkContent(message);
  const languageInstruction = wantsChinese
    ? "\n\nLanguage rule: Respond in Chinese only. Do not include English words."
    : "\n\nLanguage rule: Respond in English only. Do not include Chinese characters.";
  /** Milestone G: whether integration appendix was appended to the system message (QA). */
  let debugMilestoneGSystemAppendixApplied = false;
  /** Milestone H Wisewave Light Mode v2: whether main-reflection appendix was appended (QA / Lumen Pass 5). */
  let debugMilestoneHLightModeAppendixApplied = false;
  const recent = allMessages.slice(-RECENT_MESSAGES_COUNT);
  const openaiMessages: { role: "user" | "assistant" | "system"; content: string }[] = recent.map(
    (m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.message,
    })
  );

  // Use Wisewave reflection-style prompt by default; override with OPENAI_CHAT_SYSTEM_PROMPT or OPENAI_CHAT_SYSTEM_PROMPT_FILE
  let systemPrompt = process.env.OPENAI_CHAT_SYSTEM_PROMPT?.trim();
  if (!systemPrompt && process.env.OPENAI_CHAT_SYSTEM_PROMPT_FILE?.trim()) {
    try {
      const path = join(process.cwd(), process.env.OPENAI_CHAT_SYSTEM_PROMPT_FILE.trim());
      systemPrompt = readFileSync(path, "utf-8").trim();
    } catch (e) {
      console.warn("[chat/turn] Could not read OPENAI_CHAT_SYSTEM_PROMPT_FILE", e);
    }
  }
  if (!systemPrompt) {
    systemPrompt = WISEWAVE_CHAT_PROMPT;
  }
  const openaiMessagesForApi: { role: "user" | "assistant" | "system"; content: string }[] = [];
  if (systemPrompt) {
    const continuationHint =
      openaiMessages.length > 0
        ? "\n\nThe following messages are part of an ongoing conversation. Continue naturally and build on what has already been discussed."
        : "";
    const summaryBlock =
      conversationUpdated?.conversationSummary?.trim()
        ? `\n\nConversation summary:\n${conversationUpdated.conversationSummary.trim()}`
        : "";
    const reflectionBlock =
      reflectionState && reflectionState.insight_candidate.trim()
        ? `\n\nLatest reflection state (for this user message):\n- trigger_label: ${reflectionState.trigger_label}\n- emotion_label: ${reflectionState.emotion_label}\n- interpretation_label: ${reflectionState.interpretation_label}\n- regulation_label: ${reflectionState.regulation_label}\n- choice_label: ${reflectionState.choice_label}\n- insight_candidate: ${reflectionState.insight_candidate}`
        : "";
    const milestoneGAppendix = milestoneGSystemAppendix();
    debugMilestoneGSystemAppendixApplied = milestoneGAppendix.length > 0;
    const milestoneHLightAppendix = milestoneHLightModeSystemAppendix();
    debugMilestoneHLightModeAppendixApplied = milestoneHLightAppendix.length > 0;
    openaiMessagesForApi.push({
      role: "system",
      content:
        systemPrompt +
        continuationHint +
        summaryBlock +
        reflectionBlock +
        milestoneGAppendix +
        milestoneHLightAppendix +
        languageInstruction,
    });
  }
  openaiMessagesForApi.push(...openaiMessages);

  let assistantContent: string;
  let debugZhRewriteAttempted = false;
  let debugZhRewriteApplied = false;
  let debugZhHasCjkBeforeRewrite: boolean | null = null;
  let debugZhHasCjkAfterRewrite: boolean | null = null;
  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: openaiMessagesForApi,
        max_completion_tokens: 2048,
      }),
    });

    if (!completion.ok) {
      const err = await completion.json().catch(() => ({}));
      console.error("[chat/turn] OpenAI error", completion.status, err);
      console.debug("[ticket7][chat/turn] generation_error", {
        sessionId,
        userMessageId: userMsg.id,
        status: completion.status,
      });
      return NextResponse.json(
        {
          assistant_message:
            "I had trouble generating a response just now. You can try sending that again or rephrasing it a bit.",
        },
        { status: 200 }
      );
    }

    const data = (await completion.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    assistantContent =
      data.choices?.[0]?.message?.content?.trim() ?? "";
    if (assistantContent) {
      assistantContent = normalizeModelTextForStorage(assistantContent);
    }
    if (wantsChinese && assistantContent) {
      assistantContent = sanitizeChineseOutputLeaks(assistantContent);
      debugZhHasCjkBeforeRewrite = hasCjkContent(assistantContent);
      // Narrow regression guard: if hosted returns English-only text for ZH turns,
      // rewrite once into Chinese without changing meaning.
      if (!hasCjkContent(assistantContent)) {
        debugZhRewriteAttempted = true;
        const rewrittenZh = await rewriteAssistantToChinese({
          apiKey,
          model,
          sourceText: assistantContent,
        }).catch(() => null);
        if (rewrittenZh && hasCjkContent(rewrittenZh)) {
          assistantContent = sanitizeChineseOutputLeaks(rewrittenZh);
          debugZhRewriteApplied = true;
        }
      }
      debugZhHasCjkAfterRewrite = hasCjkContent(assistantContent);
    }
  } catch (e) {
    console.error("[chat/turn] OpenAI request failed", e);
    console.debug("[ticket7][chat/turn] generation_error", {
      sessionId,
      userMessageId: userMsg.id,
      networkFailure: true,
    });
    return NextResponse.json(
      {
        assistant_message:
          "I had trouble generating a response just now. You can try sending that again or rephrasing it a bit.",
      },
      { status: 200 }
    );
  }

  // V1: persist assistant message after successful generation.
  let assistantMsgId: string | null = null;
  try {
    const assistantMsg = await prisma.message.create({
      data: {
        conversationId: sessionId,
        userId,
        role: "assistant",
        message: assistantContent,
      },
    });
    assistantMsgId = assistantMsg.id;
    console.debug("[ticket7][chat/turn] message_save", {
      sessionId,
      userMessageId: userMsg.id,
      assistantMessageId: assistantMsgId,
      phase: "assistant",
      success: true,
    });
  } catch (e) {
    console.error("[chat/turn] assistant message save failed", e);
    console.debug("[ticket7][chat/turn] message_save", {
      sessionId,
      userMessageId: userMsg.id,
      assistantMessageId: null,
      phase: "assistant",
      success: false,
      errorType:
        e instanceof Error
          ? e.name
          : typeof e === "object" && e !== null
          ? "object"
          : "unknown",
    });
    // Assistant save failure should not break the user-facing reply.
  }

  // --- Debug / QA: track per-turn insight save + full eligibility decision chain ---
  let debugInsightId: string | null = null;
  let debugIsContinuityEligible: boolean | null = null;
  let debugInsightCorePattern: string | null = null;
  let debugHasStrongPatternCue: boolean | null = null;
  let debugIsFlatRestatement: boolean | null = null;
  let debugIsVagueSource: boolean | null = null;
  let debugAllLabelsWeak: boolean | null = null;
  let debugIsSystemy: boolean | null = null;
  let debugIsVeryShort: boolean | null = null;
  let debugIsTooShortAndFlat: boolean | null = null;
  let debugIsTooGeneric: boolean | null = null;
  let feedbackSaved: boolean = false;
  let previousTurnLastInsightText: string | null = null;
  let debugLastInsightSource: "previous_turn" | "none" | "invalid_current_turn" = "none";
  let debugLastInsightSuppressedReason: string | null = null;
  let threadState: ThreadState = "borderline";
  let debugEmotionSimilarity = 0;
  let debugInterpretationSimilarity = 0;
  let debugTensionSimilarity = 0;
  let debugWeightedThreadScore = 0;
  let debugSoftContinuitySuppressedReason: string | null = null;
  let debugOverlapWithMainReflection = false;
  // Secondary-layer collision / rejected-phrase debug (temporary, Lumen verification).
  let debugMainReflectionTemplateId: string | null = null;
  let debugSecondaryLayerType: "soft_continuity" | "last_insight" | "none" = "none";
  let debugSecondaryTemplateId: string | null = null;
  let debugSecondarySource: "soft_continuity" | "last_insight" | "none" = "none";
  let debugSecondarySourceValid = false;
  let debugSecondaryOverlapScore = 0;
  let debugSecondarySuppressedReason: string | null = null;
  let debugRejectedPhraseHit = false;
  let responseContinuityInsight:
    | {
        id: string;
        corePattern: string;
        continuityText: string;
        createdAt: Date;
        isContinuityEligible: boolean;
        continuityKey: string;
      }
    | null = null;
  let responseRecurrenceCue:
    | {
        patternKey: PatternId;
        confidence: RecurrenceConfidence;
        confidenceScore: number;
        textEn: string;
        textZh: string;
        phase: RecurrenceCuePhase;
      }
    | null = null;

  // Milestone E debug (for recurrence escalation debugging and Lumen Pass 2).
  let debugRecurrencePatternFamily: ContinuityPatternFamily | null = null;
  let debugRecurrencePatternId: PatternId | null = null;
  let debugRecurrenceSameFamilyCount: number | null = null; // matches prior insights only (excludes current)
  let debugRecurrenceAlignedInstanceCount: number | null = null; // includes current insight
  let debugRecurrenceConfidenceRaw: RecurrenceConfidence | null = null;
  let debugRecurrenceConfidenceResolved: RecurrenceConfidence | null = null;
  let debugRecurrenceNewestAlignedIndex: number | null = null;
  let debugRecurrenceCueEmitted: boolean = false;
  // Milestone E2 debug (persistence boundary / decay / anti-repetition).
  let debugRecurrenceE2Phase: RecurrenceCuePhase | null = null;
  let debugRecurrenceE2SuppressedStaleWindow: boolean = false;
  let debugRecurrenceE2SuppressedRepeat: boolean = false;
  let debugRecurrenceE2NewestAlignedAgeMs: number | null = null;
  /** True when count would allow persistence but copy stays on recurrence (relevance / repetition risk). */
  let debugRecurrenceE2PersistenceDowngraded: boolean = false;
  /** True when visible pattern identity differs from previous assistant metadata (replace, not accumulate). */
  let debugRecurrenceE2ActivePatternReplaced: boolean = false;

  // Milestone E3 debug: legibility-state gating (light vs clear) for recurrence_cue only.
  let debugRecurrenceE3LegibilityState: LegibilityState | null = null;
  let debugRecurrenceE3PresentRelevance: number | null = null;
  let debugRecurrenceE3ClarityGain: number | null = null;
  let debugRecurrenceE3AddedWeightRisk: number | null = null;
  let debugRecurrenceE3ProofThresholdPassed: boolean | null = null;
  let debugRecurrenceE3SuppressedReason:
    | null
    | "low_present_relevance"
    | "low_clarity_gain"
    | "added_weight_too_high" = null;

  // Milestone F: optional embodiment cue (tertiary; only when recurrence_cue is emitted).
  let responseEmbodimentCue: {
    patternKey: PatternId;
    responseState: LegibilityState;
    textEn: string;
    textZh: string;
  } | null = null;
  let debugEmbodimentFSuppressedReason: string | null = null;
  let debugEmbodimentFResponseState: LegibilityState | null = null;
  let debugEmbodimentFUsedUltraShort: boolean | null = null;
  /** QA: proves this deploy includes Milestone F turn instrumentation. */
  const debugEmbodimentFBuildMarker = "milestone_f_v1";
  let debugEmbodimentFOutcome:
    | "skipped_no_recurrence"
    | "skipped_milestone_disabled"
    | "skipped_no_e3_legibility"
    | "emitted" = "skipped_no_recurrence";
  let debugEmbodimentFMilestoneEnabled = process.env.MILESTONE_F_EMBODIMENT !== "0";

  // Milestone H: optional single-line micro awareness (after E/F; suppressed if E recurrence emitted).
  let responseAwarenessCue: {
    kind: MicroAwarenessKind;
    textEn: string;
    textZh: string;
  } | null = null;
  let debugMilestoneHOutcome: string = "skipped_not_computed";
  let debugMilestoneHSuppressedReason: string | null = null;
  const debugMilestoneHEnabled = isMilestoneHCueEnabled();

  // Milestone I: soft continuity carry-over (minimal carry, no new UI layer).
  let debugMilestoneIOutcome: string = "skipped_not_computed";
  let debugMilestoneISuppressedReason: MilestoneISuppressedReason | null = null;
  let debugMilestoneICueFamily: string | null = null;
  let debugMilestoneICueTextEn: string | null = null;
  let debugMilestoneICueTextZh: string | null = null;
  let debugMilestoneIPreviousFamily: string | null = null;
  let debugMilestoneICurrentFamily: string | null = null;
  let debugMilestoneIFamilyMatched: boolean | null = null;
  let debugMilestoneIFamilyCompatible: boolean | null = null;
  let debugMilestoneIThreadStrength: string | null = null;
  let debugMilestoneIUserReflectiveStructure: boolean | null = null;
  let debugMilestoneIMainReflectionSufficient: boolean | null = null;
  let debugMilestoneISignatureScore: number | null = null;
  let debugMilestoneISignatureTier: string | null = null;
  let debugMilestoneISignatureRescuedThread: boolean | null = null;
  let debugMilestoneICoreThreadFamily: string | null = null;
  let debugMilestoneICoreConfidence: string | null = null;
  let debugMilestoneICoreReasons: string[] | null = null;
  let debugMilestoneICoreUseFallbackGeneric: boolean | null = null;
  let debugMilestoneIPromotionConfidence: string | null = null;
  let debugMilestoneICrossFamilyBlocked: boolean | null = null;
  let debugMilestoneIWeightGuardTriggered: boolean | null = null;
  let debugMilestoneIWeakPromotionBridgeUsed: boolean | null = null;
  let debugMilestoneIWeakSurvivalCorridorDecision: string | null = null;
  let debugMilestoneIWeakSurvivalCorridorTemplateAllowance: string | null = null;
  let debugMilestoneIWeakSurvivalCorridorReasons: string[] | null = null;
  let debugMilestoneIWeakEdgeAdmissionDecision: string | null = null;
  let debugMilestoneIWeakEdgeAdmissionReasons: string[] | null = null;
  let debugMilestoneIWeakEdgeSelfTurnStrength: string | null = null;
  let debugMilestoneIWeakEdgePurelyHistorical: boolean | null = null;
  let debugMilestoneIWeakEdgeFaintResidualSelfTurnPresent: boolean | null = null;
  let debugMilestoneIWeakEdgeCurrentTurnLiveEnough: boolean | null = null;
  let debugMilestoneIWeakEdgeResidualMovementDecision: string | null = null;
  let debugMilestoneIWeakEdgeResidualMovementReasons: string[] | null = null;
  let debugMilestoneIWeakEdgeResidualCarryShapeUsed: boolean | null = null;
  let debugMilestoneIHOverlapPreferIActivated: boolean | null = null;
  let debugMilestoneIHOverlapRoutingDecision: string | null = null;
  let debugMilestoneIHOverlapRoutingReasons: string[] | null = null;
  let debugMilestoneIHOverlapIValid: boolean | null = null;
  let debugMilestoneIHOverlapIInvalidReasons: string[] | null = null;
  let debugMilestoneIHOverlapFamilyShiftRelaxed: boolean | null = null;
  let debugMilestoneIHOverlapAdmissionConfidenceBridgeUsed: boolean | null = null;
  let debugMilestoneIPromotionState: string | null = null;
  let debugMilestoneIPromotionTemplateAllowance: string | null = null;
  let debugMilestoneIPromotionReasons: string[] | null = null;
  const debugMilestoneIEnabled = isMilestoneICarryoverEnabled();

  // Milestone J: optional micro-shift line (append after main + I; kill-switch + boundary map).
  let responseMicroshiftCue: {
    textEn: string;
    textZh: string;
    render_mode: JRenderMode;
  } | null = null;
  let debugMilestoneJOutcome = "skipped_not_computed";
  let debugMilestoneJSuppressedReason: string | null = null;
  let debugMilestoneJEligibility: string | null = null;
  let debugMilestoneJAllowRenderMode: string | null = null;
  let debugMilestoneJReasons: string[] | null = null;
  let debugMilestoneJRollbackRisk: boolean | null = null;
  const debugMilestoneJEnabled = isMilestoneJMicroshiftEnabled();

  // Ticket 4: save one durable insight when we have a good candidate.
  try {
    const anyPrismaRead = prisma as unknown as {
      insight?: {
        findFirst: (args: {
          where: {
            userId: string;
            conversationId: string;
            status: string;
            isContinuityEligible: boolean;
            createdAt: { lt: Date };
          };
          orderBy: { createdAt: "desc" };
          select: { continuityText: true };
        }) => Promise<{ continuityText: string } | null>;
      };
    };
    if (anyPrismaRead.insight && typeof anyPrismaRead.insight.findFirst === "function") {
      const previousInsight = await anyPrismaRead.insight.findFirst({
        where: {
          userId,
          conversationId: sessionId,
          status: "active",
          isContinuityEligible: true,
          createdAt: { lt: userMsg.createdAt },
        },
        orderBy: { createdAt: "desc" },
        select: { continuityText: true },
      });
      const candidateText = previousInsight?.continuityText?.trim() || null;
      if (candidateText) {
        previousTurnLastInsightText = candidateText;
        debugLastInsightSource = "previous_turn";
      }
    }
  } catch {
    previousTurnLastInsightText = null;
    debugLastInsightSource = "none";
  }

  if (reflectionState && reflectionState.insight_candidate.trim()) {
    const corePattern = reflectionState.insight_candidate.trim();
    const continuityText = toContinuityReminderText(corePattern);

    const sourceLower = message.trim().toLowerCase();
    const vagueSourcePatterns = [
      "feel off",
      "feels off",
      "something feels weird",
      "i'm tired",
      "i am tired",
      "不确定",
      "我不确定",
      "我不知道",
      "不知道",
      "说不清",
      "说不出哪里不对",
      "感觉不对",
      "感觉有点不对",
      "感觉很奇怪",
      "感觉怪",
      "not sure",
      "not sure what's wrong",
      "not sure what is wrong",
      "i don't know",
      "i dont know",
      "i don't know. i just feel off",
      "everything feels a bit off",
      "i feel strange",
      "feel strange",
      "i'm low",
      "i am low",
      "im low",
      "i'm not okay",
      "i am not okay",
      "today feels odd",
      "today feels a bit odd",
      "i can't explain it",
      "cant explain it",
      "...",
    ];
    const isVagueSource = vagueSourcePatterns.some((p) =>
      sourceLower.includes(p)
    );

    const lower = corePattern.toLowerCase();

    // For continuity, we want a genuinely reusable pattern, not just a vague
    // state summary that happens to be well phrased.
    const hasStrongPatternCue =
      /(inner rule|rule that|demand|pressure|loop|automatic habit|keeps .* (going|building)|treats .* as|turns .* into|have to prove|has to prove|must prove|prove (myself|yourself|themselves)|prove your worth|worth (still )?needs? to be earned|worth must be earned|earn (my|your|their) place|not enough even after|still not enough after|after accomplishing a lot|effort still (doesn't|does not) count|accomplishment doesn't settle it|doing a lot but still not enough)/i.test(
        corePattern
      );
    const hasTriggerStructure = /\bwhen\b|\bwhenever\b|\bevery time\b/i.test(
      corePattern
    );
    const looksLikeVagueStateSummary =
      /feels off|feel off|tired\b|weird\b|something (may be|is) wrong|cannot identify what is happening|not sure what(?:'s| is) wrong|vague sense/i.test(
        lower
      );
    // Sentences that technically look like "when X then Y" but where X is still
    // just a vague state ("feels off", "is tired", "not sure what's wrong").
    // These are useful for the immediate reflection, but too weak as durable,
    // resurfaced continuity insights.
    const hasVagueTriggerRule = /^when\b[^.]*\b(feels? off|feel off|something feels weird|is tired|feels tired|cannot identify what is happening|not sure what(?:'s| is) wrong|everything feels a bit off)[^.]*\./i.test(
      lower
    );

    // Positive durability requirement: only treat as continuity-grade if there
    // is a clearly reusable pattern, not just a cleaned-up vague-state summary.
    const patternFamily = detectContinuityPatternFamily(corePattern);
    const isRestOrEarnedValueFamily =
      patternFamily === "earned_value_after_effort" ||
      patternFamily === "rest_must_be_earned";
    const hasDurablePattern =
      hasStrongPatternCue ||
      isRestOrEarnedValueFamily ||
      (hasTriggerStructure && !looksLikeVagueStateSummary && !hasVagueTriggerRule);

    const weakLabels = new Set(["unknown", "uncertain"]);
    const allLabelsWeak =
      weakLabels.has(reflectionState.trigger_label) &&
      weakLabels.has(reflectionState.emotion_label) &&
      weakLabels.has(reflectionState.interpretation_label) &&
      weakLabels.has(reflectionState.regulation_label) &&
      weakLabels.has(reflectionState.choice_label);
    const bannedPhrases = [
      "too ambiguous to infer",
      "unable to infer",
      "insufficient signal",
      "insufficient information",
      "not enough information",
      "unclear trigger",
      "unclear emotion",
      "user reflection is ambiguous",
    ];
    const isSystemy =
      lower.startsWith("as an ai") ||
      lower.startsWith("the model") ||
      lower.includes("insufficient signal") ||
      bannedPhrases.some((p) => lower.includes(p));

    const isVeryShort = corePattern.length < 24;
    const isTooShortAndFlat =
      isVeryShort &&
      !corePattern.includes(",") &&
      !corePattern.includes(".") &&
      !/(rule|pressure|loop|demand|pattern|reaction|uncertainty|habit)/i.test(
        corePattern
      );

    const isTooGeneric =
      lower === "you were upset today." ||
      lower === "you were upset today" ||
      lower === "you had a hard conversation." ||
      lower === "you had a hard conversation" ||
      lower === "you feel emotions strongly." ||
      lower === "you feel emotions strongly";

    const genericStarts = [
      "you feel",
      "you felt",
      "you were",
      "you had",
      "the user feels",
      "the user had",
    ];
    // Treat "the user feels..." as flat only when there is no strong pattern
    // cue (rule/loop/pressure/proving/keep up, etc.). For strong cases like
    // "have to prove myself", we want them to stay eligible.
    const isFlatRestatement =
      genericStarts.some((p) => lower.startsWith(p)) &&
      !hasStrongPatternCue &&
      !/(rule|pressure|loop|demand|pattern|reaction|uncertainty|habit)/i.test(
        corePattern
      );

    // For strongly patterned sources (including rest/earned-value families),
    // we allow eligibility even if the extractor labels are all
    // "unknown"/"uncertain" — the text pattern itself carries enough durability.
    const labelsMustBeStrong =
      (!hasStrongPatternCue && !isRestOrEarnedValueFamily) || isVagueSource;

    let isContinuityEligible =
      (!labelsMustBeStrong || !allLabelsWeak) &&
      !isSystemy &&
      !isTooShortAndFlat &&
      !isTooGeneric &&
      !isFlatRestatement &&
      // Positive durability rule: require a reusable pattern (inner rule / loop /
      // pressure / trigger→interpretation link). If the insight is only a vague-
      // state summary, it remains non-eligible even if wording is clean.
      hasDurablePattern;

    // v4 default-deny for weak vague-state sources:
    // If the *source* input is a vague state ("feel off", "tired", "not sure
    // what's wrong", etc.), then continuity is *off by default*. Only allow
    // an override when there is an especially clear, strong pattern: explicit
    // rule/pressure language *and* a trigger→interpretation chain, and it is
    // not just a cleaned-up vague-state summary.
    if (isVagueSource) {
      const strongOverride =
        hasStrongPatternCue &&
        hasTriggerStructure &&
        !looksLikeVagueStateSummary &&
        !hasVagueTriggerRule;

      if (!strongOverride) {
        isContinuityEligible = false;
      }
    }

    // Capture full decision chain for this turn (debug only).
    debugInsightCorePattern = corePattern;
    debugHasStrongPatternCue = hasStrongPatternCue;
    debugIsFlatRestatement = isFlatRestatement;
    debugIsVagueSource = isVagueSource;
    debugAllLabelsWeak = allLabelsWeak;
    debugIsSystemy = isSystemy;
    debugIsVeryShort = isVeryShort;
    debugIsTooShortAndFlat = isTooShortAndFlat;
    debugIsTooGeneric = isTooGeneric;
    try {
      const anyPrisma = prisma as unknown as {
        insight?: {
          create: (args: {
            data: {
              userId: string;
              conversationId: string;
              sourceMessageId: string;
              corePattern: string;
              continuityText: string;
              status: string;
              confidenceScore: number | null;
              isContinuityEligible: boolean;
            };
          }) => Promise<{ id: string; createdAt: Date }>;
        };
      };

      if (!anyPrisma.insight || typeof anyPrisma.insight.create !== "function") {
        console.warn(
          "[chat/turn] prisma.insight delegate not available; skipping insight save"
        );
      } else {
        const created = await anyPrisma.insight.create({
          data: {
            userId,
            conversationId: sessionId,
            sourceMessageId: userMsg.id,
            corePattern,
            continuityText,
            status: "active",
            confidenceScore: null,
            isContinuityEligible,
          },
        });
        debugInsightId = created?.id ?? null;
        debugIsContinuityEligible = isContinuityEligible;
        responseContinuityInsight = {
          id: created.id,
          corePattern,
          continuityText,
          createdAt: created.createdAt,
          isContinuityEligible,
          continuityKey: patternFamily,
        };

        // Milestone E (minimal): one lightweight recurrence cue based on
        // reusable pattern identity (mapped), not text similarity.
        if (isContinuityEligible) {
          const anyPrismaRead = prisma as unknown as {
            insight?: {
              findMany: (args: {
                where: {
                  userId: string;
                  status: string;
                  isContinuityEligible: boolean;
                  id?: { not: string };
                };
                orderBy: { createdAt: "asc" | "desc" };
                take: number;
                select: { corePattern: true; createdAt: true };
              }) => Promise<Array<{ corePattern: string; createdAt: Date }>>;
            };
          };
          const recentFetched = await anyPrismaRead.insight?.findMany({
            where: {
              userId,
              status: "active",
              isContinuityEligible: true,
              id: { not: created.id },
            },
            orderBy: { createdAt: "desc" },
            // Milestone E2: small rolling window (substrate, not archive).
            take: 5,
            select: { corePattern: true, createdAt: true },
          });
          const windowStart = Date.now() - E2_RECURRENCE_MAX_INSIGHT_AGE_MS;
          const recent = (recentFetched ?? []).filter(
            (r) => r.createdAt.getTime() >= windowStart
          );

          const matchPositions: number[] = [];
          recent.forEach((r, idx) => {
            if (detectContinuityPatternFamily(r.corePattern) === patternFamily) {
              matchPositions.push(idx);
            }
          });
          const sameFamilyCount = matchPositions.length;
          const newestAlignedIndex =
            matchPositions.length > 0 ? matchPositions[0] : null;
          const newestAlignedRow =
            newestAlignedIndex != null ? recent[newestAlignedIndex] : null;
          const newestAlignedAgeMs =
            newestAlignedRow != null
              ? Date.now() - newestAlignedRow.createdAt.getTime()
              : null;
          if (newestAlignedAgeMs != null) {
            debugRecurrenceE2NewestAlignedAgeMs = newestAlignedAgeMs;
          }

          debugRecurrencePatternFamily = patternFamily;
          debugRecurrenceSameFamilyCount = sameFamilyCount;
          debugRecurrenceNewestAlignedIndex = newestAlignedIndex;

          // E2 proof rule: aligned instances INCLUDING the current insight.
          const alignedInstanceCount = sameFamilyCount + 1;
          debugRecurrenceAlignedInstanceCount = alignedInstanceCount;

          if (alignedInstanceCount < 2) {
            responseRecurrenceCue = null;
          } else {
            const patternId = mapContinuityFamilyToPatternId(patternFamily);
            debugRecurrencePatternId = patternId;

            // E2 decay: long-gap similarity should not surface (quiet disappearance).
            if (
              newestAlignedAgeMs != null &&
              newestAlignedAgeMs > E2_NEWEST_ALIGNED_MAX_AGE_MS
            ) {
              debugRecurrenceE2SuppressedStaleWindow = true;
              responseRecurrenceCue = null;
            } else {
              // Provisional: alignedCount => medium/high.
              const confidenceRaw: RecurrenceConfidence =
                alignedInstanceCount >= 3 ? "high" : "medium";
              debugRecurrenceConfidenceRaw = confidenceRaw;

              const resolvedConfidence: RecurrenceConfidence =
                patternId === "generic" ? "low" : confidenceRaw;
              debugRecurrenceConfidenceResolved = resolvedConfidence;

              const confidenceScore = Math.min(
                1,
                resolvedConfidence === "high"
                  ? 0.9
                  : resolvedConfidence === "medium"
                    ? 0.65
                    : 0.35
              );

              // E2: low confidence defaults to no surfacing unless very tight window + signal.
              const suppressLowConfidence =
                resolvedConfidence === "low" &&
                (isVeryShort ||
                  isTooGeneric ||
                  isSystemy ||
                  isTooShortAndFlat ||
                  (newestAlignedIndex != null && newestAlignedIndex > 1));

              if (!suppressLowConfidence) {
                // E2 replace-not-accumulate: only one active visible pattern identity per turn.
                // If this turn maps to a different pattern_key than the last surfaced cue, we replace
                // metadata entirely — never stack multiple continuity patterns in one surface.

                // Persistence phase is NOT count-only (Wisewave): require present relevance + low
                // repetition risk, not just alignedInstanceCount >= threshold.
                const userTrimLen = message.trim().length;
                const persistenceCountOk =
                  alignedInstanceCount >= E2_PERSISTENCE_ALIGNED_THRESHOLD;
                const persistenceRelevanceOk =
                  !isVagueSource &&
                  userTrimLen >= E2_PERSISTENCE_MIN_USER_CHARS &&
                  newestAlignedIndex != null &&
                  newestAlignedIndex <= 1;
                if (persistenceCountOk && !persistenceRelevanceOk) {
                  debugRecurrenceE2PersistenceDowngraded = true;
                }
                const phase: RecurrenceCuePhase =
                  persistenceCountOk && persistenceRelevanceOk
                    ? "persistence"
                    : "recurrence";
                debugRecurrenceE2Phase = phase;

                let suppressRepeat = false;
                if (assistantMsgId) {
                  try {
                    // Anti-drift & replace-not-accumulate debug:
                    // We want the *last emitted* recurrence-pattern identity, not just the
                    // immediately previous assistant turn (which may have `recurrence_cue: null`
                    // and therefore no metadata.wisewave_recurrence payload).
                    const recentAssts = await prisma.message.findMany({
                      where: {
                        conversationId: sessionId,
                        role: "assistant",
                        id: { not: assistantMsgId },
                      },
                      orderBy: { createdAt: "desc" },
                      take: 8,
                      select: { metadata: true },
                    });

                    let prevPatternKey: string | null = null;
                    for (const a of recentAssts) {
                      const pm = a?.metadata;
                      const wr =
                        pm &&
                        typeof pm === "object" &&
                        !Array.isArray(pm) &&
                        "wisewave_recurrence" in pm
                          ? (pm as {
                              wisewave_recurrence?: { pattern_key?: string };
                            }).wisewave_recurrence
                          : undefined;
                      if (typeof wr?.pattern_key === "string" && wr.pattern_key.length > 0) {
                        prevPatternKey = wr.pattern_key;
                        break;
                      }
                    }

                    if (
                      prevPatternKey != null &&
                      prevPatternKey.length > 0 &&
                      prevPatternKey !== patternId
                    ) {
                      debugRecurrenceE2ActivePatternReplaced = true;
                    }

                    // Heuristic only: short follow-up + same prior recurrence identity → silence.
                    if (
                      prevPatternKey === patternId &&
                      userTrimLen < E2_ANTI_REPEAT_MIN_USER_CHARS
                    ) {
                      suppressRepeat = true;
                      debugRecurrenceE2SuppressedRepeat = true;
                    }
                  } catch {
                    /* non-fatal */
                  }
                }

                if (!suppressRepeat) {
                  // E3 legibility gate + light/clear wording.
                  // Boundary: E3 ONLY changes recurrence_cue text/rendering (not continuity_insight / Last insight strip).

                  // Proof threshold for E3 (derived from current E2 recurrence conditions).
                  debugRecurrenceE3ProofThresholdPassed = true;

                  const presentRelevance =
                    newestAlignedIndex == null
                      ? 0
                      : newestAlignedIndex <= 1
                        ? 0.85
                        : newestAlignedIndex === 2
                          ? 0.6
                          : 0.3;

                  const baseClarityGain =
                    resolvedConfidence === "high"
                      ? 0.85
                      : resolvedConfidence === "medium"
                        ? 0.65
                        : 0.4;

                  const clarityGain =
                    phase === "persistence"
                      ? Math.max(baseClarityGain, 0.75)
                      : baseClarityGain;

                  // Keep added weight low since UI is already one-sentence + secondary placement.
                  const addedWeightRisk = clarityGain >= 0.72 ? 0.25 : 0.15;

                  debugRecurrenceE3PresentRelevance = presentRelevance;
                  debugRecurrenceE3ClarityGain = clarityGain;
                  debugRecurrenceE3AddedWeightRisk = addedWeightRisk;

                  const minPresentRelevanceToRender = 0.55;
                  const minClarityGainToRender = 0.5;
                  const maxAddedWeightRisk = 0.35;

                  if (presentRelevance < minPresentRelevanceToRender) {
                    debugRecurrenceE3SuppressedReason = "low_present_relevance";
                    responseRecurrenceCue = null;
                  } else if (clarityGain < minClarityGainToRender) {
                    debugRecurrenceE3SuppressedReason = "low_clarity_gain";
                    responseRecurrenceCue = null;
                  } else if (addedWeightRisk > maxAddedWeightRisk) {
                    debugRecurrenceE3SuppressedReason = "added_weight_too_high";
                    responseRecurrenceCue = null;
                  } else {
                    const legibilityState: LegibilityState =
                      clarityGain >= 0.72 ? "clear" : "light";
                    debugRecurrenceE3LegibilityState = legibilityState;

                    const cue = e3CueTextFromTemplate(
                      patternId,
                      legibilityState,
                      `${userMsg.id}:${created.id}:${legibilityState}`
                    );

                    responseRecurrenceCue = {
                      patternKey: patternId,
                      confidence: resolvedConfidence,
                      confidenceScore,
                      textEn: cue.en.replace(/\n/g, " ").trim(),
                      textZh: cue.zh.replace(/\n/g, " ").trim(),
                      phase,
                    };

                    debugRecurrenceCueEmitted = true;

                    // Persist recurrence identity for anti-repeat checks.
                    if (assistantMsgId) {
                      try {
                        const row = await prisma.message.findUnique({
                          where: { id: assistantMsgId },
                          select: { metadata: true },
                        });
                        const prevMeta =
                          row?.metadata &&
                          typeof row.metadata === "object" &&
                          !Array.isArray(row.metadata)
                            ? (row.metadata as Record<string, unknown>)
                            : {};
                        await prisma.message.update({
                          where: { id: assistantMsgId },
                          data: {
                            metadata: {
                              ...prevMeta,
                              wisewave_recurrence: {
                                pattern_key: patternId,
                                aligned_instance_count: alignedInstanceCount,
                                confidence: resolvedConfidence,
                                phase,
                                text_en: responseRecurrenceCue.textEn,
                                text_zh: responseRecurrenceCue.textZh,
                                confidence_score: responseRecurrenceCue.confidenceScore,
                              },
                            },
                          },
                        });
                      } catch (e) {
                        console.warn(
                          "[chat/turn] recurrence metadata update failed",
                          e
                        );
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn("[chat/turn] Insight save failed", e);
    }
  }
  // Ticket 7: structured log for insight + continuity decision.
  console.debug("[ticket7][chat/turn] insight_continuity", {
    sessionId,
    userMessageId: userMsg.id,
    hasReflectionState: !!reflectionState,
    insightCreated: !!debugInsightId,
    insightId: debugInsightId,
    isContinuityEligible: debugIsContinuityEligible,
  });

  // Ticket 6 (Milestone B): optional feedback capture about prior action outcome.
  // Only persist when feedback.note exists, is a string, and is non-empty after trim.
  // Otherwise do not save; feedback_saved stays false.
  const note =
    rawFeedback &&
    typeof rawFeedback === "object" &&
    "note" in rawFeedback &&
    typeof (rawFeedback as { note?: unknown }).note === "string"
      ? ((rawFeedback as { note: string }).note || "").trim()
      : "";
  if (note) {
    try {
      const anyPrisma = prisma as unknown as {
        feedback?: {
          create: (args: {
            data: {
              userId: string;
              conversationId: string;
              sourceMessageId: string;
              payload: unknown;
            };
          }) => Promise<unknown>;
        };
      };

      if (!anyPrisma.feedback || typeof anyPrisma.feedback.create !== "function") {
        console.warn(
          "[chat/turn] prisma.feedback delegate not available; skipping feedback save"
        );
      } else {
        await anyPrisma.feedback.create({
          data: {
            userId,
            conversationId: sessionId,
            sourceMessageId: userMsg.id,
            payload: { note },
          },
        });
        feedbackSaved = true;
      }
    } catch (e) {
      console.warn("[chat/turn] Feedback save failed", e);
    }
  }

  // Milestone F1: embodiment bridge — only when recurrence cue is present (proof of legible repetition).
  const milestoneFEmbodimentOff = process.env.MILESTONE_F_EMBODIMENT === "0";
  debugEmbodimentFMilestoneEnabled = !milestoneFEmbodimentOff;

  if (!responseRecurrenceCue) {
    debugEmbodimentFOutcome = "skipped_no_recurrence";
  } else if (milestoneFEmbodimentOff) {
    debugEmbodimentFSuppressedReason = "milestone_f_disabled";
    debugEmbodimentFOutcome = "skipped_milestone_disabled";
  } else if (!debugRecurrenceE3LegibilityState) {
    debugEmbodimentFSuppressedReason = "no_e3_legibility_state";
    debugEmbodimentFOutcome = "skipped_no_e3_legibility";
  } else {
    const responseState = debugRecurrenceE3LegibilityState;
    const useUltraShort =
      responseRecurrenceCue.confidence === "low" ||
      message.trim().length < 40;
    const texts = embodimentCueTexts({
      patternKey: responseRecurrenceCue.patternKey as EmbodimentPatternKey,
      responseState,
      variantSeed: `${userMsg.id}:${debugInsightId ?? "na"}:femb:${responseRecurrenceCue.patternKey}:${responseState}`,
      useUltraShort,
    });
    responseEmbodimentCue = {
      patternKey: responseRecurrenceCue.patternKey,
      responseState,
      textEn: texts.en.replace(/\n/g, " ").trim(),
      textZh: texts.zh.replace(/\n/g, " ").trim(),
    };
    debugEmbodimentFResponseState = responseState;
    debugEmbodimentFUsedUltraShort = useUltraShort;
    debugEmbodimentFOutcome = "emitted";
  }

  // Milestone H: micro awareness cue — after reflection + E strips; suppressed when E recurrence emitted.
  if (assistantMsgId) {
    let previousAssistantHadAwarenessCue = false;
    let previousAssistantReflectionState: ExtractedReflectionState | null = null;
    try {
      const priorAssistant = await prisma.message.findFirst({
        where: {
          conversationId: sessionId,
          role: "assistant",
          NOT: { id: assistantMsgId },
        },
        orderBy: { createdAt: "desc" },
        select: { metadata: true },
      });
      const pm = priorAssistant?.metadata;
      if (pm && typeof pm === "object" && !Array.isArray(pm)) {
        const w = (pm as Record<string, unknown>).wisewave_micro_awareness;
        previousAssistantHadAwarenessCue =
          w !== null &&
          typeof w === "object" &&
          !Array.isArray(w) &&
          typeof (w as { kind?: unknown }).kind === "string";

        const rs = (pm as Record<string, unknown>).wisewave_reflection_state;
        if (rs && typeof rs === "object" && !Array.isArray(rs)) {
          const r = rs as Record<string, unknown>;
          if (
            typeof r.trigger_label === "string" &&
            typeof r.emotion_label === "string" &&
            typeof r.interpretation_label === "string" &&
            typeof r.regulation_label === "string" &&
            typeof r.choice_label === "string" &&
            typeof r.insight_candidate === "string"
          ) {
            previousAssistantReflectionState = {
              trigger_label: r.trigger_label,
              emotion_label: r.emotion_label,
              interpretation_label: r.interpretation_label,
              regulation_label: r.regulation_label,
              choice_label: r.choice_label,
              insight_candidate: r.insight_candidate,
            } as ExtractedReflectionState;
          }
        }
      }
    } catch {
      previousAssistantHadAwarenessCue = false;
    }

    // Runtime inner-thread detection (emotional + interpretive + tension structure).
    // Continuity layers must be reset when the thread shifts.
    const currentThreadStructure = extractThreadStructureFromReflectionState(
      reflectionState
    );
    const previousThreadStructure = extractThreadStructureFromReflectionState(
      previousAssistantReflectionState
    );
    const threadDecision = decideThreadState(currentThreadStructure, previousThreadStructure);
    threadState = threadDecision.state;
    debugEmotionSimilarity = threadDecision.emotionSimilarity;
    debugInterpretationSimilarity = threadDecision.interpretationSimilarity;
    debugTensionSimilarity = threadDecision.tensionSimilarity;
    debugWeightedThreadScore = threadDecision.weightedScore;

    const insightCoreForH =
      debugInsightCorePattern ??
      (reflectionState?.insight_candidate?.trim() || null);

    const hResult = computeMicroAwarenessCue({
      userMessage: message,
      seed: `${userMsg.id}:${assistantMsgId}`,
      reflectionState,
      recurrenceCueEmitted: !!responseRecurrenceCue,
      recurrenceAlignedInstanceCount: debugRecurrenceAlignedInstanceCount,
      insightCorePattern: insightCoreForH,
      previousAssistantHadAwarenessCue,
    });

    if (hResult.status === "emitted") {
      responseAwarenessCue = {
        kind: hResult.kind,
        textEn: hResult.textEn,
        textZh: hResult.textZh,
      };
      debugMilestoneHOutcome = "emitted";
      debugMilestoneHSuppressedReason = null;
    } else {
      debugMilestoneHOutcome = "suppressed";
      debugMilestoneHSuppressedReason = hResult.reason;
    }

    // Milestone I: soft continuity carry-over (append subtle carry sentence to assistant_message)
    if (reflectionState) {
      let previousUserMessageForI: string | null = null;
      try {
        const priorUser = await prisma.message.findFirst({
          where: {
            conversationId: sessionId,
            role: "user",
            createdAt: { lt: userMsg.createdAt },
          },
          orderBy: { createdAt: "desc" },
          select: { message: true },
        });
        previousUserMessageForI = priorUser?.message?.trim() || null;
      } catch {
        previousUserMessageForI = null;
      }

      const iResult: MilestoneIOutcome = computeMilestoneICarryoverCue({
        userMessage: message,
        previousUserMessage: previousUserMessageForI,
        seed: `${userMsg.id}:${assistantMsgId}`,
        reflectionState,
        previousReflectionState: previousAssistantReflectionState,
        recurrenceCueEmitted: !!responseRecurrenceCue,
        awarenessCueEmitted: !!responseAwarenessCue,
        wantsChinese,
      });

      if (iResult.status === "emitted") {
        const cueText = wantsChinese ? iResult.textZh : iResult.textEn;
        const merged = `${assistantContent?.trim() ?? ""} ${cueText}`.replace(/\s+/g, " ").trim();
        // Update in-memory response + persisted assistant message for coherence.
        assistantContent = normalizeModelTextForStorage(merged);
        try {
          await prisma.message.update({
            where: { id: assistantMsgId },
            data: { message: assistantContent },
          });
        } catch (e) {
          console.warn("[chat/turn] assistant message update (milestone I) failed", e);
        }

        debugMilestoneIOutcome = "emitted";
        debugMilestoneISuppressedReason = null;
        debugMilestoneICueFamily = iResult.cueFamily;
        debugMilestoneICueTextEn = iResult.textEn;
        debugMilestoneICueTextZh = iResult.textZh;
        debugMilestoneIPreviousFamily = iResult.debugPath.previousFamily;
        debugMilestoneICurrentFamily = iResult.debugPath.currentFamily;
        debugMilestoneIFamilyMatched = iResult.debugPath.familyMatched;
        debugMilestoneIFamilyCompatible = iResult.debugPath.familyCompatible;
        debugMilestoneIThreadStrength = iResult.debugPath.threadStrength;
        debugMilestoneIUserReflectiveStructure = iResult.debugPath.userReflectiveStructure;
        debugMilestoneIMainReflectionSufficient = iResult.debugPath.mainReflectionSufficient;
        debugMilestoneISignatureScore = iResult.debugPath.signatureScore;
        debugMilestoneISignatureTier = iResult.debugPath.signatureTier;
        debugMilestoneISignatureRescuedThread = iResult.debugPath.signatureRescuedThread;
        debugMilestoneICoreThreadFamily = iResult.debugPath.coreThreadFamily;
        debugMilestoneICoreConfidence = iResult.debugPath.coreConfidence;
        debugMilestoneICoreReasons = iResult.debugPath.coreReasons;
        debugMilestoneICoreUseFallbackGeneric = iResult.debugPath.coreUseFallbackGeneric;
        debugMilestoneIPromotionConfidence = iResult.debugPath.promotionConfidence;
        debugMilestoneICrossFamilyBlocked = iResult.debugPath.crossFamilyBlocked;
        debugMilestoneIWeightGuardTriggered = iResult.debugPath.weightGuardTriggered;
        debugMilestoneIWeakPromotionBridgeUsed = iResult.debugPath.weakPromotionBridgeUsed;
        debugMilestoneIWeakSurvivalCorridorDecision =
          iResult.debugPath.weakSurvivalCorridorDecision;
        debugMilestoneIWeakSurvivalCorridorTemplateAllowance =
          iResult.debugPath.weakSurvivalCorridorTemplateAllowance;
        debugMilestoneIWeakSurvivalCorridorReasons =
          iResult.debugPath.weakSurvivalCorridorReasons;
        debugMilestoneIWeakEdgeAdmissionDecision =
          iResult.debugPath.weakEdgeAdmissionDecision;
        debugMilestoneIWeakEdgeAdmissionReasons =
          iResult.debugPath.weakEdgeAdmissionReasons;
        debugMilestoneIWeakEdgeSelfTurnStrength =
          iResult.debugPath.weakEdgeSelfTurnStrength;
        debugMilestoneIWeakEdgePurelyHistorical =
          iResult.debugPath.weakEdgePurelyHistorical;
        debugMilestoneIWeakEdgeFaintResidualSelfTurnPresent =
          iResult.debugPath.weakEdgeFaintResidualSelfTurnPresent;
        debugMilestoneIWeakEdgeCurrentTurnLiveEnough =
          iResult.debugPath.weakEdgeCurrentTurnLiveEnough;
        debugMilestoneIWeakEdgeResidualMovementDecision =
          iResult.debugPath.weakEdgeResidualMovementDecision;
        debugMilestoneIWeakEdgeResidualMovementReasons =
          iResult.debugPath.weakEdgeResidualMovementReasons;
        debugMilestoneIWeakEdgeResidualCarryShapeUsed =
          iResult.debugPath.weakEdgeResidualCarryShapeUsed;
        debugMilestoneIHOverlapPreferIActivated =
          iResult.debugPath.hOverlapPreferIActivated;
        debugMilestoneIHOverlapRoutingDecision =
          iResult.debugPath.hOverlapRoutingDecision;
        debugMilestoneIHOverlapRoutingReasons =
          iResult.debugPath.hOverlapRoutingReasons;
        debugMilestoneIHOverlapIValid = iResult.debugPath.hOverlapIValid;
        debugMilestoneIHOverlapIInvalidReasons =
          iResult.debugPath.hOverlapIInvalidReasons;
        debugMilestoneIHOverlapFamilyShiftRelaxed =
          iResult.debugPath.hOverlapFamilyShiftRelaxed;
        debugMilestoneIHOverlapAdmissionConfidenceBridgeUsed =
          iResult.debugPath.hOverlapAdmissionConfidenceBridgeUsed;
        debugMilestoneIPromotionState = iResult.debugPath.promotionState;
        debugMilestoneIPromotionTemplateAllowance = iResult.debugPath.promotionTemplateAllowance;
        debugMilestoneIPromotionReasons = iResult.debugPath.promotionReasons;
      } else {
        debugMilestoneIOutcome = "suppressed";
        debugMilestoneISuppressedReason = iResult.reason;
        debugMilestoneICueTextEn = null;
        debugMilestoneICueTextZh = null;
        debugMilestoneIPreviousFamily = iResult.debugPath.previousFamily;
        debugMilestoneICurrentFamily = iResult.debugPath.currentFamily;
        debugMilestoneIFamilyMatched = iResult.debugPath.familyMatched;
        debugMilestoneIFamilyCompatible = iResult.debugPath.familyCompatible;
        debugMilestoneIThreadStrength = iResult.debugPath.threadStrength;
        debugMilestoneIUserReflectiveStructure = iResult.debugPath.userReflectiveStructure;
        debugMilestoneIMainReflectionSufficient = iResult.debugPath.mainReflectionSufficient;
        debugMilestoneISignatureScore = iResult.debugPath.signatureScore;
        debugMilestoneISignatureTier = iResult.debugPath.signatureTier;
        debugMilestoneISignatureRescuedThread = iResult.debugPath.signatureRescuedThread;
        debugMilestoneICoreThreadFamily = iResult.debugPath.coreThreadFamily;
        debugMilestoneICoreConfidence = iResult.debugPath.coreConfidence;
        debugMilestoneICoreReasons = iResult.debugPath.coreReasons;
        debugMilestoneICoreUseFallbackGeneric = iResult.debugPath.coreUseFallbackGeneric;
        debugMilestoneIPromotionConfidence = iResult.debugPath.promotionConfidence;
        debugMilestoneICrossFamilyBlocked = iResult.debugPath.crossFamilyBlocked;
        debugMilestoneIWeightGuardTriggered = iResult.debugPath.weightGuardTriggered;
        debugMilestoneIWeakPromotionBridgeUsed = iResult.debugPath.weakPromotionBridgeUsed;
        debugMilestoneIWeakSurvivalCorridorDecision =
          iResult.debugPath.weakSurvivalCorridorDecision;
        debugMilestoneIWeakSurvivalCorridorTemplateAllowance =
          iResult.debugPath.weakSurvivalCorridorTemplateAllowance;
        debugMilestoneIWeakSurvivalCorridorReasons =
          iResult.debugPath.weakSurvivalCorridorReasons;
        debugMilestoneIWeakEdgeAdmissionDecision =
          iResult.debugPath.weakEdgeAdmissionDecision;
        debugMilestoneIWeakEdgeAdmissionReasons =
          iResult.debugPath.weakEdgeAdmissionReasons;
        debugMilestoneIWeakEdgeSelfTurnStrength =
          iResult.debugPath.weakEdgeSelfTurnStrength;
        debugMilestoneIWeakEdgePurelyHistorical =
          iResult.debugPath.weakEdgePurelyHistorical;
        debugMilestoneIWeakEdgeFaintResidualSelfTurnPresent =
          iResult.debugPath.weakEdgeFaintResidualSelfTurnPresent;
        debugMilestoneIWeakEdgeCurrentTurnLiveEnough =
          iResult.debugPath.weakEdgeCurrentTurnLiveEnough;
        debugMilestoneIWeakEdgeResidualMovementDecision =
          iResult.debugPath.weakEdgeResidualMovementDecision;
        debugMilestoneIWeakEdgeResidualMovementReasons =
          iResult.debugPath.weakEdgeResidualMovementReasons;
        debugMilestoneIWeakEdgeResidualCarryShapeUsed =
          iResult.debugPath.weakEdgeResidualCarryShapeUsed;
        debugMilestoneIHOverlapPreferIActivated =
          iResult.debugPath.hOverlapPreferIActivated;
        debugMilestoneIHOverlapRoutingDecision =
          iResult.debugPath.hOverlapRoutingDecision;
        debugMilestoneIHOverlapRoutingReasons =
          iResult.debugPath.hOverlapRoutingReasons;
        debugMilestoneIHOverlapIValid = iResult.debugPath.hOverlapIValid;
        debugMilestoneIHOverlapIInvalidReasons =
          iResult.debugPath.hOverlapIInvalidReasons;
        debugMilestoneIHOverlapFamilyShiftRelaxed =
          iResult.debugPath.hOverlapFamilyShiftRelaxed;
        debugMilestoneIHOverlapAdmissionConfidenceBridgeUsed =
          iResult.debugPath.hOverlapAdmissionConfidenceBridgeUsed;
        debugMilestoneIPromotionState = iResult.debugPath.promotionState;
        debugMilestoneIPromotionTemplateAllowance = iResult.debugPath.promotionTemplateAllowance;
        debugMilestoneIPromotionReasons = iResult.debugPath.promotionReasons;
      }
    }

    // Milestone J — after I carry text is merged into assistantContent (order: main → I → J).
    if (!debugMilestoneJEnabled) {
      debugMilestoneJOutcome = "skipped_disabled";
    } else if (!reflectionState) {
      debugMilestoneJOutcome = "skipped_no_reflection_state";
    } else {
      const milestoneIEmitted = debugMilestoneIOutcome === "emitted";
      const jInput = buildJBoundaryInputForTurn({
        userMessage: message,
        reflectionState,
        awarenessCueEmitted: !!responseAwarenessCue,
        milestoneIEmitted,
        recurrenceCueEmitted: !!responseRecurrenceCue,
        embodimentCueEmitted: !!responseEmbodimentCue,
        mainReflectionSufficient: debugMilestoneIMainReflectionSufficient,
        assistantBodyBeforeJ: assistantContent,
      });
      const jDecision = evaluateMilestoneJBoundary(jInput);
      debugMilestoneJEligibility = jDecision.eligibility;
      debugMilestoneJAllowRenderMode = jDecision.allowRenderMode;
      debugMilestoneJReasons = jDecision.reasons;
      debugMilestoneJRollbackRisk = jDecision.rollbackRisk;

      if (jDecision.suppress || jDecision.allowRenderMode === "none") {
        debugMilestoneJOutcome = "suppressed";
        debugMilestoneJSuppressedReason =
          jDecision.reasons.length > 0 ? jDecision.reasons.join(";") : "suppressed";
      } else {
        let h = 0;
        const jSeed = `${userMsg.id}:${assistantMsgId}:j`;
        for (let i = 0; i < jSeed.length; i++) {
          h = (h * 31 + jSeed.charCodeAt(i)) >>> 0;
        }
        const rm = jDecision.allowRenderMode;
        const lineEn = pickJMicroshiftTemplate({
          renderMode: rm,
          displayLang: "en",
          variantIndex: h,
        });
        const lineZh = pickJMicroshiftTemplate({
          renderMode: rm,
          displayLang: "zh",
          variantIndex: h,
        });
        const line = wantsChinese ? lineZh ?? lineEn : lineEn ?? lineZh;
        if (line) {
          const mergedJ = `${assistantContent.trim()} ${line}`
            .replace(/\s+/g, " ")
            .trim();
          assistantContent = normalizeModelTextForStorage(mergedJ);
          try {
            await prisma.message.update({
              where: { id: assistantMsgId },
              data: { message: assistantContent },
            });
          } catch (e) {
            console.warn("[chat/turn] assistant message update (milestone J) failed", e);
          }
          responseMicroshiftCue = {
            textEn: lineEn ?? line,
            textZh: lineZh ?? line,
            render_mode: rm,
          };
          debugMilestoneJOutcome = "emitted";
          debugMilestoneJSuppressedReason = null;
        } else {
          debugMilestoneJOutcome = "suppressed";
          debugMilestoneJSuppressedReason = "no_template";
        }
      }
    }
  } else {
    debugMilestoneHOutcome = "skipped_no_assistant_row";
    debugMilestoneJOutcome = "skipped_no_assistant_row";
  }

  // Persist reflection + embodiment (+ optional H / J meta) on assistant metadata so /chat can rehydrate strips after reload.
  if (
    assistantMsgId &&
    (reflectionState || responseEmbodimentCue || responseAwarenessCue || responseMicroshiftCue)
  ) {
    try {
      const row = await prisma.message.findUnique({
        where: { id: assistantMsgId },
        select: { metadata: true },
      });
      const prevMeta =
        row?.metadata &&
        typeof row.metadata === "object" &&
        !Array.isArray(row.metadata)
          ? (row.metadata as Record<string, unknown>)
          : {};
      const merged: Record<string, unknown> = { ...prevMeta };
      if (reflectionState) {
        merged.wisewave_reflection_state = reflectionState;
        merged.wisewave_is_vague_source = debugIsVagueSource === true;
      }
      if (responseEmbodimentCue) {
        merged.wisewave_embodiment = {
          pattern_key: responseEmbodimentCue.patternKey,
          response_state: responseEmbodimentCue.responseState,
          text_en: responseEmbodimentCue.textEn,
          text_zh: responseEmbodimentCue.textZh,
        };
      }
      if (responseAwarenessCue) {
        merged.wisewave_micro_awareness = {
          kind: responseAwarenessCue.kind,
          text_en: responseAwarenessCue.textEn,
          text_zh: responseAwarenessCue.textZh,
        };
      }
      if (responseMicroshiftCue) {
        merged.wisewave_j_microshift = {
          text_en: responseMicroshiftCue.textEn,
          text_zh: responseMicroshiftCue.textZh,
          render_mode: responseMicroshiftCue.render_mode,
        };
      }
      await prisma.message.update({
        where: { id: assistantMsgId },
        data: { metadata: merged as object },
      });
    } catch (e) {
      console.warn(
        "[chat/turn] assistant metadata merge (reflection/embodiment) failed",
        e
      );
    }
  }

  const requestedLang = body.lang === "zh" || body.lang === "en" ? body.lang : undefined;
  const responseLang: "en" | "zh" = requestedLang ?? (wantsChinese ? "zh" : "en");
  let responseLastInsight: string | null = previousTurnLastInsightText;
  const allowContinuityLayers = threadState === "same_thread";

  // Hard block: remove previously QA-rejected "space" phrasing from main reflection.
  // (Secondary layers are suppressed instead of replaced to keep separation strict.)
  const mainSanitized = sanitizeRejectedSpacePhrases(assistantContent);
  assistantContent = mainSanitized.text;
  debugRejectedPhraseHit = mainSanitized.hit;
  debugMainReflectionTemplateId = reflectionState?.trigger_label ?? null;

  if (responseLastInsight) {
    if (debugMilestoneIMainReflectionSufficient === true) {
      debugLastInsightSuppressedReason = "main_reflection_already_sufficient";
      responseLastInsight = null;
    } else if (
      debugMilestoneIThreadStrength === "none" ||
      debugMilestoneIThreadStrength === "weak"
    ) {
      debugLastInsightSuppressedReason = "weak_or_unclear_thread";
      responseLastInsight = null;
    } else if (
      debugMilestoneIFamilyMatched === false &&
      debugMilestoneIFamilyCompatible === false
    ) {
      debugLastInsightSuppressedReason = "context_shifted";
      responseLastInsight = null;
    } else if (isLastInsightTooSimilarToMainReflection(responseLastInsight, assistantContent)) {
      debugOverlapWithMainReflection = true;
      debugLastInsightSuppressedReason = "similar_to_main_reflection";
      responseLastInsight = null;
    }

    if (responseLastInsight && !allowContinuityLayers) {
      debugLastInsightSuppressedReason = `thread_${threadState}`;
      responseLastInsight = null;
    }
  }

  const proposedSoftContinuity =
    responseLang === "zh" ? debugMilestoneICueTextZh : debugMilestoneICueTextEn;
  let responseSoftContinuity: string | null = proposedSoftContinuity ?? null;
  if (responseSoftContinuity && !allowContinuityLayers) {
    debugSoftContinuitySuppressedReason = `thread_${threadState}`;
    responseSoftContinuity = null;
  }

  // Secondary de-duplication and rejected-phrase suppression (generation-contract level).
  const SECONDARY_OVERLAP_THRESHOLD = 0.55;
  let keptLastInsight: string | null = responseLastInsight;
  let keptSoftContinuity: string | null = responseSoftContinuity;

  // Validate last_insight: reject if overlaps main reflection or contains rejected phrasing.
  if (keptLastInsight) {
    const secSan = sanitizeRejectedSpacePhrases(keptLastInsight);
    if (secSan.hit) {
      debugRejectedPhraseHit = true;
      debugLastInsightSuppressedReason = "rejected_phrase_hit";
      debugSecondarySuppressedReason = "last_insight_rejected_phrase_hit";
      keptLastInsight = null;
    } else {
      const overlap = computeSecondaryOverlapScore(keptLastInsight, assistantContent);
      debugSecondaryOverlapScore = overlap;
      if (overlap > SECONDARY_OVERLAP_THRESHOLD) {
        debugOverlapWithMainReflection = true;
        debugLastInsightSuppressedReason = "secondary_overlap_with_main_reflection";
        debugSecondarySuppressedReason = "last_insight_overlap_with_main_reflection";
        keptLastInsight = null;
      }
    }
  }

  // Validate soft_continuity similarly.
  if (keptSoftContinuity) {
    const secSan = sanitizeRejectedSpacePhrases(keptSoftContinuity);
    if (secSan.hit) {
      debugRejectedPhraseHit = true;
      debugSoftContinuitySuppressedReason = "rejected_phrase_hit";
      debugSecondarySuppressedReason = "soft_continuity_rejected_phrase_hit";
      keptSoftContinuity = null;
    } else {
      const overlap = computeSecondaryOverlapScore(keptSoftContinuity, assistantContent);
      if (overlap > SECONDARY_OVERLAP_THRESHOLD) {
        debugSoftContinuitySuppressedReason = "secondary_overlap_with_main_reflection";
        debugSecondarySuppressedReason = "soft_continuity_overlap_with_main_reflection";
        keptSoftContinuity = null;
      }
    }
  }

  // One-thought / one-secondary-layer rule:
  // - Keep last_insight if present; suppress soft_continuity entirely to avoid collisions.
  if (keptLastInsight) {
    keptSoftContinuity = null;
  }

  // Single-secondary rendering rule in response payload:
  // if we keep either last_insight or soft_continuity, suppress other optional secondary-like layers.
  const willRenderSecondaryFromLastOrSoft = Boolean(keptLastInsight || keptSoftContinuity);

  let keptPatternSurfacing: string | null = null;
  if (!willRenderSecondaryFromLastOrSoft && allowContinuityLayers && responseRecurrenceCue) {
    const t = responseLang === "zh" ? responseRecurrenceCue.textZh : responseRecurrenceCue.textEn;
    const san = sanitizeRejectedSpacePhrases(t);
    if (!san.hit && computeSecondaryOverlapScore(t, assistantContent) <= SECONDARY_OVERLAP_THRESHOLD) {
      keptPatternSurfacing = t;
    } else {
      // optional: also record a reason if needed later
    }
  }

  let keptMicroAwareness: string | null = null;
  if (!willRenderSecondaryFromLastOrSoft && responseAwarenessCue) {
    const t = responseLang === "zh" ? responseAwarenessCue.textZh : responseAwarenessCue.textEn;
    const san = sanitizeRejectedSpacePhrases(t);
    if (!san.hit && computeSecondaryOverlapScore(t, assistantContent) <= SECONDARY_OVERLAP_THRESHOLD) {
      keptMicroAwareness = t;
    } else {
      // suppressed
    }
  }

  let keptMicroShift: string | null = null;
  if (!willRenderSecondaryFromLastOrSoft && responseMicroshiftCue) {
    const t = responseLang === "zh" ? responseMicroshiftCue.textZh : responseMicroshiftCue.textEn;
    const san = sanitizeRejectedSpacePhrases(t);
    if (!san.hit && computeSecondaryOverlapScore(t, assistantContent) <= SECONDARY_OVERLAP_THRESHOLD) {
      keptMicroShift = t;
    } else {
      // suppressed
    }
  }

  // Debug: indicate which secondary layer survives de-dup + suppression-first.
  if (keptLastInsight) {
    debugSecondaryLayerType = "last_insight";
    debugSecondarySource = "last_insight";
    debugSecondarySourceValid = debugLastInsightSource === "previous_turn";
    debugSecondaryOverlapScore = computeSecondaryOverlapScore(keptLastInsight, assistantContent);
    debugSecondaryTemplateId = debugMilestoneICueFamily ?? null;
  } else if (keptSoftContinuity) {
    debugSecondaryLayerType = "soft_continuity";
    debugSecondarySource = "soft_continuity";
    debugSecondarySourceValid = debugMilestoneIOutcome === "emitted";
    debugSecondaryOverlapScore = computeSecondaryOverlapScore(keptSoftContinuity, assistantContent);
    debugSecondaryTemplateId = debugMilestoneICueFamily ?? null;
  } else {
    debugSecondaryLayerType = "none";
    debugSecondarySource = "none";
    debugSecondarySourceValid = false;
  }

  // Final response payload: strictly separated layers.
  const responsePayload = {
    main_reflection: assistantContent,
    ...(keptLastInsight ? { last_insight: keptLastInsight } : {}),
    ...(keptPatternSurfacing ? { pattern_surfacing: keptPatternSurfacing } : {}),
    ...(keptMicroAwareness ? { micro_awareness: keptMicroAwareness } : {}),
    ...(keptSoftContinuity ? { soft_continuity: keptSoftContinuity } : {}),
    ...(keptMicroShift ? { micro_shift: keptMicroShift } : {}),
  };

  const res = NextResponse.json({
    conversation_id: sessionId,
    response: responsePayload,
    meta: {
      lang: responseLang,
      timestamp: new Date().toISOString(),
    },
    assistant_message: assistantContent,
    ...(assistantMsgId ? { assistant_message_id: assistantMsgId } : {}),
    ...(reflectionState && { reflection_state: reflectionState }),
    ...(responseContinuityInsight && {
      continuity_insight: {
        id: responseContinuityInsight.id,
        continuity_key: responseContinuityInsight.continuityKey,
        core_pattern: responseContinuityInsight.corePattern,
        continuity_text: responseContinuityInsight.continuityText,
        created_at: responseContinuityInsight.createdAt.toISOString(),
        is_continuity_eligible: responseContinuityInsight.isContinuityEligible,
      },
    }),
    ...(responseRecurrenceCue && {
      recurrence_cue: {
        pattern_key: responseRecurrenceCue.patternKey,
        confidence: responseRecurrenceCue.confidence,
        confidence_score: responseRecurrenceCue.confidenceScore,
        text_en: responseRecurrenceCue.textEn,
        text_zh: responseRecurrenceCue.textZh,
        phase: responseRecurrenceCue.phase,
      },
    }),
    ...(responseEmbodimentCue && {
      embodiment_cue: {
        pattern_key: responseEmbodimentCue.patternKey,
        response_state: responseEmbodimentCue.responseState,
        text_en: responseEmbodimentCue.textEn,
        text_zh: responseEmbodimentCue.textZh,
      },
    }),
    ...(responseAwarenessCue && {
      awareness_cue: {
        kind: responseAwarenessCue.kind,
        text_en: responseAwarenessCue.textEn,
        text_zh: responseAwarenessCue.textZh,
      },
    }),
    ...(responseMicroshiftCue && {
      microshift_cue: {
        text_en: responseMicroshiftCue.textEn,
        text_zh: responseMicroshiftCue.textZh,
        render_mode: responseMicroshiftCue.render_mode,
      },
    }),
    // Debug-only fields to help QA distinguish:
    // - whether this turn created an Insight row
    // - whether that row was continuity-eligible
    // - full decision chain for that eligibility
    debug_insight_id: debugInsightId,
    debug_is_continuity_eligible: debugIsContinuityEligible,
    debug_last_insight_source: debugLastInsightSource,
    debug_last_insight_suppressed_reason: debugLastInsightSuppressedReason,
    debug_thread_state: threadState,
    debug_emotion_similarity: debugEmotionSimilarity,
    debug_interpretation_similarity: debugInterpretationSimilarity,
    debug_tension_similarity: debugTensionSimilarity,
    debug_weighted_thread_score: debugWeightedThreadScore,
    debug_soft_continuity_suppressed_reason: debugSoftContinuitySuppressedReason,
    debug_main_reflection_sufficient: debugMilestoneIMainReflectionSufficient === true,
    debug_overlap_with_main_reflection: debugOverlapWithMainReflection,
    debug_main_reflection_template_id: debugMainReflectionTemplateId,
    debug_secondary_layer_type: debugSecondaryLayerType,
    debug_secondary_template_id: debugSecondaryTemplateId,
    debug_secondary_source: debugSecondarySource,
    debug_secondary_source_valid: debugSecondarySourceValid,
    debug_secondary_overlap_score: debugSecondaryOverlapScore,
    debug_secondary_suppressed_reason: debugSecondarySuppressedReason,
    debug_rejected_phrase_hit: debugRejectedPhraseHit,
    debug_insight_core_pattern: debugInsightCorePattern,
    debug_has_strong_pattern_cue: debugHasStrongPatternCue,
    debug_is_flat_restatement: debugIsFlatRestatement,
    debug_is_vague_source: debugIsVagueSource,
    debug_all_labels_weak: debugAllLabelsWeak,
    debug_is_systemy: debugIsSystemy,
    debug_is_very_short: debugIsVeryShort,
    debug_is_too_short_and_flat: debugIsTooShortAndFlat,
    debug_is_too_generic: debugIsTooGeneric,
    debug_recurrence_pattern_family: debugRecurrencePatternFamily,
    debug_recurrence_pattern_id: debugRecurrencePatternId,
    debug_recurrence_same_family_count: debugRecurrenceSameFamilyCount,
    debug_recurrence_aligned_instance_count: debugRecurrenceAlignedInstanceCount,
    debug_recurrence_confidence_raw: debugRecurrenceConfidenceRaw,
    debug_recurrence_confidence_resolved: debugRecurrenceConfidenceResolved,
    debug_recurrence_newest_aligned_index: debugRecurrenceNewestAlignedIndex,
    debug_recurrence_cue_emitted: debugRecurrenceCueEmitted,
    debug_recurrence_e2_phase: debugRecurrenceE2Phase,
    debug_recurrence_e2_suppressed_stale_window: debugRecurrenceE2SuppressedStaleWindow,
    debug_recurrence_e2_suppressed_repeat: debugRecurrenceE2SuppressedRepeat,
    debug_recurrence_e2_newest_aligned_age_ms: debugRecurrenceE2NewestAlignedAgeMs,
    debug_recurrence_e2_persistence_downgraded: debugRecurrenceE2PersistenceDowngraded,
    debug_recurrence_e2_active_pattern_replaced: debugRecurrenceE2ActivePatternReplaced,
    debug_recurrence_e3_legibility_state: debugRecurrenceE3LegibilityState,
    debug_recurrence_e3_present_relevance: debugRecurrenceE3PresentRelevance,
    debug_recurrence_e3_clarity_gain: debugRecurrenceE3ClarityGain,
    debug_recurrence_e3_added_weight_risk: debugRecurrenceE3AddedWeightRisk,
    debug_recurrence_e3_proof_threshold_passed: debugRecurrenceE3ProofThresholdPassed,
    debug_recurrence_e3_suppressed_reason: debugRecurrenceE3SuppressedReason,
    debug_embodiment_f_build_marker: debugEmbodimentFBuildMarker,
    debug_embodiment_f_milestone_enabled: debugEmbodimentFMilestoneEnabled,
    debug_embodiment_f_outcome: debugEmbodimentFOutcome,
    debug_embodiment_f_suppressed_reason: debugEmbodimentFSuppressedReason,
    debug_embodiment_f_response_state: debugEmbodimentFResponseState,
    debug_embodiment_f_used_ultra_short: debugEmbodimentFUsedUltraShort,
    debug_milestone_g_integration_enabled: isMilestoneGIntegrationEnabled(),
    debug_milestone_g_system_appendix_applied: debugMilestoneGSystemAppendixApplied,
    debug_milestone_g_build_marker: milestoneGBuildMarker(),
    debug_milestone_h_enabled: debugMilestoneHEnabled,
    debug_milestone_h_build_marker: milestoneHBuildMarker(),
    debug_milestone_h_light_mode_appendix_applied: debugMilestoneHLightModeAppendixApplied,
    debug_milestone_h_light_mode_build_marker: milestoneHLightModeBuildMarker(),
    debug_milestone_h_outcome: debugMilestoneHOutcome,
    debug_milestone_h_suppressed_reason: debugMilestoneHSuppressedReason,
    debug_milestone_h_kind: responseAwarenessCue?.kind ?? null,
    debug_milestone_h_input_has_reflective_anchor: hasReflectiveFirstPersonAnchor(message),
    debug_milestone_h_input_looks_utilitarian_or_factual: looksUtilitarianOrFactual(message),
    debug_input_raw_has_reflective_anchor:
      typeof rawMessage === "string" ? hasReflectiveFirstPersonAnchor(rawMessage) : null,
    debug_input_raw_looks_utilitarian_or_factual:
      typeof rawMessage === "string" ? looksUtilitarianOrFactual(rawMessage) : null,
    debug_input_raw_has_cjk: inputNorm.rawHasCjk,
    debug_input_norm_repaired_applied: inputNorm.repairedApplied,
    debug_input_norm_repaired_has_cjk: inputNorm.repairedHasCjk,
    debug_input_norm_suspected_mojibake: inputNorm.suspectedMojibake,
    debug_ingress_raw_summary: rawIngressSummary,
    debug_ingress_normalized_summary: normalizedIngressSummary,
    debug_language_wants_chinese: wantsChinese,
    debug_language_has_cjk_before_rewrite: debugZhHasCjkBeforeRewrite,
    debug_language_rewrite_attempted: debugZhRewriteAttempted,
    debug_language_rewrite_applied: debugZhRewriteApplied,
    debug_language_has_cjk_after_rewrite: debugZhHasCjkAfterRewrite,
    debug_milestone_i_enabled: debugMilestoneIEnabled,
    debug_milestone_i_build_marker: milestoneIBuildMarker(),
    debug_milestone_i_outcome: debugMilestoneIOutcome,
    debug_milestone_i_suppressed_reason: debugMilestoneISuppressedReason,
    debug_milestone_i_cue_family: debugMilestoneICueFamily,
    debug_milestone_i_cue_text_en: debugMilestoneICueTextEn,
    debug_milestone_i_cue_text_zh: debugMilestoneICueTextZh,
    debug_milestone_i_previous_family: debugMilestoneIPreviousFamily,
    debug_milestone_i_current_family: debugMilestoneICurrentFamily,
    debug_milestone_i_family_matched: debugMilestoneIFamilyMatched,
    debug_milestone_i_family_compatible: debugMilestoneIFamilyCompatible,
    debug_milestone_i_thread_strength: debugMilestoneIThreadStrength,
    debug_milestone_i_user_reflective_structure: debugMilestoneIUserReflectiveStructure,
    debug_milestone_i_main_reflection_sufficient: debugMilestoneIMainReflectionSufficient,
    debug_milestone_i_signature_score: debugMilestoneISignatureScore,
    debug_milestone_i_signature_tier: debugMilestoneISignatureTier,
    debug_milestone_i_signature_rescued_thread: debugMilestoneISignatureRescuedThread,
    debug_milestone_i_core_thread_family: debugMilestoneICoreThreadFamily,
    debug_milestone_i_core_confidence: debugMilestoneICoreConfidence,
    debug_milestone_i_core_reasons: debugMilestoneICoreReasons,
    debug_milestone_i_core_use_fallback_generic: debugMilestoneICoreUseFallbackGeneric,
    debug_milestone_i_promotion_confidence: debugMilestoneIPromotionConfidence,
    debug_milestone_i_cross_family_blocked: debugMilestoneICrossFamilyBlocked,
    debug_milestone_i_weight_guard_triggered: debugMilestoneIWeightGuardTriggered,
    debug_milestone_i_weak_promotion_bridge_used: debugMilestoneIWeakPromotionBridgeUsed,
    debug_milestone_i_weak_survival_corridor_decision:
      debugMilestoneIWeakSurvivalCorridorDecision,
    debug_milestone_i_weak_survival_corridor_template_allowance:
      debugMilestoneIWeakSurvivalCorridorTemplateAllowance,
    debug_milestone_i_weak_survival_corridor_reasons:
      debugMilestoneIWeakSurvivalCorridorReasons,
    debug_milestone_i_weak_edge_admission_decision:
      debugMilestoneIWeakEdgeAdmissionDecision,
    debug_milestone_i_weak_edge_admission_reasons:
      debugMilestoneIWeakEdgeAdmissionReasons,
    debug_milestone_i_weak_edge_self_turn_strength:
      debugMilestoneIWeakEdgeSelfTurnStrength,
    debug_milestone_i_weak_edge_purely_historical:
      debugMilestoneIWeakEdgePurelyHistorical,
    debug_milestone_i_weak_edge_faint_residual_self_turn_present:
      debugMilestoneIWeakEdgeFaintResidualSelfTurnPresent,
    debug_milestone_i_weak_edge_current_turn_live_enough:
      debugMilestoneIWeakEdgeCurrentTurnLiveEnough,
    debug_milestone_i_weak_edge_residual_movement_decision:
      debugMilestoneIWeakEdgeResidualMovementDecision,
    debug_milestone_i_weak_edge_residual_movement_reasons:
      debugMilestoneIWeakEdgeResidualMovementReasons,
    debug_milestone_i_weak_edge_residual_carry_shape_used:
      debugMilestoneIWeakEdgeResidualCarryShapeUsed,
    debug_milestone_i_h_overlap_prefer_i_activated:
      debugMilestoneIHOverlapPreferIActivated,
    debug_milestone_i_h_overlap_routing_decision:
      debugMilestoneIHOverlapRoutingDecision,
    debug_milestone_i_h_overlap_routing_reasons:
      debugMilestoneIHOverlapRoutingReasons,
    debug_milestone_i_h_overlap_i_valid: debugMilestoneIHOverlapIValid,
    debug_milestone_i_h_overlap_i_invalid_reasons:
      debugMilestoneIHOverlapIInvalidReasons,
    debug_milestone_i_h_overlap_family_shift_relaxed:
      debugMilestoneIHOverlapFamilyShiftRelaxed,
    debug_milestone_i_h_overlap_admission_confidence_bridge_used:
      debugMilestoneIHOverlapAdmissionConfidenceBridgeUsed,
    debug_milestone_i_promotion_state: debugMilestoneIPromotionState,
    debug_milestone_i_promotion_template_allowance: debugMilestoneIPromotionTemplateAllowance,
    debug_milestone_i_promotion_reasons: debugMilestoneIPromotionReasons,
    debug_milestone_j_enabled: debugMilestoneJEnabled,
    debug_milestone_j_build_marker: milestoneJBuildMarker(),
    debug_milestone_j_outcome: debugMilestoneJOutcome,
    debug_milestone_j_suppressed_reason: debugMilestoneJSuppressedReason,
    debug_milestone_j_eligibility: debugMilestoneJEligibility,
    debug_milestone_j_allow_render_mode: debugMilestoneJAllowRenderMode,
    debug_milestone_j_reasons: debugMilestoneJReasons,
    debug_milestone_j_rollback_risk: debugMilestoneJRollbackRisk,
    ...(body.debug
      ? {
          debug: {
            layers: {
              D_reflection: Boolean(reflectionState),
              E_pattern: Boolean(responseRecurrenceCue),
              H_micro_awareness: Boolean(responseAwarenessCue),
              I_continuity: Boolean(
                (responseLang === "zh" ? debugMilestoneICueTextZh : debugMilestoneICueTextEn) ??
                  responseContinuityInsight?.continuityText
              ),
              J_micro_shift: Boolean(responseMicroshiftCue),
            },
            suppression: {
              E_suppressed: !Boolean(responseRecurrenceCue),
              H_suppressed: debugMilestoneHOutcome === "suppressed",
              I_suppressed: debugMilestoneIOutcome === "suppressed",
            },
            reasoning_tags: [
              debugMilestoneHSuppressedReason,
              debugMilestoneISuppressedReason,
              debugMilestoneJSuppressedReason,
            ].filter((v): v is string => typeof v === "string" && v.length > 0),
          },
        }
      : {}),
    feedback_saved: feedbackSaved,
  });
  if (sessionCookie) {
    res.headers.append("Set-Cookie", sessionCookie);
  }
  return res;
}
