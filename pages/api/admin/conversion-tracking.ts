import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-require";
import {
  CONVERSION_EVENT_CATALOG,
  getGa4MeasurementId,
} from "@/lib/wisewave-conversion-tracking";

const WINDOW_DAYS = 30;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.message });
  }

  try {
    const since = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);

    const [counts, recent, paidLpBreakdown, pageViewBreakdown] = await Promise.all([
      prisma.marketingConversionEvent.groupBy({
        by: ["eventName"],
        where: { createdAt: { gte: since } },
        _count: { _all: true },
      }),
      prisma.marketingConversionEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 80,
        select: {
          id: true,
          eventName: true,
          userId: true,
          sessionId: true,
          source: true,
          lp: true,
          adGroup: true,
          platform: true,
          path: true,
          createdAt: true,
        },
      }),
      prisma.marketingConversionEvent.groupBy({
        by: ["lp"],
        where: {
          createdAt: { gte: since },
          lp: { not: null },
        },
        _count: { _all: true },
      }),
      prisma.marketingConversionEvent.groupBy({
        by: ["path"],
        where: {
          createdAt: { gte: since },
          eventName: "page_view",
          path: { not: null },
        },
        _count: { _all: true },
        orderBy: { _count: { path: "desc" } },
        take: 12,
      }),
    ]);

    const countMap = new Map(
      counts.map((row) => [row.eventName, row._count._all]),
    );

    const catalog = CONVERSION_EVENT_CATALOG.map((entry) => ({
      ...entry,
      count30d: countMap.get(entry.name) ?? 0,
    }));

    const primaryKpi = countMap.get("first_reflection_started") ?? 0;

    return res.status(200).json({
      windowDays: WINDOW_DAYS,
      generatedAt: new Date().toISOString(),
      ga4Configured: Boolean(getGa4MeasurementId()),
      ga4MeasurementId: getGa4MeasurementId(),
      primaryKpi: {
        event: "first_reflection_started",
        count30d: primaryKpi,
      },
      catalog,
      paidLpBreakdown: paidLpBreakdown
        .filter((row) => row.lp)
        .map((row) => ({
          lp: row.lp,
          count: row._count._all,
        })),
      pageViewBreakdown: pageViewBreakdown
        .filter((row) => row.path)
        .map((row) => ({
          path: row.path,
          count: row._count._all,
        })),
      recentEvents: recent.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("[admin/conversion-tracking]", error);
    const message =
      error instanceof Error ? error.message : "Failed to load tracking data";
    const tableMissing =
      typeof message === "string" &&
      (message.includes("marketing_conversion_events") ||
        message.includes("does not exist"));
    return res.status(500).json({
      error: tableMissing
        ? "Conversion tracking table missing. Run: npx prisma migrate deploy"
        : "Failed to load conversion tracking",
      details: process.env.NODE_ENV !== "production" ? message : undefined,
    });
  }
}
