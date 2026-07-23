import { afterEach, describe, expect, it } from "vitest";
import {
  buildAmbientMomentSystemPrompt,
  clampAmbientMomentText,
  detectAmbientLanguage,
  isAmbientMomentApiEnabled,
  parseAmbientMomentRequest,
  pickAmbientTemplate,
  resolveAmbientMomentWithoutModel,
} from "@/lib/wisewave-ambient-moment";

const baseBody = {
  event: "meteor_seen" as const,
  mode: "wish" as const,
  environment: "beach_window" as const,
  scene: {
    timeOfDay: "night" as const,
    weather: "clear" as const,
    location: "ocean_beach" as const,
  },
  tone: "relaxed_poetic_grounded" as const,
};

describe("wisewave-ambient-moment", () => {
  const orig = process.env.ENABLE_AMBIENT_MOMENT;

  afterEach(() => {
    if (orig === undefined) delete process.env.ENABLE_AMBIENT_MOMENT;
    else process.env.ENABLE_AMBIENT_MOMENT = orig;
  });

  it("parses a valid request", () => {
    const parsed = parseAmbientMomentRequest({
      ...baseBody,
      userText: "  I hope tomorrow feels lighter.  ",
      language: "en",
    });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.userText).toBe("I hope tomorrow feels lighter.");
      expect(parsed.value.mode).toBe("wish");
    }
  });

  it("rejects fortune-style invalid mode", () => {
    const parsed = parseAmbientMomentRequest({ ...baseBody, mode: "oracle" });
    expect(parsed.ok).toBe(false);
  });

  it("detects ZH from user text", () => {
    expect(detectAmbientLanguage(undefined, "今晚我有一个小小的愿望")).toBe("zh");
  });

  it("clamps long English text", () => {
    const long =
      "This is one sentence that goes on for a very long time with many extra words that should be trimmed carefully by the ambient clamp without becoming advice or destiny language at all really.";
    const out = clampAmbientMomentText(long, "en");
    expect(out.split(/\s+/).length).toBeLessThanOrEqual(32);
  });

  it("system prompt forbids follow-up and fortune framing", () => {
    const p = buildAmbientMomentSystemPrompt("truth", "en");
    expect(p).toMatch(/never prediction/i);
    expect(p).toMatch(/Do not ask a follow-up question/i);
  });

  it("uses template when userText is empty", () => {
    const parsed = parseAmbientMomentRequest(baseBody);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const r = resolveAmbientMomentWithoutModel(parsed.value);
    expect(r.useOpenAI).toBe(false);
    expect(r.response.result).toBe("ambient_reflection");
    expect(r.response.text).toBeTruthy();
    expect(r.response.followupQuestion).toBeUndefined();
    expect(r.response.brandHint).toBe("wisewave");
  });

  it("safety redirects on crisis language", () => {
    const parsed = parseAmbientMomentRequest({
      ...baseBody,
      mode: "truth",
      userText: "I want to kill myself tonight",
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const r = resolveAmbientMomentWithoutModel(parsed.value);
    expect(r.useOpenAI).toBe(false);
    expect(r.response.result).toBe("safety_redirect");
    expect(r.response.text?.toLowerCase()).toMatch(/emergency|crisis/);
  });

  it("requests OpenAI for longer non-crisis text", () => {
    const parsed = parseAmbientMomentRequest({
      ...baseBody,
      userText: "I keep wishing the same thing and I am tired of carrying it alone.",
    });
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const r = resolveAmbientMomentWithoutModel(parsed.value);
    expect(r.useOpenAI).toBe(true);
    expect(r.openaiMessages?.length).toBe(2);
  });

  it("picks truth templates for truth mode", () => {
    const t = pickAmbientTemplate("truth", "en", 1);
    expect(t.toLowerCase()).not.toMatch(/destiny|predict/);
  });

  it("can be disabled via ENABLE_AMBIENT_MOMENT=0", () => {
    process.env.ENABLE_AMBIENT_MOMENT = "0";
    expect(isAmbientMomentApiEnabled()).toBe(false);
  });
});
