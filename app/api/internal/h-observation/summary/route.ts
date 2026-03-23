import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import { buildDailySummary } from "@/lib/milestone-h-observation/metrics";
import { listReviews } from "@/lib/milestone-h-observation/storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const date =
    searchParams.get("date") ??
    new Date().toISOString().slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date (use YYYY-MM-DD)" }, { status: 400 });
  }

  const logs = listReviews().filter((r) => r.reviewedAt.startsWith(date));
  const summary = buildDailySummary(date, logs);
  return NextResponse.json({ summary });
}
