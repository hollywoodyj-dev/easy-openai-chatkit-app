import { afterEach, describe, expect, it } from "vitest";
import {
  P1_1_FIRST_QUESTION_INVITATION_EN,
  P1_INTERACTION_LEGIBILITY_EXAMPLES_EN,
  P1_INTERACTION_LEGIBILITY_OPENING_EN,
  isP1InteractionLegibilityClientEnabled,
  resolveP1InteractionLegibilityCopy,
  resolveP1InteractionLegibilityEnablement,
  shouldShowP1InteractionLegibility,
  shouldSuppressP0PermissionForLegibility,
} from "@/lib/wisewave-p1-interaction-legibility";

describe("P1 Interaction Legibility preview slice", () => {
  const origFlag = process.env.NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY;
  const origAllow = process.env.NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION;
  const origVercel = process.env.NEXT_PUBLIC_VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY;
    else process.env.NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY = origFlag;
    if (origAllow === undefined) delete process.env.NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION;
    else process.env.NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION = origAllow;
    if (origVercel === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = origVercel;
  });

  it("defaults off when flag unset", () => {
    delete process.env.NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY;
    expect(isP1InteractionLegibilityClientEnabled()).toBe(false);
  });

  it("enables on preview when flag set", () => {
    process.env.NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY = "1";
    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    expect(resolveP1InteractionLegibilityEnablement()).toMatchObject({
      enabled: true,
      flagSet: true,
      blockedOnProduction: false,
    });
  });

  it("blocks production unless allow key set", () => {
    process.env.NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY = "1";
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    expect(resolveP1InteractionLegibilityEnablement().enabled).toBe(false);
    expect(resolveP1InteractionLegibilityEnablement().blockedOnProduction).toBe(true);
    process.env.NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION = "1";
    expect(resolveP1InteractionLegibilityEnablement().enabled).toBe(true);
  });

  it("shows only on empty thread before typing or first expression", () => {
    expect(
      shouldShowP1InteractionLegibility({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: false,
      })
    ).toBe(true);
    expect(
      shouldShowP1InteractionLegibility({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: true,
      })
    ).toBe(false);
    expect(
      shouldShowP1InteractionLegibility({
        enabled: true,
        userMessageCount: 1,
        inputHasContent: false,
      })
    ).toBe(false);
    expect(
      shouldShowP1InteractionLegibility({
        enabled: false,
        userMessageCount: 0,
        inputHasContent: false,
      })
    ).toBe(false);
  });

  it("maps EN/ZH copy without P1.1 invitation line", () => {
    const en = resolveP1InteractionLegibilityCopy(false);
    expect(en.opening).toBe(P1_INTERACTION_LEGIBILITY_OPENING_EN);
    expect(en.examples).toEqual([...P1_INTERACTION_LEGIBILITY_EXAMPLES_EN]);
    expect(en.examples.join(" ")).not.toContain("ask one question");

    const zh = resolveP1InteractionLegibilityCopy(true);
    expect(zh.opening).toContain("开始");
    expect(zh.examples.length).toBe(4);
    expect(P1_1_FIRST_QUESTION_INVITATION_EN).toContain("ask one question first");
  });

  it("suppresses duplicate P0 permission when legibility visible", () => {
    expect(shouldSuppressP0PermissionForLegibility({ legibilityVisible: true })).toBe(true);
    expect(shouldSuppressP0PermissionForLegibility({ legibilityVisible: false })).toBe(false);
  });
});
