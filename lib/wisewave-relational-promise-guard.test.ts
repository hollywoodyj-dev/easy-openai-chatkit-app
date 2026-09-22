import { describe, expect, it, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import {
  evaluateRelationalPromiseGuard,
  applyRelationalPromiseGuardV2,
  resolveRelationalPromiseGuardV2Enablement,
  preservesRequiredFact,
  hasDanglingConnector,
  S4_FROZEN_MATRIX_SHA256,
  S4_UNSEEN_PARAPHRASE_PROBES,
} from "./wisewave-relational-promise-guard";

describe("relational promise guard v2 enablement", () => {
  const origFlag = process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
  const origAllow = process.env.RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW;
  const origVercel = process.env.VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
    else process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = origFlag;
    if (origAllow === undefined) {
      delete process.env.RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW;
    } else {
      process.env.RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW = origAllow;
    }
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
  });

  it("defaults off", () => {
    delete process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
    delete process.env.VERCEL_ENV;
    expect(resolveRelationalPromiseGuardV2Enablement().enabled).toBe(false);
  });

  it("enables locally when flag set", () => {
    process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = "1";
    delete process.env.VERCEL_ENV;
    expect(resolveRelationalPromiseGuardV2Enablement().enabled).toBe(true);
  });

  it("hard-blocks Vercel production even with preview allow", () => {
    process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = "1";
    process.env.VERCEL_ENV = "production";
    process.env.RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW = "1";
    const e = resolveRelationalPromiseGuardV2Enablement();
    expect(e.enabled).toBe(false);
    expect(e.blockedOnProduction).toBe(true);
  });
});

describe("relational promise guard v2 matrix spot checks", () => {
  it("exports frozen matrix hash constant", () => {
    expect(S4_FROZEN_MATRIX_SHA256).toBe(
      "016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc"
    );
  });

  it("blocks personal loyalty EN", () => {
    const r = evaluateRelationalPromiseGuard("I am always here for you.");
    expect(r.guard).toBe("hit");
    expect(r.family).toBe("loyalty_presence");
  });

  it("allows product continuity EN", () => {
    const r = evaluateRelationalPromiseGuard("You can return to this reflection later.");
    expect(r.guard).toBe("miss");
  });

  it("rewrites mixed EN keeping fact without dangling comma", () => {
    const r = evaluateRelationalPromiseGuard(
      "You can return to this reflection later, and I will always be here for you."
    );
    expect(r.guard).toBe("hit");
    expect(r.disposition).toBe("rewrite_remove_personal_keep_fact");
    expect(r.family).toBe("mixed_factual_personal");
    expect(r.rewrittenText?.toLowerCase()).toContain("return to this reflection");
    expect(r.rewrittenText?.toLowerCase()).not.toContain("always be here for you");
    expect(r.rewrittenText).not.toMatch(/[,，]\s*$/);
    expect(preservesRequiredFact(r.rewrittenText, "You can return to this reflection later")).toBe(
      true
    );
    expect(evaluateRelationalPromiseGuard(r.rewrittenText || "").guard).toBe("miss");
  });

  it("classifies ZH recurring future as future_availability_attachment", () => {
    const r = evaluateRelationalPromiseGuard("以后每次心里发沉，你都可以来找我。");
    expect(r.guard).toBe("hit");
    expect(r.family).toBe("future_availability_attachment");
  });

  it("blocks Lumen-frozen ZH loyalty variant", () => {
    const r = evaluateRelationalPromiseGuard("不管发生什么，我都会守在你这边。");
    expect(r.guard).toBe("hit");
  });

  it("treats ZH user attribution as miss", () => {
    const r = evaluateRelationalPromiseGuard("用户说：我会一直陪着你。");
    expect(r.guard).toBe("miss");
    expect(r.debug.attributed_or_quoted).toBe(true);
  });

  it("fail-closes mixed when personal half cannot be cleanly removed", () => {
    const unsafe = "This reflection will remain available, and I will be right here.";
    const r = evaluateRelationalPromiseGuard(unsafe);
    expect(r.guard).toBe("hit");
    expect(r.family).toBe("mixed_factual_personal");
    if (r.rewrittenText) {
      expect(r.rewrittenText.toLowerCase()).not.toMatch(/right here/);
      expect(evaluateRelationalPromiseGuard(r.rewrittenText).guard).toBe("miss");
    } else {
      expect(r.disposition).toBe("block_or_rewrite");
    }
    process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = "1";
    delete process.env.VERCEL_ENV;
    const applied = applyRelationalPromiseGuardV2(unsafe);
    expect(applied.nextText === null || !/right here/i.test(applied.nextText || "")).toBe(
      true
    );
    if (applied.nextText) {
      expect(evaluateRelationalPromiseGuard(applied.nextText).guard).toBe("miss");
    }
  });

  it("hits ZH mixed with 守候 and does not persist personal half", () => {
    const r = evaluateRelationalPromiseGuard("这段反思会保留，而我也会守候着你。");
    expect(r.guard).toBe("hit");
    if (r.rewrittenText) {
      expect(r.rewrittenText).not.toContain("守候");
      expect(evaluateRelationalPromiseGuard(r.rewrittenText).guard).toBe("miss");
    }
  });

  it("rewrites ZH account mixed without dangling 而", () => {
    const r = evaluateRelationalPromiseGuard(
      "账户里会保留这段反思，而我会一直贴近你，陪你度过低谷。"
    );
    expect(r.guard).toBe("hit");
    expect(r.rewrittenText).toBeTruthy();
    expect(hasDanglingConnector(r.rewrittenText)).toBe(false);
    expect(r.rewrittenText).not.toMatch(/贴近|低谷/);
    expect(evaluateRelationalPromiseGuard(r.rewrittenText || "").guard).toBe("miss");
  });
});

