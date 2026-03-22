import {
  detectContinuityPatternFamily,
  type ContinuityPatternFamily,
} from "@/lib/wisewave-continuity-family";

/**
 * Milestone H — micro awareness cue (minimal engine).
 * Aligned to:
 * - docs/HC_OS_V1_Milestone_H_Addendum_Minimal_Everyday_Integration_Micro_Awareness_Layer.md
 * - docs/HC_OS_V1_Milestone_H_OctopusMind_Two_Gate_Structural_Experiential_Doctrine.md (Gate 1 + Gate 2)
 * - docs/HC_OS_V1_Milestone_H_Wisewave_Consciousness_Quality_Boundary_Layer.md
 *
 * Default-off: set ENABLE_H_CUE=true or ENABLE_H_CUE=1 to render.
 */

const BUILD_MARKER = "milestone_h_v1";

/** Global kill switch: H only when explicitly enabled. */
export function isMilestoneHCueEnabled(): boolean {
  const v = process.env.ENABLE_H_CUE?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export function milestoneHBuildMarker(): string {
  return BUILD_MARKER;
}

export type MicroAwarenessKind = "H1" | "H3" | "H4" | "H5";

export type MilestoneHSuppressedReason =
  | "milestone_h_disabled"
  | "no_reflection_state"
  | "thin_user_message"
  | "utilitarian_or_factual"
  | "vague_source"
  | "recurrence_overlap_e"
  /** E2 proved aligned recurrence (≥2 instances) but recurrence strip withheld (E3, repeat, stale, low confidence, etc.) — H still yields to E. */
  | "recurrence_overlap_e_structural"
  | "weak_evidence_insight"
  | "consecutive_turn"
  | "gate2_experiential_silence"
  /** Lumen Batch 2 stabilization: flat hedge / minimal affect (“I guess it’s okay”) — not enough signal for H. */
  | "minimal_affect_low_signal"
  | "emitted";

export type MilestoneHOutcome =
  | {
      status: "emitted";
      kind: MicroAwarenessKind;
      textEn: string;
      textZh: string;
    }
  | { status: "suppressed"; reason: Exclude<MilestoneHSuppressedReason, "emitted"> };

/** Same vague-source heuristic family as /api/chat/turn (subset; keep in sync for parity). */
const VAGUE_SOURCE_SNIPPETS = [
  "feel off",
  "feels off",
  "something feels weird",
  "i'm tired",
  "i am tired",
  "不确定",
  "我不知道",
  "不知道",
  "说不清",
  "not sure",
  "i don't know",
  "i dont know",
];

function isVagueUserMessage(message: string): boolean {
  const sourceLower = message.trim().toLowerCase();
  return VAGUE_SOURCE_SNIPPETS.some((p) => sourceLower.includes(p));
}

/**
 * Task / help / utilitarian asks that still contain “I” or “me” (false reflective anchor).
 * Lumen Batch 2: H3 leaked on summarize / email-help turns — suppress H entirely.
 */
function looksTaskHelpOrUtilitarianRequest(message: string): boolean {
  const t = message.trim();
  const lower = t.toLowerCase();

  if (
    /^(can|could|would)\s+you\s+(please\s+)?(summarize|sum\s+up|help|write|draft|edit|explain|translate|review|proofread|create|list|fix|complete|rewrite|outline|polish|check|analyze|analyse)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  if (/^(please|pls)\s+(summarize|sum\s+up|help|write|draft)\b/i.test(lower)) return true;
  if (/\b(can|could)\s+you\s+(please\s+)?(summarize|sum\s+up|help\s+me|write|draft)\b/i.test(lower)) {
    return true;
  }
  if (/^i need (help|you to|a hand)\b/i.test(lower)) return true;
  if (/^i want (you to|help)\b/i.test(lower)) return true;
  if (/help (me )?(to )?(write|draft|with (writing|an email|my email|the email))\b/i.test(lower)) {
    return true;
  }
  if (/\b(write|draft|compose)\s+(an |the )?email\b/i.test(lower) && /\b(help|need|can you|could you)\b/i.test(lower)) {
    return true;
  }
  if (/\bsummarize (this|the) (article|post|paper|text|document|email)\b/i.test(lower)) return true;

  if (/帮我(写|总结|起草|改|翻译)/.test(t)) return true;
  if (/(请|麻烦)(总结|帮我写|帮忙写)/.test(t)) return true;

  return false;
}

/** Normalize typographic apostrophes so flat-affect regexes match smart-quoted input. */
function normalizeApostrophesForHeuristics(s: string): string {
  return s.replace(/\u2019|\u2018/g, "'");
}

/**
 * Very thin affect / everyday hedge — not enough substrate for H (Lumen Batch 2).
 * Scenario 12: "I don't feel anything in particular." — requires `'` or `’` normalization + explicit in-particular path.
 */
function isMinimalAffectOrFlatHedge(message: string): boolean {
  const t = normalizeApostrophesForHeuristics(message.trim().toLowerCase());
  if (t.length > 120) return false;

  if (/\bi guess\b/.test(t)) return true;
  if (/\bit\s*'?s okay\b/.test(t) || /\bits okay\b/.test(t)) return true;
  if (/\bi suppose\b/.test(t) && t.length < 55) return true;

  // Flat / absent affect (EN): any apostrophe variant handled via normalizeApostrophesForHeuristics
  if (
    /don'?t feel anything|dont feel anything|do not feel anything|nothing in particular|not feeling (much|anything)|feel nothing|feel numb|just numb/i.test(
      t
    )
  ) {
    return true;
  }
  // "… feel … in particular" often = no clear feeling / flat signal (Lumen scenario 12)
  if (/\bfeel\b[^.!?]{0,40}\bin particular\b/.test(t)) return true;
  if (/\bi don'?t really feel\b/i.test(t)) return true;
  if (/\bno particular feeling\b|\bnot feeling anything particular\b/i.test(t)) return true;

  return false;
}

/**
 * Detects first-person reflective intent for **English, Chinese, and mixed** input.
 *
 * **Important:** `\b` word boundaries in JS do **not** work around CJK characters
 * (they only bracket `[A-Za-z0-9_]`). A regex like `\b(我觉得)\b` will **not** match
 * typical Chinese sentences, which caused false `utilitarian_or_factual` suppression
 * on valid ZH reflective turns (Lumen Pass 7).
 */
export function hasReflectiveFirstPersonAnchor(message: string): boolean {
  const t = message.trim();
  if (!t) return false;

  const hasCjk = /[\u4E00-\u9FFF]/.test(t);

  if (hasCjk) {
    // Chinese: 我 as clause-initial subject, or common reflective openers (no \b)
    if (/^我/.test(t)) return true;
    if (/^自己(也|在|总|会|想|要)/.test(t)) return true;
    if (
      /(我觉得|我感到|我想|我总|我的|我自己|我有一部分|另一部分|只要我|只要我一|我总觉得|我就觉得|我总会|我一慢|我慢下来)/.test(t)
    )
      return true;
    // 我… after sentence break (mid-message first person)
    if (/[，。！？、][\s]*我[^。！？]{0,24}(觉得|感到|想|总|会|有|在|也|只|能|的|一)/.test(t)) return true;
  }

  const lower = t.toLowerCase();
  if (
    /\b(i|i'm|i am|my|me|we|i've|i feel|i felt|i keep|i still|i can't|i cannot|i'm trying)\b/i.test(
      lower
    )
  )
    return true;

  // Mixed / explicit ZH phrases in otherwise Latin text
  if (/我觉得|我感到|我想|我的/.test(t)) return true;

  return false;
}

function looksUtilitarianOrFactual(message: string): boolean {
  const t = message.trim();
  if (t.length < 8) return true;

  if (looksTaskHelpOrUtilitarianRequest(t)) return true;

  // Reflective first-person (ZH/EN) first — avoids false positives on 怎么… when 我/我觉得 follows
  if (hasReflectiveFirstPersonAnchor(t)) {
    // Still block obvious English homework / lookup patterns
    if (/^(what|when|where|who|which|how)\s+(is|are|was|were|do|does|did|can|could|would|should)\b/i.test(t))
      return true;
    if (/^(define|explain|translate|calculate|list|give me)\b/i.test(t)) return true;
    if (/^\d+[\s\+\-*\/=]/.test(t)) return true;
    if (/^(http|https):\/\//i.test(t)) return true;
    return false;
  }

  // Obvious non-reflective asks
  if (/^(what|when|where|who|which|how)\s+(is|are|was|were|do|does|did|can|could|would|should)\b/i.test(t))
    return true;
  if (/^(define|explain|translate|calculate|list|give me)\b/i.test(t)) return true;
  if (/^\d+[\s\+\-*\/=]/.test(t)) return true;
  if (/^(http|https):\/\//i.test(t)) return true;

  // Chinese informational openers (e.g. 什么是…, 怎么办理…) — no reflective anchor matched above
  const trim = t.trim();
  if (/[\u4E00-\u9FFF]/.test(trim) && /^(什么|怎么|如何|为什么|哪里|哪个|哪個|是否)/.test(trim)) {
    return true;
  }

  // Short message without reflective anchor → likely ping / fragment
  if (t.length < 40) return true;

  return false;
}

function hasStrongInsightSignal(insight: string): boolean {
  const lower = insight.toLowerCase();
  return (
    insight.trim().length >= 48 ||
    /(inner rule|pressure|loop|demand|pattern|prove|enough|conflict|torn|both|pull|uncertainty)/i.test(
      lower
    )
  );
}

function hashPick(seed: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return modulo > 0 ? h % modulo : 0;
}

/** H1 — generic micro awareness */
const H1_TEMPLATES = {
  en: [
    "Something here might be worth noticing — without needing it to be named yet.",
    "A little space might be here to notice what’s present, without fixing it.",
  ],
  zh: [
    "这里或许有值得留意的地方，还不必急着把它说清楚。",
    "此刻也许有一点空间，去留意正在发生什么，而不必马上整理它。",
  ],
};

/** H3 — pause-opening */
const H3_TEMPLATES = {
  en: [
    "There can be a little room here, without deciding what comes next.",
    "A pause might be enough; nothing else has to be decided right now.",
  ],
  zh: [
    "这里可以有一点空间，不必马上决定下一步。",
    "有时候停一下就够了，不必立刻把事情想完。",
  ],
};

/** H4 — over-effort softening */
const H4_TEMPLATES = {
  en: [
    "The push to get it right might be loose enough to ease, even slightly.",
    "The effort to hold it all together might not need the same tightness here.",
  ],
  zh: [
    "那种想把事情做对、把局面撑住的用力，或许可以稍微松一点点。",
    "想把一切都扛稳的劲儿，在这里也许不必绷得那么满。",
  ],
};

/** H5 — gentle inner-split */
const H5_TEMPLATES = {
  en: [
    "Two pulls might be here at once; noticing that can be enough.",
    "A divided tug might be present — it can be enough to see it lightly.",
  ],
  zh: [
    "两种拉扯可能同时在这里；轻轻看到，也许就够了。",
    "心里也许有两股方向在拉；先看见，而不必马上选边。",
  ],
};

function pickTemplate(kind: MicroAwarenessKind, seed: string): { en: string; zh: string } {
  const pool =
    kind === "H1"
      ? H1_TEMPLATES
      : kind === "H3"
        ? H3_TEMPLATES
        : kind === "H4"
          ? H4_TEMPLATES
          : H5_TEMPLATES;
  const i = hashPick(`${seed}:${kind}`, pool.en.length);
  return { en: pool.en[i]!, zh: pool.zh[i]! };
}

/**
 * Gate 1 (structural) + Gate 2 (experiential) + deterministic template pick.
 * H2 pattern-bridge omitted in v1 minimal path (high E/continuity duplication risk).
 */
export function computeMicroAwarenessCue(params: {
  userMessage: string;
  /** Monotonic id for template selection + tests */
  seed: string;
  reflectionState: {
    insight_candidate: string;
    trigger_label: string;
    emotion_label: string;
    interpretation_label: string;
  } | null;
  /** True if Milestone E recurrence_cue was emitted this turn */
  recurrenceCueEmitted: boolean;
  /**
   * Milestone E2 aligned instance count (includes current insight), when continuity path ran.
   * When ≥2 but `recurrenceCueEmitted` is false, recurrence was proven structurally but the strip
   * was withheld — suppress H anyway (stack / E-wins discipline; stabilization 2026-02).
   */
  recurrenceAlignedInstanceCount: number | null;
  /** Insight core pattern when saved (English); null if no insight */
  insightCorePattern: string | null;
  previousAssistantHadAwarenessCue: boolean;
}): MilestoneHOutcome {
  if (!isMilestoneHCueEnabled()) {
    return { status: "suppressed", reason: "milestone_h_disabled" };
  }

  const { userMessage, reflectionState, recurrenceCueEmitted, seed } = params;

  if (!reflectionState || !reflectionState.insight_candidate.trim()) {
    return { status: "suppressed", reason: "no_reflection_state" };
  }

  const insight = reflectionState.insight_candidate.trim();
  if (userMessage.trim().length < 18) {
    return { status: "suppressed", reason: "thin_user_message" };
  }

  if (looksUtilitarianOrFactual(userMessage)) {
    return { status: "suppressed", reason: "utilitarian_or_factual" };
  }

  if (isVagueUserMessage(userMessage)) {
    return { status: "suppressed", reason: "vague_source" };
  }

  if (isMinimalAffectOrFlatHedge(userMessage)) {
    return { status: "suppressed", reason: "minimal_affect_low_signal" };
  }

  if (recurrenceCueEmitted) {
    return { status: "suppressed", reason: "recurrence_overlap_e" };
  }

  const aligned = params.recurrenceAlignedInstanceCount;
  if (aligned != null && aligned >= 2) {
    return { status: "suppressed", reason: "recurrence_overlap_e_structural" };
  }

  if (!hasStrongInsightSignal(insight)) {
    return { status: "suppressed", reason: "weak_evidence_insight" };
  }

  if (params.previousAssistantHadAwarenessCue) {
    return { status: "suppressed", reason: "consecutive_turn" };
  }

  // Gate 2 — experiential: silence if insight reads like flat restatement / generic
  const lower = insight.toLowerCase();
  const genericBad =
    lower === "you were upset today." ||
    lower === "you had a hard conversation." ||
    /too ambiguous to infer|insufficient signal|unable to infer/i.test(lower);
  if (genericBad || insight.length < 28) {
    return { status: "suppressed", reason: "gate2_experiential_silence" };
  }

  // Kind selection (no H2 in minimal v1)
  const fam: ContinuityPatternFamily = params.insightCorePattern
    ? detectContinuityPatternFamily(params.insightCorePattern)
    : "fallback_generic";
  let kind: MicroAwarenessKind = "H1";
  if (
    fam === "constant_pressure_keep_up" ||
    fam === "earned_value_after_effort" ||
    /prove|pressure|enough|push|strive|effort|keep up|perform/i.test(insight)
  ) {
    kind = "H4";
  } else if (
    /\b(but|yet|torn|two|both|pull|split|conflict|一边|却|但又|矛盾)/i.test(insight)
  ) {
    kind = "H5";
  } else if (
    // H3 only from **user text** uncertainty — not emotion_label alone (Lumen Batch 2: H3 overreach).
    /\?|不确定|不知道|说不清|说不准|拿不准|unsure|don'?t know|not sure|maybe\b|perhaps\b|no idea|who knows|纠结|犹豫|该不该/i.test(
      userMessage
    )
  ) {
    kind = "H3";
  } else {
    kind = "H1";
  }

  const pair = pickTemplate(kind, seed);
  return {
    status: "emitted",
    kind,
    textEn: pair.en.replace(/\n/g, " ").trim(),
    textZh: pair.zh.replace(/\n/g, " ").trim(),
  };
}
