import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Facebook OAuth initiation endpoint
 * Redirects user to Facebook's authorization page
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state } = req.query;

  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = `${process.env.OAUTH_CALLBACK_BASE_URL || "https://wisewave-chatkit-app-v2.vercel.app"}/api/auth/oauth/facebook/callback`;

  if (!appId) {
    return res.status(500).json({
      error: "Facebook OAuth not configured",
      message: "FACEBOOK_APP_ID environment variable is missing",
    });
  }

  // Facebook OAuth 2.0 authorization URL
  const authUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
  authUrl.searchParams.set("client_id", appId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "email,public_profile");
  if (state) {
    authUrl.searchParams.set("state", state as string);
  }

  // Redirect to Facebook
  return res.redirect(authUrl.toString());
}
