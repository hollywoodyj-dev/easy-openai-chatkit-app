import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization ?? "";
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (!token) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const userId = verifyUserToken(token);
    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sub = user.subscriptions[0];
    if (!sub) {
      return res.status(400).json({ error: "No subscription to cancel" });
    }

    if (sub.status === "canceled" || sub.status === "expired") {
      return res.status(200).json({
        success: true,
        subscription: sub,
        message: "Subscription already canceled or expired",
      });
    }

    const updated = await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status: "canceled",
      },
    });

    return res.status(200).json({
      success: true,
      subscription: updated,
      message:
        "Your WiseWave access will not renew. To stop future billing, also cancel via your payment provider (PayPal or Google Play).",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[api/subscription/cancel] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

