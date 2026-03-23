# Milestone H — Observation log template (Wisewave)

**HC-OS V1 — Observation mode**

| | |
|--|--|
| **Owners** | **Tree** (decision) + **Lumen** (logging) |
| **Mode** | **No-change / passive monitoring** |
| **Duration** | **1–3 days** (minimum) |
| **Source** | Wisewave |

**Purpose:** Answer **one** question — *Is Milestone H stable enough to be forgotten?*

**Not:** whether H “works,” is clever, or can be improved.

**Only:** whether H stays **invisible** and **safe** over time.

**Related:** **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** (metrics, exit gate) · **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** (drift axes) · **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** (closure / drift posture).

---

## 0. Log purpose (pin)

> **Is Milestone H stable enough to be forgotten?**

---

## 1. Log entry format (per interaction)

Each **real** conversation (or sampled interaction) = **one** entry.

### Entry header

| Field | Values / notes |
|--------|----------------|
| **Entry ID** | |
| **Date / time** | |
| **Language** | EN / ZH |
| **Conversation type** | reflective / factual / mixed |
| **Signal strength** | low / medium / high |

### H behavior

| Field | Values / notes |
|--------|----------------|
| **Did H appear?** | Yes / No |
| **If YES — cue type** | H1 (notice) / H3 (pause) / H4 (softening) / H5 (inner split) |
| **Position** | after reflection / other (flag if incorrect) |

### Suppression check

| Field | Values / notes |
|--------|----------------|
| **Should H have been suppressed?** | Yes / No / Unclear |
| **If Yes but appeared** | **FLAG: OVER-EMISSION** |
| **If No but suppressed** | **FLAG: UNDER-EMISSION** (rare; informational only) |

### Drift detection (Lumen)

Check all that apply:

- [ ] Guidance drift  
- [ ] Interpretive drift  
- [ ] Authority drift  
- [ ] Weight drift  
- [ ] Duplication drift  

If any checked → describe briefly below.

### Removal test (**mandatory**)

**If I remove the H cue:**

| Result | Better / Same / Worse |
|--------|------------------------|
| **Conclusion** | REMOVE / SHOULD REMOVE / KEEP |

**Rule:** Only **Worse** justifies keeping H (aligns with stabilization removal test).

### Whole-turn experience

Does the response feel:

- Lighter than before H  
- Same  
- Slightly heavier  
- Clearly heavier  

### Noticeability check

Did H feel noticeable as a **feature**?

- Not noticeable  
- Slightly noticeable  
- Clearly noticeable  

**If “clearly noticeable”** → automatic drift flag.

### Conflict check

| Question | Yes / No |
|----------|----------|
| Was **E** (pattern) present? | |
| Was **F** (embodiment) present? | |
| Did H **compete** with E or F? | |

### Lumen verdict

| Field | |
|-------|--|
| **Verdict** | PASS / REVISE / REMOVE |
| **Reason (1 line)** | |

---

## 2. Daily summary (Tree + Lumen)

End of each day:

### Quantitative summary

| Metric | Value |
|--------|--------|
| **Total entries** | |
| **H appeared** | |
| **H suppressed** (no H) | |
| **Suppression ratio** | (No H) / total |
| **Target** | **70–85%** no H |

### Removal test summary

| Outcome | Count |
|---------|--------|
| Better after removal | |
| Same after removal | |
| Worse after removal | |

**Target:** **Only** “Worse” justifies H (majority discipline per Tree plan).

### Drift summary

| Type | Count |
|------|--------|
| Guidance drift cases | |
| Weight drift cases | |
| Duplication cases | |
| Noticeability cases | |

### Key observations (free text)

- Where H worked well  
- Where H felt unnecessary  
- Any pattern of overuse  
- Any pattern of suppression failure  

---

## 3. Decision criteria (Tree)

After the **observation window**:

### Close Milestone H **only if**

- Suppression ratio **stable** (**≥ 70–85%** no H)  
- Removal test: **majority** = Same or Worse (**not** Better)  
- **No** guidance drift cases  
- **No** repeated noticeability  
- H does **not** compete with **E**  
- System feels **same or lighter**  

### Do **not** close if

- H appears **too often**  
- Removal **frequently** improves response  
- Any **guidance** drift exists  
- H becomes a **noticeable** pattern  
- System feels **heavier**  

---

## 4. Tree final decision block

**Milestone H status:**

- [ ] **CLOSED**  
- [ ] **CONTINUE OBSERVATION**  
- [ ] **RETURN TO STABILIZATION**  

**Reason:**

---

## 5. One-line rule (pin this)

> **If H is noticeable, it is not ready.**

---

## 6. How to use this (important)

**Do not:**

- Over-log every tiny case  
- Over-analyze  

**Do:**

- Sample **real** conversations  
- Log roughly **10–20 entries per day**  
- Stay **honest** on the removal test  

---

## 7. Final insight (Wisewave)

This template is **not** primarily for measurement.

It is for **detecting when the system starts trying too hard**.

---

## 8. Optional upgrades (future)

Wisewave suggested (not required for paper use):

- **Notion / Airtable** — auto-calculate suppression ratio + drift tallies  
- **Semi-automated QA logger** — Nova integration so logging lives in-system  

If Tree wants either, scope as a **separate** task; observation mode stays **no-change** unless approved.
