import { describe, expect, it } from "vitest";
import { isContinueReentryContinuationUtterance } from "@/lib/wisewave-continue-reentry-turn";

describe("isContinueReentryContinuationUtterance", () => {
  it("matches short acks and residue echoes", () => {
    expect(isContinueReentryContinuationUtterance("mm")).toBe(true);
    expect(isContinueReentryContinuationUtterance("Yeah, it's still there.")).toBe(true);
    expect(isContinueReentryContinuationUtterance("still there")).toBe(true);
    expect(isContinueReentryContinuationUtterance("not really")).toBe(true);
    expect(isContinueReentryContinuationUtterance("I guess")).toBe(true);
  });

  it("rejects topic pivots and long turns", () => {
    expect(
      isContinueReentryContinuationUtterance("Separate question: what is DNS?")
    ).toBe(false);
    expect(
      isContinueReentryContinuationUtterance(
        "I want to switch completely — I've been thinking about moving jobs and whether I'm running away."
      )
    ).toBe(false);
  });
});
