"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiKeyBanner } from "../ApiKeyBanner";
import { observationFetch } from "../obs-api";
import type { ObservationQueueItem } from "@/lib/milestone-h-observation/types";

export default function HObservationQueuePage() {
  const [items, setItems] = useState<ObservationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await observationFetch("/api/internal/h-observation/queue");
    if (!res.ok) {
      setError(await res.text());
      setItems([]);
    } else {
      const data = (await res.json()) as { items: ObservationQueueItem[] };
      setItems(data.items ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function generateBatch() {
    setBusy(true);
    setError(null);
    const res = await observationFetch("/api/internal/h-observation/queue", {
      method: "POST",
      body: JSON.stringify({ targetCount: 4 }),
    });
    if (!res.ok) setError(await res.text());
    else await load();
    setBusy(false);
  }

  async function setStatus(caseId: string, reviewStatus: ObservationQueueItem["reviewStatus"]) {
    setBusy(true);
    const res = await observationFetch(
      `/api/internal/h-observation/queue/${encodeURIComponent(caseId)}`,
      { method: "PATCH", body: JSON.stringify({ reviewStatus }) }
    );
    if (!res.ok) setError(await res.text());
    else await load();
    setBusy(false);
  }

  return (
    <>
      <ApiKeyBanner />
      <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3">
        First pass tip: start with rows marked <span className="font-medium">Recommended first pass</span> (scenario + non-placeholder).
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          disabled={busy}
          className="rounded bg-blue-600 px-3 py-1.5 text-white text-sm disabled:opacity-50"
          onClick={generateBatch}
        >
          Generate queue (hourly batch ~4)
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded border border-neutral-400 px-3 py-1.5 text-sm dark:border-neutral-600"
          onClick={load}
        >
          Refresh
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded border border-neutral-400 px-3 py-1.5 text-sm dark:border-neutral-600"
          onClick={async () => {
            setLoading(true);
            setError(null);
            const res = await observationFetch(
              "/api/internal/h-observation/queue?status=completed"
            );
            if (!res.ok) {
              setError(await res.text());
              setItems([]);
            } else {
              const data = (await res.json()) as {
                items: ObservationQueueItem[];
              };
              setItems(data.items ?? []);
            }
            setLoading(false);
          }}
        >
          Load completed
        </button>
      </div>
      {error ? (
        <pre className="text-red-600 text-xs whitespace-pre-wrap mb-4">{error}</pre>
      ) : null}
      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No queue items. Run generate, or add{" "}
          <code className="rounded bg-black/5 px-1 dark:bg-white/10">data/h-observation/real-samples.json</code>.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-neutral-300 dark:border-neutral-600">
                <th className="py-2 pr-2">Case ID</th>
                <th className="py-2 pr-2">Source</th>
                <th className="py-2 pr-2">Lang</th>
                <th className="py-2 pr-2">Type</th>
                <th className="py-2 pr-2">Signal</th>
                <th className="py-2 pr-2">Preview</th>
                <th className="py-2 pr-2">Status</th>
                <th className="py-2 pr-2">Hint</th>
                <th className="py-2 pr-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => {
                const isPlaceholder = (row.tags ?? []).includes("placeholder");
                const recommendedFirstPass =
                  row.sourceType === "scenario" && !isPlaceholder;
                return (
                <tr
                  key={row.caseId}
                  className="border-b border-neutral-200 dark:border-neutral-800 align-top"
                >
                  <td className="py-2 pr-2 font-mono text-xs whitespace-nowrap">
                    {row.caseId}
                  </td>
                  <td className="py-2 pr-2">{row.sourceType}</td>
                  <td className="py-2 pr-2">{row.language}</td>
                  <td className="py-2 pr-2">{row.conversationType}</td>
                  <td className="py-2 pr-2">{row.signalStrength}</td>
                  <td className="py-2 pr-2 max-w-md text-neutral-700 dark:text-neutral-300">
                    {row.previewText}
                  </td>
                  <td className="py-2 pr-2">{row.reviewStatus}</td>
                  <td className="py-2 pr-2">
                    {recommendedFirstPass ? (
                      <span className="inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                        Recommended first pass
                      </span>
                    ) : isPlaceholder ? (
                      <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                        Placeholder sample
                      </span>
                    ) : null}
                  </td>
                  <td className="py-2 pr-2 whitespace-nowrap">
                    <Link
                      className="underline mr-2"
                      href={`/internal/h-observation/review/${encodeURIComponent(row.caseId)}`}
                    >
                      Open
                    </Link>
                    <button
                      type="button"
                      className="underline mr-2 text-xs"
                      disabled={busy}
                      onClick={() => setStatus(row.caseId, "in_review")}
                    >
                      In review
                    </button>
                    <button
                      type="button"
                      className="underline mr-2 text-xs"
                      disabled={busy}
                      onClick={() => setStatus(row.caseId, "skipped")}
                    >
                      Skip
                    </button>
                    <button
                      type="button"
                      className="underline text-xs"
                      disabled={busy}
                      onClick={() => setStatus(row.caseId, "completed")}
                    >
                      Complete
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
