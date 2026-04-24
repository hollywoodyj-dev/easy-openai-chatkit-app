type WisewaveModelCapability =
  | "chat_turn"
  | "chat_summary"
  | "reflection_checkpoint"
  | "reflection_extract";

const DEFAULT_MODEL_BY_CAPABILITY: Record<WisewaveModelCapability, string> = {
  chat_turn: "gpt-5.4",
  chat_summary: "gpt-5.4",
  reflection_checkpoint: "gpt-5.4",
  reflection_extract: "gpt-5.4",
};

type DeprecationInfo = {
  shutdownOn: "2026-07-23" | "2026-10-23";
  reason: "model_deprecation" | "finetuned_family_deprecation";
};

const DEPRECATED_MODEL_INFO: Record<string, DeprecationInfo> = {
  "computer-use-preview-2025-03-11": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-4o-audio-preview-2024-12-17": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-4o-mini-audio-preview-2024-12-17": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-4o-mini-realtime-preview-2024-12-17": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-4o-mini-search-preview-2025-03-11": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-4o-mini-tts-2025-03-20": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-4o-search-preview-2025-03-11": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-5-chat-latest": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-5-codex": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-5.1-chat-latest": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-5.1-codex": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-5.1-codex-max": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-5.2-codex": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-5.1-codex-mini": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-audio-mini-2025-10-06": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "gpt-realtime-mini-2025-10-06": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "o3-deep-research-2025-06-26": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "o4-mini-deep-research-2025-06-26": { shutdownOn: "2026-07-23", reason: "model_deprecation" },
  "text-embedding-3-small": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "gpt-3.5-turbo-0125": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "gpt-4-0613": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "gpt-4-1106-preview": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "gpt-4-turbo": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "gpt-4.1-nano": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "gpt-4o-2024-05-13": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "gpt-image-1": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "o1-2024-12-17": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "o1-pro-2025-03-19": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "o3-mini-2025-01-31": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
  "o4-mini-2025-04-16": { shutdownOn: "2026-10-23", reason: "model_deprecation" },
};

const FINETUNED_DEPRECATED_BASES: Array<{
  basePrefix: string;
  info: DeprecationInfo;
}> = [
  { basePrefix: "gpt-3.5-turbo", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "gpt-4.1-nano", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "babbage-002", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "davinci-002", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "o4-mini-2025-04-16", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "gpt-4", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
];

const warnedDeprecated = new Set<string>();

function envKeyForCapability(capability: WisewaveModelCapability): string {
  return `OPENAI_MODEL_${capability.toUpperCase()}`;
}

function firstNonEmpty(keys: readonly string[]): { value: string; key: string } | null {
  for (const key of keys) {
    const raw = process.env[key];
    if (typeof raw === "string" && raw.trim()) {
      return { value: raw.trim(), key };
    }
  }
  return null;
}

function normalizeSlug(model: string): string {
  return model.trim().toLowerCase();
}

function parseFineTuneBase(model: string): string | null {
  const slug = normalizeSlug(model);
  if (!slug.startsWith("ft:")) return null;
  const rest = slug.slice(3);
  const idx = rest.indexOf(":");
  return idx >= 0 ? rest.slice(0, idx) : rest;
}

function getDeprecationInfo(model: string): DeprecationInfo | null {
  const normalized = normalizeSlug(model);
  if (DEPRECATED_MODEL_INFO[normalized]) {
    return DEPRECATED_MODEL_INFO[normalized];
  }
  const fineTuneBase = parseFineTuneBase(normalized);
  if (!fineTuneBase) return null;
  const hit = FINETUNED_DEPRECATED_BASES.find((entry) =>
    fineTuneBase.startsWith(entry.basePrefix)
  );
  return hit?.info ?? null;
}

function resolveSelection(
  capability: WisewaveModelCapability
): { model: string; source: string } {
  const fromEnv = firstNonEmpty([envKeyForCapability(capability), "OPENAI_CHAT_MODEL"]);
  if (fromEnv) {
    return { model: fromEnv.value, source: fromEnv.key };
  }
  return { model: DEFAULT_MODEL_BY_CAPABILITY[capability], source: "default" };
}

function deprecationMode(): "warn" | "block" {
  const mode = (process.env.OPENAI_MODEL_DEPRECATION_MODE ?? "").trim().toLowerCase();
  return mode === "block" ? "block" : "warn";
}

export function getWisewaveModelCompatibilityReport() {
  const capabilities = (Object.keys(DEFAULT_MODEL_BY_CAPABILITY) as WisewaveModelCapability[]).map(
    (capability) => {
      const selected = resolveSelection(capability);
      const deprecation = getDeprecationInfo(selected.model);
      return {
        capability,
        model: selected.model,
        source: selected.source,
        deprecated: !!deprecation,
        shutdownOn: deprecation?.shutdownOn ?? null,
        reason: deprecation?.reason ?? null,
      };
    }
  );
  return {
    generatedAt: new Date().toISOString(),
    deprecationMode: deprecationMode(),
    hasDeprecated: capabilities.some((item) => item.deprecated),
    capabilities,
  };
}

export function resolveWisewaveModel(capability: WisewaveModelCapability): string {
  const selected = resolveSelection(capability);
  const deprecation = getDeprecationInfo(selected.model);

  if (deprecationMode() === "block" && deprecation) {
    throw new Error(
      `Deprecated OpenAI model configured for ${capability}: ${selected.model} (shutdown ${deprecation.shutdownOn})`
    );
  }

  if (deprecation && !warnedDeprecated.has(selected.model)) {
    warnedDeprecated.add(selected.model);
    console.warn("[wisewave-model-router] deprecated_model_selected", {
      capability,
      model: selected.model,
      source: selected.source,
      shutdownOn: deprecation.shutdownOn,
      mode: deprecationMode(),
    });
  }

  return selected.model;
}

