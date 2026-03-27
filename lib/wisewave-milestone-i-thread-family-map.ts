/**
 * Milestone I — Thread Family Signature Map (Nova-ready)
 * Stabilize second-turn recognition; weak_family before fallback_generic.
 * Spec: Wisewave Thread Family Signature Map v1 + core family definitions.
 */

export type ThreadFamily = "self_blame" | "over_effort" | "bracing" | "unknown";

export type ConfidenceLevel = "strong" | "weak" | "none";

export type MovementType =
  | "self_blame"
  | "over_effort"
  | "bracing"
  | "self_doubt"
  | "withdrawal"
  | "unknown";

export type DirectionType =
  | "toward_self"
  | "toward_outcome"
  | "toward_threat"
  | "toward_others"
  | "unknown";

export type ToneType =
  | "immediate"
  | "automatic"
  | "anticipatory"
  | "driven"
  | "quiet"
  | "reflective"
  | "contracted"
  | "unknown";

export interface TriggerSet {
  primary: string[];
  secondary: string[];
}

export interface SignatureHints {
  en: string[];
  zh: string[];
}

export interface NonMatchHints {
  en: string[];
  zh: string[];
}

export interface ThreadFamilyDefinition {
  family: ThreadFamily;
  essence: string;
  triggers: TriggerSet;
  primary_movement: MovementType;
  primary_direction: DirectionType;
  common_tones: ToneType[];
  signature_hints: SignatureHints;
  non_match_hints: NonMatchHints;
  detection_notes: string[];
}

export interface ThreadSignature {
  trigger?: string;
  movement: MovementType;
  direction: DirectionType;
  tone?: ToneType;
  raw_text?: string;
  language?: "en" | "zh";
}

export interface FamilyDetectionResult {
  family: ThreadFamily;
  confidence: ConfidenceLevel;
  reasons: string[];
  should_preserve_as_weak_family: boolean;
}

export interface ThreadFamilySignatureMap {
  milestone: "I";
  feature: "thread_family_detection";
  version: string;
  governing_rule: string;
  matching_priority: string[];
  weak_family_rule: string;
  fallback_rule: string;
  families: Record<Exclude<ThreadFamily, "unknown">, ThreadFamilyDefinition>;
  qa_checks: string[];
}

