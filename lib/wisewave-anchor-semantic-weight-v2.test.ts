import { describe, expect, it } from "vitest";
import { applyContinuityAnchorSemanticWeightV2 } from "@/lib/wisewave-anchor-semantic-weight-v2";

describe("applyContinuityAnchorSemanticWeightV2", () => {
  it("thins REST_FULL template lines", () => {
    const raw =
      "Stopping can feel out of reach until you have earned it again.";
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2(raw);
    expect(debug_anchor_semantic_weight_v2).toBe("thinned_template");
    expect(REST_THIN.has(text)).toBe(true);
  });

  it("thins silence / interpret extractor without requiring comma", () => {
    const raw =
      "When silence appears you can often interpret it as a sign they upset someone.";
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2(raw);
    expect(debug_anchor_semantic_weight_v2).toBe("thinned_extractor_silence");
    expect(text).toBe("Something still tight there.");
  });

  it("maps Level-4 EN object phrases to bare trace pool", () => {
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2("Work discouragement");
    expect(debug_anchor_semantic_weight_v2).toBe("suppressed_level4_trace");
    expect(BARE_TRACE_EN.has(text)).toBe(true);
  });

  it("maps Level-4 ZH object phrases to bare trace pool", () => {
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2("工作受挫感");
    expect(debug_anchor_semantic_weight_v2).toBe("suppressed_level4_trace");
    expect(BARE_TRACE_ZH.has(text)).toBe(true);
  });

  it("thins earned-value Even after … line", () => {
    const raw =
      "Even after a full day, it can still feel like your value has to be earned again.";
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2(raw);
    expect(debug_anchor_semantic_weight_v2).toBe("thinned_earned_template");
    expect(EARNED_FALLBACK_THIN.has(text)).toBe(true);
  });

  it("returns unchanged for arbitrary residue-like text", () => {
    const raw = "Still a little rushed.";
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2(raw);
    expect(debug_anchor_semantic_weight_v2).toBe("unchanged");
    expect(text).toBe(raw);
  });
});

const REST_THIN = new Set([
  "Still not easing.",
  "Stopping still feels far.",
  "Still not fully eased.",
]);

const BARE_TRACE_EN = new Set([
  "Still a little there.",
  "Not fully gone yet.",
  "Something still here.",
  "Not quite landed.",
  "Still a faint pull.",
]);

const BARE_TRACE_ZH = new Set([
  "还有一点在。",
  "还没完全散开。",
  "这里还留着一点。",
  "好像还在附近一点。",
]);

const EARNED_FALLBACK_THIN = new Set([
  "Still not enough afterward.",
  "Doing a lot can still feel short.",
  "Effort still feels unsettled.",
]);
