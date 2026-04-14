import { describe, expect, it } from "vitest";
import {
  CONTINUE_LIST_MAX,
  pickContinueOptions,
  shouldSuppressContinueListForLastUserMessage,
} from "@/lib/wisewave-continue-list";

function row(
  id: string,
  label: string,
  updatedAtMs: number,
  extras?: {
    emotionSignal?: string | null;
    interpretationPattern?: string | null;
    tensionDirection?: string | null;
    intensity?: string | null;
  }
): {
  id: string;
  label: string;
  updatedAt: Date;
  emotionSignal?: string | null;
  interpretationPattern?: string | null;
  tensionDirection?: string | null;
  intensity?: string | null;
} {
  return { id, label, updatedAt: new Date(updatedAtMs), ...(extras ?? {}) };
}

describe("pickContinueOptions", () => {
  it("returns at most CONTINUE_LIST_MAX items", () => {
    const many = Array.from({ length: 8 }, (_, i) =>
      row(`t${i}`, `distinct label ${i}`, 1_000_000 - i * 1000)
    );
    expect(pickContinueOptions(many).length).toBeLessThanOrEqual(CONTINUE_LIST_MAX);
  });

  it("drops near-duplicate labels", () => {
    const picked = pickContinueOptions([
      row("a", "still a bit rushed", 3_000),
      row("b", "still a bit rushed today", 2_000),
      row("c", "not quite settled yet", 1_000, {
        interpretationPattern: "residual_unfinished_direction",
        intensity: "medium",
      }),
    ]);
    // b ~ a; c is a Phase-6 weaker companion once a strong-family row (rushed) is present.
    expect(picked.map((p) => p.id)).toEqual(["a"]);
  });

  it("filters weak residue-style headlines", () => {
    const picked = pickContinueOptions([
      row("a", "Something still here.", 2_000),
      row("b", "not quite settled yet", 1_000, {
        interpretationPattern: "residual_unfinished_direction",
        intensity: "medium",
      }),
    ]);
    expect(picked.map((p) => p.id)).toEqual(["b"]);
  });

  it("filters Lumen weak generic mist labels", () => {
    const picked = pickContinueOptions([
      row("a", "something still close", 5_000),
      row("b", "something quiet still here", 4_000),
      row("c", "still a bit rushed after that", 3_000),
    ]);
    expect(picked.map((p) => p.id)).toEqual(["c"]);
  });

  it("filters 'a little still near' mist label", () => {
    const picked = pickContinueOptions([
      row("a", "a little still near", 5_000),
      row("b", "rest still feels earned", 4_000),
    ]);
    expect(picked.map((p) => p.id)).toEqual(["b"]);
  });

  it("suppresses shallow low-specificity residue when structure is weak", () => {
    const picked = pickContinueOptions([
      row("a", "still a little open", 5_000),
      row("b", "still not quite here", 4_000),
    ]);
    expect(picked.map((p) => p.id)).toEqual([]);
  });

  it("allows one low-specificity label only with stronger structure signal", () => {
    const picked = pickContinueOptions([
      row("a", "still a little open", 5_000, {
        interpretationPattern: "self_blame_loop",
        intensity: "medium",
      }),
      row("b", "still not quite here", 4_000, {
        interpretationPattern: "self_blame_loop",
        intensity: "medium",
      }),
      row("c", "slow reply still pulls inward", 3_000, {
        interpretationPattern: "delayed_reply_self_blame",
        intensity: "medium",
      }),
    ]);
    // Phase 6: beside a strong family row, softer residue companions drop (earnedness > filled drawer).
    expect(picked.map((p) => p.id)).toEqual(["c"]);
  });

  it("Phase 6: drops weaker-trace companion when a strong-family row is present", () => {
    const picked = pickContinueOptions([
      row("a", "not quite landed", 5_000, {
        interpretationPattern: "residual_unfinished_direction",
        intensity: "medium",
      }),
      row("b", "Replaying still pulls inward", 4_000),
    ]);
    expect(picked.map((p) => p.id)).toEqual(["b"]);
    expect(picked[0]?.label).toContain("inward");
  });

  it("Phase 6: without a primary-earned row, weaker-trace headline can still surface alone", () => {
    const picked = pickContinueOptions([
      row("a", "not quite settled yet", 5_000, {
        interpretationPattern: "residual_unfinished_direction",
        intensity: "medium",
      }),
    ]);
    expect(picked.map((p) => p.id)).toEqual(["a"]);
  });

  it("suppresses low-specific labels when structure is weak placeholder text", () => {
    const picked = pickContinueOptions([
      row("a", "still a little open", 5_000, {
        interpretationPattern: "unknown",
        emotionSignal: "uncertain",
        intensity: "high",
      }),
      row("b", "still not quite here", 4_000, {
        interpretationPattern: "generic",
        intensity: "medium",
      }),
    ]);
    expect(picked.map((p) => p.id)).toEqual([]);
  });

  it("preserves strong delayed-reply path even if structure fields are missing", () => {
    const picked = pickContinueOptions([
      row("a", "slow reply still pulls inward", 5_000),
      row("b", "still not fully gone", 4_000),
    ]);
    expect(picked.map((p) => p.id)).toEqual(["a", "b"]);
  });
});

describe("shouldSuppressContinueListForLastUserMessage", () => {
  it("suppresses polite closure and coordination tails (Lumen Batch 3)", () => {
    expect(shouldSuppressContinueListForLastUserMessage("Thanks.")).toBe(true);
    expect(shouldSuppressContinueListForLastUserMessage("Tomorrow at 9 works.")).toBe(
      true
    );
    expect(
      shouldSuppressContinueListForLastUserMessage(
        "Send me the address when you can."
      )
    ).toBe(true);
  });

  it("does not suppress substantive emotional lines", () => {
    expect(
      shouldSuppressContinueListForLastUserMessage(
        "I still feel guilty about the slow reply."
      )
    ).toBe(false);
    expect(
      shouldSuppressContinueListForLastUserMessage(
        "I keep noticing rest still doesn't feel earned, like I'm not allowed to stop."
      )
    ).toBe(false);
  });

  it("Phase 6: does not suppress low-verbal Continue re-entry acks (yeah/mm)", () => {
    expect(shouldSuppressContinueListForLastUserMessage("yeah")).toBe(false);
    expect(shouldSuppressContinueListForLastUserMessage("mm")).toBe(false);
    expect(shouldSuppressContinueListForLastUserMessage("still there")).toBe(false);
  });

  it("Phase 6: still suppresses standalone polite ok / expanded shallow closures", () => {
    expect(shouldSuppressContinueListForLastUserMessage("ok")).toBe(true);
    expect(shouldSuppressContinueListForLastUserMessage("will do")).toBe(true);
    expect(shouldSuppressContinueListForLastUserMessage("no problem")).toBe(true);
  });

  it("Phase 8 (Lumen 2026-04-14): suppresses logistics / coordination deferral tails", () => {
    expect(
      shouldSuppressContinueListForLastUserMessage(
        "ok I will do it later today"
      )
    ).toBe(true);
    expect(
      shouldSuppressContinueListForLastUserMessage(
        "let us do phase 8 first and come back later"
      )
    ).toBe(true);
  });
});
