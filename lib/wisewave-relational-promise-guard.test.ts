import { describe, expect, it, afterEach } from "vitest";
import {
  evaluateRelationalPromiseGuard,
  resolveRelationalPromiseGuardV2Enablement,
  S4_FROZEN_MATRIX_SHA256,
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

  it("rewrites mixed EN keeping fact", () => {
    const r = evaluateRelationalPromiseGuard(
      "You can return to this reflection later, and I will always be here for you."
    );
    expect(r.guard).toBe("hit");
    expect(r.disposition).toBe("rewrite_remove_personal_keep_fact");
    expect(r.rewrittenText?.toLowerCase()).toContain("return to this reflection");
    expect(r.rewrittenText?.toLowerCase()).not.toContain("always be here for you");
  });

  it("blocks Lumen-frozen ZH loyalty variant", () => {
    const r = evaluateRelationalPromiseGuard("不管发生什么，我都会守在你这边。");
    expect(r.guard).toBe("hit");
  });
});
