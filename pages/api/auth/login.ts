import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signUserToken } from "@/lib/auth";

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
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid email or password." });
    }

    const ok = await verifyPassword(
      plainPassword,
      user.passwordHash
    );
    if (!ok) {
      return res
        .status(401)
        .json({ error: "Invalid email or password." });
    }

    const token = signUserToken(user.id);

    return res.status(200).json({
      token,
      user: { id: user.id, email: user.email },
      subscription: user.subscriptions[0] ?? null,
    });
  } catch (error) {
    console.error("[pages/api/auth/login] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

