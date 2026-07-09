/**
 * P0.6 — Early exit detection (client; one invitation max; no retention).
 */

export const P0_EARLY_EXIT_IDLE_MS = 90_000;
export const P0_EXIT_INVITED_ONCE_KEY = "p0_exit_invited_once";
export const P0_SAW_ABANDON_SIGNAL_KEY = "p0_saw_abandon_signal";
export const P0_ABANDON_BEACON_PREFIX = "p0_abandon_beacon:";

export const P0_PERMISSION_EMPTY_EN = "You can begin anywhere.";
export const P0_PERMISSION_EMPTY_ZH = "你可以从任何地方开始。";

export const P0_EXIT_INVITE_EN = "Whenever you're ready, you can begin with one line.";
export const P0_EXIT_INVITE_ZH = "你准备好了的时候，用一句话开始就可以。";

export function isP0ReflectionEntryClientEnabled(): boolean {
  const raw = process.env.NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY?.trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes";
}

export function p0EmptyThreadMessages(): [] {
  return [];
}

export function shouldUseP0EmptyThread(
  loadedMessageCount: number,
  p0Enabled = isP0ReflectionEntryClientEnabled()
): boolean {
  return p0Enabled && loadedMessageCount === 0;
}

export function countUserMessages(
  messages: ReadonlyArray<{ role: string }>
): number {
  return messages.filter((m) => m.role === "user").length;
}

export function shouldSuppressPerceptionOnEmptyThread(
  userMessageCount: number,
  p0Enabled = isP0ReflectionEntryClientEnabled()
): boolean {
  return p0Enabled && userMessageCount === 0;
}

export function abandonBeaconStorageKey(conversationId: string): string {
  return `${P0_ABANDON_BEACON_PREFIX}${conversationId}`;
}

export function abandonBeaconAlreadyFired(conversationId: string): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(abandonBeaconStorageKey(conversationId)) === "true";
}

export function markAbandonBeaconFired(conversationId: string): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(abandonBeaconStorageKey(conversationId), "true");
  sessionStorage.setItem(P0_SAW_ABANDON_SIGNAL_KEY, "true");
}

export function shouldShowP0ExitInvitation(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  if (sessionStorage.getItem(P0_EXIT_INVITED_ONCE_KEY) === "true") return false;
  return sessionStorage.getItem(P0_SAW_ABANDON_SIGNAL_KEY) === "true";
}

export function markP0ExitInvitationShown(): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(P0_EXIT_INVITED_ONCE_KEY, "true");
}

export function resolveP0EmptyStateCopy(wantsChinese: boolean): {
  permission: string;
  exitInvitation: string;
} {
  return wantsChinese
    ? { permission: P0_PERMISSION_EMPTY_ZH, exitInvitation: P0_EXIT_INVITE_ZH }
    : { permission: P0_PERMISSION_EMPTY_EN, exitInvitation: P0_EXIT_INVITE_EN };
}

export function shouldFireP0AbandonBeacon(args: {
  conversationId: string | undefined;
  userMessageCount: number;
  userHasTyped: boolean;
  p0Enabled?: boolean;
}): boolean {
  const enabled = args.p0Enabled ?? isP0ReflectionEntryClientEnabled();
  if (!enabled) return false;
  if (!args.conversationId) return false;
  if (args.userMessageCount > 0 || args.userHasTyped) return false;
  if (abandonBeaconAlreadyFired(args.conversationId)) return false;
  return true;
}
