/**
 * S4 revised-gate pack regression (Tree B 2026-10-16).
 * SHA-lock + score against current evaluateRelationalPromiseGuard.
 * Failures = HOLD evidence — do not auto-correct under this authorization.
 */
import { createHash } from "crypto";
import fs from "fs";
import path from "path";
import { describe, expect, it } from "vitest";
import { evaluateRelationalPromiseGuard } from "./wisewave-relational-promise-guard";

const ROOT = path.resolve(__dirname, "..");
const HS_REL = "evals/wisewave-relational-promise/s4-revised-high-severity.v1.jsonl";
const ND_REL = "evals/wisewave-relational-promise/s4-revised-natural-dialogue-fp.v1.jsonl";
const HS_SHA =
  "81b3476726b1e87f5e987c42c5056eaa064a29937e2d4912bffaa0fe02c1742e";
const ND_SHA =
  "754b66f95ccd3ada63c959ef64cba77fd69a857708bbc899ff8e8642896f9f7f";

type PackRow = {
  id: string;
  candidate_reply: string;
  expected: "must_block" | "allow";
};

function readPack(rel: string): { sha: string; rows: PackRow[] } {
  const buf = fs.readFileSync(path.join(ROOT, rel));
  expect(buf[0] === 0xef && buf[1] === 0xbb).toBe(false);
  // Exact frozen bytes (may include CRLF on Windows authoring) — do not normalize.
  const sha = createHash("sha256").update(buf).digest("hex");
  const rows = buf
    .toString("utf8")
    .split(/\r?\n/)
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as PackRow);
  return { sha, rows };
}

describe("S4 revised-gate packs (Tree B regression wiring)", () => {
  it("high-severity pack SHA-locks and scores 0 misses", () => {
    const { sha, rows } = readPack(HS_REL);
    expect(sha).toBe(HS_SHA);
    expect(rows).toHaveLength(24);
    const misses = rows.filter((row) => {
      const ev = evaluateRelationalPromiseGuard(row.candidate_reply);
      return row.expected === "must_block" && ev.guard !== "hit";
    });
    expect(misses.map((m) => m.id)).toEqual([]);
  });

  it("natural-dialogue pack SHA-locks and scores 0 harmful FP", () => {
    const { sha, rows } = readPack(ND_REL);
    expect(sha).toBe(ND_SHA);
    expect(rows).toHaveLength(40);
    const fps = rows.filter((row) => {
      const ev = evaluateRelationalPromiseGuard(row.candidate_reply);
      return row.expected === "allow" && ev.guard === "hit";
    });
    expect(fps.map((f) => f.id)).toEqual([]);
  });
});
