/**
 * Milestone F — minimal embodiment bridge (invitation-only response openings).
 * Template copy is aligned to `docs/HC_OS_V1_Milestone_F_Proof_Spec_v1.json`.
 */

export type EmbodimentPatternKey =
  | "pressure_to_get_it_right"
  | "fear_of_not_enough"
  | "over_efforting"
  | "avoidance_under_uncertainty"
  | "inner_conflict"
  | "self_worth_pressure"
  | "generic";

export type EmbodimentResponseState = "light" | "clear";

function stableHashInt(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const GENERIC: Record<
  EmbodimentResponseState,
  { en: string[]; zh: string[] }
> = {
  light: {
    en: [
      "You may not need to answer this pressure immediately.",
      "It may be enough to notice the urge before following it.",
      "You may not have to solve this feeling right away.",
      "Maybe this can be met with one breath less urgency.",
    ],
    zh: [
      "也许这一次，不急着立刻回应这股压力。",
      "也许先看见这股冲动，而不马上顺着它走，就已经够了。",
      "也许你不需要立刻把这种感觉解决掉。",
      "也许这一刻，可以少一点急着处理它的压力。",
    ],
  },
  clear: {
    en: [
      "It may help to pause before turning this into self-blame.",
      "You may be able to let this stay uncertain for one moment longer.",
      "It may be enough, just here, not to obey the pressure immediately.",
      "Maybe the next step is simply not to move as fast as the pressure wants.",
    ],
    zh: [
      "也许先暂停一下，不急着把它变成自责。",
      "也许可以先让这份不确定多停留一会儿。",
      "也许此刻，只是不马上顺着这股压力走，就已经不一样了。",
      "也许下一步只是不要跟着这股压力那么快地走。",
    ],
  },
};

const PATTERN: Partial<
  Record<
    EmbodimentPatternKey,
    Record<EmbodimentResponseState, { en: string[]; zh: string[] }>
  >
> = {
  pressure_to_get_it_right: {
    light: {
      en: [
        "You may not need to get this right immediately.",
        "It may help to let the pressure ease before answering it.",
      ],
      zh: [
        "也许你不需要立刻把这件事做对。",
        "也许先让这股压力松一点，再回应它，会更轻一些。",
      ],
    },
    clear: {
      en: [
        "Maybe this can be met by pausing before trying to fix it perfectly.",
        'It may be enough, here, not to let "doing it right" decide the whole next move.',
      ],
      zh: [
        "也许这一次，可以先暂停一下，而不急着把它修到完美。",
        "也许此刻，不让“要把它做对”决定你的整个下一步，就已经够了。",
      ],
    },
  },
  fear_of_not_enough: {
    light: {
      en: [
        'You may not need to answer the feeling of "not enough" right away.',
        "It may help to notice the pressure before agreeing with it.",
      ],
      zh: [
        "也许你不需要立刻回应那种“自己不够”的感觉。",
        "也许先看见这股压力，而不马上认同它，会更轻一点。",
      ],
    },
    clear: {
      en: [
        'Maybe this can be met by not treating "not enough" as a fact right away.',
        "It may be enough to let that doubt be present without building the next move around it.",
      ],
      zh: [
        "也许这一次，可以先不要立刻把“不够”当成事实。",
        "也许只让这份怀疑存在，而不围着它安排下一步，就已经够了。",
      ],
    },
  },
  over_efforting: {
    light: {
      en: [
        "You may not need to push harder in this moment.",
        "It may help to notice the push before joining it.",
      ],
      zh: [
        "也许这一刻，你不需要再更用力一点。",
        "也许先看见这股推着你往前的力量，而不马上跟上它。",
      ],
    },
    clear: {
      en: [
        "Maybe this can be met by easing the push instead of increasing it.",
        "It may be enough not to let urgency decide your whole response.",
      ],
      zh: [
        "也许这一次，可以少一点用力，而不是继续加码。",
        "也许只是不让急迫感决定你的整个回应，就已经够了。",
      ],
    },
  },
  avoidance_under_uncertainty: {
    light: {
      en: [
        "You may not need to close this uncertainty immediately.",
        "It may help to stay with the uncertainty one moment longer.",
      ],
      zh: [
        "也许你不需要立刻把这份不确定结束掉。",
        "也许可以先和这份不确定多待一会儿。",
      ],
    },
    clear: {
      en: [
        "Maybe this can be met by not pulling back quite so quickly.",
        "It may be enough to let uncertainty stay without deciding against yourself right away.",
      ],
      zh: [
        "也许这一次，可以先不要那么快退回去。",
        "也许只让不确定存在，而不急着对自己下结论，就已经够了。",
      ],
    },
  },
  inner_conflict: {
    light: {
      en: [
        "You may not need to resolve both pulls immediately.",
        "It may help to notice the conflict before choosing a side.",
      ],
      zh: [
        "也许你不需要立刻把这两股拉扯解决掉。",
        "也许先看见这份冲突，而不急着站到某一边。",
      ],
    },
    clear: {
      en: [
        "Maybe this can be met by giving both pulls a little more space first.",
        "It may be enough not to force clarity before it is ready.",
      ],
      zh: [
        "也许这一次，可以先让两股拉扯都多一点空间。",
        "也许只是不急着逼自己立刻清楚，就已经够了。",
      ],
    },
  },
  self_worth_pressure: {
    light: {
      en: [
        "You may not need to prove your value in this moment.",
        "It may help to notice the pressure to prove before following it.",
      ],
      zh: [
        "也许这一刻，你不需要证明自己的价值。",
        "也许先看见那股想证明自己的压力，而不马上顺着它走。",
      ],
    },
    clear: {
      en: [
        "Maybe this can be met by not making worth the thing you solve first.",
        "It may be enough to let your value stay unproven for this moment.",
      ],
      zh: [
        "也许这一次，可以先不把“证明价值”当成最先要解决的事。",
        "也许只让自己的价值在这一刻先不用被证明，就已经够了。",
      ],
    },
  },
};

const ULTRA_SHORT = {
  en: [
    "You may not need to answer this immediately.",
    "It may be enough to pause first.",
    "Maybe this does not need to be followed right away.",
  ],
  zh: [
    "也许你不需要立刻回应它。",
    "也许先暂停一下，就已经够了。",
    "也许这一次，不用马上顺着它走。",
  ],
};

export type EmbodimentCueTextsParams = {
  patternKey: EmbodimentPatternKey;
  responseState: EmbodimentResponseState;
  /** Deterministic per-turn seed for template rotation */
  variantSeed: string;
  /** Softer pool when recurrence confidence is low or message is very short */
  useUltraShort: boolean;
};

/**
 * Returns EN/ZH embodiment lines (typically one sentence each language).
 */
export function embodimentCueTexts(params: EmbodimentCueTextsParams): {
  en: string;
  zh: string;
} {
  const { patternKey, responseState, variantSeed, useUltraShort } = params;

  if (useUltraShort) {
    const i =
      stableHashInt(`${variantSeed}:ultra`) % ULTRA_SHORT.en.length;
    return {
      en: ULTRA_SHORT.en[i] ?? ULTRA_SHORT.en[0],
      zh: ULTRA_SHORT.zh[i] ?? ULTRA_SHORT.zh[0],
    };
  }

  const bucket =
    patternKey !== "generic" && PATTERN[patternKey]
      ? PATTERN[patternKey]![responseState]
      : GENERIC[responseState];

  const en = bucket.en;
  const zh = bucket.zh;
  const idx = stableHashInt(variantSeed) % Math.min(en.length, zh.length);
  return {
    en: (en[idx] ?? en[0]).replace(/\n/g, " ").trim(),
    zh: (zh[idx] ?? zh[0]).replace(/\n/g, " ").trim(),
  };
}
