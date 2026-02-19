import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";

const DEFAULT_CHATKIT_BASE = "https://api.openai.com";

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
      return res
        .status(401)
        .json({ error: "Missing Authorization header" });
    }

    const userId = verifyUserToken(token);
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Invalid or expired token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const now = new Date();
    let sub = user.subscriptions[0];

    // If user has no subscription (e.g. first account or created before trials), grant a 7-day trial
    const TRIAL_DAYS = 7;
    if (!sub) {
      const trialEndsAt = new Date(
        now.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000
      );
      const newSub = await prisma.subscription.create({
        data: {
          userId: user.id,
          status: "trialing",
          platform: "stripe_web",
          trialEndsAt,
        },
      });
      sub = newSub;
    }

    const isTrialing =
      sub &&
      sub.status === "trialing" &&
      sub.trialEndsAt &&
      now < sub.trialEndsAt;

    const isActive =
      sub &&
      sub.status === "active" &&
      sub.currentPeriodEnd &&
      now < sub.currentPeriodEnd;

    if (!isTrialing && !isActive) {
      return res.status(402).json({
        error: "Subscription required",
        code: "subscription_required",
      });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY environment variable",
      });
    }

    const workflowId =
      process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

    if (!workflowId) {
      return res
        .status(500)
        .json({ error: "Missing NEXT_PUBLIC_CHATKIT_WORKFLOW_ID" });
    }

    const apiBase = process.env.CHATKIT_API_BASE ?? DEFAULT_CHATKIT_BASE;
    const url = `${apiBase}/v1/chatkit/sessions`;

    const upstreamResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
        "OpenAI-Beta": "chatkit_beta=v1",
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: user.id,
      }),
    });

    const upstreamJson = (await upstreamResponse
      .json()
      .catch(() => ({}))) as Record<string, unknown> | undefined;

    if (!upstreamResponse.ok) {
      console.error("[pages/api/mobile/create-session] OpenAI error", {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        body: upstreamJson,
      });
      return res.status(upstreamResponse.status).json({
        error:
          (upstreamJson?.error as string | undefined) ??
          `Failed to create session: ${upstreamResponse.statusText}`,
        details: upstreamJson,
      });
    }

    const clientSecret = upstreamJson?.client_secret ?? null;
    const expiresAfter = upstreamJson?.expires_after ?? null;

    return res.status(200).json({
      client_secret: clientSecret,
      expires_after: expiresAfter,
    });
  } catch (error) {
    console.error(
      "[pages/api/mobile/create-session] unexpected error",
      error
    );
    return res.status(500).json({ error: "Unexpected error" });
  }
}

