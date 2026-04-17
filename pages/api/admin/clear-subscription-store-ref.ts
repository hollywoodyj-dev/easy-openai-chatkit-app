import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";

type AdminCheckResult =
  | { ok: true; adminUserId: string }
  | { ok: false; status: number; message: string };

async function requireAdmin(req: NextApiRequest): Promise<AdminCheckResult> {
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return { ok: false, status: 401, message: "Missing Authorization header" };
  }

  const userId = verifyUserToken(token);
  if (!userId) {
    return { ok: false, status: 401, message: "Invalid or expired token" };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return { ok: false, status: 500, message: "ADMIN_EMAIL is not configured" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user || user.email !== adminEmail) {
    return { ok: false, status: 403, message: "Forbidden" };
  }

  return { ok: true, adminUserId: user.id };
}

/**
 * Clears externalSubscriptionId on the user's latest subscription row.
 * Use after duplicate Apple testing so the correct Wisewave account can verify again.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return res.status(auth.status).json({ error: auth.message });
    }

    const { userId } = (req.body ?? {}) as { userId?: string };
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required" });
    }

    const latestSub = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!latestSub) {
      return res.status(404).json({ error: "No subscription row for this user" });
    }

    const updated = await prisma.subscription.update({
      where: { id: latestSub.id },
      data: { externalSubscriptionId: null },
    });

    return res.status(200).json({
      subscription: {
        id: updated.id,
        status: updated.status,
        plan: updated.plan,
        platform: updated.platform,
        currentPeriodStart: updated.currentPeriodStart,
        currentPeriodEnd: updated.currentPeriodEnd,
        externalSubscriptionId: updated.externalSubscriptionId,
      },
    });
  } catch (error) {
    console.error("[api/admin/clear-subscription-store-ref] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
