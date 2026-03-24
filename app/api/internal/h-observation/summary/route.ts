import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import { buildDailySummary } from "@/lib/milestone-h-observation/metrics";
import {
  filterReviewLogsByBenchmarkSet,
  listReviews,
} from "@/lib/milestone-h-observation/storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const date =
    searchParams.get("date") ??
    new Date().toISOString().slice(0, 10);
  const benchmarkSet = searchParams.get("benchmarkSet");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date (use YYYY-MM-DD)" }, { status: 400 });
  }

  let logs = (await listReviews()).filter((r) =>
    r.reviewedAt.startsWith(date)
  );
  logs = await filterReviewLogsByBenchmarkSet(logs, benchmarkSet);
  const summary = buildDailySummary(date, logs);
  return NextResponse.json({ summary, benchmarkSet: benchmarkSet ?? null });
}
