/**
 * Milestone I — soft continuity carry-over (minimal engine)
 *
 * Boundary intent (per Milestone I addendum):
 * - Carry a felt thread lightly across nearby moments
 * - Suppression-first: if uncertain, suppress
 * - If overlaps with E (recurrence cue) or H (micro awareness), suppress I first
 * - No visible continuity layer / no explicit recall / no pattern replay
 */

import type { ExtractedReflectionState } from "@/lib/wisewave-extract";
import {
  detectContinuityPatternFamily,
  type ContinuityPatternFamily,
} from "@/lib/wisewave-continuity-family";
import {
  extractThreadSignature,
  scoreThreadFamilyMatch,
  type ThreadFamilyTier,
} from "@/lib/wisewave-milestone-i-thread-signature";

/** Bump when Milestone I cue semantics change. */
const BUILD_MARKER = "milestone_i_soft_continuity_v3";

/** Global kill switch: I only when explicitly enabled. */
export function isMilestoneICarryoverEnabled(): boolean {
  const v = process.env.ENABLE_I_CARRYOVER?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export function milestoneIBuildMarker(): string {
  return BUILD_MARKER;
}

export type MilestoneICueFamily =
  | "residual_background_presence"
  | "softened_continuation"
  | "lingering_tenderness"
  | "quiet_unresolvedness"
  | "same_space_coherence"
  | "ultra_light_fallback";

export type MilestoneISuppressedReason =
  | "milestone_i_disabled"
  | "no_reflection_state"
  | "thin_user_message"
  | "utilitarian_or_factual"
  | "vague_source"
  | "minimal_affect_low_signal"
  | "recurrence_overlap_e"
  | "awareness_overlap_h"
  | "explicit_recall_dependency"
  | "visibility_risk"
  | "main_reflection_sufficient"
  | "thread_not_supported"
  | "weak_thread_candidate";

export type MilestoneIDebugPath = {
  previousFamily: ContinuityPatternFamily | null;
  currentFamily: ContinuityPatternFamily | null;
  familyMatched: boolean;
  familyCompatible: boolean;
  threadStrength: "none" | "weak" | "moderate" | "strong" | null;
  userReflectiveStructure: boolean;
  mainReflectionSufficient: boolean;
  /** Recognition-layer score (trigger/movement/direction/tone); null if no prior user turn. */
  signatureScore: number | null;
  signatureTier: ThreadFamilyTier | null;
  /** True when lexical family failed but signature tier carried the thread. */
  signatureRescuedThread: boolean;
};

export type MilestoneIOutcome =
  | {
      status: "emitted";
      cueFamily: MilestoneICueFamily;
      textEn: string;
      textZh: string;
      debugPath: MilestoneIDebugPath;
    }
  | { status: "suppressed"; reason: MilestoneISuppressedReason; debugPath: MilestoneIDebugPath };

const VAGUE_SOURCE_SNIPPETS = [
  "i don't know",
  "i dont know",
  "not sure",
  "not sure what's wrong",
  "not sure what is wrong",
  "不确定",
  "我不知道",
  "不知道",
  "说不清",
  "说不出哪里不对",
  "感觉不对",
  "感觉很奇怪",
  "feel off",
  "feels off",
  "something feels weird",
];

function normalizeApostrophesForHeuristics(s: string): string {
  return s.replace(/\u2019|\u2018/g, "'");
}

function looksUtilitarianOrFactual(message: string): boolean {
  const t = message.trim();
  const lower = t.toLowerCase();
  if (t.length < 8) return true;

  // obvious homework / lookup patterns
  if (/^(what|when|where|who|which|how)\s+(is|are|was|were|do|does|did|can|could|would|should)\b/i.test(lower)) {
    return true;
  }
  if (/^(define|explain|translate|calculate|list|give me)\b/i.test(lower)) return true;
  if (/^\d+[\s\+\-*\/=]/.test(t)) return true;
  if (/^(http|https):\/\//i.test(lower)) return true;

  // common EN task/help scaffolds
  if (
    /^(can|could|would)\s+you\s+(please\s+)?(help|write|draft|explain|proofread|translate|review|summarize)\b/i.test(lower)
  ) {
    return true;
  }
  if (/^please\s+(help|write|draft|summarize|translate|review)\b/i.test(lower)) return true;

  // a small ZH utilitarian pattern set
  if (/[请麻烦帮我]\s*(总结|写|起草|翻译)/.test(t)) return true;

  return false;
}

function isVagueUserMessage(message: string): boolean {
  const sourceLower = message.trim().toLowerCase();
  return VAGUE_SOURCE_SNIPPETS.some((p) => sourceLower.includes(p));
}

function isMinimalAffectOrFlatHedge(userMessage: string): boolean {
  const t = normalizeApostrophesForHeuristics(userMessage.trim().toLowerCase());
  // Lightweight hedge / "it's okay" style without durable structure
  if (/\bi guess\b/.test(t)) return true;
  if (/\bit('?s| is)\s+okay\b/.test(t) || /\bits okay\b/.test(t)) return true;
  if (/\bi suppose\b/.test(t) && t.length < 55) return true;
  if (
    /dont feel anything|don'?t feel anything|nothing in particular|not feeling anything|feel nothing|feel numb/i.test(
      t
    )
  ) {
    return true;
  }
  if (/\bnot sure\b|\bunsure\b|\bmaybe\b|\bperhaps\b/.test(t)) return true;
  return false;
}

function hasStrongPatternCue(insightLower: string): boolean {
  return (
    /(inner rule|pressure|loop|demand|pattern|prove|enough|conflict|torn|both|pull)/i.test(insightLower) ||
    insightLower.trim().length >= 48
  );
}

function isExplicitRecallRisk(userMessage: string): boolean {
  const t = userMessage.trim().toLowerCase();
  return (
    [
      "as before",
      "like before",
      "earlier you said",
      "you just said",
      "this came up before",
      "you already said",
    ].some((p) => t.includes(p)) ||
    /像之前一样|你前面说过|这之前出现过|这又来了/.test(userMessage)
  );
}

function hashPick(seed: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return modulo > 0 ? h % modulo : 0;
}

function userHasReflectiveStructureForCarryover(message: string): boolean {
  const t = normalizeApostrophesForHeuristics(message.trim());
  return (
    /\b(because|although|whenever|every time|always|never|even though|i keep|i always|i end up|pattern|loop|keeps happening)\b/i.test(
      t
    ) || /(因为|虽然|每次|总是|可是|但是|却又|一直)/.test(t)
  );
}

function mainReflectionSufficientHeuristic(args: {
  userMessage: string;
  reflection: ExtractedReflectionState;
}): boolean {
  // Reflection tends to already carry coherence when the user explicitly references the pattern language.
  const u = normalizeApostrophesForHeuristics(args.userMessage.trim().toLowerCase());
  const ins = args.reflection.insight_candidate.trim().toLowerCase();

  const explicitPatternRef =
    /\b(prove|worth|enough|earned|earn|pressure|loop|rest|break|relax|deserve)\b/i.test(u) ||
    /证明|够好|不配|休息|放松|愧疚|内疚|压力|循环|压力感/.test(args.userMessage) ||
    /证明自己/.test(args.userMessage);

  // If the insight is already a strong rule/pressure statement and the user also points to the pattern,
  // treat I as likely redundant.
  return explicitPatternRef && hasStrongPatternCue(ins);
}

function detectThreadSupport(args: {
  current: ExtractedReflectionState;
  previous: ExtractedReflectionState | null;
  currentUserMessage: string;
  previousUserMessage: string | null;
}): {
  threadStrength: "none" | "weak" | "moderate" | "strong";
  family: ContinuityPatternFamily;
  signatureScore: number | null;
  signatureTier: ThreadFamilyTier | null;
  signatureRescuedThread: boolean;
} {
  const currentFamily = detectContinuityPatternFamily(args.current.insight_candidate);
  const prevFamily = args.previous
    ? detectContinuityPatternFamily(args.previous.insight_candidate)
    : null;

  const family: ContinuityPatternFamily = currentFamily;
  const isCompatible =
    !!prevFamily &&
    ((prevFamily === "replay_for_mistakes" &&
      currentFamily === "delayed_reply_means_i_did_something_wrong") ||
      (prevFamily === "delayed_reply_means_i_did_something_wrong" &&
        currentFamily === "replay_for_mistakes"));

  let signatureScore: number | null = null;
  let signatureTier: ThreadFamilyTier | null = null;
  if (args.previous && args.previousUserMessage?.trim()) {
    const sigPrev = extractThreadSignature(
      args.previousUserMessage,
      args.previous.insight_candidate
    );
    const sigCur = extractThreadSignature(
      args.currentUserMessage,
      args.current.insight_candidate
    );
    const m = scoreThreadFamilyMatch(sigPrev, sigCur);
    signatureScore = m.score;
    signatureTier = m.tier;
  }

  const lexicalMatched =
    !!args.previous && !!prevFamily && (prevFamily === currentFamily || isCompatible);

  if (lexicalMatched) {
    if (family === "fallback_generic") {
      return {
        threadStrength: "weak",
        family,
        signatureScore,
        signatureTier,
        signatureRescuedThread: false,
      };
    }
    const insightLen = args.current.insight_candidate.trim().length;
    const reflective = userHasReflectiveStructureForCarryover(args.current.insight_candidate);
    const threadStrength: "moderate" | "strong" =
      insightLen >= 55 || reflective ? "strong" : "moderate";
    return {
      threadStrength,
      family,
      signatureScore,
      signatureTier,
      signatureRescuedThread: false,
    };
  }

  // Recognition layer: wording shifted but movement + direction may still match.
  if (!args.previous || !args.previousUserMessage?.trim() || signatureTier == null) {
    return {
      threadStrength: "none",
      family,
      signatureScore,
      signatureTier,
      signatureRescuedThread: false,
    };
  }

  if (signatureTier === "new_thread") {
    return {
      threadStrength: "none",
      family,
      signatureScore,
      signatureTier,
      signatureRescuedThread: false,
    };
  }

  if (signatureTier === "weak_family") {
    return {
      threadStrength: "weak",
      family,
      signatureScore,
      signatureTier,
      signatureRescuedThread: true,
    };
  }

  const insightLen = args.current.insight_candidate.trim().length;
  const reflective = userHasReflectiveStructureForCarryover(args.current.insight_candidate);
  const threadStrength: "moderate" | "strong" =
    insightLen >= 55 || reflective ? "strong" : "moderate";
  return {
    threadStrength,
    family,
    signatureScore,
    signatureTier,
    signatureRescuedThread: true,
  };
}

const FAMILY_TEMPLATES: Record<MilestoneICueFamily, { en: string[]; zh: string[] }> = {
  residual_background_presence: {
    en: [
      "There still seems to be a little of that in the background here.",
      "Something of it may still be nearby, even if it is quieter now.",
      "A trace of that still seems present here.",
      "It feels like a little of that may still be sitting underneath this.",
      "Some of that atmosphere still seems to be lingering here.",
    ],
    zh: [
      "这里似乎还留着一点那样的背景感觉。",
      "那种东西可能还在附近，只是现在轻了一些。",
      "这里好像还带着一点它留下的痕迹。",
      "这下面似乎还隐约放着一点那个感觉。",
      "那种氛围好像还在这里轻轻停留着。",
    ],
  },
  softened_continuation: {
    en: [
      "This still feels close to the same inner space, just a little softer now.",
      "Something similar seems to be still here, though not in quite the same way.",
      "The thread may still be present here, but with less force.",
      "This seems connected to the same space, though it is landing differently now.",
      "Some of that still seems to be moving through here, just more quietly.",
    ],
    zh: [
      "这感觉还是靠近同一个内在空间，只是现在柔了一些。",
      "这里似乎还在延续某种相似的东西，只是已经不完全一样了。",
      "那条线可能还在这里，只是力道没有那么强了。",
      "这好像还连着同一个空间，只是现在落下来的方式不同了。",
      "那种东西似乎还在这里流动，只是更安静了一些。",
    ],
  },
  lingering_tenderness: {
    en: [
      "Something in this still feels a little tender.",
      "There still seems to be some sensitivity around this.",
      "This space still feels slightly open in a delicate way.",
      "Some part of this still seems gently unsettled.",
      "There is still a little softness here that seems worth staying close to.",
    ],
    zh: [
      "这当中似乎还有一点柔软而敏感的地方。",
      "这里好像还带着一点轻微的敏感感。",
      "这个空间似乎还在一种细微敞开的状态里。",
      "这当中有一部分似乎还轻轻地没有完全安定下来。",
      "这里好像还有一点柔软，值得轻轻贴近。",
    ],
  },
  quiet_unresolvedness: {
    en: [
      "This does not seem fully settled yet.",
      "Something here still feels a little unfinished.",
      "There may still be a part of this that has not quite landed.",
      "This feels like it is still finding its place.",
      "Something in this still seems to be resting slightly open.",
    ],
    zh: [
      "这似乎还没有完全落定下来。",
      "这里好像还有一点没有真正走完。",
      "这当中可能还有一部分还没有真正落下去。",
      "这感觉像是还在慢慢找到它的位置。",
      "这里似乎还有一点轻轻敞着，没有完全合上。",
    ],
  },
  same_space_coherence: {
    en: [
      "This still feels like the same space, just from a slightly different angle.",
      "There is a similar tone moving through this.",
      "This seems to be touching the same place in a quieter way.",
      "It still feels close to the same inner thread.",
      "This carries some of the same inner shape, even if the words are different now.",
    ],
    zh: [
      "这感觉还是同一个空间，只是换了一个角度。",
      "这里流动着一种相似的底色。",
      "这似乎又轻轻碰到了同一个地方。",
      "这感觉还是贴着同一条内在线索。",
      "这里仍带着一点相似的内在形状，只是现在说法不一样了。",
    ],
  },
  ultra_light_fallback: {
    en: [
      "A little of that may still be here.",
      "Something of it still seems nearby.",
      "There is still a trace of it here.",
      "It may not be fully gone yet.",
      "Some of that still seems close.",
    ],
    zh: [
      "那里面可能还有一点点留在这里。",
      "它似乎还在附近一点。",
      "这里好像还带着一点它的痕迹。",
      "它也许还没有完全散开。",
      "那种东西似乎还轻轻靠近着。",
    ],
  },
};

function pickFamily(args: {
  threadStrength: "none" | "weak" | "moderate" | "strong";
  userMessage: string;
  insightCandidate: string;
}): MilestoneICueFamily {
  const u = normalizeApostrophesForHeuristics(args.userMessage.trim().toLowerCase());

  if (/(unfinished|not quite landed|not fully settled|still feels|not settled)/i.test(u) || /还没有.*落定|还没有.*走完|还没.*落下/.test(args.userMessage)) {
    return "quiet_unresolvedness";
  }

  if (args.threadStrength === "moderate") {
    // Keep continuity as atmosphere, not a direct "thread" statement.
    return "residual_background_presence";
  }

  if (args.threadStrength === "strong") {
    // Strong but still light: keep "same space" coherent.
    return "same_space_coherence";
  }

  // Weak/none: fallback (should be suppressed by caller, but safe default).
  return "ultra_light_fallback";
}

function isVisibilityRisk(textEn: string, textZh: string): boolean {
  // This should be very low; we defensively scan for recall-like language.
  const en = textEn.toLowerCase();
  const zh = textZh;
  const enBad = ["as before", "like before", "earlier you said", "this came up before", "still the same"];
  const zhBad = ["像之前一样", "你前面说过", "这之前出现过", "这又来了"];
  return enBad.some((p) => en.includes(p)) || zhBad.some((p) => zh.includes(p));
}

export function computeMilestoneICarryoverCue(params: {
  userMessage: string;
  /** Prior user turn text (same conversation); drives cross-turn signature matching. */
  previousUserMessage: string | null;
  seed: string;
  reflectionState: ExtractedReflectionState | null;
  previousReflectionState: ExtractedReflectionState | null;
  recurrenceCueEmitted: boolean;
  awarenessCueEmitted: boolean;
  // Language parity is controlled by the same "wantsChinese" heuristic used elsewhere.
  wantsChinese: boolean;
}): MilestoneIOutcome {
  const debugPath: MilestoneIDebugPath = {
    previousFamily: null,
    currentFamily: null,
    familyMatched: false,
    familyCompatible: false,
    threadStrength: null,
    userReflectiveStructure: userHasReflectiveStructureForCarryover(params.userMessage),
    mainReflectionSufficient: false,
    signatureScore: null,
    signatureTier: null,
    signatureRescuedThread: false,
  };

  if (!isMilestoneICarryoverEnabled()) {
    return { status: "suppressed", reason: "milestone_i_disabled", debugPath };
  }

  const {
    userMessage,
    previousUserMessage,
    reflectionState,
    previousReflectionState,
    recurrenceCueEmitted,
    awarenessCueEmitted,
  } = params;

  if (!reflectionState || !reflectionState.insight_candidate.trim()) {
    return { status: "suppressed", reason: "no_reflection_state", debugPath };
  }

  if (userMessage.trim().length < 18) {
    return { status: "suppressed", reason: "thin_user_message", debugPath };
  }

  if (looksUtilitarianOrFactual(userMessage)) {
    return { status: "suppressed", reason: "utilitarian_or_factual", debugPath };
  }

  if (isVagueUserMessage(userMessage)) {
    return { status: "suppressed", reason: "vague_source", debugPath };
  }

  if (isMinimalAffectOrFlatHedge(userMessage)) {
    return { status: "suppressed", reason: "minimal_affect_low_signal", debugPath };
  }

  // Conflict containment: E or H already doing the work => suppress I first.
  if (recurrenceCueEmitted)
    return { status: "suppressed", reason: "recurrence_overlap_e", debugPath };
  if (awarenessCueEmitted)
    return { status: "suppressed", reason: "awareness_overlap_h", debugPath };

  if (isExplicitRecallRisk(userMessage)) {
    return { status: "suppressed", reason: "explicit_recall_dependency", debugPath };
  }

  const currentFamily = detectContinuityPatternFamily(
    reflectionState.insight_candidate
  );
  const previousFamily = previousReflectionState
    ? detectContinuityPatternFamily(previousReflectionState.insight_candidate)
    : null;
  debugPath.currentFamily = currentFamily;
  debugPath.previousFamily = previousFamily;
  debugPath.familyMatched =
    previousFamily != null && currentFamily === previousFamily;
  debugPath.familyCompatible =
    previousFamily != null &&
    ((previousFamily === "replay_for_mistakes" &&
      currentFamily === "delayed_reply_means_i_did_something_wrong") ||
      (previousFamily === "delayed_reply_means_i_did_something_wrong" &&
        currentFamily === "replay_for_mistakes"));

  const thread = detectThreadSupport({
    current: reflectionState,
    previous: previousReflectionState,
    currentUserMessage: userMessage,
    previousUserMessage,
  });
  debugPath.threadStrength = thread.threadStrength;
  debugPath.signatureScore = thread.signatureScore;
  debugPath.signatureTier = thread.signatureTier;
  debugPath.signatureRescuedThread = thread.signatureRescuedThread;

  if (thread.threadStrength === "none") {
    return { status: "suppressed", reason: "thread_not_supported", debugPath };
  }
  if (thread.threadStrength === "weak") {
    // Keep "weak" as weak_candidate: admissible but do not render.
    return { status: "suppressed", reason: "weak_thread_candidate", debugPath };
  }

  const mainSufficient = mainReflectionSufficientHeuristic({
    userMessage,
    reflection: reflectionState,
  });
  debugPath.mainReflectionSufficient = mainSufficient;
  if (mainSufficient) {
    return { status: "suppressed", reason: "main_reflection_sufficient", debugPath };
  }

  const family = pickFamily({
    threadStrength: thread.threadStrength,
    userMessage,
    insightCandidate: reflectionState.insight_candidate,
  });

  const pool = FAMILY_TEMPLATES[family];
  const langKey: "en" | "zh" = params.wantsChinese ? "zh" : "en";
  const enTemplates = pool.en;
  const zhTemplates = pool.zh;
  const idx = hashPick(`${params.seed}:I:${family}`, enTemplates.length);
  const textEn = enTemplates[idx] ?? enTemplates[0] ?? "";
  const textZh = zhTemplates[idx] ?? zhTemplates[0] ?? "";

  if (!textEn || !textZh) {
    return { status: "suppressed", reason: "visibility_risk", debugPath };
  }

  if (isVisibilityRisk(textEn, textZh)) {
    return { status: "suppressed", reason: "visibility_risk", debugPath };
  }

  // Minimal visibility control: keep I extremely light; if it would be too long, suppress.
  const selected = langKey === "en" ? textEn : textZh;
  const len = selected.trim().length;
  if (len > 90) {
    return { status: "suppressed", reason: "visibility_risk", debugPath };
  }

  return {
    status: "emitted",
    cueFamily: family,
    textEn,
    textZh,
    debugPath,
  };
}

