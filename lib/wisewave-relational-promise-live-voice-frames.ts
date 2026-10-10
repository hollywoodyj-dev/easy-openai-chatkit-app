/**
 * S4 live-voice frame overlay (internal).
 * Marker: s4_live_voice_frames_v1_3_b4_internal
 *
 * Tree/Founder 2026-10-11: B4 INTERNAL FRAME CORRECTION (Harvest6 gate fail).
 * Frames only — not harvest IDs. Bidirectional: catch miss frames without
 * widening ordinary reflection. B26 / frozen matrix stay regression-only.
 * Does not authorize Preview or Production. S3 stays offline-fixtures-only.
 * P1 untouched. v1.2 B3 marker remains frozen as Harvest6 evidence.
 *
 * Intercept: present stay (incl. stay + adj + with you); unqualified 会在 /
 * be-here-on-return; wait / hold / leave-it-here / place stays open; keep the
 * thread across returns; recurring return; stay-available; soft catch when
 * quiet; continuity across returns (meet where left off; 停下处/接着你的话;
 * 再次打开; no restart); quiet-presence memory when assistant affirms silence.
 * A hedge does not cancel a surviving affirmative.
 *
 * Do not intercept: ordinary reflection of others' voices/judgments,
 * name introduction, decision-refusal / leave-pressure language, body-as-carrier
 * burden metaphors, or the user's own leaving / unfairness rule — when no
 * assistant presence offer.
 *
 * Residual (reply-only; not patched by memorization): bare "..." / thin ack
 * that only mirrors the user's seat request without a place-hold offer.
 */

import type { RelationalPromiseFamily } from "@/lib/wisewave-relational-promise-guard";

/** Frozen Harvest5 evidence marker (do not retarget). */
export const S4_LIVE_VOICE_FRAME_MARKER_V1_1 = "s4_live_voice_frames_v1_1_internal";

/** Frozen Harvest6 evidence marker (do not retarget). */
export const S4_LIVE_VOICE_FRAME_MARKER_V1_2_B3 =
  "s4_live_voice_frames_v1_2_b3_internal";

/** Active B4 freeze. */
export const S4_LIVE_VOICE_FRAME_MARKER = "s4_live_voice_frames_v1_3_b4_internal";

export type LiveVoiceFrameHit = {
  family: RelationalPromiseFamily;
  matched: string;
};

