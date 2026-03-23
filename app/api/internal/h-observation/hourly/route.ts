import { NextResponse } from "next/server";
import { guardObservationApi } from "@/lib/milestone-h-observation/api-guard";
import { runHourlyObservationCycleSync } from "@/lib/milestone-h-observation/hourly";

export const dynamic = "force-dynamic";

/** POST: same as POST /queue but named for cron / operator reminder flows */
export async function POST(request: Request) {
  const denied = guardObservationApi(request);
  if (denied) return denied;

  let targetCount = 4;
  try {
    const text = await request.text();
    if (text.trim()) {
      const b = JSON.parse(text) as { targetCount?: number };
      if (typeof b.targetCount === "number") targetCount = b.targetCount;
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await runHourlyObservationCycleSync(
    new Date().toISOString(),
    targetCount
  );
  return NextResponse.json(result);
}
