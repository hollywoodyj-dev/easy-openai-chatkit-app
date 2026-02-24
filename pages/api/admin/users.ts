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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return res.status(auth.status).json({ error: auth.message });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const result = users.map((u) => {
      const sub = u.subscriptions[0] ?? null;
      return {
        id: u.id,
        email: u.email,
        createdAt: u.createdAt,
        subscription: sub
          ? {
              id: sub.id,
              status: sub.status,
              plan: sub.plan,
              platform: sub.platform,
              currentPeriodEnd: sub.currentPeriodEnd,
            }
          : null,
      };
    });

    return res.status(200).json({ users: result });
  } catch (error) {
    console.error("[api/admin/users] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

