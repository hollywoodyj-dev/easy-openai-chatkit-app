import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";
import { detectContinuityPatternFamily } from "@/lib/wisewave-continuity-family";

export const dynamic = "force-dynamic";

/**
 * GET: Latest stable continuity insight for the user's **active inner thread**
 * within the given conversation (`session_id` = conversation id).
 *
 * V3: Same rules as `last_insight` sourcing on `POST /api/chat/turn` — no
 * cross-thread carry, no cross-conversation strip. Without `session_id`, returns
 * null (avoids conversation-wide memory-like continuity).
 */
export async function GET(request: Request) {
  const { userId } = await resolveChatUserId(request);
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id")?.trim() || null;

  if (!sessionId) {
    console.debug("[ticket7][chat/continuity] load", {
      userId,
      hasInsight: false,
      reason: "session_id_required",
    });
    return NextResponse.json({ insight: null });
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: sessionId, userId },
    select: { id: true },
  });

  if (!conversation) {
    console.debug("[ticket7][chat/continuity] load", {
      userId,
      hasInsight: false,
      reason: "conversation_not_found",
    });
    return NextResponse.json({ insight: null });
  }

  const activeThread = await prisma.thread.findFirst({
    where: { conversationId: sessionId, isActive: true },
    select: { id: true },
  });

  if (!activeThread) {
    console.debug("[ticket7][chat/continuity] load", {
      userId,
      hasInsight: false,
      reason: "no_active_thread",
    });
    return NextResponse.json({ insight: null });
  }

  const latest = await prisma.insight
    .findFirst({
      where: {
        userId,
        conversationId: sessionId,
        threadId: activeThread.id,
        status: "active",
        isContinuityEligible: true,
        isStable: true,
      },
      orderBy: { createdAt: "desc" },
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
    return NextResponse.json({
      active_inner_thread_id: activeThread.id,
      insight: null,
    });
  }

  console.debug("[ticket7][chat/continuity] load", {
    userId,
    hasInsight: true,
    insightId: latest.id,
  });

  return NextResponse.json({
    active_inner_thread_id: activeThread.id,
    insight: {
      id: latest.id,
      core_pattern: latest.corePattern,
      continuity_text: latest.continuityText,
      continuity_key: detectContinuityPatternFamily(latest.corePattern),
      created_at: latest.createdAt.toISOString(),
    },
  });
}
