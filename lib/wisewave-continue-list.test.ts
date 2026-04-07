import { describe, expect, it } from "vitest";
import { CONTINUE_LIST_MAX, pickContinueOptions } from "@/lib/wisewave-continue-list";

function row(
  id: string,
  label: string,
  updatedAtMs: number
): { id: string; label: string; updatedAt: Date } {
  return { id, label, updatedAt: new Date(updatedAtMs) };
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
      row("c", "not quite settled yet", 1_000),
    ]);
    expect(picked.length).toBe(2);
  });

  it("filters weak residue-style headlines", () => {
    const picked = pickContinueOptions([
      row("a", "Something still here.", 2_000),
      row("b", "not quite settled yet", 1_000),
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
});
