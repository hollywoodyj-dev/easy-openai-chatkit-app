import { randomBytes } from "crypto";
import type {
  ObservationQueueItem,
  QueueGenerationRequest,
  QueueGenerationResult,
} from "./types";
import { DEFAULT_QUEUE_RULES } from "./schema";
import { H_OBSERVATION_SCENARIO_PACK, type ScenarioTemplate } from "./scenario-pack-data";
import { listRealSamples, type RealSampleRow } from "./storage";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWeightedConversationType(
  reflectivePct: number,
  mixedPct: number
): "reflective" | "mixed" | "factual" {
  const r = Math.random();
  if (r < reflectivePct) return "reflective";
  if (r < reflectivePct + mixedPct) return "mixed";
  return "factual";
}

function scenarioScore(s: ScenarioTemplate, preferredTags?: string[]): number {
  if (!preferredTags?.length) return Math.random();
  const set = new Set(s.tags ?? []);
  let score = 0;
  for (const t of preferredTags) {
    if (set.has(t)) score += 1;
  }
  return score + Math.random() * 0.01;
}

function pickScenarios(
  count: number,
  preferredTags?: string[]
): ScenarioTemplate[] {
  const pool = [...H_OBSERVATION_SCENARIO_PACK];
  pool.sort((a, b) => scenarioScore(b, preferredTags) - scenarioScore(a, preferredTags));
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

function realRowToItem(
  row: RealSampleRow,
  caseId: string,
  createdAt: string
): ObservationQueueItem {
  return {
    caseId,
    sourceType: "real",
    language: row.language,
    conversationType: row.conversationType,
    signalStrength: row.signalStrength,
    previewText: row.previewText ?? row.fullInput.slice(0, 120),
    fullInput: row.fullInput,
    createdAt,
    reviewStatus: "queued",
    tags: row.tags,
  };
}

function scenarioToItem(
  s: ScenarioTemplate,
  caseId: string,
  createdAt: string
): ObservationQueueItem {
  return {
    caseId,
    sourceType: "scenario",
    language: s.language,
    conversationType: s.conversationType,
    signalStrength: s.signalStrength,
    previewText: s.previewText,
    fullInput: s.fullInput,
    createdAt,
    reviewStatus: "queued",
    tags: s.tags,
  };
}

function makeRunId(runAt: string): string {
  const d = new Date(runAt);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const rand = randomBytes(2).toString("hex");
  return `HOBS-${y}${m}${day}-${rand}`;
}

/**
 * Generate queue items per Nova composition rules (2–3 real, 1–2 scenario for ~hourly batch).
 */
export function generateQueue(
  request: QueueGenerationRequest
): QueueGenerationResult {
  const runId = makeRunId(request.runAt);
  const generatedAt = request.runAt;
  const target = Math.max(1, Math.min(50, request.targetCount));

  const reflectivePct =
    request.targetReflectivePct ?? DEFAULT_QUEUE_RULES.conversationMix.reflective;
  const mixedPct =
    request.targetMixedPct ?? DEFAULT_QUEUE_RULES.conversationMix.mixed;

  const wantReal = request.includeRealCases;
  const wantScenario = request.includeScenarioCases;

  let nReal = 0;
  let nScenario = 0;
  if (wantReal && wantScenario) {
    nScenario = Math.max(1, Math.round(target * (1 - DEFAULT_QUEUE_RULES.composition.real)));
    nScenario = Math.min(nScenario, target - 1);
    nReal = target - nScenario;
    if (nReal < 1) {
      nReal = 1;
      nScenario = target - 1;
    }
  } else if (wantScenario) {
    nScenario = target;
  } else {
    nReal = target;
  }

  const samples = shuffle(listRealSamples());
  const items: ObservationQueueItem[] = [];
  let seq = 0;

  const nextId = () => {
    seq += 1;
    return `${runId}-${String(seq).padStart(3, "0")}`;
  };

  if (wantReal && nReal > 0) {
    const picked: RealSampleRow[] = samples.slice(0, nReal);
    while (picked.length < nReal) {
      picked.push({
        language: Math.random() < 0.75 ? "en" : "zh",
        conversationType: pickWeightedConversationType(
          reflectivePct,
          mixedPct
        ),
        signalStrength: "medium",
        fullInput:
          "[Add anonymized turns to data/h-observation/real-samples.json — placeholder slot]",
        previewText: "Placeholder — ingest real conversation sample",
        tags: ["placeholder"],
      });
    }
    for (const row of picked.slice(0, nReal)) {
      items.push(realRowToItem(row, nextId(), generatedAt));
    }
  }

  if (wantScenario && nScenario > 0) {
    const scenarios = pickScenarios(nScenario, request.preferredTags);
    for (const s of scenarios) {
      items.push(scenarioToItem(s, nextId(), generatedAt));
    }
  }

  shuffle(items);
  return { runId, generatedAt, items };
}

export function inferSourceTypeCounts(
  targetCount: number
): { real: number; scenario: number } {
  const target = Math.max(1, targetCount);
  let nScenario = Math.max(
    1,
    Math.round(target * (1 - DEFAULT_QUEUE_RULES.composition.real))
  );
  nScenario = Math.min(nScenario, target - 1);
  const nReal = Math.max(1, target - nScenario);
  return { real: nReal, scenario: target - nReal };
}
