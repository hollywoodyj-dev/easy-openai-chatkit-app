import React from "react";

const summaryCards = [
  {
    title: "System Status",
    value: "Review Visibility Mode",
    sub: "Tree awareness: YES | Tree emergency: NO | rollback trigger: not established",
  },
  {
    title: "Rollback Triggers",
    value: "0 Active",
    sub: "Continuous Pattern Drift review only; no automatic escalation",
  },
  {
    title: "Top Drift Type",
    value: "Layer + Density Drift",
    sub: "Survivor-only ledger: H1-dominant recurrence, Day 12 bounded H4-heavy lane",
  },
  {
    title: "Removal Test",
    value: "19 / 25 Removal-Preferred",
    sub: "Survivor-only ledger slice; not full all-units rolling-window authority",
  },
];

const driftRows = [
  { type: "Presence Drift", score: 0, trend: "Flat", threshold: "High priority", status: "Clear" },
  { type: "Guidance Drift", score: 0, trend: "Flat", threshold: "Critical", status: "Clear" },
  { type: "Memory Drift", score: 0, trend: "Flat", threshold: "Critical", status: "Clear" },
  { type: "Layer Drift", score: 8, trend: "Rising", threshold: "Medium", status: "Watch" },
  { type: "Density Drift", score: 8, trend: "Rising", threshold: "Medium", status: "Watch" },
  { type: "Authorship Drift", score: 0, trend: "Flat", threshold: "Critical", status: "Clear" },
];

const zoneBands = [
  { label: "Safe Zone", range: "0–2", note: "No action needed (example mapping)" },
  { label: "Watch Zone", range: "3–5", note: "Increase monitoring (example mapping)" },
  { label: "Risk Zone", range: "6–8", note: "Tree review required (example mapping)" },
  { label: "Danger Zone", range: "9+", note: "Tree rollback decision may be required (policy)" },
];

const rollbackRules = [
  "Guidance Drift appears in 2 consecutive interactions",
  "Authorship Drift appears once",
  "Removal test is better in 3 or more recent cases",
  "High-risk drift (Presence / Guidance / Authorship) dominates severity interpretation",
  "Zone rule: max severity observed in last 20 interactions (select A)"
];

const recentCases = [
  {
    id: "h-d07-003",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Closed",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 7 case suppressed on hosted rerun with v20 and did not survive Day 7 follow-up.",
    action: "Observe",
  },
  {
    id: "h-d07-004",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Soft",
    note: "Day 7 follow-up survivor in bounded ZH H1 duplication pocket.",
    action: "Watch",
  },
  {
    id: "h-d07-006",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Closed",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 7 case suppressed on hosted rerun with v20 and did not survive Day 7 follow-up.",
    action: "Observe",
  },
  {
    id: "h-d07-009",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Soft",
    note: "Day 7 follow-up survivor in bounded ZH H1 duplication pocket.",
    action: "Watch",
  },
  {
    id: "h-d08-004",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 8 urgency/false-urgency pocket survivor (H1).",
    action: "Watch",
  },
  {
    id: "h-d08-006",
    lang: "ZH",
    type: "reflective",
    layer: "H4",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 8 survivor (H4) in the same bounded urgency lane.",
    action: "Watch",
  },
  {
    id: "h-d08-009",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 8 urgency/false-urgency pocket survivor (H1).",
    action: "Watch",
  },
  {
    id: "h-d09-004",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 9 bounded H1 residual pocket survivor.",
    action: "Watch",
  },
  {
    id: "h-d09-009",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 9 bounded H1 residual pocket survivor.",
    action: "Watch",
  },
  {
    id: "h-d09-012",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 9 bounded H1 residual pocket survivor.",
    action: "Watch",
  },
  {
    id: "h-d10-004",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 10 broader multi-subtype spread survivor (H1/H4/H5 mix).",
    action: "Watch",
  },
  {
    id: "h-d10-006",
    lang: "ZH",
    type: "reflective",
    layer: "H4",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 10 broader multi-subtype spread survivor (includes H4).",
    action: "Watch",
  },
  {
    id: "h-d10-009",
    lang: "ZH",
    type: "reflective",
    layer: "H5",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 10 broader multi-subtype spread survivor (includes H5).",
    action: "Watch",
  },
  {
    id: "h-d10-012",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 10 broader multi-subtype spread survivor (H1/H4/H5 mix).",
    action: "Watch",
  },
  {
    id: "h-d11-003",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 11 narrowed back to bounded H1 residual pocket.",
    action: "Watch",
  },
  {
    id: "h-d11-004",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 11 narrowed back to bounded H1 residual pocket.",
    action: "Watch",
  },
  {
    id: "h-d11-006",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 11 narrowed back to bounded H1 residual pocket.",
    action: "Watch",
  },
  {
    id: "h-d12-003",
    lang: "ZH",
    type: "reflective",
    layer: "H4",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 12 subtype-heavy lane with H4-dominant residual shape.",
    action: "Watch",
  },
  {
    id: "h-d12-004",
    lang: "ZH",
    type: "reflective",
    layer: "H4",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 12 subtype-heavy lane with H4-dominant residual shape.",
    action: "Watch",
  },
  {
    id: "h-d12-006",
    lang: "ZH",
    type: "reflective",
    layer: "H4",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 12 subtype-heavy lane with H4-dominant residual shape.",
    action: "Watch",
  },
  {
    id: "h-d12-009",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 12 one H1 alongside H4-dominant residual lane.",
    action: "Watch",
  },
  {
    id: "h-d13-003",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 13 bounded H1 residual pocket (similar to Day 11).",
    action: "Watch",
  },
  {
    id: "h-d13-004",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 13 bounded H1 residual pocket (similar to Day 11).",
    action: "Watch",
  },
  {
    id: "h-d13-006",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 13 bounded H1 residual pocket (similar to Day 11).",
    action: "Watch",
  },
  {
    id: "h-d14-003",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 14 bounded H1 residual pocket (matches Day 11/13 shape).",
    action: "Watch",
  },
  {
    id: "h-d14-004",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 14 bounded H1 residual pocket (matches Day 11/13 shape).",
    action: "Watch",
  },
  {
    id: "h-d14-006",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    state: "Open",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 14 bounded H1 residual pocket (matches Day 11/13 shape).",
    action: "Watch",
  },
];

export default function UnifiedDriftDetectionDashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs tracking-wide uppercase text-slate-600">
            HC-OS · Unified Drift Detection
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Auto Drift Detection Dashboard
              </h1>
              <p className="mt-2 max-w-3xl text-sm md:text-base text-slate-600">
                Detection-only monitoring for H, I, and J. This page exists to answer one question: is the system
                becoming more noticeable, more directive, or more system-like over time?
              </p>
              <p className="mt-2 max-w-3xl text-xs md:text-sm text-slate-500">
                QA working surface only (detection/logging). No rollback execution and no behavior control.
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 shadow-sm">
              <div className="text-xs uppercase tracking-wide text-slate-500">Mode</div>
              <div className="text-lg font-medium">Detection Only · No Expansion</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.title} className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">
              <div className="text-sm text-slate-500">{card.title}</div>
              <div className="mt-2 text-2xl font-semibold">{card.value}</div>
              <div className="mt-2 text-sm text-slate-600">{card.sub}</div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Governance Clarification (Phase 2)</h2>
          <p className="mt-1 text-sm text-slate-600">
            Day 7-14 repeated bounded residual recurrence is logged as Continuous Pattern Drift review visibility.
            Repeated recurrence alone does not justify system change.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
              Escalation requires movement toward noticeability, removal-preferred behavior, or high-risk drift classes
              (Presence / Guidance / Authorship).
            </div>
            <div className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
              Locked threshold checks: verify recurrence windows at 3 consecutive or 4 of last 6 before Tree posture
              changes.
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Current narrow evidence artifact: `docs/HC_OS_V1_Phase_2_Post_H_Day7_to_Day14_Survivor_Unified_Drift_Ledger_2026-04-02.md`
            (25 survivor units only; governance review visibility, not rollback/patch justification).
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Unified Drift Matrix</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Track the six drift classes against hosted Day 7-14 rerun evidence.
                </p>
              </div>
              <div className="text-sm text-slate-500">Day 7-14 (96 interactions)</div>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Drift Type</th>
                    <th className="px-4 py-3 text-left font-medium">Score</th>
                    <th className="px-4 py-3 text-left font-medium">Trend</th>
                    <th className="px-4 py-3 text-left font-medium">Threshold</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {driftRows.map((row) => (
                    <tr key={row.type} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-medium">{row.type}</td>
                      <td className="px-4 py-3">{row.score}</td>
                      <td className="px-4 py-3">{row.trend}</td>
                      <td className="px-4 py-3">{row.threshold}</td>
                      <td className="px-4 py-3">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Zone Thresholds (A: max severity dominates)</h2>
              <p className="mt-1 text-sm text-slate-600">
                Zone = max(Severity Level) observed in the last 20 interactions. Drift detection is anomaly-first.
              </p>
              <div className="mt-4 space-y-3">
                {zoneBands.map((zone) => (
                  <div key={zone.label} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{zone.label}</div>
                      <div className="text-sm text-slate-500">{zone.range}</div>
                    </div>
                    <div className="mt-1 text-sm text-slate-600">{zone.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Rollback Triggers (Policy)</h2>
              <p className="mt-1 text-sm text-slate-600">Rollback is not automatic. Nova records signals; Tree executes decisions.</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                {rollbackRules.map((rule) => (
                  <li key={rule} className="rounded-2xl border border-slate-200 px-4 py-3">
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Phase 2 Language Grounding Read</h2>
              <p className="mt-1 text-sm text-slate-600">
                Detection-only snapshot with latest narrow confirmation-pass read for the known weak cluster.
              </p>
            </div>
            <div className="text-sm text-slate-500">12 narrow-pass units</div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Level 0</div>
              <div className="mt-1 text-2xl font-semibold">3</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Level 1</div>
              <div className="mt-1 text-2xl font-semibold">6</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Level 2</div>
              <div className="mt-1 text-2xl font-semibold">3</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="text-xs uppercase tracking-wide text-slate-500">Level 3</div>
              <div className="mt-1 text-2xl font-semibold">0</div>
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="font-medium">L0/1 share</div>
              <div className="mt-1 text-slate-600">9/12 = 75.0% (narrow-pass read)</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="font-medium">L3 bar (=0)</div>
              <div className="mt-1 text-slate-600">0 (pass)</div>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="font-medium">Optional lines should suppress</div>
              <div className="mt-1 text-slate-600">6/12 flagged; optional lines present in 11/12</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Hosted v21 narrow recheck: suppression target succeeded (12/12 suppressed), but possible response-quality /
            language-routing regression is flagged in affected ZH rows (generic English fallback-style uncertainty framing).
            Keep Phase 2 direction; do not close yet on suppression count alone.
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Board label remains: <span className="font-medium">Pass with watchpoints</span>.
          </p>
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
            <div className="font-medium">Next detection-only step: regression verification check (hosted)</div>
            <div className="mt-1">
              Verify whether the new ZH generic-English fallback pattern is a real hosted behavior regression or a harness/
              evaluation artifact under milestone_h_v21. Detection-only; no broad Phase 2 reopen.
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Verification result: confirmed in raw hosted API output on affected ZH rows (browser parity not yet confirmed).{" "}
              <br />
              Lumen result artifact: `docs/HC_OS_V1_Phase_2_Narrow_Confirmation_Pass_Results_2026-04-02.md` ·
              Next recheck packet: `docs/HC_OS_V1_Phase_2_Narrow_Recheck_Packet_2026-04-02_v2.md`
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Drift Cases</h2>
              <p className="mt-1 text-sm text-slate-600">
                Full board (open + closed). Lumen logs drift; Tree decides whether rollback is needed.
              </p>
            </div>
            <div className="text-sm text-slate-500">Hosted Day 7-14 all-case view</div>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {recentCases.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{item.id}</div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">{item.layer}</div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="rounded-full bg-slate-100 px-2 py-1">{item.lang}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">{item.type}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">{item.severity}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-1">{item.state}</span>
                </div>
                <div className="mt-4 text-sm font-medium">{item.drift}</div>
                <p className="mt-2 text-sm text-slate-600">{item.note}</p>
                <div className="mt-4 text-sm text-slate-500">Recommended action: {item.action}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Unified Removal Test (Locked)</h2>
            <p className="mt-1 text-sm text-slate-600">
              Removal test must NOT involve regeneration. Only structural subtraction of the exact layer anchor is allowed.
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="rounded-2xl border border-slate-200 px-4 py-3">Remove H → better?</div>
              <div className="rounded-2xl border border-slate-200 px-4 py-3">Remove I → better?</div>
              <div className="rounded-2xl border border-slate-200 px-4 py-3">Remove J → better?</div>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Do not rephrase, regenerate, or reinterpret. Only remove the exact anchor-mapped segment for comparison.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">System Law</h2>
            <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-lg font-medium leading-relaxed">
                If the system becomes noticeable, it is already drifting.
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              HC-OS Unified Drift Detection exists to ensure the system does not slowly become what it was designed
              to avoid.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

