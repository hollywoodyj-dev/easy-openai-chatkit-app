import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";

async function requireAdmin(req: NextApiRequest) {
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return { error: { status: 401, message: "Missing Authorization header" as const } } as const;
  }

  const userId = verifyUserToken(token);
  if (!userId) {
    return { error: { status: 401, message: "Invalid or expired token" as const } } as const;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return { error: { status: 500, message: "ADMIN_EMAIL is not configured" as const } } as const;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user || user.email !== adminEmail) {
    return { error: { status: 403, message: "Forbidden" as const } } as const;
  }

  return { adminUserId: user.id } as const;
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
    if ("error" in auth) {
      const { status, message } = auth.error;
      return res.status(status).json({ error: message });
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

