import { describe, expect, it, afterEach, beforeEach } from "vitest";
import {
  abandonBeaconAlreadyFired,
  countUserMessages,
  isP0ReflectionEntryClientEnabled,
  markAbandonBeaconFired,
  markP0ExitInvitationShown,
  P0_EXIT_INVITED_ONCE_KEY,
  P0_SAW_ABANDON_SIGNAL_KEY,
  resolveP0EmptyStateCopy,
  shouldFireP0AbandonBeacon,
  shouldShowP0ExitInvitation,
  shouldSuppressPerceptionOnEmptyThread,
  shouldUseP0EmptyThread,
} from "@/lib/wisewave-p0-early-exit";

function installSessionStorageMock(): void {
  const store = new Map<string, string>();
  const sessionStorageMock = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
  Object.defineProperty(globalThis, "sessionStorage", {
    value: sessionStorageMock,
    configurable: true,
  });
}

describe("wisewave-p0-early-exit", () => {
  const orig = process.env.NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY;

  beforeEach(() => {
    installSessionStorageMock();
  });

  afterEach(() => {
    if (orig === undefined) delete process.env.NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY;
    else process.env.NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY = orig;
    sessionStorage.clear();
  });

  it("detects client flag", () => {
    delete process.env.NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY;
    expect(isP0ReflectionEntryClientEnabled()).toBe(false);
    process.env.NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY = "1";
    expect(isP0ReflectionEntryClientEnabled()).toBe(true);
  });

  it("uses empty thread when P0 on and no loaded messages", () => {
    process.env.NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY = "1";
    expect(shouldUseP0EmptyThread(0)).toBe(true);
    expect(shouldUseP0EmptyThread(2)).toBe(false);
  });

  it("suppresses perception on empty user thread", () => {
    process.env.NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY = "1";
    expect(shouldSuppressPerceptionOnEmptyThread(0)).toBe(true);
    expect(shouldSuppressPerceptionOnEmptyThread(1)).toBe(false);
  });

  it("counts user messages only", () => {
    expect(
      countUserMessages([
        { role: "assistant" },
        { role: "user" },
        { role: "user" },
      ])
    ).toBe(2);
  });

  it("gates abandon beacon", () => {
    process.env.NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY = "1";
    expect(
      shouldFireP0AbandonBeacon({
        conversationId: "sess-1",
        userMessageCount: 0,
        userHasTyped: false,
      })
    ).toBe(true);
    expect(
      shouldFireP0AbandonBeacon({
        conversationId: "sess-1",
        userMessageCount: 1,
        userHasTyped: false,
      })
    ).toBe(false);
  });

  it("dedupes abandon beacon per conversation in sessionStorage", () => {
    markAbandonBeaconFired("sess-a");
    expect(abandonBeaconAlreadyFired("sess-a")).toBe(true);
    expect(abandonBeaconAlreadyFired("sess-b")).toBe(false);
    expect(sessionStorage.getItem(P0_SAW_ABANDON_SIGNAL_KEY)).toBe("true");
  });

  it("shows exit invitation once after abandon signal", () => {
    sessionStorage.setItem(P0_SAW_ABANDON_SIGNAL_KEY, "true");
    expect(shouldShowP0ExitInvitation()).toBe(true);
    markP0ExitInvitationShown();
    expect(shouldShowP0ExitInvitation()).toBe(false);
    expect(sessionStorage.getItem(P0_EXIT_INVITED_ONCE_KEY)).toBe("true");
  });

  it("resolves EN/ZH copy", () => {
    expect(resolveP0EmptyStateCopy(false).permission).toContain("anywhere");
    expect(resolveP0EmptyStateCopy(true).permission).toContain("开始");
  });
});
