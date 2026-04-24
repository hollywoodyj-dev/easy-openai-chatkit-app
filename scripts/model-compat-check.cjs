#!/usr/bin/env node
"use strict";

const DEFAULT_MODEL_BY_CAPABILITY = {
  chat_turn: "gpt-5.4",
  chat_summary: "gpt-5.4",
  reflection_checkpoint: "gpt-5.4",
  reflection_extract: "gpt-5.4",
};

const DEPRECATED_MODEL_INFO = {
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

const FINETUNED_DEPRECATED_BASES = [
  { basePrefix: "gpt-3.5-turbo", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "gpt-4.1-nano", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "babbage-002", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "davinci-002", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "o4-mini-2025-04-16", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
  { basePrefix: "gpt-4", info: { shutdownOn: "2026-10-23", reason: "finetuned_family_deprecation" } },
];

function parseMode() {
  const arg = process.argv.find((v) => v.startsWith("--mode="));
  const mode = (arg ? arg.split("=")[1] : process.env.OPENAI_MODEL_DEPRECATION_MODE || "warn")
    .trim()
    .toLowerCase();
  return mode === "block" ? "block" : "warn";
}

function normalizeSlug(model) {
  return String(model || "").trim().toLowerCase();
}

function parseFineTuneBase(model) {
  const slug = normalizeSlug(model);
  if (!slug.startsWith("ft:")) return null;
  const rest = slug.slice(3);
  const idx = rest.indexOf(":");
  return idx >= 0 ? rest.slice(0, idx) : rest;
}

function getDeprecationInfo(model) {
  const normalized = normalizeSlug(model);
  if (DEPRECATED_MODEL_INFO[normalized]) return DEPRECATED_MODEL_INFO[normalized];
  const base = parseFineTuneBase(normalized);
  if (!base) return null;
  const hit = FINETUNED_DEPRECATED_BASES.find((entry) => base.startsWith(entry.basePrefix));
  return hit ? hit.info : null;
}

function resolveSelection(capability) {
  const envKey = `OPENAI_MODEL_${capability.toUpperCase()}`;
  const fromCapability = process.env[envKey];
  if (typeof fromCapability === "string" && fromCapability.trim()) {
    return { model: fromCapability.trim(), source: envKey };
  }
  const fromShared = process.env.OPENAI_CHAT_MODEL;
  if (typeof fromShared === "string" && fromShared.trim()) {
    return { model: fromShared.trim(), source: "OPENAI_CHAT_MODEL" };
  }
  return { model: DEFAULT_MODEL_BY_CAPABILITY[capability], source: "default" };
}

function buildReport() {
  const capabilities = Object.keys(DEFAULT_MODEL_BY_CAPABILITY).map((capability) => {
    const selected = resolveSelection(capability);
    const deprecation = getDeprecationInfo(selected.model);
    return {
      capability,
      model: selected.model,
      source: selected.source,
      deprecated: !!deprecation,
      shutdownOn: deprecation ? deprecation.shutdownOn : null,
      reason: deprecation ? deprecation.reason : null,
    };
  });
  return {
    generatedAt: new Date().toISOString(),
    mode: parseMode(),
    hasDeprecated: capabilities.some((c) => c.deprecated),
    capabilities,
  };
}

const report = buildReport();
console.log(JSON.stringify(report, null, 2));

if (report.mode === "block" && report.hasDeprecated) {
  process.exitCode = 2;
}

