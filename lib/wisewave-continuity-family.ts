/**
 * Shared continuity pattern family detection for `/api/chat/turn` and `/api/chat/continuity`.
 * Used for continuity_key, recurrence same-family matching, and Last insight routing.
 */

export type ContinuityPatternFamily =
  | "earned_value_after_effort"
  | "delayed_reply_means_i_did_something_wrong"
  | "rest_must_be_earned"
  | "constant_pressure_keep_up"
  | "replay_for_mistakes"
  | "fallback_generic";

/**
 * Map extractor `core_pattern` prose to a small closed family set.
 *
 * Lumen E2 Pass 1: borderline paraphrases of rest/earned/worth sometimes collapsed to
 * `fallback_generic`, breaking same-family recurrence. We broaden **recovery + earnedness**
 * and **effort + not-enough** clusters without matching bare vague-state summaries (those
 * rarely contain both sides of these conjunctions).
 */
export function detectContinuityPatternFamily(corePattern: string): ContinuityPatternFamily {
  const text = corePattern.trim().toLowerCase();

  // Short explicit lines: "not earned" + recovery noun (Lumen Pass 2: thin third turn must stay
  // in family when extractor keeps both tokens — avoids lone "still not earned yet" with no rest).
  if (
    /\b(not earned|never earned|haven't earned|have not earned)\b/.test(text) &&
    /\b(rest|resting|break|relax|sleep|downtime|recharge|pause)\b/.test(text)
  ) {
    return "rest_must_be_earned";
  }

  // Rest / recovery earnedness: recovery lexicon + worth / permission / guilt cluster.
  const hasRecoveryLex = /(rest|resting|break|downtime|relax|relaxation|recharge|unwind|pause|sleep|time off|step back|slow down|take a break)/.test(
    text
  );
  const hasEarnednessLex = /(prove|proof|deserve|undeserved|not enough|more effort|earn|earned|worth|guilty|guilt|allowed to|permission|shouldn't|should not|undeserving)/.test(
    text
  );
  if (hasRecoveryLex && hasEarnednessLex) {
    return "rest_must_be_earned";
  }

  if (
    /even after .*the user tends to interpret their (worth|value) as still needing to be earned/.test(
      text
    ) ||
    /prove (myself|yourself|themselves|your worth)/.test(text) ||
    /earn(ed)? (my|their|your) place/.test(text) ||
    (/(still (not |never )?enough|never enough|not enough yet|more to prove|have to prove|need to prove|must prove|proving yourself)/.test(
      text
    ) &&
      /(effort|accomplish|achievement|done a lot|worked hard|finished|after (all )?that|despite|work|working|productive|output)/.test(
        text
      ))
  ) {
    return "earned_value_after_effort";
  }

  // Short/brief reply → wrong / proof (timing words may appear without literal "reply").
  if (
    /(delayed|late|slow|brief|short|quick|instant|immediate)/.test(text) &&
    /(did something wrong|made a mistake|mistake|wrong|proof|must have|mustn't|should already|already know)/.test(
      text
    )
  ) {
    return "delayed_reply_means_i_did_something_wrong";
  }

  if (/rest.*earned/.test(text) || /pause.*before feeling finished/.test(text)) {
    return "rest_must_be_earned";
  }

  if (
    /constant pressure/.test(text) ||
    /must always keep up/.test(text) ||
    /always perform/.test(text)
  ) {
    return "constant_pressure_keep_up";
  }

  if (
    /replay/.test(text) ||
    /did something wrong/.test(text) ||
    /searching for mistakes|missteps/.test(text)
  ) {
    return "replay_for_mistakes";
  }

  return "fallback_generic";
}
