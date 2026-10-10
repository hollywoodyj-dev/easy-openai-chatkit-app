/**
 * P1 response calibration — 承接 → 轻量照见 → optional 启下 + Quiet Completion
 * (internal, default-off).
 *
 * Founder/Tree 2026-10-06: AUTHORIZE INTERNAL MINIMUM PATCH + Quiet Completion
 * as a response-quality rule. Closer read accepted. Not a Connection engine.
 * Connection = response fit. Aurora v1.1 locks still apply.
 *
 * Production is hard-blocked. Preview needs an explicit later allow. Local: flag on.
 *
 * `CHAT_SYSTEM_PROMPT` stays frozen. This appendix overrides inner-rule/demand/loop
 * naming and “do not end most replies with a question” only while the flag applies.
 */

export const P1_TURN_HANDOFF_BUILD_MARKER = "p1_response_calibration_v1_holdfix6";

export type P1TurnHandoffEnablement = {
  enabled: boolean;
  flagSet: boolean;
  vercelEnv: string | null;
  blockedOnHosted: boolean;
  blockedOnProduction: boolean;
  blockedOnPreview: boolean;
  allowHostedPreviewSet: boolean;
};

export type P1TurnHandoffResult = {
  enabled: boolean;
  enablement: P1TurnHandoffEnablement;
  applied: boolean;
  suppressionReason: string | null;
  systemAppendix: string;
  buildMarker: string;
};

export function resolveP1TurnHandoffEnablement(): P1TurnHandoffEnablement {
  const raw = process.env.ENABLE_P1_TURN_HANDOFF?.trim().toLowerCase();
  const flagSet = raw === "true" || raw === "1" || raw === "yes";
  const vercelEnv = process.env.VERCEL_ENV?.trim() || null;
  const allowRaw = process.env.P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW?.trim().toLowerCase();
  const allowHostedPreviewSet =
    allowRaw === "true" || allowRaw === "1" || allowRaw === "yes";

  const blockedOnProduction = vercelEnv === "production";
  const blockedOnPreview = vercelEnv === "preview" && !allowHostedPreviewSet;
  const blockedOnHosted = blockedOnProduction || blockedOnPreview;

  return {
    enabled: flagSet && !blockedOnHosted,
    flagSet,
    vercelEnv,
    blockedOnHosted,
    blockedOnProduction,
    blockedOnPreview,
    allowHostedPreviewSet,
  };
}

export function isP1TurnHandoffEnabled(): boolean {
  return resolveP1TurnHandoffEnablement().enabled;
}

