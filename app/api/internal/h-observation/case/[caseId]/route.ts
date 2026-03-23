import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import {
  getQueueItem,
  getSnapshot,
  getReview,
} from "@/lib/milestone-h-observation/storage";
import type { ObservationReviewCase } from "@/lib/milestone-h-observation/types";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ caseId: string }> }
) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  const { caseId } = await context.params;
  const decoded = decodeURIComponent(caseId);
  const queueItem = await getQueueItem(decoded);
  if (!queueItem) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const c: ObservationReviewCase = {
    queueItem,
    responseSnapshot: await getSnapshot(decoded),
    reviewLog: await getReview(decoded),
  };
  return NextResponse.json(c);
}
