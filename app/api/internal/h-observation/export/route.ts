import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import {
  buildDailySummary,
  summaryToCsv,
  summaryToMarkdown,
} from "@/lib/milestone-h-observation/metrics";
import { listReviews } from "@/lib/milestone-h-observation/storage";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const format = searchParams.get("format") ?? "markdown";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date (use YYYY-MM-DD)" }, { status: 400 });
  }

  const logs = (await listReviews()).filter((r) =>
    r.reviewedAt.startsWith(date)
  );
  const summary = buildDailySummary(date, logs);

  if (format === "json") {
    return NextResponse.json({ date, summary, reviews: logs });
  }

  if (format === "csv") {
    const body = summaryToCsv(summary);
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="h-observation-${date}.csv"`,
      },
    });
  }

  const md = summaryToMarkdown(summary);
  return new NextResponse(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="h-observation-${date}.md"`,
    },
  });
}
