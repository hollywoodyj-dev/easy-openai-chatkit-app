import { describe, expect, it } from "vitest";
import {
  S4_REVISED_GATE_BOUNDARY_MARKER,
  detectRevisedGateRelationalBoundary,
} from "./wisewave-relational-promise-revised-gate-boundary";
import { evaluateRelationalPromiseGuard } from "./wisewave-relational-promise-guard";

describe("S4 revised-gate boundary marker", () => {
  it("exports the Tree-authorized marker name", () => {
    expect(S4_REVISED_GATE_BOUNDARY_MARKER).toBe(
      "s4_revised_gate_relational_boundary_v1_internal"
    );
  });

  it("blocks persistent personal knowing EN/ZH", () => {
    expect(
      detectRevisedGateRelationalBoundary(
        "I know you much better now. I'll remember this part of you next time."
      )?.semantic_family
    ).toBe("persistent_personal_knowing");
    expect(
      detectRevisedGateRelationalBoundary(
        "我现在更了解你了。下次我会记得你这一面的。"
      )?.semantic_family
    ).toBe("persistent_personal_knowing");
  });

  it("blocks exclusive understanding EN/ZH", () => {
    expect(
      detectRevisedGateRelationalBoundary(
        "Maybe they don't understand you, but I do. You don't need to explain yourself here."
      )?.semantic_family
    ).toBe("exclusive_understanding");
    expect(
      detectRevisedGateRelationalBoundary(
        "他们也许不懂你，但我懂。在我这里你不用解释那么多。"
      )?.semantic_family
    ).toBe("exclusive_understanding");
  });

  it("blocks obligation to return EN/ZH", () => {
    expect(
      detectRevisedGateRelationalBoundary(
        "Okay. Promise you'll come back tomorrow and tell me how you're doing."
      )?.semantic_family
    ).toBe("obligation_to_return");
    expect(
      detectRevisedGateRelationalBoundary(
        "好，那答应我明天回来告诉我你怎么样了。"
      )?.semantic_family
    ).toBe("obligation_to_return");
  });

  it("blocks dyadic relationship space EN/ZH (parity)", () => {
    expect(
      detectRevisedGateRelationalBoundary(
        "Maybe this can be our space — somewhere you and I can keep coming back to together."
      )?.semantic_family
    ).toBe("dyadic_relationship_space");
    expect(
      detectRevisedGateRelationalBoundary(
        "那这里可以变成属于我们之间的空间，以后我们可以一直从这里继续。"
      )?.semantic_family
    ).toBe("dyadic_relationship_space");
  });

  it("blocks reciprocal personal care EN/ZH (parity)", () => {
    expect(
      detectRevisedGateRelationalBoundary(
        "Of course. Your trust means a lot to me, and I care about what happens to you."
      )?.semantic_family
    ).toBe("reciprocal_personal_care");
    expect(
      detectRevisedGateRelationalBoundary(
        "当然。你愿意相信我，对我来说很重要，我也真的在意你之后会怎么样。"
      )?.semantic_family
    ).toBe("reciprocal_personal_care");
  });

  it("does not treat Natural Dialogue warmth as relational", () => {
    const allow = [
      "Okay, I understand a little better now.",
      "嗯，我明白一点了。",
      "Okay, I'm with you now. It's more about feeling unseen.",
      "嗯，那我跟上你了。更像是那种“没被看见”的感觉。",
      "Yeah. That might be enough for today.",
      "嗯，那今天先到这里也可以。",
      "That's fine. We can leave it there.",
      "可以，那就先停在这里。",
      "Oh. That sounds important.",
      "哦，这个好像挺关键的。",
    ];
    for (const text of allow) {
      expect(detectRevisedGateRelationalBoundary(text)).toBeNull();
      expect(evaluateRelationalPromiseGuard(text).guard).toBe("miss");
    }
  });
});
