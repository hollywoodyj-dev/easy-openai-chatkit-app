import { NextResponse } from "next/server";
import { verifyUserToken } from "@/lib/auth";
import { checkUserSubscriptionAccess } from "@/lib/subscription-access";

export const dynamic = "force-dynamic";

/**
 * GET: Check if the request has a valid Bearer token.
 * - No Authorization header: 200 (anonymous chat is allowed).
 * - Valid Bearer token: 200.
 * - Invalid or expired Bearer token: 401.
 * Used by /chat to show invalid-token recovery UI when token is in URL but invalid.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const userId = verifyUserToken(token);
  if (userId) {
    const access = await checkUserSubscriptionAccess(userId);
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
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  return NextResponse.json(
    { error: "Invalid or expired sign-in link" },
    { status: 401 }
  );
}
