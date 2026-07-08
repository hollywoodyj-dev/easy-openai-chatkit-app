import { afterEach, describe, expect, it } from "vitest";
import {
  computeP0ReflectionEntryTurn,
  isP0ReflectionEntryEnabled,
  resolveP0ReflectionEntryEnablement,
} from "@/lib/wisewave-p0-reflection-entry";

describe("computeP0ReflectionEntryTurn", () => {
  const orig = process.env.ENABLE_P0_REFLECTION_ENTRY;

  afterEach(() => {
    if (orig === undefined) delete process.env.ENABLE_P0_REFLECTION_ENTRY;
    else process.env.ENABLE_P0_REFLECTION_ENTRY = orig;
    delete process.env.VERCEL_ENV;
    delete process.env.P0_REFLECTION_ENTRY_ALLOW_PRODUCTION;
  });

  it("is disabled by default", () => {
    delete process.env.ENABLE_P0_REFLECTION_ENTRY;
    delete process.env.VERCEL_ENV;
    delete process.env.P0_REFLECTION_ENTRY_ALLOW_PRODUCTION;
    expect(isP0ReflectionEntryEnabled()).toBe(false);
    const result = computeP0ReflectionEntryTurn({
      userMessage: "Hi",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
    });
    expect(result.enabled).toBe(false);
    expect(result.systemAppendix).toBe("");
  });

  it("applies mirror mode on greeting when enabled", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    const result = computeP0ReflectionEntryTurn({
      userMessage: "Hi",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
    });
    expect(result.openingType).toBe("greeting");
    expect(result.reflectionMode).toBe("mirror");
    expect(result.modeApplied).toBe(true);
    expect(result.reflectionBegun).toBe(false);
  });

  it("applies deepen on turn 1 emotional opening", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    const result = computeP0ReflectionEntryTurn({
      userMessage: "I'm worried that I will not be able to make it",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
    });
    expect(result.openingType).toBe("emotional_opening");
    expect(result.reflectionMode).toBe("deepen");
    expect(result.modeApplied).toBe(true);
    expect(result.reflectionBegun).toBe(false);
  });

  it("clears mode on turn 2 after substantive turn 1", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    const result = computeP0ReflectionEntryTurn({
      userMessage: "It still feels heavy when I think about tomorrow",
      userTurnIndex: 2,
      priorUserMessages: ["I'm worried that I will not be able to make it"],
      wantsChinese: false,
    });
    expect(result.reflectionBegun).toBe(true);
    expect(result.modeApplied).toBe(false);
    expect(result.modeCleared).toBe(true);
  });

  it("uses continue mode on turn 2 after Hi", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    const turn2 = computeP0ReflectionEntryTurn({
      userMessage: "I feel a bit down today",
      userTurnIndex: 2,
      priorUserMessages: ["Hi"],
      wantsChinese: false,
    });
    expect(turn2.reflectionBegun).toBe(true);
    expect(turn2.modeApplied).toBe(false);
  });

  it("applies clarify for question request", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    const result = computeP0ReflectionEntryTurn({
      userMessage: "I need self reflection could you ask me some questions",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
    });
    expect(result.openingType).toBe("question_request");
    expect(result.reflectionMode).toBe("clarify");
    expect(result.modeApplied).toBe(true);
  });

  it("adds document relationship appendix", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    const long = "During my placement at Rickard Road Chemist, Bankstown, ".repeat(12);
    const result = computeP0ReflectionEntryTurn({
      userMessage: long,
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
    });
    expect(result.openingType).toBe("document_upload");
    expect(result.systemAppendix).toContain("relationship-first");
  });

  it("triggers safety override instead of entry mode", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    const result = computeP0ReflectionEntryTurn({
      userMessage: "I want to kill myself",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
    });
    expect(result.safetyOverride).toBe(true);
    expect(result.modeApplied).toBe(false);
    expect(result.systemAppendix).toContain("Safety Override");
  });

  it("parses slash slow command", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    const result = computeP0ReflectionEntryTurn({
      userMessage: "/slow I feel overwhelmed",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
    });
    expect(result.slashCommand).toBe("slow");
    expect(result.reflectionMode).toBe("slow");
  });

  it("blocks production when allow-production key is unset", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    process.env.VERCEL_ENV = "production";
    delete process.env.P0_REFLECTION_ENTRY_ALLOW_PRODUCTION;
    const enablement = resolveP0ReflectionEntryEnablement();
    expect(enablement.flagSet).toBe(true);
    expect(enablement.blockedOnProduction).toBe(true);
    expect(enablement.enabled).toBe(false);
    const result = computeP0ReflectionEntryTurn({
      userMessage: "Hi",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
    });
    expect(result.enabled).toBe(false);
  });

  it("allows production only with explicit allow key", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    process.env.VERCEL_ENV = "production";
    process.env.P0_REFLECTION_ENTRY_ALLOW_PRODUCTION = "1";
    expect(resolveP0ReflectionEntryEnablement().enabled).toBe(true);
  });
});
