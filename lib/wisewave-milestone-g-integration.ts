/**
 * Milestone G — minimal integration / everyday usefulness (generation layer).
 * Aligned to `docs/HC_OS_V1_Milestone_G_Proof_Spec_v1.json` and OctopusMind boundary:
 * improve loop coherence without adding product surface or utility behavior.
 */

const BUILD_MARKER = "milestone_g_v1";

/** When `MILESTONE_G_INTEGRATION=0`, no system appendix is applied (kill switch). */
export function isMilestoneGIntegrationEnabled(): boolean {
  return process.env.MILESTONE_G_INTEGRATION !== "0";
}

export function milestoneGBuildMarker(): string {
  return BUILD_MARKER;
}

/**
 * Short system prompt appendix: nudge one-voice, reflection-first main reply.
 * Does not add UI, memory, or workflow — coherence only.
 */
export function milestoneGSystemAppendix(): string {
  if (!isMilestoneGIntegrationEnabled()) return "";
  return `

Integration (Milestone G): Write as one coherent reflection in a single voice. Do not narrate separate "steps" or layers (for example, do not open with "first, regarding the pattern…" as if it were a different mode). If conversation context or recurring themes apply, weave them naturally without meta-commentary about systems, features, chat UI, or internal tools. Keep the reply reflection-first, light, and non-directive — not utility, coaching, or self-management.`;
}
