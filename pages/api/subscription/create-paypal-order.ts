import type { NextApiRequest, NextApiResponse } from "next";
import { verifyUserToken } from "@/lib/auth";
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/subscription-plans";

const PAYPAL_API_BASE =
  process.env.PAYPAL_SANDBOX === "true"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";

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

    const { plan } = req.body ?? {};
    const planId = (plan === "yearly" ? "yearly" : "monthly") as PlanId;
    const planConfig = SUBSCRIPTION_PLANS[planId];

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    if (!clientId || !clientSecret) {
      return res.status(501).json({
        error: "PayPal not configured",
        message: "Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in Vercel.",
      });
    }

    const accessTokenRes = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!accessTokenRes.ok) {
      const err = await accessTokenRes.text();
      console.error("[create-paypal-order] token error", err);
      return res.status(500).json({ error: "PayPal auth failed" });
    }

    const { access_token } = (await accessTokenRes.json()) as { access_token: string };
    const returnUrl = `${baseUrl}/subscribe/return?state=${encodeURIComponent(token)}&plan=${planId}`;
    const cancelUrl = `${baseUrl}/subscribe?canceled=1`;

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: String(planConfig.price),
          },
          description: `WiseWave ${planConfig.name} subscription`,
        },
      ],
      application_context: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
        brand_name: "WiseWave",
      },
    };

    const orderRes = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!orderRes.ok) {
      const err = await orderRes.text();
      console.error("[create-paypal-order] order error", err);
      return res.status(500).json({ error: "Failed to create PayPal order" });
    }

    const order = (await orderRes.json()) as {
      id: string;
      links?: Array<{ rel: string; href: string }>;
    };
    const approveLink = order.links?.find((l) => l.rel === "approve");

    if (!approveLink?.href) {
      return res.status(500).json({ error: "No approval URL from PayPal" });
    }

    return res.status(200).json({
      orderId: order.id,
      approvalUrl: approveLink.href,
    });
  } catch (error) {
    console.error("[create-paypal-order] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