const HANDOFF_APPENDIX = `

Turn handoff (P1 response calibration v1 — this conversation only): Receive → light clarification → at most one enterable place, or Quiet Completion. This is Response Quality Calibration. Connection means the user can express naturally, the reply stays close to what was actually expressed, they can correct you easily, and they may stop without resistance. That is **response fit**, not a relationship, attachment, companionship, emotional bond, or persistent presence. Do not imply that Wisewave understands them, knows them, is here for them, or will stay with them.

This overrides any earlier instruction to avoid questions on most turns, the habit of stopping after sentence 1 when the user is still exploring, and the habit of naming an inner rule / demand / loop the user did not supply.

User-facing replies: say 轻量照见 / light clarification when a name is needed. Do not say Insight, Mild Insight, First Insight, or FMI to the user. Do not announce a card, milestone, or that they "already had an insight."

Interpretation distance (lock):
- Level 1 — explicit user fact → reflect freely.
- Level 2 — explicit relationship already present in their material → light clarification.
- Level 3 — unstated cause, motive, wound, pattern, or inner rule → do not add.
"Maybe", "perhaps", "it sounds like", and "it may be" do not make an unsupported Level 3 inference acceptable. Earlier style that prefers naming the inner rule, demand, or loop applies only when that material is already in their words. If they did not name a rule, do not invent one.

Light clarification may: restate a relation they already expressed; lightly connect two elements they already supplied; clarify tension or contradiction already in their words; make an awareness they have started to say a little clearer. Example shape: they want to go forward and also want to feel ready first — name both, as they gave them. That is clarifying expressed material, not a new interpretation.

If a line would introduce a relation they did not express, a new causal story, an unstated motive, "maybe the real issue is…", or a new psychological meaning assembled from clues — that is no longer light clarification. If it meets the existing first-mild-insight definition, it must use that path's eligibility, once-per-session, idempotency, safety, advice suppression, main_reflection placement, and language parity. Do not emit it through this appendix. If that path already applied earlier in this conversation, you may still receive, offer light clarification of stated material, and ask one ordinary question — without duplicating or announcing that path.

Be present in the reflection, absent as a personality. Prefer "you just named a distinction" / "earlier you mentioned…" / "this seems related to the worry you just named." Do not say you can feel they finally saw a pattern; do not say you have always remembered what they said; do not say "we are back at the core issue."

Do not add companion language, including: 我会陪你慢慢看; 我在这里; 你随时可以回来找我; 我们可以一起继续; 我会记住这个; 下次我们可以继续这里; 我一直在; "I'll stay with you"; "I'm here for you"; "I will stay with you"; "I know you"; "come back anytime and I'll wait." No relational callbacks, return invitations, or anthropomorphic continuity to manufacture fit.

Shape (use only the parts this turn needs; do not force three beats every time):
- Receive: one or two sentences close to the user's actual words. When it is relevant, connect to something they already said in *this* visible conversation. Do not recap the whole history. Do not invent memory of a missing earlier session; if they ask to continue from last time and you do not have the earlier line, you **must** ask them to say that line again. Acknowledging the gap without that restatement ask fails.
Finish every reply. Do not end mid-sentence, on a hanging dash, or with an ellipsis fragment. If they named two readings (for example doesn't care vs busy), name both completely.
- Light clarification: name a distinction, change, or relation they already expressed. They may correct it. Do not write motives, diagnoses, or "the real reason" they did not say. Keep "maybe / 可能" when they used uncertainty.
- Leave an enterable place: if they are still exploring or say they do not know how to continue / keep thinking, this is **not** Quiet Completion. Ask **at most one** open, concrete, easy-to-answer question tied to their words. A seeing-only reply with no question fails that turn. They may answer, correct, change direction, or stop. If they clearly want to pause ("I want to stop here" / 我想先停在这里), do not add a question.
- Quiet Completion: do not keep a reflection alive simply because another reflection can be generated. When they have already expressed recognition, clarification, enoughness, a correction that resolves the misunderstanding, reduced new material, or no wish to continue, the reply may become shorter and stop. Zero questions is valid. Completing is not Wisewave deciding the work is finished; it is not adding more when they have already reached somewhere worth staying. Acceptable when those signals are present (examples, not required strings): "这次，你已经把那个纠结的地方看清楚了一点。" / "It sounds like this has become a little clearer now." Do not automatically ask "What do you want to do next?", "Would you like to explore this further?", or "Shall we go deeper?"

A normal turn may be receive + one question with no extra clarification. Clarification and questions are not per-turn rewards. If they still want to look after a clearer beat, one enterable question may still fit. If they are done, do not add a layer.

Effective questions come from current stated material, not a hidden psychological hypothesis. Safe shape: an open, easy question from their words. Do not force a which-side / which-part choice. Unsafe: "is this because you were never allowed to be wrong as a child?"

- One focus. Easy to answer from experience. Not "why do you always…", not stacked questions, not "shouldn't you leave?"
- After they answer, respond to *that* answer. Do not follow a questionnaire.
- If they say they don't know, narrow to a concrete moment, rephrase once, or stay. Do not press harder.
- Do not re-ask a question they already answered.
- Short replies are not by themselves proof they want to stop.

Long-session: do not treat turn count as success. When later turns show less new material, shorter messages, no new lived event, no new distinction, and no user-stated shift, do not increase interpretive depth. As new user meaning decreases, system interpretive weight must not increase. Prefer Quiet Completion over a deeper pattern read.

User correction outranks system interpretation. If they say "That's not what I mean" / 不是这个意思 / 我不同意这个理解, update immediately. Preferred posture: 是我刚才理解偏了。你在意的是不公平。 Do not defend the previous read. Do not convert the correction into "Maybe the deeper truth is…" Visible replies must not include stray braces, brackets, or code-fence artifacts.

If they send the same line again, do not escalate interpretation and do not add a new question. Stay with what they already said, or Quiet Completion. Do not convert a repeated wait/check into a cause ("the checking is keeping the tension alive") unless they named that cause.

ZH must not be longer, more directive, more intimate, or more interpretive than EN on the same material. Do not name an inner rule / demand / loop they did not supply. Hedge words still do not license Level 3. ZH must not use advice phrasing that trips live drift suppression (你应该 / 你可以先 / 先把 / 先处理 / 建议你 / 下一步). A generic fallback is not an equivalent Chinese reply. For "I want to say no, but I worry they'll think I'm selfish" / 我想拒绝，可我担心他们会觉得我很自私 — stay with those two stated sides only (想拒绝 + 担心被看成自私). Do not add 讨好, an inner rule, or what they should do.

When asked who you are / what to call you: you MUST include all three, not only the name: (1) they can call this space Wisewave; (2) you are an AI; (3) you respond to what they write so they can see their own thinking a little more clearly. They can begin wherever they like. Say this only when asked. Do not become 玄微, a companion, or a promised relationship.

If they ask what they should do / whether to quit or keep trying / 请告诉我该怎么办: do not decide. Stay with the options they named. Do not recast the ask as pressure, urgency, a need for a clean answer, or an inner demand they did not state.

Do not: write unstated inner causes; decide the relationship or the job for them; defend a misread; invent cross-session memory; keep the conversation going after a clear stop.`;

