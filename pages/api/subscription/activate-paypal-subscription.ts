import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";
import type { PlanId } from "@/lib/subscription-plans";

const PAYPAL_API_BASE =
  process.env.PAYPAL_SANDBOX === "true"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

/**
 * Activate a PayPal subscription after user approved via the PayPal button.
 * Verifies the subscription with PayPal, then creates/updates our Subscription record.
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

    const { subscriptionId, plan } = req.body ?? {};
    if (!subscriptionId || typeof subscriptionId !== "string") {
      return res.status(400).json({ error: "subscriptionId is required" });
    }

    const planId = (plan === "yearly" ? "yearly" : "monthly") as PlanId;

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(501).json({ error: "PayPal not configured" });
    }

    const tokenRes = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenRes.ok) {
      return res.status(500).json({ error: "PayPal auth failed" });
    }

    const { access_token } = (await tokenRes.json()) as { access_token: string };

    const subRes = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!subRes.ok) {
      const err = await subRes.text();
      console.error("[activate-paypal-subscription] fetch error", err);
      return res.status(400).json({ error: "Invalid or inaccessible subscription" });
    }

    const subData = (await subRes.json()) as {
      id?: string;
      status?: string;
      billing_info?: { next_billing_time?: string };
    };

    const status = subData.status?.toUpperCase();
    if (status !== "ACTIVE" && status !== "APPROVAL_PENDING") {
      return res.status(400).json({
        error: `Subscription not yet active (status: ${status || "unknown"})`,
      });
    }

    const now = new Date();
    let currentPeriodEnd = new Date(now);
    const nextBilling = subData.billing_info?.next_billing_time;
    if (nextBilling) {
      const parsed = new Date(nextBilling);
      if (!Number.isNaN(parsed.getTime())) {
        currentPeriodEnd = parsed;
      } else if (planId === "monthly") {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      } else {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      }
    } else {
      if (planId === "monthly") {
        currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1);
      } else {
        currentPeriodEnd.setFullYear(currentPeriodEnd.getFullYear() + 1);
      }
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
          platform: "stripe_web",
          currentPeriodStart: now,
          currentPeriodEnd,
          externalSubscriptionId: subscriptionId,
        },
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          status: "active",
          plan: planId,
          platform: "stripe_web",
          currentPeriodStart: now,
          currentPeriodEnd,
          externalSubscriptionId: subscriptionId,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Subscription activated",
    });
  } catch (error) {
    console.error("[activate-paypal-subscription] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
