/**
 * Lightweight thread labels for V3 Thread.label, Recent Threads, and Phase 4 current-space marker.
 * Wisewave narrowing pack: docs/hc-os-v1-phase-4-marker-language-narrowing-pack-wisewave.md
 * Tree reach pass: trace fallbacks + optional labelEntropy (session/thread) reduces cross-row collision
 * (Lumen: repeated "still more here than shows" across threads).
 */

function stableLabelHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pickTraceFallback(
  text: string,
  variants: readonly string[],
  labelEntropy?: string | null
): string {
  const seed =
    labelEntropy && labelEntropy.length > 0
      ? `${text}\x1e${labelEntropy}`
      : text;
  const idx = stableLabelHash(seed) % variants.length;
  return variants[idx] ?? variants[0];
}

/** EN: when no heuristic matches — admissible trace fragments (not GENERIC_LABELS). */
const EN_TRACE_FALLBACKS = [
  "something still here",
  "a little still near",
  "not quite settled yet",
  "something quiet still here",
  "still a faint pull here",
  "not fully quiet yet",
  "still not fully gone",
  "something still close",
  "still a little open",
  "not quite landed",
  "still carrying a little weight",
  "this still feels nearby",
] as const;

const ZH_TRACE_FALLBACKS = [
  "这里还留着一点",
  "好像还有一点在",
  "还有一点没散开",
  "似乎还轻轻在这里",
  "还没有完全落下",
  "这里还轻轻停着什么",
  "还没完全安静下来",
  "似乎还有一点敞着",
  "还带着一点重量",
  "好像还有一点余波",
  "那个感觉似乎还在附近",
  "这里还留着一点那个感觉",
] as const;

/**
 * Overwhelm path: large pool so no single line dominates the drawer
 * (Lumen: "still more here than shows" occasional repetition is residual, not defining).
 */
const EN_OVERWHELM_TRACE_VARIANTS = [
  "still more here than shows",
  "still a lot held inside",
  "something still spilling over",
  "not quite room to hold it",
  "a little more here than fits",
  "still heavy underneath the surface",
  "still fuller than it looks",
  "something still backing up",
  "not all on the surface yet",
  "still tight around the edges",
  "something still unspoken here",
  "edges still holding something",
  "still inwardly crowded",
  "a quiet surplus still here",
  "still carrying extra underneath",
  "something still waiting inside",
] as const;

/**
 * Phase 5 / Lumen Batch 3 — delayed-reply + silence interpretation substrate.
 * Traces must match Continue-picker strong-family tokens (reply/silence/wait/delay/pull/inward/weight…),
 * otherwise these turns fell through to weak EN fallbacks and surfaced 0 Continue options.
 */
const EN_DELAYED_REPLY_SILENCE_TRACE_VARIANTS = [
  "Slow reply still pulls inward",
  "Waiting still carries weight here",
  "Silence still turns inward",
  "No reply still pulls inward",
  "Delayed text still sits heavy",
  "Left on read still carries weight",
  "Waiting on a reply still pulls inward",
  "Their silence still sits heavy here",
] as const;

/** EN replay-for-mistakes / mental replay — strong tokens (wrong, pull, inward, blame…). */
const EN_REPLAY_MISTAKES_TRACE_VARIANTS = [
  "Replaying still pulls inward",
  "Still replaying what went wrong",
  "Searching for mistakes still pulls inward",
  "Running it back still sits heavy here",
] as const;

const ZH_DELAYED_REPLY_SILENCE_TRACE_VARIANTS = [
  "慢回还在心里拉着",
  "等回复还在沉着一点",
  "沉默还在往里拉着",
  "已读不回还在心里沉着",
  "迟迟未回还在紧紧拉着",
  "等不到回音还在沉着",
  "对方沉默还在往里拉着",
] as const;

const ZH_REPLAY_MISTAKES_TRACE_VARIANTS = [
  "脑内重播还在紧紧拉着",
  "反复回想还在往里拉着",
  "找自己错处还在紧紧拉着",
] as const;

/** Phase 6 — interrupted articulation / lost thread (strong Continue tokens only). */
const EN_INTERRUPTED_ARTICULATION_TRACE_VARIANTS = [
  "Cut-off thought still pulls inward",
  "Lost thread still carries weight here",
  "Interrupted line still sits heavy",
  "Hard to pick back up still pulls inward",
] as const;

