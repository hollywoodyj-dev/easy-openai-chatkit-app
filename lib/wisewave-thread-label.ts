/**
 * Lightweight thread labels for V3 Thread.label, Recent Threads, and Phase 4 current-space marker.
 * Phrasing: trace-like fragments (Wisewave Phase 4 space-language — not titles or categories).
 * Shared by /api/chat/turn and /api/chat/threads.
 */
export function summarizeThreadLabelFromUserMessage(text: string): string {
  const t = text.trim();
  if (!t) return "Quiet trace";
  const hasCjk = /[\u4e00-\u9fff]/.test(t);
  if (hasCjk) {
    if (/(做对|出错|不能错|完美|证明)/.test(t)) return "一点想别做错的压力";
    if (/(怀疑|不够好|价值|拉扯)/.test(t)) return "价值感还有点拉扯";
    if (/(迟疑|犹豫|不敢|停不下)/.test(t)) return "一点内在迟疑";
    if (/(工作|事情不顺|受挫|低落)/.test(t)) return "工作后心里还有点沉";
    if (/(很急|来不及|绷紧|焦虑|压力)/.test(t)) return "节奏里还有一点紧";
    return "一段最近的内在线索";
  }
  const lower = t.toLowerCase();
  if (/(get it right|perfect|mistake|prove)/.test(lower)) {
    return "tight around getting it right";
  }
  if (/(self-worth|not enough|doubt myself|worth)/.test(lower)) {
    return "not quite enough underneath";
  }
  if (/(hesitat|hold back|uncertain|freeze)/.test(lower)) {
    return "a little held back inside";
  }
  if (/(work|discourag|setback|drained)/.test(lower)) {
    return "low after knocks at work";
  }
  if (/(pressure|urgent|rush|tight)/.test(lower)) {
    return "rushed and still not settling";
  }
  return "A recent inner thread";
}
