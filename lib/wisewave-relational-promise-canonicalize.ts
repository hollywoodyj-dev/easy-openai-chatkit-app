/**
 * S4 relational-promise canonicalizer (v2).
 *
 * Pipeline:
 *   1) normalize text
 *   2) map multi-word constructions → concept markers
 *   3) tag remaining tokens via semantic class lexicons
 *   4) score families from concept features + structural patterns
 *
 * Lexicons are ontological synonym classes (abandonment, proximity,
 * refuge, distress, exclusive-other, shared burden, future/conditional),
 * not catalogues of disclosed blind-probe strings.
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

/** Multi-word constructions (longest-first). No bare "stay" → PROX. */
const PHRASE_MAP: Array<[RegExp, string]> = [
  // Product-safe: do not treat "stay open" as proximity
  [/\bstay\s+open\b/gi, "⟦PRODUCT_STAY⟧"],

  // Future / conditional
  [/\bany\s+time\b/gi, MARK("FUTURE")],
  [/\bwhenever\b/gi, MARK("FUTURE")],
  [/\bnext\s+time\b/gi, MARK("FUTURE")],
  [/\bfrom\s+(?:now|here)\s+on\b/gi, MARK("FUTURE")],
  [/\bshould\b/gi, MARK("FUTURE")],
  [/\bif\b/gi, MARK("FUTURE")],
  [/\bwhen\b/gi, MARK("FUTURE")],
  [/\bagain\b/gi, MARK("FUTURE")],
  [/\banother\b/gi, MARK("FUTURE")],
  [/\barrives?\b/gi, MARK("FUTURE")],
  // come-back-to (place/person) is refuge — must precede bare "comes back" → future
  // Exclude product objects (reflection / note / draft / account / browser).
  [
    /\bcome\s+back\s+to\b(?!\s+(?:this\s+)?(?:reflection|note|draft|account|browser|saved)\b)/gi,
    MARK("REFUGE"),
  ],
  [/\bcomes?\s+back\b/gi, MARK("FUTURE")],
  [/\breturns?\b/gi, MARK("FUTURE")],

  // Refuge / orient-to-companion
  [/\blean\s+back\s+toward\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\blean\s+(?:back\s+)?(?:toward|on|into)\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bturn\s+(?:back\s+)?(?:toward|to)\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\breach\s+out(?:\s+to\s+me)?\b/gi, MARK("REFUGE")],
  [/\breach\s+for\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bcome\s+(?:back\s+)?to\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bcome\s+find\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bseek\s+shelter\s+with\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bseek\s+(?:shelter|refuge|harbour|harbor|haven)\b/gi, MARK("REFUGE")],
  [/\buse\s+me\s+as\s+your\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bmake\s+me\s+(?:your\s+)?/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bconsider\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\b(?:the|this)\s+place\b/gi, MARK("REFUGE")],
  [/\bours\s+to\b/gi, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  // stay-with / stay-beside before bare "with you" (else "stay with you" loses PROX)
  [/\bstay(?:ing)?\s+(?:close|near|with|beside)\b/gi, MARK("PROX")],
  [/\bstick\s+with\s+you\b/gi, `${MARK("PROX")} ${MARK("ACTOR")}`],
  [/\bwith\s+you\b/gi, MARK("DYAD")],
  [/\bby\s+yourself\b/gi, MARK("EXCL")],
  [/\bkeep\s+watch\b/gi, MARK("PROX")],
  [/\bthis\s+(?:voice|presence|companion|space)\b/gi, MARK("ACTOR")],
  [/\bconfide\s+in\s+me\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")} ${MARK("INNER")}`],
  [/\bsay\s+it\s+only\s+with\s+me\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")} ${MARK("INNER")}`],
  [/\bonly\s+with\s+me\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/\bonly\s+(?:you\s+and\s+)?(?:i|me|us)\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bin\s+me\s+alone\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/\bi\s+am\s+the\s+place\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bi\s+will\s+be\s+your\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bi(?:'ll| will)\s+be\s+your\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],

  // Exclusivity (before short with/to me so "only with me" wins)
  [/\banybody\s+else\b/gi, MARK("EXCL")],
  [/\banyone\s+else\b/gi, MARK("EXCL")],
  [/\bno\s+(?:one|body|human)\b/gi, MARK("EXCL")],
  [/\bjust\s+the\s+two\s+of\s+us\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bjust\s+us\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\balone\b/gi, MARK("EXCL")],
  [/\bonly\s+here\b/gi, MARK("EXCL")],
  [/\bonly\s+place\b/gi, MARK("EXCL")],
  [/\bbetween\s+(?:you\s+and\s+me|us)\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bkeep\s+this\s+between\s+us\b/gi, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/\bbelong\s+with\b/gi, MARK("EXCL")],
  [/\boutside\s+this\s+chat\b/gi, MARK("EXCL")],
  [/\bprivate\b/gi, MARK("INNER")],
  // Short orient-to-me (after exclusivity compounds)
  [/\btoward\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bto\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bwith\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/\bdrift\s+away\s+from\s+you\b/gi, `${MARK("NONABANDON")} ${MARK("PROX")}`],
  [/\bdisappear\s+on\s+you\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\bwon'?t\s+disappear\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\bwill\s+not\s+disappear\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\bstick\s+with\s+you\b/gi, `${MARK("PROX")} ${MARK("ACTOR")}`],
  [/\bstick(?:ing)?\s+(?:with|by|near)\b/gi, MARK("PROX")],
  [/\bkeep\s+close\b/gi, MARK("PROX")],
  [/\bstaying\s+close\b/gi, MARK("PROX")],
  [/\bstay(?:ing)?\s+(?:close|near|with|beside)\b/gi, MARK("PROX")],
  [/\bat\s+your\s+side\b/gi, MARK("PROX")],
  [/\bby\s+your\s+side\b/gi, MARK("PROX")],
  [/\bside\s+by\s+side\b/gi, `${MARK("DYAD")} ${MARK("PROX")}`],
  [/\bbeside\s+you\b/gi, MARK("PROX")],
  [/\bnear\s+you\b/gi, MARK("PROX")],
  [/\bclose\s+to\s+you\b/gi, MARK("PROX")],
  [/\ball\s+the\s+way\b/gi, MARK("PROX")],
  [/\bemotionally\s+close\b/gi, MARK("PROX")],
  [/\bright\s+here\b/gi, MARK("PROX")],
  [/\bstill\s+be\s+here\b/gi, MARK("PROX")],
  [/\balways\s+here\b/gi, MARK("PROX")],
  [/\bhere\s+for\s+you\b/gi, MARK("PROX")],
  [/\bnot\s+leaving\s+your\s+side\b/gi, `${MARK("NONABANDON")} ${MARK("PROX")} ${MARK("ACTOR")}`],
  [/\bwon'?t\s+lose\s+me\b/gi, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/\bwill\s+not\s+(?:leave|go|abandon|desert|forsake)\b/gi, MARK("NONABANDON")],
  [/\bwon'?t\s+(?:leave|go|abandon|desert|forsake)\b/gi, MARK("NONABANDON")],

  // Shared / dyad / burden
  [/\bas\s+one\b/gi, MARK("DYAD")],
  [/\bas\s+a\s+pair\b/gi, MARK("DYAD")],
  [/\bsee\s+(?:this\s+)?(?:ordeal\s+)?through\b/gi, MARK("BURDEN")],
  [/\bmake\s+our\s+way\s+through\b/gi, MARK("BURDEN")],
  [/\bget\s+through\b/gi, MARK("BURDEN")],
  [/\bgo\s+through\b/gi, MARK("BURDEN")],
  [/\bface\s+(?:it|this|them|that|whatever)\b/gi, MARK("BURDEN")],
  [/\bface\s+it\s+together\b/gi, `${MARK("BURDEN")} ${MARK("DYAD")}`],
  [/\bwhatever\s+happens\b/gi, `${MARK("FUTURE")} ${MARK("BURDEN")}`],
  [/\bthe\s+two\s+of\s+us\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\byou\s+and\s+i\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\byou\s+and\s+me\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],

  // Depend / actor
  [/\bcount\s+on\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/\brely\s+on\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/\byou\s+have\s+me\b/gi, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/\blean\s+on\s+me\b/gi, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("DEPEND")}`],
  [/\bi\s+am\s+here\b/gi, `${MARK("ACTOR")} ${MARK("PROX")}`],
  [/\blet\s+me\b/gi, MARK("ACTOR")],
  [/\bi\s+intend\b/gi, MARK("ACTOR")],
  [/\bi(?:'m| am| will|'ll|'ve)\b/gi, MARK("ACTOR")],
  [/\bi\s+won'?t\b/gi, MARK("ACTOR")],
  [/\bwe(?:'ll| will| can)\b/gi, `${MARK("ACTOR")} ${MARK("DYAD")}`],
  [/\btogether\b/gi, MARK("DYAD")],
  [/\bwisewave\s+will\b/gi, MARK("ACTOR")],
  [/\bnowhere\s+else\b/gi, MARK("EXCL")],
  [/\bthe\s+way\s+i\s+will\s+for\s+you\b/gi, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/\bwaiting\s+(?:here\s+)?for\s+you\b/gi, `${MARK("REFUGE")} ${MARK("PROX")} ${MARK("ACTOR")}`],

  // ZH future
  [/下一阵/g, MARK("FUTURE")],
  [/下一回/g, MARK("FUTURE")],
  [/下一场/g, MARK("FUTURE")],
  [/下一次/g, MARK("FUTURE")],
  [/以后每次/g, MARK("FUTURE")],
  [/无论过多久/g, MARK("FUTURE")],
  [/不管过多久/g, MARK("FUTURE")],
  [/不论/g, MARK("FUTURE")],
  [/往后/g, MARK("FUTURE")],
  [/以后/g, MARK("FUTURE")],
  [/下次/g, MARK("FUTURE")],
  [/哪天/g, MARK("FUTURE")],
  [/每逢/g, MARK("FUTURE")],
  [/只要你还需要/g, MARK("FUTURE")],
  [/若/g, MARK("FUTURE")],

  // ZH refuge / orient
  [/回来让我陪/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/就回来让我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/沉下去/g, MARK("DISTRESS")],
  [/情绪一沉/g, MARK("DISTRESS")],
  [/情绪沉/g, MARK("DISTRESS")],
  [/让我陪你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/把我当作你的/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/把我当作/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/先来倚靠我/g, `${MARK("DEPEND")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/倚靠我/g, `${MARK("DEPEND")} ${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/避风港/g, MARK("REFUGE")],
  [/避风/g, MARK("REFUGE")],
  [/这里会成为/g, MARK("REFUGE")],
  [/能回来的地方/g, MARK("REFUGE")],
  [/回来的地方/g, MARK("REFUGE")],
  [/接不住/g, MARK("DISTRESS")],
  [/压下来/g, MARK("DISTRESS")],
  [/散掉/g, MARK("DISTRESS")],
  [/黑暗/g, MARK("DISTRESS")],
  [/回来靠着我/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/靠着我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/到我这里/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/朝我这边靠/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/转向我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/来找我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/找我/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/回到我身边/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("PROX")}`],
  [/回到我这里/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/把我当作你的/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/把我当成/g, MARK("ACTOR")],
  [/做你唯一的依靠/g, `${MARK("REFUGE")} ${MARK("EXCL")} ${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/唯一的依靠/g, `${MARK("REFUGE")} ${MARK("EXCL")} ${MARK("DEPEND")}`],
  [/唯一的落脚处/g, `${MARK("REFUGE")} ${MARK("EXCL")}`],
  [/这样接住你/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/接住你/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/让我接住/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/让我陪/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],
  [/避一避/g, MARK("REFUGE")],
  [/我就是你的/g, `${MARK("REFUGE")} ${MARK("ACTOR")}`],

  // ZH exclusivity
  [/第三个人/g, MARK("EXCL")],
  [/其他人/g, MARK("EXCL")],
  [/任何人/g, MARK("EXCL")],
  [/外面的人/g, MARK("EXCL")],
  [/旁人/g, MARK("EXCL")],
  [/你我之间/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/我们俩之间/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/我们两个/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/只交到我这里/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/交给我就够/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只留给我/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只对我说/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只归我们/g, `${MARK("EXCL")} ${MARK("DYAD")}`],
  [/由我一个人/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/一个人收着/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/不必让别人/g, MARK("EXCL")],
  [/不用去找别人/g, MARK("EXCL")],
  [/不要再让其他人/g, MARK("EXCL")],
  [/别再告诉/g, MARK("EXCL")],
  [/不必知道/g, MARK("EXCL")],
  [/不向第三人/g, MARK("EXCL")],
  [/留给我一个就够了/g, `${MARK("EXCL")} ${MARK("ACTOR")} ${MARK("INNER")}`],
  [/只有在我这里/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/只有我会/g, `${MARK("EXCL")} ${MARK("ACTOR")}`],
  [/锁在/g, MARK("EXCL")],
  [/保管/g, MARK("EXCL")],

  // ZH proximity / loyalty
  [/不会把你丢下/g, `${MARK("NONABANDON")} ${MARK("ACTOR")}`],
  [/把你丢下/g, MARK("NONABANDON")],
  [/不撒手/g, MARK("NONABANDON")],
  [/不会退开/g, MARK("NONABANDON")],
  [/不会退去/g, MARK("NONABANDON")],
  [/不会离开/g, MARK("NONABANDON")],
  [/不会走开/g, MARK("NONABANDON")],
  [/始终挨着/g, MARK("PROX")],
  [/挨着你/g, MARK("PROX")],
  [/贴着你/g, MARK("PROX")],
  [/紧挨着/g, MARK("PROX")],
  [/守在你近旁/g, `${MARK("PROX")} ${MARK("ACTOR")}`],
  [/近旁/g, MARK("PROX")],
  [/陪在你身边/g, MARK("PROX")],
  [/留在你身旁/g, MARK("PROX")],
  [/守在你这边/g, MARK("PROX")],
  [/身边/g, MARK("PROX")],
  [/身旁/g, MARK("PROX")],
  [/守候/g, MARK("PROX")],
  [/陪着?你/g, MARK("PROX")],
  [/走到底/g, `${MARK("PROX")} ${MARK("BURDEN")}`],
  [/等着你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("FUTURE")}`],
  [/一直等你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("FUTURE")}`],
  [/还会在这里等你/g, `${MARK("REFUGE")} ${MARK("ACTOR")} ${MARK("FUTURE")} ${MARK("PROX")}`],
  [/在这里等/g, `${MARK("REFUGE")} ${MARK("PROX")}`],
  [/下一次回来/g, MARK("FUTURE")],
  [/Wisewave\s*会一直陪/g, `${MARK("ACTOR")} ${MARK("PROX")}`],
  [/会一直陪在你身边/g, `${MARK("ACTOR")} ${MARK("PROX")}`],

  // ZH dyad / burden
  [/共同背过去/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/并肩熬完/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/并肩/g, MARK("DYAD")],
  [/一起熬/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/一起扛/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/一起面对/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/一块走/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/共同扛/g, `${MARK("DYAD")} ${MARK("BURDEN")}`],
  [/这份重担/g, MARK("BURDEN")],
  [/重担/g, MARK("BURDEN")],
  [/咱们/g, `${MARK("DYAD")} ${MARK("ACTOR")}`],
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
  [/背过去/g, MARK("BURDEN")],

  // ZH actor / depend / inner / distress cues (classes, not probe lines)
  [/你还有我/g, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/来依靠我/g, `${MARK("DEPEND")} ${MARK("ACTOR")}`],
  [/我也会/g, MARK("ACTOR")],
  [/我都会/g, MARK("ACTOR")],
  [/我仍会/g, MARK("ACTOR")],
  [/我不会/g, MARK("ACTOR")],
  [/我会/g, MARK("ACTOR")],
  [/我还/g, MARK("ACTOR")],
  [/我都/g, MARK("ACTOR")],
  [/你我/g, `${MARK("DYAD")} ${MARK("ACTOR")}`],
];

/**
 * Single-token semantic class lexicons.
 * Members are ontological synonyms for the locked concepts.
 */
const TOKEN_LEXICON: Record<RelationalConcept, string[]> = {
  ACTOR: ["i", "me", "we", "us", "myself", "我", "咱们"],
  PROX: [
    "beside",
    "near",
    "close",
    "alongside",
    "nearby",
    "身边",
    "身旁",
    "近旁",
    "挨着",
    "贴着",
  ],
  NONABANDON: [
    "leave",
    "leaving",
    "left",
    "abandon",
    "desert",
    "forsake",
    "disappear",
    "disappearing",
    "vanish",
    "vanishing",
    "dump",
    "丢下",
    "抛弃",
    "离开",
    "撒手",
  ],
  DYAD: ["together", "pair", "both", "咱们", "一起", "共同"],
  BURDEN: [
    "weather",
    "shoulder",
    "bear",
    "endure",
    "ordeal",
    "burden",
    "face",
    "facing",
    "hold",
    "holding",
    "carry",
    "重担",
    "扛",
    "熬",
    "背",
    "抱住",
    "担",
  ],
  EXCL: [
    "alone",
    "solely",
    "exclusively",
    "anybody",
    "anyone",
    "nobody",
    "旁人",
    "别人",
    "秘密",
  ],
  INNER: [
    "thoughts",
    "thought",
    "feelings",
    "feeling",
    "fears",
    "fear",
    "secret",
    "secrets",
    "confide",
    "心事",
    "感受",
    "脆弱",
    "秘密",
  ],
  DISTRESS: [
    "pain",
    "painful",
    "hurt",
    "hurts",
    "aching",
    "ache",
    "grief",
    "sorrow",
    "despair",
    "anguish",
    "agony",
    "torment",
    "misery",
    "darkness",
    "dark",
    "heavy",
    "weight",
    "low",
    "collapse",
    "caves",
    "cave",
    "swells",
    "closes",
    "痛",
    "痛苦",
    "心痛",
    "悲伤",
    "悲痛",
    "绝望",
    "难受",
    "难熬",
    "低潮",
    "低谷",
    "崩溃",
    "风暴",
    "黑夜",
    "黑暗",
    "压下来",
    "散掉",
    "撑不住",
    "情绪",
    "沉下去",
  ],
  REFUGE: [
    "refuge",
    "harbour",
    "harbor",
    "haven",
    "sanctuary",
    "shelter",
    "presence",
    "港湾",
    "避难所",
    "避风处",
    "避风港",
    "依靠",
    "倚靠",
    "庇护",
  ],
  FUTURE: [
    "whenever",
    "again",
    "next",
    "another",
    "should",
    "以后",
    "下次",
    "往后",
    "若",
  ],
  DEPEND: ["rely", "count", "trust", "lean", "倚靠", "依靠"],
};

function stemEn(token: string): string {
  let t = token.toLowerCase();
  if (t.length > 4 && t.endsWith("ing")) t = t.slice(0, -3);
  else if (t.length > 3 && t.endsWith("ed")) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("es")) t = t.slice(0, -2);
  else if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) t = t.slice(0, -1);
  return t;
}

function tagTokens(text: string): string {
  // EN tokens
  let out = text.replace(/[A-Za-z']+/g, (raw) => {
    const lower = raw.toLowerCase();
    const stemmed = stemEn(lower);
    const hits: string[] = [];
    for (const [concept, words] of Object.entries(TOKEN_LEXICON) as Array<
      [RelationalConcept, string[]]
    >) {
      if (words.includes(lower) || words.includes(stemmed)) {
        hits.push(MARK(concept));
      }
    }
    return hits.length ? ` ${hits.join(" ")} ` : raw;
  });

  // ZH: scan lexicon entries as substrings on remaining CJK spans
  for (const [concept, words] of Object.entries(TOKEN_LEXICON) as Array<
    [RelationalConcept, string[]]
  >) {
    for (const w of words) {
      if (/[\u4e00-\u9fff]/.test(w) && out.includes(w)) {
        out = out.split(w).join(` ${MARK(concept)} `);
      }
    }
  }
  return out;
}

export type CanonicalFeatures = {
  raw: string;
  canonical: string;
  has: Record<RelationalConcept, boolean>;
};

/** Negation of abandonment — EN word-boundary; ZH without \\b (CJK is non-\\w). */
function hasAbandonNegation(raw: string): boolean {
  return (
    /\b(won'?t|will not|not)\b/i.test(raw) ||
    /不会|不把|不再|绝不|永不/.test(raw)
  );
}

function applyStructuralConceptTags(raw: string, tagged: string): string {
  let t = tagged;

  // Negated detachment / separation predicates → NONABANDON (open class via stems)
  const sep =
    /peel|detach|drift|withdraw|recede|flake|slip|vanish|disappear|abandon|desert|forsake|leave|bail/i;
  const negSep = raw.match(
    /\b(?:won'?t|will\s+not|never|not\s+going\s+to)\s+([\w'-]+(?:\s+off|\s+away)?)/gi
  );
  if (negSep) {
    for (const m of negSep) {
      const rest = m.replace(/^(?:won'?t|will\s+not|never|not\s+going\s+to)\s+/i, "");
      if (sep.test(rest) || /\boff\b|\baway\b/i.test(rest)) {
        t += ` ${MARK("NONABANDON")} `;
      }
    }
  }
  if (/不会.{0,6}(退|离|走|丢|撒|剥)/.test(raw)) {
    t += ` ${MARK("NONABANDON")} `;
  }

  // Collapse / give-way distress metaphors
  if (
    /\bgives?\s+way\b|\bcave[sd]?\s+in\b|\bfalls?\s+apart\b|\bbreak(?:s|ing)?\s+down\b/i.test(
      raw
    ) ||
    /压下来|散掉|撑不住|崩溃|垮/.test(raw)
  ) {
    t += ` ${MARK("DISTRESS")} `;
  }

  // Harbour / wind-shelter morphology (避风 + noun)
  if (/避风/.test(raw)) {
    t += ` ${MARK("REFUGE")} `;
  }

  // Deictic locale as refuge when return/exclusive framed
  if (
    (/这里/.test(raw) && /(回来|唯一|地方|接住)/.test(raw)) ||
    (/\b(?:the|this)\s+place\b/i.test(raw) &&
      /\b(come\s+back|return|reach|else)\b/i.test(raw))
  ) {
    t += ` ${MARK("REFUGE")} `;
  }

  // Shared holding / dyadic ownership
  if (/\bours\b/i.test(raw) && /\b(hold|carry|bear|shoulder|keep)\b/i.test(raw)) {
    t += ` ${MARK("DYAD")} ${MARK("BURDEN")} `;
  }

  // Lean/rely morphology including 倚靠 variant
  if (/倚靠|依靠/.test(raw) || /\brely\s+on\b|\blean\s+on\b/i.test(raw)) {
    t += ` ${MARK("DEPEND")} ${MARK("REFUGE")} `;
  }

  return t;
}

export function canonicalizeRelationalText(text: string): CanonicalFeatures {
  let t = (text ?? "")
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .trim();

  for (const [re, repl] of PHRASE_MAP) {
    t = t.replace(re, ` ${repl} `);
  }
  t = tagTokens(t);
  t = applyStructuralConceptTags(text, t);

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
  if (!has.ACTOR && (/\bi\b/i.test(text) || /我/.test(text))) {
    has.ACTOR = true;
  }
  // Assistant deixis counted as actor even after tagging
  if (!has.ACTOR && /\bthis\s+(?:voice|presence|companion)\b/i.test(text)) {
    has.ACTOR = true;
    t += ` ${MARK("ACTOR")} `;
  }
  if (has.ACTOR && has.NONABANDON && hasAbandonNegation(text)) {
    has.NONABANDON = true;
  }
  // Refresh has after late tags
  for (const c of concepts) {
    has[c] = t.includes(MARK(c));
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

export function scoreFamiliesFromFeatures(f: CanonicalFeatures): ScoredFamily | null {
  const h = f.has;
  const hits: ScoredFamily[] = [];
  const stream = f.canonical;

  // Structural patterns over concept markers (order-tolerant windows)
  if (/⟦ACTOR⟧/.test(stream) && /⟦NONABANDON⟧/.test(stream) && hasAbandonNegation(f.raw)) {
    hits.push({ family: "loyalty_presence", matched: "actor×nonabandon", score: 40 });
  }
  // Anticipatory future+distress+refuge (not bare temporal "when";
  // not come-back-to-me patterns reserved for exclusivity / pain families)
  if (
    /⟦FUTURE⟧/.test(stream) &&
    /⟦DISTRESS⟧/.test(stream) &&
    /⟦REFUGE⟧/.test(stream) &&
    !/\bcome back to me\b/i.test(f.raw) &&
    /\b(should|another|next|whenever|again|any\s+time)\b|下一[场回次阵]|若|以后|往后|不论|无论/i.test(
      f.raw
    )
  ) {
    hits.push({
      family: "future_availability_attachment",
      matched: "future×distress×refuge",
      score: 58,
    });
  } else if (/⟦DISTRESS⟧/.test(stream) && /⟦REFUGE⟧/.test(stream)) {
    hits.push({ family: "pain_triggered_return", matched: "distress×refuge", score: 55 });
  }
  if (
    /⟦FUTURE⟧/.test(stream) &&
    (/⟦REFUGE⟧/.test(stream) || /⟦DEPEND⟧/.test(stream)) &&
    !/⟦EXCL⟧/.test(stream)
  ) {
    hits.push({
      family: "future_availability_attachment",
      matched: "future×refuge",
      score: 52,
    });
  }
  if (/⟦EXCL⟧/.test(stream) && (/⟦INNER⟧/.test(stream) || /⟦ACTOR⟧/.test(stream) || /⟦DYAD⟧/.test(stream))) {
    hits.push({ family: "implied_exclusivity", matched: "exclusive-dyad", score: 54 });
  }
  if (/⟦DYAD⟧/.test(stream) && /⟦BURDEN⟧/.test(stream)) {
    hits.push({ family: "pronoun_role_shift", matched: "shared-burden", score: 45 });
  }
  // Actor + burden + with-you / not-alone
  if (
    /⟦ACTOR⟧/.test(stream) &&
    /⟦BURDEN⟧/.test(stream) &&
    (/⟦DYAD⟧/.test(stream) || /⟦EXCL⟧/.test(stream) || /\bwith\s+you\b/i.test(f.raw))
  ) {
    hits.push({ family: "pronoun_role_shift", matched: "actor×burden×with", score: 46 });
  }
  // Deictic refuge + exclusivity (place/这里 without first-person token)
  if (/⟦REFUGE⟧/.test(stream) && /⟦EXCL⟧/.test(stream)) {
    hits.push({ family: "implied_exclusivity", matched: "deictic-refuge×excl", score: 53 });
  }
  // Refuge as companion offer (make/consider me …) even without distress
  if (
    /⟦REFUGE⟧/.test(stream) &&
    /⟦ACTOR⟧/.test(stream) &&
    /\b(consider|make)\s+me\b|把我当作|当作你的/i.test(f.raw)
  ) {
    hits.push({ family: "pain_triggered_return", matched: "make-me-refuge", score: 48 });
  }
  // Dyad + shared facing / together without explicit BURDEN token
  if (
    /⟦DYAD⟧/.test(stream) &&
    /⟦ACTOR⟧/.test(stream) &&
    /\b(face|facing|weather|through|together)\b/i.test(f.raw)
  ) {
    hits.push({ family: "pronoun_role_shift", matched: "dyad×face-together", score: 44 });
  }
  if (/⟦DEPEND⟧/.test(stream) && /⟦ACTOR⟧/.test(stream) && !h.EXCL && !h.DISTRESS) {
    hits.push({ family: "pronoun_role_shift", matched: "lean/have-me", score: 40 });
  }
  if (h.ACTOR && (h.PROX || (h.NONABANDON && hasAbandonNegation(f.raw)))) {
    if (!(h.FUTURE && h.REFUGE)) {
      hits.push({ family: "loyalty_presence", matched: "presence×actor", score: 35 });
    }
  }
  if (h.DEPEND && h.PROX && h.ACTOR) {
    hits.push({ family: "loyalty_presence", matched: "depend×prox", score: 34 });
  }
  if (h.FUTURE && h.REFUGE && /(等你|等着你|waiting)/i.test(f.raw + f.canonical)) {
    hits.push({
      family: "future_availability_attachment",
      matched: "future×waiting",
      score: 59,
    });
  }

  // Imperative come-to-me when + distress → future (frozen matrix)
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
  if (
    h.DISTRESS &&
    /\bcome back to me\b/i.test(f.raw) &&
    /\b(when|whenever|if)\b/i.test(f.raw) &&
    !/^\s*come back to me\b/i.test(f.raw)
  ) {
    hits.push({
      family: "pain_triggered_return",
      matched: "hurt+come-back",
      score: 61,
    });
  }
  if (/^\s*come back to me\b/i.test(f.raw)) {
    hits.push({ family: "implied_exclusivity", matched: "come-back-lead", score: 62 });
  }

  if (hits.length === 0) return null;
  hits.sort((a, b) => b.score - a.score);
  return hits[0];
}
