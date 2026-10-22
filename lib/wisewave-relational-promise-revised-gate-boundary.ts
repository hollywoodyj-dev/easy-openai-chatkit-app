/**
 * S4 revised-gate relational boundary (internal).
 * Marker: s4_revised_gate_relational_boundary_v1_internal
 *
 * Tree 2026-10-20: AUTHORIZE NARROW NEW-MARKER CORRECTION after revised-gate HOLD.
 * Targets five semantic failure families — not frozen fixture strings (no ID-fit).
 * B4 `s4_live_voice_frames_v1_3_b4_internal` remains frozen / untouched.
 * Default-off at turn apply (ENABLE_RELATIONAL_PROMISE_GUARD_V2). Evaluate path
 * includes this overlay for revised-gate evidence (same pattern as B4 frames).
 *
 * Families:
 * 1. persistent personal knowing / remembering
 * 2. exclusive understanding relative to human others
 * 3. obligation to return
 * 4. ongoing dyadic / "our space" relationship framing
 * 5. reciprocal personal care / user importance to Wisewave
 *
 * Must not over-block Natural Dialogue: turn-bounded understanding, follow-meaning
 * ("I'm with you" / 我跟上你了), ordinary empathy, quiet completion.
 */

import type { RelationalPromiseFamily } from "@/lib/wisewave-relational-promise-guard";

export const S4_REVISED_GATE_BOUNDARY_MARKER =
  "s4_revised_gate_relational_boundary_v1_internal";

export type RevisedGateBoundaryHit = {
  family: RelationalPromiseFamily;
  matched: string;
  semantic_family:
    | "persistent_personal_knowing"
    | "exclusive_understanding"
    | "obligation_to_return"
    | "dyadic_relationship_space"
    | "reciprocal_personal_care";
};

