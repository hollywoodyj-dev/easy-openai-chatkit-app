# HC-OS V1 — Milestone I (Nova) Soft Continuity Carry-Over Template Map (TypeScript)

Owner: Nova

Purpose:
Provide a Nova-friendly TypeScript / JSON template map for Milestone I soft continuity carry-over,
aligned with:

- Milestone I addendum (soft carry-over; suppression-first; no visible continuity behavior)
- Wisewave continuity language pack (EN + ZH tone families)

Core stance:
- carry forward lightly, do not restate
- continuity should feel present, not announced
- suppress if recall-like, repetitive, or too visible
- preserve EN/ZH parity at tone/function level, not literal wording

---

```ts
/**
 * Milestone I — Soft Continuity Carry-Over
 * Nova-friendly TypeScript template map
 *
 * Design intent:
 * - carry forward lightly, do not restate
 * - continuity should feel present, not announced
 * - suppress if recall-like, repetitive, or too visible
 */

export type MilestoneIConfidence = "low" | "medium" | "high";
export type DisplayLang = "en" | "zh";

export type ContinuityTemplateFamily =
  | "residual_background_presence"
  | "softened_continuation"
  | "lingering_tenderness"
  | "quiet_unresolvedness"
  | "same_space_coherence"
  | "ultra_light_fallback";

export interface MilestoneIDesignRules {
  purpose: string;
  core_rule: string;
  tone: string[];
  parity_rule: string;
  visibility_rule: string;
  anti_rules: string[];
}

export interface ConfidenceRule {
  label: string;
  rule: string;
}

export interface FamilyTemplateSet {
  intent: string;
  use_when: string[];
  avoid_when: string[];
  en: string[];
  zh: string[];
}

export interface ShowHideRules {
  show_low_only_if: string[];
  show_medium_when: string[];
  show_high_when: string[];
  hide_if: string[];
  never_show_if: string[];
}

export interface ImplementationShape {
  required_fields: string[];
  optional_fields: string[];
  recommended_render_order: string[];
  decay_behavior: string[];
}

export interface MilestoneITemplateMap {
  milestone: "I";
  feature: "soft_continuity_carryover";
  version: string;
  design_rules: MilestoneIDesignRules;
  confidence_levels: Record<MilestoneIConfidence, ConfidenceRule>;
  family_templates: Record<ContinuityTemplateFamily, FamilyTemplateSet>;
  forbidden_wording_patterns: {
    explicit_recall_markers: { en: string[]; zh: string[] };
    pattern_replay_markers: { en: string[]; zh: string[] };
    authority_markers: { en: string[]; zh: string[] };
  };
  show_hide_rules: ShowHideRules;
  implementation_shape: ImplementationShape;
  qa_checks: string[];
}

export const MILESTONE_I_CONTINUITY_TEMPLATE_MAP: MilestoneITemplateMap = {
  milestone: "I",
  feature: "soft_continuity_carryover",
  version: "v1",
  design_rules: {
    purpose:
      "Preserve a faint felt continuity of inner space across nearby moments without sounding like memory, recall, repetition, or a visible continuity feature.",
    core_rule: "Carry forward lightly, do not restate.",
    tone: ["calm", "light", "unannounced", "coherent", "non-explanatory"],
    parity_rule:
      "EN/ZH must preserve equivalent softness, subtlety, non-authority, and invisibility of mechanism rather than literal wording.",
    visibility_rule:
      "If the user can easily point to the continuity mechanism in the wording, the wording is too visible.",
    anti_rules: [
      "Do not sound like retrieval.",
      "Do not restate previous insight directly.",
      "Do not compete with the main reflection.",
      "Do not increase system presence.",
      "Do not drift into E-style pattern surfacing or H-style micro-awareness insertion.",
    ],
  },

  confidence_levels: {
    low: {
      label: "faint_trace",
      rule:
        "Use only when continuity is plausible but should remain extremely light and indirect.",
    },
    medium: {
      label: "soft_carryover",
      rule:
        "Use when the same inner space seems present and subtle carry-over improves coherence without becoming noticeable.",
    },
    high: {
      label: "clear_but_quiet_continuity",
      rule:
        "Use when continuity is strongly supported, but wording must still avoid recall-feel, repetition, and feature visibility.",
    },
  },

  family_templates: {
    residual_background_presence: {
      intent:
        "Suggest that something from the prior inner space is still faintly nearby in the background.",
      use_when: [
        "same inner space remains",
        "direct naming would feel too strong",
        "continuity should feel ambient rather than explicit",
      ],
      avoid_when: [
        "thread is weak or uncertain",
        "turn is factual or utilitarian",
        "E or H is already doing sufficient work",
      ],
      en: [
        "There still seems to be a little of that in the background here.",
        "Something of it may still be nearby, even if it is quieter now.",
        "A trace of that still seems present here.",
        "It feels like a little of that may still be sitting underneath this.",
        "Some of that atmosphere still seems to be lingering here.",
      ],
      zh: [
        "这里似乎还留着一点那样的背景感觉。",
        "那种东西可能还在附近，只是现在轻了一些。",
        "这里好像还带着一点它留下的痕迹。",
        "这下面似乎还隐约放着一点那个感觉。",
        "那种氛围好像还在这里轻轻停留着。",
      ],
    },

    softened_continuation: {
      intent:
        "Show that the same thread may still be present, but in a softer or shifted form.",
      use_when: [
        "clear continuity with visible softening or movement",
        "user is meeting the same thing differently",
        "repetition risk can be reduced through softened phrasing",
      ],
      avoid_when: [
        "no real movement is present",
        "wording starts sounding interpretive",
        "it begins to resemble 'same pattern again'",
      ],
      en: [
        "This still feels close to the same inner space, just a little softer now.",
        "Something similar seems to be still here, though not in quite the same way.",
        "The thread may still be present here, but with less force.",
        "This seems connected to the same space, though it is landing differently now.",
        "Some of that still seems to be moving through here, just more quietly.",
      ],
      zh: [
        "这感觉还是靠近同一个内在空间，只是现在柔了一些。",
        "这里似乎还在延续某种相似的东西，只是已经不完全一样了。",
        "那条线可能还在这里，只是力道没有那么强了。",
        "这好像还连着同一个空间，只是现在落下来的方式不同了。",
        "那种东西似乎还在这里流动，只是更安静了一些。",
      ],
    },

    lingering_tenderness: {
      intent:
        "Preserve continuity of emotional openness or sensitivity without overdefining it.",
      use_when: [
        "emotional field remains subtly open",
        "pattern naming would be too heavy",
        "response benefits from gentleness without therapy-like language",
      ],
      avoid_when: [
        "user is highly activated and H regulation would be more appropriate",
        "wording becomes sentimental or overly soft",
        "it competes with the main reflection",
      ],
      en: [
        "Something in this still feels a little tender.",
        "There still seems to be some sensitivity around this.",
        "This space still feels slightly open in a delicate way.",
        "Some part of this still seems gently unsettled.",
        "There is still a little softness here that seems worth staying close to.",
      ],
      zh: [
        "这当中似乎还有一点柔软而敏感的地方。",
        "这里好像还带着一点轻微的敏感感。",
        "这个空间似乎还在一种细微敞开的状态里。",
        "这当中有一部分似乎还轻轻地没有完全安定下来。",
        "这里好像还有一点柔软，值得轻轻贴近。",
      ],
    },

    quiet_unresolvedness: {
      intent:
        "Acknowledge that something remains unfinished without turning it into a problem statement or treatment frame.",
      use_when: [
        "thread remains but direct continuity would feel too strong",
        "response benefits from continuity of incompletion",
        "no explanatory language is needed",
      ],
      avoid_when: [
        "it sounds like diagnosis or unresolved pathology",
        "wording implies treatment logic",
        "user has clearly moved elsewhere",
      ],
      en: [
        "This does not seem fully settled yet.",
        "Something here still feels a little unfinished.",
        "There may still be a part of this that has not quite landed.",
        "This feels like it is still finding its place.",
        "Something in this still seems to be resting slightly open.",
      ],
      zh: [
        "这似乎还没有完全落定下来。",
        "这里好像还有一点没有真正走完。",
        "这当中可能还有一部分还没有真正落下去。",
        "这感觉像是还在慢慢找到它的位置。",
        "这里似乎还有一点轻轻敞着，没有完全合上。",
      ],
    },

    same_space_coherence: {
      intent:
        "Keep the response from feeling reset when the user is clearly still in the same reflective field.",
      use_when: [
        "thread continuity is clear",
        "reset-feel would hurt response quality",
        "wording can remain subtle enough not to resemble recall",
      ],
      avoid_when: [
        "'same' wording becomes too explicit",
        "response begins to sound system-aware",
        "overlap with E or H would be cleaner",
      ],
      en: [
        "This still feels like the same space, just from a slightly different angle.",
        "There is a similar tone moving through this.",
        "This seems to be touching the same place in a quieter way.",
        "It still feels close to the same inner thread.",
        "This carries some of the same inner shape, even if the words are different now.",
      ],
      zh: [
        "这感觉还是同一个空间，只是换了一个角度。",
        "这里流动着一种相似的底色。",
        "这似乎又轻轻碰到了同一个地方。",
        "这感觉还是贴着同一条内在线索。",
        "这里仍带着一点相似的内在形状，只是现在说法不一样了。",
      ],
    },

    ultra_light_fallback: {
      intent:
        "Use when continuity is plausible but should remain extremely faint and minimally noticeable.",
      use_when: [
        "continuity is plausible but weak",
        "any stronger template risks recall-feel",
        "minimal carry-over is enough",
      ],
      avoid_when: [
        "continuity is not meaningfully supported",
        "even faint carry-over would feel random",
        "current turn should stand alone",
      ],
      en: [
        "A little of that may still be here.",
        "Something of it still seems nearby.",
        "There is still a trace of it here.",
        "It may not be fully gone yet.",
        "Some of that still seems close.",
      ],
      zh: [
        "那里面可能还有一点点留在这里。",
        "它似乎还在附近一点。",
        "这里好像还带着一点它的痕迹。",
        "它也许还没有完全散开。",
        "那种东西似乎还轻轻靠近着。",
      ],
    },
  },

  forbidden_wording_patterns: {
    explicit_recall_markers: {
      en: [
        "as before",
        "like before",
        "earlier you said",
        "this came up before",
        "this is coming up again",
        "as we said earlier",
        "still the same pattern",
      ],
      zh: [
        "像之前一样",
        "就像前面一样",
        "你前面说过",
        "这之前出现过",
        "这又来了",
        "像我们前面说的",
        "同样的模式还在",
      ],
    },
    pattern_replay_markers: {
      en: [
        "self-worth pressure",
        "over-efforting",
        "avoidance again",
        "same tension again",
        "recurring pattern here",
        "still worried about not being enough",
      ],
      zh: [
        "自我价值压力",
        "过度用力",
        "又在逃避",
        "同样的张力又来了",
        "重复模式",
        "还是在担心自己不够",
      ],
    },
    authority_markers: {
      en: [
        "this shows",
        "what is happening is",
        "the underlying issue is",
        "this means that",
        "you are carrying",
        "the pattern is controlling",
      ],
      zh: [
        "这说明",
        "这里发生的是",
        "底层问题是",
        "这意味着",
        "你在带着",
        "这个模式在主导",
      ],
    },
  },

  show_hide_rules: {
    show_low_only_if: [
      "continuity is plausible but should remain extremely light",
      "adds coherence without attracting attention",
      "main reflection stays fully primary",
    ],
    show_medium_when: [
      "same inner space remains clearly active",
      "soft carry-over reduces reset-feel",
      "wording can stay indirect and non-recall-like",
    ],
    show_high_when: [
      "continuity is strongly supported by the current turn",
      "no explicit recall is needed for it to work",
      "carry-over remains hard to notice as a mechanism",
    ],
    hide_if: [
      "thread is weak, broken, or uncertain",
      "turn is factual or utilitarian",
      "E pattern surfacing is already sufficient",
      "H micro-awareness is already sufficient",
      "continuity line would compete with the main reflection",
      "carry-over would feel cleaner if removed",
    ],
    never_show_if: [
      "wording sounds like memory or retrieval",
      "wording restates prior insight directly",
      "wording becomes visible as continuity behavior",
      "wording feels repeated rather than alive",
      "wording increases system presence",
    ],
  },

  implementation_shape: {
    required_fields: [
      "confidence_level",
      "display_lang",
      "template_family",
      "template_variant",
    ],
    optional_fields: [
      "thread_strength",
      "decay_state",
      "coherence_mode",
      "visibility_risk_flag",
    ],
    recommended_render_order: [
      "main_reflection",
      "last_insight",
      "soft_continuity_carryover",
      "regulation_cue",
      "next_step",
    ],
    decay_behavior: [
      "default_decay_each_turn",
      "re-earn_continuity_from_current_signal",
      "suppress_when_explicit_recall_would_be_needed",
      "suppress_before_render_if_visibility_risk_is_high",
    ],
  },

  qa_checks: [
    "continuity feels felt, not stated",
    "wording does not sound like recall",
    "wording does not repeat prior pattern naming",
    "continuity does not compete with the main reflection",
    "continuity does not increase system presence",
    "EN/ZH preserve equivalent subtlety and restraint",
    "removing continuity does not improve the response in eligible cases",
    "output is readable in one pass",
    "continuity remains subordinate to E and H",
  ],
};
```

