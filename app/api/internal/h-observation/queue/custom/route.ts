import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import {
  customInputToQueueItem,
  parseCustomQueueItem,
} from "@/lib/milestone-h-observation/custom-benchmark-queue";
import { appendQueueItems } from "@/lib/milestone-h-observation/storage";
import type { ObservationQueueItem } from "@/lib/milestone-h-observation/types";

export const dynamic = "force-dynamic";

/**
 * POST body: { items: CustomObservationQueueItemInput[] }
 * Creates/updates benchmark queue rows with exact fullInput / previewText (upsert by caseId).
 */
export async function POST(request: Request) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !Array.isArray((body as { items?: unknown }).items)) {
    return NextResponse.json(
      { error: "Body must be { items: [...] }" },
      { status: 400 }
    );
  }

  const rawItems = (body as { items: unknown[] }).items;
  if (rawItems.length === 0) {
    return NextResponse.json({ error: "items array must not be empty" }, { status: 400 });
  }
  if (rawItems.length > 200) {
    return NextResponse.json({ error: "Maximum 200 items per request" }, { status: 400 });
  }

  const createdAt = new Date().toISOString();
  const items: ObservationQueueItem[] = [];
  const errors: string[] = [];

  for (let i = 0; i < rawItems.length; i++) {
    try {
      const parsed = parseCustomQueueItem(rawItems[i]);
      items.push(customInputToQueueItem(parsed, createdAt));
    } catch (e) {
      errors.push(
        `items[${i}]: ${e instanceof Error ? e.message : String(e)}`
      );
    }
  }

  if (errors.length) {
    return NextResponse.json(
      { error: "Validation failed", errors, itemsParsed: items.length },
      { status: 400 }
    );
  }

  await appendQueueItems(items);

  return NextResponse.json({
    ok: true,
    count: items.length,
    caseIds: items.map((x) => x.caseId),
    items,
  });
}