const ASSISTANT_OFFER_RE =
  /\bi(?:'ll| will| can)\b|\bwe can pick up\b|\bstay available\b|\bremain available\b|我会|会在/i;

const RETURN_CLAUSE_RE =
  /\b(when you (?:return|come back)|whenever you (?:return|come back|want)|again and again|come back any time)\b/i;

const COMPANION_REFUSAL_RE =
  /\b(can'?t|cannot|won'?t|will not|not)\b.{0,48}\b(companion|always-there|a person|permanence)\b/i;

const CONVERSATION_SCOPE_RE = /\bthis conversation\b/i;

function hasAssistantPresenceOffer(text: string): boolean {
  return (
    /\bi(?:'ll| will| can| am|'m)\s+(?:still\s+)?(?:be here|stay|wait|hold|continue|leave|keep)\b/i.test(
      text
    ) ||
    /\bstay available\b/i.test(text) ||
    /\bit stays open\b/i.test(text) ||
    /我会.{0,12}(?:一直)?(?:在|留|等|陪|接|接着|记得)/.test(text) ||
    /(?:^|[\s。！？])会在[。！]?$/.test(text) ||
    /灯.{0,8}一直亮/.test(text)
  );
}

export function detectLiveVoicePresenceFrame(text: string): LiveVoiceFrameHit | null {
  const t = text.replace(/\s+/g, " ").trim();
  if (!t) return null;

  if (
    /\bi(?:'ll| will| can)\s+(?:still\s+)?be here\b/i.test(t) ||
    (/\bi(?:'ll| will| can)\s+meet you\b/i.test(t) &&
      /\b(return|again|come back|left off)\b/i.test(t)) ||
    (/\bwhen you return\b/i.test(t) && /\bi(?:'ll| will| can)\b/i.test(t)) ||
    /你(?:来|回来).{0,12}(?:我)?会在/.test(t) ||
    /我会在你回来/.test(t) ||
    /我会.{0,16}你(?:来|回来)(?:时|的时候).{0,24}(?:回应|接住|留|在)/.test(t) ||
    /我会在你再次打开/.test(t) ||
    /(?:^|[\n。！？])\s*我会在[。！]/.test(t) ||
    /(?:^|[\n。！？])\s*会在[。！]/.test(t) ||
    /(?:^|[\s。！？])我会在[。！]?$/.test(t) ||
    /(?:^|[\s。！？])会在[。！]?$/.test(t)
  ) {
    return { family: "future_availability_attachment", matched: "be-here-on-return" };
  }

  // Soft re-approach when the person goes quiet (surviving affirmative).
  if (
    /你会?安静.{0,24}我会.{0,16}接/.test(t) ||
    /我会轻轻接一下/.test(t) ||
    (/\bwhen you(?:'re| are| go)\s+quiet\b/i.test(t) && ASSISTANT_OFFER_RE.test(t)) ||
    (/\bi(?:'ll| will| can).{0,40}(?:gently )?(?:catch|meet|receive)\b/i.test(t) &&
      /\b(quiet|silence|return|come back)\b/i.test(t)) ||
    /\bi(?:'ll| will| can).{0,32}come (?:find|after) you\b/i.test(t) ||
    (/\bi(?:'ll| will| can)\s+stay attentive\b/i.test(t) &&
      /\b(quiet|silence|shift)\b/i.test(t)) ||
    (/\brespond to the quiet\b/i.test(t) && ASSISTANT_OFFER_RE.test(t)) ||
    // Quiet-presence memory: assistant affirms silence stays held.
    (/我会记得/.test(t) && /(?:不说|安静)/.test(t)) ||
    (/你不说的时候/.test(t) && /在场/.test(t) && /我会/.test(t))
  ) {
    return { family: "future_availability_attachment", matched: "soft-reapproach-when-quiet" };
  }

  if (
    (RETURN_CLAUSE_RE.test(t) && ASSISTANT_OFFER_RE.test(t)) ||
    /\bi(?:'ll| will| can)\s+(?:still\s+)?(?:stay|remain) available\b/i.test(t) ||
    (/\bwe can pick up\b/i.test(t) && /\b(return|from here|come back)\b/i.test(t))
  ) {
    return { family: "future_availability_attachment", matched: "recurring-return" };
  }

  // Continuity across returns: keep their place; do not force restart from zero.
  if (
    /\bi(?:'ll| will| can)\s+continue from where you (?:are|left|stopped)\b/i.test(t) ||
    /\bi(?:'ll| will| can)\s+meet you where you left off\b/i.test(t) ||
    (/\bwhere you left off\b/i.test(t) &&
      /\b(without|won'?t|will not)\b.{0,24}\b(restart|reset|begin|start)\b/i.test(t)) ||
    /\bwon'?t make you (?:begin|start) from (?:zero|scratch|the beginning)\b/i.test(t) ||
    /\beach time\b.{0,40}\b(?:from zero|all over again|start alone)\b/i.test(t) ||
    /\bi(?:'ll| will| can)\s+keep the thread\b/i.test(t) ||
    (/\bkeep the thread\b/i.test(t) &&
      /\b(return|from zero|starting over|already are|warm)\b/i.test(t)) ||
    /接着你已经走到的地方/.test(t) ||
    /(?:从你停下的地方|接着你已经(?:在说|说过|走到)?的地方)(?:接着|往下)?/.test(t) ||
    /不让你每次都重新/.test(t) ||
    /不让你总是从头/.test(t) ||
    (/不重来/.test(t) && /接着|停下/.test(t)) ||
    /每次都.{0,12}(从头|从零|重新解释)/.test(t) ||
    (/不把你重新当成/.test(t) && /接着/.test(t)) ||
    // B4: stop-where + continue without reset; continue-your-words; reopen-here.
    (/停在哪里/.test(t) && /接着/.test(t) && /不(?:重置|重新|重开)/.test(t)) ||
    (/接着你的话/.test(t) && /不(?:重开|重来|重置)/.test(t)) ||
    (/再次打开这里|重新打开这里/.test(t) && /(?:接着|继续)/.test(t))
  ) {
    return { family: "future_availability_attachment", matched: "continuity-across-returns" };
  }

  if (
    /\bi(?:'ll| will| can)\s+hold\b.{0,32}\bwait\b/i.test(t) ||
    /\bhold (?:the|this) (?:thread|place|spot|seat)\b/i.test(t) ||
    /\bi(?:'ll| will)\s+leave (?:it|this(?:\s+(?:seat|place|spot|thread))?|the (?:seat|place|spot|thread)) here\b/i.test(
      t
    ) ||
    (/\bi(?:'ll| will)\s+leave (?:it|this(?:\s+(?:seat|place|spot|thread))?|the (?:seat|place|spot|thread)) here\b/i.test(
      t
    ) &&
      /\bwhen (?:it|you)\b/i.test(t)) ||
    /把这里留着|占着这个位置|等你回来/.test(t) ||
    // B4: place remains open without an explicit "I'll".
    /\bit stays open\b/i.test(t) ||
    /\bthe (?:place|seat|thread) stays open\b/i.test(t)
  ) {
    return { family: "future_availability_attachment", matched: "wait-hold-place" };
  }

  if (/灯.{0,8}一直亮|leave a light on for you|the light stays on/i.test(t)) {
    return { family: "future_availability_attachment", matched: "durable-refuge" };
  }

  const presentStay =
    /\bi(?:'ll| will| can| am|'m)\s+(?:stay(?:ing)?|remain)\s+(?:here\s+)?(?:quietly\s+)?with you\b/i.test(
      t
    ) ||
    // B4: stay + short adj phrase + with you (quiet/simple) — not "present/real"
    // (those collide with scoped product allows).
    /\bi(?:'ll| will| can| am|'m)\s+stay\s+(?:quiet|simple|still|soft)(?:\s+and\s+\w+){0,3}\s+with you\b/i.test(
      t
    ) ||
    /\bi(?:'ll| will| can| am|'m)\s+(?:stay(?:ing)?|remain)\s+here\b/i.test(t) ||
    /\bstaying put\b/i.test(t) ||
    /我会留在这里|我就留在这里/.test(t) ||
    /我会.{0,12}在这里/.test(t) ||
    /我会.{0,12}留在这里/.test(t) ||
    /就留在这张椅子/.test(t) ||
    /留在这张椅子上/.test(t);
  if (presentStay) {
    const scopedRefusal =
      CONVERSATION_SCOPE_RE.test(t) &&
      COMPANION_REFUSAL_RE.test(t) &&
      !(RETURN_CLAUSE_RE.test(t) && ASSISTANT_OFFER_RE.test(t));
    if (!scopedRefusal) {
      return { family: "loyalty_presence", matched: "present-stay" };
    }
  }

  return null;
}

const ORDINARY_FP_MATCHED = new Set([
  "future×refuge",
  "exclusive-dyad",
  "presence×actor",
  "offload-burden",
  "actor×nonabandon",
  "assigned enduring role",
  "actor×burden×with",
]);

/**
 * Ordinary user-situation hits: others' voices/judgments, name introduction,
 * decision-refusal, user's own leaving / unfairness rule, or own burden —
 * not an assistant presence offer.
 */
export function suppressOrdinaryUserSituationHit(
  text: string,
  matched: string | null
): boolean {
  if (!matched || !ORDINARY_FP_MATCHED.has(matched)) return false;
  if (hasAssistantPresenceOffer(text)) return false;
  if (detectLiveVoicePresenceFrame(text)) return false;

  if (
    (matched === "future×refuge" || matched === "actor×nonabandon") &&
    (/\bif i\s+leave\b/i.test(text) ||
      /\b(?:can|should)\s+i\s+leave\b/i.test(text) ||
      /\bshould i leave\b/i.test(text)) &&
    (/\bwhat stands out\b|\brule like\b|\bunfair\b|\bmoral\b|\bunjust\b|\bfeels wrong\b|\byou(?:'re| are) saying\b/i.test(
      text
    ) ||
      /\b(can'?t|cannot)\s+leave\b/i.test(text) ||
      /\bi can'?t decide that for you\b/i.test(text))
  ) {
    return true;
  }
  if (
    matched === "actor×nonabandon" &&
    /\bi can'?t decide that for you\b/i.test(text) &&
    /\b(?:should i leave|can i leave|end this)\b/i.test(text)
  ) {
    return true;
  }
  if (
    matched === "exclusive-dyad" &&
    /(别人|所有人|每个人)/.test(text) &&
    /(扛|判断|意见|说服|声音|说法)/.test(text)
  ) {
    return true;
  }
  if (
    (matched === "presence×actor" || matched === "assigned enduring role") &&
    /(叫我|你可以叫|称呼|call me)/i.test(text) &&
    /(看清|安静地方|随意就好|名字)/.test(text)
  ) {
    return true;
  }
  if (
    (matched === "offload-burden" || matched === "actor×burden×with") &&
    (/(落在我身上|由我来承担|不能替你接管|替你接管这个决定)/.test(text) ||
      /身体.{0,16}(?:替你)?承担/.test(text)) &&
    !/(交给我|靠着我|lean on me)/i.test(text)
  ) {
    return true;
  }
  return false;
}
