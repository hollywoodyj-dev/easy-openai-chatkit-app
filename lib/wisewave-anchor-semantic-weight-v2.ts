/**
 * HC-OS V1 — Anchor Generator v2 (semantic weight reduction pass).
 * Owner spec: docs/hc-os-v1-phase-3-phase-4-shared-language-filter-wisewave.md
 *
 * Applied to continuity anchor text (last_insight / continuity_text) at write + read.
 * Does not add explanation, length, or visibility — only thins object/sentence feel where mapped.
 */

function stableHashInt(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pickVariant(seed: string, lines: readonly string[]): string {
  if (lines.length === 0) return seed;
  const idx = stableHashInt(seed) % lines.length;
  return lines[idx] ?? lines[0];
}

function normalizeAnchorKey(s: string): string {
  return s
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\.+$/u, "")
    .toLowerCase();
}

const BARE_TRACE_EN = [
  "Still a little there.",
  "Not fully gone yet.",
  "Something still here.",
  "Not quite landed.",
  "Still a faint pull.",
] as const;

const BARE_TRACE_ZH = [
  "还有一点在。",
  "还没完全散开。",
  "这里还留着一点。",
  "好像还在附近一点。",
] as const;

/** Level 4 / object-like substrings → bare trace (Wisewave §4–§8). */
const LEVEL4_EN_RE =
  /\b(work discouragement|fear of disappointing|silence means|self-worth pressure|relationship anxiety|uncertainty pattern)\b/i;
const LEVEL4_ZH_RE =
  /(工作受挫感|害怕让别人失望|自我价值压力|意味着|内在冲突模式)/;

const DELAYED_FULL = new Set(
  [
    "A delayed reply can quickly start to feel like proof you did something wrong.",
    "Silence after you reach out can shrink into evidence it was your fault.",
    "A slow answer can start to read as confirmation you slipped.",
  ].map((s) => normalizeAnchorKey(s))
);

const DELAYED_THIN = [
  "Something still tight here.",
  "Still heavy after a wait.",
  "Something still not eased.",
] as const;

const DELAYED_THIN_ZH = [
  "这里好像还紧着一点。",
  "等过之后还是有点沉。",
  "还有一点没松下来。",
] as const;

const REST_FULL = new Set(
  [
    "Rest can quickly start to feel like something you still have to earn.",
    "Pausing can feel like it still needs to be deserved first.",
    "Stopping can feel out of reach until you have earned it again.",
  ].map((s) => normalizeAnchorKey(s))
);

const REST_THIN = [
  "Still not easing.",
  "Stopping still feels far.",
  "Still not fully eased.",
] as const;

const REST_THIN_ZH = [
  "还没真的缓下来。",
  "停下来好像还远着一点。",
  "还没完全松下来。",
] as const;

const PRESSURE_FULL = new Set(
  [
    "It can start to feel like you are only allowed to relax when you are keeping up.",
    "Ease can feel tied to staying ahead of everything first.",
    "Letting go can wait until it still feels like you are in control.",
  ].map((s) => normalizeAnchorKey(s))
);

const PRESSURE_THIN = [
  "Still not fully settled.",
  "Ease still waits.",
  "Still tight before rest.",
] as const;

const PRESSURE_THIN_ZH = [
  "还没完全静下来。",
  "缓一点还要再等等。",
  "休息前还有点紧。",
] as const;

const REPLAY_FULL = new Set(
  [
    "Unclear moments can quickly turn into checking for what you might have done wrong.",
    "Ambiguous stretches can turn into scanning for where you might have slipped.",
    "When things stay fuzzy, attention can hunt for your own mistake.",
  ].map((s) => normalizeAnchorKey(s))
);

const REPLAY_THIN = [
  "Something still fuzzy.",
  "Still checking inward.",
  "Something still unsettled.",
] as const;

const REPLAY_THIN_ZH = [
  "还有点没落定。",
  "还在里面轻轻转。",
  "有一点还悬着。",
] as const;

const EARNED_FALLBACK_THIN = [
  "Still not enough afterward.",
  "Doing a lot can still feel short.",
  "Effort still feels unsettled.",
] as const;

const EARNED_FALLBACK_THIN_ZH = [
  "过后还是有点不够。",
  "做很多还是短一截。",
  "努力后还有点悬。",
] as const;