const ZH_INTERRUPTED_ARTICULATION_TRACE_VARIANTS = [
  "说到一半还在心里拉着",
  "被打断的地方还沉着一点",
  "接不上的那一句还在紧紧拉着",
] as const;

/** Phase 6 — rest / permission without earned sense (worth-pressure family). */
const EN_EARNED_REST_TRACE_VARIANTS = [
  "Rest still does not feel earned here",
  "Stopping still carries weight before it feels allowed",
  "Permission to rest still sits heavy",
  "Earned rest still feels out of reach",
] as const;

const ZH_EARNED_REST_TRACE_VARIANTS = [
  "休息还不太敢真正落下",
  "停下来之前好像还差一点点配得",
  "允许休息这件事还在沉沉压着",
] as const;

function enLooksLikeInterruptedArticulation(lower: string): boolean {
  if (enLooksLikeDelayedReplySilence(lower)) return false;
  if (enLooksLikeReplayForMistakes(lower)) return false;
  return (
    /\b(lost (my |the )?(train|thread|place)|mid-thought|mid sentence|mid-sentence|cut (me )?off|got interrupted|trailing off|can'?t pick (it |this |things )?back up|\bwhere was i\b|hard to pick back up)\b/i.test(
      lower
    )
  );
}

function enLooksLikeEarnedRest(lower: string): boolean {
  if (enLooksLikeDelayedReplySilence(lower) || enLooksLikeReplayForMistakes(lower))
    return false;
  return (
    /\b(can'?t rest|cannot rest|rest doesn'?t feel|don'?t feel .{0,24}earned|not feel .{0,24}earned|guilty (about )?rest(ing)?|rest feels wrong|allow myself to rest|permission to rest|stop without earning)\b/i.test(
      lower
    ) ||
    (/\brest(ing)?\b/.test(lower) &&
      /\b(earn|earned|deserve|deserving|permission|allowed|unearned)\b/i.test(lower))
  );
}

function zhLooksLikeInterruptedArticulation(t: string): boolean {
  if (zhLooksLikeDelayedReplySilence(t)) return false;
  if (zhLooksLikeReplayForMistakes(t)) return false;
  return /(说到一半|被打断|接不上|忘了刚才|念头断了|话没说完|想着想着就断了)/.test(t);
}

function zhLooksLikeEarnedRest(t: string): boolean {
  if (zhLooksLikeDelayedReplySilence(t) || zhLooksLikeReplayForMistakes(t))
    return false;
  return /(不敢休息|没法休息|不配休息|没资格停|休息.*愧疚|停下.*(不配|没资格)|得先.*才.*歇)/.test(
    t
  );
}

function enLooksLikeDelayedReplySilence(lower: string): boolean {
  return (
    /\b(no reply|didn'?t reply|won'?t reply|slow reply|delayed reply|delayed text)\b/.test(
      lower
    ) ||
    /\b(ghost(ed|ing)?|left on read|read receipts?|soft ghost)\b/.test(lower) ||
    /\b(silent treatment|not texting back|hasn'?t text(ed)?|haven'?t heard back)\b/.test(
      lower
    ) ||
    /\b(waiting (for (a |the |my )?)?(reply|response|text|message|them|him|her)\b)/.test(
      lower
    ) ||
    /\b(nothing back from them|they('re|'ve) gone quiet|gone quiet on me)\b/.test(lower) ||
    /\b(took (forever |so long )?to reply|took ages to text)\b/.test(lower)
  );
}

function enLooksLikeReplayForMistakes(lower: string): boolean {
  if (enLooksLikeDelayedReplySilence(lower)) return false;
  return (
    /\b(replay(ing)?|playing it back|runs? through my head|running it back|over and over in my head)\b/.test(
      lower
    ) ||
    /\b(where i went wrong|what i did wrong|must have messed up|searching for (my )?mistakes)\b/.test(
      lower
    )
  );
}

function zhLooksLikeDelayedReplySilence(t: string): boolean {
  return /(没回|不回|不回复|无回音|沉默|已读|慢回|晚回|迟迟|等不到|不回消息|没回音|对方不回)/.test(
    t
  );
}

function zhLooksLikeReplayForMistakes(t: string): boolean {
  if (zhLooksLikeDelayedReplySilence(t)) return false;
  return /(重播|回放|反复想|一遍一遍|找错|哪里做错|做错了)/.test(t);
}

