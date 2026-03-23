import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import { generateQueue } from "@/lib/milestone-h-observation/queue-generate";
import {
  appendQueueItems,
  listQueueItems,
} from "@/lib/milestone-h-observation/storage";
import { DEFAULT_QUEUE_RULES } from "@/lib/milestone-h-observation/schema";

export const dynamic = "force-dynamic";

/** GET: list queue items (optional ?status=queued) */
export async function GET(request: Request) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  let items = listQueueItems();
  if (status && ["queued", "in_review", "completed", "skipped"].includes(status)) {
    items = items.filter((x) => x.reviewStatus === status);
  }
  return NextResponse.json({ items });
}

/** POST: generate queue slice and append (body optional) */
export async function POST(request: Request) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  let body: {
    targetCount?: number;
    includeRealCases?: boolean;
    includeScenarioCases?: boolean;
    runAt?: string;
    preferredTags?: string[];
  } = {};
  try {
    const text = await request.text();
    if (text.trim()) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const targetCount =
    typeof body.targetCount === "number"
      ? body.targetCount
      : DEFAULT_QUEUE_RULES.hourlyTargetCount;
  const result = generateQueue({
    runAt: body.runAt ?? new Date().toISOString(),
    targetCount,
    includeRealCases: body.includeRealCases !== false,
    includeScenarioCases: body.includeScenarioCases !== false,
    preferredTags: body.preferredTags,
  });
  appendQueueItems(result.items);

  return NextResponse.json({
    runId: result.runId,
    generatedAt: result.generatedAt,
    queuedCount: result.items.length,
    caseIds: result.items.map((x) => x.caseId),
    operatorPrompt:
      "Review queued cases, run removal-first judgment, and append logs. Do not auto-decide milestone status.",
    items: result.items,
  });
}
