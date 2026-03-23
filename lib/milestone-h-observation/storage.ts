import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type {
  ObservationQueueItem,
  ObservationResponseSnapshot,
  ObservationReviewLog,
} from "./types";

/**
 * Writable directory for queue/reviews JSON.
 * - Local dev: `data/h-observation` under cwd (gitignored files).
 * - Vercel / read-only deploy root: defaults to `/tmp/h-observation` (ephemeral; export often).
 * - Override anytime: `H_OBSERVATION_DATA_DIR`.
 */
export function getObservationDataDir(): string {
  const fromEnv = process.env.H_OBSERVATION_DATA_DIR?.trim();
  if (fromEnv) return fromEnv;
  if (process.env.VERCEL === "1") {
    return join("/tmp", "h-observation");
  }
  return join(process.cwd(), "data", "h-observation");
}

function paths() {
  const dir = getObservationDataDir();
  return {
    dir,
    queue: join(dir, "queue.json"),
    snapshots: join(dir, "snapshots.json"),
    reviews: join(dir, "reviews.json"),
    realSamples: join(dir, "real-samples.json"),
  } as const;
}

function ensureDataDir(): void {
  const { dir } = paths();
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
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
  return readJson<ObservationQueueItem[]>(paths().queue, []);
}

export function saveQueueItems(items: ObservationQueueItem[]): void {
  writeJson(paths().queue, items);
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
  const all = readJson<SnapshotsFile>(paths().snapshots, {});
  return all[caseId];
}

export function setSnapshot(
  caseId: string,
  snapshot: ObservationResponseSnapshot
): void {
  const p = paths();
  const all = readJson<SnapshotsFile>(p.snapshots, {});
  all[caseId] = snapshot;
  writeJson(p.snapshots, all);
}

export function listReviews(): ObservationReviewLog[] {
  return readJson<ObservationReviewLog[]>(paths().reviews, []);
}

export function appendReview(log: ObservationReviewLog): void {
  const p = paths();
  const cur = readJson<ObservationReviewLog[]>(p.reviews, []).filter(
    (r) => r.caseId !== log.caseId
  );
  cur.push(log);
  writeJson(p.reviews, cur);
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
  return readJson<RealSamplesFile>(paths().realSamples, { samples: [] }).samples;
}

/** Resolved paths for debugging / docs */
export function getStoragePaths(): ReturnType<typeof paths> {
  return paths();
}
