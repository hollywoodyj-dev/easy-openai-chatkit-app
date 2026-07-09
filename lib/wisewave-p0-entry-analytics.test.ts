import { describe, expect, it } from "vitest";
import {
  planP0EntryAnalyticsEvents,
  P0_ENTRY_ANALYTICS_EVENT_NAMES,
} from "@/lib/wisewave-p0-entry-analytics";
import type { P0ReflectionEntryTurnResult } from "@/lib/wisewave-p0-reflection-entry";
import { computeP0ReflectionEntryTurn } from "@/lib/wisewave-p0-reflection-entry";

function baseP0Entry(
  overrides: Partial<P0ReflectionEntryTurnResult> = {}
): P0ReflectionEntryTurnResult {
  return {
    enabled: true,
    buildMarker: "p0_reflection_entry_v1_slice1_qa2",
    safetyOverride: false,
    safetyMatchedPattern: null,
    slashCommand: null,
    openingType: "greeting",
    openingConfidence: "high",
    reflectionMode: "mirror",
    entryPhase: true,
    reflectionBegun: false,
    modeApplied: true,
    modeCleared: false,
    systemAppendix: "",
    ...overrides,
  };
}

describe("planP0EntryAnalyticsEvents", () => {
  it("returns no events when P0 is disabled", () => {
    expect(
      planP0EntryAnalyticsEvents({
        userTurnIndex: 1,
        responseLang: "en",
        p0Entry: baseP0Entry({ enabled: false }),
      })
    ).toEqual([]);
  });

  it("plans turn-1 greeting entry events", () => {
    const events = planP0EntryAnalyticsEvents({
      userTurnIndex: 1,
      responseLang: "en",
      p0Entry: baseP0Entry(),
    });
    expect(events.map((e) => e.eventName)).toEqual([
      "conversation_started",
      "entry_type_detected",
      "reflection_mode_selected",
    ]);
    expect(events[1].metadata.opening_type).toBe("greeting");
    expect(events[2].metadata.mode).toBe("mirror");
    expect(events[1].metadata).not.toHaveProperty("message");
  });

  it("plans slash command event", () => {
    const events = planP0EntryAnalyticsEvents({
      userTurnIndex: 1,
      responseLang: "en",
      p0Entry: baseP0Entry({
        slashCommand: "slow",
        reflectionMode: "slow",
      }),
    });
    expect(events.some((e) => e.eventName === "slash_command_used")).toBe(true);
    expect(
      events.find((e) => e.eventName === "slash_command_used")?.metadata.slash_command
    ).toBe("slow");
  });

  it("plans reflection transition on turn 2 begun", () => {
    const events = planP0EntryAnalyticsEvents({
      userTurnIndex: 2,
      responseLang: "zh",
      p0Entry: baseP0Entry({
        openingType: "emotional_opening",
        reflectionMode: null,
        modeApplied: false,
        reflectionBegun: true,
        modeCleared: true,
        entryPhase: true,
      }),
    });
    expect(events.map((e) => e.eventName)).toContain("conversation_entered_reflection");
    expect(events.map((e) => e.eventName)).toContain("reflection_started");
    expect(events.find((e) => e.eventName === "reflection_started")?.metadata.lang).toBe("zh");
  });

  it("plans depth event on turn 3+", () => {
    const events = planP0EntryAnalyticsEvents({
      userTurnIndex: 3,
      responseLang: "en",
      p0Entry: baseP0Entry({
        reflectionBegun: true,
        modeApplied: false,
        modeCleared: true,
        reflectionMode: null,
      }),
    });
    expect(events.map((e) => e.eventName)).toContain("reflection_depth_reached");
  });

  it("skips reflection transition on safety override", () => {
    const events = planP0EntryAnalyticsEvents({
      userTurnIndex: 1,
      responseLang: "en",
      p0Entry: baseP0Entry({
        safetyOverride: true,
        reflectionMode: null,
        modeApplied: false,
        openingType: "unknown",
      }),
    });
    expect(events.map((e) => e.eventName)).not.toContain("reflection_mode_selected");
    expect(events.map((e) => e.eventName)).not.toContain("reflection_started");
  });

  it("integrates with computeP0ReflectionEntryTurn", () => {
    process.env.ENABLE_P0_REFLECTION_ENTRY = "1";
    const result = computeP0ReflectionEntryTurn({
      userMessage: "Hi",
      userTurnIndex: 1,
      priorUserMessages: [],
      wantsChinese: false,
    });
    const events = planP0EntryAnalyticsEvents({
      userTurnIndex: 1,
      responseLang: "en",
      p0Entry: result,
    });
    expect(events.length).toBeGreaterThan(0);
    delete process.env.ENABLE_P0_REFLECTION_ENTRY;
  });

  it("catalog event names are stable", () => {
    expect(P0_ENTRY_ANALYTICS_EVENT_NAMES).toContain("entry_type_detected");
    expect(P0_ENTRY_ANALYTICS_EVENT_NAMES).toContain("conversation_started");
  });
});
