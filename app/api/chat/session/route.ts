import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";

export const dynamic = "force-dynamic";

/**
 * Option B session: create only a DB conversation (no ChatKit/OpenAI session).
 * Returns { session_id } for use with POST /api/chat/turn and GET /api/chat/messages.
 * Same identity as create-session (Bearer or cookie).
 */
export async function POST(request: Request) {
  const { userId, sessionCookie } = await resolveChatUserId(request);
  const conversation = await prisma.conversation.create({
    data: { userId },
  });
  const res = NextResponse.json({ session_id: conversation.id });
  if (sessionCookie) {
    res.headers.append("Set-Cookie", sessionCookie);
  }
  return res;
}
