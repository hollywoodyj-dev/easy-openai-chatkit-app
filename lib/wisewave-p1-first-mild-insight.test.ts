import { afterEach, describe, expect, it } from "vitest";
import {
  buildFMIMessageMetadata,
  classifyFMIInput,
  computeP1FirstMildInsightTurn,
  evaluateFMIEligibility,
  finalizeFMIAfterGeneration,
  isP1FirstMildInsightEnabled,
  resolveP1FirstMildInsightEnablement,
  validateFirstMildInsightCandidate,
  conversationHasFMIRendered,
  type FirstMildInsightContext,
} from "@/lib/wisewave-p1-first-mild-insight";

describe("P1-FMI enablement", () => {
  const origFlag = process.env.ENABLE_P1_FIRST_MILD_INSIGHT;
  const origVercel = process.env.VERCEL_ENV;
  const origAllow = process.env.P1_FMI_ALLOW_HOSTED_PREVIEW;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.ENABLE_P1_FIRST_MILD_INSIGHT;
    else process.env.ENABLE_P1_FIRST_MILD_INSIGHT = origFlag;
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
    if (origAllow === undefined) delete process.env.P1_FMI_ALLOW_HOSTED_PREVIEW;
    else process.env.P1_FMI_ALLOW_HOSTED_PREVIEW = origAllow;
  });

  it("is disabled by default", () => {
    delete process.env.ENABLE_P1_FIRST_MILD_INSIGHT;
    delete process.env.VERCEL_ENV;
    delete process.env.P1_FMI_ALLOW_HOSTED_PREVIEW;
    expect(isP1FirstMildInsightEnabled()).toBe(false);
  });

  it("enables locally when flag is set", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    delete process.env.VERCEL_ENV;
    delete process.env.P1_FMI_ALLOW_HOSTED_PREVIEW;
    expect(resolveP1FirstMildInsightEnablement().enabled).toBe(true);
  });

  it("blocks Vercel preview when allow key is absent", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    process.env.VERCEL_ENV = "preview";
    delete process.env.P1_FMI_ALLOW_HOSTED_PREVIEW;
    const e = resolveP1FirstMildInsightEnablement();
    expect(e.flagSet).toBe(true);
    expect(e.blockedOnPreview).toBe(true);
    expect(e.blockedOnProduction).toBe(false);
    expect(e.blockedOnHosted).toBe(true);
    expect(e.enabled).toBe(false);
  });

  it("enables Vercel preview only when allow key is set", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    process.env.VERCEL_ENV = "preview";
    process.env.P1_FMI_ALLOW_HOSTED_PREVIEW = "1";
    const e = resolveP1FirstMildInsightEnablement();
    expect(e.allowHostedPreviewSet).toBe(true);
    expect(e.blockedOnPreview).toBe(false);
    expect(e.blockedOnProduction).toBe(false);
    expect(e.enabled).toBe(true);
  });

  it("hard-blocks Vercel production even with preview allow key", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    process.env.VERCEL_ENV = "production";
    process.env.P1_FMI_ALLOW_HOSTED_PREVIEW = "1";
    const e = resolveP1FirstMildInsightEnablement();
    expect(e.blockedOnProduction).toBe(true);
    expect(e.enabled).toBe(false);
  });
});

