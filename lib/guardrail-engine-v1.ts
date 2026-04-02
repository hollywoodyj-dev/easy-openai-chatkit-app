/**
 * Guardrail Engine v1
 * Nova-ready TypeScript baseline for HC-OS runtime decisioning.
 *
 * Purpose:
 * - keep main_reflection mandatory when signal is sufficient
 * - treat all optional layers as suppression-first
 * - enforce presence / guidance / memory / authorship constraints
 * - keep output renderable as a simple display-layer response
 */

export type DisplayLang = "en" | "zh";
export type TurnType = "reflective" | "mixed" | "factual" | "utilitarian" | "logistical";
export type LayerKey =
  | "main_reflection"
  | "last_insight"
  | "pattern_surfacing"
  | "micro_awareness"
  | "soft_continuity"
  | "micro_shift";

export type RiskLevel = "low" | "medium" | "high";
export type ThreadStrength = "none" | "weak" | "moderate" | "strong";

export interface LayerCandidate {
  key: LayerKey;
  text?: string;
  eligible: boolean;
  confidence?: number;
  evidence_strength?: number;
  readability_ok?: boolean;
  weak_input_safe?: boolean;
  visibility_risk?: RiskLevel;
  guidance_risk?: RiskLevel;
  memory_risk?: RiskLevel;
  authorship_risk?: RiskLevel;
  density_cost?: number;
  duplicates?: LayerKey[];
  requires_explicit_recall?: boolean;
  current_turn_support?: boolean;
  thread_strength?: ThreadStrength;
  notes?: string[];
}

export interface GuardrailContext {
  turn_type: TurnType;
  lang: DisplayLang;
  input_signal_strength: number;
  user_overloaded?: boolean;
  current_turn_supports_continuity?: boolean;
  main_reflection_already_sufficient?: boolean;
  enable_h?: boolean;
  enable_i?: boolean;
  enable_j?: boolean;
  max_optional_layers?: number;
  debug?: boolean;
}

export interface GuardrailDecision {
  allow: boolean;
  reasons: string[];
  severity: RiskLevel;
}

export interface GuardrailEngineResult {
  response: {
    main_reflection: string;
    last_insight?: string;
    pattern_surfacing?: string;
    micro_awareness?: string;
    soft_continuity?: string;
    micro_shift?: string;
  };
  debug?: {
    kept_layers: LayerKey[];
    suppressed_layers: Array<{ key: LayerKey; reasons: string[] }>;
    ordering: LayerKey[];
    reasoning_tags: string[];
  };
}

const OPTIONAL_PRIORITY: LayerKey[] = [
  "soft_continuity",
  "micro_awareness",
  "pattern_surfacing",
  "last_insight",
  "micro_shift",
];

const HIGH_RISK_FAIL = new Set<RiskLevel>(["high"]);
const MEDIUM_PLUS_FAIL = new Set<RiskLevel>(["medium", "high"]);

function safeText(text?: string): string | undefined {
  const value = text?.trim();
  return value ? value : undefined;
}

function hasHighRisk(candidate: LayerCandidate): boolean {
  return (
    HIGH_RISK_FAIL.has(candidate.visibility_risk ?? "low") ||
    HIGH_RISK_FAIL.has(candidate.guidance_risk ?? "low") ||
    HIGH_RISK_FAIL.has(candidate.memory_risk ?? "low") ||
    HIGH_RISK_FAIL.has(candidate.authorship_risk ?? "low")
  );
}

function hasMediumPlusVisibility(candidate: LayerCandidate): boolean {
  return MEDIUM_PLUS_FAIL.has(candidate.visibility_risk ?? "low");
}

function pushReason(reasons: string[], reason: string, when = true) {
  if (when) reasons.push(reason);
}

