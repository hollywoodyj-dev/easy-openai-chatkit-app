import { afterEach, describe, expect, it } from "vitest";
import { lintWisewaveOutput } from "@/lib/drift/linter";
import { hasHighSeverityDrift } from "@/lib/drift/score";
import { evaluateChatTurnSafety } from "@/lib/wisewave-chat-turn-boundary";
import {
  S5_EVIDENCE_SOURCE_BUILD_MARKER,
  S5_EXAMPLE_B_EN,
  S5_EXAMPLE_B_USER_EN,
  applyEvidenceSourceNarrowing,
  evaluateEvidenceSourceValidator,
  isS5EvidenceSourceValidatorEnabled,
  resolveS5EvidenceSourceValidatorEnablement,
} from "@/lib/wisewave-evidence-source-validator";

describe("S5 evidence-source validator enablement", () => {
  const origFlag = process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2;
  const origAllow = process.env.EVIDENCE_SOURCE_VALIDATOR_ALLOW_HOSTED_PREVIEW;
  const origPublicVercel = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const origVercel = process.env.VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2;
    else process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2 = origFlag;
    if (origAllow === undefined) {
      delete process.env.EVIDENCE_SOURCE_VALIDATOR_ALLOW_HOSTED_PREVIEW;
    } else {
      process.env.EVIDENCE_SOURCE_VALIDATOR_ALLOW_HOSTED_PREVIEW = origAllow;
    }
    if (origPublicVercel === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = origPublicVercel;
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
  });

  it("defaults off — live rules unchanged", () => {
    delete process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2;
    delete process.env.EVIDENCE_SOURCE_VALIDATOR_ALLOW_HOSTED_PREVIEW;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.VERCEL_ENV;
    expect(isS5EvidenceSourceValidatorEnabled()).toBe(false);
    const live = lintWisewaveOutput(S5_EXAMPLE_B_EN);
    expect(live.violations.some((v) => v.type === "continuity_drift")).toBe(true);
    expect(hasHighSeverityDrift(live)).toBe(true);
  });

  it("enables locally; Preview needs allow key; Production stays hard-blocked", () => {
    process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2 = "1";
    delete process.env.EVIDENCE_SOURCE_VALIDATOR_ALLOW_HOSTED_PREVIEW;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.VERCEL_ENV;
    expect(resolveS5EvidenceSourceValidatorEnablement().enabled).toBe(true);

    process.env.VERCEL_ENV = "preview";
    expect(resolveS5EvidenceSourceValidatorEnablement().enabled).toBe(false);
    expect(resolveS5EvidenceSourceValidatorEnablement().blockedOnPreview).toBe(true);

    process.env.EVIDENCE_SOURCE_VALIDATOR_ALLOW_HOSTED_PREVIEW = "1";
    expect(resolveS5EvidenceSourceValidatorEnablement().enabled).toBe(true);
    expect(resolveS5EvidenceSourceValidatorEnablement().blockedOnPreview).toBe(false);
    expect(resolveS5EvidenceSourceValidatorEnablement().allowHostedPreviewSet).toBe(
      true
    );

    process.env.VERCEL_ENV = "production";
    expect(resolveS5EvidenceSourceValidatorEnablement().enabled).toBe(false);
    expect(resolveS5EvidenceSourceValidatorEnablement().blockedOnProduction).toBe(true);
    expect(S5_EVIDENCE_SOURCE_BUILD_MARKER).toBe(
      "s5_evidence_source_validator_v2_internal"
    );
  });
});

