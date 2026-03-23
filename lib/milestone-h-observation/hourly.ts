import type { HourlyObservationRunResult } from "./types";
import { generateQueue } from "./queue-generate";
import { appendQueueItems } from "./storage";

export type QueueGeneratorDeps = {
  appendItems: (
    items: import("./types").ObservationQueueItem[]
  ) => Promise<void>;
};

/**
 * Hourly cycle: generate queue + persist. No auto-review, no milestone judgment.
 */
export async function runHourlyObservationCycleSync(
  runAt: string = new Date().toISOString(),
  targetCount: number = 4
): Promise<HourlyObservationRunResult> {
  const result = generateQueue({
    runAt,
    targetCount,
    includeRealCases: true,
    includeScenarioCases: true,
    targetReflectivePct: 0.5,
    targetMixedPct: 0.3,
    targetFactualPct: 0.2,
  });

  await appendQueueItems(result.items);

  return {
    runId: result.runId,
    generatedAt: result.generatedAt,
    queuedCount: result.items.length,
    caseIds: result.items.map((x) => x.caseId),
    operatorPrompt:
      "Review queued cases, run removal-first judgment, and append logs. Do not auto-decide milestone status.",
  };
}
