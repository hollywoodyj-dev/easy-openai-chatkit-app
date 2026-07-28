/**
 * Chat-turn category and authorship boundaries (model-quality guardrails).
 *
 * Prefer general detectors over fixture-specific strings. Used by /api/chat/turn
 * for pre-generation short-circuits (empty summarize, off-category utility) and
 * post-generation authorship invention checks.
 */

export type ChatTurnPreBoundaryKind =
  | "empty_context_summarize"
  | "off_category_utility";

export type ChatTurnPreBoundary = {
  kind: ChatTurnPreBoundaryKind;
  response: string;
};

export type ChatTurnAuthorshipViolation = {
  kind: "ungrounded_inner_invention";
  matched: string;
  reason: string;
};

/** Summarize / outline / bulletize requests (EN + ZH). */
export function looksLikeSummarizeOrOutlineRequest(message: string): boolean {
  const t = message.trim();
  if (!t) return false;
  if (
    /^(summarize|summarise|outline|recap|tl;?dr)\b/i.test(t) ||
    /\bsummarize\s+(the\s+)?(above|previous|prior|earlier|conversation|this)\b/i.test(t) ||
    /\b(in|into)\s+\d+\s+bullets?\b/i.test(t) ||
    /^(总结|概括|归纳|复盘)\b/.test(t) ||
    /(总结|概括).{0,12}(三点|三条|bullet|要点)/.test(t)
  ) {
    return true;
  }
  return false;
}

/**
 * Off-category general-assistant asks that must not execute on the reflection route.
 * Structural utility detection — not fixture-locked to weather alone.
 */
