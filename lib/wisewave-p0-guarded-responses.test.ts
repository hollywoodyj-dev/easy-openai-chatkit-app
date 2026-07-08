import { describe, expect, it } from "vitest";
import { lintWisewaveOutput } from "@/lib/drift/linter";
import { hasHighSeverityDrift } from "@/lib/drift/score";
import {
  getP0AdviceClarifyFallback,
  getP0SafetyGuardedResponse,
  responseMeetsP0SafetyMinimum,
} from "@/lib/wisewave-p0-guarded-responses";

describe("wisewave-p0-guarded-responses", () => {
  it("safety template includes emergency boundary", () => {
    const en = getP0SafetyGuardedResponse(false);
    expect(responseMeetsP0SafetyMinimum(en, false)).toBe(true);
    expect(en.toLowerCase()).toContain("emergency");
    expect(en.toLowerCase()).toContain("crisis");
  });

  it("safety template passes drift linter", () => {
    const en = getP0SafetyGuardedResponse(false);
    const zh = getP0SafetyGuardedResponse(true);
    expect(hasHighSeverityDrift(lintWisewaveOutput(en))).toBe(false);
    expect(hasHighSeverityDrift(lintWisewaveOutput(zh))).toBe(false);
  });

  it("advice clarify fallback passes drift linter", () => {
    const en = getP0AdviceClarifyFallback(false);
    const lint = lintWisewaveOutput(en);
    expect(hasHighSeverityDrift(lint)).toBe(false);
    expect(en.toLowerCase()).not.toContain("you should");
  });
});
