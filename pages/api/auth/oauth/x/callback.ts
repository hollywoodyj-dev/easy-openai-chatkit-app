import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { signUserToken } from "@/lib/auth";
import { decodeState } from "@/lib/pkce";

/**
 * X (Twitter) OAuth 2.0 callback handler with PKCE
 * Exchanges code for token and fetches user info
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, error, state } = req.query;

  if (error) {
    return res.redirect(
      `/login?error=${encodeURIComponent("OAuth authentication failed")}`
    );
  }

  if (!code || typeof code !== "string") {
    return res.redirect(
      `/login?error=${encodeURIComponent("Missing authorization code")}`
    );
  }

  const parsedState = typeof state === "string" ? decodeState(state) : null;
  if (!parsedState) {
    return res.redirect(
      `/login?error=${encodeURIComponent("Invalid state")}`
    );
  }

  const { flow, codeVerifier } = parsedState;
  const isMobile = flow === "mobile";

  try {
    const callbackBaseUrl =
      process.env.OAUTH_CALLBACK_BASE_URL ||
      "https://wisewave-chatkit-app-v2.vercel.app";
    const redirectUri = `${callbackBaseUrl}/api/auth/oauth/x/callback`;

    const clientId = process.env.X_CLIENT_ID;
    const clientSecret = process.env.X_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("X OAuth not configured");
    }

    // Exchange authorization code for access token (PKCE)
    const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[oauth/x/callback] token exchange failed", errorText);
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Fetch user info (id, name; email if granted)
    const userResponse = await fetch(
      "https://api.twitter.com/2/users/me?user.fields=id,name,profile_image_url",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errText = await userResponse.text();
      console.error("[oauth/x/callback] users/me failed", errText);
      throw new Error("Failed to fetch user info");
    }

    const userData = await userResponse.json();
    const xId = userData?.data?.id;
    const name = userData?.data?.name;

    if (!xId) {
      throw new Error("User ID not provided by X");
    }

    // X may not return email; use a unique placeholder for DB
    const email = `x_${xId}@users.noreply.x.com`;

    // Create or update user in database
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            oauthProvider: "x",
            oauthId: xId,
          },
          { email },
        ],
      },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (user) {
      if (!user.oauthProvider || !user.oauthId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            oauthProvider: "x",
            oauthId: xId,
            name: name || user.name,
          },
          include: {
            subscriptions: {
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        });
      }
    } else {
      const now = new Date();
      const trialEndsAt = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      user = await prisma.user.create({
        data: {
          email,
          name: name || undefined,
          oauthProvider: "x",
          oauthId: xId,
          subscriptions: {
            create: {
              status: "trialing",
              platform: "stripe_web",
              trialEndsAt,
            },
          },
        },
        include: {
          subscriptions: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }

    const token = signUserToken(user.id);

    if (isMobile) {
      return res.redirect(
        `wisewave://oauth/x?token=${encodeURIComponent(token)}`
      );
    }

    return res.redirect(`/embed?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error("[oauth/x/callback] error", error);
    return res.redirect(
      `/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`
    );
  }
}