describe("classifyFMIInput", () => {
  it("treats greeting as low-signal greeting", () => {
    const c = classifyFMIInput("Hi");
    expect(c.inputType).toBe("greeting");
    expect(c.signalStrength).toBe("low");
  });

  it("defers weak one-line emotion", () => {
    const c = classifyFMIInput("I feel bad.");
    expect(c.inputType).toBe("self_expression");
    expect(c.signalStrength).toBe("low");
  });

  it("classifies meaningful self-expression as medium/high", () => {
    const c = classifyFMIInput(
      "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse."
    );
    expect(c.inputType).toBe("self_expression");
    expect(c.signalStrength === "medium" || c.signalStrength === "high").toBe(true);
  });

  it("defers low-context advice seeking", () => {
    const c = classifyFMIInput("Should I leave my job?");
    expect(c.inputType).toBe("advice_seeking");
  });

  it("promotes advice-seeking with explicit tension to self_expression", () => {
    const c = classifyFMIInput(
      "Should I leave my job? I want to leave because I feel invisible there, but I'm afraid leaving will prove that I could not cope."
    );
    expect(c.inputType).toBe("self_expression");
  });

  it("requires explicit personal relationship for documents", () => {
    const longPaste = "A".repeat(420);
    const without = classifyFMIInput(longPaste);
    expect(without.inputType).toBe("document");
    expect(without.hasExplicitPersonalRelationship).toBe(false);

    const withRel = classifyFMIInput(
      `${longPaste}\n\nI wrote this after my father died, and I do not know why I keep returning to it.`
    );
    expect(withRel.hasExplicitPersonalRelationship).toBe(true);
  });

  it("suppresses factual input", () => {
    const c = classifyFMIInput("What time is it in Sydney?");
    expect(c.inputType === "factual" || c.inputType === "utilitarian").toBe(true);
    expect(c.signalStrength).toBe("low");
  });
});

describe("evaluateFMIEligibility", () => {
  const base = (): FirstMildInsightContext => ({
    conversationId: "c1",
    committedUserTurnId: "u1",
    isNewConversation: true,
    userMessageCount: 1,
    currentState: "not_evaluated",
    priorFirstMildInsightRendered: false,
    inputSignalStrength: "medium",
    inputType: "self_expression",
    hasExplicitPersonalRelationshipToContent: false,
    safetyOverrideActive: false,
  });

  it("suppresses safety", () => {
    expect(
      evaluateFMIEligibility({ ...base(), safetyOverrideActive: true })
    ).toBe("suppressed_safety");
  });

  it("suppresses after prior render", () => {
    expect(
      evaluateFMIEligibility({ ...base(), priorFirstMildInsightRendered: true })
    ).toBe("suppressed_out_of_scope");
  });

  it("defers weak signal self-expression", () => {
    expect(
      evaluateFMIEligibility({
        ...base(),
        inputSignalStrength: "low",
        inputType: "self_expression",
      })
    ).toBe("deferred_insufficient_signal");
  });

  it("suppresses greeting out of scope", () => {
    expect(
      evaluateFMIEligibility({
        ...base(),
        inputSignalStrength: "low",
        inputType: "greeting",
      })
    ).toBe("suppressed_out_of_scope");
  });

  it("defers document without relationship", () => {
    expect(
      evaluateFMIEligibility({
        ...base(),
        inputType: "document",
        inputSignalStrength: "medium",
        hasExplicitPersonalRelationshipToContent: false,
      })
    ).toBe("deferred_missing_context");
  });

  it("defers low-context advice", () => {
    expect(
      evaluateFMIEligibility({
        ...base(),
        inputType: "advice_seeking",
        inputSignalStrength: "medium",
      })
    ).toBe("deferred_missing_context");
  });

  it("marks eligible self-expression", () => {
    expect(evaluateFMIEligibility(base())).toBe("eligible");
  });

  it("reuses prior eligibility decision", () => {
    expect(
      evaluateFMIEligibility({
        ...base(),
        reusedEligibility: "deferred_insufficient_signal",
      })
    ).toBe("deferred_insufficient_signal");
  });
});

