import { afterEach, describe, expect, it } from "vitest";
import {
  ENTRY_V2_BODY_EN,
  ENTRY_V2_BODY_ZH,
  ENTRY_V2_HEADLINE_EN,
  ENTRY_V2_HEADLINE_ZH,
  S1_ENTRY_COPY_V2_BUILD_MARKER,
  isS1EntryCopyV2ClientEnabled,
  resolveEntryCopyV2,
  resolveS1EntryCopyV2Enablement,
  shouldShowEntryCopyV2,
  shouldSuppressSiblingEntrySurfaces,
} from "@/lib/wisewave-entry-copy-v2";

describe("S1 Entry copy v2", () => {
  const origFlag = process.env.NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2;
  const origAllow = process.env.NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_HOSTED_PREVIEW;
  const origPublicVercel = process.env.NEXT_PUBLIC_VERCEL_ENV;
  const origVercel = process.env.VERCEL_ENV;

  afterEach(() => {
    if (origFlag === undefined) delete process.env.NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2;
    else process.env.NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2 = origFlag;
    if (origAllow === undefined) {
      delete process.env.NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_HOSTED_PREVIEW;
    } else {
      process.env.NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_HOSTED_PREVIEW = origAllow;
    }
    if (origPublicVercel === undefined) delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    else process.env.NEXT_PUBLIC_VERCEL_ENV = origPublicVercel;
    if (origVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = origVercel;
  });

  it("defaults off", () => {
    delete process.env.NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2;
    delete process.env.NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_HOSTED_PREVIEW;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.VERCEL_ENV;
    expect(isS1EntryCopyV2ClientEnabled()).toBe(false);
  });

  it("enables locally; Preview needs allow key; Production stays hard-blocked", () => {
    process.env.NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2 = "1";
    delete process.env.NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_HOSTED_PREVIEW;
    delete process.env.NEXT_PUBLIC_VERCEL_ENV;
    delete process.env.VERCEL_ENV;
    expect(resolveS1EntryCopyV2Enablement().enabled).toBe(true);

    process.env.NEXT_PUBLIC_VERCEL_ENV = "preview";
    expect(resolveS1EntryCopyV2Enablement().enabled).toBe(false);
    expect(resolveS1EntryCopyV2Enablement().blockedOnPreview).toBe(true);

    process.env.NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_HOSTED_PREVIEW = "1";
    expect(resolveS1EntryCopyV2Enablement().enabled).toBe(true);
    expect(resolveS1EntryCopyV2Enablement().blockedOnPreview).toBe(false);
    expect(resolveS1EntryCopyV2Enablement().allowHostedPreviewSet).toBe(true);

    process.env.NEXT_PUBLIC_VERCEL_ENV = "production";
    expect(resolveS1EntryCopyV2Enablement().enabled).toBe(false);
    expect(resolveS1EntryCopyV2Enablement().blockedOnProduction).toBe(true);
    expect(S1_ENTRY_COPY_V2_BUILD_MARKER).toBe("s1_entry_copy_v2_internal");
  });

  it("locks ENTRY_V2 byte-for-byte including curly quotes", () => {
    expect(ENTRY_V2_HEADLINE_EN).toBe("You do not need a clear question.");
    expect(ENTRY_V2_BODY_EN).toBe(
      "You can begin with what is on your mind, what you are feeling, something that happened, or simply, “I don’t know.”"
    );
    expect(ENTRY_V2_BODY_EN).toContain("\u201C");
    expect(ENTRY_V2_BODY_EN).toContain("\u2019");
    expect(ENTRY_V2_BODY_EN).toContain("\u201D");
    expect(ENTRY_V2_HEADLINE_ZH).toBe("你不需要先想清楚要问什么。");
    expect(ENTRY_V2_BODY_ZH).toBe(
      "可以从此刻放在心上的事、正在感受到的、发生过的一件事，或只是一句“我不知道”开始。"
    );
    expect(resolveEntryCopyV2(false)).toEqual({
      headline: ENTRY_V2_HEADLINE_EN,
      body: ENTRY_V2_BODY_EN,
    });
    expect(JSON.stringify(resolveEntryCopyV2(false))).not.toContain("examples");
  });

  it("shows only on empty thread before typing, and suppresses sibling entry surfaces", () => {
    expect(
      shouldShowEntryCopyV2({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: false,
      })
    ).toBe(true);
    expect(
      shouldShowEntryCopyV2({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: true,
      })
    ).toBe(false);
    expect(
      shouldShowEntryCopyV2({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: false,
        firstQuestionActivated: true,
      })
    ).toBe(false);
    expect(shouldSuppressSiblingEntrySurfaces({ s1Enabled: true })).toBe(true);
    expect(shouldSuppressSiblingEntrySurfaces({ s1Enabled: false })).toBe(false);
  });

  it("does not treat S2 as a sibling surface", () => {
    expect(
      shouldShowEntryCopyV2({
        enabled: true,
        userMessageCount: 0,
        inputHasContent: false,
        firstQuestionActivated: false,
      })
    ).toBe(true);
    expect(shouldSuppressSiblingEntrySurfaces({ s1Enabled: true })).toBe(true);
  });
});
