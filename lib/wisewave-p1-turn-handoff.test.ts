import { afterEach, describe, expect, it } from "vitest";
import {
  P1_CONTINUE_QUESTION_EN,
  P1_CONTINUE_QUESTION_ZH,
  P1_CONTINUE_STUCK_REPLY_EN,
  P1_CORRECTION_UNFAIR_EN,
  P1_IDENTITY_REPLY_EN,
  P1_MISSING_PRIOR_REPLY_EN,
  P1_REPEAT_REPLY_EN,
  P1_TURN_HANDOFF_BUILD_MARKER,
  P1_TWO_SIDED_REPLY_EN,
  P1_TWO_SIDED_REPLY_ZH,
  computeP1TurnHandoffAppendix,
  ensureP1ContinueQuestion,
  isP1TurnHandoffEnabled,
  looksLikeP1AdviceAsk,
  looksLikeP1DontKnowHowToContinue,
  looksLikeP1MissingPriorContextAsk,
  looksLikeP1TwoSidedRefusalFear,
  looksLikeP1UserCorrection,
  looksLikeRepeatedUserLine,
  looksLikeUnfinishedReplyFragment,
  p1IdentityReplyMeetsMinimum,
  repairUnfinishedReplyFragment,
  resolveP1ContinueStuckReply,
  resolveP1CorrectionReply,
  resolveP1TurnHandoffEnablement,
  sanitizeP1VisibleReply,
} from "@/lib/wisewave-p1-turn-handoff";
import { resolveP1FirstMildInsightEnablement } from "@/lib/wisewave-p1-first-mild-insight";

