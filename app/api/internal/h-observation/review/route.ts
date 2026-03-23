import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import { validateReviewLog } from "@/lib/milestone-h-observation/validation";
import {
  appendReview,
  getQueueItem,
  listReviews,
  updateQueueItemStatus,
} from "@/lib/milestone-h-observation/storage";
import type { ObservationReviewLog } from "@/lib/milestone-h-observation/types";

export const dynamic = "force-dynamic";

/** GET ?date=YYYY-MM-DD optional filter by reviewedAt day (UTC) */
export async function GET(request: Request) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  let logs = listReviews();
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    logs = logs.filter((r) => r.reviewedAt.startsWith(date));
  }
  return NextResponse.json({ reviews: logs });
}

/** POST body: ObservationReviewLog; ?force=true skips strict validation contradictions */
export async function POST(request: Request) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  const force =
    new URL(request.url).searchParams.get("force") === "true" ||
    new URL(request.url).searchParams.get("force") === "1";

  let log: ObservationReviewLog;
  try {
    log = (await request.json()) as ObservationReviewLog;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!getQueueItem(log.caseId)) {
    return NextResponse.json(
      { error: "caseId not found in queue" },
      { status: 404 }
    );
  }

  const errors = validateReviewLog(log);
  if (errors.length && !force) {
    return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
  }

  appendReview(log);
  updateQueueItemStatus(log.caseId, "completed");
  return NextResponse.json({ ok: true, caseId: log.caseId });
}
