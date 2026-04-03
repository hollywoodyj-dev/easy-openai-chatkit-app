import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";

export const dynamic = "force-dynamic";

const MAX_THREADS = 8;

/**
 * GET: recent inner threads for a conversation (V3 — labels from Thread rows, not raw messages).
 * Query: session_id = conversation id
 */
export async function GET(request: Request) {
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

  const threads = await prisma.thread.findMany({
    where: { conversationId: sessionId },
    orderBy: { updatedAt: "desc" },
    take: MAX_THREADS,
    select: {
      id: true,
      label: true,
      isActive: true,
      status: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({
    threads: threads.map((t) => ({
      id: t.id,
      label: t.label?.trim() || "Quiet trace",
      is_active: t.isActive,
      status: t.status,
      updated_at: t.updatedAt.toISOString(),
    })),
  });
}