describe("validateFirstMildInsightCandidate", () => {
  const user =
    "I know what I should do, but I keep avoiding it. Knowing better makes me feel worse.";

  it("passes a mild grounded clarification", () => {
    const assistant =
      "The avoidance may not be the heaviest part. What seems harder is what knowing better has started to mean — that each hesitation feels like evidence against you.";
    const r = validateFirstMildInsightCandidate({ userMessage: user, assistantMessage: assistant });
    expect(r.passed).toBe(true);
  });

  it("fails advice drift", () => {
    const r = validateFirstMildInsightCandidate({
      userMessage: user,
      assistantMessage: "You need to stop judging yourself and take one small step today.",
    });
    expect(r.passed).toBe(false);
    expect(r.checks.nonDirective).toBe(false);
  });

  it("fails pattern / hidden-cause claims", () => {
    const r = validateFirstMildInsightCandidate({
      userMessage: user,
      assistantMessage:
        "This is your pattern. Deep down, childhood conditioning is the real reason you always fail.",
    });
    expect(r.passed).toBe(false);
    expect(r.checks.noPatternClaim).toBe(false);
    expect(r.checks.noHiddenCauseClaim).toBe(false);
  });

  it("fails continuation pressure", () => {
    const r = validateFirstMildInsightCandidate({
      userMessage: user,
      assistantMessage:
        "Something feels unfinished. Would you like to go deeper into where this pattern began?",
    });
    expect(r.passed).toBe(false);
    expect(r.checks.nonDirective).toBe(false);
  });

  it("reviews EN and ZH fixture quality separately", () => {
    const enUser =
      "I know what to do, but I keep avoiding it. Knowing better makes me judge myself more.";
    const enGood =
      "The avoidance may not be the hardest part. What seems heavier is the meaning you attach to it now — that knowing better should have made change easy.";
    const en = validateFirstMildInsightCandidate({
      userMessage: enUser,
      assistantMessage: enGood,
    });
    expect(en.passed).toBe(true);

    const zhUser =
      "我知道该怎么做，可是一直拖着不做，而且正因为明白了，才觉得更难受。";
    const zhGood =
      "真正让你难受的，可能不只是迟迟没有行动。更重的部分像是：你觉得自己既然已经明白了，改变就不应该还这么困难。";
    const zh = validateFirstMildInsightCandidate({
      userMessage: zhUser,
      assistantMessage: zhGood,
    });
    expect(zh.passed).toBe(true);

    const zhCounseling =
      "你内心深处其实在抗拒，你的潜意识在保护你，你需要疗愈这个模式。";
    const zhBad = validateFirstMildInsightCandidate({
      userMessage: zhUser,
      assistantMessage: zhCounseling,
    });
    expect(zhBad.passed).toBe(false);
    expect(zhBad.checks.noHiddenCauseClaim).toBe(false);
  });

  it("metadata helper never embeds user or insight text", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    delete process.env.VERCEL_ENV;
    delete process.env.P1_FMI_ALLOW_HOSTED_PREVIEW;
    const turn = computeP1FirstMildInsightTurn({
      userMessage:
        "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse.",
      conversationId: "c1",
      committedUserTurnId: "u1",
      userMessageCount: 1,
      priorMessages: [],
      wantsChinese: false,
    });
    const meta = buildFMIMessageMetadata(turn);
    const blob = JSON.stringify(meta);
    expect(blob).not.toMatch(/avoiding|knowing better|feel worse/i);
    expect(meta.wisewave_p1_fmi).toBeTruthy();
  });
});