describe("S5 bidirectional source-evidence matrix", () => {
  it("allows Example B when the current turn supports it", () => {
    const r = evaluateEvidenceSourceValidator({
      userMessage: S5_EXAMPLE_B_USER_EN,
      assistantCandidate: S5_EXAMPLE_B_EN,
      sourceContextSupported: true,
    });
    expect(r.verdict).toBe("allow");
    expect(r.family).toBe("evidence_close");
  });

  it("blocks the same present-perfect wording without current-turn evidence", () => {
    const r = evaluateEvidenceSourceValidator({
      userMessage: "",
      assistantCandidate: S5_EXAMPLE_B_EN,
      sourceContextSupported: false,
    });
    expect(r.verdict).toBe("block");
    expect(r.family).toBe("unsupported_present_perfect");
  });

  it("blocks unsupported temporal-span complement", () => {
    const r = evaluateEvidenceSourceValidator({
      userMessage: "",
      assistantCandidate: "You have been trying hard for a long time.",
      sourceContextSupported: false,
    });
    expect(r.verdict).toBe("block");
    expect(r.family).toBe("unsupported_temporal_span");
  });

  it("blocks classic memory claims regardless of tense", () => {
    const en = evaluateEvidenceSourceValidator({
      userMessage: "I have tried so hard",
      assistantCandidate: "As you mentioned before, this has been sitting with you.",
      sourceContextSupported: true,
    });
    expect(en.verdict).toBe("block");
    expect(en.family).toBe("ungrounded_memory_claim");

    const last = evaluateEvidenceSourceValidator({
      userMessage: "hello",
      assistantCandidate: "Last time you were carrying this.",
    });
    expect(last.verdict).toBe("block");

    const remember = evaluateEvidenceSourceValidator({
      userMessage: "hello",
      assistantCandidate: "I remember this pattern.",
    });
    expect(remember.verdict).toBe("block");
  });

  it("does not false-positive evidence-close present perfect / 完成体", () => {
    const en = evaluateEvidenceSourceValidator({
      userMessage: "I have tried so hard",
      assistantCandidate: S5_EXAMPLE_B_EN,
    });
    expect(en.verdict).toBe("allow");

    const zh = evaluateEvidenceSourceValidator({
      userMessage: "我已经很努力了",
      assistantCandidate: "你一直很努力，却还是被说不够。",
    });
    expect(zh.verdict).toBe("allow");
    expect(zh.family).toBe("evidence_close");
  });

  it("blocks ZH unsupported span and memory", () => {
    const span = evaluateEvidenceSourceValidator({
      userMessage: "",
      assistantCandidate: "你一直很努力这些年。",
      sourceContextSupported: false,
    });
    expect(span.verdict).toBe("block");
    expect(span.family).toBe("unsupported_temporal_span");

    const memory = evaluateEvidenceSourceValidator({
      userMessage: "我已经很努力了",
      assistantCandidate: "你上次说过这件事。",
    });
    expect(memory.verdict).toBe("block");
    expect(memory.family).toBe("ungrounded_memory_claim");
  });

  it("narrows live you-have-been lint only when S5 is on and evidence-close", () => {
    const live = lintWisewaveOutput(S5_EXAMPLE_B_EN);
    const result = evaluateEvidenceSourceValidator({
      userMessage: S5_EXAMPLE_B_USER_EN,
      assistantCandidate: S5_EXAMPLE_B_EN,
    });
    const off = applyEvidenceSourceNarrowing({
      enabled: false,
      violations: live.violations,
      result,
    });
    expect(
      off.violations.some((v) => v.type === "continuity_drift")
    ).toBe(true);

    const on = applyEvidenceSourceNarrowing({
      enabled: true,
      violations: live.violations,
      result,
    });
    expect(on.narrowedPresentPerfect).toBe(true);
    expect(
      on.violations.some(
        (v) => v.type === "continuity_drift" && /you have been/i.test(v.matched)
      )
    ).toBe(false);
  });
});

describe("S5 via evaluateChatTurnSafety", () => {
  const origFlag = process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2;
  const origVercel = process.env.VERCEL_ENV;
  const origPublicVercel = process.env.NEXT_PUBLIC_VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2;
    else process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2 = origFlag;
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
    if (origPublicVercel === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = origPublicVercel;
  });

  it("flag off still suppresses Example B (Production delta 0)", () => {
    delete process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2;
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    const safety = evaluateChatTurnSafety({
      userMessage: S5_EXAMPLE_B_USER_EN,
      assistantMessage: S5_EXAMPLE_B_EN,
    });
    expect(safety.shouldSuppress).toBe(true);
    expect(safety.evidenceSource?.enabled).toBe(false);
  });

  it("flag on allows Example B with current-turn evidence", () => {
    process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2 = "1";
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    const safety = evaluateChatTurnSafety({
      userMessage: S5_EXAMPLE_B_USER_EN,
      assistantMessage: S5_EXAMPLE_B_EN,
    });
    expect(safety.shouldSuppress).toBe(false);
    expect(safety.evidenceSource?.enabled).toBe(true);
    expect(safety.evidenceSource?.narrowedPresentPerfect).toBe(true);
  });

  it("flag on still suppresses unsupported span and memory", () => {
    process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2 = "1";
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    const span = evaluateChatTurnSafety({
      userMessage: "",
      assistantMessage: "You have been trying hard for a long time.",
    });
    expect(span.shouldSuppress).toBe(true);

    const memory = evaluateChatTurnSafety({
      userMessage: "I have tried so hard",
      assistantMessage: "As you mentioned before, this has been sitting with you.",
    });
    expect(memory.shouldSuppress).toBe(true);
  });
});
