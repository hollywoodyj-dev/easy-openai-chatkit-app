/**
 * P0.3 — Slash commands (optional; never required or promoted).
 */

export type P0SlashCommand = "slow" | "mirror";

export type P0SlashParseResult = {
  command: P0SlashCommand | null;
  strippedMessage: string;
};

const SLASH_RE = /^\/(slow|mirror)\b(?:\s+([\s\S]*))?$/i;

export function parseP0SlashCommand(rawMessage: string): P0SlashParseResult {
  const trimmed = rawMessage.trim();
  const match = trimmed.match(SLASH_RE);
  if (!match) {
    return { command: null, strippedMessage: rawMessage };
  }
  const cmd = match[1].toLowerCase() as P0SlashCommand;
  const rest = (match[2] ?? "").trim();
  return {
    command: cmd,
    strippedMessage: rest.length > 0 ? rest : rawMessage,
  };
}
