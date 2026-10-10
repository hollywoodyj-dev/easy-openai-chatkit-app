/**
 * S5 Evidence-source validator narrowing — internal only (Tree 2026-10-06).
 * Default-off. Flag ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2.
 * Production hard-blocked. Preview needs explicit
 * EVIDENCE_SOURCE_VALIDATOR_ALLOW_HOSTED_PREVIEW (Founder/Tree 2026-10-10).
 * Production delta = 0 when off.
 * Scope: source-evidence + unsupported temporal continuity. Not tense.
 * Does not edit live DRIFT_RULES. S3 / S4 / S1 / S2 / S6 out of this module.
 */

import type { DriftViolation } from "@/lib/drift/types";

export const S5_EVIDENCE_SOURCE_BUILD_MARKER =
  "s5_evidence_source_validator_v2_internal";

/** Addendum §6 Example B — currently suppressed by live `you have been`. */
export const S5_EXAMPLE_B_EN =
  "You have been trying hard, yet you are still being met with 'not enough.' That can be painful to keep carrying.";

export const S5_EXAMPLE_B_USER_EN = "I have tried so hard";

export type EvidenceSourceFamily =
  | "evidence_close"
  | "unsupported_temporal_span"
  | "ungrounded_memory_claim"
  | "unsupported_present_perfect"
  | null;

export type EvidenceSourceVerdict = "allow" | "block";

export type EvidenceSourceEnablement = {
  enabled: boolean;
  flagSet: boolean;
  vercelEnv: string | null;
  blockedOnProduction: boolean;
  blockedOnPreview: boolean;
  blockedOnHosted: boolean;
  allowHostedPreviewSet: boolean;
};

export type EvidenceSourceResult = {
  verdict: EvidenceSourceVerdict;
  family: EvidenceSourceFamily;
  matched: string | null;
  reason: string;
  sourceContextSupported: boolean;
  hasMemoryClaim: boolean;
  hasTemporalSpan: boolean;
  hasPresentPerfect: boolean;
};

function envFlagTruthy(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export function resolveS5EvidenceSourceValidatorEnablement(): EvidenceSourceEnablement {
  const flagSet = envFlagTruthy(process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2);
  const allowHostedPreviewSet = envFlagTruthy(
    process.env.EVIDENCE_SOURCE_VALIDATOR_ALLOW_HOSTED_PREVIEW
  );
  const vercelEnv =
    process.env.NEXT_PUBLIC_VERCEL_ENV?.trim() ||
    process.env.VERCEL_ENV?.trim() ||
    null;
  const blockedOnProduction = vercelEnv === "production";
  const blockedOnPreview = vercelEnv === "preview" && !allowHostedPreviewSet;
  const blockedOnHosted = blockedOnProduction || blockedOnPreview;

  return {
    enabled: flagSet && !blockedOnHosted,
    flagSet,
    vercelEnv,
    blockedOnProduction,
    blockedOnPreview,
    blockedOnHosted,
    allowHostedPreviewSet,
  };
}

export function isS5EvidenceSourceValidatorEnabled(): boolean {
  return resolveS5EvidenceSourceValidatorEnablement().enabled;
}

const MEMORY_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /\bas you mentioned before\b/i, label: "as you mentioned before" },
  { re: /\blast time\b/i, label: "last time" },
  { re: /\bi remember\b/i, label: "I remember" },
  { re: /\bas we (?:discussed|talked about) before\b/i, label: "as we discussed before" },
  { re: /\byou told me before\b/i, label: "you told me before" },
  { re: /你之前(?:提过|说过|提到)/, label: "你之前说过" },
  { re: /上次/, label: "上次" },
  { re: /我记得/, label: "我记得" },
  { re: /你说过/, label: "你说过" },
];

const TEMPORAL_SPAN_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /\bfor years\b/i, label: "for years" },
  { re: /\ball this time\b/i, label: "all this time" },
  { re: /\bfor a long time\b/i, label: "for a long time" },
  { re: /\bfor so long\b/i, label: "for so long" },
  { re: /\bover the years\b/i, label: "over the years" },
  { re: /\bsince (?:then|childhood|years? ago|the beginning)\b/i, label: "since" },
  { re: /一直以来/, label: "一直以来" },
  { re: /这些年/, label: "这些年" },
  { re: /很久以来/, label: "很久以来" },
  { re: /很长一段时间/, label: "很长一段时间" },
  { re: /多年来/, label: "多年来" },
];

