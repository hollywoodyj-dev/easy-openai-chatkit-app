import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";

export const dynamic = "force-dynamic";

type ContinuityPatternFamily =
  | "earned_value_after_effort"
  | "delayed_reply_means_i_did_something_wrong"
  | "rest_must_be_earned"
  | "constant_pressure_keep_up"
  | "replay_for_mistakes"
  | "fallback_generic";

function detectContinuityPatternFamily(corePattern: string): ContinuityPatternFamily {
  const text = corePattern.trim().toLowerCase();

  // Rest-specific earnedness patterns (e.g. "rest is undeserved", "deserve to rest", "more effort").
  if (
    /rest/.test(text) &&
    /(prove|proof|deserve|undeserved|not enough|more effort)/.test(text)
  ) {
    return "rest_must_be_earned";
  }

  if (
    /even after .*the user tends to interpret their (worth|value) as still needing to be earned/.test(
      text
    ) ||
    /prove (myself|yourself|themselves|your worth)/.test(text) ||
    /earn(ed)? (my|their|your) place/.test(text)
  ) {
    return "earned_value_after_effort";
  }

  if (
    /reply is delayed/.test(text) &&
    /(did something wrong|prove (myself|yourself|themselves) again|must prove)/.test(text)
  ) {
    return "delayed_reply_means_i_did_something_wrong";
  }

  if (/rest.*earned/.test(text) || /pause.*before feeling finished/.test(text)) {
    return "rest_must_be_earned";
  }

  if (/constant pressure/.test(text) || /must always keep up/.test(text) || /always perform/.test(text)) {
    return "constant_pressure_keep_up";
  }

  if (/replay/.test(text) || /did something wrong/.test(text) || /searching for mistakes|missteps/.test(text)) {
    return "replay_for_mistakes";
  }

  return "fallback_generic";
}

/**
 * GET: Latest active insight (continuity) for the current user.
 * Returns { insight: { id, core_pattern, continuity_text, created_at } } or { insight: null }.
 */
export async function GET(request: Request) {
  const { userId } = await resolveChatUserId(request);
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id")?.trim() || null;
  const sessionCreatedAt = sessionId
    ? (
        await prisma.conversation.findFirst({
          where: { id: sessionId, userId },
          select: { createdAt: true },
        })
      )?.createdAt ?? null
    : null;

  const anyPrisma = prisma as unknown as {
    insight?: {
      findFirst: (args: {
        where: {
          userId: string;
          status: string;
          isContinuityEligible?: boolean;
          conversationId?: string | { not: string };
          createdAt?: { lt: Date };
        };
        orderBy: { lastSeenAt: "asc" | "desc" };
        select: {
          id: true;
          corePattern: true;
          continuityText: true;
          createdAt: true;
        };
      }) => Promise<{
        id: string;
        corePattern: string;
        continuityText: string;
        createdAt: Date;
      } | null>;
    };
  };

  if (!anyPrisma.insight || typeof anyPrisma.insight.findFirst !== "function") {
    console.warn(
      "[chat/continuity] prisma.insight delegate not available; returning null continuity"
    );
    console.debug("[ticket7][chat/continuity] load", {
      userId,
      hasInsight: false,
      reason: "delegate_missing",
    });
    return NextResponse.json({ insight: null });
  }

  const latest = await anyPrisma.insight
    .findFirst({
      where: {
        userId,
        status: "active",
        isContinuityEligible: true,
        ...(sessionId ? { conversationId: { not: sessionId } } : {}),
        ...(sessionCreatedAt ? { createdAt: { lt: sessionCreatedAt } } : {}),
      },
      orderBy: { lastSeenAt: "desc" },
      select: {
        id: true,
        corePattern: true,
        continuityText: true,
        createdAt: true,
      },
    })
    .catch((e) => {
      console.warn("[chat/continuity] load failed", e);
      console.debug("[ticket7][chat/continuity] load", {
        userId,
        hasInsight: false,
        reason: "query_error",
      });
      return null;
    });

  if (!latest) {
    console.debug("[ticket7][chat/continuity] load", {
      userId,
      hasInsight: false,
      reason: "none_found",
    });
    return NextResponse.json({ insight: null });
  }

  console.debug("[ticket7][chat/continuity] load", {
    userId,
    hasInsight: true,
    insightId: latest.id,
  });

  return NextResponse.json({
    insight: {
      id: latest.id,
      core_pattern: latest.corePattern,
      continuity_text: latest.continuityText,
      continuity_key: detectContinuityPatternFamily(latest.corePattern),
      created_at: latest.createdAt.toISOString(),
    },
  });
}

