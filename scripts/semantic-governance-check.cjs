/**
 * Standalone semantic governance validation (Tree-approved v1 design).
 * Failures route to escalation — not wired into npm run build.
 */
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const result = spawnSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "vitest",
    "run",
    "lib/semantic-governance/semantic-governance-check.test.ts",
    "--reporter=verbose",
  ],
  { cwd: root, stdio: "inherit", shell: process.platform === "win32" },
);

process.exit(result.status ?? 1);