function decideMainReflection(candidate: LayerCandidate): GuardrailDecision {
  const reasons: string[] = [];
  pushReason(reasons, "main_reflection_missing_text", !safeText(candidate.text));
  pushReason(reasons, "main_reflection_not_eligible", !candidate.eligible);
  pushReason(reasons, "main_reflection_readability_fail", candidate.readability_ok === false);
  pushReason(reasons, "main_reflection_weak_input_unsafe", candidate.weak_input_safe === false);
  pushReason(reasons, "main_reflection_guidance_high", candidate.guidance_risk === "high");
  pushReason(reasons, "main_reflection_authorship_high", candidate.authorship_risk === "high");
  return { allow: reasons.length === 0, reasons, severity: reasons.length === 0 ? "low" : "high" };
}

function decideLastInsight(candidate: LayerCandidate, ctx: GuardrailContext): GuardrailDecision {
  const reasons: string[] = [];
  pushReason(reasons, "last_insight_missing_text", !safeText(candidate.text));
  pushReason(reasons, "last_insight_not_eligible", !candidate.eligible);
  pushReason(reasons, "last_insight_readability_fail", candidate.readability_ok === false);
  pushReason(reasons, "last_insight_no_current_support", candidate.current_turn_support === false);
  pushReason(reasons, "last_insight_main_reflection_sufficient", ctx.main_reflection_already_sufficient === true);
  pushReason(reasons, "last_insight_visibility_too_high", hasMediumPlusVisibility(candidate));
  pushReason(reasons, "last_insight_guidance_high", candidate.guidance_risk === "high");
  pushReason(reasons, "last_insight_memory_high", candidate.memory_risk === "high");
  pushReason(reasons, "last_insight_duplicates_other_layer", (candidate.duplicates?.length ?? 0) > 0);
  return {
    allow: reasons.length === 0,
    reasons,
    severity: reasons.length === 0 ? "low" : candidate.memory_risk === "high" ? "high" : "medium",
  };
}

function decidePatternSurfacing(candidate: LayerCandidate, ctx: GuardrailContext): GuardrailDecision {
  const reasons: string[] = [];
  pushReason(reasons, "pattern_missing_text", !safeText(candidate.text));
  pushReason(reasons, "pattern_not_eligible", !candidate.eligible);
  pushReason(reasons, "pattern_readability_fail", candidate.readability_ok === false);
  pushReason(reasons, "pattern_weak_input_unsafe", candidate.weak_input_safe === false);
  pushReason(reasons, "pattern_visibility_high", candidate.visibility_risk === "high");
  pushReason(reasons, "pattern_guidance_high", candidate.guidance_risk === "high");
  pushReason(reasons, "pattern_authorship_high", candidate.authorship_risk === "high");
  pushReason(reasons, "pattern_main_reflection_sufficient", ctx.main_reflection_already_sufficient === true);
  pushReason(reasons, "pattern_density_too_high", (candidate.density_cost ?? 0) > 0.55);
  return {
    allow: reasons.length === 0,
    reasons,
    severity: reasons.length === 0 ? "low" : hasHighRisk(candidate) ? "high" : "medium",
  };
}

function decideMicroAwareness(candidate: LayerCandidate, ctx: GuardrailContext): GuardrailDecision {
  const reasons: string[] = [];
  pushReason(reasons, "h_disabled", ctx.enable_h === false);
  pushReason(reasons, "h_missing_text", !safeText(candidate.text));
  pushReason(reasons, "h_not_eligible", !candidate.eligible);
  pushReason(reasons, "h_non_reflective_turn", ["factual", "utilitarian", "logistical"].includes(ctx.turn_type));
  pushReason(reasons, "h_readability_fail", candidate.readability_ok === false);
  pushReason(reasons, "h_weak_input_unsafe", candidate.weak_input_safe === false);
  pushReason(reasons, "h_visibility_medium_plus", MEDIUM_PLUS_FAIL.has(candidate.visibility_risk ?? "low"));
  pushReason(reasons, "h_guidance_medium_plus", MEDIUM_PLUS_FAIL.has(candidate.guidance_risk ?? "low"));
  pushReason(reasons, "h_authorship_high", candidate.authorship_risk === "high");
  pushReason(reasons, "h_main_reflection_sufficient", ctx.main_reflection_already_sufficient === true);
  pushReason(reasons, "h_density_too_high", (candidate.density_cost ?? 0) > 0.45);
  pushReason(reasons, "h_duplicates_pattern", candidate.duplicates?.includes("pattern_surfacing") === true);
  return {
    allow: reasons.length === 0,
    reasons,
    severity: reasons.length === 0 ? "low" : hasHighRisk(candidate) ? "high" : "medium",
  };
}

