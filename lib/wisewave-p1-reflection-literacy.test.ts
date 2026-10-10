import { afterEach, describe, expect, it } from "vitest";
import { classifyFMIInput } from "@/lib/wisewave-p1-first-mild-insight";
import {
  buildP1ReflectionLiteracyDebugFields,
  computeP1ReflectionLiteracyTurn,
  detectAbstractSelfExplanation,
  literacyCopyContainsProhibited,
  P1_FRL_COPY_ABSTRACT_EN,
  P1_FRL_COPY_ABSTRACT_ZH,
  P1_FRL_COPY_ADVICE_EN,
  P1_FRL_COPY_ADVICE_ZH,
  P1_FRL_PHASE1_NO_PERSISTENCE,
  P1_REFLECTION_LITERACY_BUILD_MARKER,
  resolveP1ReflectionLiteracyEnablement,
} from "@/lib/wisewave-p1-reflection-literacy";

const ENV_KEYS = [
  "ENABLE_P1_REFLECTION_LITERACY",
  "P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW",
  "VERCEL_ENV",
] as const;

const saved: Partial<Record<(typeof ENV_KEYS)[number], string | undefined>> = {};

function stashEnv() {
  for (const k of ENV_KEYS) saved[k] = process.env[k];
}

function restoreEnv() {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
}

function enableLocal() {
  process.env.ENABLE_P1_REFLECTION_LITERACY = "1";
  delete process.env.VERCEL_ENV;
  delete process.env.P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW;
}

const GENUINE_EN =
  "I know what I should do, but I keep avoiding it, and knowing better makes me feel worse.";
const GENUINE_ZH =
  "最近每次开会我都说不出话，回家又反复想自己是不是太软弱了，整个人很沉。";
const ADVICE_TENSION_EN =
  "Should I leave my job? I want to leave because I feel invisible there, but I'm afraid leaving will prove that I could not cope.";
const BARE_ADVICE_EN = "Should I leave my job?";
const BARE_ADVICE_ZH = "我该怎么办？";
/** Short enough that FMI stays low-signal; abstract detector still matches. */
const ABSTRACT_EN = "Why am I always like this?";
const ABSTRACT_ZH = "为什么我总是这样？";

afterEach(() => {
  restoreEnv();
});

describe("P1-FRL enablement", () => {
  it("FRL-01 flag off", () => {
    stashEnv();
    delete process.env.ENABLE_P1_REFLECTION_LITERACY;
    delete process.env.VERCEL_ENV;
    const e = resolveP1ReflectionLiteracyEnablement();
    expect(e.enabled).toBe(false);
    expect(e.flagSet).toBe(false);
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("flag_off");
    expect(r.reframeApplied).toBe(false);
    expect(r.systemAppendix).toBe("");
  });

  it("FRL-02 Production hard-block", () => {
    stashEnv();
    process.env.ENABLE_P1_REFLECTION_LITERACY = "1";
    process.env.VERCEL_ENV = "production";
    const e = resolveP1ReflectionLiteracyEnablement();
    expect(e.blockedOnProduction).toBe(true);
    expect(e.enabled).toBe(false);
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("flag_off");
    expect(r.reframeApplied).toBe(false);
  });

  it("Preview blocked without allow key", () => {
    stashEnv();
    process.env.ENABLE_P1_REFLECTION_LITERACY = "1";
    process.env.VERCEL_ENV = "preview";
    delete process.env.P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW;
    const e = resolveP1ReflectionLiteracyEnablement();
    expect(e.blockedOnPreview).toBe(true);
    expect(e.enabled).toBe(false);
  });

  it("Preview unlocks with allow key (Founder B 2026-10-11)", () => {
    stashEnv();
    process.env.ENABLE_P1_REFLECTION_LITERACY = "1";
    process.env.VERCEL_ENV = "preview";
    process.env.P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW = "1";
    const e = resolveP1ReflectionLiteracyEnablement();
    expect(e.blockedOnPreview).toBe(false);
    expect(e.allowHostedPreviewSet).toBe(true);
    expect(e.enabled).toBe(true);
  });

  it("Production stays hard-blocked even with Preview allow", () => {
    stashEnv();
    process.env.ENABLE_P1_REFLECTION_LITERACY = "1";
    process.env.VERCEL_ENV = "production";
    process.env.P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW = "1";
    const e = resolveP1ReflectionLiteracyEnablement();
    expect(e.blockedOnProduction).toBe(true);
    expect(e.enabled).toBe(false);
  });
});

