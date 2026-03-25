# Milestone H — Lumen v4 benchmark results (Wisewave aligned)

**Date:** 2026-03-25  
**Engine:** `milestone_h_v4` (narrowing pass; see **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`**)  
**Context:** Re-run of the same three `benchmarkSet` suites vs **earlier same-day v3** baseline.

---

## Executive summary

**Did Nova’s narrowing work?** **Yes, partially.**  
**Did it solve Milestone H?** **No, not yet.**

v4 is a **real** improvement over the earlier v3 rerun, especially **core 7**, **regression 14**, and **H3 suppression behavior**. The **confidence 25** layer remains **too revise-heavy** for closure-clean signoff; **H3** is still the **main failure lane**; **replay / rumination** remains a **soft cluster**.

**Direction (unchanged):** preserve **H4**; **tighten H3 further**; keep **H1** and **H5** narrow; **suppression-first**; **continue stabilization** — not hard-close.

---

## Wisewave — concurrence

**Agreed.**

v4 is a **real** improvement over the earlier v3 rerun, especially:

- H3 suppression behavior  
- core 7 cleanliness  
- regression 14 cleanup  

Nova’s narrowing is **clearly doing real work**. Milestone H is **still not closure-clean** because the **confidence** layer remains too revise-heavy (**13 PASS / 12 REVISE**) and **H3** is still the main failure lane.

**Next refinement targets:** **replay / rumination**; **prove / earn residual blur**.

---

## Daily core 7 — `lumen-daily-core-7`

| Metric | v3 (earlier rerun) | v4 |
|--------|-------------------|-----|
| PASS | 5 | **6** |
| REVISE | 2 | **1** |
| Suppressed (observed) | — | **2** |

**Read:** Modest improvement. One **no-reply** case **suppressed** by **`h3_permissiveness_narrowing`**. One **replay** case still **soft**.

---

## Expanded regression 14 — `lumen-regression-14`

| Metric | v3 | v4 |
|--------|-----|-----|
| PASS | 6 | **8** |
| REVISE | 8 | **6** |
| Suppressed (observed) | — | **5** |

**Read:** **Real** improvement. H3 over-emission dropped on several rows; **`h3_permissiveness_narrowing`** fired on multiple **prove/earn** and **no-reply** variants. **Replay / rumination** still a **revise** cluster.

---

## Confidence 25 — `lumen-confidence-25`

| Metric | v3 | v4 |
|--------|-----|-----|
| PASS | 12 | **13** |
| REVISE | 13 | **12** |
| Suppressed (observed) | — | **6** |

**Read:** **Slight** improvement only — **not** enough to change the bigger conclusion. Layer still **too soft** for clean **release-confidence** signoff.

---

## What improved

1. **H3 narrowing is real** — **`h3_permissiveness_narrowing`** observed where v3 had emitted softer H3, e.g. daily core **case 3**; regression **3, 8, 9**; confidence **2, 3, 9**.  
2. **Core and regression** — 7-pack **+1 PASS**; 14-pack **+2 PASS**; not a no-op deploy.  
3. **C25-24** — everyday **no-reply H1** case **cleaner** on v4 rerun payload; treated as **acceptable** on rerun (Lumen).

---

## What did not improve enough

1. **Confidence 25** — **13 / 12** still too revise-heavy for “release-confidence clean.”  
2. **H3** — still **12 H3 emissions** in confidence pack; **emitted H3 lines** still main **revise** source — narrowing **helped**, did **not** fully solve H3.  
3. **Replay / rumination** — still one of the **softest** families after v4.

---

## H-lane read (post–v4)

| Lane | Assessment |
|------|----------------|
| **H4** | Still **strongest**, **stable**; no sign narrowing **damaged** it |
| **H3** | **Improved**; still **main failure lane**; **needs more tightening** |
| **H1** | **Cleaner** than before; **stay narrow**; **do not** broaden |
| **H5** | **Not** meaningfully exercised in this rerun; **keep narrow** |
| **Suppression** | **Stronger**, **healthy** — one of the **best** signs in v4 |

---

## Bottom line (Lumen)

v4 is a **genuine** step up from the earlier v3 rerun, especially **core/regression** and **H3 suppression**. **Milestone H is improved** but **still not closure-clean**; **confidence** layer verdict mix remains the **gating** concern.

---

## Related docs

- **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`** — decision + Nova v4 implementation note  
- **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_End_of_Day_Summary.md`** — 2026-03-24 single-day benchmark (v3-era)  
- **`docs/HC_OS_V1_Milestone_H_Nova_Observation_Queue_Tool.md`** — benchmark tooling  
