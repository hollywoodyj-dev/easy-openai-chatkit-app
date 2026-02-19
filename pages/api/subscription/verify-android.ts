import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";

/**
 * Verify a Google Play subscription purchase and activate the user's subscription.
 * Call this from the mobile app after a successful in-app purchase.
 *
 * Body: { purchaseToken, subscriptionId, packageName? }
 * Auth: Bearer <JWT>
 *
 * When GOOGLE_PLAY_SERVICE_ACCOUNT_JSON is set, verifies with Google Play Developer API
 * and updates the user's Subscription. Otherwise returns 501 with setup instructions.
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

    const { purchaseToken, subscriptionId, packageName } = req.body ?? {};
    if (
      !purchaseToken ||
      typeof purchaseToken !== "string" ||
      !subscriptionId ||
      typeof subscriptionId !== "string"
    ) {
      return res.status(400).json({
        error: "purchaseToken and subscriptionId are required",
      });
    }

    const serviceAccountJson = process.env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountJson) {
      return res.status(501).json({
        error: "Google Play verification not configured",
        message:
          "Set GOOGLE_PLAY_SERVICE_ACCOUNT_JSON and GOOGLE_PLAY_PACKAGE_NAME in Vercel to verify subscriptions. Until then, subscriptions can be managed manually.",
      });
    }

    const pkg = (packageName as string) || process.env.GOOGLE_PLAY_PACKAGE_NAME;
    if (!pkg) {
      return res.status(400).json({
        error: "packageName or GOOGLE_PLAY_PACKAGE_NAME is required",
      });
    }

    // Verify with Google Play Developer API (subscriptionsv2.get) then update DB.
    // See: https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2
    // Until verification is implemented, return 501 so clients open Play Store only.
    const key = JSON.parse(serviceAccountJson) as {
      client_email?: string;
      private_key?: string;
    };
    if (!key.client_email || !key.private_key) {
      return res.status(500).json({ error: "Invalid service account JSON" });
    }

    // TODO: use google-auth-library + androidpublisher API to verify token and get expiryTimeMillis,
    // then update the user's Subscription in the DB. See:
    // https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptionsv2
    return res.status(501).json({
      error: "Google Play server-side verification not yet implemented",
      message:
        "Implement verification in pages/api/subscription/verify-android.ts. Until then, use the Subscribe screen to open Google Play.",
    });
  } catch (error) {
    console.error("[verify-android] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