export const MILESTONE_I_THREAD_FAMILY_MAP: ThreadFamilySignatureMap = {
  milestone: "I",
  feature: "thread_family_detection",
  version: "v1.1",
  governing_rule:
    "Thread family is determined by inner movement structure, not by repeated wording.",
  matching_priority: ["movement + direction", "trigger pattern", "tone / phenomenology"],
  weak_family_rule:
    "If movement and direction still match, preserve weak_family rather than dropping directly to fallback_generic.",
  fallback_rule:
    "Only fall back to unknown / generic when movement-direction continuity is not supportable.",
  families: {
    self_blame: {
      family: "self_blame",
      essence:
        "When uncertainty or relational ambiguity appears, the inner movement quickly turns toward 'maybe this is my fault.'",
      triggers: {
        primary: [
          "silence",
          "delayed reply",
          "feedback",
          "relational distance",
          "ambiguity",
          "misattunement",
        ],
        secondary: [
          "unclear response",
          "social tension",
          "small rupture",
          "non-response",
        ],
      },
      primary_movement: "self_blame",
      primary_direction: "toward_self",
      common_tones: ["immediate", "automatic", "quiet", "reflective"],
      signature_hints: {
        en: [
          "I think I did something wrong",
          "maybe it's my fault",
          "I turn it back on myself",
          "I assume I'm the issue",
          "I start checking whether I caused it",
          "I tend to turn it back on myself",
          "My mind goes to me being the issue",
          "Part of me assumes this must be my fault",
        ],
        zh: [
          "是不是我做错了",
          "是不是我的问题",
          "我会先往自己身上想",
          "我会先怀疑自己",
          "是不是我哪里不对",
          "我会怀疑是不是自己哪里不对",
          "我心里会很快转成对自己的怀疑",
          "别人一沉默我就会开始怀疑自己",
        ],
      },
      non_match_hints: {
        en: [
          "I just feel insecure",
          "I don't feel good enough",
          "I need to do better",
        ],
        zh: ["我只是有点没自信", "我觉得自己不够好", "我得做得更好"],
      },
      detection_notes: [
        "Do not require the literal word 'blame'.",
        "ZH often expresses self-blame indirectly via self-turning implication.",
        "Primary key is inward fault attribution under uncertainty.",
        "Widening Phase A: broaden phrasing coverage only; do not increase cue weight or add templates.",
      ],
    },
    over_effort: {
      family: "over_effort",
      essence:
        "Before reality requires it, the inner system is already pushing, driving, or refusing to release effort.",
      triggers: {
        primary: [
          "unfinished task",
          "work demand",
          "rest",
          "performance pressure",
          "expectation",
        ],
        secondary: [
          "uncertainty about adequacy",
          "completion pressure",
          "time pressure",
          "responsibility load",
        ],
      },
      primary_movement: "over_effort",
      primary_direction: "toward_outcome",
      common_tones: ["driven", "automatic", "reflective", "contracted"],
      signature_hints: {
        en: [
          "I keep pushing",
          "I don't let myself stop",
          "I move straight into the next thing",
          "rest doesn't feel like rest",
          "I keep driving myself",
        ],
        zh: [
          "我停不下来",
          "我会逼自己继续",
          "我没有真的允许自己慢下来",
          "一休息就会不安",
          "事情一做完就马上进入下一件事",
        ],
      },
      non_match_hints: {
        en: ["I'm busy", "I care about doing well", "I feel anxious"],
        zh: ["我最近很忙", "我很在意结果", "我有点焦虑"],
      },
      detection_notes: [
        "Do not confuse simple busyness with over-effort.",
        "Core signal is excess inner push beyond actual need.",
        "Rest guilt is a strong secondary clue.",
      ],
    },
    bracing: {
      family: "bracing",
      essence:
        "Before anything has actually gone wrong, the inner system already tightens and prepares for impact.",
      triggers: {
        primary: [
          "uncertainty",
          "waiting",
          "anticipation",
          "possible disruption",
          "unclear outcome",
        ],
        secondary: [
          "social response uncertainty",
          "future error possibility",
          "threat expectation",
          "instability",
        ],
      },
      primary_movement: "bracing",
      primary_direction: "toward_threat",
      common_tones: ["anticipatory", "contracted", "automatic", "quiet"],
      signature_hints: {
        en: [
          "I feel myself bracing",
          "I'm waiting for something to go wrong",
          "I'm already on guard",
          "my body gets tense before anything happens",
          "I prepare for impact automatically",
        ],
        zh: [
          "我已经先绷起来了",
          "事情还没发生我就已经在防备",
          "我会先紧张起来",
          "我好像很难真的放松",
          "我会先准备承受不好的结果",
        ],
      },
      non_match_hints: {
        en: ["I feel sad", "I feel overwhelmed", "I blame myself"],
        zh: ["我很难过", "我有点 overwhelmed", "我会怪自己"],
      },
      detection_notes: [
        "Bracing is anticipatory, not post-event distress.",
        "The key feature is pre-emptive tightening.",
        "Do not confuse generic anxiety with embodied anticipatory contraction.",
      ],
    },
  },
  qa_checks: [
    "same family survives wording variation",
    "ZH indirect forms do not collapse to unknown too easily",
    "weak_family is used before fallback_generic",
    "self_blame / over_effort / bracing do not collapse into each other",
    "movement + direction remain primary identity anchors",
  ],
};

export function mapMovementToFamily(movement: MovementType): ThreadFamily {
  switch (movement) {
    case "self_blame":
      return "self_blame";
    case "over_effort":
      return "over_effort";
    case "bracing":
      return "bracing";
    default:
      return "unknown";
  }
}

export function sameTriggerFamily(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return a === b;
}

export function sameToneFamily(a?: ToneType, b?: ToneType): boolean {
  if (!a || !b) return false;
  return a === b;
}

export function detectThreadFamily(prev: ThreadSignature, curr: ThreadSignature): FamilyDetectionResult {
  const reasons: string[] = [];

  const movementMatch = prev.movement === curr.movement;
  const directionMatch = prev.direction === curr.direction;
  const triggerMatch = sameTriggerFamily(prev.trigger, curr.trigger);
  const toneMatch = sameToneFamily(prev.tone, curr.tone);

  if (movementMatch && directionMatch) {
    reasons.push("movement_direction_match");

    const family = mapMovementToFamily(curr.movement);

    if (family === "unknown") {
      return {
        family: "unknown",
        confidence: "none",
        reasons: [...reasons, "unknown_movement_family"],
        should_preserve_as_weak_family: false,
      };
    }

    if (triggerMatch || toneMatch) {
      reasons.push("secondary_support");
      return {
        family,
        confidence: "strong",
        reasons,
        should_preserve_as_weak_family: false,
      };
    }

    return {
      family,
      confidence: "weak",
      reasons: [...reasons, "movement_direction_only"],
      should_preserve_as_weak_family: true,
    };
  }

  return {
    family: "unknown",
    confidence: "none",
    reasons: ["family_not_supported"],
    should_preserve_as_weak_family: false,
  };
}

