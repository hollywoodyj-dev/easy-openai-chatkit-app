/**
 * S5 local QA — Lumen §12.3 bidirectional pairs.
 * Every row is (user_message, assistant_candidate, source_context_flag).
 * Nova standing in for Lumen local-only. Not a frozen Lumen matrix. Not hosted.
 */
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it } from "vitest";
import { lintWisewaveOutput } from "@/lib/drift/linter";
import { hasHighSeverityDrift } from "@/lib/drift/score";
import { evaluateChatTurnSafety } from "@/lib/wisewave-chat-turn-boundary";
import {
  S5_EXAMPLE_B_EN,
  S5_EXAMPLE_B_USER_EN,
  evaluateEvidenceSourceValidator,
} from "@/lib/wisewave-evidence-source-validator";

type Row = {
  id: string;
  lang: "en" | "zh";
  user_message: string;
  assistant_candidate: string;
  source_context_flag: boolean;
  expect: "allow" | "block";
};

const MATRIX: Row[] = [
  {
    id: "S5-EN-01",
    lang: "en",
    user_message: S5_EXAMPLE_B_USER_EN,
    assistant_candidate: S5_EXAMPLE_B_EN,
    source_context_flag: true,
    expect: "allow",
  },
  {
    id: "S5-EN-02",
    lang: "en",
    user_message: "",
    assistant_candidate: S5_EXAMPLE_B_EN,
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-EN-03",
    lang: "en",
    user_message: "",
    assistant_candidate: "You have been trying hard for a long time.",
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-EN-04",
    lang: "en",
    user_message: "I have been trying hard for a long time.",
    assistant_candidate: "You have been trying hard for a long time.",
    source_context_flag: true,
    expect: "allow",
  },
  {
    id: "S5-EN-05",
    lang: "en",
    user_message: "",
    assistant_candidate: "You have been carrying this for years.",
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-EN-06",
    lang: "en",
    user_message: "",
    assistant_candidate: "You have been sitting with this all this time.",
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-EN-07",
    lang: "en",
    user_message: S5_EXAMPLE_B_USER_EN,
    assistant_candidate: "As you mentioned before, this has been sitting with you.",
    source_context_flag: true,
    expect: "block",
  },
  {
    id: "S5-EN-08",
    lang: "en",
    user_message: "hello",
    assistant_candidate: "Last time you were carrying this.",
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-EN-09",
    lang: "en",
    user_message: "hello",
    assistant_candidate: "I remember this pattern.",
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-ZH-01",
    lang: "zh",
    user_message: "我已经很努力了",
    assistant_candidate: "你一直很努力，却还是被说不够。",
    source_context_flag: true,
    expect: "allow",
  },
  {
    id: "S5-ZH-02",
    lang: "zh",
    user_message: "",
    assistant_candidate: "你一直很努力，却还是被说不够。",
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-ZH-03",
    lang: "zh",
    user_message: "",
    assistant_candidate: "你一直很努力这些年。",
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-ZH-04",
    lang: "zh",
    user_message: "这些年我一直很努力。",
    assistant_candidate: "你一直很努力这些年。",
    source_context_flag: true,
    expect: "allow",
  },
  {
    id: "S5-ZH-05",
    lang: "zh",
    user_message: "",
    assistant_candidate: "你一直以来都这样。",
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-ZH-06",
    lang: "zh",
    user_message: "我已经很努力了",
    assistant_candidate: "你上次说过这件事。",
    source_context_flag: true,
    expect: "block",
  },
  {
    id: "S5-ZH-07",
    lang: "zh",
    user_message: "hello",
    assistant_candidate: "我记得这件事。",
    source_context_flag: false,
    expect: "block",
  },
  {
    id: "S5-ZH-08",
    lang: "zh",
    user_message: "hello",
    assistant_candidate: "你之前提过这件事。",
    source_context_flag: false,
    expect: "block",
  },
];

describe("S5 local QA bidirectional matrix", () => {
  it("scores every (user, assistant, source_context_flag) pair", () => {
    const misses: string[] = [];
    for (const row of MATRIX) {
      const r = evaluateEvidenceSourceValidator({
        userMessage: row.user_message,
        assistantCandidate: row.assistant_candidate,
        sourceContextSupported: row.source_context_flag,
      });
      if (r.verdict !== row.expect) {
        misses.push(
          `${row.id} expected ${row.expect} got ${r.verdict} (${r.family})`
        );
      }
    }
    expect(misses).toEqual([]);
  });
});

describe("S5 local QA live-rule parity and wiring", () => {
  const origFlag = process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2;
  const origVercel = process.env.VERCEL_ENV;
  const origPublic = process.env.NEXT_PUBLIC_VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2;
    else process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2 = origFlag;
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
    if (origPublic === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = origPublic;
  });

  it("flag off: live you-have-been still high-severity (Production delta 0)", () => {
    delete process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2;
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    const live = lintWisewaveOutput(S5_EXAMPLE_B_EN);
    expect(hasHighSeverityDrift(live)).toBe(true);
    expect(
      evaluateChatTurnSafety({
        userMessage: S5_EXAMPLE_B_USER_EN,
        assistantMessage: S5_EXAMPLE_B_EN,
      }).shouldSuppress
    ).toBe(true);
    const rules = readFileSync("lib/drift/rules.ts", "utf8");
    expect(rules).toContain("\\byou have been\\b");
  });

  it("flag on: Example B emits; span and memory still suppress", () => {
    process.env.ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2 = "1";
    delete process.env.VERCEL_ENV;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    expect(
      evaluateChatTurnSafety({
        userMessage: S5_EXAMPLE_B_USER_EN,
        assistantMessage: S5_EXAMPLE_B_EN,
      }).shouldSuppress
    ).toBe(false);
    expect(
      evaluateChatTurnSafety({
        userMessage: "",
        assistantMessage: "You have been trying hard for a long time.",
      }).shouldSuppress
    ).toBe(true);
    expect(
      evaluateChatTurnSafety({
        userMessage: "我已经很努力了",
        assistantMessage: "你一直很努力，却还是被说不够。",
      }).shouldSuppress
    ).toBe(false);
    expect(
      evaluateChatTurnSafety({
        userMessage: "",
        assistantMessage: "你一直很努力这些年。",
      }).shouldSuppress
    ).toBe(true);
  });

  it("turn route exposes debug_s5_* and does not touch S3/S4/S6 flags", () => {
    const route = readFileSync("app/api/chat/turn/route.ts", "utf8");
    expect(route).toContain("debug_s5_evidence_source_validator_v2_enabled");
    expect(route).toContain("debug_s5_narrowed_present_perfect");
    expect(route).not.toContain("ENABLE_CONVERSATIONAL_WARMTH");
    expect(route).not.toContain("ENABLE_REFLECTION_CONTINUITY_V1");
  });
});
