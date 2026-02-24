import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { verifyUserToken } from "@/lib/auth";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans";

type AdminCheckResult =
  | { ok: true; adminUserId: string }
  | { ok: false; status: number; message: string };

async function requireAdmin(req: NextApiRequest): Promise<AdminCheckResult> {
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) {
    return { ok: false, status: 401, message: "Missing Authorization header" };
  }

  const userId = verifyUserToken(token);
  if (!userId) {
    return { ok: false, status: 401, message: "Invalid or expired token" };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return { ok: false, status: 500, message: "ADMIN_EMAIL is not configured" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });

  if (!user || user.email !== adminEmail) {
    return { ok: false, status: 403, message: "Forbidden" };
  }

  return { ok: true, adminUserId: user.id };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return res.status(auth.status).json({ error: auth.message });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(
      now.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    const [
      totalUsers,
      newUsers30d,
      totalSubscriptions,
      activeSubscriptions,
      trialingSubscriptions,
      canceledSubscriptions,
      expiredSubscriptions,
      activeMonthly,
      activeYearly,
      newSubscriptions30d,
      usersByCountry,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: { gte: thirtyDaysAgo },
        },
      }),
      prisma.subscription.count(),
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.subscription.count({ where: { status: "trialing" } }),
      prisma.subscription.count({ where: { status: "canceled" } }),
      prisma.subscription.count({ where: { status: "expired" } }),
      prisma.subscription.count({
        where: { status: "active", plan: "monthly" },
      }),
      prisma.subscription.count({
        where: { status: "active", plan: "yearly" },
      }),
      prisma.subscription.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.user.groupBy({
        by: ["country"],
        _count: { _all: true },
      }),
    ]);

    const monthlyPrice = SUBSCRIPTION_PLANS.monthly.price;
    const yearlyPrice = SUBSCRIPTION_PLANS.yearly.price;

    const mrrUsd =
      activeMonthly * monthlyPrice + activeYearly * (yearlyPrice / 12);
    const arrUsd = mrrUsd * 12;

    return res.status(200).json({
      totals: {
        totalUsers,
        newUsers30d,
        totalSubscriptions,
        newSubscriptions30d,
      },
      byStatus: {
        active: activeSubscriptions,
        trialing: trialingSubscriptions,
        canceled: canceledSubscriptions,
        expired: expiredSubscriptions,
      },
      byPlan: {
        activeMonthly,
        activeYearly,
      },
      revenueEstimate: {
        mrrUsd,
        arrUsd,
      },
      byCountry: usersByCountry
        .map((row) => ({
          country: row.country,
          users: row._count._all,
        }))
        .sort((a, b) => b.users - a.users),
      generatedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("[api/admin/stats] unexpected error", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
}

