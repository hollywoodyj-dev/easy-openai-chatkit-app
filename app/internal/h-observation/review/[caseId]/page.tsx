"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ApiKeyBanner } from "../../ApiKeyBanner";
import { observationFetch } from "../../obs-api";
import type {
  ObservationResponseSnapshot,
  ObservationReviewCase,
  ObservationReviewLog,
  Reviewer,
  CueType,
  SuppressionCheck,
  SuppressionFlag,
  RemovalResult,
  RemovalConclusion,
  TurnWeight,
  Noticeability,
  Verdict,
  WouldCaseHaveFailedWithoutLinter,
} from "@/lib/milestone-h-observation/types";

const REVIEWERS: Reviewer[] = ["Lumen", "Tree", "Wisewave", "Other"];
const CUE_TYPES: CueType[] = ["H1", "H3", "H4", "H5", "none"];
const SUPP_CHECK: SuppressionCheck[] = ["yes", "no", "unclear"];
const SUPP_FLAG: SuppressionFlag[] = ["none", "over_emission", "under_emission"];
const REMOVAL_RES: RemovalResult[] = ["better", "same", "worse"];
const REMOVAL_CONC: RemovalConclusion[] = ["remove", "should_remove", "keep"];
const TURN_W: TurnWeight[] = [
  "lighter",
  "same",
  "slightly_heavier",
  "clearly_heavier",
];
const NOTICE: Noticeability[] = [
  "not_noticeable",
  "slightly_noticeable",
  "clearly_noticeable",
];
const VERDICTS: Verdict[] = ["pass", "revise", "remove"];
const WOULD_CASE_FAILED: WouldCaseHaveFailedWithoutLinter[] = [
  "yes",
  "likely",
  "unclear",
  "no",
];

type ReducedSnapshotInput = {
  fullResponseText: string;
  mainReflection?: string;
  awarenessCue?: string | null;
};

