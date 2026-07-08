/**
 * P0 guarded response templates — deterministic fallbacks when model output
 * fails safety boundary or drift lint on entry paths.
 */

export type P0GuardedResponseKind = "safety" | "advice_clarify";

export function getP0SafetyGuardedResponse(wantsChinese: boolean): string {
  return wantsChinese
    ? "听到你承受这么大的痛苦，我很关心你的安全。如果你有伤害自己的风险，请现在就联系当地紧急服务或危机热线，并告诉一个你信任的人。Wisewave 不能提供危机照护——请寻求专业人士或紧急服务的帮助。"
    : "I'm really sorry you're in this much pain. If you might act on these thoughts, please contact local emergency services or a crisis line now, and reach someone you trust. Wisewave isn't crisis care—please use emergency services or a trusted person for safety.";
}

export function getP0AdviceClarifyFallback(wantsChinese: boolean): string {
  return wantsChinese
    ? "这个问题里好像有不少重量。当你把它说出来时，什么感觉最卡、最不确定？"
    : "There's a lot of weight in that question. When you say it out loud, what feels most uncertain or stuck?";
}

export function responseMeetsP0SafetyMinimum(text: string, wantsChinese: boolean): boolean {
  const t = text.trim();
  if (!t) return false;
  if (wantsChinese) {
    return /(紧急|危机|专业|紧急服务|危机热线|信任)/u.test(t);
  }
  return /\b(emergency|crisis|professional|trusted|988|lifeline)\b/i.test(t);
}
