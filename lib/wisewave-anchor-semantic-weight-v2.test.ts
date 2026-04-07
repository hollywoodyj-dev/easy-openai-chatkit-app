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

  it("thins REST_FULL to ZH residue when responseLang is zh", () => {
    const raw =
      "Stopping can feel out of reach until you have earned it again.";
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2(raw, { responseLang: "zh" });
    expect(debug_anchor_semantic_weight_v2).toBe("thinned_template");
    expect(REST_THIN_ZH.has(text)).toBe(true);
  });

  it("thins silence / interpret extractor without requiring comma", () => {
    const raw =
      "When silence appears you can often interpret it as a sign they upset someone.";
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2(raw);
    expect(debug_anchor_semantic_weight_v2).toBe("thinned_extractor_silence");
    expect(text).toBe("Something still tight there.");
  });

  it("thins silence extractor to ZH when responseLang is zh", () => {
    const raw =
      "When silence appears you can often interpret it as a sign they upset someone.";
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2(raw, { responseLang: "zh" });
    expect(debug_anchor_semantic_weight_v2).toBe("thinned_extractor_silence");
    expect(text).toBe("安静里好像还紧着一点。");
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

  it("aligns already-thinned EN REST line to ZH when responseLang is zh", () => {
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2("Stopping still feels far.", {
        responseLang: "zh",
      });
    expect(debug_anchor_semantic_weight_v2).toBe("aligned_response_lang");
    expect(text).toBe("停下来好像还远着一点。");
  });

  it("aligns already-thinned ZH REST line to EN when responseLang is en", () => {
    const { text, debug_anchor_semantic_weight_v2 } =
      applyContinuityAnchorSemanticWeightV2("还有一点没松下来。", {
        responseLang: "en",
      });
    expect(debug_anchor_semantic_weight_v2).toBe("aligned_response_lang");
    expect(text).toBe("Slow reply still pulls inward.");
  });
});

const REST_THIN = new Set([
  "Still not easing.",
  "Stopping still feels far.",
  "Still not fully eased.",
]);

const REST_THIN_ZH = new Set([
  "还没真的缓下来。",
  "停下来好像还远着一点。",
  "还没完全松下来。",
]);

const BARE_TRACE_EN = new Set([
  "Still a little there.",
  "Not fully gone yet.",
  "Not quite through it yet.",
  "Not quite landed.",
  "Still a faint pull.",
]);

const BARE_TRACE_ZH = new Set([
  "还有一点在。",
  "还没完全散开。",
  "还没真正穿过去。",
  "好像还在附近一点。",
  "下面似乎还有一点。",
]);

const EARNED_FALLBACK_THIN = new Set([
  "Still not enough afterward.",
  "Doing a lot can still feel short.",
  "Effort still feels unsettled.",
]);