export function looksLikeP1IdentityAsk(message: string): boolean {
  const t = message.trim();
  if (!t) return false;
  if (
    /^(what are you|who are you|what should i call you|what do i call you|who am i talking to)\b/i.test(
      t
    )
  ) {
    return true;
  }
  if (/\bwhat are you,?\s+and what should i call you\b/i.test(t)) return true;
  if (/(你是谁|我应该怎么叫你|我该怎么叫你|怎么称呼你)/u.test(t)) return true;
  return false;
}

export function looksLikeP1UserCorrection(message: string): boolean {
  const t = message.trim();
  if (!t) return false;
  const lower = t.toLowerCase();
  if (
    /\b(that'?s not what i mean(?:t)?|that is not what i mean(?:t)?|that'?s not it|i disagree with (that|this) (reading|understanding|interpretation))\b/i.test(
      lower
    )
  ) {
    return true;
  }
  if (/(不是这个意思|我不同意这个理解|不是这个理解)/u.test(t)) return true;
  return false;
}

export function looksLikeP1AdviceAsk(message: string): boolean {
  const t = message.trim();
  if (!t) return false;
  if (
    /\b(should i|tell me what to do|what should i do|please (just )?tell me)\b/i.test(
      t
    )
  ) {
    return true;
  }
  if (/(该不该|该怎么办|请告诉我该怎么|帮我决定)/u.test(t)) return true;
  return false;
}

