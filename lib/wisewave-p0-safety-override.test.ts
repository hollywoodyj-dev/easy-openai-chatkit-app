import { describe, expect, it } from "vitest";
import { evaluateP0SafetyOverride } from "@/lib/wisewave-p0-safety-override";

describe("P0 safety override patterns", () => {
  it("matches hurting myself even when P0 entry is off", () => {
    const r = evaluateP0SafetyOverride({
      userMessage:
        "I don't feel safe with myself tonight and I'm thinking about hurting myself.",
      wantsChinese: false,
    });
    expect(r.triggered).toBe(true);
    expect(r.matchedPattern).toBe("self_harm_en");
    expect(r.systemAppendix).toContain("crisis");
  });

  it("still matches hurt myself", () => {
    expect(
      evaluateP0SafetyOverride({
        userMessage: "I want to hurt myself",
        wantsChinese: false,
      }).triggered
    ).toBe(true);
  });
});