describe("P1-FRL evaluator", () => {
  it("FRL-03 safety EN/ZH", () => {
    stashEnv();
    enableLocal();
    for (const [msg, zh] of [
      ["I want to kill myself", false],
      ["我想自杀", true],
    ] as const) {
      const r = computeP1ReflectionLiteracyTurn({
        userMessage: msg,
        userTurnIndex: 1,
        priorUserMessages: [],
        wantsChinese: zh,
        safetyOverrideActive: true,
      });
      expect(r.state).toBe("safety");
      expect(r.reframeApplied).toBe(false);
      expect(r.withholdP0ModeAppendix).toBe(false);
    }
  });

  it("FRL-04 genuine EN bypass", () => {
    stashEnv();
    enableLocal();
    const c = classifyFMIInput(GENUINE_EN);
    expect(c.inputType).toBe("self_expression");
    expect(c.signalStrength === "medium" || c.signalStrength === "high").toBe(true);
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: GENUINE_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("clear_genuine_expression");
    expect(r.reframeApplied).toBe(false);
    expect(r.withholdP0ModeAppendix).toBe(false);
  });

  it("FRL-05 genuine ZH bypass", () => {
    stashEnv();
    enableLocal();
    const c = classifyFMIInput(GENUINE_ZH);
    expect(c.inputType === "self_expression" || c.inputType === "story").toBe(true);
    expect(c.signalStrength === "medium" || c.signalStrength === "high").toBe(true);
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: GENUINE_ZH,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: true,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("clear_genuine_expression");
    expect(r.reframeApplied).toBe(false);
  });

  it("FRL-06 advice + tension bypass", () => {
    stashEnv();
    enableLocal();
    const c = classifyFMIInput(ADVICE_TENSION_EN);
    expect(c.inputType).toBe("self_expression");
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: ADVICE_TENSION_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("clear_genuine_expression");
    expect(r.reframeApplied).toBe(false);
  });

  it("FRL-07 bare advice EN", () => {
    stashEnv();
    enableLocal();
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("advice_seeking");
    expect(r.reframeApplied).toBe(true);
    expect(r.withholdP0ModeAppendix).toBe(true);
    expect(r.systemAppendix).toContain(P1_FRL_COPY_ADVICE_EN);
  });

  it("FRL-08 bare advice ZH", () => {
    stashEnv();
    enableLocal();
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_ZH,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: true,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("advice_seeking");
    expect(r.reframeApplied).toBe(true);
    expect(r.systemAppendix).toContain(P1_FRL_COPY_ADVICE_ZH);
  });

  it("FRL-09 abstract EN", () => {
    stashEnv();
    enableLocal();
    expect(detectAbstractSelfExplanation(ABSTRACT_EN)).toBe(true);
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: ABSTRACT_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("abstract_self_explanation");
    expect(r.reframeApplied).toBe(true);
    expect(r.systemAppendix).toContain(P1_FRL_COPY_ABSTRACT_EN);
  });

  it("FRL-10 abstract ZH", () => {
    stashEnv();
    enableLocal();
    expect(detectAbstractSelfExplanation(ABSTRACT_ZH)).toBe(true);
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: ABSTRACT_ZH,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: true,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("abstract_self_explanation");
    expect(r.reframeApplied).toBe(true);
    expect(r.systemAppendix).toContain(P1_FRL_COPY_ABSTRACT_ZH);
  });

  it("FRL-11 greeting baseline", () => {
    stashEnv();
    enableLocal();
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: "Hi",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("low_signal");
    expect(r.reframeApplied).toBe(false);
  });

  it("FRL-12 utilitarian baseline", () => {
    stashEnv();
    enableLocal();
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: "What time is it in Sydney?",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("low_signal");
    expect(r.reframeApplied).toBe(false);
  });

  it("FRL-13 turn 3 out-of-window", () => {
    stashEnv();
    enableLocal();
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 3,
      priorUserMessages: ["Hi", "Still thinking."],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("out_of_window");
    expect(r.reframeApplied).toBe(false);
  });

  it("FRL-14 turn 2 after genuine", () => {
    stashEnv();
    enableLocal();
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 2,
      priorUserMessages: [GENUINE_EN],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.state).toBe("out_of_window");
    expect(r.debug.prior_genuine).toBe(true);
    expect(r.reframeApplied).toBe(false);
  });

  it("FRL-15 FMI classify path unchanged under literacy-on", () => {
    stashEnv();
    enableLocal();
    const before = classifyFMIInput(BARE_ADVICE_EN);
    computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    const after = classifyFMIInput(BARE_ADVICE_EN);
    expect(after).toEqual(before);
    expect(after.inputType).toBe("advice_seeking");
  });

  it("FRL-16 no P1.1 / prohibited copy", () => {
    stashEnv();
    enableLocal();
    for (const copy of [
      P1_FRL_COPY_ADVICE_EN,
      P1_FRL_COPY_ADVICE_ZH,
      P1_FRL_COPY_ABSTRACT_EN,
      P1_FRL_COPY_ABSTRACT_ZH,
    ]) {
      expect(literacyCopyContainsProhibited(copy)).toBe(false);
      expect(/\?|？/.test(copy)).toBe(false);
    }
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(literacyCopyContainsProhibited(r.systemAppendix)).toBe(false);
  });

  it("FRL-17 no persistence helper", () => {
    expect(P1_FRL_PHASE1_NO_PERSISTENCE).toBe(true);
    expect(
      Object.keys(
        // Named exports only — no persist / metadata builders in Phase 1.
        {
          buildP1ReflectionLiteracyDebugFields,
          computeP1ReflectionLiteracyTurn,
          resolveP1ReflectionLiteracyEnablement,
        }
      )
    ).not.toContain("buildFRLMessageMetadata");
  });

  it("FRL-18 P0 mode withheld only when literacy applies", () => {
    stashEnv();
    enableLocal();
    const on = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(on.reframeApplied).toBe(true);
    expect(on.withholdP0ModeAppendix).toBe(true);

    const off = computeP1ReflectionLiteracyTurn({
      userMessage: GENUINE_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(off.reframeApplied).toBe(false);
    expect(off.withholdP0ModeAppendix).toBe(false);
  });

  it("FRL-19 at most one literacy reframe in first-use window", () => {
    stashEnv();
    enableLocal();
    const t1 = computeP1ReflectionLiteracyTurn({
      userMessage: "Hi",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(t1.reframeApplied).toBe(false);
    const t2 = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 2,
      priorUserMessages: ["Hi"],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(t2.reframeApplied).toBe(true);

    // After advice on turn 1, turn 2 is out of window (prior not greeting/writing).
    const afterAdvice = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_ZH,
      userTurnIndex: 2,
      priorUserMessages: [BARE_ADVICE_EN],
      wantsChinese: true,
      safetyOverrideActive: false,
    });
    expect(afterAdvice.reframeApplied).toBe(false);
    expect(afterAdvice.state).toBe("out_of_window");
  });

  it("FRL-20 P0 withhold false when literacy does not apply", () => {
    stashEnv();
    enableLocal();
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: "Hi",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    expect(r.withholdP0ModeAppendix).toBe(false);
  });

  it("FRL-21 debug fields are response-shaped only", () => {
    stashEnv();
    enableLocal();
    const r = computeP1ReflectionLiteracyTurn({
      userMessage: BARE_ADVICE_EN,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
      safetyOverrideActive: false,
    });
    const fields = buildP1ReflectionLiteracyDebugFields(r);
    for (const key of Object.keys(fields)) {
      expect(key.startsWith("debug_p1_frl_")).toBe(true);
    }
    expect(fields.debug_p1_frl_build_marker).toBe(P1_REFLECTION_LITERACY_BUILD_MARKER);
    expect(JSON.stringify(fields)).not.toMatch(/wisewave_p1_frl/);
  });
});