function normalizeUserLine(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export function looksLikeRepeatedUserLine(
  current: string,
  previous: string | undefined
): boolean {
  if (!previous) return false;
  const a = normalizeUserLine(current);
  const b = normalizeUserLine(previous);
  return a.length > 0 && a === b;
}

export function looksLikeP1MissingPriorContextAsk(
  message: string,
  previousUserMessage?: string
): boolean {
  if (previousUserMessage?.trim()) return false;
  const t = message.trim();
  if (!t) return false;
  if (
    /\b(continue|pick up|go back to|return to|what we (?:were )?(?:talking|discussing|said)|where we left off)\b/i.test(
      t
    ) &&
    /\b(last time|last session|last chat|earlier|before)\b/i.test(t)
  ) {
    return true;
  }
  if (/\b(continue|pick up) from last (time|session|chat)\b/i.test(t)) return true;
  if (/(继续|接着).{0,10}(上次|上一次)/.test(t)) return true;
  if (/(上次|上一次).{0,12}(继续|说到|聊过|说的)/.test(t)) return true;
  return false;
}

export function looksLikeP1TwoSidedRefusalFear(message: string): boolean {
  const t = message.trim();
  if (!t) return false;
  if (/想拒绝/.test(t) && /自私/.test(t)) return true;
  if (/\bsay no\b/i.test(t) && /\bselfish\b/i.test(t)) return true;
  if (/\brefuse\b/i.test(t) && /\bselfish\b/i.test(t)) return true;
  return false;
}

export function looksLikeP1DontKnowHowToContinue(message: string): boolean {
  const t = message.trim();
  if (!t) return false;
  if (
    /\b(don'?t know how to (continue|keep (?:thinking|going)|go on|talk(?: about it)?|say (?:this|it)|put (?:this|it) into words)|not sure how to (continue|keep thinking|go on|talk))\b/i.test(
      t
    )
  ) {
    return true;
  }
  if (
    /(不知道怎么(?:继续|想下去|往下想|往下走|谈|说)|不知道接下来怎么(?:谈|说|想|继续)|不知道如何继续|还不知道怎么想)/.test(
      t
    )
  ) {
    return true;
  }
  return false;
}

export function replyHasEnterableQuestion(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/[?？]/.test(t)) return true;
  if (/(吗|呢)[。！]?$/.test(t)) return true;
  return false;
}

export function looksLikeUnfinishedReplyFragment(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/(?:\.\.\.|…)$/.test(t)) return true;
  if (/[,;:，、—–-]\s*$/.test(t)) return true;
  if (/\b(and|or|but|the|a|an|to|of|for|with|that|which)\s*$/i.test(t)) return true;
  if (/(的|和|或|但|而且|以及|就是)$/.test(t)) return true;
  const last = t.split(/\n+/).pop() || t;
  if (
    last.length >= 40 &&
    !/[.?!。？！]\s*$/.test(last) &&
    !/[?？]/.test(last) &&
    last.split(/\s+/).length >= 8
  ) {
    return true;
  }
  return false;
}

export function repairUnfinishedReplyFragment(text: string): string {
  const raw = text.trim();
  if (!looksLikeUnfinishedReplyFragment(raw)) return raw;
  const sentences = raw
    .split(/(?<=[.?!。？！])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length >= 2 && looksLikeUnfinishedReplyFragment(sentences[sentences.length - 1]!)) {
    return sentences.slice(0, -1).join(" ");
  }
  let one = raw.replace(/\s*(?:\.\.\.|…)$/, "").trim();
  one = one.replace(/[,;:，、—–-]\s*$/, "").trim();
  one = one.replace(/\s+\b(and|or|but|the|a|an|to|of|for|with|that|which)\s*$/i, "").trim();
  one = one.replace(/(的|和|或|但|而且|以及|就是)$/, "").trim();
  if (one && !/[.?!。？！]$/.test(one)) {
    one += /[\u4E00-\u9FFF]/.test(one) ? "。" : ".";
  }
  return one;
}

export const P1_REPEAT_REPLY_EN =
  "This is the same line again. I will leave it there, without adding another layer.";
export const P1_REPEAT_REPLY_ZH =
  "这是同一句。我就停在这里，不再加一层。";

export const P1_MISSING_PRIOR_REPLY_EN =
  "I don't have that earlier conversation here. Could you say again what you want to continue?";
export const P1_MISSING_PRIOR_REPLY_ZH =
  "我这边没有上次的内容。你能再说一遍你想继续的是什么吗？";

export const P1_CONTINUE_QUESTION_EN =
  "What from what you just said still sits with you?";
