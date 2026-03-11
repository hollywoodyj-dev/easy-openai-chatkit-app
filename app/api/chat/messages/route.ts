import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";

export const dynamic = "force-dynamic";

type MessageRole = "user" | "assistant" | "system";

type SingleMessageBody = {
  session_id?: string;
  role?: string;
  message?: string;
  metadata?: unknown;
  insight_tags?: unknown;
};

type BatchMessageItem = {
  role: string;
  message: string;
  metadata?: unknown;
  insight_tags?: unknown;
};

type BatchBody = {
  session_id?: string;
  messages?: BatchMessageItem[];
};

/** POST: persist one message or a batch. Single: { session_id, role, message, metadata?, insight_tags? }. Batch: { session_id, messages: [{ role, message, metadata?, insight_tags? }] } */
export async function POST(request: Request) {
  const { userId, sessionCookie } = await resolveChatUserId(request);
  let body: SingleMessageBody | BatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const sessionId = body.session_id;
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid session_id" },
      { status: 400 }
    );
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: sessionId, userId },
  });
  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found or access denied" },
      { status: 404 }
    );
  }

  const toPersist: { role: MessageRole; message: string; metadata?: object; insightTags?: object }[] = [];

  if ("messages" in body && Array.isArray(body.messages)) {
    for (const item of body.messages as BatchMessageItem[]) {
      const role = item.role as MessageRole | undefined;
      if (!role || !["user", "assistant", "system"].includes(role)) continue;
      if (typeof item.message !== "string") continue;
      toPersist.push({
        role,
        message: item.message,
        metadata: item.metadata !== undefined && item.metadata !== null ? (item.metadata as object) : undefined,
        insightTags: item.insight_tags !== undefined && item.insight_tags !== null ? (item.insight_tags as object) : undefined,
      });
    }
  } else {
    const single = body as SingleMessageBody;
    const role = single.role as MessageRole | undefined;
    if (!role || !["user", "assistant", "system"].includes(role)) {
      return NextResponse.json(
        { error: "Missing or invalid role (user|assistant|system)" },
        { status: 400 }
      );
    }
    if (single.message === undefined || typeof single.message !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid message" },
        { status: 400 }
      );
    }
    toPersist.push({
      role,
      message: single.message,
      metadata: single.metadata !== undefined && single.metadata !== null ? (single.metadata as object) : undefined,
      insightTags: single.insight_tags !== undefined && single.insight_tags !== null ? (single.insight_tags as object) : undefined,
    });
  }

  if (toPersist.length === 0) {
    return NextResponse.json(
      { error: "No valid messages to persist" },
      { status: 400 }
    );
  }

  await prisma.message.createMany({
    data: toPersist.map((p) => ({
      conversationId: sessionId,
      userId,
      role: p.role,
      message: p.message,
      metadata: p.metadata ?? undefined,
      insightTags: p.insightTags ?? undefined,
    })),
  });

  const res = NextResponse.json({ ok: true });
  if (sessionCookie) {
    res.headers.append("Set-Cookie", sessionCookie);
  }
  return res;
}

/** GET: list messages for a conversation. Query: session_id */
export async function GET(request: Request) {
  const { userId } = await resolveChatUserId(request);
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id query parameter" },
      { status: 400 }
    );
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: sessionId, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found or access denied" },
      { status: 404 }
    );
  }

  const messages = conversation.messages.map((m) => ({
    id: m.id,
    role: m.role,
    message: m.message,
    created_at: m.createdAt.toISOString(),
    metadata: m.metadata,
    insight_tags: m.insightTags,
  }));

  return NextResponse.json({ messages });
}
