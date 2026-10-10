/**
 * P1-FRL Phase 1 — Reflection Literacy (internal, default-off).
 * Marker: p1_reflection_literacy_v1_internal
 *
 * Tree 2026-10-10: AUTHORIZE PHASE 1 INTERNAL IMPLEMENTATION.
 * Scope: one light reframe for advice-seeking / abstract self-explanation
 * in the first-use window, then withdraw. No Carry / Return. No FMI core edits.
 * Production hard-blocked. Hosted Preview: Founder B 2026-10-11 — requires
 * P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW. Aurora COPY LOCK 2026-10-10.
 *
 * Spine: teach the posture of reflection, not the answer to life.
 */

import { detectP0OpeningType } from "@/lib/wisewave-p0-opening-detection";
import { isP0EntryPhase } from "@/lib/wisewave-p0-reflection-modes";
import { classifyFMIInput } from "@/lib/wisewave-p1-first-mild-insight";

export const P1_REFLECTION_LITERACY_BUILD_MARKER =
  "p1_reflection_literacy_v1_internal";

/** Aurora COPY LOCK 2026-10-10 — Advice-Seeking / Abstract Self-Explanation EN·ZH. */
export const P1_FRL_COPY_ADVICE_EN =
  "You don’t need to know what to do here. You can begin with what’s already present: a feeling, a situation, or even not knowing yet.";

export const P1_FRL_COPY_ADVICE_ZH =
  "在这里，不需要急着知道该怎么做。你可以从眼前已经有的东西开始：一种感受、一件事，甚至只是还不知道。";

export const P1_FRL_COPY_ABSTRACT_EN =
  "You don’t need to explain yourself all at once here. You can stay with one thing that feels present, without needing the whole picture to be clear.";

export const P1_FRL_COPY_ABSTRACT_ZH =
  "在这里，不需要一次把自己解释清楚。可以先停在此刻比较明显的一点上，不必急着把整个自己说明白。";

const ZH_COUNSELLING_AVOID = [
  "你真正的问题是",
  "你的内心深处",
  "你的潜意识",
  "你其实是在",
  "你需要疗愈",
  "你的模式是",
  "我陪你",
  "我们一起走进去",
] as const;

export type P1ReflectionLiteracyState =
  | "flag_off"
  | "safety"
  | "clear_genuine_expression"
  | "advice_seeking"
  | "abstract_self_explanation"
  | "low_signal"
  | "out_of_window";

export type P1ReflectionLiteracyEnablement = {
  enabled: boolean;
  flagSet: boolean;
  vercelEnv: string | null;
  blockedOnHosted: boolean;
  blockedOnProduction: boolean;
  blockedOnPreview: boolean;
  allowHostedPreviewSet: boolean;
};

export type P1ReflectionLiteracyResult = {
  buildMarker: string;
  enablement: P1ReflectionLiteracyEnablement;
  state: P1ReflectionLiteracyState;
  reframeApplied: boolean;
  withholdP0ModeAppendix: boolean;
  systemAppendix: string;
  suppressionReason: string | null;
  literacyKind: "advice_seeking" | "abstract_self_explanation" | null;
  debug: {
    state: P1ReflectionLiteracyState;
    reframe_applied: boolean;
    withhold_p0_mode_appendix: boolean;
    literacy_kind: "advice_seeking" | "abstract_self_explanation" | null;
    first_use_window: boolean;
    prior_genuine: boolean;
    fmi_input_type: string | null;
    fmi_signal_strength: string | null;
    abstract_detected: boolean;
    copy_lock_status: "aurora_copy_locked";
  };
};

