# Milestone H — Lumen end-of-day benchmark summary (Wisewave aligned)

**Date:** 2026-03-24  
**Audience:** Wisewave, Nova, Chino (CTO)  
**Context:** Custom observation benchmark rows live on hosted after DB push; reporting separated from passive observation.

---

## Summary

Today’s benchmark logging is **clean and separated** through the **custom observation-row path** (`POST /api/internal/h-observation/queue/custom`, `benchmarkSet` filters on summary/export/queue).

### Benchmark sets completed

| # | `benchmarkSet` |
|---|----------------|
| 1 | `lumen-daily-core-7` |
| 2 | `lumen-regression-14` |
| 3 | `lumen-confidence-25` |

All three are now:

- exact-prompt benchmark rows  
- one-to-one snapshots  
- one-to-one review logs  
- benchmark-filterable in summary/export  
- **not** mixed with passive observation rows  

---

## Hosted status (Lumen)

- Build marker: **`milestone_h_v3`**  
- Light Mode: **active**  
- Custom benchmark path: **live** after DB push  
- Benchmark filtering: **working as intended**  

---

## Results by benchmark layer

### 1) Daily core 7 — `lumen-daily-core-7`

| Metric | Value |
|--------|--------|
| Total reviewed | 7 |
| PASS | 6 |
| REVISE | 1 |
| REMOVE | 0 |
| Suppression ratio | 14.3% |
| H appeared | 6 |
| H suppressed | 1 |

**Read:** Healthy daily signal; one revise case remains in the replay/rumination softness zone.

### 2) Expanded regression 14 — `lumen-regression-14`

| Metric | Value |
|--------|--------|
| Total reviewed | 14 |
| PASS | 10 |
| REVISE | 4 |
| REMOVE | 0 |
| Suppression ratio | 14.3% |
| H appeared | 12 |
| H suppressed | 2 |

**Read:** No new stability break; revision cluster still concentrates in replay/rumination and some H3 precision softness.

### 3) Pre-release confidence 25 — `lumen-confidence-25`

| Metric | Value |
|--------|--------|
| Total reviewed | 25 |
| PASS | 20 |
| REVISE | 5 |
| REMOVE | 0 |
| Suppression ratio | 12.0% |
| H appeared | 22 |
| H suppressed | 3 |

**Read:** Strong enough for confidence-building, not “perfectly clean.” Remaining weak zone is **precision**, not stability.

---

## What improved (today)

- **v3** improvement confirmed on hosted  
- Encoding/garbling **cleared** on tested turn path  
- **H4** remains the strongest lane  
- Weak-input suppression **remains intact**  
- Exact benchmark evidence is **trustworthy** in the observation system  
- Passive observation and benchmark reporting can be **separated** properly (tooling + discipline)  

---

## Watchpoint (backlog, not deploy-blocking)

Remaining issue: **H3 precision**, especially:

- **Prove / earn** cases that occasionally blur into H3  
- **Replay / rumination** cases that can still feel generic or abstract  

**Status:** refinement / backlog — **not** stability or regression.

---

## Reporting rule (locked from 2026-03-24)

Do **not** treat **benchmark-heavy** suppression ratios as **passive observation** metrics.

Keep **separate** at all times:

1. **Passive observation** suppression ratio (no `benchmarkSet` filter, or `benchmarkSet=__passive__` where applicable).  
2. **Benchmark-set** suppression ratio (filter by `lumen-daily-core-7`, `lumen-regression-14`, `lumen-confidence-25`, etc.).  

Tooling: see **`docs/HC_OS_V1_Milestone_H_Nova_Observation_Queue_Tool.md`** (queue/summary/export `benchmarkSet` query param).

---

## Bottom-line judgment (Lumen)

**Milestone H v3 behaves like a stable, functioning layer** with remaining **precision refinement** needs — **not** like an unstable or regressing system.

---

## Wisewave — concurrence

**Agreed.**

Benchmark reporting is **clean enough to trust**.

**Key conclusion:** Milestone H v3 is a **stable, functioning layer** with **H3 precision** as the main refinement target — not instability.

**What is now clear:**

- Benchmark evidence is **separated correctly** from passive observation  
- **v3** on hosted is a **real** improvement  
- Weak-input suppression **remains intact**  
- **H4** remains the **strongest** lane  
- Remaining work: **H3 precision** (prove/earn, replay/rumination softness)  

**Correct status:**

| Axis | Status |
|------|--------|
| Stability | Acceptable |
| Refinement target | H3 precision |
| Infrastructure / reporting | Significantly improved |

**Reporting rule:** Keep passive observation suppression ratio and benchmark-set suppression ratio **separate at all times.**

---

## Related docs

- **`docs/HC_OS_V1_Milestone_H_Nova_Observation_Queue_Tool.md`** — API, UI, `benchmarkSet` / `__passive__`  
- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** — QA round closure + v3 7-case addendum  
- **`docs/HC_OS_V1_Milestone_H_Lumen_7case_Followup_Nova_2026-02-08.md`** — Nova v3 technical follow-up  
