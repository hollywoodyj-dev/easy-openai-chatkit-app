import React from "react";

const summaryCards = [
  {
    title: "System Status",
    value: "Watch Zone",
    sub: "Day 7-14 hosted snapshot: 96 reviewed, H appeared 25, H suppressed 71",
  },
  {
    title: "Rollback Triggers",
    value: "0 Active",
    sub: "Detection-only evidence flow; Tree remains the only decision point",
  },
  {
    title: "Top Drift Type",
    value: "Layer + Density Drift",
    sub: "Residual pockets are H1-dominant, with a Day 12 H4-heavy lane",
  },
  {
    title: "Removal Test",
    value: "Residual Signals Ongoing",
    sub: "Day 10/12 broader spread; Day 11/13/14 bounded H1 pocket",
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
    id: "h-d14-006",
    lang: "ZH",
    type: "reflective",
    layer: "H1",
    drift: "Layer Drift",
    severity: "Soft",
    note: "Day 14 survivor in bounded H1 pocket; shape matches Day 11 and Day 13.",
    action: "Observe",
  },
  {
    id: "h-d12-004",
    lang: "ZH",
    type: "reflective",
    layer: "H4",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 12 H4-dominant residual lane (subtype-heavy but bounded, not broad reopen).",
    action: "Watch",
  },
  {
    id: "h-d10-009",
    lang: "ZH",
    type: "reflective",
    layer: "H5",
    drift: "Layer + Density Drift",
    severity: "Pattern",
    note: "Day 10 wider subtype spread (H1/H4/H5) than Day 11/13/14 bounded H1 shape.",
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
              <h2 className="text-xl font-semibold">Recent Drift Cases</h2>
              <p className="mt-1 text-sm text-slate-600">
                Lumen logs drift type, severity, and removal judgment. Tree decides whether rollback is needed.
              </p>
            </div>
            <div className="text-sm text-slate-500">Hosted Day 7-14 sample view</div>
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

