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
 *
 * Narrowing pass (Lumen/Wisewave 2026-03-25): **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`**
 * — H3/H1 tightened; H4 preserved; H5 substrate floor; build marker **milestone_h_v4**.
 * v5 (2026-03-25): H3 tighter on **replay/rumination** substrate, **reply** length floor, **prove/earn** user + insight residual blur; H4 unchanged.
 * v6 (2026-03-25): family-targeted H3 redundancy suppression:
 * - suppress H3 when the main reflection already carries the needed value
 * - treat generic `default` H3 phrasing as danger patterns when redundant
 */

/** Bump when H engine semantics change (QA: confirm hosted marker matches repo). */
const BUILD_MARKER = "milestone_h_v14";

/** Global kill switch: H only when explicitly enabled. */
export function isMilestoneHCueEnabled(): boolean {
  const v = process.env.ENABLE_H_CUE?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export function milestoneHBuildMarker(): string {
  return BUILD_MARKER;
}

/** Strict stabilization linter (block/suppress only). Disabled by default for reversibility. */
export function isMilestoneHStrictLinterEnabled(): boolean {
  const v = process.env.ENABLE_H_LINTER_STRICT?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export type HLintStrength = 70 | 85 | 100;

export function getHStrictLinterStrength(): HLintStrength {
  const raw = process.env.H_LINTER_STRENGTH?.trim().toLowerCase();
  const cleaned = raw?.replace("%", "");
  const n = cleaned ? Number(cleaned) : NaN;
  if (n === 85) return 85;
  if (n === 100) return 100;
  return 70;
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
  /** Lumen follow-up: H1 on mild/generic reflective only — insight not durable enough; prefer silence. */
  | "h1_mild_reflective_insufficient"
  /** Post-H guardrail: suppress H1 when the main reflection is likely already sufficient (avoid additive tails). */
  | "h1_main_reflection_sufficient"
  /** Post-H guardrail: medium-signal reflective turns no longer default-allow H1. */
  | "h1_medium_signal_downgrade"
  /** v8 tightening: medium turns require clear moment-level activation for H1 eligibility. */
  | "h1_medium_requires_moment_activation"
  /** v9 tightening: medium H1 suppress when main reflection already captures pressure/bracing movement. */
  | "h1_medium_main_reflection_capture"
  /** v10 tightening: block medium-band cross-kind substitution (e.g., H1->H5) on already-captured movement. */
  | "h_medium_cross_kind_substitution_block"
  /** v11 boundary correction: medium-band pressure/bracing shapes default suppress unless stronger admissibility. */
  | "h_medium_boundary_default_suppress"
  /** v12 doctrine: medium-band is lane-agnostic default suppress unless necessity bundle is proven. */
  | "h_medium_lane_agnostic_default_suppress"
  /** v12 doctrine: medium-band global main-reflection sufficiency suppress across all H lanes. */
  | "h_medium_main_reflection_sufficient_global"
  /** v13 parity: ZH medium-band requires stricter live-activation proof. */
  | "h_medium_zh_activation_not_strong_enough"
  /** v14 ultra-narrow cleanup: deny residual ZH medium-band H1 pressure/rest-permission pocket. */
  | "h1_zh_medium_residual_exception_deny"
  /** Wisewave Kill List: banned guidance/coaching/identity/over-explanation phrases detected. */
  | "wisewave_kill_list_blacklisted_text"
  /** Structural error: more than one sentence detected in the emitted H cue. */
  | "wisewave_kill_list_multi_sentence"
  /** Wisewave linter: H too long (correlates with explanation/presence). */
  | "wisewave_kill_list_too_long"
  /** Lumen/Wisewave 2026-03-25 combined brief: H3 materially narrowed (prove/reply/replay/short). */
  | "h3_permissiveness_narrowing"
  /** Wisewave review (v6): suppress H3 when main reflection already carries value (residual over-emission). */
  | "h3_main_reflection_sufficiency"
  /** Same brief: extra H1 suppression on soft everyday / low-intensity without durable insight. */
  | "h1_permissiveness_narrowing"
  /** H5 only when split language is substantive enough. */
  | "h5_narrowing_insufficient_substrate"
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
 * When kind would be **H1**, suppress if user text is **mild/generic discomfort** only and
 * **insight** lacks durable pattern structure (Lumen stabilization follow-up: scenarios 1, 21, 23, 27, 28).
 */
function isH1MildSubstrateSuppressed(userMessage: string, insight: string): boolean {
  const t = normalizeApostrophesForHeuristics(userMessage.trim().toLowerCase());
  const ins = insight.trim().toLowerCase();
  const len = t.length;

  // Longer substrate: let H1 through for human/QA judgment (raised bar, 2026-03-25 narrowing).
  if (len >= 115) return false;

  const userHasStructure =
    /\b(because|although|whenever|every time|always|never|except|but then|ends up|keeps happening)\b/i.test(
      t
    ) ||
    /\b(pattern|loop)\s+(of|where|when)\b/i.test(t) ||
    /(因为|虽然|每次|总是|从不|可是|但是)/.test(t);

  if (userHasStructure) return false;

  if (insightHasDurableHPattern(ins)) return false;

  const mild =
    /\boverwhelmed\b/.test(t) ||
    /\b(slightly|a bit|kind of|little bit)\s+(uneasy|tense|anxious|nervous|worried)\b/.test(t) ||
    /\bbit tense\b|\ba little tense\b|\bkind of tense\b/.test(t) ||
    /\bfeel(ing)?\s+(a\s+)?(little\s+)?(bit\s+)?(uneasy|tense|anxious|nervous|worried)\b/.test(t) ||
    /\bi'?m\s+(just\s+)?(a\s+)?(little\s+)?(bit\s+)?(uneasy|tense|anxious|worried|nervous)\b/.test(t) ||
    /\b(worried|afraid)\s+i\s+might\b/.test(t) ||
    /\b(worried|afraid)\s+(that\s+)?i\s+(will|could|would)\b/.test(t) ||
    /\b(worried|nervous)\s+about\s+(failing|messing|screwing)\b/.test(t) ||
    /\bdon'?t trust myself\b/.test(t) ||
    /\bdon'?t really trust myself\b/.test(t) ||
    /\bdon'?t trust\b[^.!?]{0,36}\bsometimes\b/.test(t) ||
    /\bsometimes\b[^.!?]{0,48}\bdon'?t trust\b/.test(t) ||
    /\b(i feel|i'm feeling|i am feeling)\s+(kind of |a little |slightly )?(off|weird|strange|unsettled)\b/.test(t);

  return mild;
}

/** Durable insight structure for H1/H3 narrowing (not generic LLM filler tokens alone). */
function insightHasDurableHPattern(insightLower: string): boolean {
  return (
    /(inner rule|torn between|conflict between|split between|both (pulls|sides|ways)|two (strong )?pulls|pull(s|ing)? in (two|different|opposite)|stuck in (a |the )?loop|pattern of (avoiding|shutting|rushing|reacting when)|prove (yourself|i deserve|that i)|never (quite )?good enough|pressure to (perform|prove|keep up)|keep up (the )?appearance|performance (trap|treadmill|pressure))/i.test(
      insightLower
    ) || /(矛盾|拉扯|兩股|两股).{0,16}(拉|扯)/.test(insightLower)
  );
}

function userHasReflectiveStructureForNarrowing(message: string): boolean {
  const t = normalizeApostrophesForHeuristics(message.trim().toLowerCase());
  const raw = message;
  return (
    /\b(because|although|whenever|every time|always|never|even though|i keep|i always|i end up|pattern|loop|keeps happening|turns out)\b/i.test(
      t
    ) || /(因为|虽然|每次|总是|可是|但是|却又|一直)/.test(raw)
  );
}

/** Replay/rumination-specific structure (Lumen v5 — not covered by generic causal/loop words). */
function userHasReplayRuminationStructure(message: string): boolean {
  const t = normalizeApostrophesForHeuristics(message.trim().toLowerCase());
  const raw = message;
  return (
    /\b(each time|again and again|lost count|can'?t stop thinking|cant stop thinking|keeps coming back|keep(s)? thinking about|playing it back|mental loop|go(es)? round in my head|intrusive|rehash|dwelling on|same (scene|moment|memory|fight|argument|mistake|conversation))\b/i.test(
      t
    ) || /(放不下|绕圈|转来转去|老想着|一直想|同样的事|同一段)/.test(raw)
  );
}

/**
 * Insight still routed to H3 (e.g. user "?") but language sits in prove/validation space without Gate-1 durable pattern — suppress H3 (Lumen: prove/earn residual blur).
 */
function isH3SuppressedForProveEarnInsightBlur(insightLower: string): boolean {
  if (insightHasDurableHPattern(insightLower)) return false;
  return /(worthy|unworthy|worthless|validation|impost|measur(e|ing) up|stack up|belong(ing)?|\ba fraud\b|feel(ing)? fake|不配|自卑|怕被否定|怕別人|怕别人|在意别人怎么看|在意別人)/i.test(
    insightLower
  );
}

/**
 * Extra H1 narrowing beyond h1_mild_reflective_insufficient (soft everyday / flat okay).
 */
function isH1ExtraNarrowingSuppressed(userMessage: string, insight: string): boolean {
  const t = normalizeApostrophesForHeuristics(userMessage.trim().toLowerCase());
  const ins = insight.trim().toLowerCase();
  const len = userMessage.trim().length;

  if (len >= 115) return false;
  if (userHasReflectiveStructureForNarrowing(userMessage)) return false;
  if (insightHasDurableHPattern(ins)) return false;

  const softDaily =
    /\b(just (thinking|wondering)|it'?s fine|pretty fine|mostly fine|nothing much|not much happened|small thing|no big deal|kind of okay|kind of ok)\b/i.test(
      t
    ) ||
    /还好|一般吧|没什么|小事|还好吧/.test(userMessage);

  if (softDaily && len < 100) return true;

  if (len < 88 && /\b(i feel )?kind of (okay|ok|fine)\b/i.test(t)) return true;

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

  // Post-H hard kill: direct drafting / rewrite / summarize style asks must never emit H.
  // (Observed leak: "Rewrite this email in a more professional tone.")
  if (
    /^(rewrite|summarize|summarise|paraphrase|proofread|edit|polish|format|organize|organise|outline)\b/i.test(
      t
    )
  )
    return true;
  if (/\b(rewrite|summarize|summarise|paraphrase|proofread|edit|polish)\b/i.test(t) && /\b(email|document|notes|meeting notes)\b/i.test(t))
    return true;
  if (/^(帮我|请帮我|麻烦)\s*(总结|改写|润色|整理|起草)/.test(t)) return true;
  if (/(会议纪要|邮件|文档|总结成|更正式)/.test(t) && /(帮我|请帮我|麻烦)/.test(t)) return true;

  // Reflective first-person (ZH/EN) first — avoids false positives on 怎么… when 我/我觉得 follows
  if (hasReflectiveFirstPersonAnchor(t)) {
    // Still block obvious English homework / lookup patterns
    if (/^(what|when|where|who|which|how)\s+(is|are|was|were|do|does|did|can|could|would|should)\b/i.test(t))
      return true;
    if (/^(define|explain|translate|calculate|list|give me|rewrite|summarize|summarise|paraphrase|proofread|edit|polish|format|organize|organise|outline)\b/i.test(t))
      return true;
    if (/^\d+[\s\+\-*\/=]/.test(t)) return true;
    if (/^(http|https):\/\//i.test(t)) return true;
    return false;
  }

  // Obvious non-reflective asks
  if (/^(what|when|where|who|which|how)\s+(is|are|was|were|do|does|did|can|could|would|should)\b/i.test(t))
    return true;
  if (/^(define|explain|translate|calculate|list|give me|rewrite|summarize|summarise|paraphrase|proofread|edit|polish|format|organize|organise|outline)\b/i.test(t))
    return true;
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

/**
 * Post-H: H1 over-emission fix.
 * If the extracted insight is already durable/structured and the user message is medium-length,
 * H1 is likely an additive tail (removal improves multiple cases). Prefer suppression.
 */
function isH1SuppressedByMainReflectionSufficiency(userMessage: string, insight: string): boolean {
  const len = userMessage.trim().length;
  if (len >= 140) return false; // long substrate: allow room for human judgment
  const ins = insight.trim().toLowerCase();
  if (!hasStrongInsightSignal(insight)) return false;
  if (insightHasDurableHPattern(ins)) return true;
  // Medium-ish substrate without explicit reflective structure: treat H1 as likely redundant.
  if (len >= 48 && len < 115 && !userHasReflectiveStructureForNarrowing(userMessage)) {
    return true;
  }
  return false;
}

/** Explicit in-the-moment activation substrate (EN/ZH), used for medium-signal H1 gating. */
function hasClearMomentLevelActivation(message: string): boolean {
  const t = normalizeApostrophesForHeuristics(message.trim().toLowerCase());
  const raw = message;
  return (
    /\b(right now|in this moment|as soon as|immediately|right away|i can feel myself|i feel myself|my body|tightening|brace|bracing|clench|clenching|drop(s|ping)?|collapse|spiral(ing)?|rush(ing)?|heart racing|chest tight|knot in (my )?(stomach|chest)|hands? (shake|shaking)|can't slow down|cannot slow down)\b/i.test(
      t
    ) ||
    /(一停下来|立刻|马上|当下|此刻|正在|身体|胸口|胃里|发紧|绷紧|收紧|心跳|心里一紧|开始慌|停不下来|停不住)/.test(
      raw
    )
  );
}

/**
 * v8 tightening: medium-signal reflective turns require explicit moment-level activation.
 * Without that substrate, H1 is treated as decorative and suppressed.
 */
function isH1SuppressedByMediumMomentActivationGate(userMessage: string): boolean {
  const len = userMessage.trim().length;
  const inMediumBand = len >= 40 && len < 140;
  if (!inMediumBand) return false;
  return !hasClearMomentLevelActivation(userMessage);
}

/**
 * v9 cleanup:
 * In medium-band H1, if the main reflection already captures pressure/perfection/rest-worth or
 * ambient bracing/vigilance movement, H is typically decorative and should suppress.
 */
function insightCapturesMediumPressureOrBracing(insight: string): boolean {
  const ins = insight.trim().toLowerCase();
  return (
    /\b(pressure|self[- ]?pressure|perfection|perfect|not enough|never enough|prove|worthy|worth|deserve|earn rest|rest guilt|should be doing more|bracing|brace|guard(ed)?|on edge|vigilance|hypervigil|threat|always scanning)\b/i.test(
      ins
    ) ||
    /(压力|完美|不够好|证明|配不配|值得|不值得|休息.{0,8}(愧疚|不配)|应该.{0,6}(更多|更努力)|绷着|提防|警觉|不敢放松|一直防着)/.test(
      insight
    )
  );
}

function isH1SuppressedByMediumMainReflectionCapture(userMessage: string, insight: string): boolean {
  const len = userMessage.trim().length;
  if (len < 40 || len >= 140) return false;
  if (!hasStrongInsightSignal(insight)) return false;
  return insightCapturesMediumPressureOrBracing(insight);
}

function isMediumBand(userMessage: string): boolean {
  const len = userMessage.trim().length;
  return len >= 40 && len < 140;
}

/**
 * v11 boundary correction:
 * medium-band awareness in pressure/bracing shapes needs stronger admissibility than pattern-family match.
 */
function hasStrongerMediumAdmissibility(userMessage: string, insight: string): boolean {
  const ins = insight.trim().toLowerCase();
  return (
    hasClearMomentLevelActivation(userMessage) &&
    userHasReflectiveStructureForNarrowing(userMessage) &&
    insightHasDurableHPattern(ins)
  );
}

function hasCjkText(s: string): boolean {
  return /[\u4E00-\u9FFF]/.test(s);
}

/**
 * v13: stricter ZH live-activation proof (avoid admitting medium cases from generic
 * pressure/rest-worth wording that QA still reads as additive).
 */
function hasStrictZhMomentActivation(message: string): boolean {
  const raw = message.trim();
  return (
    /(一停下来|一慢下来|马上|立刻).{0,12}(就|会).{0,16}(紧|绷|慌|催|压|停不住|停不下来)/.test(raw) ||
    /(我能感觉到|我明显感觉到|此刻).{0,18}(身体|胸口|胃里|呼吸).{0,14}(发紧|绷|卡|乱|急)/.test(raw) ||
    /(正在).{0,12}(收紧|绷紧|发紧|慌|催|推着我|拉扯)/.test(raw)
  );
}

function isZhPressurePerfectionRestPermissionShape(text: string): boolean {
  return /(压力|完美|不够好|证明|配不配|值不值得|值得|不值得|休息.{0,8}(愧疚|不配)|应该.{0,8}(更多|更努力)|停下来.{0,8}(不安|焦虑|内疚))/i.test(
    text
  );
}

function isMainReflectionMateriallySufficientGlobal(insight: string): boolean {
  const ins = insight.trim().toLowerCase();
  if (insightHasDurableHPattern(ins)) return true;
  if (insightCapturesMediumPressureOrBracing(insight)) return true;
  return (
    ins.length >= 60 &&
    /(pressure|pattern|loop|split|conflict|bracing|over[- ]?effort|avoid|prove|self[- ]?doubt|perfection|worth|deserve|guilt)/i.test(
      ins
    )
  );
}

/**
 * Post-H: medium signal downgrade.
 * If the turn looks reflective but not strongly earned (no structure, no durable insight),
 * suppress H1 rather than allowing it by default.
 */
function isH1SuppressedByMediumSignalDowngrade(userMessage: string, insight: string): boolean {
  const len = userMessage.trim().length;
  if (len < 40 || len >= 140) return false;
  if (userHasReflectiveStructureForNarrowing(userMessage)) return false;
  const ins = insight.trim().toLowerCase();
  if (insightHasDurableHPattern(ins)) return false;
  // Medium-length + non-durable insight => treat as medium-signal and prefer silence.
  return true;
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

/** H1 — generic micro awareness (ASCII punctuation; slightly sharper than v2, same gates). */
const H1_TEMPLATES = {
  en: [
    "Something here might be worth noticing — without needing it to be named yet.",
    "A little space might be here to notice what is present, without fixing it.",
    "What sits under the words might matter before the narrative settles.",
    "The undertone here might be clearer than any quick label would allow.",
    "Something specific in how this lands might ask for attention before it is explained away.",
  ],
  zh: [
    "这里或许有值得留意的地方，还不必急着把它说清楚。",
    "此刻也许有一点空间，去留意正在发生什么，而不必马上整理它。",
    "事情背后可能还有一层，还不必急着把它命名。",
    "语气之下或许有更要紧的东西，不必马上贴标签。",
    "这段话里真正在用力的地方，也许值得先停一下再整理。",
  ],
};

/** H3 theme buckets — case-specific wording (Lumen 7-case follow-up); same suppression rules. */
type H3ThemeKey = "default" | "rest_guilt" | "reply_anxiety" | "replay_ruminate";

const H3_THEME_PAIRS: Record<H3ThemeKey, Array<{ en: string; zh: string }>> = {
  default: [
    {
      en: "There can be a little room here, without deciding what comes next.",
      zh: "这里可以有一点空间，不必马上决定下一步。",
    },
    {
      en: "A pause might be enough; nothing else has to be decided right now.",
      zh: "有时候停一下就够了，不必立刻把事情想完。",
    },
    {
      en: "Not knowing the next move might be tolerable to sit with for a moment here.",
      zh: "就算还不知道下一步，也可以先在这里停一小会儿。",
    },
    {
      en: "Ambiguity about what follows might not need tightening in this exact moment.",
      zh: "接下来会怎样还不清楚时，此刻也许不必急着把它收紧。",
    },
  ],
  rest_guilt: [
    {
      en: "Whatever guilt sits next to resting might be noticeable here, without forcing a verdict about it.",
      zh: "想休息又带着愧疚的那股拉扯，也许可以先被看见，而不必马上判对错。",
    },
    {
      en: "The tension around slowing or stopping might have room to be seen, not resolved on the spot.",
      zh: "慢下来或停下来的那份紧绷，也许可以先被看见，而不必当场解开。",
    },
    {
      en: "The split between needing a break and feeling you have not earned it might sit here quietly.",
      zh: "需要喘息却又觉得不配停下来的矛盾，也许可以先轻轻停在这里。",
    },
  ],
  reply_anxiety: [
    {
      en: "The wait for a reply might carry its own weight here, separate from what the silence means.",
      zh: "等待回复的这段时间本身，也许有它自己的分量，还不必急着定义沉默。",
    },
    {
      en: "The gap after you reached out might be worth noticing on its own, before naming what it proves.",
      zh: "发出消息之后的那段空档，也许值得先被留意，而不必马上说明它证明了什么。",
    },
    {
      en: "Uncertainty about whether you were seen might deserve a softer hold than a full story.",
      zh: "不确定对方有没有看见你的那份悬着，也许可以用更轻的方式托住，而不必立刻编成结论。",
    },
  ],
  replay_ruminate: [
    {
      en: "A loop replaying the same scene might be visible as motion here, without needing a new conclusion.",
      zh: "同一段画面在脑子里重播时，那种来回也许可以先被看见，而不必马上得出新结论。",
    },
    {
      en: "Going over it again can leave space to notice the replay itself, not only the details inside it.",
      zh: "反复想同一件事时，也许可以留一点空隙去留意重播本身，而不只是里面的细节。",
    },
    {
      en: "When the mind returns to the same beat, the return might be noticeable before the content is settled.",
      zh: "心思又回到同一条线时，那种折返也许可以先被看见，而不必先把内容想清楚。",
    },
  ],
};

function detectH3ThemeKey(userMessage: string): H3ThemeKey {
  const t = normalizeApostrophesForHeuristics(userMessage.toLowerCase());
  const raw = userMessage;
  if (
    /\b(replay|ruminate|ruminating|over and over|same (thing|conversation|scenario)|spiral|on repeat|stuck (on|thinking)|keep (going over|rehashing)|can'?t stop thinking|cant stop thinking|keeps coming back|intrusive thought|mental loop|dwelling|circular|going in circles)\b/i.test(
      t
    ) ||
    /反复|重播|循环|一直想|重复|没完没了|重想|放不下|绕圈|转来转去|老想着/.test(raw)
  ) {
    return "replay_ruminate";
  }
  if (
    /\b(no reply|didn'?t reply|won'?t reply|ghost(ed|ing)?|left on read|read receipt|waiting (for (a |the )?)?(reply|text|message))\b/i.test(
      t
    ) ||
    /不回|已读|消息|等着|不回复|没回/.test(raw)
  ) {
    return "reply_anxiety";
  }
  if (
    /\b(rest|resting|rested|sleep|sleeping|slept|nap|guilty|guilt|lazy|don'?t deserve|shouldn'?t be (resting|relaxing)|lying down|downtime)\b/i.test(
      t
    ) ||
    /休息|睡|愧疚|内疚|懒散|不该休息|不配休息/.test(raw)
  ) {
    return "rest_guilt";
  }
  return "default";
}

/**
 * H3 narrowed: prove/earn blur, thin reply/replay, weak default uncertainty (Lumen/Wisewave 2026-03-25).
 */
function isH3SuppressedByNarrowing(userMessage: string, insight: string): boolean {
  const t = normalizeApostrophesForHeuristics(userMessage.trim().toLowerCase());
  const ins = insight.trim().toLowerCase();
  const theme = detectH3ThemeKey(userMessage);
  const len = userMessage.trim().length;

  if (
    /\b(prove (myself|yourself|it|to them|to him|to her)|have to prove|proving myself|proving yourself|good enough|never good enough|earn(ed)? (it|this|rest|a break|my place)|deserve (to |a )?rest|deserve a break|worth(y)? before i|pressure to (perform|prove)|have to earn|show (that )?i'?m|show them i|convince (myself|them)|validat(e|ing) myself|(imposter|impostor)( syndrome)?|measur(e|ing) up|stack up against|have something to prove|need to show|earn my keep)\b/i.test(
      t
    ) ||
    /证明|值不值得|不配|够好|才敢|才配|证明自己|证明给|怕被看|怕别人|拿不出|印证|自卑/.test(userMessage)
  ) {
    return true;
  }

  if (isH3SuppressedForProveEarnInsightBlur(ins)) {
    return true;
  }

  if (theme === "replay_ruminate") {
    const uStruct = userHasReflectiveStructureForNarrowing(userMessage);
    const uReplay = userHasReplayRuminationStructure(userMessage);
    const insDur = insightHasDurableHPattern(ins);
    if (!uStruct && !uReplay && !insDur) {
      return true;
    }
    if (len < 60 && !(insDur && (uStruct || uReplay))) {
      return true;
    }
  }

  if (theme === "reply_anxiety") {
    if (len < 76 && !userHasReflectiveStructureForNarrowing(userMessage)) {
      return true;
    }
    if (
      len < 96 &&
      !userHasReflectiveStructureForNarrowing(userMessage) &&
      !insightHasDurableHPattern(ins)
    ) {
      return true;
    }
  }

  if (
    theme === "default" &&
    len < 56 &&
    !userMessage.includes("?") &&
    !userMessage.includes("？")
  ) {
    if (/\bmaybe\b|\bperhaps\b|\bmight be wrong\b/i.test(t)) {
      return true;
    }
  }

  if (len < 42 && !userHasReflectiveStructureForNarrowing(userMessage)) {
    const insUncertaintyBridge =
      /(uncertain|unsure|whether|don'?t know|not sure|ambival|torn|worry|anxious|纠结|犹豫|说不清|不知道)/i.test(
        ins
      );
    if (!insUncertaintyBridge) return true;
  }

  return false;
}

function isH3GenericDangerPairEn(textEn: string): boolean {
  const t = textEn.toLowerCase();
  // Wisewave v5 revise-list: these `default` phrasing shapes are danger when redundant.
  return (
    /there can be a little room here/.test(t) ||
    /a pause might be enough/.test(t) ||
    /not knowing the next move/.test(t) ||
    /ambiguity .* might not need tightening/.test(t)
  );
}

function isMainReflectionSufficientForH3(insight: string): boolean {
  const ins = insight.trim().toLowerCase();
  // Durable internal structure => main reflection already does the work.
  if (insightHasDurableHPattern(ins)) return true;
  // Strong main reflection length/signal => prefer silence over a generic H3.
  if (ins.length >= 72) return true;
  return (
    ins.length >= 52 &&
    /(inner rule|pressure|loop|pattern|prove|conflict|torn|split|performance|because|therefore|so )/i.test(
      ins
    )
  );
}

function insightHasReplayRumination(insightLower: string): boolean {
  return (
    /(loop|replay|ruminat|rehash|over and over|again|replaying)/i.test(insightLower) ||
    /反复|重播|循环|一直想|重想|没完没了/.test(insightLower)
  );
}

function insightHasReplyAnxiety(insightLower: string): boolean {
  return (
    /(reply|message|seen|waiting|silence|left on read|read receipt|ghosted)/i.test(insightLower) ||
    /不回|没回|已读|等着|不回复|没回复/.test(insightLower)
  );
}

function pickH3Template(seed: string, userMessage: string): { en: string; zh: string } {
  const theme = detectH3ThemeKey(userMessage);
  const pool = H3_THEME_PAIRS[theme];
  const i = hashPick(`${seed}:H3:${theme}`, pool.length);
  return pool[i]!;
}

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

function pickTemplate(
  kind: MicroAwarenessKind,
  seed: string,
  userMessage: string
): { en: string; zh: string } {
  if (kind === "H3") {
    return pickH3Template(seed, userMessage);
  }
  const pool =
    kind === "H1"
      ? H1_TEMPLATES
      : kind === "H4"
        ? H4_TEMPLATES
        : H5_TEMPLATES;
  const i = hashPick(`${seed}:${kind}`, pool.en.length);
  return { en: pool.en[i]!, zh: pool.zh[i]! };
}

function normalizeForKillList(text: string): string {
  return text
    .replace(/\u2019|\u2018/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function countSentenceEndings(text: string): number {
  const t = text.trim();
  const matches = t.match(/[.!?。！？]/g);
  return matches ? matches.length : 0;
}

function countEnglishWords(textEn: string): number {
  const t = textEn
    .replace(/[.!?,;:()"'’“”]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return 0;
  return t.split(" ").filter(Boolean).length;
}

function countChineseChars(textZh: string): number {
  // Keep only non-whitespace CJK characters for the threshold.
  const t = textZh.replace(/\s+/g, "");
  return t.replace(/[^\u4E00-\u9FFF]/g, "").length;
}

function hasWisewaveKillListBan(
  textEn: string,
  textZh: string,
  strength: HLintStrength
): boolean {
  const en = normalizeForKillList(textEn.toLowerCase());
  const zh = normalizeForKillList(textZh);

  // Strength 70: only block the highest-drift / guaranteed overreach shapes.
  const enDirective: RegExp[] = [
    // Guidance / action suggests
    /\byou may want to\b/i,
    /\byou could try to\b/i,
    /\bit might help to\b/i,
    /\byou should\b/i,
    /\btry to\b/i,
    /\bconsider doing\b/i,

    // Coaching tone (treat as guidance)
    /let's take a step back/i,
    /let's pause here/i,
    /\bwhat if you\b/i,
    /maybe start by/i,
  ];
  const zhDirective: RegExp[] = [
    /你可以试试/i,
    /你可以考虑/i,
    /或许你可以/i,
    /你需要/i,
    /建议你/i,

    /我们可以先/i,
    /你可以先/i,
    /不妨先/i,
  ];

  const enPremature: RegExp[] = [
    /don'?t need to decide yet/i,
    /\bthere'?s no need to\b/i,
    /\bit'?s okay to just\b/i,
    /\byou don'?t have to\b/i,
    /\bthat's enough for now\b/i,
    /\bjust noticing is enough\b/i,
    /\bthat's all you need to do\b/i,
  ];
  const zhPremature: RegExp[] = [
    /你不需要现在决定/i,
    /没必要/i,
    /你不用/i,
    /可以不用这么/i,
    /这样就够了/i,
    /只要看到就好了/i,
  ];

  const enCausal: RegExp[] = [
    /this is happening because/i,
    /\bthe reason is\b/i,
    /this comes from/i,
    /this means that/i,
  ];
  const zhCausal: RegExp[] = [
    /这是因为/i,
    /原因是/i,
    /这说明/i,
    /本质是/i,
  ];

  const enIdentity: RegExp[] = [
    /\byou are someone who\b/i,
    /\bthis is your pattern\b/i,
    /\byou tend to\b/i,
    /\bthis shows that you\b/i,
  ];
  const zhIdentity: RegExp[] = [
    /你是一个/i,
    /这是你的模式/i,
    /你总是/i,
    /你其实是/i,
  ];

  const enTherapeuticSoft: RegExp[] = [
    /\bit'?s okay\b/i,
    /\byou'?re okay\b/i,
    /\bthat's completely normal\b/i,
    /\byou'?re not alone\b/i,
  ];
  const zhTherapeuticSoft: RegExp[] = [
    /没关系/i,
    /你很好/i,
    /这是正常的/i,
    /你不是一个人/i,
  ];

  const enAbstractJargon: RegExp[] = [
    /\binner dynamic\b/i,
    /\bemotional processing\b/i,
    /\bunderlying mechanism\b/i,
    /\bsubconscious pattern\b/i,
  ];
  const zhAbstractJargon: RegExp[] = [
    /内在机制/i,
    /情绪过程/i,
    /潜意识模式/i,
  ];

  const enJustInstruction: RegExp[] = [
    /\bjust\s+(notice|let|focus|stay with|focus on)\b/i,
    /\bonly just\b/i,
  ];
  const zhJustInstruction: RegExp[] = [
    /只是去看/i,
    /就去感受/i,
    /先只是/i,
  ];

  const enYouMayDirectional: RegExp[] = [
    /\byou may not need to\b/i,
    /\byou may be trying to\b/i,
    /\byou may feel\b/i,
  ];
  const zhYouMayDirectional: RegExp[] = [
    /你可能不需要/i,
    /你可能正在/i,
    /你可能会/i,
  ];

  const matches = (rs: RegExp[]) => rs.some((r) => r.test(en));
  const matchesZh = (rs: RegExp[]) => rs.some((r) => r.test(zh));

  // Always block at 70+:
  if (
    matches(enDirective) ||
    matches(enPremature) ||
    matches(enCausal) ||
    matches(enIdentity) ||
    matchesZh(zhDirective) ||
    matchesZh(zhPremature) ||
    matchesZh(zhCausal) ||
    matchesZh(zhIdentity)
  ) {
    return true;
  }

  // Additional bans at 85+:
  if (strength >= 85) {
    if (
      matches(enTherapeuticSoft) ||
      matches(enAbstractJargon) ||
      matches(enJustInstruction) ||
      matches(enYouMayDirectional) ||
      matchesZh(zhTherapeuticSoft) ||
      matchesZh(zhAbstractJargon) ||
      matchesZh(zhJustInstruction) ||
      matchesZh(zhYouMayDirectional)
    ) {
      return true;
    }
  }

  // 100% inherits 85% bans (plus any future additions).
  return false;
}

function hasWisewaveKillListMultiSentence(textEn: string, textZh: string): boolean {
  return countSentenceEndings(textEn) >= 2 || countSentenceEndings(textZh) >= 2;
}

function hasWisewaveTooLong(
  textEn: string,
  textZh: string,
  strength: HLintStrength
): boolean {
  const enWords = countEnglishWords(textEn);
  const zhChars = countChineseChars(textZh);

  // Strict stabilization uses BLOCK threshold only:
  // 70%: EN block 26, ZH block 40
  // 85%: EN block 24, ZH block 38
  // 100%: EN block 22, ZH block 34
  const enBlock = strength === 70 ? 26 : strength === 85 ? 24 : 22;
  const zhBlock = strength === 70 ? 40 : strength === 85 ? 38 : 34;

  return enWords > enBlock || zhChars > zhBlock;
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

  // v12 doctrine (Wisewave): medium-band is lane-agnostic default suppress.
  // Suppress across all H lanes when main reflection is already materially sufficient.
  if (isMediumBand(userMessage) && isMainReflectionMateriallySufficientGlobal(insight)) {
    return { status: "suppressed", reason: "h_medium_main_reflection_sufficient_global" };
  }

  // v13 ZH parity: medium-band Chinese cases need stricter live activation proof.
  if (isMediumBand(userMessage) && hasCjkText(userMessage) && !hasStrictZhMomentActivation(userMessage)) {
    return { status: "suppressed", reason: "h_medium_zh_activation_not_strong_enough" };
  }

  // v12 doctrine: medium-band ineligible unless necessity bundle is clearly proven.
  if (isMediumBand(userMessage) && !hasStrongerMediumAdmissibility(userMessage, insight)) {
    return { status: "suppressed", reason: "h_medium_lane_agnostic_default_suppress" };
  }

  if (kind === "H1" && isH1MildSubstrateSuppressed(userMessage, insight)) {
    return { status: "suppressed", reason: "h1_mild_reflective_insufficient" };
  }

  if (kind === "H1" && isH1SuppressedByMainReflectionSufficiency(userMessage, insight)) {
    return { status: "suppressed", reason: "h1_main_reflection_sufficient" };
  }

  // v14: final exception-deny cleanup for residual ZH medium-band H1 pocket.
  // If user + insight are in pressure/perfection/rest-permission family and main reflection
  // already materially carries movement, suppress H1 by default.
  if (
    kind === "H1" &&
    isMediumBand(userMessage) &&
    hasCjkText(userMessage) &&
    isZhPressurePerfectionRestPermissionShape(userMessage) &&
    isZhPressurePerfectionRestPermissionShape(insight) &&
    isMainReflectionMateriallySufficientGlobal(insight)
  ) {
    return { status: "suppressed", reason: "h1_zh_medium_residual_exception_deny" };
  }

  if (kind === "H1" && isH1SuppressedByMediumMomentActivationGate(userMessage)) {
    return { status: "suppressed", reason: "h1_medium_requires_moment_activation" };
  }

  if (kind === "H1" && isH1SuppressedByMediumMainReflectionCapture(userMessage, insight)) {
    return { status: "suppressed", reason: "h1_medium_main_reflection_capture" };
  }

  // v11: medium-band boundary correction.
  // For pressure/perfection/rest-worth/bracing families, default to silence unless stronger
  // admissibility is present beyond pattern-family routing.
  if (
    isMediumBand(userMessage) &&
    insightCapturesMediumPressureOrBracing(insight) &&
    !hasStrongerMediumAdmissibility(userMessage, insight)
  ) {
    return { status: "suppressed", reason: "h_medium_boundary_default_suppress" };
  }

  // v10: prevent H1-cleaned medium cases from rerouting into H5/H3 when the same movement
  // is already captured by the main reflection (decorative cross-kind substitution).
  if (isMediumBand(userMessage) && kind !== "H4" && insightCapturesMediumPressureOrBracing(insight)) {
    return { status: "suppressed", reason: "h_medium_cross_kind_substitution_block" };
  }

  if (kind === "H1" && isH1SuppressedByMediumSignalDowngrade(userMessage, insight)) {
    return { status: "suppressed", reason: "h1_medium_signal_downgrade" };
  }

  if (kind === "H1" && isH1ExtraNarrowingSuppressed(userMessage, insight)) {
    return { status: "suppressed", reason: "h1_permissiveness_narrowing" };
  }

  if (kind === "H3" && isH3SuppressedByNarrowing(userMessage, insight)) {
    return { status: "suppressed", reason: "h3_permissiveness_narrowing" };
  }

  if (kind === "H5" && insight.length < 42) {
    return {
      status: "suppressed",
      reason: "h5_narrowing_insufficient_substrate",
    };
  }

  const pair = pickTemplate(kind, seed, userMessage);

  // v6: redundancy suppression for H3.
  // Wisewave review: residual revise cluster isn't broad instability; H3 awareness line can still be removable
  // when the main reflection already carries the needed value.
  if (kind === "H3") {
    const theme = detectH3ThemeKey(userMessage);
    const mainSufficient = isMainReflectionSufficientForH3(insight);
    if (mainSufficient) {
      if (theme === "default" && isH3GenericDangerPairEn(pair.en)) {
        return { status: "suppressed", reason: "h3_main_reflection_sufficiency" };
      }
      if (theme === "replay_ruminate" && insightHasReplayRumination(lower)) {
        return { status: "suppressed", reason: "h3_main_reflection_sufficiency" };
      }
      if (theme === "reply_anxiety" && insightHasReplyAnxiety(lower)) {
        return { status: "suppressed", reason: "h3_main_reflection_sufficiency" };
      }
    }
  }

  // Strict stabilization linter: guardrail only (suppress; never generate new H).
  if (isMilestoneHStrictLinterEnabled()) {
    const strength = getHStrictLinterStrength();
    // Wisewave Kill List hard containment: suppress H if banned phrases show up.
    if (hasWisewaveKillListMultiSentence(pair.en, pair.zh)) {
      return {
        status: "suppressed",
        reason: "wisewave_kill_list_multi_sentence",
      };
    }
    if (hasWisewaveTooLong(pair.en, pair.zh, strength)) {
      return { status: "suppressed", reason: "wisewave_kill_list_too_long" };
    }
    if (hasWisewaveKillListBan(pair.en, pair.zh, strength)) {
      return {
        status: "suppressed",
        reason: "wisewave_kill_list_blacklisted_text",
      };
    }
  }

  return {
    status: "emitted",
    kind,
    textEn: pair.en.replace(/\n/g, " ").trim(),
    textZh: pair.zh.replace(/\n/g, " ").trim(),
  };
}