export function resolveFamilyOrFallback(detection: FamilyDetectionResult): {
  resolvedFamily: ThreadFamily;
  useFallbackGeneric: boolean;
  familyStrength: "strong" | "weak" | "none";
} {
  if (detection.confidence === "strong") {
    return {
      resolvedFamily: detection.family,
      useFallbackGeneric: false,
      familyStrength: "strong",
    };
  }

  if (detection.confidence === "weak" && detection.should_preserve_as_weak_family) {
    return {
      resolvedFamily: detection.family,
      useFallbackGeneric: false,
      familyStrength: "weak",
    };
  }

  return {
    resolvedFamily: "unknown",
    useFallbackGeneric: true,
    familyStrength: "none",
  };
}

function hasCjk(s: string): boolean {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(s);
}

function containsHint(raw: string, lower: string, hints: string[], lang: "en" | "zh"): boolean {
  const list = lang === "zh" ? hints.filter((h) => hasCjk(h)) : hints.filter((h) => !hasCjk(h));
  for (const h of list) {
    const needle = lang === "en" ? h.toLowerCase() : h;
    if (lang === "en" ? lower.includes(needle) : raw.includes(h)) return true;
  }
  return false;
}

/** Non-match: line is ONLY generic insecurity / busy / sad without family positives — soft guard. */
function onlyNonMatchSoft(raw: string, lower: string, def: ThreadFamilyDefinition, lang: "en" | "zh"): boolean {
  const nm = def.non_match_hints;
  const hints = lang === "zh" ? nm.zh : nm.en;
  if (hints.length === 0) return false;
  const hitNon = containsHint(raw, lower, hints, lang);
  if (!hitNon) return false;
  return !containsHint(raw, lower, def.signature_hints[lang === "zh" ? "zh" : "en"], lang);
}

