import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import { getQueueItem, setSnapshot } from "@/lib/milestone-h-observation/storage";
import type { ObservationResponseSnapshot } from "@/lib/milestone-h-observation/types";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  context: { params: Promise<{ caseId: string }> }
) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  const { caseId } = await context.params;
  const decoded = decodeURIComponent(caseId);
  if (!getQueueItem(decoded)) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  let snapshot: ObservationResponseSnapshot;
  try {
    snapshot = (await request.json()) as ObservationResponseSnapshot;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!snapshot || typeof snapshot.fullResponseText !== "string") {
    return NextResponse.json(
      { error: "Body must include ObservationResponseSnapshot with fullResponseText" },
      { status: 400 }
    );
  }

  setSnapshot(decoded, snapshot);
  return NextResponse.json({ ok: true, caseId: decoded });
}
