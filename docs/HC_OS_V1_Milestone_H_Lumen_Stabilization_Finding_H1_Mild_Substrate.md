# Milestone H — Lumen stabilization follow-up (H1 mild substrate)

| | |
|--|--|
| **Status** | **Watchpoint** — Nova gate added; re-QA recommended |
| **Area** | H1 permissiveness on **mild / generic** reflective turns |
| **Owners** | **Nova** primary; **Wisewave** secondary (copy / bar) |

---

## Summary

After **H3** / utilitarian / **minimal-affect** tightening, targeted re-check showed **H1** still **too permissive** on low-intensity reflective lines (overwhelmed, slightly uneasy, bit tense, worried I might…, don’t trust myself…).

Stabilization test: *does removing H make the turn **clearly** worse?* — often **same** or **better** → **suppress**.

---

## Nova response (implemented)

**File:** `lib/wisewave-milestone-h-micro-awareness.ts`

**Build marker:** `debug_milestone_h_build_marker` = **`milestone_h_v2`** — use this on **hosted** to confirm the deploy includes H-engine changes ( **`v1`** = older build).

When selected kind is **H1**, emit **only if** not caught by **`isH1MildSubstrateSuppressed()`**:

- **Bypass** if user message **≥ 100** chars, or has **structural** cues (because, whenever, **pattern of** / **loop where**, always, …), or **ZH** structural fragments.  
- **Bypass** if **insight** matches **high-precision** durable phrases only (e.g. torn between, inner rule, split between, stuck in a loop, pattern of avoiding…). **Not** raw insight length and **not** loose tokens like “uncertainty” / “reaction” / lone “pattern” — those appeared in almost every model insight and **disabled** this gate on hosted (re-QA 2026).  
- Otherwise, if user text matches **mild discomfort** families (overwhelmed, slightly uneasy, feel a bit tense, worried I might/will, don’t trust myself / sometimes, mild “feel off”…), **suppress** with **`h1_mild_reflective_insufficient`**.

**H4 / H5 / H3** unchanged by this gate (only **H1**).

---

## Related

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Batch2_H3_Leakage.md`** — prior Batch 2 engine work  
- **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — removal test  
- **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — stabilization streams  

---

## One-line conclusion

> **H3 leakage was reduced; remaining risk was H1 on mild/generic reflective turns — addressed with a targeted H1-only mild-substrate suppress.**