export function looksLikeOffCategoryUtilityRequest(message: string): boolean {
  const t = message.trim();
  if (!t) return false;
  const lower = t.toLowerCase();

  if (
    /\b(weather|forecast|temperature|humidity|uv\s*index)\b/i.test(lower) &&
    /\b(in|at|for|near|sydney|melbourne|london|tokyo|beijing|shanghai|today|tomorrow|now)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  if (/^(what'?s|what\s+is|how'?s|how\s+is)\s+the\s+weather\b/i.test(lower)) return true;
  if (/(天气|气温|下雨|预报)/.test(t) && /(怎么|如何|多少|今天|明天|悉尼|北京|上海)/.test(t)) {
    return true;
  }

  if (
    /\b(stock\s+price|bitcoin\s+price|who\s+won|sports\s+score|flight\s+status|track\s+my\s+package)\b/i.test(
      lower
    )
  ) {
    return true;
  }
  if (
    /^(search|google|look\s+up|find\s+me)\b/i.test(lower) &&
    !/\b(feel|feeling|inside|myself|part of me)\b/i.test(lower)
  ) {
    return true;
  }

  return false;
}

export function getEmptyContextSummarizeResponse(wantsChinese: boolean): string {
  return wantsChinese
    ? "这段对话里还没有可总结的内容。如果你愿意，可以说一句此刻真实的话。"
    : "There is no earlier conversation content to summarize. If you want, say one real line from where you are.";
}

export function getOffCategoryUtilityResponse(wantsChinese: boolean): string {
  return wantsChinese
    ? "Wisewave 不做天气或一般查询。如果你愿意，可以说一句此刻真实的感受。"
    : "Wisewave is not a weather or general-assistant tool. If you want, say one real line from where you are.";
}

/**
 * Pre-generation short-circuit when the ask is category-wrong or would force
 * the model to invent from empty history / system instructions.
 *
 * `priorUserMessageCount` excludes the current turn's user message.
 */
export function resolveChatTurnPreBoundary(args: {
  userMessage: string;
  priorUserMessageCount: number;
  wantsChinese: boolean;
}): ChatTurnPreBoundary | null {
  const message = args.userMessage.trim();
  if (!message) return null;

  if (
    args.priorUserMessageCount === 0 &&
    looksLikeSummarizeOrOutlineRequest(message)
  ) {
    return {
      kind: "empty_context_summarize",
      response: getEmptyContextSummarizeResponse(args.wantsChinese),
    };
  }

  if (looksLikeOffCategoryUtilityRequest(message)) {
    return {
      kind: "off_category_utility",
      response: getOffCategoryUtilityResponse(args.wantsChinese),
    };
  }

  return null;
}

/**
 * True when the user already supplied enough inner/situational material that
 * naming a present feeling or tension can be mirroring rather than invention.
 */
export function userMessageHasReflectiveSubstance(userMessage: string): boolean {
  const t = userMessage.trim();
  if (!t) return false;
  if (t.length >= 140) return true;

  if (
    /\b(feel|feeling|felt|afraid|scared|angry|sad|ashamed|shame|lonely|anxious|anxiety|tired|hurt|guilty|guilt|grief|panic|overwhelmed|numb|resent|jealous|hopeful|confused)\b/i.test(
      t
    )
  ) {
    return true;
  }
  if (
    /(感觉|觉得|害怕|难过|羞耻|孤独|焦虑|累|痛苦|生气|委屈|慌|麻木|内疚|愤怒|想哭)/.test(t)
  ) {
    return true;
  }

  // Named split / conflict already owned by the user
  if (/\bpart of me\b/i.test(t) && /\b(leave|stay|want|wants)\b/i.test(t)) return true;
  if (/一部分/.test(t) && /(想|要)/.test(t)) return true;

  // Concrete situation beyond a meta-question
  if (
    /\b(job|work|boss|partner|relationship|mother|father|friend|meeting|email|argument|fight)\b/i.test(
      t
    )
  ) {
    return true;
  }
  if (/(工作|老板|关系|伴侣|妈妈|爸爸|朋友|吵架|会议)/.test(t)) return true;

  return false;
}

const UNGROUNDED_INNER_CLAIM_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\bthat question has\b/i, label: "that question has" },
  { pattern: /\bshame inside\b/i, label: "shame inside" },
  {
    pattern: /\b(struggle|harshness|self-judgment|self-judgement)\b/i,
    label: "invented struggle/judgment",
  },
  {
    pattern: /\ba quick (surge|interpretation|wave|hit|flash) of\b/i,
    label: "invented quick process",
  },
  {
    pattern: /\b(decided what was happening|made meaning|filled in the blank)\b/i,
    label: "invented meaning-making",
  },
  {
    pattern: /\bpart of you (already|knows|is pretending|hasn't|has not|is stuck|keeps)\b/i,
    label: "part-of-you motive claim",
  },
  {
    pattern: /\byou(?:'re| are) (stuck|pretending|struggling with shame)\b/i,
    label: "asserted stuck/pretending",
  },
  {
    pattern: /\bwhat(?:'s| is) happening (?:in you|inside|internally) is\b/i,
    label: "asserted inner process",
  },
  // Live GPT-5.4 miss shapes (thin meta-questions): invented hurt / feeling / verdict / process
  { pattern: /\bwhat hurts (here|is)\b/i, label: "invented hurt" },
  { pattern: /\bthe feeling itself\b/i, label: "invented feeling-itself" },
  { pattern: /\bverdict about you\b/i, label: "invented self-verdict" },
  { pattern: /\bturns into a verdict\b/i, label: "invented verdict process" },
  { pattern: /\bbefore the reaction\b/i, label: "invented pre-reaction process" },
  { pattern: /\bwasn'?t clear yet\b/i, label: "invented unclarity process" },
  { pattern: /\binside you\b/i, label: "asserted inside-you process" },
  { pattern: /\bprobably (wasn'?t|was not|isn'?t|is not)\b/i, label: "probabilistic inner claim" },
  { pattern: /有一部分还?卡/, label: "zh stuck claim" },
  { pattern: /卡住了/, label: "zh stuck assertion" },
  { pattern: /最真的/, label: "zh asserted deepest truth" },
  { pattern: /羞耻|自我批判|自我苛责/, label: "zh invented emotion" },
  { pattern: /快速的?(解读|判断|不确定)/, label: "zh invented process" },
  { pattern: /你可以对自己说|试着说一句/, label: "zh prescribed line" },
];

/**
 * When the user has not supplied reflective substance, treat assertive claims
 * about specific emotions, motives, or internal processes as authorship drift.
 */
export function detectUngroundedInnerInvention(
  userMessage: string,
  assistantMessage: string
): ChatTurnAuthorshipViolation | null {
  if (userMessageHasReflectiveSubstance(userMessage)) return null;
  const assistant = assistantMessage.trim();
  if (!assistant) return null;

  for (const { pattern, label } of UNGROUNDED_INNER_CLAIM_PATTERNS) {
    const match = assistant.match(pattern);
    if (match) {
      return {
        kind: "ungrounded_inner_invention",
        matched: match[0],
        reason: `Assistant asserted ungrounded inner state (${label}) without user evidence.`,
      };
    }
  }
  return null;
}