export function resolveP1ReflectionLiteracyEnablement(): P1ReflectionLiteracyEnablement {
  const raw = process.env.ENABLE_P1_REFLECTION_LITERACY?.trim().toLowerCase();
  const flagSet = raw === "true" || raw === "1" || raw === "yes";
  const vercelEnv = process.env.VERCEL_ENV?.trim() || null;
  const allowRaw =
    process.env.P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW?.trim().toLowerCase();
  const allowHostedPreviewSet =
    allowRaw === "true" || allowRaw === "1" || allowRaw === "yes";

  // Production hard-block. Preview needs explicit allow (Founder B 2026-10-11).
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

export function isP1ReflectionLiteracyEnabled(): boolean {
  return resolveP1ReflectionLiteracyEnablement().enabled;
}

function isGenuineExpression(userMessage: string): boolean {
  const c = classifyFMIInput(userMessage);
  return (
    (c.inputType === "self_expression" || c.inputType === "story") &&
    (c.signalStrength === "medium" || c.signalStrength === "high")
  );
}

/**
 * Conservative abstract self-explanation: generalised self-as-topic without
 * situated lived experience. Loses to genuine expression. Uncertain → false.
 */
export function detectAbstractSelfExplanation(userMessage: string): boolean {
  const t = userMessage.trim();
  if (!t) return false;
  const hasCjk = /[\u4E00-\u9FFF]/.test(t);
  // CJK lines are denser; keep EN floor higher to stay suppression-first.
  if (t.length < (hasCjk ? 6 : 12)) return false;
  if (isGenuineExpression(t)) return false;

  const opening = detectP0OpeningType(t);
  if (
    opening.type === "greeting" ||
    opening.type === "writing_difficulty" ||
    opening.type === "advice_seeking" ||
    opening.type === "document_upload" ||
    opening.type === "question_request"
  ) {
    return false;
  }

  // Situated markers → not abstract literacy (baseline or genuine path).
  const situated =
    /\b(today|yesterday|this morning|at work|my (boss|partner|wife|husband|mom|dad|mother|father|friend|job|meeting))\b/i.test(
      t
    ) ||
    /(今天|昨天|刚才|上班|工作上|老板|伴侣|老公|老婆|妈妈|爸爸|朋友|开会)/.test(t);
  if (situated) return false;

  const abstractEn =
    /\bwhy am i always\b/i.test(t) ||
    /\bwhy do i keep (being|doing|getting)\b/i.test(t) ||
    /\bi want to understand (my|myself|this) patterns?\b/i.test(t) ||
    /\bunderstand my patterns?\b/i.test(t) ||
    /\bthis kind of person\b/i.test(t) ||
    /\bwho am i (really|supposed to be)\b/i.test(t) ||
    /\bwork on (myself|my patterns?)\b/i.test(t) ||
    /\bfigure myself out\b/i.test(t);

  const abstractZh =
    /为什么我总是/.test(t) ||
    /为什么我老是/.test(t) ||
    /想理解自己的?模式/.test(t) ||
    /搞清楚自己/.test(t) ||
    /我这种人/.test(t) ||
    /总是这样的人/.test(t) ||
    /想弄明白自己/.test(t);

  return abstractEn || abstractZh;
}

function buildLiteracyAppendix(
  kind: "advice_seeking" | "abstract_self_explanation",
  wantsChinese: boolean
): string {
  const body =
    kind === "advice_seeking"
      ? wantsChinese
        ? P1_FRL_COPY_ADVICE_ZH
        : P1_FRL_COPY_ADVICE_EN
      : wantsChinese
        ? P1_FRL_COPY_ABSTRACT_ZH
        : P1_FRL_COPY_ABSTRACT_EN;

  return `

P1 Reflection Literacy (one light reframe — withdraw once genuine expression begins):
- Teach the posture of reflection, not the answer to life.
- Do not onboard, coach, therapize, journal-guide, or companion.
- Do not ask a first reflective question or offer options menus.
- Keep user authorship with the user. One short permission tone.
- Preferred line (use or stay extremely close; do not invent a third family):
${body}`;
}

export function literacyCopyContainsProhibited(text: string): boolean {
  const lower = text.toLowerCase();
  if (
    /\b(insight unlocked|go deeper|shall we|here's what you should do|i'm here for you|i'll stay with you)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  if (/Would you like to|要不要先|要不要我们/.test(text)) return true;
  for (const phrase of ZH_COUNSELLING_AVOID) {
    if (text.includes(phrase)) return true;
  }
  return false;
}

export type ComputeP1ReflectionLiteracyInput = {
  userMessage: string;
  userTurnIndex: number;
  priorUserMessages: string[];
  wantsChinese: boolean;
  safetyOverrideActive: boolean;
};

function emptyResult(
  enablement: P1ReflectionLiteracyEnablement,
  state: P1ReflectionLiteracyState,
  suppressionReason: string | null,
  extras?: Partial<P1ReflectionLiteracyResult["debug"]>
): P1ReflectionLiteracyResult {
  return {
    buildMarker: P1_REFLECTION_LITERACY_BUILD_MARKER,
    enablement,
    state,
    reframeApplied: false,
    withholdP0ModeAppendix: false,
    systemAppendix: "",
    suppressionReason,
    literacyKind: null,
    debug: {
      state,
      reframe_applied: false,
      withhold_p0_mode_appendix: false,
      literacy_kind: null,
      first_use_window: extras?.first_use_window ?? false,
      prior_genuine: extras?.prior_genuine ?? false,
      fmi_input_type: extras?.fmi_input_type ?? null,
      fmi_signal_strength: extras?.fmi_signal_strength ?? null,
      abstract_detected: extras?.abstract_detected ?? false,
      copy_lock_status: "aurora_copy_locked",
    },
  };
}

export function computeP1ReflectionLiteracyTurn(
  input: ComputeP1ReflectionLiteracyInput
): P1ReflectionLiteracyResult {
  const enablement = resolveP1ReflectionLiteracyEnablement();

  if (!enablement.enabled) {
    const reason = !enablement.flagSet
      ? "flag_off"
      : enablement.blockedOnProduction
        ? "blocked_production"
        : enablement.blockedOnPreview
          ? "blocked_preview"
          : "flag_off";
    return emptyResult(enablement, "flag_off", reason);
  }

  if (input.safetyOverrideActive) {
    return emptyResult(enablement, "safety", "safety_override");
  }

  const classified = classifyFMIInput(input.userMessage);
  const genuineNow = isGenuineExpression(input.userMessage);
  if (genuineNow) {
    return emptyResult(enablement, "clear_genuine_expression", "genuine_bypass", {
      fmi_input_type: classified.inputType,
      fmi_signal_strength: classified.signalStrength,
      first_use_window: isP0EntryPhase({
        userTurnIndex: input.userTurnIndex,
        priorUserMessages: input.priorUserMessages,
      }),
    });
  }

  const priorGenuine = input.priorUserMessages.some((m) => isGenuineExpression(m));
  const firstUseWindow = isP0EntryPhase({
    userTurnIndex: input.userTurnIndex,
    priorUserMessages: input.priorUserMessages,
  });

  if (!firstUseWindow || priorGenuine) {
    return emptyResult(enablement, "out_of_window", priorGenuine ? "prior_genuine" : "out_of_window", {
      first_use_window: firstUseWindow,
      prior_genuine: priorGenuine,
      fmi_input_type: classified.inputType,
      fmi_signal_strength: classified.signalStrength,
    });
  }

  const opening = detectP0OpeningType(input.userMessage);
  const abstract = detectAbstractSelfExplanation(input.userMessage);

  let kind: "advice_seeking" | "abstract_self_explanation" | null = null;
  if (classified.inputType === "advice_seeking" || opening.type === "advice_seeking") {
    kind = "advice_seeking";
  } else if (abstract) {
    kind = "abstract_self_explanation";
  }

  if (!kind) {
    return emptyResult(enablement, "low_signal", "low_signal_baseline", {
      first_use_window: true,
      prior_genuine: false,
      fmi_input_type: classified.inputType,
      fmi_signal_strength: classified.signalStrength,
      abstract_detected: abstract,
    });
  }

  const appendix = buildLiteracyAppendix(kind, input.wantsChinese);
  return {
    buildMarker: P1_REFLECTION_LITERACY_BUILD_MARKER,
    enablement,
    state: kind,
    reframeApplied: true,
    withholdP0ModeAppendix: true,
    systemAppendix: appendix,
    suppressionReason: null,
    literacyKind: kind,
    debug: {
      state: kind,
      reframe_applied: true,
      withhold_p0_mode_appendix: true,
      literacy_kind: kind,
      first_use_window: true,
      prior_genuine: false,
      fmi_input_type: classified.inputType,
      fmi_signal_strength: classified.signalStrength,
      abstract_detected: kind === "abstract_self_explanation",
      copy_lock_status: "aurora_copy_locked",
    },
  };
}

/** Response-only debug fields. Must not be written to Message/User/Thread metadata. */
export function buildP1ReflectionLiteracyDebugFields(
  result: P1ReflectionLiteracyResult
): Record<string, unknown> {
  return {
    debug_p1_frl_flag_set: result.enablement.flagSet,
    debug_p1_frl_enabled: result.enablement.enabled,
    debug_p1_frl_blocked_on_hosted: result.enablement.blockedOnHosted,
    debug_p1_frl_blocked_on_production: result.enablement.blockedOnProduction,
    debug_p1_frl_blocked_on_preview: result.enablement.blockedOnPreview,
    debug_p1_frl_allow_hosted_preview_set: result.enablement.allowHostedPreviewSet,
    debug_p1_frl_vercel_env: result.enablement.vercelEnv,
    debug_p1_frl_build_marker: result.buildMarker,
    debug_p1_frl_state: result.state,
    debug_p1_frl_reframe_applied: result.reframeApplied,
    debug_p1_frl_withhold_p0_mode_appendix: result.withholdP0ModeAppendix,
    debug_p1_frl_literacy_kind: result.literacyKind,
    debug_p1_frl_suppression_reason: result.suppressionReason,
    debug_p1_frl_system_appendix_applied: result.systemAppendix.length > 0,
    debug_p1_frl_first_use_window: result.debug.first_use_window,
    debug_p1_frl_prior_genuine: result.debug.prior_genuine,
    debug_p1_frl_fmi_input_type: result.debug.fmi_input_type,
    debug_p1_frl_fmi_signal_strength: result.debug.fmi_signal_strength,
    debug_p1_frl_abstract_detected: result.debug.abstract_detected,
    debug_p1_frl_copy_lock_status: result.debug.copy_lock_status,
  };
}

/** Phase 1: no persistence helpers — intentionally absent. */
export const P1_FRL_PHASE1_NO_PERSISTENCE = true as const;