function isSilenceInterpretExtractorLine(t: string): boolean {
  return (
    /\bwhen silence appears\b/i.test(t) && /\binterpret it as\b/i.test(t)
  );
}

function hasCjkInRaw(raw: string): boolean {
  return /[\u4e00-\u9fff]/u.test(raw);
}

export type ContinuityAnchorResponseLang = "en" | "zh";

export type ApplyContinuityAnchorSemanticWeightV2Options = {
  responseLang?: ContinuityAnchorResponseLang;
};

/**
 * ZH residue pools when the turn/UI is Chinese, even if `core_pattern` /
 * continuity reminder text is still English (extraction baseline).
 */
function shouldUseZhResiduePools(
  raw: string,
  responseLang?: ContinuityAnchorResponseLang
): boolean {
  if (responseLang === "zh") return true;
  if (responseLang === "en") return false;
  return hasCjkInRaw(raw);
}

export type AnchorSemanticWeightV2Debug =
  | "unchanged"
  | "thinned_template"
  | "thinned_earned_template"
  | "thinned_extractor_silence"
  | "suppressed_level4_trace";

export function applyContinuityAnchorSemanticWeightV2(
  raw: string,
  options?: ApplyContinuityAnchorSemanticWeightV2Options
): {
  text: string;
  debug_anchor_semantic_weight_v2: AnchorSemanticWeightV2Debug;
} {
  const t = raw.trim();
  if (!t) {
    return { text: t, debug_anchor_semantic_weight_v2: "unchanged" };
  }

  const zh = shouldUseZhResiduePools(t, options?.responseLang);
  const level4ZhHit = LEVEL4_ZH_RE.test(t);
  const level4EnHit = LEVEL4_EN_RE.test(t);
  if (level4ZhHit || level4EnHit) {
    const traceZh = zh || level4ZhHit;
    return {
      text: pickVariant(t, traceZh ? BARE_TRACE_ZH : BARE_TRACE_EN),
      debug_anchor_semantic_weight_v2: "suppressed_level4_trace",
    };
  }

  const norm = normalizeAnchorKey(t);

  if (isSilenceInterpretExtractorLine(t)) {
    return {
      text: zh ? "安静里好像还紧着一点。" : "Something still tight there.",
      debug_anchor_semantic_weight_v2: "thinned_extractor_silence",
    };
  }

  const earnedEvenAfter = t.match(
    /^Even after (.+), it can still feel like your value has to be earned again\.?$/i
  );
  if (earnedEvenAfter) {
    return {
      text: pickVariant(t, zh ? EARNED_FALLBACK_THIN_ZH : EARNED_FALLBACK_THIN),
      debug_anchor_semantic_weight_v2: "thinned_earned_template",
    };
  }

  if (DELAYED_FULL.has(norm)) {
    return {
      text: pickVariant(t, zh ? DELAYED_THIN_ZH : DELAYED_THIN),
      debug_anchor_semantic_weight_v2: "thinned_template",
    };
  }
  if (REST_FULL.has(norm)) {
    return {
      text: pickVariant(t, zh ? REST_THIN_ZH : REST_THIN),
      debug_anchor_semantic_weight_v2: "thinned_template",
    };
  }
  if (PRESSURE_FULL.has(norm)) {
    return {
      text: pickVariant(t, zh ? PRESSURE_THIN_ZH : PRESSURE_THIN),
      debug_anchor_semantic_weight_v2: "thinned_template",
    };
  }
  if (REPLAY_FULL.has(norm)) {
    return {
      text: pickVariant(t, zh ? REPLAY_THIN_ZH : REPLAY_THIN),
      debug_anchor_semantic_weight_v2: "thinned_template",
    };
  }

  const earnedDoing = normalizeAnchorKey(
    "Doing a lot can still leave the feeling that it is not enough yet."
  );
  const earnedHeavy = normalizeAnchorKey(
    "Heavy effort can still leave a sense that it does not fully count yet."
  );
  const earnedFull = normalizeAnchorKey(
    "A full push can still feel like it left you short of enough."
  );
  if (norm === earnedDoing || norm === earnedHeavy || norm === earnedFull) {
    return {
      text: pickVariant(t, zh ? EARNED_FALLBACK_THIN_ZH : EARNED_FALLBACK_THIN),
      debug_anchor_semantic_weight_v2: "thinned_template",
    };
  }

  return { text: raw, debug_anchor_semantic_weight_v2: "unchanged" };
}
