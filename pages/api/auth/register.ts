import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { hashPassword, signUserToken } from "@/lib/auth";
import { updateUserCountryFromRequest } from "@/lib/geoip";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { email, password } = req.body ?? {};

    const trimmedEmail =
      typeof email === "string" ? email.trim() : "";
    const plainPassword =
      typeof password === "string" ? password : "";

    if (!trimmedEmail || !plainPassword) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    if (plainPassword.length < 8) {
      return res.status(400).json({
        error: "Password must be at least 8 characters.",
      });
    }

    const existing = await prisma.user.findUnique({
      where: { email: trimmedEmail },
      select: { id: true },
    });

    if (existing) {
      return res
        .status(409)
        .json({ error: "A user with this email already exists." });
    }

    const passwordHash = await hashPassword(plainPassword);

    const now = new Date();
    const trialEndsAt = new Date(
      now.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    const user = await prisma.user.create({
      data: {
        email: trimmedEmail,
        passwordHash,
        subscriptions: {
          create: {
            status: "trialing",
            platform: "google_play",
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

    const token = signUserToken(user.id);

    // Best-effort: set user.country based on signup IP.
    await updateUserCountryFromRequest(user.id, req);

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email },
      subscription: user.subscriptions[0] ?? null,
    });
  } catch (error) {
    console.error("[pages/api/auth/register] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

