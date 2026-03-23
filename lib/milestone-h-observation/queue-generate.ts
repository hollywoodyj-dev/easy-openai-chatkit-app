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

function isTrustedRealSample(row: RealSampleRow): boolean {
  const tags = row.tags ?? [];
  if (tags.includes("placeholder")) return false;

  const full = (row.fullInput ?? "").trim().toLowerCase();
  const preview = (row.previewText ?? "").trim().toLowerCase();

  // Known placeholder/template patterns (example + generator fallback).
  if (!full || full.length < 12) return false;
  if (full.includes("placeholder slot")) return false;
  if (full.includes("add anonymized turns")) return false;
  if (full.includes("replace with anonymized")) return false;
  if (full.startsWith("replace with")) return false;

  if (preview.includes("first ~120 chars")) return false;
  if (preview.includes("placeholder — ingest real conversation sample"))
    return false;

  return true;
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

  const trustedRealSamples = shuffle(listRealSamples()).filter(isTrustedRealSample);
  const items: ObservationQueueItem[] = [];
  let seq = 0;

  const nextId = () => {
    seq += 1;
    return `${runId}-${String(seq).padStart(3, "0")}`;
  };

  if (wantReal && nReal > 0) {
    const realCount = Math.min(nReal, trustedRealSamples.length);
    for (const row of trustedRealSamples.slice(0, realCount)) {
      items.push(realRowToItem(row, nextId(), generatedAt));
    }
  }

  if (wantScenario && nScenario > 0) {
    // If we couldn't source enough trusted real samples, we fill the queue with scenarios.
    const realAdded = items.filter((x) => x.sourceType === "real").length;
    const scenarioCount = target - realAdded;
    const scenarios = pickScenarios(scenarioCount, request.preferredTags);
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
