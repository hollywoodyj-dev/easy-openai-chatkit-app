import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";
import {
  CONTINUE_FETCH_POOL,
  pickContinueOptions,
  shouldSuppressContinueListForLastUserMessage,
} from "@/lib/wisewave-continue-list";

export const dynamic = "force-dynamic";

/** Missing Thread table / migration not applied (Prisma P2021, or Postgres undefined_table). */
function isThreadStorageMissingError(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    return e.code === "P2021";
  }
  if (e instanceof Error) {
    const m = e.message.toLowerCase();
    return (
      m.includes("does not exist") &&
      (m.includes("thread") || m.includes("relation"))
    );
  }
  return false;
}

/**
 * GET: Continue options for a conversation (≤3 distinct unfinished directions; DB: Thread rows).
 * Query: session_id = conversation id
 */
export async function GET(request: Request) {
  try {
    const { userId } = await resolveChatUserId(request);
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id")?.trim() || null;
    if (!sessionId) {
      return NextResponse.json({ error: "session_id required" }, { status: 400 });
    }

    const conv = await prisma.conversation.findFirst({
      where: { id: sessionId, userId },
      select: { id: true },
    });
    if (!conv) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    const lastUser = await prisma.message.findFirst({
      where: { conversationId: sessionId, role: "user" },
      orderBy: { createdAt: "desc" },
      select: { message: true },
    });
    const lastUserText = lastUser?.message?.trim() ?? "";
    if (
      lastUserText.length > 0 &&
      shouldSuppressContinueListForLastUserMessage(lastUserText)
    ) {
      return NextResponse.json({
        threads: [],
        meta: {
          continue_suppressed_last_user_turn: true,
        },
      });
    }

    try {
      const threads = await prisma.thread.findMany({
        where: { conversationId: sessionId },
        orderBy: { updatedAt: "desc" },
        take: CONTINUE_FETCH_POOL,
        select: {
          id: true,
          label: true,
          isActive: true,
          status: true,
          updatedAt: true,
          emotionSignal: true,
          interpretationPattern: true,
          tensionDirection: true,
          intensity: true,
        },
      });

      const byId = new Map(threads.map((t) => [t.id, t]));
      const picked = pickContinueOptions(threads);
      return NextResponse.json({
        threads: picked.map((p) => {
          const row = byId.get(p.id);
          return {
            id: p.id,
            label: p.label,
            is_active: row?.isActive ?? false,
            status: row?.status ?? "active",
            updated_at: row?.updatedAt.toISOString() ?? new Date().toISOString(),
          };
        }),
      });
    } catch (threadErr) {
      console.error("[api/chat/threads GET] prisma.thread.findMany failed", threadErr);
      if (isThreadStorageMissingError(threadErr)) {
        return NextResponse.json({
          threads: [],
          meta: { thread_storage_unavailable: true },
        });
      }
      return NextResponse.json(
        { error: "thread_query_failed", code: "threads_prisma_error" },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error("[api/chat/threads GET] unexpected error", e);
    return NextResponse.json(
      { error: "internal_error", code: "threads_unexpected" },
      { status: 500 }
    );
  }
}

/**
 * POST: Continue — activate one unfinished direction for this conversation (DB: Thread.isActive).
 * Body: { session_id, thread_id } (session_id = conversation id).
 * Does not load or replay transcript; client should not call messages API for this.
 */
export async function POST(request: Request) {
  try {
    const { userId } = await resolveChatUserId(request);
    let body: { session_id?: string; thread_id?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    const sessionId = body.session_id?.trim() || null;
    const threadId = body.thread_id?.trim() || null;
    if (!sessionId || !threadId) {
      return NextResponse.json(
        { error: "session_id and thread_id required" },
        { status: 400 }
      );
    }

    const conv = await prisma.conversation.findFirst({
      where: { id: sessionId, userId },
      select: { id: true },
    });
    if (!conv) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    try {
      const thread = await prisma.thread.findFirst({
        where: { id: threadId, conversationId: sessionId },
        select: { id: true },
      });
      if (!thread) {
        return NextResponse.json({ error: "thread_not_found" }, { status: 404 });
      }

      await prisma.$transaction([
        prisma.thread.updateMany({
          where: { conversationId: sessionId },
          data: { isActive: false },
        }),
        prisma.thread.update({
          where: { id: threadId },
          data: {
            isActive: true,
            status: "active",
            closedAt: null,
          },
        }),
      ]);
    } catch (threadErr) {
      console.error("[api/chat/threads POST] thread operation failed", threadErr);
      if (isThreadStorageMissingError(threadErr)) {
        return NextResponse.json(
          { error: "thread_storage_unavailable", meta: { thread_storage_unavailable: true } },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "thread_update_failed", code: "threads_prisma_error" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      active_thread_id: threadId,
      // Phase 5 instrumentation: lets QA correlate "select Continue" to next-turn latency.
      selected_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error("[api/chat/threads POST] unexpected error", e);
    return NextResponse.json(
      { error: "internal_error", code: "threads_unexpected" },
      { status: 500 }
    );
  }
}
