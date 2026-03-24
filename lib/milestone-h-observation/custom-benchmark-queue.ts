/**
 * Custom / benchmark observation queue rows — exact prompt identity for QA evidence.
 */

import { createHash, randomBytes } from "crypto";
import type {
  ConversationType,
  CustomObservationQueueItemInput,
  Language,
  ObservationQueueItem,
  SignalStrength,
} from "./types";

export const PASSIVE_BENCHMARK_QUERY = "__passive__";

const LANGUAGES = new Set(["en", "zh"]);
const CONV_TYPES = new Set(["reflective", "mixed", "factual"]);
const SIGNALS = new Set(["low", "medium", "high"]);
const SOURCE_BENCHMARK = "benchmark" as const;

function slugPart(s: string, max = 48): string {
  const t = s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return t.slice(0, max) || "x";
}

/** Stable id when benchmarkSet + benchmarkCaseId present; else random. */
export function deriveBenchmarkCaseId(input: {
  caseId?: string;
  benchmarkSet?: string;
  benchmarkCaseId?: string;
  fullInput: string;
}): string {
  const raw = input.caseId?.trim();
  if (raw) {
    if (raw.length < 4 || raw.length > 160) {
      throw new Error("caseId must be 4–160 characters");
    }
    if (!/^[a-zA-Z0-9._:-]+$/.test(raw)) {
      throw new Error(
        "caseId may only contain letters, digits, . _ : -"
      );
    }
    return raw;
  }
  const set = input.benchmarkSet?.trim();
  const bid = input.benchmarkCaseId?.trim();
  if (set && bid) {
    return `bm-${slugPart(set, 40)}--${slugPart(bid, 40)}`;
  }
  return `bm-${randomBytes(8).toString("hex")}`;
}

function shortInputHash(fullInput: string): string {
  return createHash("sha256").update(fullInput).digest("hex").slice(0, 10);
}

/**
 * If caseId would collide for different prompts, append hash (when using derived id).
 */
export function finalizeCaseId(
  baseId: string,
  fullInput: string,
  explicitCaseId: boolean
): string {
  if (explicitCaseId) return baseId;
  if (baseId.startsWith("bm-") && baseId.includes("--")) {
    return `${baseId}--${shortInputHash(fullInput)}`;
  }
  return baseId;
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asStringArray(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = v.filter((x) => typeof x === "string") as string[];
  return out.length ? out : undefined;
}

export function parseCustomQueueItem(raw: unknown): CustomObservationQueueItemInput {
  if (!raw || typeof raw !== "object") {
    throw new Error("Each item must be an object");
  }
  const o = raw as Record<string, unknown>;

  const language = asString(o.language);
  const conversationType = asString(o.conversationType);
  const signalStrength = asString(o.signalStrength);
  const previewText = asString(o.previewText);
  const fullInput = asString(o.fullInput);

  if (!language || !LANGUAGES.has(language)) {
    throw new Error("language must be en | zh");
  }
  if (!conversationType || !CONV_TYPES.has(conversationType)) {
    throw new Error("conversationType must be reflective | mixed | factual");
  }
  if (!signalStrength || !SIGNALS.has(signalStrength)) {
    throw new Error("signalStrength must be low | medium | high");
  }
  if (!previewText?.trim() || previewText.length > 20_000) {
    throw new Error("previewText required, max 20000 chars");
  }
  if (!fullInput?.trim() || fullInput.length > 100_000) {
    throw new Error("fullInput required, max 100000 chars");
  }

  const cid = asString(o.caseId)?.trim();
  const bset = asString(o.benchmarkSet)?.trim();
  const bc = asString(o.benchmarkCaseId)?.trim();
  if (!cid && (!bset || !bc)) {
    throw new Error("Provide caseId, or both benchmarkSet and benchmarkCaseId");
  }

  const sourceType = asString(o.sourceType);
  if (sourceType && sourceType !== SOURCE_BENCHMARK) {
    throw new Error('sourceType must be "benchmark" if set');
  }

  return {
    caseId: asString(o.caseId),
    sourceType: SOURCE_BENCHMARK,
    language: language as Language,
    conversationType: conversationType as ConversationType,
    signalStrength: signalStrength as SignalStrength,
    previewText: previewText.trim(),
    fullInput: fullInput.trim(),
    tags: asStringArray(o.tags),
    benchmarkSet: asString(o.benchmarkSet)?.trim(),
    benchmarkCaseId: asString(o.benchmarkCaseId)?.trim(),
    benchmarkLayer: asString(o.benchmarkLayer)?.trim(),
    observationMilestone: asString(o.observationMilestone)?.trim(),
    runLabel: asString(o.runLabel)?.trim(),
    runAt: asString(o.runAt)?.trim(),
    runOwner: asString(o.runOwner)?.trim(),
    suiteName: asString(o.suiteName)?.trim(),
  };
}

export function customInputToQueueItem(
  input: CustomObservationQueueItemInput,
  createdAt: string
): ObservationQueueItem {
  const explicit = Boolean(input.caseId?.trim());
  const base = deriveBenchmarkCaseId({
    caseId: input.caseId,
    benchmarkSet: input.benchmarkSet,
    benchmarkCaseId: input.benchmarkCaseId,
    fullInput: input.fullInput,
  });
  const caseId = finalizeCaseId(base, input.fullInput, explicit);

  return {
    caseId,
    sourceType: SOURCE_BENCHMARK,
    language: input.language,
    conversationType: input.conversationType,
    signalStrength: input.signalStrength,
    previewText: input.previewText,
    fullInput: input.fullInput,
    createdAt,
    reviewStatus: "queued",
    tags: input.tags,
    benchmarkSet: input.benchmarkSet ?? null,
    benchmarkCaseId: input.benchmarkCaseId ?? null,
    benchmarkLayer: input.benchmarkLayer ?? null,
    observationMilestone: input.observationMilestone ?? null,
    runLabel: input.runLabel ?? null,
    runAt: input.runAt ?? null,
    runOwner: input.runOwner ?? null,
    suiteName: input.suiteName ?? null,
  };
}

export function filterQueueItemsByBenchmarkParam(
  items: ObservationQueueItem[],
  benchmarkSetParam: string | null
): ObservationQueueItem[] {
  if (!benchmarkSetParam?.trim()) return items;
  const v = benchmarkSetParam.trim();
  if (v === PASSIVE_BENCHMARK_QUERY) {
    return items.filter((i) => !i.benchmarkSet);
  }
  return items.filter((i) => i.benchmarkSet === v);
}