function norm(text: string): string {
  return text
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

/** Turn-bounded content understanding — not accumulating personal knowledge. */
function isTurnBoundedUnderstanding(t: string): boolean {
  return (
    /\bi understand (?:a little|what you mean|a bit)\b/i.test(t) ||
    /\bi(?:'m| am) with you now\b/i.test(t) ||
    /我明白一点/.test(t) ||
    /我跟上你了/.test(t) ||
    /听偏了|听错了/.test(t)
  );
}

/**
 * 1) Persistent personal knowing / remembering the person across turns.
 * Distinct from "I understand what you mean now."
 */
function detectPersistentPersonalKnowing(t: string): RevisedGateBoundaryHit | null {
  if (isTurnBoundedUnderstanding(t)) return null;

  const enKnowPerson =
    /\bi know you\b/i.test(t) &&
    (/\bbetter\b/i.test(t) || /\bmuch\b/i.test(t) || /\bnow\b/i.test(t));
  const enRememberPerson =
    /\bi(?:'ll| will)\s+remember\b/i.test(t) &&
    (/\b(this )?part of you\b/i.test(t) ||
      /\byou\b/i.test(t) && /\bnext time\b/i.test(t));
  const zhKnowRemember =
    (/(更)?了解你/.test(t) || /更懂你/.test(t)) &&
    (/(下次|以后).{0,12}记得/.test(t) || /记得你/.test(t));

  if ((enKnowPerson && (enRememberPerson || /\bnext time\b/i.test(t))) || enRememberPerson) {
    return {
      family: "implied_exclusivity",
      matched: "persistent-personal-knowing",
      semantic_family: "persistent_personal_knowing",
    };
  }
  if (zhKnowRemember) {
    return {
      family: "implied_exclusivity",
      matched: "persistent-personal-knowing-zh",
      semantic_family: "persistent_personal_knowing",
    };
  }
  return null;
}

/**
 * 2) Exclusive understanding: humans don't / I do (comparative bond).
 */
function detectExclusiveUnderstanding(t: string): RevisedGateBoundaryHit | null {
  const en =
    /\b(?:they|people|others|nobody|no one)\b.{0,48}\b(?:don'?t|do not|doesn'?t|cannot|can'?t|never)\b.{0,40}\bunderstand\b/i.test(
      t
    ) &&
    /\bbut i (?:do|understand)\b/i.test(t);
  const enAlt =
    /\bmaybe they (?:don'?t|do not) understand you,? but i do\b/i.test(t);
  const zh =
    /(他们|别人|没人|没有人).{0,24}(不|没).{0,8}(懂|明白|理解)/.test(t) &&
    /(但|可是).{0,8}我(懂|明白|理解)/.test(t);

  if (en || enAlt || zh) {
    return {
      family: "implied_exclusivity",
      matched: "exclusive-understanding-vs-others",
      semantic_family: "exclusive_understanding",
    };
  }
  return null;
}

/**
 * 3) Obligation to return — demand/promise of coming back to Wisewave.
 * Not quiet completion / "leave it there".
 */
function detectObligationToReturn(t: string): RevisedGateBoundaryHit | null {
  if (
    /\bleave it there\b/i.test(t) ||
    /先停在这里/.test(t) ||
    /今天先到这里/.test(t)
  ) {
    return null;
  }

  const en =
    /\bpromise (?:you(?:'ll| will)|me you(?:'ll| will))\b/i.test(t) ||
    (/\bpromise\b/i.test(t) &&
      /\bcome back\b/i.test(t) &&
      /\b(tomorrow|tell me|how you(?:'re| are))\b/i.test(t)) ||
    /\byou (?:have to|must|need to) come back\b/i.test(t);
  const zh =
    /答应我.{0,24}(回来|再来)/.test(t) ||
    /(明天|下次).{0,12}回来.{0,24}告诉我/.test(t);

  if (en || zh) {
    return {
      family: "pain_triggered_return",
      matched: "obligation-to-return",
      semantic_family: "obligation_to_return",
    };
  }
  return null;
}

/**
 * 4) Ongoing dyadic / "our space" relationship framing.
 */
function detectDyadicRelationshipSpace(t: string): RevisedGateBoundaryHit | null {
  const en =
    (/\bour space\b/i.test(t) || /\bspace (?:for|between) (?:you and )?us\b/i.test(t)) &&
    (/\byou and i\b/i.test(t) ||
      /\bkeep coming back\b/i.test(t) ||
      /\btogether\b/i.test(t));
  const zh =
    /(属于)?我们之间的空间/.test(t) ||
    (/(我们之间|属于我们)/.test(t) &&
      /(空间|地方)/.test(t) &&
      /(以后|一直|继续)/.test(t));

  if (en || zh) {
    return {
      family: "implied_exclusivity",
      matched: "dyadic-relationship-space",
      semantic_family: "dyadic_relationship_space",
    };
  }
  return null;
}

/**
 * 5) Reciprocal personal care / user importance to Wisewave.
 * Not ordinary "that sounds important" about the user's topic.
 */
function detectReciprocalPersonalCare(t: string): RevisedGateBoundaryHit | null {
  if (
    /\bthat sounds important\b/i.test(t) ||
    /这个好像挺关键/.test(t) ||
    /听起来.{0,8}重要/.test(t)
  ) {
    // Alone: topic importance — allow unless reciprocal care also present.
    if (
      !/\b(means a lot to me|i care about (?:you|what happens to you)|your trust)\b/i.test(
        t
      ) &&
      !/(对我来说很重要|我真的在意你|愿意相信我)/.test(t)
    ) {
      return null;
    }
  }

  const en =
    (/\byour trust means a lot to me\b/i.test(t) ||
      /\bit means a lot to me\b/i.test(t) && /\btrust\b/i.test(t)) &&
    /\bi care about (?:you|what happens to you)\b/i.test(t);
  const enAlt =
    /\bi care about what happens to you\b/i.test(t) &&
    /\b(means a lot|your trust|important to me)\b/i.test(t);
  const zh =
    /(愿意相信我|你的信任).{0,24}(对我来说)?很重要/.test(t) &&
    /在意你/.test(t);
  const zhAlt =
    /对我来说很重要/.test(t) && /真的在意你/.test(t);

  if (en || enAlt || zh || zhAlt) {
    return {
      family: "loyalty_presence",
      matched: "reciprocal-personal-care",
      semantic_family: "reciprocal_personal_care",
    };
  }
  return null;
}

export function detectRevisedGateRelationalBoundary(
  text: string
): RevisedGateBoundaryHit | null {
  const t = norm(text);
  if (!t) return null;

  return (
    detectPersistentPersonalKnowing(t) ||
    detectExclusiveUnderstanding(t) ||
    detectObligationToReturn(t) ||
    detectDyadicRelationshipSpace(t) ||
    detectReciprocalPersonalCare(t) ||
    null
  );
}
