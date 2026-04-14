import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";
import jwt from "jsonwebtoken";

const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_ANDROID_PUBLISHER_SCOPE =
  "https://www.googleapis.com/auth/androidpublisher";
const GOOGLE_ANDROID_SUBSCRIPTION_URL =
  "https://androidpublisher.googleapis.com/androidpublisher/v3/applications";

type GoogleServiceAccount = {
  client_email?: string;
  private_key?: string;
};

type GoogleSubscriptionState =
  | "SUBSCRIPTION_STATE_ACTIVE"
  | "SUBSCRIPTION_STATE_CANCELED"
  | "SUBSCRIPTION_STATE_EXPIRED"
  | "SUBSCRIPTION_STATE_IN_GRACE_PERIOD"
  | "SUBSCRIPTION_STATE_ON_HOLD"
  | "SUBSCRIPTION_STATE_PAUSED"
  | string;

type GoogleSubscriptionV2 = {
  subscriptionState?: GoogleSubscriptionState;
  lineItems?: Array<{
    expiryTime?: string;
    autoRenewingPlan?: {
      autoRenewEnabled?: boolean;
    };
  }>;
};

async function getGoogleAccessToken(
  serviceAccount: GoogleServiceAccount
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt.sign(
    {
      iss: serviceAccount.client_email,
      scope: GOOGLE_ANDROID_PUBLISHER_SCOPE,
      aud: GOOGLE_OAUTH_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    },
    serviceAccount.private_key as string,
    { algorithm: "RS256" }
  );

  const tokenRes = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text().catch(() => "");
    throw new Error(`google_oauth_failed:${tokenRes.status}:${body}`);
  }

  const tokenJson = (await tokenRes.json()) as { access_token?: string };
  if (!tokenJson.access_token) {
    throw new Error("google_oauth_missing_access_token");
  }
  return tokenJson.access_token;
}

function mapGoogleStateToSubscriptionStatus(
  state: GoogleSubscriptionState | undefined
): "active" | "canceled" | "expired" {
  if (!state) return "expired";
  if (
    state === "SUBSCRIPTION_STATE_ACTIVE" ||
    state === "SUBSCRIPTION_STATE_IN_GRACE_PERIOD" ||
    state === "SUBSCRIPTION_STATE_ON_HOLD" ||
    state === "SUBSCRIPTION_STATE_PAUSED"
  ) {
    return "active";
  }
  if (state === "SUBSCRIPTION_STATE_CANCELED") {
    return "canceled";
  }
  return "expired";
}

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

    const key = JSON.parse(serviceAccountJson) as GoogleServiceAccount;
    if (!key.client_email || !key.private_key) {
      return res.status(500).json({ error: "Invalid service account JSON" });
    }

    const accessToken = await getGoogleAccessToken(key);
    const verifyUrl = `${GOOGLE_ANDROID_SUBSCRIPTION_URL}/${encodeURIComponent(pkg)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;
    const verifyRes = await fetch(verifyUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!verifyRes.ok) {
      const body = await verifyRes.text().catch(() => "");
      return res.status(400).json({
        error: "Invalid or inaccessible Google Play purchase token",
        details:
          process.env.NODE_ENV !== "production"
            ? `google_verify_failed:${verifyRes.status}:${body}`
            : undefined,
      });
    }

    const verifyJson = (await verifyRes.json()) as GoogleSubscriptionV2;
    const firstLineItem = verifyJson.lineItems?.[0];
    const expiryTime = firstLineItem?.expiryTime ?? null;
    const subscriptionStatus = mapGoogleStateToSubscriptionStatus(
      verifyJson.subscriptionState
    );
    const now = new Date();
    const periodEnd = expiryTime ? new Date(expiryTime) : null;
    const inferredPlan =
      typeof subscriptionId === "string" &&
      subscriptionId.toLowerCase().includes("year")
        ? "yearly"
        : "monthly";

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const data = {
      status: subscriptionStatus,
      plan: inferredPlan as "monthly" | "yearly",
      platform: "google_play" as const,
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      externalSubscriptionId: purchaseToken,
    };

    if (user.subscriptions[0]) {
      await prisma.subscription.update({
        where: { id: user.subscriptions[0].id },
        data,
      });
    } else {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          ...data,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Google Play subscription verified and synced.",
      subscriptionState: verifyJson.subscriptionState ?? null,
      currentPeriodEnd: periodEnd,
      plan: inferredPlan,
      subscriptionId,
    });
  } catch (error) {
    console.error("[verify-android] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
