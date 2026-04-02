/**
 * Milestone J — micro-shift template pack (v1) + picker.
 * Pairs with:
 * - docs/HC_OS_V1_Milestone_J_Wisewave_Language_Handoff.md
 * - docs/HC_OS_V1_Milestone_J_Addendum_Micro_Shift_Embodied_Effect_Layer.md
 * - docs/HC_OS_V1_Milestone_J_Nova_Template_Pack_v1.md
 * - lib/wisewave-milestone-j-microshift-boundary.ts (evaluateMilestoneJBoundary)
 *
 * Wired into /api/chat/turn when ENABLE_J_MICROSHIFT is true/1/yes (global kill switch).
 */

import rawPack from "./wisewave-milestone-j-microshift-template-pack-v1.json";

const BUILD_MARKER = "milestone_j_microshift_v1";

/** Global kill switch: J only when explicitly enabled (addendum). */
export function isMilestoneJMicroshiftEnabled(): boolean {
  const v = process.env.ENABLE_J_MICROSHIFT?.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

export function milestoneJBuildMarker(): string {
  return BUILD_MARKER;
}

export type JRenderMode = "ultra_light" | "soft";
export type JDisplayLang = "en" | "zh";

export const J_MICROSHIFT_TEMPLATE_PACK_MARKER = "j_microshift_template_pack_v1";

export const J_MICROSHIFT_DEFAULT_FAMILY_ORDER = [
  "tightness_softening",
  "pressure_release",
  "non_compulsory_permission",
  "micro_stabilization",
  "room_opening",
] as const;

export type JTemplateFamilyKey = (typeof J_MICROSHIFT_DEFAULT_FAMILY_ORDER)[number];

export interface JTemplateSelectionInput {
  renderMode: JRenderMode;
  displayLang: JDisplayLang;
  preferredFamilies?: string[];
  blockedFamilies?: string[];
  presenceRisk?: boolean;
  guidanceRisk?: boolean;
  /** 0-based index into the chosen family's line list; defaults to 0 */
  variantIndex?: number;
}

type LangLines = { en: string[]; zh: string[] };

type JFamilyNode = {
  intent?: string;
  use_when?: string[];
  avoid_when?: string[];
  ultra_light: LangLines;
  soft: LangLines;
};

export interface JMicroshiftTemplatePackV1 {
  milestone: string;
  feature: string;
  version: string;
  template_families: Record<string, JFamilyNode>;
  ultra_short_fallbacks: LangLines;
  blocked_patterns?: { en: string[]; zh: string[] };
}

export const J_MICROSHIFT_TEMPLATE_PACK_V1 = rawPack as unknown as JMicroshiftTemplatePackV1;

/** True if assistant body matches pack substring hints (coaching / directive drift guard). */
export function assistantContainsJBlockedPattern(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  const bp = J_MICROSHIFT_TEMPLATE_PACK_V1.blocked_patterns;
  if (!bp) return false;
  for (const p of bp.en) {
    if (p && lower.includes(p.toLowerCase())) return true;
  }
  for (const p of bp.zh) {
    if (p && t.includes(p)) return true;
  }
  return false;
}

/**
 * Choose the lightest wording that can still read as J (per pack).
 * Walks families in order; uses first non-empty list for renderMode × displayLang.
 * Falls back to ultra_short_fallbacks, then null.
 */
export function pickJMicroshiftTemplate(
  input: JTemplateSelectionInput,
  pack: JMicroshiftTemplatePackV1 = J_MICROSHIFT_TEMPLATE_PACK_V1
): string | null {
  const orderedFamilies =
    input.preferredFamilies && input.preferredFamilies.length > 0
      ? input.preferredFamilies
      : [...J_MICROSHIFT_DEFAULT_FAMILY_ORDER];

  const blocked = new Set(input.blockedFamilies ?? []);
  const v = Math.max(0, input.variantIndex ?? 0);

  for (const family of orderedFamilies) {
    if (blocked.has(family)) continue;

    const familySet = pack.template_families[family];
    if (!familySet) continue;

    const templates = familySet[input.renderMode]?.[input.displayLang] ?? [];
    if (templates.length > 0) {
      return templates[v % templates.length];
    }
  }

  const fallbacks = pack.ultra_short_fallbacks[input.displayLang] ?? [];
  if (fallbacks.length > 0) {
    return fallbacks[v % fallbacks.length];
  }
  return null;
}

/** Alias matching handoff / external docs naming */
export const pickJTemplate = pickJMicroshiftTemplate;
