# Milestone H — Lumen stabilization finding (browser stack weight)

| | |
|--|--|
| **Status** | **Watchpoint** |
| **Area** | Browser-side stack weight / visible layer feel |
| **Owners** | **Nova** primary; **Wisewave** secondary (visual / doctrine fit) |

---

## Finding

Browser-side stabilization check: the main current risk is **visible stack weight**, not H-strip failure in isolation.

On a live `/chat` turn where H emitted, the UI showed:

- **Awareness** strip (+ H copy)  
- **Regulation cue** (e.g. “Try: Soften the urgency”)  
- **What was noticed** (reflection metadata block)  
- **Main reply**

Even when H copy is restrained, the **combined visible stack** can feel **more productized / managed** than an API-only read suggests.

---

## Why it matters

Stabilization targets **lightness**, **optionality**, **non-intrusiveness**, and **controlled-exception** H behavior. The question is not only “Is H too heavy?” but:

> **Does the visible UI stack make the system feel more managed than intended?**

---

## What is not failing (at time of note)

- H cue copy  
- H suppression / recurrence containment (server)  
- Rehydrate behavior  
- Structural H logic  

Issue scope: **browser-visible composition**.

---

## Drift classification

| | |
|--|--|
| **Primary** | **Weight drift** (see drift checklist §2.4) |
| **Secondary** | **Guidance-adjacent stack pressure** — not necessarily H guiding, but **composition** can feel intervention-like |

---

## Nova response (implemented)

### H-UI-1 — Regulation + Awareness

**Regulation cue** is **hidden** when the **Awareness** strip is visible for the **same** assistant turn (`app/chat/page.tsx`). Rationale: avoid **coaching-like regulation** stacking with **micro-awareness**.

### H-UI-2 — “What was noticed” + Awareness (follow-up finding)

After H-UI-1, Lumen compared stacks: **Awareness + main** felt best; **Awareness + What was noticed + main** still felt **more structured** than stabilization intent.

**Implemented:** The **“What was noticed”** row is **suppressed** when Awareness is visible for that assistant turn — same effect as prior **`?noticed=0`** for those turns, without requiring a query param.

**QA override:** **`?noticed=1`** still **forces** the “What was noticed” block **on** even when Awareness is showing (so Lumen can reproduce the heavier stack when needed).

**Still open**

- Whether **Next step** should also yield when Awareness is on (narrow composition).  
- Wisewave / founder check on default **`NEXT_PUBLIC_SHOW_WHAT_WAS_NOTICED_DEFAULT`** for non–H turns (unchanged by H-UI-2).

---

## Stack quality ranking (Lumen, post H-UI-1 / H-UI-2)

1. **Awareness + main reply** — target for H turns  
2. ~~Awareness + What was noticed + main~~ — **avoided by default** when Awareness on (H-UI-2)  
3. ~~Awareness + Regulation + What was noticed + main~~ — **too layered**; Regulation removed when Awareness on (H-UI-1)

---

## One-line conclusion

> Stabilization risk: **not** only H in isolation, but **visible scaffolding** around it (**Regulation**, **What was noticed**) making the turn feel **more managed** than Milestone H intends — **addressed in `/chat`** by hiding those layers when Awareness is on (with a **`?noticed=1`** escape hatch).

---

## Related

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Batch2_H3_Leakage.md`** — server-side H3 / low-signal admissibility (Batch 2)  
- **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — weight / stack pressure  
- **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — whole-turn lightness  
- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** — formal QA record (append watchpoint if re-closing)
