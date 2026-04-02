import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";
import { verifyUserToken } from "@/lib/auth";
import { checkUserSubscriptionAccess } from "@/lib/subscription-access";

export const dynamic = "force-dynamic";

/**
 * Option B session: create only a DB conversation (no ChatKit/OpenAI session).
 * Returns { session_id } for use with POST /api/chat/turn and GET /api/chat/messages.
 * Same identity as create-session (Bearer or cookie).
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;
  if (bearerToken) {
    const verifiedUserId = verifyUserToken(bearerToken);
    if (!verifiedUserId) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
    const access = await checkUserSubscriptionAccess(verifiedUserId);
    if (!access.hasAccess) {
      return NextResponse.json(
        {
          error: "Subscription required",
          code: "subscription_required",
          effective_status: access.effectiveStatus,
        },
        { status: 402 }
      );
    }
  }

  const { userId, sessionCookie } = await resolveChatUserId(request);
  let conversation;
  try {
    conversation = await prisma.conversation.create({
      data: { userId },
    });
  } catch (e) {
    console.error("[api/chat/session] prisma.conversation.create failed", e);
    const localHint =
      "Local dev: set DATABASE_URL in .env.local to a reachable PostgreSQL URL, then run `npx prisma migrate deploy` (or `npx prisma db push`). Ensure Postgres is running (e.g. Docker or Neon/Supabase connection string).";
    const hostedHint =
      "Hosted: verify DATABASE_URL in the deployment environment and that the DB accepts connections from Vercel/your host.";
    return NextResponse.json(
      {
        error: "db_unreachable",
        message: `Database connection failed while creating a chat session. ${
          process.env.VERCEL ? hostedHint : localHint
        }`,
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
