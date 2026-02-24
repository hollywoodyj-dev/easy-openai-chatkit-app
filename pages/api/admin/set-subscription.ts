import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";
import type { SubscriptionStatus } from "@prisma/client";

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

    const { userId, status, activeUntil } = req.body ?? {};

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required" });
    }

    if (
      !status ||
      !["trialing", "active", "canceled", "expired"].includes(status)
    ) {
      return res.status(400).json({ error: "Invalid status" });
    }

    let activeUntilDate: Date | null = null;
    if (activeUntil) {
      const d = new Date(activeUntil);
      if (Number.isNaN(d.getTime())) {
        return res.status(400).json({ error: "Invalid activeUntil date" });
      }
      activeUntilDate = d;
    }

    const latestSub = await prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    let updated;
    if (!latestSub) {
      updated = await prisma.subscription.create({
        data: {
          userId,
          status: status as SubscriptionStatus,
          currentPeriodEnd: activeUntilDate,
        },
      });
    } else {
      updated = await prisma.subscription.update({
        where: { id: latestSub.id },
        data: {
          status: status as SubscriptionStatus,
          currentPeriodEnd: activeUntilDate,
        },
      });
    }

    return res.status(200).json({
      subscription: {
        id: updated.id,
        status: updated.status,
        currentPeriodEnd: updated.currentPeriodEnd,
      },
    });
  } catch (error) {
    console.error("[api/admin/set-subscription] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

