/**
 * Phase 4 — Continue list (Tree: max 3, distinct unfinished directions, no filler).
 * Internal DB model remains Thread; user-facing concept is Continue.
 */

import { isContinueReentryContinuationUtterance } from "@/lib/wisewave-continue-reentry-turn";
import { looksUtilitarianOrFactual } from "@/lib/wisewave-milestone-h-micro-awareness";

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
  // Lumen watchpoint: "a little still near" style is too mist-like to headline Continue.
  if (/^a\s+little\s+still\s+(near|close)\b/i.test(lower)) return true;
  if (/still\s+not\s+eased/i.test(lower)) return true;
  return false;
}

/** Obvious topic buckets / pressure nouns (EN fragments). */
const TOPIC_LIKE_EN_RE =
  /\b(work stress|relationship issue|self-?worth pressure|inner conflict|anxiety pattern)\b/i;

/** Conceptual / topic-like ZH (narrow). */
const TOPIC_LIKE_ZH_RE = /(工作受挫|关系问题|自我价值|内在冲突|焦虑模式|议题)/;
const LOW_SPECIFICITY_RESIDUE_RE =
  /^(still|something|not quite|a little|this still|not fully)\b/i;
const GENERIC_RESIDUE_NEAR_RE = /\b(still|something|little|near|close|quiet|not|fully|yet|here)\b/gi;
/** Labels that carry unfinished emotional direction (Phase 4 traces + anchor residues); not utilitarian/social. */
const STRONG_CONTINUE_FAMILY_EN_RE =
  /\b(reply|replies|silence|silent|rest|resting|earned|earn|worth|enough|guilt|guilty|wrong|work|pressure|rushed|sleep|family|partner|grief|fear|blame|settled after|turning back|tight|heavy|weight|carry|carrying|inward|pull|pulls|wait|waiting|delayed|delay|late|rush|settled|settling|tension|anxiet|anxious|prove|proving|deserve|deserving|ease|eased|easing|landed|stopping|far|underneath|not fully gone)\b/i;
const STRONG_CONTINUE_FAMILY_ZH_RE =
  /(回复|回覆|沉默|休息|配得|内疚|自责|工作|压力|匆忙|睡|家人|伴侣|失去|害怕|责怪|没稳住|紧|沉|重量|往里|拉|等|拖延|晚|内疚|自责|着急|安定|松|停|远|底下)/;

/** Greetings / polite one-liners (do not spend Continue budget). */
const GREETING_OR_POLITE_ONE_LINER_RE =
  /^(hi|hey|hello|howdy|yo|sup|thanks\.?|thank you\.?|thx\.?|ty\.?|ok\.?|okay\.?|cool\.?|great\.?|perfect\.?|sounds good\.?|got it\.?|bye\.?|good talk\.?|cheers\.?|np\.?|no problem\.?|will do\.?|sounds like a plan\.?)\s*$/i;

/** Scheduling / logistics / coordination (utilitarian adjacent; Lumen Batch 3). */
const COORDINATION_OR_LOGISTICS_RE =
  /\b(tomorrow|tonight|today)\s+at\b|\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b|\b(send me|email me|text me)\s+(the|an|your|a)\b|\bwhen you can\b|\bworks\s+for\s+me\b|\blet['']?s\s+do\b|\binstead\b[\s.]*$|\b(address|location|calendar|invite|rsvp|zoom|meet)\b|\b\d{1,2}\s*[:.]\s*\d{2}\s*(am|pm)?\b|\b\d{1,2}\s*(am|pm)\b/i;
const WEAK_STRUCTURE_TOKEN_RE = /\b(unknown|uncertain|none|generic|fallback|n\/a)\b/i;

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
  emotionSignal?: string | null;
  interpretationPattern?: string | null;
  tensionDirection?: string | null;
  intensity?: string | null;
};

function hasThreadStructureSignal(t: ContinueListSourceRow): boolean {
  const e = (t.emotionSignal ?? "").trim();
  const i = (t.interpretationPattern ?? "").trim();
  const d = (t.tensionDirection ?? "").trim();
  const intensity = (t.intensity ?? "").trim().toLowerCase();
  const meaningful = (v: string): boolean => v.length > 0 && !WEAK_STRUCTURE_TOKEN_RE.test(v);
  const hasInterpret = meaningful(i);
  const hasTension = meaningful(d);
  const hasEmotion = meaningful(e);
  const strongIntensity = intensity === "medium" || intensity === "high";
  return (
    hasInterpret ||
    hasTension ||
    // Emotion-only signal needs at least medium intensity to count as meaningful.
    (hasEmotion && strongIntensity)
  );
}

function isLowSpecificityResidueLabel(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  const lower = normalizeLabel(s);
  if (!LOW_SPECIFICITY_RESIDUE_RE.test(lower)) return false;
  if (
    STRONG_CONTINUE_FAMILY_EN_RE.test(lower) ||
    STRONG_CONTINUE_FAMILY_ZH_RE.test(s)
  ) {
    return false;
  }
  const genericWords = lower.match(GENERIC_RESIDUE_NEAR_RE) ?? [];
  return genericWords.length >= 2;
}