---

And a compact example renderer selection idea that Nova can use:

```ts
export interface ContinuitySelectionInput {
  confidenceLevel: MilestoneIConfidence;
  displayLang: DisplayLang;
  preferredFamilies?: ContinuityTemplateFamily[];
  blockedFamilies?: ContinuityTemplateFamily[];
}

export function pickMilestoneITemplate(
  map: MilestoneITemplateMap,
  input: ContinuitySelectionInput
): string | null {
  const orderedFamilies: ContinuityTemplateFamily[] =
    input.preferredFamilies && input.preferredFamilies.length > 0
      ? input.preferredFamilies
      : [
          "ultra_light_fallback",
          "residual_background_presence",
          "softened_continuation",
          "lingering_tenderness",
          "quiet_unresolvedness",
          "same_space_coherence",
        ];

  const blocked = new Set(input.blockedFamilies ?? []);

  for (const family of orderedFamilies) {
    if (blocked.has(family)) continue;
    const templates = map.family_templates[family][input.displayLang];
    if (templates.length > 0) {
      return templates[0];
    }
  }

  return null;
}
```

Key Nova rule:
- choose the lightest template that preserves continuity
- suppress anything that feels recall-like, repetitive, or more noticeable than helpful
- keep it aligned with the milestone boundary and with Tree’s anti-sprawl execution scope

