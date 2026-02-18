import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { signUserToken } from "@/lib/auth";

/**
 * Facebook OAuth callback handler
 * This route receives the authorization code from Facebook and completes the OAuth flow
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
    const redirectUri = `${callbackBaseUrl}/api/auth/oauth/facebook/callback`;

    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://graph.facebook.com/v18.0/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.FACEBOOK_APP_ID!,
          client_secret: process.env.FACEBOOK_APP_SECRET!,
          redirect_uri: redirectUri,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("[oauth/facebook/callback] token exchange failed", errorText);
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Fetch user info from Facebook Graph API
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${access_token}`
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user info");
    }

    const userData = await userResponse.json();
    const { email, id: facebookId, name } = userData;

    if (!email) {
      throw new Error("Email not provided by Facebook. Please ensure email permission is granted.");
    }

    // Create or update user in database
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            oauthProvider: "facebook",
            oauthId: facebookId,
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
            oauthProvider: "facebook",
            oauthId: facebookId,
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
          oauthProvider: "facebook",
          oauthId: facebookId,
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
        `wisewave://oauth/facebook?token=${encodeURIComponent(token)}`
      );
    }

    // Redirect web users to chat with token
    return res.redirect(`/embed?token=${encodeURIComponent(token)}`);
  } catch (error) {
    console.error("[oauth/facebook/callback] error", error);
    return res.redirect(
      `/login?error=${encodeURIComponent("Authentication failed. Please try again.")}`
    );
  }
}
