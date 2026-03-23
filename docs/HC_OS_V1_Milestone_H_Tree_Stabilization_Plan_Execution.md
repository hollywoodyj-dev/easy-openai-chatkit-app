# HC-OS V1 — Milestone H: Stabilization Plan (Tree execution version)

| | |
|--|--|
| **Owner** | **Tree** |
| **State** | **ACTIVE** |
| **Mode** | **No expansion / stability lock** |
| **Basis** | Post–Lumen QA — *passable / provisionally acceptable with watchpoints* |

**Companion:** Wisewave framing and checklist — **`docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`**. Gate 1 doctrine — **`docs/HC_OS_V1_Milestone_H_OctopusMind_Lumen_Closure_Doctrine.md`**.

---

## 0. Purpose

Milestone H has reached:

> **PASSABLE / PROVISIONALLY ACCEPTABLE WITH WATCHPOINTS**

This means:

| | |
|--|--|
| **Concept** | Validated |
| **Implementation** | Working |
| **System** | **Not** yet stable |

### Stabilization goal

Make H **consistently light**, **suppress-first**, and **non-intrusive** under **real usage**.

---

## 1. Stabilization principles (non-negotiable)

| # | Principle | Rule |
|---|-----------|------|
| **1** | **No expansion** | No new features, cue types, UI, or streams. **Only** refinement, reduction, stabilization. |
| **2** | **Suppression-first dominant** | Default = **no cue**. If unsure → **suppress**. |
| **3** | **Removal over improvement** | If a cue is questionable → **remove**, do not optimize. |
| **4** | **Whole-turn lightness > local correctness** | Even if H is “correct”: if the turn feels **heavier** → **suppress H**. |
| **5** | **H must remain invisible** | If users start noticing H as a **feature** → stabilization **failed**. |

---

## 2. Stabilization scope

### In scope

- Suppression tuning  
- Reflection lightness correction  
- Cue minimality refinement  
- EN/ZH parity protection  
- Selector sharpness (**only** if needed for suppression)  

### Out of scope

- New awareness categories  
- Personalization logic  
- Memory expansion  
- Embodiment expansion  
- Pattern system expansion  
- **Milestone I** work  

---

## 3. Stabilization streams (strict)

Tree runs **only** these **four** streams:

### STREAM 1 — Reflection lightness stabilization

| | |
|--|--|
| **Owner** | **Wisewave** |
| **Objective** | Remove residual: over-interpretation, subtle guidance, authorial tone |
| **Actions** | Simplify reflection language; reduce certainty; remove “helpful but heavy” phrasing; ensure main reflection stands alone cleanly |
| **Done when** | Reflection feels lighter; does not guide; does not resolve too much |

### STREAM 2 — Suppression hardening

| | |
|--|--|
| **Owner** | **OctopusMind** |
| **Objective** | Ensure H appears **less**, not more |
| **Actions** | Tighten suppression thresholds; refine vague-case handling; enforce factual / recurrence / consecutive-turn suppression |
| **Critical rule** | If uncertain → **suppress** |
| **Done when** | **Majority** of turns → **no H** |

### STREAM 3 — Minimal engine stability

| | |
|--|--|
| **Owner** | **Nova** |
| **Objective** | Implementation stays **minimal**, **stable**, **non-expanding** |
| **Actions** | Single cue only; preserve insertion point and kill-switch; avoid new logic layers; removal must not break response |
| **Done when** | H engine does nothing extra; does not grow; easy to disable |

### STREAM 4 — Real-use drift detection

| | |
|--|--|
| **Owner** | **Lumen** |
| **Objective** | Detect intrusiveness, guidance feel, duplication, weight increase |
| **Core QA questions** | (1) If removed, is it better? (2) Guidance feel? (3) Adds weight? (4) Duplicates E or reflection? |
| **Output** | pass / revise / remove; exact failure cases; **removal-first** recommendation |
| **Done when** | Majority of cases: H is **helpful** **or** **correctly absent** |

**Operational checklist (draft, Wisewave-strengthened):** **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — five drift axes, removal test, whole-turn evaluation, strict output format, escalation.

