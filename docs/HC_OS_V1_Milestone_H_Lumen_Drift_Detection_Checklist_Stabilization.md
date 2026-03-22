# Milestone H — Drift detection checklist (Lumen strengthened)

**HC-OS V1 — Drift control layer**

| | |
|--|--|
| **Owner** | **Lumen** |
| **Draft basis** | Wisewave (强化版) |
| **Scope** | Milestone **H** **stabilization** phase |
| **Mode** | **Removal-first** / **suppression-first** |

**Runs under:** **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — Stream 4 (real-use drift detection).

---

## 0. Purpose

This checklist exists to detect any drift from **“awareness”** into **“guidance.”**

Milestone H is **stable** only if:

> The system remains **light**, **optional**, and **non-intrusive** under **real usage**.

---

## 1. Core drift definition

**Drift** occurs when:

> The system becomes **more present** than the **user’s own awareness**.

---

## 2. Drift categories (primary detection axes)

Lumen must check **all** responses against these **five** axes.

### 2.1 Guidance drift

| | |
|--|--|
| **Definition** | The system starts **influencing direction** instead of **opening space**. |
| **Detect if** | Cue suggests **what to do**; implies a **better path**; **subtly redirects** thinking. |
| **Examples (drift)** | “You might want to step back here.” ❌ — “This could be a good moment to reconsider.” ❌ |
| **Expected** | **Noticing** without **steering**. |

### 2.2 Interpretive drift

| | |
|--|--|
| **Definition** | The system **explains** the user instead of **reflecting** them. |
| **Detect if** | **Cause** is assigned; **psychological meaning** inferred too strongly; **internal state** is defined. |
| **Examples (drift)** | “This comes from your fear of failure.” ❌ — “You are avoiding uncertainty here.” ❌ |
| **Expected** | **Pattern suggested**, not **explained**. |

### 2.3 Authority drift

| | |
|--|--|
| **Definition** | The system sounds like it **“knows”** the user. |
| **Detect if** | Tone is **certain**; language **definitive**; system sounds like **expert**. |
| **Examples (drift)** | “This is your pattern.” ❌ — “You always do this when…” ❌ |
| **Expected** | **Soft**, **provisional** language. |

### 2.4 Weight drift

| | |
|--|--|
| **Definition** | The response feels **heavier** than needed. |
| **Detect if** | Too many **layers** visible; wording too **dense**; emotional or conceptual **load** increases. |
| **Symptoms** | User needs to **re-read**; response feels **“processed”**; awareness cue **stands out** too much. |
| **Expected** | **Readable in one pass**. |

**Browser composition (`/chat`):** Evaluate the **full vertical stack**, not API fields alone — e.g. **Awareness** + **Regulation cue** + **What was noticed** + main reply. See **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Browser_Stack_Weight.md`**. Nova (**H-UI-1 / H-UI-2**): when **Awareness** is visible for that turn, **Regulation cue** and **“What was noticed”** are **suppressed** by default; use **`?noticed=1`** to force “What was noticed” for QA.

### 2.5 Duplication drift

| | |
|--|--|
| **Definition** | **H** overlaps with **reflection** or **E**. |
| **Detect if** | Cue **repeats** reflection insight; **repeats** recurrence cue; adds **no new value**. |
| **Expected** | H must add **distinct micro-value**. |

---

## 3. Secondary drift signals (subtle but critical)

| Signal | Meaning | Action implication |
|--------|---------|-------------------|
| **“Too smart”** | Language feels **clever**; phrasing **crafted**; insight **optimized** | Often **precedes** drift — flag early |
| **“Almost helpful”** | Cue is slightly useful but adds **slight weight** | **Must be removed** |
| **“Becoming expected”** | H appears **frequently**; user begins to **anticipate** it | H becoming **atmospheric** → drift |
| **“Stack pressure”** | **E + F + H** visible together; response feels **layered** | **H must be suppressed** |

---

## 4. Removal test (primary QA mechanism)

For **every** H occurrence, Lumen must run:

> **If I remove this cue: is the response better, same, or worse?**

### Results interpretation

| Result | Action |
|--------|--------|
| **Better** | **REMOVE H** |
| **Same** | **REMOVE H** |
| **Slightly worse** | **REMOVE H** |
| **Clearly worse** | **KEEP H** |

**Rule:** Only the **last** case justifies existence.

---

## 5. Suppression priority rules

When conflict exists:

| Priority (higher wins) | |
|------------------------|--|
| **E** | > H |
| **Reflection** | > H |
| **Overall lightness** | > H |

**Absolute rule:** When in doubt → **suppress H**.

---

## 6. Frequency monitoring

Lumen must track:

| Target | |
|--------|--|
| **70–85%** of turns | → **no H** |

| Drift signals | |
|---------------|--|
| H in **>30%** of turns | ⚠️ |
| H appears **consecutively** | ⚠️ |
| H in **low-signal** inputs | ❌ |

---

## 7. Whole-turn evaluation (critical)

**Do not** evaluate H **in isolation**.

**Evaluate:** the **entire response** experience.

**Check:**

- Does the response feel **lighter**?  
- Does H **blend** or **stand out**?  
- Does user **attention shift** to H?  

**If H becomes focal** → **drift**.

---

## 8. EN / ZH parity drift

**Detect if:**

- Chinese version feels **heavier**; English **lighter** (or vice versa)  
- **Suppression** differs across languages  

**Expected:** Same **restraint**, same **optionality**, same **clarity** — **not** same wording.

---

## 9. Lumen output format (strict)

Every QA result must return:

| # | Field | Values / notes |
|---|--------|----------------|
| **1** | **Verdict** | `PASS` / `REVISE` / `REMOVE` |
| **2** | **Drift type** | guidance / interpretive / authority / weight / duplication |
| **3** | **Evidence** | Exact sentence; exact issue |
| **4** | **Removal test result** | better / same / worse |
| **5** | **Action** | remove / suppress / simplify |

---

## 10. Escalation conditions

Lumen must **escalate immediately** if:

| Class | Signals |
|-------|---------|
| **System-level drift** | Multiple guidance signals; **rising frequency**; **growing weight** |
| **Structural drift** | H overlaps **E** repeatedly; H becomes **expected** |
| **Language drift** | Tone becomes **therapeutic**, **analytical**, or **authoritative** |

---

## 11. Final acceptance standard

Milestone H is **stable** **only if**:

| Criterion |
|-----------|
| H **rarely** appears |
| H **never** guides |
| H **never** explains (in the interpretive/authority sense above) |
| H **never** dominates |
| H can be **removed safely** (removal test discipline) |
| H improves **at least one real moment** when kept |
| System feels **lighter** than before |

---

## Final rule

> **If H is noticeable, it is already too much.**

---

## One-line summary (for team)

> **Lumen protects H by removing everything that is not clearly necessary.**

---

## Related documents

- **`docs/HC_OS_V1_Milestone_H_Lumen_Stabilization_Finding_Browser_Stack_Weight.md`** — Lumen watchpoint: browser stack weight; regulation vs awareness.  
- **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — Stream 4 owner Lumen; metrics aligned (70–85% no H, removal-first).  
- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** — formal H QA closure (soft pass).  
- **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Plan.md`**, **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Checklist.md`** — pre-stabilization Lumen artifacts.  
- **`docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`** — stabilization phase framing.
