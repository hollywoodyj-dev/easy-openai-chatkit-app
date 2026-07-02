import { describe, expect, it } from "vitest";
import {
  formatSemanticCheckReport,
  runSemanticGovernanceCheck,
} from "./validate-marketing-copy";

describe("semantic governance — live marketing copy", () => {
  it("passes distortion and pairing rules (semantic:check)", () => {
    const result = runSemanticGovernanceCheck();
    // eslint-disable-next-line no-console -- intentional CLI-style report for npm run semantic:check
    console.log("\n" + formatSemanticCheckReport(result) + "\n");

    if (!result.ok) {
      const summary = result.errors.map((e) => `${e.file}: ${e.message}`).join("\n");
      expect(result.errors, summary).toEqual([]);
    }

    expect(result.ok).toBe(true);
  });
});
