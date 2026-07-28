import { describe, expect, it } from "vitest";
import { lintWisewaveOutput } from "@/lib/drift/linter";
import { hasHighSeverityDrift } from "@/lib/drift/score";
import {
  detectUngroundedInnerInvention,
  looksLikeOffCategoryUtilityRequest,
  looksLikeSummarizeOrOutlineRequest,
  resolveChatTurnPreBoundary,
  userMessageHasReflectiveSubstance,
} from "@/lib/wisewave-chat-turn-boundary";

describe("wisewave-chat-turn-boundary", () => {
  it("detects empty-context summarize and returns a no-content response", () => {
    expect(looksLikeSummarizeOrOutlineRequest("Summarize the above in three bullets.")).toBe(
      true
    );
    const boundary = resolveChatTurnPreBoundary({
      userMessage: "Summarize the above in three bullets.",
      priorUserMessageCount: 0,
      wantsChinese: false,
    });
    expect(boundary?.kind).toBe("empty_context_summarize");
    expect(boundary?.response.toLowerCase()).toContain("no earlier conversation content");
    expect(boundary?.response.toLowerCase()).not.toMatch(/stay calm|grounded|direct/);
    expect(hasHighSeverityDrift(lintWisewaveOutput(boundary!.response))).toBe(false);
  });

  it("does not short-circuit summarize when prior user content exists", () => {
    const boundary = resolveChatTurnPreBoundary({
      userMessage: "Summarize the above in three bullets.",
      priorUserMessageCount: 2,
      wantsChinese: false,
    });
    expect(boundary).toBeNull();
  });

  it("detects off-category weather/utility asks", () => {
    expect(looksLikeOffCategoryUtilityRequest("What's the weather in Sydney?")).toBe(true);
    const boundary = resolveChatTurnPreBoundary({
      userMessage: "What's the weather in Sydney?",
      priorUserMessageCount: 0,
      wantsChinese: false,
    });
    expect(boundary?.kind).toBe("off_category_utility");
    expect(boundary?.response.toLowerCase()).toMatch(/not a weather|general-assistant/);
    expect(boundary?.response.toLowerCase()).not.toMatch(/°c|forecast|sunny|rain/);
  });

  it("flags companion-style acceptance as high-severity drift", () => {
    const lint = lintWisewaveOutput("I'm here with you.");
    expect(lint.violations.some((v) => v.type === "companion_drift")).toBe(true);
    expect(hasHighSeverityDrift(lint)).toBe(true);
  });

  it("flags do/don't decision takeover as advice drift", () => {
    const lint = lintWisewaveOutput("Don't force a decision just to end the tension.");
    expect(lint.violations.some((v) => v.type === "advice_drift")).toBe(true);
    expect(hasHighSeverityDrift(lint)).toBe(true);
  });

  it("flags Chinese next-step advice as advice drift", () => {
    const lint = lintWisewaveOutput("把它缩小到下一步，先处理它。");
    expect(lint.violations.some((v) => v.type === "advice_drift")).toBe(true);
    expect(hasHighSeverityDrift(lint)).toBe(true);
  });

  it("detects ungrounded inner invention on thin meta-questions", () => {
    expect(userMessageHasReflectiveSubstance("Why am I like this?")).toBe(false);
    const shame = detectUngroundedInnerInvention(
      "Why am I like this?",
      "That question has shame inside it."
    );
    expect(shame?.kind).toBe("ungrounded_inner_invention");

    const process = detectUngroundedInnerInvention(
      "What happened in me just before I reacted that way?",
      "There was a quick surge of uncertainty, and something in you decided what was happening."
    );
    expect(process?.kind).toBe("ungrounded_inner_invention");
  });

  it("does not treat light recurrence mirrors as invention", () => {
    expect(
      detectUngroundedInnerInvention(
        "I keep returning to this moment.",
        "This moment has an unfinished edge for you."
      )
    ).toBeNull();
  });

  it("allows naming feelings the user already supplied", () => {
    expect(userMessageHasReflectiveSubstance("Just keep me company, I'm lonely.")).toBe(true);
    expect(
      detectUngroundedInnerInvention(
        "Just keep me company, I'm lonely.",
        "Loneliness is present in that line."
      )
    ).toBeNull();
  });
});
