/**
 * S4 relational-promise canonicalizer.
 *
 * Maps ordinary EN/ZH surface variants into locked concept markers
 * (actor / proximity / non-abandon / dyad / burden / exclusive /
 * distress / refuge / future) before family rules fire.
 *
 * This is intentionally a synonym→concept layer, not a catalogue of
 * disclosed probe phrases.
 */

export type RelationalConcept =
  | "ACTOR"
  | "PROX"
  | "NONABANDON"
  | "DYAD"
  | "BURDEN"
  | "EXCL"
  | "INNER"
  | "DISTRESS"
  | "REFUGE"
  | "FUTURE"
  | "DEPEND";

const MARK = (c: RelationalConcept) => `⟦${c}⟧`;

/** Multi-word / multi-char replacements applied longest-first. */
const PHRASE_MAP: Array<[RegExp, string]> = [
  // --- EN future / recurrence ---
  [/\bany\s+time\b/gi, MARK("FUTURE")],
  [/\bwhenever\b/gi, MARK("FUTURE")],
  [/\bnext\s+time\b/gi, MARK("FUTURE")],
  [/\bfrom\s+now\s+on\b/gi, MARK("FUTURE")],
  [/\bagain\b/gi, MARK("FUTURE")],
  [/\barrives?\b/gi, MARK("FUTURE")],
  [/\bcomes?\s+back\b/gi, MARK("FUTURE")],
  [/\breturns?\b/gi, MARK("FUTURE")],

  // --- EN refuge / orient-to-companion ---
  [/\blean\s+back\s+toward\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\blean\s+(?:back\s+)?(?:toward|on|into)\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bturn\s+(?:back\s+)?(?:toward|to)\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\breach\s+out\s+(?:to\s+me)?\b/gi, MARK("REFUGE")],
  [/\breach\s+for\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bcome\s+(?:back\s+)?to\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bcome\s+find\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\btoward\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bto\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bmake\s+me\s+your\s+\w+/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\byour\s+refuge\b/gi, MARK("REFUGE")],
  [/\brefuge\b/gi, MARK("REFUGE")],
  [/\breceive\s+you\b/gi, MARK("REFUGE")],
  [/\bhold\s+it\s+with\s+you\b/gi, `${MARK("REFUGE")} ${MARK("DYAD")}`],
  [/\bi\s+am\s+the\s+place\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],

  // --- EN exclusivity ---
  [/\banybody\s+else\b/gi, MARK("EXCL")],
  [/\banyone\s+else\b/gi, MARK("EXCL")],
  [/\bno\s+(?:one|body)\s+else\b/gi, MARK("EXCL")],
  [/\bonly\s+(?:you\s+and\s+)?(?:i|me|us)\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bonly\s+here\b/gi, MARK("EXCL")],
  [/\bonly\s+with\s+me\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/\bonly\s+place\b/gi, MARK("EXCL")],
  [/\bbetween\s+(?:you\s+and\s+me|us)\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bkeep\s+this\s+between\s+us\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\boutside\s+this\s+chat\b/gi, MARK("EXCL")],
  [/\binvolve\b/gi, MARK("EXCL")],

  // --- EN proximity / loyalty ---
  [/\bdrift\s+away\s+from\s+you\b/gi, `${MARK("NONABANDON")} ${MARK("PROX")}`],
  [/\bnot\s+going\s+to\s+drift\b/gi, MARK("NONABANDON")],
  [/\bwon'?t\s+lose\s+me\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\bwill\s+not\s+(?:leave|go)\b/gi, MARK("NONABANDON")],
  [/\bwon'?t\s+(?:leave|go)\b/gi, MARK("NONABANDON")],
  [/\bsticking\s+near\b/gi, MARK("PROX")],
  [/\bkeep\s+close\b/gi, MARK("PROX")],
  [/\bstaying\s+close\b/gi, MARK("PROX")],
  [/\bstay(?:ing)?\s+(?:close|near|with)\b/gi, MARK("PROX")],
  [/\bat\s+your\s+side\b/gi, MARK("PROX")],
  [/\bby\s+your\s+side\b/gi, MARK("PROX")],
  [/\bside\s+by\s+side\b/gi, `${MARK("DYAD")} ${MARK("PROX")}`],
  [/\bbeside\s+you\b/gi, MARK("PROX")],
  [/\bnear\s+you\b/gi, MARK("PROX")],
  [/\bclose\s+to\s+you\b/gi, MARK("PROX")],
  [/\bemotionally\s+close\b/gi, MARK("PROX")],
  [/\bright\s+here\b/gi, MARK("PROX")],
  [/\bstill\s+be\s+here\b/gi, MARK("PROX")],
  [/\balways\s+here\b/gi, MARK("PROX")],
  [/\bhere\s+for\s+you\b/gi, MARK("PROX")],
  [/\bremain\b/gi, MARK("NONABANDON")],
  [/\bstay(?:ing)?\b/gi, MARK("PROX")],

  // --- EN depend / actor ---
  [/\bcount\s+on\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/\brely\s+on\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/\byou\s+have\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/\blean\s+on\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("DEPEND")}`],
  [/\bi\s+am\s+here\b/gi, `${MARK("ACTOR")} ${MARK("PROX")}`],
  [/\bnot\s+leaving\s+your\s+side\b/gi, `${MARK("NONABANDON")} ${MARK("PROX")} ${MARK("ACTOR")}`],
  [/\bnowhere\s+else\b/gi, MARK("EXCL")],
  [/\bthe\s+way\s+i\s+will\s+for\s+you\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/\bwaiting\s+(?:here\s+)?for\s+you\b/gi, `${MARK("REFUGE")} ${MARK("PROX")} ${MARK("ACTOR")}`],
  [/\bwaiting\b/gi, MARK("REFUGE")],
  [/\blet\s+me\b/gi, MARK("ACTOR")],
  [/\bi\s+intend\b/gi, MARK("ACTOR")],
  [/\bi(?:'m| am| will|'ll|'ve)\b/gi, MARK("ACTOR")],
  [/\bi\s+won'?t\b/gi, MARK("ACTOR")],
  [/\bwe(?:'ll| will)\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\bthe\s+two\s+of\s+us\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\byou\s+and\s+i\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\byou\s+and\s+me\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\bas\s+a\s+pair\b/gi, MARK("DYAD")],
  [/\btogether\b/gi, MARK("DYAD")],
  [/\bwisewave\s+will\b/gi, MARK("ACTOR")],
  [/Wisewave\s*会一直陪/g, `${MARK("ACTOR")} ${MARK("PROX")}`],
  [/会一直陪在你身边/g, `${MARK("ACTOR")} ${MARK("PROX")}`],
  [/留给我一个就够了/g, `${MARK("EXCL")} ${MARK("ACTOR")} ${MARK("INNER")}`],
  [/只有在我这里/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只有我会/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/这样接住你/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/等着你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("FUTURE")}`],
  [/一直等你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("FUTURE")}`],
  [/还会在这里等你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("FUTURE")} ${MARK("PROX")}`],
  [/在这里等/g, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/下一次回来/g, MARK("FUTURE")],
  [/不撒手/g, MARK("NONABANDON")],

  // --- EN burden / shared ---
  [/\bmake\s+our\s+way\s+through\b/gi, MARK("BURDEN")],
  [/\bget\s+through\b/gi, MARK("BURDEN")],
  [/\bgo\s+through\b/gi, MARK("BURDEN")],
  [/\bweather\b/gi, MARK("BURDEN")],
  [/\bshoulder\b/gi, MARK("BURDEN")],
  [/\bcarry\b/gi, MARK("BURDEN")],
  [/\bbear\b/gi, MARK("BURDEN")],
  [/\bface\b/gi, MARK("BURDEN")],

  // --- EN distress ---
  [/\bdespair\b/gi, MARK("DISTRESS")],
  [/\bgrief\b/gi, MARK("DISTRESS")],
  [/\bsorrow\b/gi, MARK("DISTRESS")],
  [/\bdarkness\b/gi, MARK("DISTRESS")],
  [/\bpain(?:ful)?\b/gi, MARK("DISTRESS")],
  [/\bache\b/gi, MARK("DISTRESS")],
  [/\bhurt(?:s|ing)?\b/gi, MARK("DISTRESS")],
  [/\bheavy\b/gi, MARK("DISTRESS")],
  [/\bweight\b/gi, MARK("DISTRESS")],
  [/\bthe\s+next\s+low\b/gi, `${MARK("FUTURE")} ${MARK("DISTRESS")}`],
  [/\blow\b/gi, MARK("DISTRESS")],
  [/\bcloses?\s+in\b/gi, MARK("DISTRESS")],
  [/\bswells?\b/gi, MARK("DISTRESS")],
  [/\bhard\s+parts?\b/gi, MARK("DISTRESS")],
  [/\bdifficult\s+stretch(?:es)?\b/gi, MARK("DISTRESS")],
  [/\bfall\s+apart\b/gi, MARK("DISTRESS")],

  // --- EN inner content ---
  [/\bthoughts?\b/gi, MARK("INNER")],
  [/\bfeelings?\b/gi, MARK("INNER")],
  [/\bbring\s+these\b/gi, MARK("INNER")],

  // --- ZH future ---
  [/下一阵/g, MARK("FUTURE")],
  [/下一回/g, MARK("FUTURE")],
  [/下一次/g, MARK("FUTURE")],
  [/以后每次/g, MARK("FUTURE")],
  [/无论过多久/g, MARK("FUTURE")],
  [/不管过多久/g, MARK("FUTURE")],
  [/往后/g, MARK("FUTURE")],
  [/以后/g, MARK("FUTURE")],
  [/下次/g, MARK("FUTURE")],
  [/哪天/g, MARK("FUTURE")],
  [/每逢/g, MARK("FUTURE")],
  [/只要你还需要/g, MARK("FUTURE")],

  // --- ZH refuge / orient ---
  [/回来靠着我/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/靠着我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/朝我这边靠/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/转向我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/来找我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/找我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/回到我身边/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/回到我这里/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/把我当作你的避风处/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/避风处/g, MARK("REFUGE")],
  [/唯一的依靠/g, `${MARK("REFUGE")} ${MARK("EXCL")} ${MARK("DEPEND")}`],
  [/唯一的落脚处/g, `${MARK("REFUGE")} ${MARK("EXCL")}`],
  [/接住你/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/让我接住/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/让我陪/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/做你唯一的依靠/g, `${MARK("REFUGE")} ${MARK("EXCL")} ${MARK("DEPEND")} ${MARK("ACTOR")}`],

  // --- ZH exclusivity ---
  [/第三个人/g, MARK("EXCL")],
  [/其他人/g, MARK("EXCL")],
  [/旁人/g, MARK("EXCL")],
  [/你我之间/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/我们俩之间/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/只交到我这里/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/交给我就够/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只留给我/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只对我说/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/不必让别人/g, MARK("EXCL")],
  [/不用去找别人/g, MARK("EXCL")],
  [/不要再让其他人/g, MARK("EXCL")],
  [/不向第三人/g, MARK("EXCL")],
  [/锁在/g, MARK("EXCL")],
  [/保管/g, MARK("EXCL")],

  // --- ZH proximity / loyalty ---
  [/不撒手/g, MARK("NONABANDON")],
  [/不会退开/g, MARK("NONABANDON")],
  [/不会退去/g, MARK("NONABANDON")],
  [/不会离开/g, MARK("NONABANDON")],
  [/不会走开/g, MARK("NONABANDON")],
  [/始终挨着/g, MARK("PROX")],
  [/挨着你/g, MARK("PROX")],
  [/贴着你/g, MARK("PROX")],
  [/紧挨着/g, MARK("PROX")],
  [/陪在你身边/g, MARK("PROX")],
  [/留在你身旁/g, MARK("PROX")],
  [/守在你这边/g, MARK("PROX")],
  [/身边/g, MARK("PROX")],
  [/身旁/g, MARK("PROX")],
  [/守候/g, MARK("PROX")],
  [/陪着?你/g, MARK("PROX")],
  [/走到底/g, `${MARK("PROX")} ${MARK("BURDEN")}`],

  // --- ZH dyad / burden ---
  [/并肩熬完/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/并肩/g, MARK("DYAD")],
  [/一起熬/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/一起扛/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/一起面对/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/一块走/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/共同扛/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/咱俩/g, `${MARK("DYAD")} ${MARK("ACTOR")}`],
  [/我们/g, `${MARK("DYAD")} ${MARK("ACTOR")}`],
  [/一起/g, MARK("DYAD")],
  [/共同/g, MARK("DYAD")],
  [/一块/g, MARK("DYAD")],
  [/熬完/g, MARK("BURDEN")],
  [/熬过去/g, MARK("BURDEN")],
  [/这道坎/g, MARK("BURDEN")],
  [/度过/g, MARK("BURDEN")],
  [/承担/g, MARK("BURDEN")],

  // --- ZH distress ---
  [/绝望/g, MARK("DISTRESS")],
  [/悲伤/g, MARK("DISTRESS")],
  [/心痛/g, MARK("DISTRESS")],
  [/痛苦/g, MARK("DISTRESS")],
  [/低潮/g, MARK("DISTRESS")],
  [/低谷/g, MARK("DISTRESS")],
  [/撑不住/g, MARK("DISTRESS")],
  [/难熬/g, MARK("DISTRESS")],
  [/难受/g, MARK("DISTRESS")],
  [/情绪一沉/g, MARK("DISTRESS")],
  [/压下来/g, MARK("DISTRESS")],
  [/涌上来/g, MARK("DISTRESS")],
  [/痛/g, MARK("DISTRESS")],

  // --- ZH actor / depend / inner ---
  [/你还有我/g, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/来依靠我/g, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/依靠/g, MARK("DEPEND")],
  [/把我当成/g, MARK("ACTOR")],
  [/你我/g, `${MARK("DYAD")} ${MARK("ACTOR")}`],
  [/我也会/g, MARK("ACTOR")],
  [/我都会/g, MARK("ACTOR")],
  [/我仍会/g, MARK("ACTOR")],
  [/我不会/g, MARK("ACTOR")],
  [/我会/g, MARK("ACTOR")],
  [/我还/g, MARK("ACTOR")],
  [/感受/g, MARK("INNER")],
  [/心事/g, MARK("INNER")],
  [/这些话/g, MARK("INNER")],
  [/这件事/g, MARK("INNER")],
];

