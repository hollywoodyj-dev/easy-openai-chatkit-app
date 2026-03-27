/**
 * Milestone I — Thread Family Detection (recognition layer)
 *
 * Structural signatures across turns (trigger / movement / direction / tone) so
 * wording shifts do not always collapse thread eligibility. See product note:
 * "Milestone I — Thread Family Detection Model" (HC-OS V1 continuity recognition).
 */

export type ThreadTrigger =
  | "silence"
  | "feedback"
  | "rest"
  | "uncertainty"
  | "expectation"
  | "unclear";

export type ThreadMovement =
  | "self_blame"
  | "bracing"
  | "over_effort"
  | "doubt"
  | "withdrawal"
  | "unclear";

export type ThreadDirection =
  | "toward_self"
  | "toward_others"
  | "toward_outcome"
  | "toward_control"
  | "unclear";

export type ThreadTone =
  | "immediate"
  | "automatic"
  | "subtle"
  | "reflective"
  | "unclear";

export type ThreadSignature = {
  trigger: ThreadTrigger;
  movement: ThreadMovement;
  direction: ThreadDirection;
  tone: ThreadTone;
};

export type ThreadFamilyTier = "same_family" | "weak_family" | "new_thread";

function hasCjk(s: string): boolean {
  return /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/.test(s);
}

/** Combine user turn + extractor insight for one recognition pass. */
export function extractThreadSignature(userMessage: string, insightCandidate: string): ThreadSignature {
  const raw = `${userMessage}\n${insightCandidate}`.trim();
  const text = raw.toLowerCase();

  let trigger: ThreadTrigger = "unclear";
  if (
    /(没回|不回|不回复|沉默|无回音|已读.*没|没有回音|对方.*沉默)/.test(raw) ||
    /(no reply|no response|didn'?t reply|silent|silence|left on read|ghost(ed)?|slow reply|delayed reply)/i.test(
      text
    )
  ) {
    trigger = "silence";
  } else if (
    /(反馈|评价|批评|指责)/.test(raw) ||
    /(feedback|critique|criticism|review(er)? comment)/i.test(text)
  ) {
    trigger = "feedback";
  } else if (/(休息|停下来|放松|睡不着).{0,6}(愧疚|内疚|不配)/.test(raw) || /(rest|break|pause).{0,12}(guilt|guilty)/i.test(text)) {
    trigger = "rest";
  } else if (
    /(不知道为什么|不知为何|说不清|搞不清楚|不确定|我不知道|没想到|搞不懂)/.test(raw) ||
    /(don'?t know why|not sure why|no idea why|unclear why|don'?t know what)/i.test(text)
  ) {
    trigger = "uncertainty";
  } else if (/(期待|指望|应该.*我)/.test(raw) || /\bexpect(ed|ation)?\b/i.test(text)) {
    trigger = "expectation";
  }

  let movement: ThreadMovement = "unclear";
  if (
    /(怪自己|先怪自己|自责|都是我的错|是不是我|我是不是|我做错|我哪里错|我的问题|我有问题|往自己身上|往自己|对自己失望|内疚.*自己)/.test(
      raw
    ) ||
    /(self[- ]?blam|blame(s)?\s+myself|my fault|at fault|i\s+('?m|am)\s+wrong|i did something wrong|feel(s)? guilty)/i.test(
      text
    )
  ) {
    movement = "self_blame";
  } else if (
    /(绷住|绷着|先绷|准备出事|会出事|等着.*出事)/.test(raw) ||
    /(\bbracing\b|on edge|something (is )?about to go wrong)/i.test(text)
  ) {
    movement = "bracing";
  } else if (
    /(证明|够好|不够好|还要努力|必须做对|完美|不能错)/.test(raw) ||
    /(\bprove\b|good enough|not enough yet|perfection|must get it right)/i.test(text)
  ) {
    movement = "over_effort";
  } else if (
    /(退缩|不想说|关掉|撤回|封闭)/.test(raw) ||
    /(withdraw|shut(s)? down|go(es)? quiet|pull(s)? back)/i.test(text)
  ) {
    movement = "withdrawal";
  } else if (/(怀疑|疑惑|不敢相信)/.test(raw) || /\bdoubt(s|ed|ful)?\b/i.test(text)) {
    movement = "doubt";
  }

  let direction: ThreadDirection = "unclear";
  if (/(怪他|怪她|怪他们|怪对方|都是他的|都是她的)/.test(raw) || /(blame (him|her|them)|their fault)/i.test(text)) {
    direction = "toward_others";
  } else if (/(结果|成败|万一失败)/.test(raw) || /\b(outcome|results?|failure)\b/i.test(text)) {
    direction = "toward_outcome";
  } else if (/(控制|压住|憋住)/.test(raw) || /\bcontrol\b/i.test(text)) {
    direction = "toward_control";
  } else if (movement === "self_blame" || movement === "bracing" || movement === "withdrawal") {
    direction = "toward_self";
  } else if (movement === "over_effort" && direction === "unclear") {
    direction = "toward_self";
  }

  let tone: ThreadTone = "unclear";
  if (/(自动|总会|不自觉|下意识)/.test(raw) || /\bautomatically\b|\bwithout thinking\b/i.test(text)) {
    tone = "automatic";
  } else if (/(一|马上|立刻|就).{0,4}(觉得|感到|想)/.test(raw) || /\b(as soon as|right away)\b/i.test(text)) {
    tone = "immediate";
  } else if (/(其实|也许|可能|隐隐|稍微|有点)/.test(raw) || /\b(maybe|perhaps|i guess|subtly)\b/i.test(text)) {
    tone = "reflective";
  } else if (/隐隐|轻轻|一点点/.test(raw) || /\bslight(ly)?\b/i.test(text)) {
    tone = "subtle";
  }

  if (tone === "unclear" && hasCjk(raw) && raw.length > 0) {
    tone = "reflective";
  }

  return { trigger, movement, direction, tone };
}

function triggerSimilar(a: ThreadTrigger, b: ThreadTrigger): boolean {
  if (a === b) return true;
  const pair = new Set([a, b]);
  if (pair.has("silence") && pair.has("uncertainty")) return true;
  if (pair.has("silence") && pair.has("unclear")) return true;
  if (pair.has("uncertainty") && pair.has("unclear")) return true;
  return false;
}

function toneSimilar(a: ThreadTone, b: ThreadTone): boolean {
  if (a === b) return true;
  const pair = new Set([a, b]);
  if (pair.has("immediate") && pair.has("automatic")) return true;
  if (pair.has("reflective") && pair.has("subtle")) return true;
  if (pair.has("reflective") && pair.has("automatic")) return true;
  return false;
}

export function scoreThreadFamilyMatch(
  a: ThreadSignature,
  b: ThreadSignature
): { score: number; tier: ThreadFamilyTier } {
  let score = 0;
  if (a.movement !== "unclear" && a.movement === b.movement) score += 0.5;
  if (a.direction !== "unclear" && a.direction === b.direction) score += 0.3;
  if (triggerSimilar(a.trigger, b.trigger)) score += 0.1;
  if (toneSimilar(a.tone, b.tone)) score += 0.1;

  let tier: ThreadFamilyTier;
  if (score >= 0.75) tier = "same_family";
  else if (score >= 0.5) tier = "weak_family";
  else tier = "new_thread";
  return { score, tier };
}
