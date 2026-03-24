"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiKeyBanner } from "../ApiKeyBanner";
import { observationFetch } from "../obs-api";
import type { ObservationDailySummary } from "@/lib/milestone-h-observation/types";
import { DAILY_SUMMARY_CARDS } from "@/lib/milestone-h-observation/schema";

function ExportDownloadButton({
  date,
  format,
  label,
  benchmarkSet,
}: {
  date: string;
  format: "markdown" | "csv" | "json";
  label: string;
  benchmarkSet?: string;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      className="text-sm underline disabled:opacity-50"
      onClick={async () => {
        setBusy(true);
        try {
          const q = new URLSearchParams({
            date,
            format,
          });
          if (benchmarkSet?.trim()) {
            q.set("benchmarkSet", benchmarkSet.trim());
          }
          const res = await observationFetch(
            `/api/internal/h-observation/export?${q.toString()}`
          );
          if (!res.ok) {
            window.alert(await res.text());
            return;
          }
          const blob = await res.blob();
          const ext = format === "markdown" ? "md" : format;
          const benchSuffix =
            benchmarkSet?.trim()
              ? `-${benchmarkSet.trim().replace(/[^a-zA-Z0-9._-]+/g, "_")}`
              : "";
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = `h-observation-${date}${benchSuffix}.${ext}`;
          a.click();
          URL.revokeObjectURL(a.href);
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "…" : label}
    </button>
  );
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function HObservationSummaryPage() {
  const [date, setDate] = useState(todayUtc);
  const [benchmarkSet, setBenchmarkSet] = useState("");
  const [summary, setSummary] = useState<ObservationDailySummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    const q = new URLSearchParams({ date });
    if (benchmarkSet.trim()) {
      q.set("benchmarkSet", benchmarkSet.trim());
    }
    const res = await observationFetch(
      `/api/internal/h-observation/summary?${q.toString()}`
    );
    if (!res.ok) {
      setError(await res.text());
      setSummary(null);
      return;
    }
    const data = (await res.json()) as { summary: ObservationDailySummary };
    setSummary(data.summary);
  }, [date, benchmarkSet]);

  useEffect(() => {
    load();
  }, [load]);

  function formatCardValue(
    key: string,
    s: ObservationDailySummary
  ): string {
    const v = s[key as keyof ObservationDailySummary];
    if (typeof v !== "number") return String(v);
    const card = DAILY_SUMMARY_CARDS.find((c) => c.key === key);
    if (card?.format === "percent") return `${(v * 100).toFixed(1)}%`;
    return String(v);
  }

  return (
    <>
      <ApiKeyBanner />
      <p className="mb-4">
        <Link className="underline text-sm" href="/internal/h-observation/queue">
          ← Queue
        </Link>
      </p>
      <div className="flex flex-wrap items-end gap-3 mb-6">
        <label className="text-sm">
          Date (UTC day)
          <input
            type="date"
            className="mt-1 block rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="text-sm">
          benchmarkSet filter (optional)
          <input
            type="text"
            placeholder="e.g. lumen-daily-core-7 or __passive__"
            className="mt-1 block w-56 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1 font-mono text-xs"
            value={benchmarkSet}
            onChange={(e) => setBenchmarkSet(e.target.value)}
          />
        </label>
        <button
          type="button"
          className="rounded border border-neutral-400 px-3 py-1.5 text-sm dark:border-neutral-600"
          onClick={load}
        >
          Refresh
        </button>
        <ExportDownloadButton
          date={date}
          benchmarkSet={benchmarkSet}
          format="markdown"
          label="Download MD"
        />
        <ExportDownloadButton
          date={date}
          benchmarkSet={benchmarkSet}
          format="csv"
          label="Download CSV"
        />
        <ExportDownloadButton
          date={date}
          benchmarkSet={benchmarkSet}
          format="json"
          label="Download JSON"
        />
      </div>
      <p className="text-xs text-neutral-500 mb-4">
        Downloads use your saved API key. For curl: send{" "}
        <code className="rounded bg-black/5 px-1 dark:bg-white/10">x-h-observation-key</code>.
      </p>
      {error ? (
        <pre className="text-red-600 text-xs whitespace-pre-wrap mb-4">{error}</pre>
      ) : null}
      {!summary ? (
        <p className="text-sm text-neutral-500">No data</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DAILY_SUMMARY_CARDS.map((card) => (
            <div
              key={card.key}
              className="rounded border border-neutral-300 dark:border-neutral-600 p-3"
            >
              <p className="text-xs text-neutral-500">{card.label}</p>
              <p className="text-2xl font-semibold tabular-nums">
                {formatCardValue(String(card.key), summary)}
              </p>
            </div>
          ))}
        </div>
      )}
      <p className="mt-8 text-xs text-neutral-500 max-w-xl">
        Interpretation is human-owned. Target suppression ratio (no H / total) 70–85% is guidance from the Wisewave observation template — this UI only counts operator-entered logs.
      </p>
    </>
  );
}
