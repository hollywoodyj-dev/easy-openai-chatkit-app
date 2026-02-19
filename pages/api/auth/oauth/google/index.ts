import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Google OAuth initiation endpoint
 * Redirects user to Google's authorization page
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state } = req.query;

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.OAUTH_CALLBACK_BASE_URL || "https://wisewave-chatkit-app-v2.vercel.app"}/api/auth/oauth/google/callback`;

  if (!clientId) {
    return res.status(500).json({
      error: "Google OAuth not configured",
      message: "GOOGLE_CLIENT_ID environment variable is missing",
    });
  }

  // Google OAuth 2.0 authorization URL
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  if (state) {
    authUrl.searchParams.set("state", state as string);
  }

  // Redirect to Google
  return res.redirect(authUrl.toString());
}