**Observation mode (Wisewave — passive, no code change):** **`docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`** — Tree + Lumen; 1–3 day window; *forget H* test; daily suppression/removal summaries; optional Notion / Nova logger later.

**Code (Nova):** H also suppresses when **E2 aligned instance count ≥ 2** but the recurrence strip is **withheld** (E3 / repeat / stale / etc.): `debug_milestone_h_suppressed_reason` = **`recurrence_overlap_e_structural`** (`lib/wisewave-milestone-h-micro-awareness.ts`).

**UI (Nova — Lumen watchpoint):** **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Browser_Stack_Weight.md`** — when **Awareness** is visible on a turn, **`/chat`** hides **Regulation cue** (H-UI-1) and **“What was noticed”** by default (H-UI-2); **`?noticed=1`** forces “What was noticed” for QA (`app/chat/page.tsx`).

**Engine (Nova — Lumen Batch 2):** **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Batch2_H3_Leakage.md`** — tighter task/help suppression, **`minimal_affect_low_signal`**, H3 from user text only (`lib/wisewave-milestone-h-micro-awareness.ts`).

**Engine (Nova — H1 follow-up):** **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_H1_Mild_Substrate.md`** — **`h1_mild_reflective_insufficient`** when kind would be H1 on mild/generic discomfort without durable insight (`lib/wisewave-milestone-h-micro-awareness.ts`).

---

## 4. Tree execution loop

| Time | Actions |
|------|---------|
| **Morning** | Select **one** stabilization stream; define **one** concrete action; state expected improvement |
| **Midday** | Check: Is H appearing **more**? Is the system getting **heavier**? If **yes** → **rollback immediately** |
| **Evening** | Log: where H helped; where H should be removed; any drift signals |

---

## 5. Stabilization metrics (simple & strict)

| Metric | Target / rule |
|--------|----------------|
| **1 — Suppression ratio** | **≥ 70–85%** of turns → **no H** |
| **2 — Removal safety** | Removing H does **not** improve **most** responses |
| **3 — Intrusiveness** | **0** cases where H feels like **guidance** |
| **4 — Weight** | System feels **same or lighter** than pre-H |
| **5 — Layer containment** | H suppressed when **E** or **F** active |

---

## 6. Escalation rules

Tree **must escalate** (act immediately) if:

| Case | Signal | Action |
|------|--------|--------|
| **1** | H **frequency** increases | Tighten suppression **immediately** |
| **2** | H feels like **guidance** | Remove that cue type / pattern |
| **3** | System feels **heavier** | **Rollback** recent changes |
| **4** | **Nova** adds **complexity** | **Reject** merge |
| **5** | **Lumen** recommends **removal** repeatedly | **Remove** H in that scenario |

---

## 7. Exit criteria (very important)

Milestone H **exits stabilization** only when **all** hold:

| Gate | Criterion |
|------|-----------|
| **Stability** | Suppression holds; **no drift** over multiple days |
| **Lightness** | System **consistently** feels light; no authorial heaviness |
| **Optional** | H appears **rarely**; helps when present |
| **No guidance** | No coaching / therapeutic tone |
| **Founder test** | *“This feels more natural, not more controlled.”* |

---

## 8. Tree decision gate

**Only** when **all** exit conditions hold:

- Tree may move **Milestone H → CLOSED**  
- Tree may open **Milestone I → preparation mode**  

---

## 9. One-line stabilization truth

> **Milestone H is finished not when it works, but when it stops being noticeable.**

---

## Final control rule

If H ever becomes **visible as a feature**, Tree must treat it as **regression**.

---

## Related documents

- **`docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`** — observation window log + Tree decision block.  
- **`docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`** — soft pass, Wisewave checklist, “forget H exists.”  
- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** — Lumen closure record.  
- **`docs/HC_OS_V1_Milestone_H_OctopusMind_Lumen_Closure_Doctrine.md`** — Gate 1 boundaries and H/E conflict.  
- **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — Lumen Stream 4 drift QA (removal-first).
