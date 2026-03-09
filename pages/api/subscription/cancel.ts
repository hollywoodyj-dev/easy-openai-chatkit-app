import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";

const PAYPAL_API_BASE =
  process.env.PAYPAL_SANDBOX === "true"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

async function cancelPaypalSubscription(
  subscriptionId: string
): Promise<{ ok: boolean; message?: string }> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      ok: false,
      message:
        "PayPal is not fully configured on the server. Please cancel directly from your PayPal account to stop billing.",
    };
  }

  try {
    const tokenRes = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenRes.ok) {
      const body = await tokenRes.text().catch(() => "");
      // eslint-disable-next-line no-console
      console.error("[subscription/cancel] PayPal auth failed", {
        status: tokenRes.status,
        body,
      });
      return {
        ok: false,
        message:
          "Could not contact PayPal to stop billing. Please cancel in your PayPal account.",
      };
    }

    const { access_token } = (await tokenRes.json()) as {
      access_token: string;
    };

    const cancelRes = await fetch(
      `${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          reason: "User canceled via WiseWave account page",
        }),
      }
    );

    if (!cancelRes.ok && cancelRes.status !== 204) {
      const body = await cancelRes.text().catch(() => "");
      // eslint-disable-next-line no-console
      console.error("[subscription/cancel] PayPal cancel failed", {
        status: cancelRes.status,
        body,
      });
      return {
        ok: false,
        message:
          "Your WiseWave access is canceled, but we could not cancel the PayPal subscription automatically. Please also cancel in your PayPal account.",
      };
    }

    return {
      ok: true,
      message:
        "Your WiseWave access and PayPal subscription have been canceled. Future billing will stop.",
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[subscription/cancel] PayPal cancel error", error);
    return {
      ok: false,
      message:
        "Your WiseWave access is canceled, but we could not reach PayPal. Please also cancel in your PayPal account.",
    };
  }
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

    let providerMessage: string | undefined;

    // Best-effort provider cancellation
    if (sub.platform === "stripe_web" && sub.externalSubscriptionId) {
      // Web subscriptions currently use PayPal with platform=stripe_web
      const result = await cancelPaypalSubscription(sub.externalSubscriptionId);
      providerMessage = result.message;
    } else if (sub.platform === "google_play" && sub.externalSubscriptionId) {
      // TODO: Implement Google Play Developer API cancellation when service account is configured.
      providerMessage =
        "Your WiseWave access is canceled. To stop future Google Play billing, please cancel the subscription from the Google Play app or play.google.com.";
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
        providerMessage ??
        "Your WiseWave access will not renew. To stop future billing, also cancel via your payment provider (PayPal or Google Play).",
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[api/subscription/cancel] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

