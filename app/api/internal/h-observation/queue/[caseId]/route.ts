import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import {
  updateQueueItemPrompt,
  updateQueueItemStatus,
} from "@/lib/milestone-h-observation/storage";
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

  let body: {
    reviewStatus?: ObservationQueueItem["reviewStatus"];
    previewText?: string;
    fullInput?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const hasPrompt =
    body.previewText !== undefined || body.fullInput !== undefined;
  if (!hasPrompt && body.reviewStatus === undefined) {
    return NextResponse.json(
      { error: "Provide reviewStatus and/or previewText / fullInput" },
      { status: 400 }
    );
  }

  if (hasPrompt) {
    const pr = await updateQueueItemPrompt(decoded, {
      ...(body.previewText !== undefined
        ? { previewText: body.previewText }
        : {}),
      ...(body.fullInput !== undefined ? { fullInput: body.fullInput } : {}),
    });
    if (!pr.ok) {
      if (pr.reason === "not_found") {
        return NextResponse.json({ error: "Case not found" }, { status: 404 });
      }
      return NextResponse.json(
        {
          error:
            "Prompt edit only allowed for queued | in_review rows",
        },
        { status: 409 }
      );
    }
  }

  const reviewStatus = body.reviewStatus;
  if (reviewStatus === undefined) {
    return NextResponse.json({
      ok: true,
      caseId: decoded,
      promptUpdated: Boolean(
        body.previewText !== undefined || body.fullInput !== undefined
      ),
    });
  }

  if (!["queued", "in_review", "completed", "skipped"].includes(reviewStatus)) {
    return NextResponse.json(
      { error: "reviewStatus must be queued | in_review | completed | skipped" },
      { status: 400 }
    );
  }

  const ok = await updateQueueItemStatus(decoded, reviewStatus);
  if (!ok) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, caseId: decoded, reviewStatus });
}
