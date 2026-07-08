/**
 * P0 Reflection Entry — orchestrator (Slice 0: debug + system appendix behind flag).
 */

import { detectP0OpeningType, type P0OpeningType } from "@/lib/wisewave-p0-opening-detection";
import {
  hasP0AuthenticReflectionBegun,
  isP0EntryPhase,
  selectP0ReflectionMode,
  type P0ReflectionMode,
} from "@/lib/wisewave-p0-reflection-modes";
import { evaluateP0SafetyOverride } from "@/lib/wisewave-p0-safety-override";
import { parseP0SlashCommand, type P0SlashCommand } from "@/lib/wisewave-p0-slash-commands";

export const P0_REFLECTION_ENTRY_BUILD_MARKER = "p0_reflection_entry_v1_slice1";

export type P0ReflectionEntryEnablement = {
  /** Flag is on and runtime is allowed to execute P0 entry logic. */
  enabled: boolean;
  /** ENABLE_P0_REFLECTION_ENTRY is set to a truthy value. */
  flagSet: boolean;
  /** Vercel runtime label when present: production | preview | development */
  vercelEnv: string | null;
  /** Flag set on production but blocked until Slice 1 full sign-off. */
  blockedOnProduction: boolean;
};

/**
 * Slice 1 QA path: Preview (and local) only by default.
 * Production requires an explicit second key after full Lumen sign-off:
 * P0_REFLECTION_ENTRY_ALLOW_PRODUCTION=1
 */
export function resolveP0ReflectionEntryEnablement(): P0ReflectionEntryEnablement {
  const raw = process.env.ENABLE_P0_REFLECTION_ENTRY?.trim().toLowerCase();
  const flagSet = raw === "true" || raw === "1" || raw === "yes";
  const vercelEnv = process.env.VERCEL_ENV?.trim() || null;
  const blockedOnProduction =
    flagSet &&
    vercelEnv === "production" &&
    process.env.P0_REFLECTION_ENTRY_ALLOW_PRODUCTION?.trim() !== "1";

  return {
    enabled: flagSet && !blockedOnProduction,
    flagSet,
    vercelEnv,
    blockedOnProduction,
  };
}

export function isP0ReflectionEntryEnabled(): boolean {
  return resolveP0ReflectionEntryEnablement().enabled;
}

export type P0ReflectionEntryTurnInput = {
  userMessage: string;
  userTurnIndex: number;
  priorUserMessages: string[];
  wantsChinese: boolean;
};

export type P0ReflectionEntryTurnResult = {
  enabled: boolean;
  buildMarker: string;
  safetyOverride: boolean;
  safetyMatchedPattern: string | null;
  slashCommand: P0SlashCommand | null;
  openingType: P0OpeningType | null;
  openingConfidence: string | null;
  reflectionMode: P0ReflectionMode | null;
  entryPhase: boolean;
  reflectionBegun: boolean;
  modeApplied: boolean;
  modeCleared: boolean;
  systemAppendix: string;
};

export function computeP0ReflectionEntryTurn(
  input: P0ReflectionEntryTurnInput
): P0ReflectionEntryTurnResult {
  const base: P0ReflectionEntryTurnResult = {
    enabled: false,
    buildMarker: P0_REFLECTION_ENTRY_BUILD_MARKER,
    safetyOverride: false,
    safetyMatchedPattern: null,
    slashCommand: null,
    openingType: null,
    openingConfidence: null,
    reflectionMode: null,
    entryPhase: false,
    reflectionBegun: false,
    modeApplied: false,
    modeCleared: false,
    systemAppendix: "",
  };

  if (!isP0ReflectionEntryEnabled()) {
    return base;
  }

  const slash = parseP0SlashCommand(input.userMessage);
  const messageForDetection = slash.command ? slash.strippedMessage : input.userMessage;
  const safety = evaluateP0SafetyOverride({
    userMessage: messageForDetection,
    wantsChinese: input.wantsChinese,
  });

  const opening = detectP0OpeningType(messageForDetection);
  const entryPhase = isP0EntryPhase({
    userTurnIndex: input.userTurnIndex,
    priorUserMessages: input.priorUserMessages,
  });
  const reflectionBegun = hasP0AuthenticReflectionBegun({
    userMessage: messageForDetection,
    userTurnIndex: input.userTurnIndex,
    priorUserMessages: input.priorUserMessages,
  });

  const modeCleared = !entryPhase || reflectionBegun;

  let systemAppendix = "";
  let reflectionMode: P0ReflectionMode | null = null;
  let modeApplied = false;

  if (safety.triggered) {
    systemAppendix = safety.systemAppendix;
  } else if (entryPhase && !reflectionBegun) {
    const selected = selectP0ReflectionMode({
      openingType: opening.type,
      slashCommand: slash.command,
      wantsChinese: input.wantsChinese,
      priorUserMessages: input.priorUserMessages,
    });
    reflectionMode = selected.mode;
    systemAppendix = selected.appendix;
    modeApplied = true;
  }

  return {
    enabled: true,
    buildMarker: P0_REFLECTION_ENTRY_BUILD_MARKER,
    safetyOverride: safety.triggered,
    safetyMatchedPattern: safety.matchedPattern ?? null,
    slashCommand: slash.command,
    openingType: opening.type,
    openingConfidence: opening.confidence,
    reflectionMode,
    entryPhase,
    reflectionBegun,
    modeApplied,
    modeCleared,
    systemAppendix,
  };
}