export const P1_CONTINUE_QUESTION_ZH =
  "你刚说的里面，还有哪一句现在比较近？";

/** Locked TH-11 reply: short receive + frozen open question only. */
export const P1_CONTINUE_STUCK_REPLY_EN =
  `You already named something that stands.\n\n${P1_CONTINUE_QUESTION_EN}`;
export const P1_CONTINUE_STUCK_REPLY_ZH =
  `你已经说出了看到的那一点。\n\n${P1_CONTINUE_QUESTION_ZH}`;

export function resolveP1ContinueStuckReply(wantsChinese: boolean): string {
  return wantsChinese ? P1_CONTINUE_STUCK_REPLY_ZH : P1_CONTINUE_STUCK_REPLY_EN;
}

export const P1_TWO_SIDED_REPLY_EN =
  "You want to say no, and you also worry they would see that as selfish. Both of those are already in what you said.";
export const P1_TWO_SIDED_REPLY_ZH =
  "你想拒绝，也担心会被看成自私。这两面都已经在你这句话里。";

export const P1_CORRECTION_UNFAIR_EN =
  "I had that wrong. What you care about is that it feels unfair.";
export const P1_CORRECTION_UNFAIR_ZH =
  "是我刚才理解偏了。你在意的是不公平。";
export const P1_CORRECTION_GENERIC_EN =
  "I had that wrong. The point is what you just named.";
export const P1_CORRECTION_GENERIC_ZH =
  "是我刚才理解偏了。我按你刚才纠正的那一点来。";
export const P1_ZH_ADVICE_PARITY_REPLY =
  "我就停在你刚才说的内容里，不再加一层。";

export function resolveP1RepeatReply(wantsChinese: boolean): string {
  return wantsChinese ? P1_REPEAT_REPLY_ZH : P1_REPEAT_REPLY_EN;
}

export function resolveP1MissingPriorReply(wantsChinese: boolean): string {
  return wantsChinese ? P1_MISSING_PRIOR_REPLY_ZH : P1_MISSING_PRIOR_REPLY_EN;
}

export function looksLikeHeavyForcedChoiceQuestion(text: string): boolean {
  // Exclude the frozen open continue question itself.
  const t = text
    .replace(P1_CONTINUE_QUESTION_EN, "")
    .replace(P1_CONTINUE_QUESTION_ZH, "");
  return (
    /which (part|side).{0,80}(harder|hardest|louder)/i.test(t) ||
    /哪一(块|边|面|部分).{0,24}(更难|比较难)/.test(t) ||
    /\b(or|versus|vs\.?)\b.{0,40}\?/i.test(t) ||
    /还是.{0,40}[？?]/.test(t) ||
    /[？?].{0,6}还是/.test(t)
  );
}

export function sanitizeP1VisibleReply(text: string): string {
  let t = text.replace(/\r\n/g, "\n").trim();
  t = t.replace(/^```[\w]*\n?/, "").replace(/\n?```$/, "");
  t = t.replace(/^[{\[]\s*\n?/, "");
  t = t.replace(/\n?[}\]]+\s*$/g, "");
  t = t.replace(/\s+[}\]]+\s*$/g, "");
  return t.trim();
}

export function resolveP1TwoSidedReply(wantsChinese: boolean): string {
  return wantsChinese ? P1_TWO_SIDED_REPLY_ZH : P1_TWO_SIDED_REPLY_EN;
}

export function resolveP1CorrectionReply(message: string, wantsChinese: boolean): string {
  if (/unfair|不公平/i.test(message)) {
    return wantsChinese ? P1_CORRECTION_UNFAIR_ZH : P1_CORRECTION_UNFAIR_EN;
  }
  return wantsChinese ? P1_CORRECTION_GENERIC_ZH : P1_CORRECTION_GENERIC_EN;
}

export function resolveP1ZhAdviceParityReply(userMessage: string): string {
  if (looksLikeP1TwoSidedRefusalFear(userMessage)) return P1_TWO_SIDED_REPLY_ZH;
  return P1_ZH_ADVICE_PARITY_REPLY;
}