/** Exported for Phase 6 instrumentation (Continue surface quality); not a user-facing API. */
export function isStrongEmotionalReturnLabel(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  const lower = normalizeLabel(s);
  return (
    STRONG_CONTINUE_FAMILY_EN_RE.test(lower) ||
    STRONG_CONTINUE_FAMILY_ZH_RE.test(s)
  );
}

/**
 * Phase 6 — Headlines that read as generic trace residue next to a clear strong family line
 * (Lumen: mixed-quality drawer / diluted earnedness). Dropped when any primary-earned row exists.
 * Keep narrow: do not list delayed-reply / replay / rest / weight / pull / inward lines here.
 */
const PHASE6_WEAKER_COMPANION_EN =
  /^(not quite landed|not quite settled yet|not fully quiet yet|still a little open|still a faint pull here|this still feels nearby|a little tension still near|something still quiet here|a little still underneath|not quite room to hold it|a little more here than fits|edges still holding something|something still waiting inside|still fuller than it looks)\.?$/i;

/** ZH trace fallbacks that are structurally “soft residue” vs direction-bearing traces. */
const PHASE6_WEAKER_COMPANION_ZH =
  /^(这里还留着一点|好像还有一点在|还有一点没散开|似乎还轻轻在这里|还没有完全落下|这里还轻轻停着什么|还没完全安静下来|似乎还有一点敞着|还带着一点重量|好像还有一点余波|那个感觉似乎还在附近|这里还留着一点那个感觉)$/u;

function isPhase6WeakerCompanionLabel(raw: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  const lower = normalizeLabel(s);
  if (PHASE6_WEAKER_COMPANION_EN.test(s) || PHASE6_WEAKER_COMPANION_EN.test(lower))
    return true;
  if (PHASE6_WEAKER_COMPANION_ZH.test(s.trim())) return true;
  return false;
}

function isPhase6PrimaryEarnedLabel(
  raw: string,
  row: ContinueListSourceRow
): boolean {
  if (isPhase6WeakerCompanionLabel(raw)) return false;
  if (isStrongEmotionalReturnLabel(raw)) return true;
  if (hasThreadStructureSignal(row)) return true;
  return false;
}

/**
 * Phase 5 Batch 3 + Phase 6: suppress Continue when the latest user line is utilitarian /
 * social / coordination — avoids decorative Continue after shallow tails.
 *
 * Phase 6: greeting/coordination first; then **carve out** low-verbal Continue re-entry
 * acks (`isContinueReentryContinuationUtterance`) so `looksUtilitarianOrFactual`'s
 * short-message rule does not hide the drawer after "yeah" / "mm" (strong-path protection).
 */
export function shouldSuppressContinueListForLastUserMessage(message: string): boolean {
  const t = message.trim();
  if (!t) return false;
  if (GREETING_OR_POLITE_ONE_LINER_RE.test(t)) return true;
  if (COORDINATION_OR_LOGISTICS_RE.test(t)) return true;
  if (isContinueReentryContinuationUtterance(t)) return false;
  if (looksUtilitarianOrFactual(t)) return true;
  return false;
}

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
  const out: Array<{ id: string; label: string; row: T }> = [];

  for (const t of sorted) {
    if (out.length >= CONTINUE_LIST_MAX) break;
    const raw = t.label?.trim() ?? "";
    if (!raw || QUIET_TRACE_RE.test(raw)) continue;
    if (isWeakGenericResidueLabel(raw)) continue;
    if (TOPIC_LIKE_EN_RE.test(raw) || TOPIC_LIKE_ZH_RE.test(raw)) continue;
    const lowSpecificity = isLowSpecificityResidueLabel(raw);
    const strongEmotionalReturn = isStrongEmotionalReturnLabel(raw);
    // Phase 5: in low-signal/shallow cases, prefer showing no Continue over decorative residue.
    if (lowSpecificity && !hasThreadStructureSignal(t) && !strongEmotionalReturn) continue;

    const label = raw.slice(0, 200);
    let tooSimilar = false;
    const existingLowSpecificityCount = out.filter((x) =>
      isLowSpecificityResidueLabel(x.label)
    ).length;
    // Phase 5: never show multiple low-specificity residue options together.
    if (lowSpecificity && existingLowSpecificityCount >= 1) continue;
    for (const existing of out) {
      if (labelsTooSimilar(label, existing.label)) {
        tooSimilar = true;
        break;
      }
    }
    if (tooSimilar) continue;

    out.push({ id: t.id, label, row: t });
  }

  const anyPrimaryEarned = out.some((x) =>
    isPhase6PrimaryEarnedLabel(x.label, x.row)
  );
  const filtered = anyPrimaryEarned
    ? out.filter((x) => !isPhase6WeakerCompanionLabel(x.label))
    : out;

  return filtered.map(({ id, label }) => ({ id, label }));
}