describe("S4 compositional product exclusions", () => {
  it("allows reflection access-control wording", () => {
    const r = evaluateRelationalPromiseGuard(
      "No one else can access this reflection unless you share it."
    );
    expect(r.guard).toBe("miss");
  });

  it("allows account portability wording", () => {
    const r = evaluateRelationalPromiseGuard(
      "We will carry your account settings across devices."
    );
    expect(r.guard).toBe("miss");
  });

  it("allows browser runtime wording", () => {
    const r = evaluateRelationalPromiseGuard(
      "Wisewave will stay open in this browser for 30 days."
    );
    expect(r.guard).toBe("miss");
  });

  it("hits compositional presence without disclosed holdout literals", () => {
    // Wording distinct from committed holdout / Lumen representative strings.
    const r = evaluateRelationalPromiseGuard(
      "I mean to remain near you as this continues."
    );
    expect(r.guard).toBe("hit");
  });
});

describe("S4 unseen paraphrase regression (Lumen HOLD)", () => {
  it("has twelve probes", () => {
    expect(S4_UNSEEN_PARAPHRASE_PROBES).toHaveLength(12);
  });

  for (const probe of S4_UNSEEN_PARAPHRASE_PROBES) {
    it(`hits ${probe.id}`, () => {
      const r = evaluateRelationalPromiseGuard(probe.text);
      expect(r.guard).toBe("hit");
    });
  }
});

describe("S4 pre-persist fail-closed contract", () => {
  const origFlag = process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
  const origVercel = process.env.VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2;
    else process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = origFlag;
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
  });

  it("apply yields safe nextText (or null) before any store — unsafe original never selected", () => {
    process.env.ENABLE_RELATIONAL_PROMISE_GUARD_V2 = "1";
    delete process.env.VERCEL_ENV;
    const unsafe = "I am always here for you.";
    const applied = applyRelationalPromiseGuardV2(unsafe);
    expect(applied.enabled).toBe(true);
    expect(applied.result.guard).toBe("hit");
    // Suppress path: null means caller must persist fallback, not unsafe.
    expect(applied.nextText).toBeNull();
    const mixed = applyRelationalPromiseGuardV2(
      "You can return to this reflection later, and I will always be here for you."
    );
    expect(mixed.nextText).toBeTruthy();
    expect(mixed.nextText).not.toContain("always be here for you");
    expect(evaluateRelationalPromiseGuard(mixed.nextText || "").guard).toBe("miss");
  });

  it("turn route applies S4 before assistant message.create", () => {
    const route = fs.readFileSync(
      path.join(__dirname, "../app/api/chat/turn/route.ts"),
      "utf8"
    );
    const s4Idx = route.indexOf("S4 relational-promise guard — pre-persist");
    const assistantPersistIdx = route.indexOf(
      "V1: persist assistant message after successful generation"
    );
    expect(s4Idx).toBeGreaterThan(0);
    expect(assistantPersistIdx).toBeGreaterThan(s4Idx);
    // Must not rely on post-persist update for S4 (fail-open path removed).
    expect(route).not.toMatch(/S4 rewrite message update failed/);
    expect(route).not.toMatch(/S4 suppress message update failed/);
  });
});
