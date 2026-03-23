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
    verdict: "pass",
    reasonShort: "",
    notesOptional: "",
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

  function patchLog<K extends keyof ObservationReviewLog>(
    key: K,
    value: ObservationReviewLog[K]
  ) {
    setLog((prev) => (prev ? { ...prev, [key]: value } : prev));
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

  async function submitReview(force?: boolean) {
    if (!log) return;
    setBusy(true);
    setError(null);
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
          <section>
            <h2 className="font-medium text-sm mb-1">Raw input</h2>
            <pre className="text-xs whitespace-pre-wrap rounded border border-neutral-300 dark:border-neutral-600 p-3 bg-neutral-50 dark:bg-neutral-900/50">
              {data.queueItem.fullInput ?? data.queueItem.previewText}
            </pre>
          </section>

          <section>
            <h2 className="font-medium text-sm mb-1">
              Response snapshot (paste from /chat or API; JSON)
            </h2>
            <textarea
              className="w-full min-h-[160px] font-mono text-xs rounded border border-neutral-300 dark:border-neutral-600 p-2 bg-white dark:bg-neutral-900"
              value={snapshotJson}
              onChange={(e) => setSnapshotJson(e.target.value)}
            />
            <button
              type="button"
              disabled={busy}
              className="mt-2 rounded border border-neutral-400 px-3 py-1 text-sm dark:border-neutral-600"
              onClick={saveSnapshot}
            >
              Save snapshot
            </button>
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
                    onChange={(e) => patchLog("hAppeared", e.target.checked)}
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
                    onChange={(e) =>
                      patchLog("positionCorrect", e.target.checked)
                    }
                  />
                  Position correct
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