function decideSoftContinuity(candidate: LayerCandidate, ctx: GuardrailContext): GuardrailDecision {
  const reasons: string[] = [];
  pushReason(reasons, "i_disabled", ctx.enable_i === false);
  pushReason(reasons, "i_missing_text", !safeText(candidate.text));
  pushReason(reasons, "i_not_eligible", !candidate.eligible);
  pushReason(reasons, "i_non_reflective_turn", ["factual", "utilitarian", "logistical"].includes(ctx.turn_type));
  pushReason(
    reasons,
    "i_no_current_turn_support",
    candidate.current_turn_support === false || ctx.current_turn_supports_continuity === false
  );
  pushReason(reasons, "i_requires_explicit_recall", candidate.requires_explicit_recall === true);
  pushReason(reasons, "i_thread_too_weak", candidate.thread_strength === "none" || candidate.thread_strength === "weak");
  pushReason(reasons, "i_readability_fail", candidate.readability_ok === false);
  pushReason(reasons, "i_visibility_medium_plus", MEDIUM_PLUS_FAIL.has(candidate.visibility_risk ?? "low"));
  pushReason(reasons, "i_memory_medium_plus", MEDIUM_PLUS_FAIL.has(candidate.memory_risk ?? "low"));
  pushReason(reasons, "i_guidance_high", candidate.guidance_risk === "high");
  pushReason(reasons, "i_main_reflection_sufficient", ctx.main_reflection_already_sufficient === true);
  pushReason(
    reasons,
    "i_duplicates_h_or_e",
    (candidate.duplicates?.includes("micro_awareness") ?? false) ||
      (candidate.duplicates?.includes("pattern_surfacing") ?? false)
  );
  return {
    allow: reasons.length === 0,
    reasons,
    severity:
      reasons.length === 0
        ? "low"
        : candidate.memory_risk === "high" || candidate.visibility_risk === "high"
          ? "high"
          : "medium",
  };
}

function decideMicroShift(candidate: LayerCandidate, ctx: GuardrailContext): GuardrailDecision {
  const reasons: string[] = [];
  pushReason(reasons, "j_disabled", ctx.enable_j === false);
  pushReason(reasons, "j_missing_text", !safeText(candidate.text));
  pushReason(reasons, "j_not_eligible", !candidate.eligible);
  pushReason(reasons, "j_non_reflective_turn", ["factual", "utilitarian", "logistical"].includes(ctx.turn_type));
  pushReason(reasons, "j_readability_fail", candidate.readability_ok === false);
  pushReason(reasons, "j_guidance_medium_plus", MEDIUM_PLUS_FAIL.has(candidate.guidance_risk ?? "low"));
  pushReason(reasons, "j_visibility_medium_plus", MEDIUM_PLUS_FAIL.has(candidate.visibility_risk ?? "low"));
  pushReason(reasons, "j_authorship_medium_plus", MEDIUM_PLUS_FAIL.has(candidate.authorship_risk ?? "low"));
  pushReason(reasons, "j_density_too_high", (candidate.density_cost ?? 0) > 0.4);
  pushReason(reasons, "j_main_reflection_sufficient", ctx.main_reflection_already_sufficient === true);
  return {
    allow: reasons.length === 0,
    reasons,
    severity: reasons.length === 0 ? "low" : hasHighRisk(candidate) ? "high" : "medium",
  };
}

function routeDecision(candidate: LayerCandidate, ctx: GuardrailContext): GuardrailDecision {
  switch (candidate.key) {
    case "main_reflection":
      return decideMainReflection(candidate);
    case "last_insight":
      return decideLastInsight(candidate, ctx);
    case "pattern_surfacing":
      return decidePatternSurfacing(candidate, ctx);
    case "micro_awareness":
      return decideMicroAwareness(candidate, ctx);
    case "soft_continuity":
      return decideSoftContinuity(candidate, ctx);
    case "micro_shift":
      return decideMicroShift(candidate, ctx);
  }
}

