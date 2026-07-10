/**
 * Neutral fallback for drift-linter high-severity suppression.
 *
 * When the drift linter blanks a generated reply, the turn must still leave
 * something in the conversation — an empty stored message renders as an empty
 * bubble on reload (real-user export 2026-07-08 showed two of these in first
 * sessions). The EN line reuses the already-shipped client placeholder from
 * `app/chat/page.tsx` so no new public copy is introduced; the ZH line is its
 * minimal parity rendering. Both must pass the drift linter (see test).
 */
export function getDriftSuppressionFallback(wantsChinese: boolean): string {
  return wantsChinese
    ? "有些东西似乎还在这里。你可以一句一句慢慢说。"
    : "Something here still feels present. You can stay with it one line at a time.";
}
