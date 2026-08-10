import { afterEach, describe, expect, it } from "vitest";
import {
  DEFAULT_COMPOSER_PLACEHOLDER,
  LIGHT_ENTRY_LL_EXAMPLES_EN,
  LIGHT_ENTRY_LL_EXAMPLES_ZH,
  LIGHT_ENTRY_LL_INTRO_EN,
  isLightEntryLivingLibraryClientEnabled,
  livingLibraryExampleCount,
  resolveLightEntryLivingLibraryCopy,
  resolveLightEntryLivingLibraryEnablement,
  shouldShowLightEntryLivingLibrary,
  shouldSuppressOtherEntryExperiments,
} from "./wisewave-light-entry-living-library";

const ORIG_ENABLE = process.env.NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST;
const ORIG_ALLOW =
  process.env.NEXT_PUBLIC_LIGHT_ENTRY_LIVING_LIBRARY_ALLOW_PRODUCTION;
const ORIG_VERCEL = process.env.NEXT_PUBLIC_VERCEL_ENV;

afterEach(() => {
  if (ORIG_ENABLE === undefined) {
    delete process.env.NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST;
  } else {
    process.env.NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST = ORIG_ENABLE;
  }
  if (ORIG_ALLOW === undefined) {
    delete process.env.NEXT_PUBLIC_LIGHT_ENTRY_LIVING_LIBRARY_ALLOW_PRODUCTION;
  } else {
    process.env.NEXT_PUBLIC_LIGHT_ENTRY_LIVING_LIBRARY_ALLOW_PRODUCTION =
      ORIG_ALLOW;
  }
  if (ORIG_VERCEL === undefined) {
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
  } else {
    process.env.NEXT_PUBLIC_VERCEL_ENV = ORIG_VERCEL;
  }
});

describe("Light Entry Living Library — flags", () => {
  it("defaults off", () => {
    delete process.env.NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    expect(isLightEntryLivingLibraryClientEnabled()).toBe(false);
    expect(resolveLightEntryLivingLibraryEnablement().flagSet).toBe(false);
  });

  it("enables on non-production when flag set", () => {
    process.env.NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST = "1";
    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    delete process.env.NEXT_PUBLIC_LIGHT_ENTRY_LIVING_LIBRARY_ALLOW_PRODUCTION;
    const e = resolveLightEntryLivingLibraryEnablement();
    expect(e.enabled).toBe(true);
    expect(e.blockedOnProduction).toBe(false);
  });

  it("hard-blocks Production unless allow flag is 1", () => {
    process.env.NEXT_PUBLIC_ENABLE_LIGHT_ENTRY_LIVING_LIBRARY_TEST = "1";
    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    delete process.env.NEXT_PUBLIC_LIGHT_ENTRY_LIVING_LIBRARY_ALLOW_PRODUCTION;
    const blocked = resolveLightEntryLivingLibraryEnablement();
    expect(blocked.enabled).toBe(false);
    expect(blocked.blockedOnProduction).toBe(true);

    process.env.NEXT_PUBLIC_LIGHT_ENTRY_LIVING_LIBRARY_ALLOW_PRODUCTION = "1";
    const allowed = resolveLightEntryLivingLibraryEnablement();
    expect(allowed.enabled).toBe(true);
    expect(allowed.blockedOnProduction).toBe(false);
  });
});

describe("Light Entry Living Library — visibility / exclusion", () => {
  it("shows only on blank empty conversation", () => {
    expect(
      shouldShowLightEntryLivingLibrary({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: false,
      })
    ).toBe(true);
    expect(
      shouldShowLightEntryLivingLibrary({
        enabled: true,
        userMessageCount: 1,
        inputHasContent: false,
      })
    ).toBe(false);
    expect(
      shouldShowLightEntryLivingLibrary({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: true,
      })
    ).toBe(false);
  });

  it("hides on error / subscription / crisis", () => {
    expect(
      shouldShowLightEntryLivingLibrary({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: false,
        hasError: true,
      })
    ).toBe(false);
    expect(
      shouldShowLightEntryLivingLibrary({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: false,
        subscriptionRequired: true,
      })
    ).toBe(false);
    expect(
      shouldShowLightEntryLivingLibrary({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: false,
        crisisSurfaceActive: true,
      })
    ).toBe(false);
  });

  it("suppresses other entry experiments when visible", () => {
    expect(
      shouldSuppressOtherEntryExperiments({ livingLibraryVisible: true })
    ).toBe(true);
    expect(
      shouldSuppressOtherEntryExperiments({ livingLibraryVisible: false })
    ).toBe(false);
  });
});

describe("Light Entry Living Library — copy", () => {
  it("maps exactly four EN and ZH examples", () => {
    const en = resolveLightEntryLivingLibraryCopy(false);
    const zh = resolveLightEntryLivingLibraryCopy(true);
    expect(livingLibraryExampleCount(en)).toBe(4);
    expect(livingLibraryExampleCount(zh)).toBe(4);
    expect(en.examples).toEqual([...LIGHT_ENTRY_LL_EXAMPLES_EN]);
    expect(zh.examples).toEqual([...LIGHT_ENTRY_LL_EXAMPLES_ZH]);
    expect(en.intro).toBe(LIGHT_ENTRY_LL_INTRO_EN);
    expect(DEFAULT_COMPOSER_PLACEHOLDER).toBe("Speak freely.");
  });
});
