import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { signUserToken } from "@/lib/auth";

type OAuthProvider = "google" | "facebook" | "x";

interface OAuthUserData {
  email: string;
  name?: string;
  providerId: string;
  provider: OAuthProvider;
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
    const { provider, email, name, providerId } = req.body ?? {};

    if (
      !provider ||
      !email ||
      !providerId ||
      !["google", "facebook", "x"].includes(provider)
    ) {
      return res.status(400).json({
        error: "Invalid OAuth data. Provider, email, and providerId are required.",
      });
    }

    const trimmedEmail = typeof email === "string" ? email.trim() : "";
    const trimmedName = typeof name === "string" ? name.trim() : undefined;
    const trimmedProviderId =
      typeof providerId === "string" ? providerId.trim() : "";

    if (!trimmedEmail || !trimmedProviderId) {
      return res.status(400).json({
        error: "Email and providerId are required.",
      });
    }

    // Try to find existing user by OAuth provider + ID, or by email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            oauthProvider: provider as OAuthProvider,
            oauthId: trimmedProviderId,
          },
          { email: trimmedEmail },
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
      // Update OAuth info if missing (e.g., user registered with email, then uses OAuth)
      if (!user.oauthProvider || !user.oauthId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            oauthProvider: provider as OAuthProvider,
            oauthId: trimmedProviderId,
            name: trimmedName || user.name,
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
          email: trimmedEmail,
          name: trimmedName,
          oauthProvider: provider as OAuthProvider,
          oauthId: trimmedProviderId,
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

    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email, name: user.name },
      subscription: user.subscriptions[0] ?? null,
    });
  } catch (error) {
    console.error("[pages/api/auth/oauth] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}
