/**
 * P0.7 — Entry analytics (observation for P1; not optimisation loops).
 * @see docs/Wisewave_Product_Milestone_P0_Reflection_Entry_Implementation_Addendum_v1_LOCKED.md § P0.7
 */

import { recordConversionEvent } from "@/lib/record-conversion-event";
import type { P0ReflectionEntryTurnResult } from "@/lib/wisewave-p0-reflection-entry";

export const P0_ENTRY_ANALYTICS_BUILD_MARKER = "p0_entry_analytics_v1_slice2";

export const P0_ENTRY_ANALYTICS_EVENT_NAMES = [
  "entry_type_detected",
  "reflection_mode_selected",
  "slash_command_used",
  "conversation_started",
  "reflection_started",
  "conversation_entered_reflection",
  "reflection_depth_reached",
] as const;

export type P0EntryAnalyticsEventName = (typeof P0_ENTRY_ANALYTICS_EVENT_NAMES)[number];

export type P0EntryAnalyticsMetadata = {
  opening_type?: string | null;
  opening_confidence?: string | null;
  mode?: string | null;
  slash_command?: string | null;
  lang: "en" | "zh";
  user_turn_index: number;
  safety_override?: boolean;
};

export type P0EntryAnalyticsPlannedEvent = {
  eventName: P0EntryAnalyticsEventName;
  metadata: P0EntryAnalyticsMetadata;
};

export type P0EntryAnalyticsTurnInput = {
  userTurnIndex: number;
  responseLang: "en" | "zh";
  p0Entry: P0ReflectionEntryTurnResult;
};

export function planP0EntryAnalyticsEvents(
  input: P0EntryAnalyticsTurnInput
): P0EntryAnalyticsPlannedEvent[] {
  if (!input.p0Entry.enabled) return [];

  const baseMeta: P0EntryAnalyticsMetadata = {
    lang: input.responseLang,
    user_turn_index: input.userTurnIndex,
    safety_override: input.p0Entry.safetyOverride,
  };

  const events: P0EntryAnalyticsPlannedEvent[] = [];

  if (input.userTurnIndex === 1) {
    events.push({
      eventName: "conversation_started",
      metadata: { ...baseMeta },
    });
  }

  if (input.userTurnIndex === 1 && input.p0Entry.openingType) {
    events.push({
      eventName: "entry_type_detected",
      metadata: {
        ...baseMeta,
        opening_type: input.p0Entry.openingType,
        opening_confidence: input.p0Entry.openingConfidence,
      },
    });
  }

  if (input.p0Entry.slashCommand) {
    events.push({
      eventName: "slash_command_used",
      metadata: {
        ...baseMeta,
        slash_command: input.p0Entry.slashCommand,
      },
    });
  }

  if (input.p0Entry.modeApplied && input.p0Entry.reflectionMode) {
    events.push({
      eventName: "reflection_mode_selected",
      metadata: {
        ...baseMeta,
        opening_type: input.p0Entry.openingType,
        mode: input.p0Entry.reflectionMode,
      },
    });
  }

  if (input.p0Entry.reflectionBegun && !input.p0Entry.safetyOverride) {
    events.push(
      {
        eventName: "conversation_entered_reflection",
        metadata: {
          ...baseMeta,
          opening_type: input.p0Entry.openingType,
          mode: input.p0Entry.reflectionMode,
        },
      },
      {
        eventName: "reflection_started",
        metadata: {
          ...baseMeta,
          opening_type: input.p0Entry.openingType,
        },
      }
    );
  }

  if (
    input.userTurnIndex >= 3 &&
    !input.p0Entry.safetyOverride &&
    (input.p0Entry.reflectionBegun || input.p0Entry.modeCleared)
  ) {
    events.push({
      eventName: "reflection_depth_reached",
      metadata: {
        ...baseMeta,
        opening_type: input.p0Entry.openingType,
        mode: input.p0Entry.reflectionMode,
      },
    });
  }

  return events;
}

export async function recordP0EntryAnalyticsForTurn(args: {
  userId: string;
  sessionId: string;
  responseLang: "en" | "zh";
  p0Entry: P0ReflectionEntryTurnResult;
  userTurnIndex: number;
}): Promise<string[]> {
  const planned = planP0EntryAnalyticsEvents({
    userTurnIndex: args.userTurnIndex,
    responseLang: args.responseLang,
    p0Entry: args.p0Entry,
  });

  const recorded: string[] = [];
  for (const item of planned) {
    await recordConversionEvent({
      eventName: item.eventName,
      userId: args.userId,
      sessionId: args.sessionId,
      source: "p0_entry",
      path: "/api/chat/turn",
      metadata: item.metadata,
    });
    recorded.push(item.eventName);
  }
  return recorded;
}
