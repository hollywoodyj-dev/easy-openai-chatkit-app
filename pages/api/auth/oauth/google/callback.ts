import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { signUserToken } from "@/lib/auth";

/**
 * Google OAuth callback handler
 * This route receives the authorization code from Google and completes the OAuth flow
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

  try {
    const callbackBaseUrl =
      process.env.OAUTH_CALLBACK_BASE_URL ||
      "https://wisewave-chatkit-app-v2.vercel.app";
    const redirectUri = `${callbackBaseUrl}/api/auth/oauth/google/callback`;

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[oauth/google/callback] token exchange failed", errorText);
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Fetch user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userData = await userResponse.json();
    const { email, id: googleId, name } = userData;

    if (!email) {
      throw new Error("Email not provided by Google");
    }

    // Create or update user in database
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            oauthProvider: "google",
            oauthId: googleId,
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
      // Update OAuth info if missing
      if (!user.oauthProvider || !user.oauthId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            oauthProvider: "google",
            oauthId: googleId,
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
      // Create new user with OAuth
      const now = new Date();
      const trialEndsAt = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      user = await prisma.user.create({
        data: {
          email,
          name: name || undefined,
          oauthProvider: "google",
          oauthId: googleId,
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

    // Check if this is a mobile app callback
    const isMobile = state === "mobile";

    if (isMobile) {
      // Redirect to mobile deep link
      return res.redirect(
        `wisewave://oauth/google?token=${encodeURIComponent(token)}`
      );
    }

    // Redirect web users to chat with token
    return res.redirect(`/embed?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error("[oauth/google/callback] error", error);
    return res.redirect(
      `/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`
    );
  }
}
