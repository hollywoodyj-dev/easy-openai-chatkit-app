/**
 * S1 Entry copy v2 — internal only (Tree 2026-10-06).
 * Default-off. Client-only. Production hard-blocked.
 * Preview needs explicit NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_HOSTED_PREVIEW
 * (Founder/Tree 2026-10-10 Preview authorize).
 * Aurora locked ENTRY_V2. No examples list. S2 is out of this module.
 * When S1 is on: IL, Living Library, and the P0 permission line are off.
 */

export const S1_ENTRY_COPY_V2_BUILD_MARKER = "s1_entry_copy_v2_internal";

/** Spec §2.1 / C1 — curly quotes U+201C U+201D, apostrophe U+2019. */
export const ENTRY_V2_HEADLINE_EN = "You do not need a clear question.";
export const ENTRY_V2_BODY_EN =
  "You can begin with what is on your mind, what you are feeling, something that happened, or simply, \u201CI don\u2019t know.\u201D";

export const ENTRY_V2_HEADLINE_ZH =
  "\u4f60\u4e0d\u9700\u8981\u5148\u60f3\u6e05\u695a\u8981\u95ee\u4ec0\u4e48\u3002";
export const ENTRY_V2_BODY_ZH =
  "\u53ef\u4ee5\u4ece\u6b64\u523b\u653e\u5728\u5fc3\u4e0a\u7684\u4e8b\u3001\u6b63\u5728\u611f\u53d7\u5230\u7684\u3001\u53d1\u751f\u8fc7\u7684\u4e00\u4ef6\u4e8b\uFF0C\u6216\u53ea\u662f\u4e00\u53e5\u201C\u6211\u4e0d\u77e5\u9053\u201D\u5f00\u59cb\u3002";

export type EntryCopyV2 = {
  headline: string;
  body: string;
};

export type S1EntryCopyV2Enablement = {
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

export function resolveS1EntryCopyV2Enablement(): S1EntryCopyV2Enablement {
  const flagSet = envFlagTruthy(process.env.NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2);
  const allowHostedPreviewSet = envFlagTruthy(
    process.env.NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_HOSTED_PREVIEW
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

export function isS1EntryCopyV2ClientEnabled(): boolean {
  return resolveS1EntryCopyV2Enablement().enabled;
}

export function resolveEntryCopyV2(wantsChinese: boolean): EntryCopyV2 {
  return wantsChinese
    ? { headline: ENTRY_V2_HEADLINE_ZH, body: ENTRY_V2_BODY_ZH }
    : { headline: ENTRY_V2_HEADLINE_EN, body: ENTRY_V2_BODY_EN };
}

export function shouldShowEntryCopyV2(args: {
  enabled: boolean;
  userMessageCount: number;
  inputHasContent: boolean;
  firstQuestionActivated?: boolean;
}): boolean {
  if (!args.enabled) return false;
  if (args.userMessageCount > 0) return false;
  if (args.firstQuestionActivated) return false;
  if (args.inputHasContent) return false;
  return true;
}

/**
 * Spec §1.2 / Tree 2026-10-06: S1 on suppresses IL, Living Library, and the P0 permission line.
 * Not S2. Not the P0 idle exit invite. Uses enablement, not current visibility, so typing
 * does not flash the permission line back.
 */
export function shouldSuppressSiblingEntrySurfaces(args: {
  s1Enabled: boolean;
}): boolean {
  return args.s1Enabled;
}
