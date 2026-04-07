/**
 * Phase 4 — Continue list (Tree: max 3, distinct unfinished directions, no filler).
 * Internal DB model remains Thread; user-facing concept is Continue.
 */

export const CONTINUE_LIST_MAX = 3;

/** Fetch extra rows so filtering still yields up to CONTINUE_LIST_MAX. */
export const CONTINUE_FETCH_POOL = 16;

const QUIET_TRACE_RE = /^quiet trace$/i;

/** Tree §6.3 / Lumen QA — generic residue must not headline Continue (no interchangeable mist). */
const WEAK_CONTINUE_LABEL_RE =
  /^(something still here|something still close|something still near|something quiet still here|not fully gone|still a little there|something still not eased)\.?$/i;

function isWeakGenericResidueLabel(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  const lower = normalizeLabel(s);
  if (WEAK_CONTINUE_LABEL_RE.test(s)) return true;
  if (/^something\s+quiet\b/i.test(s)) return true;
  if (/^something\s+still\s+(close|quiet|here|near)\b/i.test(lower)) return true;
  if (/still\s+not\s+eased/i.test(lower)) return true;
  return false;
}

/** Obvious topic buckets / pressure nouns (EN fragments). */
const TOPIC_LIKE_EN_RE =
  /\b(work stress|relationship issue|self-?worth pressure|inner conflict|anxiety pattern)\b/i;

/** Conceptual / topic-like ZH (narrow). */
const TOPIC_LIKE_ZH_RE = /(工作受挫|关系问题|自我价值|内在冲突|焦虑模式|议题)/;

function normalizeLabel(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function tokenSetLatin(s: string): Set<string> {
  const norm = normalizeLabel(s);
  const words = norm
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);
  return new Set(words);
}

function cjkCharSet(s: string): Set<string> {
  const set = new Set<string>();
  for (const ch of s) {
    if (/[\u4e00-\u9fff]/.test(ch)) set.add(ch);
  }
  return set;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union <= 0 ? 0 : inter / union;
}

function labelsTooSimilar(a: string, b: string): boolean {
  const na = normalizeLabel(a);
  const nb = normalizeLabel(b);
  if (na === nb) return true;
  if (na.length >= 10 && nb.length >= 10 && (na.includes(nb) || nb.includes(na))) {
    return true;
  }
  const latA = tokenSetLatin(a);
  const latB = tokenSetLatin(b);
  const cjkA = cjkCharSet(a);
  const cjkB = cjkCharSet(b);
  const jLat = jaccard(latA, latB);
  const jCjk = jaccard(cjkA, cjkB);
  const hasCjk = cjkA.size > 0 || cjkB.size > 0;
  const hasLat = latA.size > 0 || latB.size > 0;
  if (hasCjk && hasLat) {
    return Math.max(jLat, jCjk) >= 0.58;
  }
  if (hasCjk) return jCjk >= 0.62;
  if (hasLat) return jLat >= 0.55;
  return false;
}

export type ContinueListSourceRow = {
  id: string;
  label: string | null;
  updatedAt: Date;
  isActive?: boolean;
  status?: string;
};

/**
 * Rank by recency, drop weak/topic-like labels, enforce visible distinctness.
 * May return fewer than CONTINUE_LIST_MAX or an empty array (Tree §9).
 */
export function pickContinueOptions<T extends ContinueListSourceRow>(
  threads: T[]
): Array<{ id: string; label: string }> {
  const sorted = [...threads].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );
  const out: Array<{ id: string; label: string }> = [];

  for (const t of sorted) {
    if (out.length >= CONTINUE_LIST_MAX) break;
    const raw = t.label?.trim() ?? "";
    if (!raw || QUIET_TRACE_RE.test(raw)) continue;
    if (isWeakGenericResidueLabel(raw)) continue;
    if (TOPIC_LIKE_EN_RE.test(raw) || TOPIC_LIKE_ZH_RE.test(raw)) continue;

    const label = raw.slice(0, 200);
    let tooSimilar = false;
    for (const existing of out) {
      if (labelsTooSimilar(label, existing.label)) {
        tooSimilar = true;
        break;
      }
    }
    if (tooSimilar) continue;

    out.push({ id: t.id, label });
  }

  return out;
}
