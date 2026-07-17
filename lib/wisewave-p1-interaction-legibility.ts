/**
 * P1 Interaction Legibility — plain-text preview slice (default-off; Preview/internal QA).
 * Static empty-state copy only. No P1.1 invitation, no backend / turn behaviour.
 */

export const P1_INTERACTION_LEGIBILITY_BUILD_MARKER =
  "p1_interaction_legibility_v1_preview_slice";

export type P1InteractionLegibilityCopy = {
  opening: string;
  examplesLead: string;
  examples: readonly string[];
};

export const P1_INTERACTION_LEGIBILITY_OPENING_EN = "You can begin anywhere.";
export const P1_INTERACTION_LEGIBILITY_OPENING_ZH = "你可以从任何地方开始。";

export const P1_INTERACTION_LEGIBILITY_LEAD_EN = "Many people begin with:";
export const P1_INTERACTION_LEGIBILITY_LEAD_ZH = "很多人会从这里开始：";

export const P1_INTERACTION_LEGIBILITY_EXAMPLES_EN = [
  "Something on their mind",
  "Something they are feeling",
  "Something that happened",
  'Simply saying, "I don\u2019t know."',
] as const;

export const P1_INTERACTION_LEGIBILITY_EXAMPLES_ZH = [
  "心里的事",
  "此刻的感受",
  "发生过的事",
  "或者简单说「我不知道」",
] as const;

/** Explicitly excluded from this slice — governed under P1.1 only. */
export const P1_1_FIRST_QUESTION_INVITATION_EN =
  "Or, if it is easier, Wisewave can ask one question first.";

export type P1InteractionLegibilityEnablement = {
  enabled: boolean;
  flagSet: boolean;
  blockedOnProduction: boolean;
};

export function resolveP1InteractionLegibilityEnablement(): P1InteractionLegibilityEnablement {
  const raw = process.env.NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY?.trim().toLowerCase();
  const flagSet = raw === "true" || raw === "1" || raw === "yes";
  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV?.trim() || null;
  const blockedOnProduction =
    flagSet &&
    vercelEnv === "production" &&
    process.env.NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION?.trim() !== "1";

  return {
    enabled: flagSet && !blockedOnProduction,
    flagSet,
    blockedOnProduction,
  };
}

export function isP1InteractionLegibilityClientEnabled(): boolean {
  return resolveP1InteractionLegibilityEnablement().enabled;
}

export function resolveP1InteractionLegibilityCopy(
  wantsChinese: boolean
): P1InteractionLegibilityCopy {
  return wantsChinese
    ? {
        opening: P1_INTERACTION_LEGIBILITY_OPENING_ZH,
        examplesLead: P1_INTERACTION_LEGIBILITY_LEAD_ZH,
        examples: P1_INTERACTION_LEGIBILITY_EXAMPLES_ZH,
      }
    : {
        opening: P1_INTERACTION_LEGIBILITY_OPENING_EN,
        examplesLead: P1_INTERACTION_LEGIBILITY_LEAD_EN,
        examples: P1_INTERACTION_LEGIBILITY_EXAMPLES_EN,
      };
}

export function shouldShowP1InteractionLegibility(args: {
  enabled?: boolean;
  userMessageCount: number;
  inputHasContent: boolean;
}): boolean {
  const enabled = args.enabled ?? isP1InteractionLegibilityClientEnabled();
  if (!enabled) return false;
  if (args.userMessageCount > 0) return false;
  if (args.inputHasContent) return false;
  return true;
}

export function shouldSuppressP0PermissionForLegibility(args: {
  legibilityVisible: boolean;
}): boolean {
  return args.legibilityVisible;
}
