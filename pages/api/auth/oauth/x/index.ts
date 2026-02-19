import type { NextApiRequest, NextApiResponse } from "next";
import { generateCodeVerifier, generateCodeChallenge, encodeState } from "@/lib/pkce";

/**
 * X (Twitter) OAuth 2.0 initiation endpoint with PKCE
 * Redirects user to X's authorization page
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { state: stateParam } = req.query;
  const flow = stateParam === "mobile" ? "mobile" : "web";

  const clientId = process.env.X_CLIENT_ID;
  const redirectUri = `${process.env.OAUTH_CALLBACK_BASE_URL || "https://wisewave-chatkit-app-v2.vercel.app"}/api/auth/oauth/x/callback`;

  if (!clientId) {
    return res.status(500).json({
      error: "X OAuth not configured",
      message: "X_CLIENT_ID environment variable is missing",
    });
  }

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = encodeState(flow, codeVerifier);

  // X OAuth 2.0 authorization URL (PKCE)
  const authUrl = new URL("https://twitter.com/i/oauth2/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", "tweet.read users.read offline.access");
  authUrl.searchParams.set("code_challenge", codeChallenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("state", state);

  // Redirect to X
  return res.redirect(authUrl.toString());
}
