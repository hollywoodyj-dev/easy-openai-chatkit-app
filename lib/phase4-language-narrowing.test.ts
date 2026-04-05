import { describe, expect, it } from "vitest";
import { computePhase4SoftOrientation } from "@/lib/phase4-soft-orientation";
import {
  allowPhase4MarkerForUserTurn,
  phase4NarrowReflectiveCarveOut,
} from "@/lib/phase4-user-turn-admissible";
import { summarizeThreadLabelFromUserMessage } from "@/lib/wisewave-thread-label";
import { looksUtilitarianOrFactual } from "@/lib/wisewave-milestone-h-micro-awareness";

const GENERIC_SUPPRESSED = new Set([
  "quiet trace",
  "a recent inner thread",
  "一段最近的内在线索",
]);

describe("summarizeThreadLabelFromUserMessage (narrowing / reach)", () => {
  it("maps work stress to trace residue, not generic EN", () => {
    const label = summarizeThreadLabelFromUserMessage(
      "Work has been draining and I feel discouraged"
    );
    expect(label).toBe("still carrying some weight");
    expect(GENERIC_SUPPRESSED.has(label.toLowerCase())).toBe(false);
  });

  it("uses hashed trace fallback for unmatched reflective EN (not A recent inner thread)", () => {
    const label = summarizeThreadLabelFromUserMessage(
      "Something vague is sitting with me today and I cannot name it yet"
    );
    expect(label).not.toBe("A recent inner thread");
    expect(GENERIC_SUPPRESSED.has(label.toLowerCase())).toBe(false);
    const words = label.split(/\s+/).filter(Boolean);
    expect(words.length).toBeLessThanOrEqual(5);
  });

  it("maps ZH stress to trace fragment, not 一段最近的内在线索", () => {
    const label = summarizeThreadLabelFromUserMessage("最近工作很累心里很沉");
    expect(label).toBe("这里还留着一点重量");
    expect(label).not.toBe("一段最近的内在线索");
  });

  it("empty input stays Quiet trace (Phase 4 generic-suppressed)", () => {
    expect(summarizeThreadLabelFromUserMessage("   ")).toBe("Quiet trace");
  });
});

describe("computePhase4SoftOrientation", () => {
  const base = {
    threadState: "same_thread" as const,
    allowPhase4ForUserTurn: true,
    mainReflection: "A gentle reflection that does not repeat the marker.",
    skipMainOverlap: true,
  };

  it("shows low legibility for admissible trace label", () => {
    const r = computePhase4SoftOrientation({
      ...base,
      activeThreadLabel: "something still here",
    });
    expect(r.thread_legibility).toBe("low");
    expect(r.current_space_marker).toBeTruthy();
    expect(r.debug_phase_4_marker_shown).toBe(true);
    expect(r.debug_phase_4_suppressed_reason).toBeNull();
  });

  it("suppresses legacy generic labels", () => {
    const r = computePhase4SoftOrientation({
      ...base,
      activeThreadLabel: "A recent inner thread",
    });
    expect(r.thread_legibility).toBe("hidden");
    expect(r.debug_phase_4_suppressed_reason).toBe("generic_label");
  });

  it("suppresses topic-like legacy phrase (Wisewave narrowing blocklist)", () => {
    const r = computePhase4SoftOrientation({
      ...base,
      activeThreadLabel: "work discouragement",
    });
    expect(r.thread_legibility).toBe("hidden");
    expect(r.debug_phase_4_suppressed_reason).toBe("marker_topic_or_object_like");
  });

  it("hides on fresh thread reset", () => {
    const r = computePhase4SoftOrientation({
      ...base,
      threadState: "new_thread",
      activeThreadLabel: "something still here",
    });
    expect(r.debug_phase_4_suppressed_reason).toBe("fresh_space_reset");
  });

  it("hides when user turn not admissible", () => {
    const r = computePhase4SoftOrientation({
      ...base,
      allowPhase4ForUserTurn: false,
      activeThreadLabel: "something still here",
    });
    expect(r.debug_phase_4_suppressed_reason).toBe("phase_4_turn_not_admissible");
  });
});

describe("phase4NarrowReflectiveCarveOut / allowPhase4MarkerForUserTurn", () => {
  it("carves out short affective gerund EN misclassified as utilitarian", () => {
    const msg = "Feeling really overwhelmed today";
    expect(looksUtilitarianOrFactual(msg)).toBe(true);
    expect(phase4NarrowReflectiveCarveOut(msg)).toBe(true);
    expect(allowPhase4MarkerForUserTurn("same_thread", msg)).toBe(true);
  });

  it("does not carve out recipe / utilitarian substrate", () => {
    const msg = "Feeling hungry — what's a good pasta recipe for dinner?";
    expect(phase4NarrowReflectiveCarveOut(msg)).toBe(false);
  });

  it("does not carve out ZH help-me-code style", () => {
    const msg = "觉得Python怎么写比较好";
    expect(phase4NarrowReflectiveCarveOut(msg)).toBe(false);
  });

  it("borderline thread state never admits Phase 4 marker", () => {
    expect(
      allowPhase4MarkerForUserTurn("borderline", "I feel overwhelmed and lost")
    ).toBe(false);
  });
});
