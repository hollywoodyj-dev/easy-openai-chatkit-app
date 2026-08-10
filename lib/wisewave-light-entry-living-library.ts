/**
 * Light Entry Invitation v1.1 — Living Library Pattern Test.
 * Default-off client UI. Inspire / do not prefill. No analytics. No persistence.
 * Tree build auth 2026-08-10 — Hosted Preview / Production not authorized by that task.
 */

export const LIGHT_ENTRY_LIVING_LIBRARY_BUILD_MARKER =
  "light_entry_living_library_v1_1";

export type LightEntryLivingLibraryCopy = {
  intro: string;
  examples: readonly [string, string, string, string];
};

/** Candidate intro — Aurora retains final semantic review before Production lock. */
export const LIGHT_ENTRY_LL_INTRO_EN = "Or begin with something like…";
export const LIGHT_ENTRY_LL_INTRO_ZH = "也可以像这样开始……";

export const LIGHT_ENTRY_LL_EXAMPLES_EN = [
  "I keep thinking about something that happened.",
  "Something felt off today.",
  "I don't quite know what I'm feeling.",
  "I don't know where to begin.",
] as const;

export const LIGHT_ENTRY_LL_EXAMPLES_ZH = [
  "我一直在想着刚刚发生的一件事。",
  "今天有件事让我觉得哪里不太对。",
  "我还不太知道自己现在是什么感受。",
  "我不知道该从哪里开始。",
] as const;

export const DEFAULT_COMPOSER_PLACEHOLDER = "Speak freely.";

export type LightEntryLivingLibraryEnablement = {
  enabled: boolean;
  flagSet: boolean;
  blockedOnProduction: boolean;
};

function envFlagTruthy(raw: string | undefined): boolean {
  const v = raw?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export function resolveLightEntryLivingLibraryEnablement(): LightEntryLivingLibraryEnablement {
  const flagSet = envFlagTruthy(
    process.env.NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST
  );
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV?.trim() || null;
  const allowProduction = envFlagTruthy(
    process.env.NEXT_PUBLIC_LIGHT_ENTRY_LIVING_LIBRARY_ALLOW_PRODUCTION
  );
  const blockedOnProduction =
    flagSet && vercelEnv === "production" && !allowProduction;

  return {
    enabled: flagSet && !blockedOnProduction,
    flagSet,
    blockedOnProduction,
  };
}

export function isLightEntryLivingLibraryClientEnabled(): boolean {
  return resolveLightEntryLivingLibraryEnablement().enabled;
}

export function resolveLightEntryLivingLibraryCopy(
  wantsChinese: boolean
): LightEntryLivingLibraryCopy {
  return wantsChinese
    ? {
        intro: LIGHT_ENTRY_LL_INTRO_ZH,
        examples: [...LIGHT_ENTRY_LL_EXAMPLES_ZH] as LightEntryLivingLibraryCopy["examples"],
      }
    : {
        intro: LIGHT_ENTRY_LL_INTRO_EN,
        examples: [...LIGHT_ENTRY_LL_EXAMPLES_EN] as LightEntryLivingLibraryCopy["examples"],
      };
}

export function shouldShowLightEntryLivingLibrary(args: {
  enabled?: boolean;
  userMessageCount: number;
  inputHasContent: boolean;
  hasError?: boolean;
  subscriptionRequired?: boolean;
  crisisSurfaceActive?: boolean;
}): boolean {
  const enabled = args.enabled ?? isLightEntryLivingLibraryClientEnabled();
  if (!enabled) return false;
  if (args.userMessageCount > 0) return false;
  if (args.inputHasContent) return false;
  if (args.hasError) return false;
  if (args.subscriptionRequired) return false;
  if (args.crisisSurfaceActive) return false;
  return true;
}

/** When Living Library is visible, suppress other entry experiments. */
export function shouldSuppressOtherEntryExperiments(args: {
  livingLibraryVisible: boolean;
}): boolean {
  return args.livingLibraryVisible;
}

export function livingLibraryExampleCount(
  copy: LightEntryLivingLibraryCopy
): number {
  return copy.examples.length;
}