const PRESENT_PERFECT_PATTERNS: Array<{ re: RegExp; label: string }> = [
  { re: /\byou(?:'ve| have) been\b/i, label: "you have been" },
  { re: /你一直(?:在)?/, label: "你一直" },
  { re: /你已经(?:在)?/, label: "你已经" },
];

const USER_EVIDENCE_PATTERNS: RegExp[] = [
  /\bi(?:'ve| have)? (?:tried|been trying)\b/i,
  /\btried so hard\b/i,
  /\btrying so hard\b/i,
  /\bi(?:'ve| have) been\b/i,
  /我(?:已经)?很努力/,
  /我试了/,
  /我一直在?努力/,
  /我已经很努力/,
];

function firstMatch(
  text: string,
  patterns: Array<{ re: RegExp; label: string }>
): { matched: string; label: string } | null {
  for (const { re, label } of patterns) {
    const m = text.match(re);
    if (m) return { matched: m[0], label };
  }
  return null;
}

function inferSourceSupport(userMessage: string): boolean {
  const t = userMessage.trim();
  if (!t) return false;
  if (USER_EVIDENCE_PATTERNS.some((re) => re.test(t))) return true;
  if (firstMatch(t, TEMPORAL_SPAN_PATTERNS)) return true;
  return false;
}

export function evaluateEvidenceSourceValidator(args: {
  userMessage: string;
  assistantCandidate: string;
  sourceContextSupported?: boolean;
}): EvidenceSourceResult {
  const assistant = args.assistantCandidate.trim();
  const memory = firstMatch(assistant, MEMORY_PATTERNS);
  const span = firstMatch(assistant, TEMPORAL_SPAN_PATTERNS);
  const presentPerfect = firstMatch(assistant, PRESENT_PERFECT_PATTERNS);
  const inferred = inferSourceSupport(args.userMessage);
  const sourceContextSupported = args.sourceContextSupported ?? inferred;

  if (memory) {
    return {
      verdict: "block",
      family: "ungrounded_memory_claim",
      matched: memory.matched,
      reason: "Ungrounded memory / prior-conversation claim.",
      sourceContextSupported,
      hasMemoryClaim: true,
      hasTemporalSpan: Boolean(span),
      hasPresentPerfect: Boolean(presentPerfect),
    };
  }

  if (span && !sourceContextSupported) {
    return {
      verdict: "block",
      family: "unsupported_temporal_span",
      matched: span.matched,
      reason: "Unsupported temporal-span continuity.",
      sourceContextSupported,
      hasMemoryClaim: false,
      hasTemporalSpan: true,
      hasPresentPerfect: Boolean(presentPerfect),
    };
  }

  if (presentPerfect && !sourceContextSupported) {
    return {
      verdict: "block",
      family: "unsupported_present_perfect",
      matched: presentPerfect.matched,
      reason: "Present-perfect continuity without current-turn evidence.",
      sourceContextSupported,
      hasMemoryClaim: false,
      hasTemporalSpan: Boolean(span),
      hasPresentPerfect: true,
    };
  }

  if (presentPerfect && sourceContextSupported) {
    return {
      verdict: "allow",
      family: "evidence_close",
      matched: presentPerfect.matched,
      reason: "Present-perfect restatement is evidence-close to the current turn.",
      sourceContextSupported,
      hasMemoryClaim: false,
      hasTemporalSpan: Boolean(span),
      hasPresentPerfect: true,
    };
  }

  return {
    verdict: "allow",
    family: null,
    matched: null,
    reason: "No S5-relevant continuity claim.",
    sourceContextSupported,
    hasMemoryClaim: false,
    hasTemporalSpan: Boolean(span),
    hasPresentPerfect: false,
  };
}

export function isPresentPerfectContinuityMatch(matched: string): boolean {
  return PRESENT_PERFECT_PATTERNS.some((p) => p.re.test(matched));
}

export function applyEvidenceSourceNarrowing(args: {
  enabled: boolean;
  violations: DriftViolation[];
  result: EvidenceSourceResult;
}): { violations: DriftViolation[]; narrowedPresentPerfect: boolean } {
  if (!args.enabled) {
    return { violations: args.violations, narrowedPresentPerfect: false };
  }

  let violations = args.violations;
  let narrowedPresentPerfect = false;

  if (args.result.verdict === "allow" && args.result.family === "evidence_close") {
    const next = violations.filter(
      (v) =>
        !(
          v.type === "continuity_drift" &&
          isPresentPerfectContinuityMatch(v.matched)
        )
    );
    narrowedPresentPerfect = next.length !== violations.length;
    violations = next;
  }

  if (args.result.verdict === "block" && args.result.matched) {
    const already = violations.some(
      (v) =>
        v.type === "continuity_drift" &&
        v.severity === "high" &&
        v.matched.toLowerCase().includes(args.result.matched!.toLowerCase())
    );
    if (!already) {
      violations = [
        ...violations,
        {
          type: "continuity_drift",
          severity: "high",
          matched: args.result.matched,
          reason: args.result.reason,
        },
      ];
    }
  }

  return { violations, narrowedPresentPerfect };
}
