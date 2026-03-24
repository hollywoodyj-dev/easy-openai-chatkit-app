"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiKeyBanner } from "../ApiKeyBanner";
import { observationFetch } from "../obs-api";
import type { ObservationQueueItem } from "@/lib/milestone-h-observation/types";

const CUSTOM_QUEUE_EXAMPLE = `{
  "items": [
    {
      "language": "en",
      "conversationType": "reflective",
      "signalStrength": "medium",
      "previewText": "Why does it always feel like I have to prove myself before I can relax?",
      "fullInput": "Why does it always feel like I have to prove myself before I can relax?",
      "tags": ["benchmark", "daily-core", "wisewave-quality", "prove-myself"],
      "benchmarkSet": "lumen-daily-core-7",
      "benchmarkCaseId": "daily-01",
      "benchmarkLayer": "daily-7",
      "observationMilestone": "H",
      "suiteName": "Milestone H daily core 7",
      "runLabel": "Lumen daily core",
      "runOwner": "Lumen"
    }
  ]
}`;

export default function HObservationQueuePage() {
  const [items, setItems] = useState<ObservationQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [benchFilter, setBenchFilter] = useState("");
  const [customJson, setCustomJson] = useState(CUSTOM_QUEUE_EXAMPLE);
  const [showCustomPanel, setShowCustomPanel] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const q = new URLSearchParams();
    if (benchFilter.trim()) q.set("benchmarkSet", benchFilter.trim());
    const qs = q.toString();
    const res = await observationFetch(
      `/api/internal/h-observation/queue${qs ? `?${qs}` : ""}`
    );
    if (!res.ok) {
      setError(await res.text());
      setItems([]);
    } else {
      const data = (await res.json()) as { items: ObservationQueueItem[] };
      setItems(data.items ?? []);
    }
    setLoading(false);
  }, [benchFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function submitCustomRows() {
    setBusy(true);
    setError(null);
    let body: unknown;
    try {
      body = JSON.parse(customJson);
    } catch {
      setError("Custom JSON: invalid JSON");
      setBusy(false);
      return;
    }
    const res = await observationFetch(
      "/api/internal/h-observation/queue/custom",
      { method: "POST", body: JSON.stringify(body) }
    );
    if (!res.ok) setError(await res.text());
    else await load();
    setBusy(false);
  }

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
        <label className="flex flex-col text-xs text-neutral-600 dark:text-neutral-400">
          Filter benchmarkSet
          <input
            type="text"
            placeholder="set id, or __passive__ for non-benchmark rows"
            className="mt-0.5 w-64 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1 font-mono text-xs"
            value={benchFilter}
            onChange={(e) => setBenchFilter(e.target.value)}
          />
        </label>
        <button
          type="button"
          disabled={busy}
          className="rounded border border-neutral-400 px-3 py-1.5 text-sm dark:border-neutral-600"
          onClick={load}
        >
          Apply filter
        </button>
        <button
          type="button"
          disabled={busy}
          className="rounded border border-neutral-400 px-3 py-1.5 text-sm dark:border-neutral-600"
          onClick={async () => {
            setLoading(true);
            setError(null);
            const q = new URLSearchParams({ status: "completed" });
            if (benchFilter.trim()) q.set("benchmarkSet", benchFilter.trim());
            const res = await observationFetch(
              `/api/internal/h-observation/queue?${q.toString()}`
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
        <button
          type="button"
          disabled={busy}
          className="rounded border border-violet-500 px-3 py-1.5 text-sm text-violet-800 dark:text-violet-200"
          onClick={() => setShowCustomPanel((v) => !v)}
        >
          {showCustomPanel ? "Hide" : "Show"} custom benchmark rows
        </button>
      </div>
      {showCustomPanel ? (
        <section className="mb-6 rounded border border-violet-300 bg-violet-50/80 p-3 dark:border-violet-800 dark:bg-violet-950/30">
          <p className="text-sm font-medium text-violet-950 dark:text-violet-100 mb-1">
            POST body for{" "}
            <code className="text-xs">/api/internal/h-observation/queue/custom</code>
          </p>
          <p className="text-xs text-violet-900/80 dark:text-violet-200/80 mb-2">
            Provide <code>items[]</code> with exact <code>fullInput</code> / <code>previewText</code> and{" "}
            <code>benchmarkSet</code> + <code>benchmarkCaseId</code> (or explicit <code>caseId</code>).
            Upserts by derived <code>caseId</code> so re-posting the same suite updates rows.
          </p>
          <textarea
            className="w-full min-h-[220px] font-mono text-xs rounded border border-violet-200 dark:border-violet-900 p-2 bg-white dark:bg-neutral-900"
            value={customJson}
            onChange={(e) => setCustomJson(e.target.value)}
          />
          <button
            type="button"
            disabled={busy}
            className="mt-2 rounded bg-violet-700 px-3 py-1.5 text-white text-sm disabled:opacity-50"
            onClick={submitCustomRows}
          >
            Submit custom rows
          </button>
        </section>
      ) : null}
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
                <th className="py-2 pr-2">Benchmark</th>
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
                const isBenchmark =
                  row.sourceType === "benchmark" || Boolean(row.benchmarkSet);
                return (
                <tr
                  key={row.caseId}
                  className="border-b border-neutral-200 dark:border-neutral-800 align-top"
                >
                  <td className="py-2 pr-2 font-mono text-xs whitespace-nowrap">
                    {row.caseId}
                  </td>
                  <td className="py-2 pr-2">{row.sourceType}</td>
                  <td className="py-2 pr-2 max-w-[140px] text-xs font-mono break-all">
                    {row.benchmarkSet ? (
                      <span title={row.benchmarkCaseId ?? ""}>
                        {row.benchmarkSet}
                        {row.benchmarkCaseId ? (
                          <span className="block text-neutral-500">
                            {row.benchmarkCaseId}
                          </span>
                        ) : null}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
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
                    ) : isBenchmark ? (
                      <span className="inline-block rounded bg-violet-100 px-2 py-0.5 text-xs text-violet-900 dark:bg-violet-900/40 dark:text-violet-200">
                        Benchmark QA
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