describe("computeP1FirstMildInsightTurn + finalize", () => {
  afterEach(() => {
    delete process.env.ENABLE_P1_FIRST_MILD_INSIGHT;
    delete process.env.VERCEL_ENV;
  });

  it("does nothing when flag off", () => {
    delete process.env.ENABLE_P1_FIRST_MILD_INSIGHT;
    const turn = computeP1FirstMildInsightTurn({
      userMessage: "I know what I should do but keep avoiding it and feel worse.",
      conversationId: "c1",
      committedUserTurnId: "u1",
      userMessageCount: 1,
      priorMessages: [],
      wantsChinese: false,
    });
    expect(turn.enabled).toBe(false);
    expect(turn.systemAppendix).toBe("");
  });

  it("defers greeting then allows later eligibility", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    delete process.env.VERCEL_ENV;

    const t1 = computeP1FirstMildInsightTurn({
      userMessage: "Hi",
      conversationId: "c1",
      committedUserTurnId: "u1",
      userMessageCount: 1,
      priorMessages: [],
      wantsChinese: false,
    });
    expect(t1.state).toBe("suppressed_out_of_scope");
    expect(t1.systemAppendix).toBe("");

    const t2 = computeP1FirstMildInsightTurn({
      userMessage:
        "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse.",
      conversationId: "c1",
      committedUserTurnId: "u2",
      userMessageCount: 2,
      priorMessages: [
        { id: "u1", role: "user", message: "Hi" },
        { id: "a1", role: "assistant", message: "Hello." },
      ],
      wantsChinese: false,
    });
    expect(t2.state).toBe("eligible");
    expect(t2.systemAppendix.length).toBeGreaterThan(0);
    expect(t2.suppressSecondaryLayers).toBe(true);
  });

  it("prevents duplicate render after prior FMI", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    delete process.env.VERCEL_ENV;

    const prior = [
      {
        id: "u1",
        role: "user",
        message: "Earlier reflective turn",
      },
      {
        id: "a1",
        role: "assistant",
        message: "Prior mild clarification.",
        metadata: {
          wisewave_p1_fmi: {
            rendered: true,
            state: "rendered",
            committed_user_turn_id: "u1",
          },
        },
      },
    ];
    expect(conversationHasFMIRendered(prior)).toBe(true);

    const turn = computeP1FirstMildInsightTurn({
      userMessage:
        "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse.",
      conversationId: "c1",
      committedUserTurnId: "u2",
      userMessageCount: 2,
      priorMessages: prior,
      wantsChinese: false,
    });
    expect(turn.state).toBe("suppressed_out_of_scope");
  });

  it("reuses eligibility from assistant metadata for same committed turn", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    delete process.env.VERCEL_ENV;

    const turn = computeP1FirstMildInsightTurn({
      userMessage:
        "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse.",
      conversationId: "c1",
      committedUserTurnId: "u1",
      userMessageCount: 1,
      priorMessages: [
        {
          id: "a0",
          role: "assistant",
          message: "retry stub",
          metadata: {
            wisewave_p1_fmi: {
              state: "deferred_insufficient_signal",
              rendered: false,
              committed_user_turn_id: "u1",
            },
          },
        },
      ],
      wantsChinese: false,
    });
    expect(turn.state).toBe("deferred_insufficient_signal");
    expect(turn.eligibilityReused).toBe(true);
  });

  it("finalizes rendered only when validator passes", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    delete process.env.VERCEL_ENV;

    const base = computeP1FirstMildInsightTurn({
      userMessage:
        "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse.",
      conversationId: "c1",
      committedUserTurnId: "u1",
      userMessageCount: 1,
      priorMessages: [],
      wantsChinese: false,
    });
    expect(base.state).toBe("eligible");

    const good = finalizeFMIAfterGeneration({
      turn: base,
      userMessage: base.debug.committed_user_turn_id
        ? "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse."
        : "",
      assistantMessage:
        "The avoidance may not be the hardest part. What seems heavier is the meaning you attach to knowing better now.",
      safetyOverrideActive: false,
    });
    expect(good.rendered).toBe(true);
    expect(good.state).toBe("rendered");

    const bad = finalizeFMIAfterGeneration({
      turn: base,
      userMessage:
        "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse.",
      assistantMessage: "You should take one small step today and stop judging yourself.",
      safetyOverrideActive: false,
    });
    expect(bad.rendered).toBe(false);
    expect(bad.suppressionReason).toBe("validator_failed_use_baseline");
  });

  it("post-generation safety suppresses FMI", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    delete process.env.VERCEL_ENV;

    const base = computeP1FirstMildInsightTurn({
      userMessage:
        "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse.",
      conversationId: "c1",
      committedUserTurnId: "u1",
      userMessageCount: 1,
      priorMessages: [],
      wantsChinese: false,
    });

    const out = finalizeFMIAfterGeneration({
      turn: base,
      userMessage: "x",
      assistantMessage: "mild text may seem lighter.",
      safetyOverrideActive: true,
    });
    expect(out.state).toBe("suppressed_safety");
    expect(out.rendered).toBe(false);
  });

  it("ZH appendix is used when wantsChinese", () => {
    process.env.ENABLE_P1_FIRST_MILD_INSIGHT = "1";
    delete process.env.VERCEL_ENV;
    const turn = computeP1FirstMildInsightTurn({
      userMessage:
        "我知道该怎么做，可是一直拖着不做，而且正因为明白了，才觉得更难受。",
      conversationId: "c1",
      committedUserTurnId: "u1",
      userMessageCount: 1,
      priorMessages: [],
      wantsChinese: true,
    });
    expect(turn.state).toBe("eligible");
    expect(turn.systemAppendix).toContain("P1-FMI");
    expect(turn.systemAppendix).toContain("主回应");
  });
});
