/**
 * Lightweight thread labels for V3 Thread.label, Recent Threads, and Phase 4 current-space marker.
 * Wisewave narrowing pack: docs/hc-os-v1-phase-4-marker-language-narrowing-pack-wisewave.md
 * Tree reach pass: fewer generic-collapsed rows — more heuristics + hashed trace fallbacks
 * (not the old generic strings suppressed by Phase 4).
 */

function stableLabelHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pickTraceFallback(text: string, variants: readonly string[]): string {
  const idx = stableLabelHash(text) % variants.length;
  return variants[idx] ?? variants[0];
}

/** EN: when no heuristic matches — admissible trace fragments (not GENERIC_LABELS). */
const EN_TRACE_FALLBACKS = [
  "something still here",
  "a little still near",
  "not quite settled yet",
  "something quiet still here",
  "still a faint pull here",
  "not fully quiet yet",
] as const;

const ZH_TRACE_FALLBACKS = [
  "这里还留着一点",
  "好像还有一点在",
  "还有一点没散开",
  "似乎还轻轻在这里",
  "还没有完全落下",
  "这里还轻轻停着什么",
] as const;

export function summarizeThreadLabelFromUserMessage(text: string): string {
  const t = text.trim();
  if (!t) return "Quiet trace";
  const hasCjk = /[\u4e00-\u9fff]/.test(t);
  if (hasCjk) {
    if (/(做对|出错|不能错|完美|证明)/.test(t)) return "这里还轻轻紧着一点";
    if (/(怀疑|不够好|价值|拉扯)/.test(t)) return "下面好像还有一点在";
    if (/(迟疑|犹豫|不敢|停不下)/.test(t)) return "似乎还有一点收着";
    if (/(工作|事情不顺|受挫|低落)/.test(t)) return "这里还留着一点重量";
    if (/(很急|来不及|绷紧|焦虑|压力)/.test(t)) return "还有一点轻微的拉着";
    if (/(孤独|一个人|没人听|孤立|孤单)/.test(t)) return "这里还轻轻空着一点";
    if (/(崩溃|撑不住|受不了|顶不住)/.test(t)) return "好像还有点承不住";
    if (/(睡不着|失眠|翻来覆去|躺着想)/.test(t)) return "还没完全静下来";
    if (/(家人|父母|爸妈|原生家庭|家里)/.test(t)) return "下面好像还有一点在";
    if (/(分手|离婚|对象|伴侣|男朋友|女朋友)/.test(t)) return "还没完全散开";
    if (/(内疚|愧疚|自责)/.test(t)) return "这里还留着一点重量";
    if (/(失去|去世|走了|不在了|想念)/.test(t)) return "好像还有一点在";
    return pickTraceFallback(t, ZH_TRACE_FALLBACKS);
  }
  const lower = t.toLowerCase();
  if (/(get it right|perfect|mistake|prove)/.test(lower)) {
    return "something still tight here";
  }
  if (/(self-worth|not enough|doubt myself|worth)/.test(lower)) {
    return "something still close underneath";
  }
  if (/(hesitat|hold back|uncertain|freeze)/.test(lower)) {
    return "still a little held back";
  }
  if (/(work|discourag|setback|drained)/.test(lower)) {
    return "still carrying some weight";
  }
  if (/(pressure|urgent|rush|tight)/.test(lower)) {
    return "a little tension still near";
  }
  if (/\b(lonely|loneliness|isolated|alone|no one listens)\b/.test(lower)) {
    return "something still quiet here";
  }
  if (/\b(overwhelm|overwhelmed|too much|drowning|can'?t cope)\b/.test(lower)) {
    return "still more here than shows";
  }
  if (/\b(insomnia|can'?t sleep|lying awake|sleep)\b/.test(lower)) {
    return "still not fully at rest";
  }
  if (/\b(parents?|mother|father|mom|dad|family|sibling)\b/.test(lower)) {
    return "a little still underneath";
  }
  if (/\b(partner|marriage|breakup|divorce|spouse|relationship)\b/.test(lower)) {
    return "still not fully eased";
  }
  if (/\b(guilt|guilty|ashamed|shame)\b/.test(lower)) {
    return "something still close underneath";
  }
  if (/\b(grief|loss|funeral|died|death|miss (them|him|her))\b/.test(lower)) {
    return "something still here";
  }
  if (/\b(scared|afraid|frightened|fear)\b/.test(lower)) {
    return "a little tension still near";
  }
  if (/\b(sad|depressed|hopeless|empty inside)\b/.test(lower)) {
    return "something quiet still here";
  }
  return pickTraceFallback(t, EN_TRACE_FALLBACKS);
}
