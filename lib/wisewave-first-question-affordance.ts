/**
 * S2 First Question affordance — internal only (Tree 2026-10-06).
 * Default-off. Production hard-blocked.
 * Preview needs explicit NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW
 * (Founder/Tree 2026-10-10 Preview authorize).
 * Locked copy: FQ_SUPPORT / FQ_ACTION / FQ_QUESTION.
 * Question is an entry affordance, never an assistant Message row.
 * S1 / P1-FRL are out of this module.
 */

export const S2_FIRST_QUESTION_BUILD_MARKER = "s2_first_question_v1_internal";
export const S2_ENTRY_PROMPT_ID = "first_question_v1" as const;

/** Spec §2.2 — byte-locked. */
export const FQ_SUPPORT_EN =
  "Or, if it is easier, Wisewave can ask one question first.";
export const FQ_SUPPORT_ZH =
  "\u5982\u679c\u4e00\u65f6\u4e0d\u77e5\u9053\u4ece\u54ea\u91cc\u8bf4\u8d77\uFF0C\u4e5f\u53ef\u4ee5\u8ba9 Wisewave \u5148\u95ee\u4e00\u4e2a\u95ee\u9898\u3002";

export const FQ_ACTION_EN = "Ask one question";
export const FQ_ACTION_ZH = "\u5148\u95ee\u6211\u4e00\u4e2a\u95ee\u9898";

export const FQ_QUESTION_EN = "What has been staying with you lately?";
export const FQ_QUESTION_ZH =
  "\u6700\u8fd1\uFF0C\u6709\u4ec0\u4e48\u4e00\u76f4\u7559\u5728\u4f60\u5fc3\u91cc\uFF1F";

/** Operational chrome (not Stage 1 locked product copy). */
export const FQ_CANCEL_EN = "Cancel";
export const FQ_CANCEL_ZH = "\u53d6\u6d88";

export type FirstQuestionCopy = {
  support: string;
  action: string;
  question: string;
  cancel: string;
};

export type S2FirstQuestionEnablement = {
  enabled: boolean;
  flagSet: boolean;
  vercelEnv: string | null;
  blockedOnProduction: boolean;
  blockedOnPreview: boolean;
  blockedOnHosted: boolean;
  allowHostedPreviewSet: boolean;
};

function envFlagTruthy(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export function resolveS2FirstQuestionEnablement(): S2FirstQuestionEnablement {
  const flagSet = envFlagTruthy(
    process.env.NEXT_PUBLIC_ENABLE_P1_FIRST_QUESTION_INVITATION
  );
  const allowHostedPreviewSet = envFlagTruthy(
    process.env.NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW
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

export function isS2FirstQuestionClientEnabled(): boolean {
  return resolveS2FirstQuestionEnablement().enabled;
}

export function resolveFirstQuestionCopy(wantsChinese: boolean): FirstQuestionCopy {
  return wantsChinese
    ? {
        support: FQ_SUPPORT_ZH,
        action: FQ_ACTION_ZH,
        question: FQ_QUESTION_ZH,
        cancel: FQ_CANCEL_ZH,
      }
    : {
        support: FQ_SUPPORT_EN,
        action: FQ_ACTION_EN,
        question: FQ_QUESTION_EN,
        cancel: FQ_CANCEL_EN,
      };
}

/** Unactivated offer. Typing without activation hides this. */
export function shouldShowFirstQuestionOffer(args: {
  enabled: boolean;
  userMessageCount: number;
  inputHasContent: boolean;
  activated: boolean;
}): boolean {
  if (!args.enabled) return false;
  if (args.userMessageCount > 0) return false;
  if (args.activated) return false;
  if (args.inputHasContent) return false;
  return true;
}

/** Activated question. Stays visible while composing. Not an assistant turn. */
export function shouldShowFirstQuestion(args: {
  enabled: boolean;
  userMessageCount: number;
  activated: boolean;
}): boolean {
  if (!args.enabled) return false;
  if (args.userMessageCount > 0) return false;
  return args.activated;
}

export function sanitizeS2EntryPromptId(
  raw: unknown,
  args: { enabled: boolean; priorUserMessageCount: number }
): typeof S2_ENTRY_PROMPT_ID | null {
  if (!args.enabled) return null;
  if (args.priorUserMessageCount > 0) return null;
  if (raw !== S2_ENTRY_PROMPT_ID) return null;
  return S2_ENTRY_PROMPT_ID;
}

/** First-response rule (spec §5.2) — only when the user answered this affordance. */
export const S2_FIRST_RESPONSE_APPENDIX = `

Entry prompt (this conversation only): the user answered an entry question that is not in the transcript and is not an assistant turn. Do not treat the prompt wording as their discovery. Do not automatically ask another question because they answered a prompt. Recognition must reflect what they supplied.`;
