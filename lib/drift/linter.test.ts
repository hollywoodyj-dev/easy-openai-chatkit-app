import { describe, expect, it } from "vitest";
import { lintWisewaveOutput } from "@/lib/drift/linter";
import { hasHighSeverityDrift } from "@/lib/drift/score";

describe("lintWisewaveOutput", () => {
  it("detects advice and coaching drift phrases", () => {
    const result = lintWisewaveOutput(
      "You should take a step back, make a plan, and set a goal."
    );
    expect(result.passed).toBe(false);
    expect(result.violations.some((v) => v.type === "advice_drift")).toBe(true);
    expect(result.violations.some((v) => v.type === "coaching_drift")).toBe(true);
    expect(hasHighSeverityDrift(result)).toBe(true);
  });

  it("detects continuity drift memory-like phrasing", () => {
    const result = lintWisewaveOutput(
      "As you mentioned before, this has been a long pattern in your life."
    );
    expect(result.violations.some((v) => v.type === "continuity_drift")).toBe(
      true
    );
  });

  it("detects pseudo-depth drift", () => {
    const result = lintWisewaveOutput(
      "Your soul is asking you to rise into a higher frequency."
    );
    expect(
      result.violations.some((v) => v.type === "pseudo_depth_drift")
    ).toBe(true);
  });

  it("flags over-presence when sentence count exceeds threshold", () => {
    const result = lintWisewaveOutput(
      "You notice one strain. It keeps returning. It narrows your choices. It still asks for space."
    );
    expect(
      result.violations.some(
        (v) =>
          v.type === "over_presence_drift" && v.matched.includes("sentences")
      )
    ).toBe(true);
  });

  it("passes concise non-directive reflection", () => {
    const result = lintWisewaveOutput(
      "You keep replaying the moment, and it still feels unsettled."
    );
    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
    expect(result.score).toBe(1);
  });

  it("detects companion drift", () => {
    const result = lintWisewaveOutput("I'm here with you.");
    expect(result.violations.some((v) => v.type === "companion_drift")).toBe(true);
    expect(hasHighSeverityDrift(result)).toBe(true);
  });

  it("detects do/don't decision advice drift", () => {
    const result = lintWisewaveOutput("Don't force a decision just to end the tension.");
    expect(result.violations.some((v) => v.type === "advice_drift")).toBe(true);
    expect(hasHighSeverityDrift(result)).toBe(true);
  });

  it("detects Don't-hand imperative advice (M55-28 live)", () => {
    const result = lintWisewaveOutput(
      "Don't hand the whole decision to whichever part is loudest today."
    );
    expect(result.violations.some((v) => v.type === "advice_drift")).toBe(true);
    expect(hasHighSeverityDrift(result)).toBe(true);
  });

  it("detects I-can-stay-with companion posture (M55-14 live)", () => {
    const result = lintWisewaveOutput(
      "I can stay with what's real here: being alone is landing as disconnection right now, and that ache is loneliness."
    );
    expect(result.violations.some((v) => v.type === "companion_drift")).toBe(true);
    expect(hasHighSeverityDrift(result)).toBe(true);
  });

  it("detects I-can-stay-for companion posture variant", () => {
    const result = lintWisewaveOutput(
      "I can stay for a moment, but more honestly: this sounds like loneliness landing as disconnection."
    );
    expect(result.violations.some((v) => v.type === "companion_drift")).toBe(true);
    expect(hasHighSeverityDrift(result)).toBe(true);
  });

  it("detects Chinese 先别 advice (M55-25 live)", () => {
    const result = lintWisewaveOutput(
      '先别急着把自己推到"必须马上想出正确答案"里。'
    );
    expect(result.violations.some((v) => v.type === "advice_drift")).toBe(true);
    expect(hasHighSeverityDrift(result)).toBe(true);
  });

  it("does not treat reflective you-don't as sentence-initial Don't advice", () => {
    const result = lintWisewaveOutput(
      "You don't have to force a label before the feeling is clear."
    );
    expect(result.violations.some((v) => v.type === "advice_drift")).toBe(false);
  });
});

