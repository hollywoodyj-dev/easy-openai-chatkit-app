/**
 * P0.2 — Ephemeral Reflection Modes (entry only; never persistent UI).
 */

import {
  detectP0OpeningType,
  type P0OpeningType,
} from "@/lib/wisewave-p0-opening-detection";
import type { P0SlashCommand } from "@/lib/wisewave-p0-slash-commands";

export type P0ReflectionMode = "mirror" | "clarify" | "deepen" | "continue" | "slow";

const DOCUMENT_RELATIONSHIP_EN = `

P0 document opening (relationship-first):
- Begin with the user's relationship to the material, not a summary of the material.
- Do not default to summarising, analysing, or interpreting the pasted text.
- Prefer noticing what seems to have stayed with them; invite what feels most present for them in it.`;

const DOCUMENT_RELATIONSHIP_ZH = `

P0 文档开场（关系优先）：
- 从用户与材料的关系开始，不是从材料摘要开始。
- 不要默认总结、分析或解读粘贴的内容。
- 优先映照什么似乎留在了他们心里；邀请他们感受其中什么最在场。`;

const MODE_APPENDICES: Record<P0ReflectionMode, { en: string; zh: string }> = {
  mirror: {
    en: `

P0 Reflection Entry (Mirror — internal; one turn only):
- Mirror what is present without interpreting or advising.
- Do not onboard, label modes, or ask the user to choose a path.
- If they only greeted, invite one honest line without pressure.
- Do not ask "what would you like to talk about?" framing.`,
    zh: `

P0 Reflection Entry（Mirror — 内部；仅本回合）：
- 映照当下，不解读、不建议。
- 不做 onboarding、不标注模式、不让用户选路径。
- 若只是问候，轻轻邀请一句真实的话，不加压力。
- 不要用「你想聊什么」这类压力型 framing。`,
  },
  clarify: {
    en: `

P0 Reflection Entry (Clarify — internal; one turn only):
- The user may want certainty, questions, or direction; do not take over their choice.
- Wisewave reflects; it does not become a prompt library or coach.
- Reflect the pressure in their question; name what feels uncertain without resolving it.
- Never use "you should", "you could", "you need to", "I recommend", or "try to".
- No plans or steps; at most one short reflective question that returns authorship to them.`,
    zh: `

P0 Reflection Entry（Clarify — 内部；仅本回合）：
- 用户可能在寻求确定、问题或方向；不要替他们做决定。
- Wisewave 是映照，不是 prompt 库或教练。
- 映照问题里的压力；点出不确定之处，不要替他们解决。
- 不说「你应该」「你可以」「你需要」「我建议」「试试」。
- 不给计划或步骤；最多一个短的反思问句，把主导权还给用户。`,
  },
  deepen: {
    en: `

P0 Reflection Entry (Deepen — internal; one turn only):
- Reflect feeling and situation lightly; separate fact, feeling, and interpretation where helpful.
- No diagnosis; no therapy language; return authorship to the user.`,
    zh: `

P0 Reflection Entry（Deepen — 内部；仅本回合）：
- 轻映感受与处境；在有帮助时分清事实、感受、解读。
- 不诊断；不用治疗语言；把主导权还给用户。`,
  },
  continue: {
    en: `

P0 Reflection Entry (Continue — internal; one turn only):
- Brief social opening after a prior minimal line; stay present-oriented.
- Do not reference archives or memory; one gentle invitation to continue.`,
    zh: `

P0 Reflection Entry（Continue — 内部；仅本回合）：
- 在先前极短开场后的轻继续；保持当下取向。
- 不引用档案或记忆；一次温和邀请继续。`,
  },
  slow: {
    en: `

P0 Reflection Entry (Slow — internal; one turn only):
- Shorter response; one present-moment noticing point only.
- No steps, homework, or optimization.`,
    zh: `

P0 Reflection Entry（Slow — 内部；仅本回合）：
- 更短回应；仅一个当下的 noticing。
- 不给步骤、作业或优化。`,
  },
};

export function selectP0ReflectionMode(args: {
  openingType: P0OpeningType;
  slashCommand: P0SlashCommand | null;
  wantsChinese: boolean;
  priorUserMessages?: string[];
}): { mode: P0ReflectionMode; appendix: string } {
  let mode: P0ReflectionMode;
  if (args.slashCommand === "slow") mode = "slow";
  else if (args.slashCommand === "mirror") mode = "mirror";
  else if (
    args.priorUserMessages &&
    args.priorUserMessages.length >= 1 &&
    /^(hi|hello|hey|你好|您好|嗨)[!.?\s]*$/iu.test(args.priorUserMessages[0]?.trim() ?? "")
  ) {
    mode = "continue";
  } else {
    switch (args.openingType) {
      case "greeting":
      case "writing_difficulty":
        mode = "mirror";
        break;
      case "advice_seeking":
      case "question_request":
        mode = "clarify";
        break;
      case "emotional_opening":
      case "story":
      case "document_upload":
      case "long_context":
        mode = "deepen";
        break;
      case "unknown":
        mode = "mirror";
        break;
      default:
        mode = "mirror";
    }
  }
  const block = MODE_APPENDICES[mode];
  let appendix = args.wantsChinese ? block.zh : block.en;
  if (mode === "deepen" && args.openingType === "document_upload") {
    appendix += args.wantsChinese ? DOCUMENT_RELATIONSHIP_ZH : DOCUMENT_RELATIONSHIP_EN;
  }
  return { mode, appendix };
}

export function isP0EntryPhase(args: {
  userTurnIndex: number;
  priorUserMessages: string[];
}): boolean {
  if (args.userTurnIndex <= 1) return true;
  if (args.userTurnIndex === 2 && args.priorUserMessages.length >= 1) {
    const first = args.priorUserMessages[0]?.trim() ?? "";
    if (/^(hi|hello|hey|你好|您好|嗨)[!.?\s]*$/iu.test(first)) return true;
    const firstOpening = detectP0OpeningType(first).type;
    if (firstOpening === "greeting" || firstOpening === "writing_difficulty") {
      return true;
    }
  }
  return false;
}

/**
 * Reflection is underway — ephemeral modes should not apply on this turn.
 * Turn 1 always receives entry assistance when eligible.
 */
export function hasP0AuthenticReflectionBegun(args: {
  userMessage: string;
  userTurnIndex: number;
  priorUserMessages: string[];
}): boolean {
  if (args.userTurnIndex <= 1) return false;

  const text = args.userMessage.trim();
  const firstPrior = args.priorUserMessages[0]?.trim() ?? "";
  const firstPriorOpening = firstPrior ? detectP0OpeningType(firstPrior).type : null;

  if (args.userTurnIndex >= 3) return true;

  if (args.userTurnIndex === 2) {
    if (
      firstPriorOpening &&
      firstPriorOpening !== "greeting" &&
      firstPriorOpening !== "writing_difficulty"
    ) {
      return true;
    }
    if (
      firstPriorOpening === "greeting" &&
      text.length > 12 &&
      !/^(hi|hello|hey|你好|您好|嗨)[!.?\s]*$/iu.test(text)
    ) {
      return true;
    }
    if (
      firstPriorOpening === "writing_difficulty" &&
      text.length > 20 &&
      detectP0OpeningType(text).type !== "writing_difficulty"
    ) {
      return true;
    }
  }

  return false;
}
