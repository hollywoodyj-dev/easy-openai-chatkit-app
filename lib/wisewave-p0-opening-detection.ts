/**
 * P0.1 — Opening Detection Engine (internal only; never user-facing).
 * @see docs/Wisewave_Product_Milestone_P0_Reflection_Entry_Implementation_Addendum_v1_LOCKED.md
 */

export type P0OpeningType =
  | "emotional_opening"
  | "greeting"
  | "advice_seeking"
  | "question_request"
  | "writing_difficulty"
  | "story"
  | "document_upload"
  | "long_context"
  | "unknown";

export type P0OpeningConfidence = "low" | "medium" | "high";

export type P0OpeningDetectionResult = {
  type: P0OpeningType;
  confidence: P0OpeningConfidence;
};

const GREETING_RE =
  /^(hi|hello|hey|yo|hiya|good\s+(morning|afternoon|evening)|howdy)[!.?\s]*$/i;
const GREETING_ZH_RE = /^(你好|您好|嗨|哈喽)[!.?\s]*$/u;
const ADVICE_SEEKING_RE =
  /\b(what should i|should i|tell me what to do|give me advice|the best (thing|way)|what would you do|what do you think i should)\b/i;
const ADVICE_SEEKING_ZH_RE =
  /(怎么办|该怎么做|给我建议|告诉我该怎么做|应该怎么做|你有什么建议)/u;
const QUESTION_REQUEST_RE =
  /\b(ask me (some )?questions?|give me (some )?questions?|interview me|question prompts?)\b/i;
const QUESTION_REQUEST_ZH_RE = /(问我|给我一些问题|问一些问题|提问)/u;
const WRITING_DIFFICULTY_RE =
  /\b(i\s*(don'?t|do not)\s*(even\s+)?know\s*(where to start|what to write|how to start)|not sure what to write|blank page|don'?t\s+even\s+know\s+where\s+to\s+start)\b/i;
const WRITING_DIFFICULTY_ZH_RE =
  /(不知道(从)?哪里开始|不知道写什么|不知道怎么开始|无从下笔|没有头绪)/u;
const EMOTIONAL_RE =
  /\b(i feel|i am feeling|i'm feeling|i feel like|worried|anxious|sad|angry|overwhelmed|heartbroken|exhausted|stressed|lost|confused|empty|whole|心累|迷茫|烦|难过|焦虑|担心|害怕|累|空)\b/i;
const EMOTIONAL_ZH_RE =
  /(我觉得|我感到|我很|我心|今天.*(不好|心累|烦|迷茫)|担心|害怕|焦虑|难过|心累|空|相反)/u;

const DOCUMENT_MIN_CHARS = 400;
const LONG_CONTEXT_MIN_CHARS = 200;

function hasCjk(text: string): boolean {
  return /[\u4E00-\u9FFF]/.test(text);
}

function isShortGreeting(text: string): boolean {
  const t = text.trim();
  if (t.length > 24) return false;
  return GREETING_RE.test(t) || GREETING_ZH_RE.test(t);
}

export function detectP0OpeningType(userMessage: string): P0OpeningDetectionResult {
  const text = userMessage.trim();
  if (!text) {
    return { type: "writing_difficulty", confidence: "medium" };
  }

  if (isShortGreeting(text)) {
    return { type: "greeting", confidence: "high" };
  }

  if (ADVICE_SEEKING_RE.test(text) || ADVICE_SEEKING_ZH_RE.test(text)) {
    return { type: "advice_seeking", confidence: "high" };
  }

  if (QUESTION_REQUEST_RE.test(text) || QUESTION_REQUEST_ZH_RE.test(text)) {
    return { type: "question_request", confidence: "high" };
  }

  if (WRITING_DIFFICULTY_RE.test(text) || WRITING_DIFFICULTY_ZH_RE.test(text)) {
    return { type: "writing_difficulty", confidence: "high" };
  }

  if (text.length >= DOCUMENT_MIN_CHARS) {
    return { type: "document_upload", confidence: "medium" };
  }

  if (text.length >= LONG_CONTEXT_MIN_CHARS) {
    return { type: "long_context", confidence: "medium" };
  }

  if (EMOTIONAL_RE.test(text) || EMOTIONAL_ZH_RE.test(text)) {
    return { type: "emotional_opening", confidence: "medium" };
  }

  if (/\b(today|yesterday|when|then|after|before|during|while)\b/i.test(text) && text.length >= 48) {
    return { type: "story", confidence: "low" };
  }

  if (hasCjk(text) && text.length >= 12 && !isShortGreeting(text)) {
    return { type: "emotional_opening", confidence: "low" };
  }

  if (text.length <= 16) {
    return { type: "greeting", confidence: "low" };
  }

  return { type: "unknown", confidence: "low" };
}
