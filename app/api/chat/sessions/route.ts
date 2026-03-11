import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";

export const dynamic = "force-dynamic";

const TOPIC_MAX_LENGTH = 60;
const MAX_SESSIONS = 50;

/**
 * GET: list current user's conversations (chat history) with topic preview.
 * Returns { sessions: [{ id, created_at, topic }] }.
 */
export async function GET(request: Request) {
  const { userId } = await resolveChatUserId(request);

  const conversations = await prisma.conversation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: MAX_SESSIONS,
    select: {
      id: true,
      createdAt: true,
      messages: {
        where: { role: "user" },
        orderBy: { createdAt: "asc" },
        take: 1,
        select: { message: true },
      },
    },
  });

  const sessions = conversations.map((c) => {
    const firstUser = c.messages[0]?.message?.trim();
    const topic =
      firstUser && firstUser.length > 0
        ? firstUser.length <= TOPIC_MAX_LENGTH
          ? firstUser
          : firstUser.slice(0, TOPIC_MAX_LENGTH) + "…"
        : "New conversation";
    return {
      id: c.id,
      created_at: c.createdAt.toISOString(),
      topic,
    };
  });

  return NextResponse.json({ sessions });
}
