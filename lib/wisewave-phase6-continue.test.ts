import { describe, expect, it } from "vitest";
import {
  buildPhase6ContinueListMeta,
  classifyPhase6ReturnPatternHint,
} from "@/lib/wisewave-phase6-continue";

describe("classifyPhase6ReturnPatternHint", () => {
  it("tags fresh-start greetings", () => {
    expect(classifyPhase6ReturnPatternHint("Hey")).toBe("fresh_start");
  });

  it("tags interrupted articulation", () => {
    expect(
      classifyPhase6ReturnPatternHint(
        "I lost my train of thought when the meeting started"
      )
    ).toBe("interrupted_articulation_return");
  });

  it("tags short pause / minimal ack", () => {
    expect(classifyPhase6ReturnPatternHint("yeah")).toBe("short_pause_return");
  });

  it("tags medium pause for substantive mid-length returns", () => {
    expect(
      classifyPhase6ReturnPatternHint(
        "I have been sitting with what we talked about and something still feels unresolved."
      )
    ).toBe("medium_pause_return");
  });

  it("returns unknown for empty", () => {
    expect(classifyPhase6ReturnPatternHint("   ")).toBe("unknown");
  });
});

describe("buildPhase6ContinueListMeta", () => {
  it("marks weak-tail suppression and zero surface", () => {
    const m = buildPhase6ContinueListMeta({
      lastUserMessage: "Thanks.",
      pickedLabels: [],
      suppressedWeakTail: true,
    });
    expect(m.option_count).toBe(0);
    expect(m.zero_continue_surface).toBe(true);
    expect(m.suppressed_weak_tail).toBe(true);
    expect(m.strong_option_count).toBe(0);
    expect(m.low_verbal_reentry_ack).toBe(false);
  });

  it("counts strong options when labels match strong family", () => {
    const m = buildPhase6ContinueListMeta({
      lastUserMessage: "Still carrying weight from that talk.",
      pickedLabels: ["Slow reply still pulls inward", "still a little open"],
      suppressedWeakTail: false,
    });
    expect(m.option_count).toBe(2);
    expect(m.strong_option_count).toBe(1);
    expect(m.suppressed_weak_tail).toBe(false);
    expect(m.low_verbal_reentry_ack).toBe(false);
  });

  it("flags low_verbal_reentry_ack on continuation-shaped last lines", () => {
    const m = buildPhase6ContinueListMeta({
      lastUserMessage: "mhm",
      pickedLabels: [],
      suppressedWeakTail: false,
    });
    expect(m.low_verbal_reentry_ack).toBe(true);
  });
});
