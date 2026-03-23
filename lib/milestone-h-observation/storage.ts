import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
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

export async function listQueueItems(): Promise<ObservationQueueItem[]> {
  const rows = await prisma.hObservationQueueItem.findMany({
    orderBy: { createdAt: "desc" },
  });
  return rows.map((r) => ({
    caseId: r.caseId,
    sourceType: r.sourceType as ObservationQueueItem["sourceType"],
    language: r.language as ObservationQueueItem["language"],
    conversationType: r.conversationType as ObservationQueueItem["conversationType"],
    signalStrength: r.signalStrength as ObservationQueueItem["signalStrength"],
    previewText: r.previewText,
    fullInput: r.fullInput,
    createdAt: r.createdAt.toISOString(),
    reviewStatus: r.reviewStatus as ObservationQueueItem["reviewStatus"],
    tags: (r.tags as string[] | null) ?? undefined,
  }));
}

export async function saveQueueItems(
  items: ObservationQueueItem[]
): Promise<void> {
  // Upsert is enough; we don't need full array writes.
  for (const it of items) {
    await prisma.hObservationQueueItem.upsert({
      where: { caseId: it.caseId },
      update: {
        sourceType: it.sourceType,
        language: it.language,
        conversationType: it.conversationType,
        signalStrength: it.signalStrength,
        previewText: it.previewText,
        fullInput: it.fullInput ?? it.previewText,
        createdAt: new Date(it.createdAt),
        reviewStatus: it.reviewStatus,
        tags: it.tags
          ? (it.tags as unknown as Prisma.InputJsonValue)
          : undefined,
      },
      create: {
        caseId: it.caseId,
        sourceType: it.sourceType,
        language: it.language,
        conversationType: it.conversationType,
        signalStrength: it.signalStrength,
        previewText: it.previewText,
        fullInput: it.fullInput ?? it.previewText,
        createdAt: new Date(it.createdAt),
        reviewStatus: it.reviewStatus,
        tags: it.tags
          ? (it.tags as unknown as Prisma.InputJsonValue)
          : undefined,
      },
    });
  }
}

export async function appendQueueItems(
  items: ObservationQueueItem[]
): Promise<void> {
  for (const it of items) {
    await prisma.hObservationQueueItem.upsert({
      where: { caseId: it.caseId },
      update: {
        sourceType: it.sourceType,
        language: it.language,
        conversationType: it.conversationType,
        signalStrength: it.signalStrength,
        previewText: it.previewText,
        fullInput: it.fullInput ?? it.previewText,
        createdAt: new Date(it.createdAt),
        reviewStatus: it.reviewStatus,
        tags: it.tags
          ? (it.tags as unknown as Prisma.InputJsonValue)
          : undefined,
      },
      create: {
        caseId: it.caseId,
        sourceType: it.sourceType,
        language: it.language,
        conversationType: it.conversationType,
        signalStrength: it.signalStrength,
        previewText: it.previewText,
        fullInput: it.fullInput ?? it.previewText,
        createdAt: new Date(it.createdAt),
        reviewStatus: it.reviewStatus,
        tags: it.tags
          ? (it.tags as unknown as Prisma.InputJsonValue)
          : undefined,
      },
    });
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
    tags: (r.tags as string[] | null) ?? undefined,
  };
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
