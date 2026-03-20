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
  let conversation;
  try {
    conversation = await prisma.conversation.create({
      data: { userId },
    });
  } catch (e) {
    console.error("[api/chat/session] prisma.conversation.create failed", e);
    // This typically means hosted environment can't reach the DB host/port.
    return NextResponse.json(
      {
        error: "db_unreachable",
        message:
          "Database connection failed while creating a chat session. Try again in a moment or check hosted DATABASE_URL/network.",
      },
      { status: 503 }
    );
  }
  const res = NextResponse.json({ session_id: conversation.id });
  if (sessionCookie) {
    res.headers.append("Set-Cookie", sessionCookie);
  }
  return res;
}
