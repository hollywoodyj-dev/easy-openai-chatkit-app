/**
 * Lightweight thread labels for V3 Thread.label, Recent Threads, and Phase 4 current-space marker.
 * Wisewave narrowing pack: docs/hc-os-v1-phase-4-marker-language-narrowing-pack-wisewave.md
 * (trace / residue; 2–5 words EN; forbidden topic-summary-archive phrasing).
 */
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
    return "一段最近的内在线索";
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
  return "A recent inner thread";
}