function pickOptionalWinners(candidates: LayerCandidate[], maxCount: number): LayerCandidate[] {
  if (candidates.length === 0) return [];
  const ordered = [...candidates].sort((a, b) => {
    const pA = OPTIONAL_PRIORITY.indexOf(a.key);
    const pB = OPTIONAL_PRIORITY.indexOf(b.key);
    if (pA !== pB) return pA - pB;
    const confidenceA = a.confidence ?? 0;
    const confidenceB = b.confidence ?? 0;
    if (confidenceA !== confidenceB) return confidenceB - confidenceA;
    const densityA = a.density_cost ?? 0;
    const densityB = b.density_cost ?? 0;
    return densityA - densityB;
  });
  return ordered.slice(0, maxCount);
}

export function runtimeGuardrail(rawCandidates: LayerCandidate[], ctx: GuardrailContext): GuardrailEngineResult {
  const byKey = new Map<LayerKey, LayerCandidate>(
    rawCandidates.map((c) => [c.key, { ...c, text: safeText(c.text) }])
  );
  const mainCandidate = byKey.get("main_reflection");
  if (!mainCandidate) {
    throw new Error("Guardrail Engine v1 requires a main_reflection candidate.");
  }
  const mainDecision = routeDecision(mainCandidate, ctx);
  if (!mainDecision.allow || !safeText(mainCandidate.text)) {
    throw new Error(`main_reflection failed guardrail: ${mainDecision.reasons.join(", ")}`);
  }

  const suppressed: Array<{ key: LayerKey; reasons: string[] }> = [];
  const eligibleOptional: LayerCandidate[] = [];

  for (const candidate of rawCandidates) {
    if (candidate.key === "main_reflection") continue;
    const decision = routeDecision(candidate, ctx);
    if (!decision.allow) {
      suppressed.push({ key: candidate.key, reasons: decision.reasons });
      continue;
    }
    eligibleOptional.push({ ...candidate, text: safeText(candidate.text) });
  }

  const maxOptionalLayers = Math.max(0, ctx.max_optional_layers ?? 1);
  const keptOptional = pickOptionalWinners(eligibleOptional, maxOptionalLayers);
  const keptSet = new Set(keptOptional.map((i) => i.key));
  for (const candidate of eligibleOptional) {
    if (!keptSet.has(candidate.key)) {
      suppressed.push({ key: candidate.key, reasons: ["optional_layer_priority_loss"] });
    }
  }

  const response: GuardrailEngineResult["response"] = {
    main_reflection: mainCandidate.text!,
  };
  for (const candidate of keptOptional) {
    if (!candidate.text) continue;
    switch (candidate.key) {
      case "last_insight":
        response.last_insight = candidate.text;
        break;
      case "pattern_surfacing":
        response.pattern_surfacing = candidate.text;
        break;
      case "micro_awareness":
        response.micro_awareness = candidate.text;
        break;
      case "soft_continuity":
        response.soft_continuity = candidate.text;
        break;
      case "micro_shift":
        response.micro_shift = candidate.text;
        break;
      default:
        break;
    }
  }

  const reasoningTags: string[] = ["suppression_first_engine"];
  if (keptOptional.length === 0) reasoningTags.push("main_reflection_only");
  if (response.soft_continuity) reasoningTags.push("i_kept");
  if (response.micro_awareness) reasoningTags.push("h_kept");
  if (response.pattern_surfacing) reasoningTags.push("e_kept");
  if (response.last_insight) reasoningTags.push("d_continuity_kept");
  if (response.micro_shift) reasoningTags.push("j_kept");

  return {
    response,
    debug: ctx.debug
      ? {
          kept_layers: ["main_reflection", ...keptOptional.map((item) => item.key)],
          suppressed_layers: suppressed,
          ordering: ["main_reflection", ...OPTIONAL_PRIORITY.filter((key) => keptSet.has(key))],
          reasoning_tags: reasoningTags,
        }
      : undefined,
  };
}
