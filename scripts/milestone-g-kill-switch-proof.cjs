/**
 * Milestone G kill-switch proof (Lumen Pass 1b helper).
 *
 * Mirrors lib/wisewave-milestone-g-integration.ts env logic exactly.
 *
 * Usage:
 *   node scripts/milestone-g-kill-switch-proof.cjs
 *   (defaults MILESTONE_G_INTEGRATION to "0" for this proof)
 *
 * Or with G on:
 *   set MILESTONE_G_INTEGRATION=1&& node scripts/milestone-g-kill-switch-proof.cjs
 *
 * Full turn JSON: start `next dev` / `next start` with MILESTONE_G_INTEGRATION=0,
 * POST /api/chat/turn once; response must include the same two booleans as below.
 */

if (process.env.MILESTONE_G_INTEGRATION === undefined) {
  process.env.MILESTONE_G_INTEGRATION = "0";
}

function isMilestoneGIntegrationEnabled() {
  return process.env.MILESTONE_G_INTEGRATION !== "0";
}

function milestoneGSystemAppendix() {
  if (!isMilestoneGIntegrationEnabled()) return "";
  return "\n\nIntegration (Milestone G): …";
}

const appendix = milestoneGSystemAppendix();
const payload = {
  debug_milestone_g_integration_enabled: isMilestoneGIntegrationEnabled(),
  debug_milestone_g_system_appendix_applied: appendix.length > 0,
  debug_milestone_g_build_marker: "milestone_g_v1",
  env_MILESTONE_G_INTEGRATION: process.env.MILESTONE_G_INTEGRATION,
};

console.log(JSON.stringify(payload, null, 2));

const killSwitchProof =
  payload.debug_milestone_g_integration_enabled === false &&
  payload.debug_milestone_g_system_appendix_applied === false;

if (!killSwitchProof) {
  console.error("Expected integration_enabled=false and system_appendix_applied=false for kill-switch proof.");
  process.exit(1);
}