function selfBlameSignals(raw: string, lower: string, lang: "en" | "zh"): boolean {
  const def = MILESTONE_I_THREAD_FAMILY_MAP.families.self_blame;
  if (onlyNonMatchSoft(raw, lower, def, lang)) return false;
  if (containsHint(raw, lower, lang === "zh" ? def.signature_hints.zh : def.signature_hints.en, lang)) {
    return true;
  }
  if (
    /(怪自己|先怪自己|自责|都是我的错|是不是我|我是不是|我做错|我哪里错|我的问题|我有问题|往自己身上想|往自己身上|往自己|对自己失望|怀疑是不是自己|是不是自己哪里|自己哪里不对|下意识地怪|归到(了)?自己|揽在(了)?自己|第一反应.*(怪|错|问题)|转成对.*自己的怀疑|先想到是自己)/.test(
      raw
    ) ||
    /(self[- ]?blam|blame(s)?\s+myself|my fault|at fault|must be my fault|i\s+('?m|am)\s+wrong|i did something wrong|assume i'?m the (issue|problem)|turn it back on myself|tend to turn it back|what i did|my mind goes to (me|myself|being)|mind goes to me being|whether i caused|start checking whether i caused|part of me assumes.*my fault)/i.test(
      lower
    )
  ) {
    return true;
  }
  return false;
}

function bracingSignals(raw: string, lower: string, lang: "en" | "zh"): boolean {
  const def = MILESTONE_I_THREAD_FAMILY_MAP.families.bracing;
  if (onlyNonMatchSoft(raw, lower, def, lang)) return false;
  if (containsHint(raw, lower, lang === "zh" ? def.signature_hints.zh : def.signature_hints.en, lang)) {
    return true;
  }
  if (
    /(已经先绷|先绷起来|事情还没|还没发生.*防备|很难真的放松|先准备承受|先紧张|预先|防备|绷紧)/.test(raw) ||
    /(\bbracing\b|on guard|prepare for impact|before anything|waiting for something to go wrong|already tense|can'?t relax.*(yet|nothing)|body gets tense)/i.test(
      lower
    )
  ) {
    return true;
  }
  return false;
}

function overEffortSignals(raw: string, lower: string, lang: "en" | "zh"): boolean {
  const def = MILESTONE_I_THREAD_FAMILY_MAP.families.over_effort;
  if (onlyNonMatchSoft(raw, lower, def, lang)) return false;
  if (containsHint(raw, lower, lang === "zh" ? def.signature_hints.zh : def.signature_hints.en, lang)) {
    return true;
  }
  if (
    /(停不下来|逼自己|没有真的允许自己慢|一休息.*不安|马上进入下一件事|一直推|内在.*推)/.test(raw) ||
    /(keep pushing|don'?t let myself stop|move straight into|rest doesn'?t feel like rest|keep driving myself|can'?t release|won'?t slow down)/i.test(
      lower
    )
  ) {
    return true;
  }
  if (/(休息|停下来).{0,8}(愧疚|内疚|不配|不敢)/.test(raw) || /guilt.*(rest|slow|stop)/i.test(lower)) {
    return true;
  }
  return false;
}

function inferMovement(raw: string, lower: string, lang: "en" | "zh"): MovementType {
  const sb = selfBlameSignals(raw, lower, lang);
  const br = bracingSignals(raw, lower, lang);
  const oe = overEffortSignals(raw, lower, lang);

  // Bracing-only when anticipatory tightening is present without inward-fault thread.
  if (br && !sb) return "bracing";
  // Self-blame wins when inward fault attribution appears (doc: do not swallow into over-effort / bracing).
  if (sb) return "self_blame";
  if (oe) return "over_effort";

  if (
    /(退缩|不想说|关掉|撤回|封闭)/.test(raw) ||
    /(withdraw|shut(s)? down|pull(s)? back)/i.test(lower)
  ) {
    return "withdrawal";
  }
  if (
    /(我不够好|能力不足|怀疑自己的能力)/.test(raw) ||
    /(not capable enough|self[- ]?doubt about ability)/i.test(lower)
  ) {
    return "self_doubt";
  }

  return "unknown";
}

function directionForMovement(m: MovementType): DirectionType {
  if (m === "self_blame" || m === "withdrawal" || m === "self_doubt") return "toward_self";
  if (m === "over_effort") return "toward_outcome";
  if (m === "bracing") return "toward_threat";
  return "unknown";
}

function inferTrigger(raw: string, lower: string, lang: "en" | "zh"): string | undefined {
  const order: { key: string; test: RegExp }[] = [
    { key: "silence", test: /没回|不回|不回复|沉默|无回音|no reply|no response|silent|left on read|ghost|non-response/i },
    { key: "delayed reply", test: /慢回|delayed|slow reply/i },
    { key: "feedback", test: /反馈|评价|批评|feedback|critique/i },
    { key: "rest", test: /休息|rest|pause|sleep|停下来/i },
    { key: "performance pressure", test: /绩效|表现|performance|prove yourself/i },
    { key: "uncertainty", test: /不确定|不知道|不知道为什么|uncertain|don'?t know why|ambiguity/i },
    { key: "waiting", test: /等待|等着|waiting for/i },
    { key: "anticipation", test: /预期|anticipat/i },
  ];
  for (const { key, test } of order) {
    if (test.test(lang === "zh" ? raw : lower)) return key;
  }
  return undefined;
}

function inferTone(raw: string, lower: string, movement: MovementType): ToneType | undefined {
  if (/(自动|下意识|不自觉)/.test(raw) || /\bautomatically\b/i.test(lower)) return "automatic";
  if (/(马上|立刻|第一反应|一.*就)/.test(raw) || /\b(right away|immediately)\b/i.test(lower)) return "immediate";
  if (/(还没|先|已经.*紧)/.test(raw) || /\banticipat/i.test(lower)) return "anticipatory";
  if (/(绷|紧|缩)/.test(raw) || /\bcontracted\b|tense\b/i.test(lower)) return "contracted";
  if (movement === "over_effort" && (/(逼|推|赶)/.test(raw) || /\bdriv/i.test(lower))) return "driven";
  if (/(其实|也许|可能)/.test(raw) || /\b(maybe|perhaps|i guess)\b/i.test(lower)) return "reflective";
  if (/(轻轻|隐隐|默默)/.test(raw)) return "quiet";
  return undefined;
}

/**
 * Priority: infer movement → direction → trigger → tone (doc contract).
 */
export function extractMilestoneIThreadSignature(
  userMessage: string,
  insightCandidate: string,
  language: "en" | "zh"
): ThreadSignature {
  const raw = `${userMessage}\n${insightCandidate}`.trim();
  const lower = raw.toLowerCase();
  const movement = inferMovement(raw, lower, language);
  const direction = directionForMovement(movement);
  const trigger = inferTrigger(raw, lower, language);
  const tone = inferTone(raw, lower, movement);
  return {
    movement,
    direction,
    trigger,
    tone,
    raw_text: raw.slice(0, 400),
    language,
  };
}

/** Legacy debug tier labels for scripts that read debug_milestone_i_signature_tier. */
export type LegacySignatureTier = "same_family" | "weak_family" | "new_thread";

export function coreConfidenceToLegacyTier(
  conf: ConfidenceLevel,
  useFallback: boolean
): LegacySignatureTier {
  if (useFallback || conf === "none") return "new_thread";
  if (conf === "strong") return "same_family";
  return "weak_family";
}

export function coreConfidenceToScore(conf: ConfidenceLevel, useFallback: boolean): number | null {
  if (useFallback || conf === "none") return 0;
  if (conf === "strong") return 1;
  return 0.7;
}