function defaultLog(caseId: string): ObservationReviewLog {
  const now = new Date();
  return {
    caseId,
    reviewer: "Lumen",
    reviewedAt: now.toISOString(),
    hAppeared: false,
    cueType: "none",
    positionCorrect: true,
    shouldHaveBeenSuppressed: "no",
    suppressionFlag: "none",
    guidanceDrift: false,
    interpretiveDrift: false,
    authorityDrift: false,
    weightDrift: false,
    duplicationDrift: false,
    removalResult: "same",
    removalConclusion: "keep",
    turnWeight: "same",
    hNoticeability: "not_noticeable",
    ePresent: false,
    fPresent: false,
    hCompetesWithEorF: false,

    // Post-linter tracking (human-filled)
    linterFired: false,
    hSuppressedByLinter: false,
    wouldCaseHaveFailedWithoutLinter: "unclear",
    wasHExpectedHere: false,

    verdict: "pass",
    reasonShort: "",
    notesOptional: "",
  };
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function extractReducedSnapshot(input: unknown): ReducedSnapshotInput {
  const src =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  const fullResponseText =
    asString(src.fullResponseText) ??
    asString(src.full_response_text) ??
    asString(src.response) ??
    asString(src.assistantResponse) ??
    asString(src.assistant_response) ??
    asString(src.message) ??
    asString(src.output_text) ??
    "";

  const mainReflection =
    asString(src.mainReflection) ??
    asString(src.main_reflection) ??
    asString(src.reflection) ??
    asString(src.mainReply) ??
    asString(src.main_reply);

  const awarenessCueRaw =
    asString(src.awarenessCue) ??
    asString(src.awareness_cue) ??
    null;

  return {
    fullResponseText,
    mainReflection,
    awarenessCue: awarenessCueRaw,
  };
}

export default function HObservationReviewPage() {
  const params = useParams();
  const router = useRouter();
  const rawCaseId = params?.caseId;
  const caseId = decodeURIComponent(
    typeof rawCaseId === "string" ? rawCaseId : Array.isArray(rawCaseId) ? rawCaseId[0] ?? "" : ""
  );
  const [data, setData] = useState<ObservationReviewCase | null>(null);
  const [log, setLog] = useState<ObservationReviewLog | null>(null);
  const [snapshotJson, setSnapshotJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [draftPreview, setDraftPreview] = useState("");
  const [draftFull, setDraftFull] = useState("");

  const load = useCallback(async () => {
    if (!caseId) return;
    setError(null);
    const res = await observationFetch(
      `/api/internal/h-observation/case/${encodeURIComponent(caseId)}`
    );
    if (!res.ok) {
      setError(await res.text());
      setData(null);
      return;
    }
    const c = (await res.json()) as ObservationReviewCase;
    setData(c);
    setDraftPreview(c.queueItem.previewText);
    setDraftFull(c.queueItem.fullInput ?? c.queueItem.previewText);
    setLog(c.reviewLog ?? defaultLog(caseId));
    setSnapshotJson(
      c.responseSnapshot
        ? JSON.stringify(c.responseSnapshot, null, 2)
        : JSON.stringify(
            {
              mainReflection: "",
              fullResponseText: "",
              awarenessCue: "",
              recurrenceCue: "",
              embodimentCue: "",
            } satisfies Partial<ObservationResponseSnapshot>,
            null,
            2
          )
    );
  }, [caseId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setLog((prev) => {
      if (!prev || prev.hAppeared) return prev;
      return {
        ...prev,
        cueType: "none",
        // Position semantics only apply when H appears.
        positionCorrect: true,
      };
    });
  }, [log?.hAppeared]);

  function patchLog<K extends keyof ObservationReviewLog>(
    key: K,
    value: ObservationReviewLog[K]
  ) {
    setLog((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  /** PUT snapshot from editor. Returns false if save failed (caller should stop). */
  async function persistSnapshotFromEditor(): Promise<boolean> {
    if (!caseId) return true;
    let snapshot: ObservationResponseSnapshot;
    try {
      snapshot = JSON.parse(snapshotJson) as ObservationResponseSnapshot;
    } catch {
      return true; // invalid JSON — do not block review submit
    }
    const text = snapshot.fullResponseText;
    if (typeof text !== "string" || !text.trim()) {
      return true; // nothing to persist
    }
    const res = await observationFetch(
      `/api/internal/h-observation/snapshot/${encodeURIComponent(caseId)}`,
      { method: "PUT", body: JSON.stringify(snapshot) }
    );
    if (!res.ok) {
      setError(await res.text());
      return false;
    }
    return true;
  }

  async function savePromptDrafts() {
    if (!caseId || !data) return;
    setBusy(true);
    setError(null);
    const res = await observationFetch(
      `/api/internal/h-observation/queue/${encodeURIComponent(caseId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          previewText: draftPreview,
          fullInput: draftFull,
        }),
      }
    );
    if (!res.ok) setError(await res.text());
    else await load();
    setBusy(false);
  }

  async function saveSnapshot() {
    if (!caseId) return;
    setBusy(true);
    setError(null);
    let snapshot: ObservationResponseSnapshot;
    try {
      snapshot = JSON.parse(snapshotJson) as ObservationResponseSnapshot;
    } catch {
      setError("Snapshot JSON invalid");
      setBusy(false);
      return;
    }
    const res = await observationFetch(
      `/api/internal/h-observation/snapshot/${encodeURIComponent(caseId)}`,
      { method: "PUT", body: JSON.stringify(snapshot) }
    );
    if (!res.ok) setError(await res.text());
    else await load();
    setBusy(false);
  }

  function reduceSnapshotJsonFromRawObject() {
    setError(null);
    try {
      const parsed = JSON.parse(snapshotJson) as unknown;
      const reduced = extractReducedSnapshot(parsed);
      if (!reduced.fullResponseText) {
        setError(
          "Could not find fullResponseText in the raw object. Add it manually in reduced JSON."
        );
      }
      setSnapshotJson(JSON.stringify(reduced, null, 2));
    } catch {
      setError("Snapshot JSON invalid");
    }
  }

  async function submitReview(force?: boolean) {
    if (!log) return;
    setBusy(true);
    setError(null);
    const snapOk = await persistSnapshotFromEditor();
    if (!snapOk) {
      setBusy(false);
      return;
    }
    const q = force ? "?force=1" : "";
    const res = await observationFetch(
      `/api/internal/h-observation/review${q}`,
      { method: "POST", body: JSON.stringify(log) }
    );
    if (!res.ok) {
      const t = await res.text();
      setError(t);
    } else {
      router.push("/internal/h-observation/queue");
    }
    setBusy(false);
  }

  if (!caseId) return <p className="text-sm">Missing case id</p>;

  return (
    <>
      <ApiKeyBanner />
      <p className="mb-2">
        <Link className="underline text-sm" href="/internal/h-observation/queue">
          ← Queue
        </Link>
      </p>
      {error ? (
        <pre className="text-red-600 text-xs whitespace-pre-wrap mb-4">{error}</pre>
      ) : null}
      {!data ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : (
        <div className="space-y-6 max-w-4xl">
          {(data.queueItem.benchmarkSet ||
            data.queueItem.sourceType === "benchmark") && (
            <section className="rounded border border-violet-300 bg-violet-50 p-3 text-xs text-violet-950 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-100">
              <p className="font-semibold">Benchmark / exact QA row</p>
              <dl className="mt-1 grid gap-1 sm:grid-cols-2">
                {data.queueItem.benchmarkSet ? (
                  <>
                    <dt className="text-violet-800/80 dark:text-violet-200/80">
                      benchmarkSet
                    </dt>
                    <dd className="font-mono">{data.queueItem.benchmarkSet}</dd>
                  </>
                ) : null}
                {data.queueItem.benchmarkCaseId ? (
                  <>
                    <dt className="text-violet-800/80 dark:text-violet-200/80">
                      benchmarkCaseId
                    </dt>
                    <dd className="font-mono">{data.queueItem.benchmarkCaseId}</dd>
                  </>
                ) : null}
                {data.queueItem.benchmarkLayer ? (
                  <>
                    <dt className="text-violet-800/80 dark:text-violet-200/80">
                      benchmarkLayer
                    </dt>
                    <dd className="font-mono">{data.queueItem.benchmarkLayer}</dd>
                  </>
                ) : null}
                {data.queueItem.observationMilestone ? (
                  <>
                    <dt className="text-violet-800/80 dark:text-violet-200/80">
                      milestone
                    </dt>
                    <dd className="font-mono">{data.queueItem.observationMilestone}</dd>
                  </>
                ) : null}
                {data.queueItem.suiteName ? (
                  <>
                    <dt className="text-violet-800/80 dark:text-violet-200/80">
                      suiteName
                    </dt>
                    <dd>{data.queueItem.suiteName}</dd>
                  </>
                ) : null}
                {data.queueItem.runLabel ? (
                  <>
                    <dt className="text-violet-800/80 dark:text-violet-200/80">
                      runLabel
                    </dt>
                    <dd>{data.queueItem.runLabel}</dd>
                  </>
                ) : null}
                {data.queueItem.runAt ? (
                  <>
                    <dt className="text-violet-800/80 dark:text-violet-200/80">
                      runAt
                    </dt>
                    <dd className="font-mono">{data.queueItem.runAt}</dd>
                  </>
                ) : null}
                {data.queueItem.runOwner ? (
                  <>
                    <dt className="text-violet-800/80 dark:text-violet-200/80">
                      owner
                    </dt>
                    <dd>{data.queueItem.runOwner}</dd>
                  </>
                ) : null}
              </dl>
              <p className="mt-2 text-violet-900/90 dark:text-violet-100/90">
                The text below is the <strong>exact</strong> queue payload for this case
                (no generator substitution).
              </p>
            </section>
          )}
          <section className="rounded border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
            <p className="font-medium">First-run flow (recommended)</p>
            <ol className="list-decimal pl-4 mt-1 space-y-0.5">
              <li>Pick a <code>scenario</code> row first on Queue.</li>
              <li>Run the raw input in <code>/chat</code>.</li>
              <li>Paste a reduced snapshot JSON here.</li>
              <li>
                <strong>Submit log</strong> auto-saves the snapshot when JSON is valid and{" "}
                <code>fullResponseText</code> is non-empty. Use <strong>Save snapshot</strong>{" "}
                to persist without submitting yet.
              </li>
              <li>Complete and submit the structured review log.</li>
            </ol>
          </section>
          <section>
            <h2 className="font-medium text-sm mb-1">
              Exact prompt under test (raw input)
            </h2>
            {(data.queueItem.reviewStatus === "queued" ||
              data.queueItem.reviewStatus === "in_review") && (
              <div className="mb-3 space-y-2">
                <label className="block text-xs text-neutral-600 dark:text-neutral-400">
                  previewText (list preview)
                  <textarea
                    className="mt-1 w-full min-h-[56px] font-mono text-xs rounded border border-neutral-300 dark:border-neutral-600 p-2 bg-white dark:bg-neutral-900"
                    value={draftPreview}
                    onChange={(e) => setDraftPreview(e.target.value)}
                  />
                </label>
                <label className="block text-xs text-neutral-600 dark:text-neutral-400">
                  fullInput (exact user message to run in /chat)
                  <textarea
                    className="mt-1 w-full min-h-[120px] font-mono text-xs rounded border border-neutral-300 dark:border-neutral-600 p-2 bg-white dark:bg-neutral-900"
                    value={draftFull}
                    onChange={(e) => setDraftFull(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  disabled={busy}
                  className="rounded border border-neutral-400 px-3 py-1 text-sm dark:border-neutral-600"
                  onClick={savePromptDrafts}
                >
                  Save prompt to queue row
                </button>
                <p className="text-xs text-neutral-500">
                  Only <code>queued</code> / <code>in_review</code> rows can be edited.
                  Completed cases are read-only for evidence integrity.
                </p>
              </div>
            )}
            {(data.queueItem.reviewStatus === "completed" ||
              data.queueItem.reviewStatus === "skipped") && (
              <pre className="text-xs whitespace-pre-wrap rounded border border-neutral-300 dark:border-neutral-600 p-3 bg-neutral-50 dark:bg-neutral-900/50">
                {data.queueItem.fullInput ?? data.queueItem.previewText}
              </pre>
            )}
          </section>

          <section>
            <h2 className="font-medium text-sm mb-1">
              Response snapshot (reduced JSON, not full /chat response object)
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
              Expected minimal shape:
            </p>
            <pre className="text-xs whitespace-pre-wrap rounded border border-neutral-300 dark:border-neutral-600 p-2 bg-neutral-50 dark:bg-neutral-900/50 mb-2">{`{
  "fullResponseText": "...",
  "mainReflection": "...",
  "awarenessCue": null
}`}</pre>
            <textarea
              className="w-full min-h-[160px] font-mono text-xs rounded border border-neutral-300 dark:border-neutral-600 p-2 bg-white dark:bg-neutral-900"
              value={snapshotJson}
              onChange={(e) => setSnapshotJson(e.target.value)}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                className="rounded border border-neutral-400 px-3 py-1 text-sm dark:border-neutral-600"
                onClick={saveSnapshot}
              >
                Save snapshot
              </button>
              <button
                type="button"
                disabled={busy}
                className="rounded border border-blue-500 px-3 py-1 text-sm text-blue-700 dark:text-blue-300"
                onClick={reduceSnapshotJsonFromRawObject}
              >
                Auto-extract reduced snapshot from raw object
              </button>
            </div>
            {data.responseSnapshot ? (
              <p className="text-xs text-neutral-500 mt-1">
                debug H:{" "}
                {String(data.responseSnapshot.debugMilestoneHEnabled)} —{" "}
                {data.responseSnapshot.debugMilestoneHSuppressedReason ?? "—"}
              </p>
            ) : null}
          </section>

          {log ? (
            <section className="rounded border border-neutral-300 dark:border-neutral-600 p-4 space-y-3">
              <h2 className="font-medium">Structured review log</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Reviewer
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.reviewer}
                    onChange={(e) =>
                      patchLog("reviewer", e.target.value as Reviewer)
                    }
                  >
                    {REVIEWERS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  Reviewed at (ISO)
                  <input
                    type="text"
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1 font-mono text-xs"
                    value={log.reviewedAt}
                    onChange={(e) => patchLog("reviewedAt", e.target.value)}
                  />
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={log.hAppeared}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      patchLog("hAppeared", checked);
                      if (!checked) {
                        patchLog("cueType", "none");
                        patchLog("positionCorrect", true);
                      }
                    }}
                  />
                  H appeared
                </label>
                <label className="text-sm">
                  Cue type
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.cueType}
                    onChange={(e) =>
                      patchLog("cueType", e.target.value as CueType)
                    }
                  >
                    {CUE_TYPES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={log.positionCorrect}
                    disabled={!log.hAppeared}
                    onChange={(e) =>
                      patchLog("positionCorrect", e.target.checked)
                    }
                  />
                  <span className={!log.hAppeared ? "text-neutral-400" : ""}>
                    Position correct {!log.hAppeared ? "(N/A when H = No)" : ""}
                  </span>
                </label>
                <label className="text-sm">
                  Should have been suppressed?
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.shouldHaveBeenSuppressed}
                    onChange={(e) =>
                      patchLog(
                        "shouldHaveBeenSuppressed",
                        e.target.value as SuppressionCheck
                      )
                    }
                  >
                    {SUPP_CHECK.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  Suppression flag
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.suppressionFlag}
                    onChange={(e) =>
                      patchLog("suppressionFlag", e.target.value as SuppressionFlag)
                    }
                  >
                    {SUPP_FLAG.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={log.linterFired}
                    onChange={(e) => patchLog("linterFired", e.target.checked)}
                  />
                  Linter fired
                </label>

                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={log.hSuppressedByLinter}
                    onChange={(e) =>
                      patchLog("hSuppressedByLinter", e.target.checked)
                    }
                  />
                  H suppressed by linter
                </label>

                <label className="text-sm flex items-center gap-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={log.wasHExpectedHere}
                    onChange={(e) => patchLog("wasHExpectedHere", e.target.checked)}
                  />
                  Was H expected here (baseline)
                </label>

                <label className="text-sm sm:col-span-2">
                  Would case have failed without linter?
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.wouldCaseHaveFailedWithoutLinter}
                    onChange={(e) =>
                      patchLog(
                        "wouldCaseHaveFailedWithoutLinter",
                        e.target.value as WouldCaseHaveFailedWithoutLinter
                      )
                    }
                  >
                    {WOULD_CASE_FAILED.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                {(
                  [
                    ["guidanceDrift", "Guidance drift"],
                    ["interpretiveDrift", "Interpretive drift"],
                    ["authorityDrift", "Authority drift"],
                    ["weightDrift", "Weight drift"],
                    ["duplicationDrift", "Duplication drift"],
                  ] as const
                ).map(([k, label]) => (
                  <label key={k} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={log[k]}
                      onChange={(e) => patchLog(k, e.target.checked)}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Removal result
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.removalResult}
                    onChange={(e) =>
                      patchLog("removalResult", e.target.value as RemovalResult)
                    }
                  >
                    {REMOVAL_RES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  Removal conclusion
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.removalConclusion}
                    onChange={(e) =>
                      patchLog(
                        "removalConclusion",
                        e.target.value as RemovalConclusion
                      )
                    }
                  >
                    {REMOVAL_CONC.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  Turn weight
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.turnWeight}
                    onChange={(e) =>
                      patchLog("turnWeight", e.target.value as TurnWeight)
                    }
                  >
                    {TURN_W.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  H noticeability
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.hNoticeability}
                    onChange={(e) =>
                      patchLog("hNoticeability", e.target.value as Noticeability)
                    }
                  >
                    {NOTICE.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={log.ePresent}
                    onChange={(e) => patchLog("ePresent", e.target.checked)}
                  />
                  E present
                </label>
                <label className="text-sm flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={log.fPresent}
                    onChange={(e) => patchLog("fPresent", e.target.checked)}
                  />
                  F present
                </label>
                <label className="text-sm flex items-center gap-2 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={log.hCompetesWithEorF}
                    onChange={(e) =>
                      patchLog("hCompetesWithEorF", e.target.checked)
                    }
                  />
                  H competes with E or F
                </label>
                <label className="text-sm">
                  Verdict
                  <select
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.verdict}
                    onChange={(e) =>
                      patchLog("verdict", e.target.value as Verdict)
                    }
                  >
                    {VERDICTS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-sm sm:col-span-2">
                  Reason (short)
                  <input
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1"
                    value={log.reasonShort}
                    onChange={(e) => patchLog("reasonShort", e.target.value)}
                  />
                </label>
                <label className="text-sm sm:col-span-2">
                  Notes
                  <textarea
                    className="mt-1 block w-full rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1 min-h-[60px]"
                    value={log.notesOptional ?? ""}
                    onChange={(e) =>
                      patchLog("notesOptional", e.target.value)
                    }
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={busy}
                  className="rounded bg-blue-600 px-3 py-1.5 text-white text-sm disabled:opacity-50"
                  onClick={() => submitReview(false)}
                >
                  Submit log
                </button>
                <button
                  type="button"
                  disabled={busy}
                  className="rounded border border-amber-600 px-3 py-1.5 text-sm text-amber-800 dark:text-amber-200"
                  onClick={() => submitReview(true)}
                >
                  Submit with force (override validation)
                </button>
              </div>
            </section>
          ) : null}
        </div>
      )}
    </>
  );
}
