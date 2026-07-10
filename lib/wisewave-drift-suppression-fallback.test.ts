import { describe, expect, it } from "vitest";
import { lintWisewaveOutput } from "@/lib/drift/linter";
import { hasHighSeverityDrift } from "@/lib/drift/score";
import { getDriftSuppressionFallback } from "@/lib/wisewave-drift-suppression-fallback";

describe("wisewave-drift-suppression-fallback", () => {
  it("EN fallback is non-empty and passes the drift linter cleanly", () => {
    const en = getDriftSuppressionFallback(false);
    expect(en.trim().length).toBeGreaterThan(0);
    const lint = lintWisewaveOutput(en);
    expect(lint.violations).toEqual([]);
    expect(hasHighSeverityDrift(lint)).toBe(false);
  });

  it("ZH fallback is non-empty, contains CJK, and passes the drift linter cleanly", () => {
    const zh = getDriftSuppressionFallback(true);
    expect(zh.trim().length).toBeGreaterThan(0);
    expect(/[\u4e00-\u9fff]/.test(zh)).toBe(true);
    const lint = lintWisewaveOutput(zh);
    expect(lint.violations).toEqual([]);
    expect(hasHighSeverityDrift(lint)).toBe(false);
  });

  it("EN fallback matches the shipped client placeholder line", () => {
    expect(getDriftSuppressionFallback(false)).toBe(
      "Something here still feels present. You can stay with it one line at a time."
    );
  });
});