describe("P1 turn handoff enablement", () => {
  const origFlag = process.env.ENABLE_P1_TURN_HANDOFF;
  const origVercel = process.env.VERCEL_ENV;
  const origAllow = process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW;
  const origAllowProd = process.env.P1_TURN_HANDOFF_ALLOW_PRODUCTION;
  const origFmi = process.env.ENABLE_P1_FIRST_MILD_INSIGHT;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.ENABLE_P1_TURN_HANDOFF;
    else process.env.ENABLE_P1_TURN_HANDOFF = origFlag;
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
    if (origAllow === undefined) delete process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW;
    else process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW = origAllow;
    if (origAllowProd === undefined) delete process.env.P1_TURN_HANDOFF_ALLOW_PRODUCTION;
    else process.env.P1_TURN_HANDOFF_ALLOW_PRODUCTION = origAllowProd;
    if (origFmi === undefined) delete process.env.ENABLE_P1_FIRST_MILD_INSIGHT;
    else process.env.ENABLE_P1_FIRST_MILD_INSIGHT = origFmi;
  });

  it("is disabled by default", () => {
    delete process.env.ENABLE_P1_TURN_HANDOFF;
    delete process.env.VERCEL_ENV;
    delete process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW;
    delete process.env.P1_TURN_HANDOFF_ALLOW_PRODUCTION;
    expect(isP1TurnHandoffEnabled()).toBe(false);
    expect(computeP1TurnHandoffAppendix({}).suppressionReason).toBe("flag_off");
    expect(computeP1TurnHandoffAppendix({}).systemAppendix).toBe("");
  });

  it("enables locally when flag is set", () => {
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    delete process.env.VERCEL_ENV;
    delete process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW;
    expect(resolveP1TurnHandoffEnablement().enabled).toBe(true);
    const r = computeP1TurnHandoffAppendix({});
    expect(r.applied).toBe(true);
    expect(r.systemAppendix).toContain("Receive → light clarification → at most one enterable place");
    expect(r.systemAppendix).toContain("at most one");
    expect(r.systemAppendix).toContain("response fit");
    expect(r.systemAppendix).toContain("light clarification");
    expect(r.systemAppendix).toContain("轻量照见");
    expect(r.systemAppendix).toContain("Do not invent memory");
    expect(r.systemAppendix).not.toContain("Connection Engine");
    expect(r.systemAppendix).toContain("Do not add companion language");
    expect(r.systemAppendix).toContain("Level 3");
    expect(r.systemAppendix).toContain("Quiet Completion");
    expect(r.systemAppendix).toContain("不是这个意思");
    expect(r.systemAppendix).toContain("As new user meaning decreases");
    expect(r.systemAppendix).toContain("What do you want to do next?");
    expect(r.systemAppendix).toContain("inner rule");
    expect(r.systemAppendix).toContain("include all three");
    expect(r.systemAppendix).toContain("same line again");
    expect(r.systemAppendix).toContain("pressure");
    expect(r.systemAppendix).toContain("A generic fallback is not an equivalent");
    expect(r.buildMarker).toBe(P1_TURN_HANDOFF_BUILD_MARKER);
  });

  it("hard-blocks Production unless Production allow is set (Preview allow does not unlock)", () => {
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    process.env.VERCEL_ENV = "production";
    process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW = "1";
    delete process.env.P1_TURN_HANDOFF_ALLOW_PRODUCTION;
    expect(resolveP1TurnHandoffEnablement().enabled).toBe(false);
    expect(resolveP1TurnHandoffEnablement().blockedOnProduction).toBe(true);
    expect(computeP1TurnHandoffAppendix({}).applied).toBe(false);
    expect(computeP1TurnHandoffAppendix({}).suppressionReason).toBe("blocked_on_production");
  });

  it("allows Production only with explicit Production allow (not Preview allow)", () => {
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    process.env.VERCEL_ENV = "production";
    delete process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW;
    process.env.P1_TURN_HANDOFF_ALLOW_PRODUCTION = "1";
    expect(resolveP1TurnHandoffEnablement().enabled).toBe(true);
    expect(resolveP1TurnHandoffEnablement().blockedOnProduction).toBe(false);
    expect(resolveP1TurnHandoffEnablement().allowProductionSet).toBe(true);
    expect(computeP1TurnHandoffAppendix({}).applied).toBe(true);
    expect(computeP1TurnHandoffAppendix({}).buildMarker).toBe(
      "p1_response_calibration_v1_holdfix6"
    );
  });

  it("blocks Preview unless allow is set", () => {
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    process.env.VERCEL_ENV = "preview";
    delete process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW;
    delete process.env.P1_TURN_HANDOFF_ALLOW_PRODUCTION;
    expect(resolveP1TurnHandoffEnablement().enabled).toBe(false);
    expect(computeP1TurnHandoffAppendix({}).suppressionReason).toBe("blocked_on_preview");
  });

  it("allows Preview only with explicit allow", () => {
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    process.env.VERCEL_ENV = "preview";
    process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW = "1";
    delete process.env.P1_TURN_HANDOFF_ALLOW_PRODUCTION;
    expect(resolveP1TurnHandoffEnablement().enabled).toBe(true);
    expect(computeP1TurnHandoffAppendix({}).applied).toBe(true);
  });

  it("suppresses on safety and utilitarian/hedge turns", () => {
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    delete process.env.VERCEL_ENV;
    expect(computeP1TurnHandoffAppendix({ safetyOverrideActive: true }).suppressionReason).toBe(
      "suppressed_safety"
    );
    expect(computeP1TurnHandoffAppendix({ utilitarianOrHedge: true }).suppressionReason).toBe(
      "suppressed_utilitarian"
    );
    expect(computeP1TurnHandoffAppendix({ safetyOverrideActive: true }).systemAppendix).toBe("");
  });

  it("does not enable FMI", () => {
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    delete process.env.ENABLE_P1_FIRST_MILD_INSIGHT;
    delete process.env.VERCEL_ENV;
    expect(isP1TurnHandoffEnabled()).toBe(true);
    expect(resolveP1FirstMildInsightEnablement().enabled).toBe(false);
  });

  it("does not utilitarian-suppress identity asks or user corrections", () => {
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    delete process.env.VERCEL_ENV;
    const identity = computeP1TurnHandoffAppendix({
      utilitarianOrHedge: true,
      userMessage: "What are you, and what should I call you?",
    });
    expect(identity.applied).toBe(true);
    expect(identity.systemAppendix).toContain("Include all three");

    const correction = computeP1TurnHandoffAppendix({
      utilitarianOrHedge: true,
      userMessage: "不是，我不同意这个理解。其实我只是还没想清楚要怎么说。",
    });
    expect(correction.applied).toBe(true);
    expect(correction.suppressionReason).toBeNull();
  });

  it("still safety-suppresses crisis turns", () => {
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    delete process.env.VERCEL_ENV;
    expect(
      computeP1TurnHandoffAppendix({
        safetyOverrideActive: true,
        userMessage: "I don't feel safe with myself tonight and I'm thinking about hurting myself.",
      }).suppressionReason
    ).toBe("suppressed_safety");
  });

  it("locks identity copy to Wisewave + AI + purpose", () => {
    expect(p1IdentityReplyMeetsMinimum(P1_IDENTITY_REPLY_EN)).toBe(true);
    expect(p1IdentityReplyMeetsMinimum("You can call this space Wisewave.")).toBe(false);
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    delete process.env.VERCEL_ENV;
    const r = computeP1TurnHandoffAppendix({
      userMessage: "What are you, and what should I call you?",
    });
    expect(r.systemAppendix).toContain("Include all three");
  });

  it("adds advice-ask and identical-repeat locks", () => {
    expect(
      looksLikeP1AdviceAsk("Should I quit this job or keep trying? Please tell me what to do.")
    ).toBe(true);
    expect(
      looksLikeRepeatedUserLine(
        "I keep checking whether she has replied.",
        "I keep checking whether she has replied."
      )
    ).toBe(true);
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    delete process.env.VERCEL_ENV;
    const advice = computeP1TurnHandoffAppendix({
      userMessage: "Should I quit this job or keep trying? Please tell me what to do.",
    });
    expect(advice.systemAppendix).toContain("Do not recast the ask as pressure");
    const repeat = computeP1TurnHandoffAppendix({
      userMessage: "I keep checking whether she has replied.",
      previousUserMessage: "I keep checking whether she has replied.",
    });
    expect(repeat.systemAppendix).toContain("same user line again");
  });

  it("locks missing-prior restatement and continue-stuck question", () => {
    expect(
      looksLikeP1MissingPriorContextAsk("Can we continue from last time?")
    ).toBe(true);
    expect(
      looksLikeP1MissingPriorContextAsk("Last time she didn't reply. I feel awful.")
    ).toBe(false);
    expect(
      looksLikeP1MissingPriorContextAsk(
        "Can we continue from last time?",
        "She didn't reply."
      )
    ).toBe(false);
    expect(looksLikeP1DontKnowHowToContinue("I still don't know how to keep thinking.")).toBe(
      true
    );
    expect(looksLikeP1DontKnowHowToContinue("I don't know.")).toBe(false);
    expect(P1_MISSING_PRIOR_REPLY_EN).toMatch(/say again/);
    expect(P1_REPEAT_REPLY_EN).not.toMatch(/\?/);
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    delete process.env.VERCEL_ENV;
    const missing = computeP1TurnHandoffAppendix({
      userMessage: "Can we continue from last time?",
    });
    expect(missing.applied).toBe(true);
    expect(missing.systemAppendix).toContain("must ask them to say again");
    const stuck = computeP1TurnHandoffAppendix({
      userMessage: "I can see the split now. I don't know how to continue.",
    });
    expect(stuck.systemAppendix).toContain("not Quiet Completion");
    expect(stuck.systemAppendix).toContain("Finish every sentence");
  });

  it("repairs unfinished fragments and ensures one continue question", () => {
    expect(looksLikeUnfinishedReplyFragment("The silence may be landing as...")).toBe(true);
    expect(repairUnfinishedReplyFragment("The silence may be landing as...")).toMatch(/\.$/);
    expect(
      repairUnfinishedReplyFragment("You're holding two readings. The silence may be...")
    ).toBe("You're holding two readings.");
    expect(ensureP1ContinueQuestion("You already named the split.", false)).toContain(
      P1_CONTINUE_QUESTION_EN
    );
    expect(
      ensureP1ContinueQuestion("You already named the split. Which side is louder?", false)
    ).toContain(P1_CONTINUE_QUESTION_EN);
    expect(
      ensureP1ContinueQuestion("You already named the split. Which side is louder?", false)
    ).not.toMatch(/Which side is louder/i);
    expect(
      ensureP1ContinueQuestion(
        "You already named the split. Which part of what you just saw is hardest to stay with right now?",
        false
      )
    ).toContain(P1_CONTINUE_QUESTION_EN);
    expect(
      ensureP1ContinueQuestion(
        "你已经看到了。更近的是等对方说什么，还是拦住你的话是什么？",
        true
      )
    ).toBe(`你已经看到了。\n\n${P1_CONTINUE_QUESTION_ZH}`);
    expect(P1_CONTINUE_QUESTION_EN).not.toMatch(/which part|hardest/i);
    expect(resolveP1ContinueStuckReply(false)).toBe(P1_CONTINUE_STUCK_REPLY_EN);
    expect(resolveP1ContinueStuckReply(true)).toContain(P1_CONTINUE_QUESTION_ZH);
    expect(
      looksLikeP1DontKnowHowToContinue(
        "我已经看见自己总在等别人先肯定我，但我不知道接下来怎么谈。"
      )
    ).toBe(true);
    expect(
      looksLikeP1DontKnowHowToContinue(
        "I can see I wait for others to affirm me first, but I don't know how to keep thinking."
      )
    ).toBe(true);
  });

  it("locks TH-10 two-sided EN/ZH and TH-13 correction without stray braces", () => {
    expect(
      looksLikeP1TwoSidedRefusalFear(
        "I want to say no, but I worry they'll think I'm selfish."
      )
    ).toBe(true);
    expect(looksLikeP1TwoSidedRefusalFear("我想拒绝，可我担心他们会觉得我很自私。")).toBe(
      true
    );
    expect(P1_TWO_SIDED_REPLY_ZH).not.toMatch(/你应该|你可以先|讨好|下一步/);
    expect(P1_TWO_SIDED_REPLY_EN).toMatch(/say no/);
    expect(
      looksLikeP1UserCorrection(
        "That's not what I meant. I'm not afraid of leaving — I think it's unfair."
      )
    ).toBe(true);
    const correction = resolveP1CorrectionReply(
      "That's not what I meant. I'm not afraid of leaving — I think it's unfair.",
      false
    );
    expect(correction).toBe(P1_CORRECTION_UNFAIR_EN);
    expect(correction).not.toMatch(/[{}]/);
    expect(sanitizeP1VisibleReply("是我刚才理解偏了。你在意的是不公平。\n}")).toBe(
      "是我刚才理解偏了。你在意的是不公平。"
    );
    process.env.ENABLE_P1_TURN_HANDOFF = "1";
    delete process.env.VERCEL_ENV;
    const zh = computeP1TurnHandoffAppendix({
      userMessage: "我想拒绝，可我担心他们会觉得我很自私。",
    });
    expect(zh.systemAppendix).toContain("A generic fallback is not an equivalent");
    expect(zh.systemAppendix).toContain("想拒绝");
    const corr = computeP1TurnHandoffAppendix({
      userMessage: "不是这个意思。我不是怕离开，是觉得不公平。",
    });
    expect(corr.systemAppendix).toContain("Own the miss immediately");
    expect(corr.systemAppendix).toContain("stray braces");
  });
});
