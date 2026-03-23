import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import { updateQueueItemStatus } from "@/lib/milestone-h-observation/storage";
import type { ObservationQueueItem } from "@/lib/milestone-h-observation/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ caseId: string }> }
) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  const { caseId } = await context.params;
  const decoded = decodeURIComponent(caseId);

  let body: { reviewStatus?: ObservationQueueItem["reviewStatus"] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const reviewStatus = body.reviewStatus;
  if (
    !reviewStatus ||
    !["queued", "in_review", "completed", "skipped"].includes(reviewStatus)
  ) {
    return NextResponse.json(
      { error: "reviewStatus must be queued | in_review | completed | skipped" },
      { status: 400 }
    );
  }

  const ok = updateQueueItemStatus(decoded, reviewStatus);
  if (!ok) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, caseId: decoded, reviewStatus });
}