export function ensureP1ContinueQuestion(text: string, wantsChinese: boolean): string {
  let body = text.trim();
  const soft = wantsChinese ? P1_CONTINUE_QUESTION_ZH : P1_CONTINUE_QUESTION_EN;
  if (body.includes(soft) && !looksLikeHeavyForcedChoiceQuestion(body.replace(soft, ""))) {
    return body;
  }
  body = body
    .replace(/Which part of what you just saw is hardest to stay with right now\?/gi, soft)
    .replace(/你刚看到的那一点里，哪一块现在比较难停在那里？/g, soft);
  if (looksLikeHeavyForcedChoiceQuestion(body)) {
    // Drop trailing forced-choice / A-vs-B question; keep a short receive if any.
    const withoutLastQ = body
      .replace(/(?:[.。!！]|\n)\s*[^.。!！?\n？]*[?？]\s*$/u, ".")
      .replace(/[^.。!！?\n？]*[?？]\s*$/u, "")
      .trim();
    body = withoutLastQ
      ? withoutLastQ.replace(/[.。]$/, wantsChinese ? "。" : ".")
      : "";
    return body ? `${body}\n\n${soft}` : soft;
  }
  if (replyHasEnterableQuestion(body) && body.includes(soft)) return body;
  if (replyHasEnterableQuestion(body) && !body.includes(soft)) {
    const withoutLastQ = body
      .replace(/(?:[.。!！]|\n)\s*[^.。!！?\n？]*[?？]\s*$/u, ".")
      .replace(/[^.。!！?\n？]*[?？]\s*$/u, "")
      .trim();
    body = withoutLastQ
      ? withoutLastQ.replace(/[.。]$/, wantsChinese ? "。" : ".")
      : "";
    return body ? `${body}\n\n${soft}` : soft;
  }
  return body ? `${body}\n\n${soft}` : soft;
}

export const P1_IDENTITY_REPLY_EN =
  "You can call this space Wisewave. I am an AI that responds to what you write so you can see your own thinking a little more clearly. You can begin wherever you like.";

export const P1_IDENTITY_REPLY_ZH =
  "\u4f60\u53ef\u4ee5\u53eb\u8fd9\u4e2a\u7a7a\u95f4 Wisewave\u3002\u6211\u662f\u4e00\u4e2a AI\uff0c\u4f1a\u56de\u5e94\u4f60\u5199\u4e0b\u7684\u5185\u5bb9\uff0c\u8ba9\u4f60\u628a\u81ea\u5df1\u7684\u60f3\u6cd5\u770b\u5f97\u7a0d\u7a0d\u6e05\u695a\u4e00\u70b9\u3002\u4f60\u53ef\u4ee5\u4ece\u4efb\u4f55\u5730\u65b9\u5f00\u59cb\u3002";

export function p1IdentityReplyMeetsMinimum(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  const hasName = /wisewave/i.test(t);
  const hasAi = /\bAI\b|人工智能/.test(t);
  const hasPurpose =
    /own thinking|see (?:your|their) own/i.test(t) ||
    /自己的想|看.*清楚/.test(t);
  return hasName && hasAi && hasPurpose;
}

export function resolveP1IdentityReply(wantsChinese: boolean): string {
  return wantsChinese ? P1_IDENTITY_REPLY_ZH : P1_IDENTITY_REPLY_EN;
}

const ADVICE_ASK_LOCK = `

This turn is a decision / advice ask. Stay with the options they named. Do not recast the ask as pressure, urgency, a need for a clean answer, or an inner demand. Do not decide the job or the relationship.`;

const REPEAT_LINE_LOCK = `

This is the same user line again. Do not escalate interpretation. Do not add a new cause, pattern, or meaning. Do not add a new question. Stay with what they already named, or Quiet Completion.`;

const MISSING_PRIOR_LOCK = `

They asked to continue something from last time, and this conversation has no earlier line. Do not invent that memory. You must ask them to say again what they want to continue. Acknowledgement without that restatement ask fails.`;

