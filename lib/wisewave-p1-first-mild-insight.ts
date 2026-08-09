/**
 * P1-FMI — First Mild Insight (internal-only, default-off).
 * Response-quality threshold inside main_reflection — not a visible product object.
 * @see docs/Wisewave_Product_Milestone_P1_FMI_First_Mild_Insight_Nova_Implementation_Addendum_v1_1_LOCKED.md
 */

import { detectP0OpeningType } from "@/lib/wisewave-p0-opening-detection";
import { evaluateP0SafetyOverride } from "@/lib/wisewave-p0-safety-override";
import { looksUtilitarianOrFactual } from "@/lib/wisewave-milestone-h-micro-awareness";

export const P1_FMI_BUILD_MARKER = "p1_fmi_v1_1_internal";

export type FMIState =
  | "not_evaluated"
  | "deferred_insufficient_signal"
  | "deferred_missing_context"
  | "suppressed_safety"
  | "suppressed_out_of_scope"
  | "rendered";

export type FMIInputType =
  | "greeting"
  | "self_expression"
  | "story"
  | "advice_seeking"
  | "question"
  | "document"
  | "factual"
  | "utilitarian"
  | "unknown";

export type FMISignalStrength = "low" | "medium" | "high";

export type FirstMildInsightValidation = {
  specificMirror: boolean;
  oneGroundedRelationship: boolean;
  evidenceClose: boolean;
  lowClaim: boolean;
  nonDiagnostic: boolean;
  nonDirective: boolean;
  noPatternClaim: boolean;
  noHiddenCauseClaim: boolean;
  readableInOnePass: boolean;
};

export type FirstMildInsightDebug = {
  enabled: boolean;
  flag_set: boolean;
  blocked_on_hosted: boolean;
  blocked_on_production: boolean;
  blocked_on_preview: boolean;
  allow_hosted_preview_set: boolean;
  vercel_env: string | null;
  build_marker: string;
  state: FMIState | "eligible";
  rendered: boolean;
  suppression_reason: string | null;
  input_type: FMIInputType | null;
  input_signal_strength: FMISignalStrength | null;
  has_explicit_personal_relationship: boolean | null;
  eligibility_reused: boolean;
  system_appendix_applied: boolean;
  secondary_layers_suppressed: boolean;
  validator: FirstMildInsightValidation | null;
  validator_passed: boolean | null;
  committed_user_turn_id: string | null;
};

export type FirstMildInsightEnablement = {
  enabled: boolean;
  flagSet: boolean;
  vercelEnv: string | null;
  /**
   * True when runtime would be blocked without an explicit Preview allow.
   * Production is always hard-blocked in this gate (no production allow key).
   */
  blockedOnHosted: boolean;
  blockedOnProduction: boolean;
  blockedOnPreview: boolean;
  /** P1_FMI_ALLOW_HOSTED_PREVIEW is set (Preview unlock only; ignored for Production). */
  allowHostedPreviewSet: boolean;
};

export type FirstMildInsightContext = {
  conversationId: string;
  committedUserTurnId: string;
  isNewConversation: boolean;
  userMessageCount: number;
  currentState: FMIState;
  priorFirstMildInsightRendered: boolean;
  inputSignalStrength: FMISignalStrength;
  inputType: FMIInputType;
  hasExplicitPersonalRelationshipToContent: boolean;
  safetyOverrideActive: boolean;
  /** Reused eligibility from prior evaluation of the same committed turn. */
  reusedEligibility?: FMIState | "eligible" | null;
};

export type FirstMildInsightTurnResult = {
  enabled: boolean;
  enablement: FirstMildInsightEnablement;
  buildMarker: string;
  state: FMIState | "eligible";
  rendered: boolean;
  suppressionReason: string | null;
  inputType: FMIInputType;
  inputSignalStrength: FMISignalStrength;
  hasExplicitPersonalRelationship: boolean;
  eligibilityReused: boolean;
  systemAppendix: string;
  /** When true, suppress last_insight / pattern / soft continuity / H / J for this turn. */
  suppressSecondaryLayers: boolean;
  debug: FirstMildInsightDebug;
};