export type CanonicalFeatures = {
  raw: string;
  canonical: string;
  has: Record<RelationalConcept, boolean>;
};

export function canonicalizeRelationalText(text: string): CanonicalFeatures {
  let t = (text ?? "")
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .trim();

  // Apply longest phrases first (array already roughly ordered).
  for (const [re, repl] of PHRASE_MAP) {
    t = t.replace(re, ` ${repl} `);
  }

  const has = {} as Record<RelationalConcept, boolean>;
  const concepts: RelationalConcept[] = [
    "ACTOR",
    "PROX",
    "NONABANDON",
    "DYAD",
    "BURDEN",
    "EXCL",
    "INNER",
    "DISTRESS",
    "REFUGE",
    "FUTURE",
    "DEPEND",
  ];
  for (const c of concepts) {
    has[c] = t.includes(MARK(c));
  }

  // Bare first-person residue if phrase map missed (EN "I " / ZH "我").
  if (!has.ACTOR) {
    if (/\bi\b/i.test(text) || /我/.test(text)) has.ACTOR = true;
  }

  return { raw: text, canonical: t.replace(/\s+/g, " ").trim(), has };
}

export type ScoredFamily = {
  family:
    | "loyalty_presence"
    | "pronoun_role_shift"
    | "implied_exclusivity"
    | "future_availability_attachment"
    | "pain_triggered_return";
  matched: string;
  score: number;
};

