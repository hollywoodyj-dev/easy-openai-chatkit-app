import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  ObservationQueueItem,
  ObservationResponseSnapshot,
  ObservationReviewLog,
} from "./types";

const DATA_DIR = join(process.cwd(), "data", "h-observation");

const FILES = {
  queue: join(DATA_DIR, "queue.json"),
  snapshots: join(DATA_DIR, "snapshots.json"),
  reviews: join(DATA_DIR, "reviews.json"),
  realSamples: join(DATA_DIR, "real-samples.json"),
} as const;

function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJson<T>(path: string, fallback: T): T {
  try {
    if (!existsSync(path)) return fallback;
    const raw = readFileSync(path, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(path: string, data: unknown): void {
  ensureDataDir();
  writeFileSync(path, JSON.stringify(data, null, 2), "utf8");
}

export function listQueueItems(): ObservationQueueItem[] {
  return readJson<ObservationQueueItem[]>(FILES.queue, []);
}

export function saveQueueItems(items: ObservationQueueItem[]): void {
  writeJson(FILES.queue, items);
}

export function appendQueueItems(items: ObservationQueueItem[]): void {
  const cur = listQueueItems();
  const ids = new Set(cur.map((x) => x.caseId));
  const merged = [...cur];
  for (const it of items) {
    if (!ids.has(it.caseId)) {
      merged.push(it);
      ids.add(it.caseId);
    }
  }
  saveQueueItems(merged);
}

export function updateQueueItemStatus(
  caseId: string,
  reviewStatus: ObservationQueueItem["reviewStatus"]
): boolean {
  const items = listQueueItems();
  const i = items.findIndex((x) => x.caseId === caseId);
  if (i < 0) return false;
  items[i] = { ...items[i], reviewStatus };
  saveQueueItems(items);
  return true;
}

export function getQueueItem(caseId: string): ObservationQueueItem | null {
  return listQueueItems().find((x) => x.caseId === caseId) ?? null;
}

type SnapshotsFile = Record<string, ObservationResponseSnapshot>;

export function getSnapshot(
  caseId: string
): ObservationResponseSnapshot | undefined {
  const all = readJson<SnapshotsFile>(FILES.snapshots, {});
  return all[caseId];
}

export function setSnapshot(
  caseId: string,
  snapshot: ObservationResponseSnapshot
): void {
  const all = readJson<SnapshotsFile>(FILES.snapshots, {});
  all[caseId] = snapshot;
  writeJson(FILES.snapshots, all);
}

export function listReviews(): ObservationReviewLog[] {
  return readJson<ObservationReviewLog[]>(FILES.reviews, []);
}

export function appendReview(log: ObservationReviewLog): void {
  const cur = listReviews().filter((r) => r.caseId !== log.caseId);
  cur.push(log);
  writeJson(FILES.reviews, cur);
}

export function getReview(caseId: string): ObservationReviewLog | undefined {
  return listReviews().find((r) => r.caseId === caseId);
}

export type RealSampleRow = {
  language: "en" | "zh";
  conversationType: "reflective" | "mixed" | "factual";
  signalStrength: "low" | "medium" | "high";
  fullInput: string;
  previewText?: string;
  tags?: string[];
};

type RealSamplesFile = { samples: RealSampleRow[] };

export function listRealSamples(): RealSampleRow[] {
  return readJson<RealSamplesFile>(FILES.realSamples, { samples: [] }).samples;
}

export function getStoragePaths(): typeof FILES {
  return FILES;
}