const WEAK_EMOTION_ONLY_RE =
  /^(i\s*(feel|am|'m)\s*(bad|sad|ok|okay|fine|tired|anxious|nervous|empty|lost|confused|meh)[.!]?\s*|我(觉得|感到)?(不好|难过|累|空|烦|焦虑|紧张|迷茫)[。！]?)$/iu;

const PERSONAL_RELATIONSHIP_RE =
  /\b(i\s+wrote\s+this|this\s+is\s+(about\s+)?me|after\s+my\s+|my\s+(father|mother|dad|mom|partner|friend|boss|manager)|keep\s+(returning|coming\s+back|rereading)|i\s+keep\s+(reading|returning)|means\s+to\s+me|for\s+me\s+personally|about\s+my\s+|i\s+pasted\s+this\s+because)\b/i;
const PERSONAL_RELATIONSHIP_ZH_RE =
  /(我写的|这是我|关于我|我父亲|我母亲|我爸|我妈|我朋友|我老板|一直回来看|反复看|对我来说|和我有关|因为.*我)/u;

const ADVICE_TENSION_RE =
  /\b(but|however|afraid|fear|feel|invisible|cope|endure|should|avoid|stuck|conflict|torn|also)\b/i;
const ADVICE_TENSION_ZH_RE =
  /(但是|可是|却|害怕|担心|觉得|隐形|撑|应该|回避|卡住|矛盾|一方面|另一方面)/u;

const CONTINUATION_PRESSURE_RE =
  /\b(would you like to (go deeper|explore|continue)|shall we (go deeper|explore)|keep reflecting|unlock more|start your journey)\b/i;
const CONTINUATION_PRESSURE_ZH_RE =
  /(要不要继续|要不要深入|我们一起探索|继续深入|开启旅程)/u;

const DIAGNOSIS_RE =
  /\b(diagnosis|diagnosed|trauma|ptsd|depression|anxiety disorder|personality disorder|attachment style|nervous system|unconscious|pathology|clinical|therapy|therapist|healing journey)\b/i;
const DIAGNOSIS_ZH_RE =
  /(诊断|创伤|抑郁症|焦虑症|人格障碍|依恋类型|神经系统|潜意识|病理|疗愈|你需要治疗)/u;

const ADVICE_RE =
  /\b(you (should|need to|must|have to)|try to|take one (small )?step|stop judging|i recommend|my advice)\b/i;
const ADVICE_ZH_RE =
  /(你应该|你需要|你必须|试着去|迈出一小步|停止评判|我建议|你该)/u;

const PATTERN_CLAIM_RE =
  /\b(your pattern|this is your pattern|you always|recurring pattern|lifelong pattern|permanent pattern)\b/i;
const PATTERN_CLAIM_ZH_RE =
  /(你的模式是|这是你的模式|你总是|一直以来的模式|反复出现的模式)/u;

const HIDDEN_CAUSE_RE =
  /\b(the real reason|what is really happening|hidden (fear|cause|motive)|deep down|your soul|higher (self|path)|childhood (conditioning|trauma))\b/i;
const HIDDEN_CAUSE_ZH_RE =
  /(真正的原因|真正的问题是|你内心深处|你其实是在|这源于|潜意识|更高的自己|童年)/u;

const CERTAINTY_RE =
  /\b(clearly|obviously|this proves|what is really happening is)\b/i;
const CERTAINTY_ZH_RE = /(显然|毫无疑问|这证明|真正发生的是)/u;

const RELATIONSHIP_CUE_RE =
  /\b(not only|more than|less about|may (also )?be|seems|feels like|perhaps|what seems|because it|tied to|attached to)\b/i;
const RELATIONSHIP_CUE_ZH_RE =
  /(不只是|更像是|可能|似乎|像是|也许|并不只是|更重的是|因为)/u;

/**
 * Flag resolution:
 * - Default off
 * - Local / non-Vercel: ENABLE_P1_FIRST_MILD_INSIGHT=1 enables
 * - Vercel Preview: also requires P1_FMI_ALLOW_HOSTED_PREVIEW=1 (Tree Hosted Preview gate)
 * - Vercel Production: always hard-blocked (no production allow key in this gate)
 */
export function resolveP1FirstMildInsightEnablement(): FirstMildInsightEnablement {
  const raw = process.env.ENABLE_P1_FIRST_MILD_INSIGHT?.trim().toLowerCase();
  const flagSet = raw === "true" || raw === "1" || raw === "yes";
  const vercelEnv = process.env.VERCEL_ENV?.trim() || null;
  const allowRaw = process.env.P1_FMI_ALLOW_HOSTED_PREVIEW?.trim().toLowerCase();
  const allowHostedPreviewSet =
    allowRaw === "true" || allowRaw === "1" || allowRaw === "yes";

  const blockedOnProduction = vercelEnv === "production";
  const blockedOnPreview = vercelEnv === "preview" && !allowHostedPreviewSet;
  const blockedOnHosted = blockedOnProduction || blockedOnPreview;

  return {
    enabled: flagSet && !blockedOnHosted,
    flagSet,
    vercelEnv,
    blockedOnHosted,
    blockedOnProduction,
    blockedOnPreview,
    allowHostedPreviewSet,
  };
}

export function isP1FirstMildInsightEnabled(): boolean {
  return resolveP1FirstMildInsightEnablement().enabled;
}

export function hasExplicitPersonalRelationshipToContent(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  return PERSONAL_RELATIONSHIP_RE.test(t) || PERSONAL_RELATIONSHIP_ZH_RE.test(t);
}

function hasAdviceTension(text: string): boolean {
  return ADVICE_TENSION_RE.test(text) || ADVICE_TENSION_ZH_RE.test(text);
}

export function classifyFMIInput(userMessage: string): {
  inputType: FMIInputType;
  signalStrength: FMISignalStrength;
  hasExplicitPersonalRelationship: boolean;
} {
  const text = userMessage.trim();
  const personal = hasExplicitPersonalRelationshipToContent(text);

  if (!text) {
    return {
      inputType: "unknown",
      signalStrength: "low",
      hasExplicitPersonalRelationship: false,
    };
  }

  // Opening detection first so short advice-seeking is not swallowed by utilitarian short-length heuristics.
  const opening = detectP0OpeningType(text);

  if (opening.type === "greeting") {
    return {
      inputType: "greeting",
      signalStrength: "low",
      hasExplicitPersonalRelationship: personal,
    };
  }

  if (opening.type === "advice_seeking") {
    // Low-context advice → defer. Advice + explicit personal tension → eligible self-expression.
    const tensionMinLen = /[\u4E00-\u9FFF]/.test(text) ? 28 : 48;
    if (hasAdviceTension(text) && text.length >= tensionMinLen) {
      return {
        inputType: "self_expression",
        signalStrength: text.length >= (tensionMinLen < 48 ? 40 : 100) ? "high" : "medium",
        hasExplicitPersonalRelationship: personal || true,
      };
    }
    return {
      inputType: "advice_seeking",
      signalStrength: "low",
      hasExplicitPersonalRelationship: personal,
    };
  }

  if (opening.type === "question_request") {
    return {
      inputType: "question",
      signalStrength: "low",
      hasExplicitPersonalRelationship: personal,
    };
  }

  if (opening.type === "document_upload") {
    return {
      inputType: "document",
      signalStrength: personal ? "medium" : "low",
      hasExplicitPersonalRelationship: personal,
    };
  }

  if (opening.type === "story" || opening.type === "long_context") {
    return {
      inputType: opening.type === "story" ? "story" : "self_expression",
      signalStrength: text.length >= 120 ? "high" : "medium",
      hasExplicitPersonalRelationship: personal,
    };
  }

  if (opening.type === "emotional_opening" || opening.type === "writing_difficulty") {
    // CJK dense turns can be short in char count yet still carry a grounded relationship.
    const weakByLength = /[\u4E00-\u9FFF]/.test(text)
      ? text.length < 12
      : text.length < 24;
    if (WEAK_EMOTION_ONLY_RE.test(text) || weakByLength) {
      return {
        inputType: "self_expression",
        signalStrength: "low",
        hasExplicitPersonalRelationship: personal,
      };
    }
    const highThreshold = /[\u4E00-\u9FFF]/.test(text) ? 40 : 90;
    return {
      inputType: "self_expression",
      signalStrength: text.length >= highThreshold ? "high" : "medium",
      hasExplicitPersonalRelationship: personal,
    };
  }

  // Utilitarian/factual only after reflective openings are ruled out (short EN length heuristic).
  if (looksUtilitarianOrFactual(text)) {
    return {
      inputType: /what time|几点|timezone|sydney|weather|多少钱|how much/i.test(text)
        ? "factual"
        : "utilitarian",
      signalStrength: "low",
      hasExplicitPersonalRelationship: personal,
    };
  }

  if (opening.type === "unknown") {
    if (text.length >= 60 && /\b(i|me|my|我|自己)\b/i.test(text)) {
      return {
        inputType: "self_expression",
        signalStrength: "medium",
        hasExplicitPersonalRelationship: personal,
      };
    }
    return {
      inputType: "unknown",
      signalStrength: "low",
      hasExplicitPersonalRelationship: personal,
    };
  }

  return {
    inputType: "unknown",
    signalStrength: "low",
    hasExplicitPersonalRelationship: personal,
  };
}

/**
 * Conceptual eligibility (§9). Returns FMIState or "eligible".
 */
export function evaluateFMIEligibility(
  context: FirstMildInsightContext
): FMIState | "eligible" {
  if (context.reusedEligibility) {
    return context.reusedEligibility;
  }

  if (context.safetyOverrideActive) {
    return "suppressed_safety";
  }

  if (context.priorFirstMildInsightRendered) {
    return "suppressed_out_of_scope";
  }

  // Advice-seeking without enough personal tension stays deferred (not permanently closed).
  if (context.inputType === "advice_seeking") {
    return "deferred_missing_context";
  }

  if (
    context.inputType === "document" &&
    !context.hasExplicitPersonalRelationshipToContent
  ) {
    return "deferred_missing_context";
  }

  if (context.inputSignalStrength === "low") {
    // Greetings / factual / utilitarian / unknown map to out-of-scope when typed that way;
    // weak self-expression stays deferred so a later turn may qualify.
    if (
      context.inputType === "greeting" ||
      context.inputType === "factual" ||
      context.inputType === "utilitarian" ||
      context.inputType === "unknown" ||
      context.inputType === "question"
    ) {
      return "suppressed_out_of_scope";
    }
    return "deferred_insufficient_signal";
  }

  if (
    context.inputType === "greeting" ||
    context.inputType === "factual" ||
    context.inputType === "utilitarian" ||
    context.inputType === "unknown" ||
    context.inputType === "question"
  ) {
    return "suppressed_out_of_scope";
  }

  if (
    context.inputType === "document" &&
    !context.hasExplicitPersonalRelationshipToContent
  ) {
    return "deferred_missing_context";
  }

  if (context.inputType === "advice_seeking") {
    return "deferred_missing_context";
  }

  return "eligible";
}

export function buildFMISystemAppendix(wantsChinese: boolean): string {
  if (wantsChinese) {
    return `

P1-FMI 回应质量阈值（内部，不可对用户标注）：
- 当用户已给出足够的自我参照意义时，主回应（main reflection）可以包含一个小而清晰的澄清：把用户表达里已经出现、或被有力支持的两个要素轻轻连起来。
- 不要把它标成「洞察」「insight」「第一次发现」；不要标题；不要成就感。
- 结构优先：一句贴近的映照 + 一句有依据的关系澄清；必要时最多第三句轻量澄清。默认 1–3 句。
- 只用开放确信度（可能、似乎、像是）；不要诊断、建议、模式断言、隐藏原因、童年/潜意识/神经解释。
- 不要拉长对话的 CTA（要不要深入、继续探索等）。映照干净就停。
- 若普通映照已经足够清晰，不要硬加一层「洞察」。`;
  }

  return `

P1-FMI response-quality threshold (internal; never label to the user):
- When the user has shared enough grounded self-referential meaning, the main reflection may include one small clarification connecting two elements already present or strongly supported in their expression.
- Do not label it as an insight. Do not force it when an ordinary reflection already lands cleanly. Do not infer hidden causes. Do not identify a recurring pattern from one turn. Do not give advice or continuation pressure.
- Preferred shape: (1) accurate mirror of present experience, (2) one plausible relationship/tension already supported, (3) optional light clarification only if necessary. Default 1–3 concise sentences.
- Use open certainty (may, seems, feels like, perhaps). Stay evidence-close. Leave room for disagreement.
- Do not add CTAs such as “Would you like to go deeper?” — end cleanly.`;
}

export function validateFirstMildInsightCandidate(args: {
  userMessage: string;
  assistantMessage: string;
}): { passed: boolean; checks: FirstMildInsightValidation } {
  const assistant = args.assistantMessage.trim();
  const sentences = assistant
    .split(/(?<=[.!?。！？])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const nonDiagnostic =
    !DIAGNOSIS_RE.test(assistant) && !DIAGNOSIS_ZH_RE.test(assistant);
  const nonDirective =
    !ADVICE_RE.test(assistant) &&
    !ADVICE_ZH_RE.test(assistant) &&
    !CONTINUATION_PRESSURE_RE.test(assistant) &&
    !CONTINUATION_PRESSURE_ZH_RE.test(assistant);
  const noPatternClaim =
    !PATTERN_CLAIM_RE.test(assistant) && !PATTERN_CLAIM_ZH_RE.test(assistant);
  const noHiddenCauseClaim =
    !HIDDEN_CAUSE_RE.test(assistant) && !HIDDEN_CAUSE_ZH_RE.test(assistant);
  const lowClaim =
    !CERTAINTY_RE.test(assistant) && !CERTAINTY_ZH_RE.test(assistant);
  const readableInOnePass =
    sentences.length >= 1 &&
    sentences.length <= 4 &&
    assistant.length <= 520 &&
    !/\n{2,}/.test(assistant);

  const oneGroundedRelationship =
    RELATIONSHIP_CUE_RE.test(assistant) || RELATIONSHIP_CUE_ZH_RE.test(assistant);

  // Specificity: reject ultra-generic summaries without user-anchored detail.
  const genericOnly =
    /^(it sounds like you are going through a difficult time[.!]?\s*|听起来你最近过得不太容易[。！]?\s*)$/iu.test(
      assistant
    ) ||
    (/difficult time|having trouble|finding it difficult/i.test(assistant) &&
      assistant.length < 80 &&
      !oneGroundedRelationship);

  const specificMirror = !genericOnly && assistant.length >= 40;
  const evidenceClose =
    specificMirror &&
    nonDiagnostic &&
    noHiddenCauseClaim &&
    // Prefer staying close to user language length budget vs inventing a long theory.
    assistant.length <= Math.max(220, args.userMessage.trim().length * 2.5);

  const checks: FirstMildInsightValidation = {
    specificMirror,
    oneGroundedRelationship,
    evidenceClose,
    lowClaim,
    nonDiagnostic,
    nonDirective,
    noPatternClaim,
    noHiddenCauseClaim,
    readableInOnePass,
  };

  const passed = Object.values(checks).every(Boolean);
  return { passed, checks };
}

export function readFMIMetadata(meta: unknown): {
  rendered?: boolean;
  state?: FMIState | "eligible";
  committedUserTurnId?: string;
} | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const fmi = (meta as Record<string, unknown>).wisewave_p1_fmi;
  if (!fmi || typeof fmi !== "object" || Array.isArray(fmi)) return null;
  const row = fmi as Record<string, unknown>;
  return {
    rendered: row.rendered === true,
    state:
      typeof row.state === "string"
        ? (row.state as FMIState | "eligible")
        : undefined,
    committedUserTurnId:
      typeof row.committed_user_turn_id === "string"
        ? row.committed_user_turn_id
        : undefined,
  };
}

export function conversationHasFMIRendered(
  messages: Array<{ role: string; metadata?: unknown }>
): boolean {
  for (const m of messages) {
    if (m.role !== "assistant") continue;
    const fmi = readFMIMetadata(m.metadata);
    if (fmi?.rendered) return true;
  }
  return false;
}

export function findPriorEligibilityForTurn(
  messages: Array<{ id: string; role: string; metadata?: unknown }>,
  committedUserTurnId: string
): FMIState | "eligible" | null {
  for (const m of messages) {
    if (m.id !== committedUserTurnId && m.role !== "user") continue;
    if (m.id === committedUserTurnId) {
      const fmi = readFMIMetadata(m.metadata);
      if (fmi?.state) return fmi.state;
    }
  }
  // Also check assistant rows that recorded eligibility for this turn (retry path).
  for (const m of messages) {
    if (m.role !== "assistant") continue;
    const fmi = readFMIMetadata(m.metadata);
    if (fmi?.committedUserTurnId === committedUserTurnId && fmi.state) {
      return fmi.state;
    }
  }
  return null;
}

function suppressionReasonFor(state: FMIState | "eligible"): string | null {
  switch (state) {
    case "eligible":
      return null;
    case "deferred_insufficient_signal":
      return "deferred_insufficient_signal";
    case "deferred_missing_context":
      return "deferred_missing_context";
    case "suppressed_safety":
      return "suppressed_safety";
    case "suppressed_out_of_scope":
      return "suppressed_out_of_scope";
    case "rendered":
      return "already_rendered";
    case "not_evaluated":
      return "not_evaluated";
    default:
      return "unknown";
  }
}

export function computeP1FirstMildInsightTurn(args: {
  userMessage: string;
  conversationId: string;
  committedUserTurnId: string;
  userMessageCount: number;
  priorMessages: Array<{ id: string; role: string; message: string; metadata?: unknown }>;
  wantsChinese: boolean;
  /** When provided, overrides local P0 safety scan (e.g. turn already computed P0 safety). */
  safetyOverrideActive?: boolean;
}): FirstMildInsightTurnResult {
  const enablement = resolveP1FirstMildInsightEnablement();
  const buildMarker = P1_FMI_BUILD_MARKER;

  const emptyDebug = (partial?: Partial<FirstMildInsightDebug>): FirstMildInsightDebug => ({
    enabled: false,
    flag_set: enablement.flagSet,
    blocked_on_hosted: enablement.blockedOnHosted,
    blocked_on_production: enablement.blockedOnProduction,
    blocked_on_preview: enablement.blockedOnPreview,
    allow_hosted_preview_set: enablement.allowHostedPreviewSet,
    vercel_env: enablement.vercelEnv,
    build_marker: buildMarker,
    state: "not_evaluated",
    rendered: false,
    suppression_reason: enablement.flagSet
      ? enablement.blockedOnHosted
        ? "blocked_on_hosted"
        : "disabled"
      : "flag_off",
    input_type: null,
    input_signal_strength: null,
    has_explicit_personal_relationship: null,
    eligibility_reused: false,
    system_appendix_applied: false,
    secondary_layers_suppressed: false,
    validator: null,
    validator_passed: null,
    committed_user_turn_id: args.committedUserTurnId,
    ...partial,
  });

  if (!enablement.enabled) {
    return {
      enabled: false,
      enablement,
      buildMarker,
      state: "not_evaluated",
      rendered: false,
      suppressionReason: enablement.flagSet ? "blocked_on_hosted" : "flag_off",
      inputType: "unknown",
      inputSignalStrength: "low",
      hasExplicitPersonalRelationship: false,
      eligibilityReused: false,
      systemAppendix: "",
      suppressSecondaryLayers: false,
      debug: emptyDebug(),
    };
  }

  const classified = classifyFMIInput(args.userMessage);
  const safety =
    args.safetyOverrideActive !== undefined
      ? { triggered: args.safetyOverrideActive }
      : evaluateP0SafetyOverride({
          userMessage: args.userMessage,
          wantsChinese: args.wantsChinese,
        });

  const priorRendered = conversationHasFMIRendered(args.priorMessages);
  const reused = findPriorEligibilityForTurn(
    args.priorMessages,
    args.committedUserTurnId
  );

  const context: FirstMildInsightContext = {
    conversationId: args.conversationId,
    committedUserTurnId: args.committedUserTurnId,
    isNewConversation: args.userMessageCount <= 1,
    userMessageCount: args.userMessageCount,
    currentState: priorRendered ? "rendered" : "not_evaluated",
    priorFirstMildInsightRendered: priorRendered,
    inputSignalStrength: classified.signalStrength,
    inputType: classified.inputType,
    hasExplicitPersonalRelationshipToContent:
      classified.hasExplicitPersonalRelationship,
    safetyOverrideActive: safety.triggered,
    reusedEligibility: reused,
  };

  const state = evaluateFMIEligibility(context);
  const eligible = state === "eligible";
  const systemAppendix = eligible
    ? buildFMISystemAppendix(args.wantsChinese)
    : "";

  const debug: FirstMildInsightDebug = {
    enabled: true,
    flag_set: enablement.flagSet,
    blocked_on_hosted: enablement.blockedOnHosted,
    blocked_on_production: enablement.blockedOnProduction,
    blocked_on_preview: enablement.blockedOnPreview,
    allow_hosted_preview_set: enablement.allowHostedPreviewSet,
    vercel_env: enablement.vercelEnv,
    build_marker: buildMarker,
    state,
    rendered: false,
    suppression_reason: suppressionReasonFor(state),
    input_type: classified.inputType,
    input_signal_strength: classified.signalStrength,
    has_explicit_personal_relationship: classified.hasExplicitPersonalRelationship,
    eligibility_reused: reused != null,
    system_appendix_applied: systemAppendix.length > 0,
    secondary_layers_suppressed: eligible,
    validator: null,
    validator_passed: null,
    committed_user_turn_id: args.committedUserTurnId,
  };

  return {
    enabled: true,
    enablement,
    buildMarker,
    state,
    rendered: false,
    suppressionReason: suppressionReasonFor(state),
    inputType: classified.inputType,
    inputSignalStrength: classified.signalStrength,
    hasExplicitPersonalRelationship: classified.hasExplicitPersonalRelationship,
    eligibilityReused: reused != null,
    systemAppendix,
    suppressSecondaryLayers: eligible,
    debug,
  };
}

/** Post-generation: mark rendered only when validator passes; otherwise keep eligibility without render. */
export function finalizeFMIAfterGeneration(args: {
  turn: FirstMildInsightTurnResult;
  userMessage: string;
  assistantMessage: string;
  safetyOverrideActive: boolean;
}): FirstMildInsightTurnResult {
  const turn = args.turn;
  if (!turn.enabled || turn.state !== "eligible") {
    return turn;
  }

  if (args.safetyOverrideActive) {
    const debug: FirstMildInsightDebug = {
      ...turn.debug,
      state: "suppressed_safety",
      rendered: false,
      suppression_reason: "post_generation_safety",
      secondary_layers_suppressed: true,
      validator_passed: false,
    };
    return {
      ...turn,
      state: "suppressed_safety",
      rendered: false,
      suppressionReason: "post_generation_safety",
      suppressSecondaryLayers: true,
      debug,
    };
  }

  const { passed, checks } = validateFirstMildInsightCandidate({
    userMessage: args.userMessage,
    assistantMessage: args.assistantMessage,
  });

  if (!passed) {
    const debug: FirstMildInsightDebug = {
      ...turn.debug,
      state: "eligible",
      rendered: false,
      suppression_reason: "validator_failed_use_baseline",
      secondary_layers_suppressed: true,
      validator: checks,
      validator_passed: false,
    };
    return {
      ...turn,
      rendered: false,
      suppressionReason: "validator_failed_use_baseline",
      suppressSecondaryLayers: true,
      debug,
    };
  }

  const debug: FirstMildInsightDebug = {
    ...turn.debug,
    state: "rendered",
    rendered: true,
    suppression_reason: null,
    secondary_layers_suppressed: true,
    validator: checks,
    validator_passed: true,
  };

  return {
    ...turn,
    state: "rendered",
    rendered: true,
    suppressionReason: null,
    suppressSecondaryLayers: true,
    debug,
  };
}

export function buildFMIMessageMetadata(turn: FirstMildInsightTurnResult): Record<
  string,
  unknown
> {
  return {
    wisewave_p1_fmi: {
      build_marker: turn.buildMarker,
      state: turn.state,
      rendered: turn.rendered,
      committed_user_turn_id: turn.debug.committed_user_turn_id,
      input_type: turn.inputType,
      input_signal_strength: turn.inputSignalStrength,
      // Operational only — no user/assistant text.
      suppression_reason: turn.suppressionReason,
      validator_passed: turn.debug.validator_passed,
    },
  };
}
