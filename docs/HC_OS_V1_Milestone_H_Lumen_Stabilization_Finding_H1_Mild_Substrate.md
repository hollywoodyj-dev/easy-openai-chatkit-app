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

When selected kind is **H1**, emit **only if** not caught by **`isH1MildSubstrateSuppressed()`**:

- **Bypass** if user message **≥ 100** chars, or has **structural** cues (because, whenever, pattern, always, …), or **ZH** structural fragments.  
- **Bypass** if **insight** is **long (≥ 96)** or contains **durable** pattern language (pressure, loop, conflict, torn, …).  
- Otherwise, if user text matches **mild discomfort** families (overwhelmed, slightly uneasy, bit tense, worried I might, don’t trust myself / sometimes, mild “feel off”…), **suppress** with **`h1_mild_reflective_insufficient`**.

**H4 / H5 / H3** unchanged by this gate (only **H1**).

---

## Related

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Batch2_H3_Leakage.md`** — prior Batch 2 engine work  
- **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — removal test  
- **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — stabilization streams  

---

## One-line conclusion

> **H3 leakage was reduced; remaining risk was H1 on mild/generic reflective turns — addressed with a targeted H1-only mild-substrate suppress.**
