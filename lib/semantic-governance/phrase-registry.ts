import registryJson from "./phrase-registry.json";

export type SemanticLayer =
  | "identity"
  | "misclassification_boundary"
  | "category"
  | "discovery";

export type DistortionFlag =
  | "assistant_drift"
  | "therapy_drift"
  | "coaching_drift"
  | "productivity_drift"
  | "emotional_support_drift";

export type ApprovalState =
  | "approved"
  | "experimental"
  | "escalated"
  | "rejected";

export type PhraseRegistryEntry = {
  phrase: string;
  layer: SemanticLayer;
  allowed_surfaces: string[];
  prohibited_surfaces: string[];
  distortion_flags: DistortionFlag[];
  owner: string;
  approval_state: ApprovalState;
  review: string | null;
  pairing_required?: boolean;
  notes?: string;
};

export type PhraseRegistry = {
  version: string;
  updated: string;
  entries: PhraseRegistryEntry[];
};

export const phraseRegistry = registryJson as PhraseRegistry;

export function getRegistryEntries(): PhraseRegistryEntry[] {
  return phraseRegistry.entries;
}

export function getEntriesByLayer(
  layer: SemanticLayer,
): PhraseRegistryEntry[] {
  return phraseRegistry.entries.filter((e) => e.layer === layer);
}

export function getIdentityAnchorPhrases(): string[] {
  return getEntriesByLayer("identity")
    .filter((e) => e.approval_state === "approved")
    .map((e) => e.phrase);
}

export function getMisclassificationBoundaryPhrases(): string[] {
  return getEntriesByLayer("misclassification_boundary")
    .filter((e) => e.approval_state === "approved")
    .map((e) => e.phrase);
}

export function getCategoryBridgePhrases(): PhraseRegistryEntry[] {
  return getEntriesByLayer("category");
}

export function getDiscoveryPhrases(): PhraseRegistryEntry[] {
  return getEntriesByLayer("discovery");
}

export function getEscalatedEntries(): PhraseRegistryEntry[] {
  return phraseRegistry.entries.filter((e) => e.approval_state === "escalated");
}

export function getRejectedEntries(): PhraseRegistryEntry[] {
  return phraseRegistry.entries.filter((e) => e.approval_state === "rejected");
}

export function getExpiredExperimentalEntries(
  asOf: Date = new Date(),
): PhraseRegistryEntry[] {
  return phraseRegistry.entries.filter((e) => {
    if (e.approval_state !== "experimental" || !e.review) return false;
    return new Date(e.review) < asOf;
  });
}

export function findRegistryEntryByPhrase(
  phrase: string,
): PhraseRegistryEntry | undefined {
  const lower = phrase.toLowerCase();
  return phraseRegistry.entries.find(
    (e) => e.phrase.toLowerCase() === lower,
  );
}

/** Case-insensitive substring check for an approved identity anchor. */
export function textContainsIdentityAnchor(text: string): boolean {
  const lower = text.toLowerCase();
  return getIdentityAnchorPhrases().some((anchor) =>
    lower.includes(anchor.toLowerCase()),
  );
}

/** Case-insensitive check for Reflection AI (category bridge). */
export function textContainsReflectionAi(text: string): boolean {
  return /reflection\s+ai/i.test(text);
}

export function textContainsCategoryOrDiscoveryPhrase(text: string): boolean {
  const lower = text.toLowerCase();
  return phraseRegistry.entries
    .filter((e) => e.layer === "category" || e.layer === "discovery")
    .some((e) => lower.includes(e.phrase.toLowerCase()));
}
