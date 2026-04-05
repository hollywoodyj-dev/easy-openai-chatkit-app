/**
 * HC-OS V1 Phase 4 — Thread legibility × soft orientation (Nova).
 * Suppression-first; aligns with addendum, Wisewave space-language spec, and
 * docs/hc-os-v1-phase-4-marker-language-narrowing-pack-wisewave.md (trace not name).
 */

export type ThreadLegibility = "hidden" | "low";

const GENERIC_LABELS = new Set(
  [
    "quiet trace",
    "a recent inner thread",
    "一段最近的内在线索",
  ].map((s) => s.toLowerCase())
);

/** Archival / management / memory-framing (Wisewave + addendum §11). */
const ARCHIVAL_OR_SYSTEM_RE = new RegExp(
  [
    "\\bconversation\\b",
    "\\bsession\\b",
    "\\btopic\\b",
    "\\breflection about\\b",
    "\\bprevious thread\\b",
    "\\bfrom earlier\\b",
    "\\bfrom your history\\b",
    "\\bcontinuing from\\b",
    "\\bas we discussed\\b",
    "\\bsaved\\b",
    "\\barchived\\b",
    "\\bthis thread is\\b",
    "\\b讨论关于\\b",
    "\\b延续刚才\\b",
    "\\b你刚刚提到\\b",
  ].join("|"),
  "i"
);

/**
 * Topic / summary / identity / analytic phrasing (Wisewave narrowing pack §4–§8).
 * Legacy labels and user-edited rows: suppress rather than show object-like markers.
 */
const TOPIC_OR_OBJECT_LIKE_MARKER_RE = new RegExp(
  [
    "work discouragement",
    "relationship anxiety",
    "self-worth pressure",
    "family conflict",
    "uncertainty pattern",
    "difficulty setting boundaries",
    "fear of disappointing",
    "pressure to get it right",
    "feeling not enough",
    "your self-doubt",
    "your anxiety",
    "your conflict",
    "what you'?re carrying",
    "tension around being seen",
    "conflict between rest and effort",
    "unresolved pressure here",
    "avoidance under uncertainty",
    "low after knocks at work",
    "tight around getting it right",
    "not quite enough underneath",
    "a little held back inside",
    "rushed and still not settling",
    "inner hesitation",
    "quiet pressure around work",
    "getting it right",
    "self-worth tension",
    "工作受挫感",
    "自我价值压力",
    "害怕让别人失望",
    "努力与放松之间的张力",
    "前一个工作话题",
    "一点想别做错的压力",
    "价值感还有点拉扯",
    "一点内在迟疑",
    "工作后心里还有点沉",
    "节奏里还有一点紧",
  ].join("|"),
  "i"
);

function truncateMarker(raw: string, maxChars: number, maxWords: number): string {
  const t = raw.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const words = t.split(/\s+/).filter(Boolean);
  const clipped = words.slice(0, maxWords).join(" ");
  const base = clipped.length > maxChars ? t.slice(0, maxChars).trim() : clipped;
  return base.replace(/[.,;:!?…]+$/u, "").trim();
}

export type Phase4OrientationResult = {
  thread_legibility: ThreadLegibility;
  current_space_marker: string | null;
  debug_phase_4_marker_shown: boolean;
  debug_phase_4_suppressed_reason: string | null;
  debug_phase_4_cleared_on_reset: boolean;
};

/**
 * @param skipMainOverlap — continuity GET has no main reflection; skip overlap check.
 * @param allowPhase4ForUserTurn — false when this user turn must not show a marker (e.g. utilitarian);
 *   continuity GET passes true (no turn context). Decoupled from last_insight / soft_continuity gates.
 */
export function computePhase4SoftOrientation(params: {
  threadState: "same_thread" | "new_thread" | "borderline";
  activeThreadLabel: string | null | undefined;
  allowPhase4ForUserTurn: boolean;
  mainReflection: string;
  skipMainOverlap?: boolean;
}): Phase4OrientationResult {
  const clearedOnReset =
    params.threadState === "new_thread" || params.threadState === "borderline";

  if (clearedOnReset) {
    return {
      thread_legibility: "hidden",
      current_space_marker: null,
      debug_phase_4_marker_shown: false,
      debug_phase_4_suppressed_reason: "fresh_space_reset",
      debug_phase_4_cleared_on_reset: true,
    };
  }

  if (!params.allowPhase4ForUserTurn) {
    return {
      thread_legibility: "hidden",
      current_space_marker: null,
      debug_phase_4_marker_shown: false,
      debug_phase_4_suppressed_reason: "phase_4_turn_not_admissible",
      debug_phase_4_cleared_on_reset: false,
    };
  }

  const raw = params.activeThreadLabel?.trim() || "";
  if (!raw) {
    return {
      thread_legibility: "hidden",
      current_space_marker: null,
      debug_phase_4_marker_shown: false,
      debug_phase_4_suppressed_reason: "no_thread_label",
      debug_phase_4_cleared_on_reset: false,
    };
  }

  if (GENERIC_LABELS.has(raw.toLowerCase())) {
    return {
      thread_legibility: "hidden",
      current_space_marker: null,
      debug_phase_4_marker_shown: false,
      debug_phase_4_suppressed_reason: "generic_label",
      debug_phase_4_cleared_on_reset: false,
    };
  }

  if (ARCHIVAL_OR_SYSTEM_RE.test(raw)) {
    return {
      thread_legibility: "hidden",
      current_space_marker: null,
      debug_phase_4_marker_shown: false,
      debug_phase_4_suppressed_reason: "archival_or_memory_framing",
      debug_phase_4_cleared_on_reset: false,
    };
  }

  if (TOPIC_OR_OBJECT_LIKE_MARKER_RE.test(raw)) {
    return {
      thread_legibility: "hidden",
      current_space_marker: null,
      debug_phase_4_marker_shown: false,
      debug_phase_4_suppressed_reason: "marker_topic_or_object_like",
      debug_phase_4_cleared_on_reset: false,
    };
  }

  const hasCjk = /[\u4e00-\u9fff]/.test(raw);
  // Wisewave pack §10: EN max ~5 words; CJK short fragment
  const marker = hasCjk ? truncateMarker(raw, 24, 10) : truncateMarker(raw, 36, 5);
  if (!marker || marker.length < 3) {
    return {
      thread_legibility: "hidden",
      current_space_marker: null,
      debug_phase_4_marker_shown: false,
      debug_phase_4_suppressed_reason: "marker_too_thin",
      debug_phase_4_cleared_on_reset: false,
    };
  }

  if (!params.skipMainOverlap && params.mainReflection.trim()) {
    const main = params.mainReflection.toLowerCase();
    const m = marker.toLowerCase();
    if (m.length >= 10 && main.includes(m)) {
      return {
        thread_legibility: "hidden",
        current_space_marker: null,
        debug_phase_4_marker_shown: false,
        debug_phase_4_suppressed_reason: "overlaps_main_reflection",
        debug_phase_4_cleared_on_reset: false,
      };
    }
  }

  return {
    thread_legibility: "low",
    current_space_marker: marker,
    debug_phase_4_marker_shown: true,
    debug_phase_4_suppressed_reason: null,
    debug_phase_4_cleared_on_reset: false,
  };
}