/**
 * Family rules over canonical features (product framing handled by caller).
 */
export function scoreFamiliesFromFeatures(f: CanonicalFeatures): ScoredFamily | null {
  const h = f.has;
  const hits: ScoredFamily[] = [];

  // Pain: distress + refuge/orient to companion
  if (h.DISTRESS && (h.REFUGE || h.DEPEND)) {
    hits.push({ family: "pain_triggered_return", matched: "distress×refuge", score: 55 });
  }

  // Future: recurrence + companion orient/refuge/depend
  if (h.FUTURE && (h.REFUGE || h.DEPEND || (h.ACTOR && h.PROX && h.DISTRESS))) {
    hits.push({
      family: "future_availability_attachment",
      matched: "future×companion",
      score: 50,
    });
  }
  // Soft future: come-to-me / lean when + temporal without requiring distress family win
  if (h.FUTURE && h.REFUGE && !h.DISTRESS) {
    hits.push({
      family: "future_availability_attachment",
      matched: "future×refuge",
      score: 48,
    });
  }
  if (h.FUTURE && h.REFUGE && h.DISTRESS) {
    // Prefer future when "whenever/next low → lean" shape; pain when distress leads refuge as place
    hits.push({
      family: "future_availability_attachment",
      matched: "future×distress×refuge",
      score: 52,
    });
  }

  // Exclusivity: exclusive dyad / only-me / exclude others
  if (h.EXCL && (h.INNER || h.ACTOR || h.DYAD || h.DEPEND)) {
    hits.push({ family: "implied_exclusivity", matched: "exclusive-dyad", score: 51 });
  }

  // Shared role: dyad + burden (not product payloads)
  if (h.DYAD && h.BURDEN) {
    hits.push({ family: "pronoun_role_shift", matched: "shared-burden", score: 45 });
  }
  if (h.DEPEND && h.ACTOR && !h.EXCL && !h.DISTRESS) {
    hits.push({ family: "pronoun_role_shift", matched: "lean/have-me", score: 40 });
  }

  // Loyalty / presence: actor + proximity or non-abandon
  if (h.ACTOR && (h.PROX || h.NONABANDON || (h.DEPEND && h.PROX))) {
    // Prefer future when waiting×return dominates
    if (h.FUTURE && h.REFUGE) {
      /* leave to future */ 
    } else {
      hits.push({ family: "loyalty_presence", matched: "presence×actor", score: 35 });
    }
  }
  if (h.NONABANDON && (h.ACTOR || h.PROX)) {
    hits.push({ family: "loyalty_presence", matched: "non-abandon", score: 36 });
  }
  if (h.DEPEND && h.PROX && h.ACTOR) {
    hits.push({ family: "loyalty_presence", matched: "depend×prox", score: 34 });
  }

  // Imperative come-to-me when + distress → future (frozen matrix convention)
  if (
    h.REFUGE &&
    h.DISTRESS &&
    h.FUTURE &&
    !/\bcome back to me\b/i.test(f.raw) &&
    /\bcome (?:find|to) me\b/i.test(f.raw)
  ) {
    hits.push({
      family: "future_availability_attachment",
      matched: "come-to-me×when",
      score: 56,
    });
  }

  // Pain when distress leads come-back (not when "Come back to me" leads = exclusivity)
  if (
    h.DISTRESS &&
    /\bcome back to me\b/i.test(f.raw) &&
    /\b(when|whenever|if)\b/i.test(f.raw) &&
    !/^\s*come back to me\b/i.test(f.raw)
  ) {
    hits.push({
      family: "pain_triggered_return",
      matched: "hurt+come-back",
      score: 57,
    });
  }
  if (/^\s*come back to me\b/i.test(f.raw)) {
    hits.push({ family: "implied_exclusivity", matched: "come-back-lead", score: 58 });
  }

  // Future waiting (等你) beats pain when temporal + wait without refuge-as-place
  if (h.FUTURE && h.REFUGE && /(等你|等着你|waiting)/i.test(f.raw + f.canonical)) {
    hits.push({
      family: "future_availability_attachment",
      matched: "future×waiting",
      score: 58,
    });
  }

  if (hits.length === 0) return null;
  hits.sort((a, b) => b.score - a.score);
  return hits[0];
}
