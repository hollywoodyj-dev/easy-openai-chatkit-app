import { describe, expect, it } from "vitest";
import {
  isAllowlistedDistortionContext,
  scanLineForDistortion,
  scanTextForDistortionViolations,
} from "./distortion-check";

describe("distortion-check", () => {
  it("flags unallowlisted coaching framing", () => {
    const hits = scanTextForDistortionViolations(
      "Wisewave is your AI coach for daily reflection.",
    );
    expect(hits.length).toBeGreaterThan(0);
  });

  it("allowlists negated therapy on boundary pages", () => {
    const line = "Wisewave is not therapy, diagnosis, treatment, or crisis support.";
    const hits = scanLineForDistortion(line, 1);
    expect(hits.every((h) => h.allowlisted)).toBe(true);
  });

  it("allowlists without coaching in SEO titles", () => {
    const line =
      "Reflection AI Without Coaching or Advice | Wisewave";
    const hits = scanLineForDistortion(line, 1);
    expect(hits.filter((h) => !h.allowlisted)).toHaveLength(0);
  });

  it("allowlists boundary FAQ questions", () => {
    const line = "Is Wisewave therapy?";
    expect(
      isAllowlistedDistortionContext(line, line.indexOf("therapy"), "therapy"),
    ).toBe(true);
  });

  it("allowlists companion in negated what-it-is-not copy", () => {
    const line =
      "No coaching. No direction. No companion-style AI. Just a quieter space.";
    const hits = scanLineForDistortion(line, 1);
    expect(hits.filter((h) => !h.allowlisted)).toHaveLength(0);
  });

  it("flags affirmative assistant framing", () => {
    const hits = scanTextForDistortionViolations(
      "Download your new AI assistant for reflection.",
    );
    expect(hits.some((h) => h.class === "assistant_task")).toBe(true);
  });
});
