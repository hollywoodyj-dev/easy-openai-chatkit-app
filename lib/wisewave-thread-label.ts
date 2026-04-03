/**
 * Lightweight thread labels for V3 Thread.label and Recent Threads (not raw transcript).
 * Shared by /api/chat/turn and /api/chat/threads; mirrors app/chat/page.tsx heuristics.
 */
export function summarizeThreadLabelFromUserMessage(text: string): string {
  const t = text.trim();
  if (!t) return "Quiet trace";
  const hasCjk = /[\u4e00-\u9fff]/.test(t);
  if (hasCjk) {
    if (/(做对|出错|不能错|完美|证明)/.test(t)) return "想把事情做对的压力";
    if (/(怀疑|不够好|价值|拉扯)/.test(t)) return "自我价值拉扯";
    if (/(迟疑|犹豫|不敢|停不下)/.test(t)) return "一点内在迟疑";
    if (/(工作|事情不顺|受挫|低落)/.test(t)) return "工作受挫后的低落";
    if (/(很急|来不及|绷紧|焦虑|压力)/.test(t)) return "事情节奏带来的压力";
    return "一段最近的内在线索";
  }
  const lower = t.toLowerCase();
  if (/(get it right|perfect|mistake|prove)/.test(lower)) return "Getting it right";
  if (/(self-worth|not enough|doubt myself|worth)/.test(lower)) return "Self-worth tension";
  if (/(hesitat|hold back|uncertain|freeze)/.test(lower)) return "Inner hesitation";
  if (/(work|discourag|setback|drained)/.test(lower)) return "Work discouragement";
  if (/(pressure|urgent|rush|tight)/.test(lower)) return "Quiet pressure around work";
  return "A recent inner thread";
}
