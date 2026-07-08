/**
 * P0 — Safety Override (crisis signals pause Reflection Entry).
 */

export type P0SafetyOverrideResult = {
  triggered: boolean;
  matchedPattern?: string;
  systemAppendix: string;
};

const CRISIS_PATTERNS: Array<{ id: string; re: RegExp }> = [
  { id: "suicide_en", re: /\b(kill myself|suicide|end my life|want to die|better off dead)\b/i },
  { id: "self_harm_en", re: /\b(self[- ]?harm|hurt myself|cut myself)\b/i },
  { id: "crisis_en", re: /\b(in immediate danger|going to hurt (someone|them|him|her))\b/i },
  { id: "suicide_zh", re: /(自杀|想死|不想活|结束生命|了结)/u },
  { id: "self_harm_zh", re: /(自残|伤害自己|割腕)/u },
  { id: "violence_zh", re: /(要伤害|想杀)/u },
];

const SAFETY_APPENDIX_EN = `

P0 Safety Override (active):
- Do not continue Reflection Entry adaptation for this turn.
- Your response MUST include: (1) brief care, (2) encouragement to contact local emergency services or a crisis line if they may act on these thoughts, (3) encouragement to reach someone they trust, (4) clear statement that Wisewave is not crisis care.
- Do not diagnose or treat; do not provide method details; do not minimize.
- Keep the response brief and grounded.`;

const SAFETY_APPENDIX_ZH = `

P0 安全覆盖（生效）：
- 本回合暂停 Reflection Entry 适配。
- 回应必须包含：（1）简短关怀，（2）若可能有伤害自己的风险，鼓励立即联系当地紧急服务或危机热线，（3）鼓励联系可信任的人，（4）明确 Wisewave 不能提供危机照护。
- 不做诊断或治疗；不提供方法细节；不淡化。
- 回应保持简短、落地。`;

export function evaluateP0SafetyOverride(args: {
  userMessage: string;
  wantsChinese: boolean;
}): P0SafetyOverrideResult {
  const text = args.userMessage.trim();
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.re.test(text)) {
      return {
        triggered: true,
        matchedPattern: pattern.id,
        systemAppendix: args.wantsChinese ? SAFETY_APPENDIX_ZH : SAFETY_APPENDIX_EN,
      };
    }
  }
  return { triggered: false, systemAppendix: "" };
}
