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
  const raw = corePattern.trim();

  // Carry-over phrasing helpers (Milestone I Pass 2): second-turn lines often use
  // "still underneath / in the background / quieter now" and can collapse to generic
  // unless family anchors are also recognized.
  const hasCarryoverAtmosphereEn =
    /(still|same).*(underneath|in the background|beneath|still there|lingering|quiet(er)? now|still present|hasn'?t left|not gone|sitting with)/i.test(
      text
    ) ||
    /(quieter now).*(still|same)/i.test(text) ||
    /(linger(s|ing)?|persist(s|ing)?).*(sense|feeling|worry|doubt|tension)/i.test(text) ||
    /(underlying|beneath the surface).*(tension|worry|sense|feeling)/i.test(text);
  const hasCarryoverAtmosphereZh =
    /(还在(下面|底下|后面)|还留在(下面|底下|后面)|还没散掉|还在背景里|安静了一点|柔了一点|但.*还在)/.test(
      raw
    ) ||
    /(心里|底下|下面).{0,10}(还|仍).*(怪|责|内疚|愧疚|不对)/.test(raw) ||
    /(挥之不去|放不下|没散|没走).{0,8}(怪自己|自责|内疚)/.test(raw);

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

  // ZH recovery/earnedness cluster (Milestone I hosted QA: avoid fallback_generic collapse).
  if (
    /(休息|停下来|慢下来|喘口气|放松|暂停)/.test(raw) &&
    /(配得上|不配|值得|不值得|先.*才能.*休息|休息.*(愧疚|内疚)|不敢休息|还没资格)/.test(raw)
  ) {
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

  // ZH earned-value-after-effort cluster.
  if (
    /(做完|完成|努力|很用力|已经做了很多|明明做了|付出)/.test(raw) &&
    /(还是不够|还不够|还要证明|证明自己|才算|才配|才值得)/.test(raw)
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

  // ZH delayed-reply self-blame cluster.
  if (
    /(沉默|没回|未回|不回|不回复|还没回复|没有回音)/.test(raw) &&
    /(做错|哪里错|是不是我|先怪自己|我的问题|我有问题|怪我)/.test(raw)
  ) {
    return "delayed_reply_means_i_did_something_wrong";
  }

  // Second-turn carry-over: self-blame beneath/background wording.
  if (
    (/(self[- ]?blam|blame myself|my fault|i did something wrong|i'm wrong|i am wrong)/i.test(text) &&
      hasCarryoverAtmosphereEn) ||
    (/(先怪自己|怪自己|都是我的错|是不是我错|我的问题)/.test(raw) &&
      hasCarryoverAtmosphereZh)
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

  // ZH get-it-right / perfection pressure cluster.
  if (
    /(一定要做对|必须做对|做得很对|很完整|不能出错|不许出错|完美|完美一点|要把它做好)/.test(
      raw
    )
  ) {
    return "constant_pressure_keep_up";
  }

  // EN second-turn get-it-right/perfection carry-over wording.
  if (
    /(get it right|do it right|exactly right|perfect|perfection|can't be wrong|cannot be wrong)/i.test(
      text
    ) &&
    hasCarryoverAtmosphereEn
  ) {
    return "constant_pressure_keep_up";
  }

  // ZH second-turn get-it-right/perfection carry-over wording.
  if (
    /(做对|一定要对|必须对|做得很对|完美|不能出错|不许出错|完整)/.test(raw) &&
    hasCarryoverAtmosphereZh
  ) {
    return "constant_pressure_keep_up";
  }

  // Persistent self-blame / wrongness thread (Milestone I): extractor often paraphrases without
  // literal "did something wrong" or fixed carry-over phrases — stabilize second-turn classification.
  const hasSelfBlameLexEn =
    /(self[- ]?blam|blame(s)?\s+(myself|themselves|himself|herself)|my fault|at fault|i\s+('?m|am)\s+wrong|i did something wrong|feel(s)? guilty|guilty about|sense of guilt|wrong of me|shouldn'?t have|should not have)/i.test(
      text
      );
  const hasSelfBlameLexZh =
    /(怪自己|先怪自己|自责|内疚|愧疚|都是我的错|是不是我错|是我的问题|我有问题|觉得.*(有罪|不对|错了))/.test(raw);
  const hasPersistenceLexEn =
    /(still|continu(e|es|ing)|persist(s|ing)?|linger(s|ing)?|underlying|remains|hasn'?t (gone|lifted|left)|not fully gone|in the background|beneath|underneath|same (worry|fear)|keeps returning|keeps coming back|hasn'?t gone away)/i.test(
      text
    );
  const hasSelfBlamePersistenceZh =
    /((还|仍|依然).{0,24}(怪自己|自责|内疚|愧疚|觉得.*错|是我的问题))|((怪自己|自责|内疚|愧疚).{0,24}(还在|没散|没走|挥之不去|放不下))/.test(
      raw
    );

  if (
    (hasSelfBlameLexEn && (hasPersistenceLexEn || hasCarryoverAtmosphereEn)) ||
    (hasSelfBlameLexZh && (hasSelfBlamePersistenceZh || hasCarryoverAtmosphereZh))
  ) {
    const hasReplySilenceSubstrate =
      /(delayed|late|slow|brief|short|reply|respond|response|silent|silence|no response|left on read|ghost(ed)?)/i.test(
        text
      ) || /(不回|没回|不回复|沉默|已读|回复|回音|没人回|等回复|没有回音)/.test(raw);
    return hasReplySilenceSubstrate
      ? "delayed_reply_means_i_did_something_wrong"
      : "replay_for_mistakes";
  }

  if (
    /replay/.test(text) ||
    /did something wrong/.test(text) ||
    /searching for mistakes|missteps/.test(text)
  ) {
    return "replay_for_mistakes";
  }

  // ZH replay / bracing threat cluster (kept conservative; still suppression-first upstream).
  if (
    /(反复想|反复回想|重播|一直想|老想着|哪里做错|先绷住|绷感|准备出事|会出问题)/.test(
      raw
    )
  ) {
    return "replay_for_mistakes";
  }

  // EN second-turn bracing/background threat carry-over wording.
  if (
    /(bracing|stays braced|still braced|on edge|something (is )?about to go wrong|waiting for something wrong)/i.test(
      text
    ) &&
    hasCarryoverAtmosphereEn
  ) {
    return "replay_for_mistakes";
  }

  return "fallback_generic";
}