export function summarizeThreadLabelFromUserMessage(
  text: string,
  labelEntropy?: string | null
): string {
  const t = text.trim();
  if (!t) return "Quiet trace";
  const hasCjk = /[\u4e00-\u9fff]/.test(t);
  if (hasCjk) {
    if (zhLooksLikeDelayedReplySilence(t)) {
      return pickTraceFallback(t, ZH_DELAYED_REPLY_SILENCE_TRACE_VARIANTS, labelEntropy);
    }
    if (zhLooksLikeReplayForMistakes(t)) {
      return pickTraceFallback(t, ZH_REPLAY_MISTAKES_TRACE_VARIANTS, labelEntropy);
    }
    if (zhLooksLikeInterruptedArticulation(t)) {
      return pickTraceFallback(t, ZH_INTERRUPTED_ARTICULATION_TRACE_VARIANTS, labelEntropy);
    }
    if (zhLooksLikeEarnedRest(t)) {
      return pickTraceFallback(t, ZH_EARNED_REST_TRACE_VARIANTS, labelEntropy);
    }
    if (/(做对|出错|不能错|完美|证明)/.test(t)) return "这里还轻轻紧着一点";
    if (/(怀疑|不够好|价值|拉扯)/.test(t)) return "下面好像还有一点在";
    if (/(迟疑|犹豫|不敢|停不下)/.test(t)) return "似乎还有一点收着";
    if (/(工作|事情不顺|受挫|低落)/.test(t)) return "这里还留着一点重量";
    if (/(很急|来不及|绷紧|焦虑|压力)/.test(t)) return "还有一点轻微的拉着";
    if (/(孤独|一个人|没人听|孤立|孤单)/.test(t)) return "这里还轻轻空着一点";
    if (/(崩溃|撑不住|受不了|顶不住)/.test(t)) return "好像还有点承不住";
    if (/(睡不着|失眠|翻来覆去|躺着想)/.test(t)) return "还没完全静下来";
    if (/(家人|父母|爸妈|原生家庭|家里)/.test(t)) return "下面好像还有一点在";
    if (/(分手|离婚|对象|伴侣|男朋友|女朋友)/.test(t)) return "还没完全散开";
    if (/(内疚|愧疚|自责)/.test(t)) return "这里还留着一点重量";
    if (/(失去|去世|走了|不在了|想念)/.test(t)) return "好像还有一点在";
    return pickTraceFallback(t, ZH_TRACE_FALLBACKS, labelEntropy);
  }
  const lower = t.toLowerCase();
  if (enLooksLikeDelayedReplySilence(lower)) {
    return pickTraceFallback(t, EN_DELAYED_REPLY_SILENCE_TRACE_VARIANTS, labelEntropy);
  }
  if (enLooksLikeReplayForMistakes(lower)) {
    return pickTraceFallback(t, EN_REPLAY_MISTAKES_TRACE_VARIANTS, labelEntropy);
  }
  if (enLooksLikeInterruptedArticulation(lower)) {
    return pickTraceFallback(t, EN_INTERRUPTED_ARTICULATION_TRACE_VARIANTS, labelEntropy);
  }
  if (enLooksLikeEarnedRest(lower)) {
    return pickTraceFallback(t, EN_EARNED_REST_TRACE_VARIANTS, labelEntropy);
  }
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
  if (/\b(lonely|loneliness|isolated|alone|no one listens)\b/.test(lower)) {
    return "something still quiet here";
  }
  if (/\b(overwhelm|overwhelmed|too much|drowning|can'?t cope)\b/.test(lower)) {
    return pickTraceFallback(t, EN_OVERWHELM_TRACE_VARIANTS, labelEntropy);
  }
  if (/\b(insomnia|can'?t sleep|lying awake|sleep)\b/.test(lower)) {
    return "still not fully at rest";
  }
  if (/\b(parents?|mother|father|mom|dad|family|sibling)\b/.test(lower)) {
    return "a little still underneath";
  }
  if (/\b(partner|marriage|breakup|divorce|spouse|relationship)\b/.test(lower)) {
    return "still not fully eased";
  }
  if (/\b(guilt|guilty|ashamed|shame)\b/.test(lower)) {
    return "something still close underneath";
  }
  if (/\b(grief|loss|funeral|died|death|miss (them|him|her))\b/.test(lower)) {
    return "something still here";
  }
  if (/\b(scared|afraid|frightened|fear)\b/.test(lower)) {
    return "a little tension still near";
  }
  if (/\b(sad|depressed|hopeless|empty inside)\b/.test(lower)) {
    return "something quiet still here";
  }
  return pickTraceFallback(t, EN_TRACE_FALLBACKS, labelEntropy);
}
