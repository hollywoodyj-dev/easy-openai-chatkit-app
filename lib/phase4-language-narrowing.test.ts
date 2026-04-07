import { describe, expect, it } from "vitest";
import { computePhase4SoftOrientation } from "@/lib/phase4-soft-orientation";
import {
  allowPhase4MarkerForUserTurn,
  phase4NarrowReflectiveCarveOut,
} from "@/lib/phase4-user-turn-admissible";
import { pickContinueOptions } from "@/lib/wisewave-continue-list";
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
    expect(words.length).toBeLessThanOrEqual(6);
  });

  it("overwhelm path varies by labelEntropy (fewer repeated drawer rows)", () => {
    const msg = "I am completely overwhelmed and cannot cope";
    const labels = new Set<string>();
    for (let i = 0; i < 48; i++) {
      labels.add(
        summarizeThreadLabelFromUserMessage(msg, `conv:thr${i}:same_thread`)
      );
    }
    expect(labels.size).toBeGreaterThan(1);
    for (const l of labels) {
      expect(GENERIC_SUPPRESSED.has(l.toLowerCase())).toBe(false);
    }
  });

  it("maps ZH stress to trace fragment, not 一段最近的内在线索", () => {
    const label = summarizeThreadLabelFromUserMessage("最近工作很累心里很沉");
    expect(label).toBe("这里还留着一点重量");
    expect(label).not.toBe("一段最近的内在线索");
  });

  it("empty input stays Quiet trace (Phase 4 generic-suppressed)", () => {
    expect(summarizeThreadLabelFromUserMessage("   ")).toBe("Quiet trace");
  });

  it("maps delayed-reply / silence substrate to strong Continue-safe traces (Lumen Phase 5 Batch 3)", () => {
    const msg =
      "They left me on read days ago and I keep checking my phone for a reply";
    const label = summarizeThreadLabelFromUserMessage(msg, "conv:x:thr1:same_thread");
    expect(GENERIC_SUPPRESSED.has(label.toLowerCase())).toBe(false);
    const picked = pickContinueOptions([
      {
        id: "t1",
        label,
        updatedAt: new Date(),
      },
    ]);
    expect(picked.length).toBe(1);
    expect(picked[0]?.label).toBe(label);
  });

  it("maps ZH delayed-reply substrate to traces that survive Continue filtering", () => {
    const label = summarizeThreadLabelFromUserMessage(
      "对方一直不回消息，我很焦虑",
      "conv:zh:thr2:same_thread"
    );
    expect(pickedContinue(label)).toBe(true);
  });

  it("Phase 6: interrupted articulation + earned-rest traces survive Continue picker", () => {
    const labelA = summarizeThreadLabelFromUserMessage(
      "I lost my train of thought halfway through explaining",
      "conv:p6:interrupt:1"
    );
    expect(pickedContinue(labelA)).toBe(true);
    const labelB = summarizeThreadLabelFromUserMessage(
      "I can't rest without feeling I earned it first",
      "conv:p6:rest:1"
    );
    expect(pickedContinue(labelB)).toBe(true);
  });
});

function pickedContinue(label: string): boolean {
  return (
    pickContinueOptions([{ id: "t", label, updatedAt: new Date() }]).length > 0
  );
}

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
