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

**Regulation cue** is **hidden** when the **Awareness** strip is visible for the **same** assistant turn (`app/chat/page.tsx`). Rationale: avoid **coaching-like regulation** stacking with **micro-awareness** (Lumen recommendation; Milestone H stabilization).

**Open for Wisewave / further QA**

- Whether **Next step** / **What was noticed** defaults should also yield when Awareness is on (separate decision).  
- Compare browser feel: main + H only vs main + H + regulation vs full stack.

---

## One-line conclusion

> Stabilization risk: **not** only H in isolation, but **Awareness + Regulation (+ other strips)** making the turn feel **more managed** than Milestone H intends.

---

## Related

- **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — weight / stack pressure  
- **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — whole-turn lightness  
- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** — formal QA record (append watchpoint if re-closing)