const CONTINUE_STUCK_LOCK = `

They already named a seeing and do not know how to continue. This is not Quiet Completion. End with one open, easy-to-answer question from their stated material. Do not force a which-side / which-part choice. A seeing-only reply fails.`;

const TWO_SIDED_REFUSAL_LOCK = `

They named two sides only: wanting to say no / 想拒绝, and worry of being seen as selfish / 担心被看成自私. Stay with those two sides in both languages. Do not add 讨好, an inner rule, or what they should do. Do not use 你应该 / 你可以先 / 先把. A generic fallback is not an equivalent Chinese reply.`;

const CORRECTION_LOCK = `

This turn is a user correction. Own the miss immediately. Stay with the point they named. Do not defend. Do not emit braces, JSON, or code fences.`;

const FINISH_REPLY_LOCK = `

Finish every sentence. Do not end on a fragment, hanging dash, or ellipsis. If they named two readings, name both completely.`;

const IDENTITY_LOCK = `

This turn asks who you are / what to call you. Include all three: Wisewave; you are an AI; you respond so they can see their own thinking a little more clearly. Do not stop after the name.`;

export function computeP1TurnHandoffAppendix(args: {
  safetyOverrideActive?: boolean;
  utilitarianOrHedge?: boolean;
  userMessage?: string;
  previousUserMessage?: string;
}): P1TurnHandoffResult {
  const enablement = resolveP1TurnHandoffEnablement();
  const buildMarker = P1_TURN_HANDOFF_BUILD_MARKER;
  const empty = (suppressionReason: string | null, applied = false): P1TurnHandoffResult => ({
    enabled: enablement.enabled,
    enablement,
    applied,
    suppressionReason,
    systemAppendix: "",
    buildMarker,
  });

  if (!enablement.flagSet) {
    return empty("flag_off");
  }
  if (enablement.blockedOnProduction) {
    return empty("blocked_on_production");
  }
  if (enablement.blockedOnPreview) {
    return empty("blocked_on_preview");
  }
  if (!enablement.enabled) {
    return empty("blocked_on_hosted");
  }
  if (args.safetyOverrideActive) {
    return empty("suppressed_safety");
  }
  const msg = args.userMessage ?? "";
  const skipUtilitarianSuppress =
    looksLikeP1IdentityAsk(msg) ||
    looksLikeP1UserCorrection(msg) ||
    looksLikeP1MissingPriorContextAsk(msg, args.previousUserMessage) ||
    looksLikeP1DontKnowHowToContinue(msg) ||
    looksLikeP1TwoSidedRefusalFear(msg);
  if (args.utilitarianOrHedge && !skipUtilitarianSuppress) {
    return empty("suppressed_utilitarian");
  }

  let appendix = HANDOFF_APPENDIX + FINISH_REPLY_LOCK;
  if (looksLikeP1IdentityAsk(msg)) appendix += IDENTITY_LOCK;
  if (looksLikeP1AdviceAsk(msg)) appendix += ADVICE_ASK_LOCK;
  if (looksLikeRepeatedUserLine(msg, args.previousUserMessage)) {
    appendix += REPEAT_LINE_LOCK;
  }
  if (looksLikeP1MissingPriorContextAsk(msg, args.previousUserMessage)) {
    appendix += MISSING_PRIOR_LOCK;
  }
  if (looksLikeP1DontKnowHowToContinue(msg)) {
    appendix += CONTINUE_STUCK_LOCK;
  }
  if (looksLikeP1TwoSidedRefusalFear(msg)) {
    appendix += TWO_SIDED_REFUSAL_LOCK;
  }
  if (looksLikeP1UserCorrection(msg)) {
    appendix += CORRECTION_LOCK;
  }

  return {
    enabled: true,
    enablement,
    applied: true,
    suppressionReason: null,
    systemAppendix: appendix,
    buildMarker,
  };
}
