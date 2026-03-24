import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { PASSIVE_BENCHMARK_QUERY } from "./custom-benchmark-queue";
import type {
  ObservationQueueItem,
  ObservationResponseSnapshot,
  ObservationReviewLog,
} from "./types";

export type RealSampleRow = {
  language: "en" | "zh";
  conversationType: "reflective" | "mixed" | "factual";
  signalStrength: "low" | "medium" | "high";
  fullInput: string;
  previewText?: string;
  tags?: string[];
};

type RealSamplesFile = { samples: RealSampleRow[] };

function readJson<T>(path: string, fallback: T): T {
  try {
    if (!existsSync(path)) return fallback;
    const raw = readFileSync(path, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function realSamplesPaths() {
  const root = process.cwd();
  const primary = join(root, "data", "h-observation", "real-samples.json");
  const fallback = join(root, "data", "h-observation", "real-samples.example.json");
  return { primary, fallback };
}

export function listRealSamples(): RealSampleRow[] {
  const { primary, fallback } = realSamplesPaths();
  const parsed =
    readJson<RealSamplesFile>(primary, { samples: [] })?.samples?.length
      ? readJson<RealSamplesFile>(primary, { samples: [] })
      : readJson<RealSamplesFile>(fallback, { samples: [] });
  return parsed.samples;
}

// ===== Queue (persistent in Postgres) =====

function mapDbRowToQueueItem(r: {
  caseId: string;
  sourceType: string;
  language: string;
  conversationType: string;
  signalStrength: string;
  previewText: string;
  fullInput: string;
  createdAt: Date;
  reviewStatus: string;
  tags: Prisma.JsonValue;
  benchmarkSet: string | null;
  benchmarkCaseId: string | null;
  benchmarkLayer: string | null;
  observationMilestone: string | null;
  runLabel: string | null;
  runAt: string | null;
  runOwner: string | null;
  suiteName: string | null;
}): ObservationQueueItem {
  return {
    caseId: r.caseId,
    sourceType: r.sourceType as ObservationQueueItem["sourceType"],
    language: r.language as ObservationQueueItem["language"],
    conversationType: r.conversationType as ObservationQueueItem["conversationType"],
    signalStrength: r.signalStrength as ObservationQueueItem["signalStrength"],
    previewText: r.previewText,
    fullInput: r.fullInput,
    createdAt: r.createdAt.toISOString(),
    reviewStatus: r.reviewStatus as ObservationQueueItem["reviewStatus"],
    tags: Array.isArray(r.tags) ? (r.tags as string[]) : undefined,
    benchmarkSet: r.benchmarkSet,
    benchmarkCaseId: r.benchmarkCaseId,
    benchmarkLayer: r.benchmarkLayer,
    observationMilestone: r.observationMilestone,
    runLabel: r.runLabel,
    runAt: r.runAt,
    runOwner: r.runOwner,
    suiteName: r.suiteName,
  };
}

async function upsertQueueItemRow(it: ObservationQueueItem): Promise<void> {
  const fullInput = it.fullInput ?? it.previewText;
  const core = {
    sourceType: it.sourceType,
    language: it.language,
    conversationType: it.conversationType,
    signalStrength: it.signalStrength,
    previewText: it.previewText,
    fullInput,
    createdAt: new Date(it.createdAt),
    reviewStatus: it.reviewStatus,
    benchmarkSet: it.benchmarkSet ?? null,
    benchmarkCaseId: it.benchmarkCaseId ?? null,
    benchmarkLayer: it.benchmarkLayer ?? null,
    observationMilestone: it.observationMilestone ?? null,
    runLabel: it.runLabel ?? null,
    runAt: it.runAt ?? null,
    runOwner: it.runOwner ?? null,
    suiteName: it.suiteName ?? null,
  };
  await prisma.hObservationQueueItem.upsert({
    where: { caseId: it.caseId },
    update: {
      ...core,
      ...(it.tags !== undefined
        ? { tags: it.tags as unknown as Prisma.InputJsonValue }
        : {}),
    },
    create: {
      caseId: it.caseId,
      ...core,
      tags: it.tags?.length
        ? (it.tags as unknown as Prisma.InputJsonValue)
        : undefined,
    },
  });
}

export async function listQueueItems(): Promise<ObservationQueueItem[]> {
  const rows = await prisma.hObservationQueueItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapDbRowToQueueItem);
}

export async function saveQueueItems(
  items: ObservationQueueItem[]
): Promise<void> {
  for (const it of items) {
    await upsertQueueItemRow(it);
  }
}

export async function appendQueueItems(
  items: ObservationQueueItem[]
): Promise<void> {
  for (const it of items) {
    await upsertQueueItemRow(it);
  }
}

export async function updateQueueItemStatus(
  caseId: string,
  reviewStatus: ObservationQueueItem["reviewStatus"]
): Promise<boolean> {
  const res = await prisma.hObservationQueueItem.updateMany({
    where: { caseId },
    data: { reviewStatus },
  });
  return res.count > 0;
}

export async function getQueueItem(
  caseId: string
): Promise<ObservationQueueItem | null> {
  const r = await prisma.hObservationQueueItem.findUnique({ where: { caseId } });
  if (!r) return null;
  return mapDbRowToQueueItem(r);
}

/** Update preview/fullInput for rows still in queued | in_review (benchmark QA edits). */
export async function updateQueueItemPrompt(
  caseId: string,
  patch: { previewText?: string; fullInput?: string }
): Promise<{ ok: boolean; reason?: string }> {
  const row = await prisma.hObservationQueueItem.findUnique({ where: { caseId } });
  if (!row) return { ok: false, reason: "not_found" };
  if (!["queued", "in_review"].includes(row.reviewStatus)) {
    return { ok: false, reason: "not_editable_status" };
  }
  const data: Prisma.HObservationQueueItemUpdateInput = {};
  if (patch.previewText !== undefined) data.previewText = patch.previewText;
  if (patch.fullInput !== undefined) data.fullInput = patch.fullInput;
  if (Object.keys(data).length === 0) return { ok: true };
  await prisma.hObservationQueueItem.update({ where: { caseId }, data });
  return { ok: true };
}

/** Filter review logs by benchmark set or passive-only (see PASSIVE_BENCHMARK_QUERY). */
export async function filterReviewLogsByBenchmarkSet(
  logs: ObservationReviewLog[],
  benchmarkSetParam: string | null | undefined
): Promise<ObservationReviewLog[]> {
  if (!benchmarkSetParam?.trim()) return logs;
  const rows = await prisma.hObservationQueueItem.findMany({
    select: { caseId: true, benchmarkSet: true },
  });
  const byCase = new Map(rows.map((x) => [x.caseId, x.benchmarkSet]));
  const v = benchmarkSetParam.trim();
  if (v === PASSIVE_BENCHMARK_QUERY) {
    return logs.filter((r) => !byCase.get(r.caseId));
  }
  return logs.filter((r) => byCase.get(r.caseId) === v);
}

// ===== Snapshots =====

export async function getSnapshot(
  caseId: string
): Promise<ObservationResponseSnapshot | undefined> {
  const r = await prisma.hObservationSnapshot.findUnique({ where: { caseId } });
  if (!r) return undefined;
  return r.snapshot as unknown as ObservationResponseSnapshot;
}

export async function setSnapshot(
  caseId: string,
  snapshot: ObservationResponseSnapshot
): Promise<void> {
  const snapJson = snapshot as unknown as Prisma.InputJsonValue;
  await prisma.hObservationSnapshot.upsert({
    where: { caseId },
    update: { snapshot: snapJson },
    create: { caseId, snapshot: snapJson },
  });
}

// ===== Reviews =====

export async function listReviews(): Promise<ObservationReviewLog[]> {
  const rows = await prisma.hObservationReviewLog.findMany({
    orderBy: { reviewedAt: "desc" },
  });
  return rows.map((r) => ({
    caseId: r.caseId,
    reviewer: r.reviewer as ObservationReviewLog["reviewer"],
    reviewedAt: r.reviewedAt.toISOString(),

    hAppeared: r.hAppeared,
    cueType: r.cueType as ObservationReviewLog["cueType"],
    positionCorrect: r.positionCorrect,

    shouldHaveBeenSuppressed:
      r.shouldHaveBeenSuppressed as ObservationReviewLog["shouldHaveBeenSuppressed"],
    suppressionFlag:
      r.suppressionFlag as ObservationReviewLog["suppressionFlag"],

    guidanceDrift: r.guidanceDrift,
    interpretiveDrift: r.interpretiveDrift,
    authorityDrift: r.authorityDrift,
    weightDrift: r.weightDrift,
    duplicationDrift: r.duplicationDrift,

    removalResult: r.removalResult as ObservationReviewLog["removalResult"],
    removalConclusion:
      r.removalConclusion as ObservationReviewLog["removalConclusion"],

    turnWeight: r.turnWeight as ObservationReviewLog["turnWeight"],
    hNoticeability: r.hNoticeability as ObservationReviewLog["hNoticeability"],

    ePresent: r.ePresent,
    fPresent: r.fPresent,
    hCompetesWithEorF: r.hCompetesWithEorF,

    linterFired: r.linterFired,
    hSuppressedByLinter: r.hSuppressedByLinter,
    wouldCaseHaveFailedWithoutLinter:
      r.wouldCaseHaveFailedWithoutLinter as ObservationReviewLog["wouldCaseHaveFailedWithoutLinter"],
    wasHExpectedHere: r.wasHExpectedHere,

    verdict: r.verdict as ObservationReviewLog["verdict"],
    reasonShort: r.reasonShort,
    notesOptional: r.notesOptional ?? undefined,
  }));
}

export async function appendReview(log: ObservationReviewLog): Promise<void> {
  const linterFired = log.linterFired ?? false;
  const hSuppressedByLinter = log.hSuppressedByLinter ?? false;
  const wouldCaseHaveFailedWithoutLinter =
    log.wouldCaseHaveFailedWithoutLinter ?? "unclear";
  const wasHExpectedHere = log.wasHExpectedHere ?? false;

  await prisma.hObservationReviewLog.upsert({
    where: { caseId: log.caseId },
    update: {
      reviewer: log.reviewer,
      reviewedAt: new Date(log.reviewedAt),

      hAppeared: log.hAppeared,
      cueType: log.cueType,
      positionCorrect: log.positionCorrect,

      shouldHaveBeenSuppressed: log.shouldHaveBeenSuppressed,
      suppressionFlag: log.suppressionFlag,

      guidanceDrift: log.guidanceDrift,
      interpretiveDrift: log.interpretiveDrift,
      authorityDrift: log.authorityDrift,
      weightDrift: log.weightDrift,
      duplicationDrift: log.duplicationDrift,

      removalResult: log.removalResult,
      removalConclusion: log.removalConclusion,

      turnWeight: log.turnWeight,
      hNoticeability: log.hNoticeability,

      ePresent: log.ePresent,
      fPresent: log.fPresent,
      hCompetesWithEorF: log.hCompetesWithEorF,

      linterFired,
      hSuppressedByLinter,
      wouldCaseHaveFailedWithoutLinter,
      wasHExpectedHere,

      verdict: log.verdict,
      reasonShort: log.reasonShort,
      notesOptional: log.notesOptional ?? null,
    },
    create: {
      caseId: log.caseId,
      reviewer: log.reviewer,
      reviewedAt: new Date(log.reviewedAt),

      hAppeared: log.hAppeared,
      cueType: log.cueType,
      positionCorrect: log.positionCorrect,

      shouldHaveBeenSuppressed: log.shouldHaveBeenSuppressed,
      suppressionFlag: log.suppressionFlag,

      guidanceDrift: log.guidanceDrift,
      interpretiveDrift: log.interpretiveDrift,
      authorityDrift: log.authorityDrift,
      weightDrift: log.weightDrift,
      duplicationDrift: log.duplicationDrift,

      removalResult: log.removalResult,
      removalConclusion: log.removalConclusion,

      turnWeight: log.turnWeight,
      hNoticeability: log.hNoticeability,

      ePresent: log.ePresent,
      fPresent: log.fPresent,
      hCompetesWithEorF: log.hCompetesWithEorF,

      linterFired,
      hSuppressedByLinter,
      wouldCaseHaveFailedWithoutLinter,
      wasHExpectedHere,

      verdict: log.verdict,
      reasonShort: log.reasonShort,
      notesOptional: log.notesOptional ?? null,
    },
  });
}

export async function getReview(
  caseId: string
): Promise<ObservationReviewLog | undefined> {
  const r = await prisma.hObservationReviewLog.findUnique({ where: { caseId } });
  if (!r) return undefined;
  return {
    caseId: r.caseId,
    reviewer: r.reviewer as ObservationReviewLog["reviewer"],
    reviewedAt: r.reviewedAt.toISOString(),

    hAppeared: r.hAppeared,
    cueType: r.cueType as ObservationReviewLog["cueType"],
    positionCorrect: r.positionCorrect,

    shouldHaveBeenSuppressed:
      r.shouldHaveBeenSuppressed as ObservationReviewLog["shouldHaveBeenSuppressed"],
    suppressionFlag:
      r.suppressionFlag as ObservationReviewLog["suppressionFlag"],

    guidanceDrift: r.guidanceDrift,
    interpretiveDrift: r.interpretiveDrift,
    authorityDrift: r.authorityDrift,
    weightDrift: r.weightDrift,
    duplicationDrift: r.duplicationDrift,

    removalResult: r.removalResult as ObservationReviewLog["removalResult"],
    removalConclusion:
      r.removalConclusion as ObservationReviewLog["removalConclusion"],

    turnWeight: r.turnWeight as ObservationReviewLog["turnWeight"],
    hNoticeability: r.hNoticeability as ObservationReviewLog["hNoticeability"],

    ePresent: r.ePresent,
    fPresent: r.fPresent,
    hCompetesWithEorF: r.hCompetesWithEorF,

    linterFired: r.linterFired,
    hSuppressedByLinter: r.hSuppressedByLinter,
    wouldCaseHaveFailedWithoutLinter:
      r.wouldCaseHaveFailedWithoutLinter as ObservationReviewLog["wouldCaseHaveFailedWithoutLinter"],
    wasHExpectedHere: r.wasHExpectedHere,

    verdict: r.verdict as ObservationReviewLog["verdict"],
    reasonShort: r.reasonShort,
    notesOptional: r.notesOptional ?? undefined,
  };
}

// For debugging/docs only; keep signature for any callers.
export function getStoragePaths(): null {
  return null;
}
