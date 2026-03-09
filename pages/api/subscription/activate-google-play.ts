import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";
import type { PlanId } from "@/lib/subscription-plans";

/**
 * Activate a Google Play subscription after purchase in the mobile app.
 *
 * NOTE: For production use, you MUST verify the purchaseToken with the
 * Google Play Developer API before trusting it. This handler currently
 * trusts the client token and only approximates the billing period.
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
    const authHeader = req.headers.authorization ?? "";
    const bearer =
      authHeader.toLowerCase().startsWith("bearer ")
        ? authHeader.slice(7).trim()
        : null;

    if (!bearer) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const userId = verifyUserToken(bearer);
    if (!userId) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { purchaseToken, productId, plan } = req.body ?? {};
    if (!purchaseToken || typeof purchaseToken !== "string") {
      return res.status(400).json({ error: "purchaseToken is required" });
    }

    const planId: PlanId = plan === "yearly" ? "yearly" : "monthly";

    const now = new Date();
    const currentPeriodStart = now;
    const currentPeriodEnd = new Date(now);
    if (planId === "monthly") {
      currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
    } else {
      currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.subscriptions[0]) {
      await prisma.subscription.update({
        where: { id: user.subscriptions[0].id },
        data: {
          status: "active",
          plan: planId,
          platform: "google_play",
          currentPeriodStart,
          currentPeriodEnd,
          externalSubscriptionId: purchaseToken,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          status: "active",
          plan: planId,
          platform: "google_play",
          currentPeriodStart,
          currentPeriodEnd,
          externalSubscriptionId: purchaseToken,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Google Play subscription activated (server-side).",
      productId,
      plan: planId,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[activate-google-play-subscription] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

