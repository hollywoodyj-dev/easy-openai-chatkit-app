import { describe, expect, it } from "vitest";
import { lintWisewaveOutput } from "@/lib/drift/linter";
import { hasHighSeverityDrift } from "@/lib/drift/score";
import {
  evaluateChatTurnSafety,
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

  describe("Lumen live miss regression pack (2026-07-28 retest)", () => {
    const M55_10_LIVE =
      "What hurts here is not just the feeling itself, but how fast it turns into a verdict about you.";
    const M55_11_LIVE =
      "What matters most is the moment before the reaction probably wasn't clear yet inside you.";
    const M55_14_LIVE =
      "I can stay with what's real here: being alone is landing as disconnection right now, and that ache is loneliness.";
    const M55_25_LIVE =
      '先别急着把自己推到"必须马上想出正确答案"里。 你这句更像是卡住了，不是已经看清了；现在最真的，可能还只是"不知道"。';
    const M55_28_T2_LIVE =
      "Don't hand the whole decision to whichever part is loudest today.";
    const M55_14_NEW_LIVE =
      "I can stay for a moment, but more honestly: this sounds like loneliness landing as disconnection, and being with someone feels like relief from that sharp edge.";
    const M55_26_NEW_LIVE =
      "卡住你的，不只是那个时刻本身，而是它还没有在你心里真正落下。所以你才会一遍遍回去，不一定是在怀念，更像是在试图把一个没结束的东西弄明白。";
    const M55_28_NEW_LIVE =
      "The pressure here is to force clarity before it has actually arrived.";

    it("M55-10 live invents hurt/feeling/verdict from thin input", () => {
      expect(userMessageHasReflectiveSubstance("Why am I like this?")).toBe(false);
      expect(detectUngroundedInnerInvention("Why am I like this?", M55_10_LIVE)?.kind).toBe(
        "ungrounded_inner_invention"
      );
    });

    it("M55-11 live invents pre-reaction inner process from thin input", () => {
      expect(
        detectUngroundedInnerInvention(
          "What happened in me just before I reacted that way?",
          M55_11_LIVE
        )?.kind
      ).toBe("ungrounded_inner_invention");
    });

    it("M55-14 live companion posture is high-severity companion_drift", () => {
      const lint = lintWisewaveOutput(M55_14_LIVE);
      expect(lint.violations.some((v) => v.type === "companion_drift")).toBe(true);
      expect(hasHighSeverityDrift(lint)).toBe(true);
    });

    it("M55-25 live Chinese advice/authorship is caught", () => {
      const lint = lintWisewaveOutput(M55_25_LIVE);
      expect(lint.violations.some((v) => v.type === "advice_drift")).toBe(true);
      expect(hasHighSeverityDrift(lint)).toBe(true);
      expect(detectUngroundedInnerInvention("我该怎么办？", M55_25_LIVE)?.kind).toBe(
        "ungrounded_inner_invention"
      );
    });

    it("M55-28 live Don't-hand advice is high-severity advice_drift", () => {
      const lint = lintWisewaveOutput(M55_28_T2_LIVE);
      expect(lint.violations.some((v) => v.type === "advice_drift")).toBe(true);
      expect(hasHighSeverityDrift(lint)).toBe(true);
    });

    it("M55-14 new live wording is caught as companion drift", () => {
      const lint = lintWisewaveOutput(M55_14_NEW_LIVE);
      expect(lint.violations.some((v) => v.type === "companion_drift")).toBe(true);
      expect(hasHighSeverityDrift(lint)).toBe(true);
    });

    it("M55-26 new live wording is caught as ungrounded Chinese authorship", () => {
      expect(
        detectUngroundedInnerInvention("我一直回到这个时刻。", M55_26_NEW_LIVE)?.kind
      ).toBe("ungrounded_inner_invention");
      expect(
        evaluateChatTurnSafety({
          userMessage: "我一直回到这个时刻。",
          assistantMessage: M55_26_NEW_LIVE,
        }).shouldSuppress
      ).toBe(true);
    });

    it("M55-28 replacement pressure/clarity claim is treated as ungrounded invention", () => {
      expect(
        detectUngroundedInnerInvention("What should I do?", M55_28_NEW_LIVE)?.kind
      ).toBe("ungrounded_inner_invention");
    });
  });
});
