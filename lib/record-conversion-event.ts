import { prisma } from "@/lib/prisma";
import {
  PERSISTED_CONVERSION_EVENT_NAMES,
  type RecordConversionEventInput,
} from "@/lib/wisewave-conversion-tracking";

/** Server-side: persist one conversion event (best-effort, never throws to caller). */
const DEDUPE_ONCE_PER_USER = new Set([
  "signup_completed",
  "first_reflection_started",
  "first_reflection_completed",
  "subscription_completed",
  "checkout_started",
  "day_7_return",
]);

/** P0.7 entry analytics — once per conversation session. */
const DEDUPE_ONCE_PER_SESSION = new Set([
  "entry_type_detected",
  "reflection_mode_selected",
  "conversation_started",
  "reflection_started",
  "conversation_entered_reflection",
  "reflection_depth_reached",
  "conversation_abandoned_before_reflection",
]);

export async function recordConversionEvent(
  input: RecordConversionEventInput,
): Promise<void> {
  if (!PERSISTED_CONVERSION_EVENT_NAMES.has(input.eventName)) {
    return;
  }

  if (DEDUPE_ONCE_PER_USER.has(input.eventName) && input.userId) {
    const existing = await prisma.marketingConversionEvent.findFirst({
      where: { eventName: input.eventName, userId: input.userId },
      select: { id: true },
    });
    if (existing) return;
  }

  if (DEDUPE_ONCE_PER_SESSION.has(input.eventName) && input.sessionId) {
    const existing = await prisma.marketingConversionEvent.findFirst({
      where: { eventName: input.eventName, sessionId: input.sessionId },
      select: { id: true },
    });
    if (existing) return;
  }

  const metadata =
    input.metadata && Object.keys(input.metadata).length > 0
      ? Object.fromEntries(
          Object.entries(input.metadata).filter(
            ([, v]) => v !== null && v !== undefined,
          ),
        )
      : undefined;

  try {
    await prisma.marketingConversionEvent.create({
      data: {
        eventName: input.eventName,
        userId: input.userId ?? null,
        sessionId: input.sessionId ?? null,
        source: input.source ?? null,
        lp: input.lp ?? null,
        adGroup: input.adGroup ?? null,
        platform: input.platform ?? null,
        path: input.path ?? null,
        metadata: metadata ?? undefined,
      },
    });
  } catch (error) {
    console.error("[recordConversionEvent]", input.eventName, error);
  }
}
