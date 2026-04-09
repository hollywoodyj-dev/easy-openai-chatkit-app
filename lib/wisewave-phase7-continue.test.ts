import { describe, expect, it } from "vitest";
import {
  buildPhase7ContinueListMeta,
  buildPhase7TurnDebugMeta,
  classifyPhase7ReturnPatternId,
  PHASE7_TAXONOMY_VERSION,
} from "@/lib/wisewave-phase7-continue";

describe("classifyPhase7ReturnPatternId", () => {
  it("maps low-verbal continuation to locked taxonomy id", () => {
    expect(classifyPhase7ReturnPatternId("mm")).toBe(
      "low_verbal_resumable_return"
    );
  });

  it("maps interrupted articulation returns", () => {
    expect(
      classifyPhase7ReturnPatternId("I lost my train of thought there")
    ).toBe("interrupted_articulation");
  });
});

describe("buildPhase7ContinueListMeta", () => {
  it("emits normalized exposure event fields", () => {
    const meta = buildPhase7ContinueListMeta({
      lastUserMessage: "still here",
      optionCount: 2,
      suppressedWeakTail: false,
    });
    expect(meta.taxonomy_version).toBe(PHASE7_TAXONOMY_VERSION);
    expect(meta.exposure_denominator_event).toBe(1);
    expect(meta.exposure_numerator_event).toBe(1);
    expect(meta.zero_surface_success_event).toBe(0);
    expect(meta.option_count).toBe(2);
  });

  it("marks weak-tail suppression as zero-surface success", () => {
    const meta = buildPhase7ContinueListMeta({
      lastUserMessage: "Thanks.",
      optionCount: 0,
      suppressedWeakTail: true,
    });
    expect(meta.weak_case_suppressed_event).toBe(1);
    expect(meta.zero_surface_success_event).toBe(1);
    expect(meta.exposure_numerator_event).toBe(0);
  });
});

describe("buildPhase7TurnDebugMeta", () => {
  it("marks strong-path event for selected short-ack same-thread resumes", () => {
    const meta = buildPhase7TurnDebugMeta({
      userMessage: "mm",
      phase3ThreadReentry: true,
      continueReentryContinuationTurn: true,
      threadState: "same_thread",
    });
    expect(meta.strong_path_event).toBe(true);
    expect(meta.return_pattern_id).toBe("low_verbal_resumable_return");
  });
});
