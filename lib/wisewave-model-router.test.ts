import { beforeEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

async function loadRouter() {
  vi.resetModules();
  return import("@/lib/wisewave-model-router");
}

describe("wisewave model router", () => {
  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
    delete process.env.OPENAI_CHAT_MODEL;
    delete process.env.OPENAI_MODEL_CHAT_TURN;
    delete process.env.OPENAI_MODEL_CHAT_SUMMARY;
    delete process.env.OPENAI_MODEL_REFLECTION_CHECKPOINT;
    delete process.env.OPENAI_MODEL_REFLECTION_EXTRACT;
    delete process.env.OPENAI_MODEL_DEPRECATION_MODE;
  });

  it("uses capability-specific env ahead of OPENAI_CHAT_MODEL", async () => {
    process.env.OPENAI_CHAT_MODEL = "gpt-5.4-shared";
    process.env.OPENAI_MODEL_CHAT_TURN = "gpt-5.4-turn";
    const { resolveWisewaveModel } = await loadRouter();
    expect(resolveWisewaveModel("chat_turn")).toBe("gpt-5.4-turn");
    expect(resolveWisewaveModel("chat_summary")).toBe("gpt-5.4-shared");
  });

  it("reports deprecated direct model slugs with shutdown date", async () => {
    process.env.OPENAI_MODEL_CHAT_TURN = "gpt-4-turbo";
    const { getWisewaveModelCompatibilityReport } = await loadRouter();
    const report = getWisewaveModelCompatibilityReport();
    const row = report.capabilities.find((c) => c.capability === "chat_turn");
    expect(row?.deprecated).toBe(true);
    expect(row?.shutdownOn).toBe("2026-10-23");
    expect(row?.reason).toBe("model_deprecation");
    expect(report.hasDeprecated).toBe(true);
  });

  it("reports deprecated fine-tuned families from ft:<base>:<id> slugs", async () => {
    process.env.OPENAI_MODEL_REFLECTION_EXTRACT = "ft:gpt-3.5-turbo-0125:org:custom";
    const { getWisewaveModelCompatibilityReport } = await loadRouter();
    const report = getWisewaveModelCompatibilityReport();
    const row = report.capabilities.find(
      (c) => c.capability === "reflection_extract"
    );
    expect(row?.deprecated).toBe(true);
    expect(row?.reason).toBe("finetuned_family_deprecation");
    expect(row?.shutdownOn).toBe("2026-10-23");
  });

  it("throws in block mode when a deprecated model is selected", async () => {
    process.env.OPENAI_MODEL_DEPRECATION_MODE = "block";
    process.env.OPENAI_MODEL_CHAT_TURN = "gpt-5-chat-latest";
    const { resolveWisewaveModel } = await loadRouter();
    expect(() => resolveWisewaveModel("chat_turn")).toThrow(
      /Deprecated OpenAI model configured/
    );
  });

  it("does not throw in warn mode for deprecated model", async () => {
    process.env.OPENAI_MODEL_DEPRECATION_MODE = "warn";
    process.env.OPENAI_MODEL_CHAT_TURN = "gpt-5-chat-latest";
    const { resolveWisewaveModel } = await loadRouter();
    expect(resolveWisewaveModel("chat_turn")).toBe("gpt-5-chat-latest");
  });
});

