# Phase 7 — Pattern Heatmap + Tuning Strategy

## HC-OS V1 — Habit Formation Diagnostic Layer

---

## 0. Only purpose

**Which return patterns are forming repeat trust, and which are not?**

This is not about:
- which pattern is used more
- which pattern has a higher click rate

It is about:

**in which moments of real need Continue is being chosen again**

---

## 1. Pattern Heatmap

### 1.1 Locked dimensions

Each pattern should be judged through four metrics:

1. **Exposure**
2. **Click**
3. **Repeat-use** ⭐ core signal
4. **Strong-path quality**

### 1.2 Core heatmap panel

**PHASE 7 PATTERN HEATMAP**

| Pattern | Exposure | Click | Repeat-use | Strong-path | Status |
|---|---:|---:|---:|---:|---|
| unfinished_emotional_residue | 32% | 48% | 41% | 82% | 🟢 STRONG |
| interrupted_articulation | 28% | 52% | 45% | 85% | 🟢 STRONG |
| recent_unfinished_return | 22% | 39% | 33% | 80% | 🟡 EMERGING |
| delayed_reply_replay | 19% | 36% | 21% | 78% | 🟡 WEAK EDGE |
| worth_pressure_loop | 17% | 34% | 14% | 70% | 🔴 BROKEN |
| low_verbal_resumable_return | 15% | 22% | 9% | 65% | 🔴 BROKEN |

---

## 2. Pattern classification logic

### 🟢 STRONG

Condition:
- repeat-use is rising
- strong-path is stable

Meaning:
- users are beginning to remember that Continue is useful in this kind of situation

### 🟡 EMERGING

Condition:
- repeat-use is above baseline
- but still unstable

Meaning:
- trust exists, but repeat selection is not yet stable

### 🔴 BROKEN

Condition:
- click is acceptable
- but repeat-use remains low

Meaning:
- users tried it, but do not want to use it again

This is one of the most important Phase 7 signals.

---

## 3. Key diagnostic insight

The most dangerous pattern is:

**high click + low repeat-use**

That means:
- the mechanism looks useful once
- but does not convert into trust

In other words:

**one-time consumption, not habit formation**

---

## 4. Add restart cost as a required dimension

Each pattern should also carry a restart-cost label:

```ts
type RestartCost = "low" | "medium" | "high";
```

### Example view

| Pattern | Restart Cost |
|---|---|
| unfinished_emotional_residue | HIGH |
| interrupted_articulation | HIGH |
| worth_pressure_loop | HIGH |
| low_verbal_resumable_return | LOW |

### Key tuning rule

**High restart cost + low repeat-use = tuning priority #1**

---

## 5. Tuning strategy

### A. STRONG patterns — do not disturb

Rule:

**Do not optimize strong patterns.**

Nova should only:
- protect the strong path
- prevent suppression tuning from breaking it

Principle:

**A strong pattern is already a working habit seed.**

### B. EMERGING patterns — light tuning only

Core condition:
- trust exists
- but reuse is not stable yet

Nova may tune:
- option clarity
- surfacing timing
- suppression precision

Do not:
- increase exposure
- add explanation

### C. BROKEN patterns — main tuning battlefield

This is where Phase 7 should focus.

#### Step 1 — classify failure type

Each broken pattern should be tagged with one primary failure type:

- **A. weak resumed-turn**
- **B. too much effort after click**
- **C. low distinctiveness**
- **D. wrong timing**
- **E. not worth using again**

#### Step 2 — match strategy to failure

**A. Weak resumed-turn**
- problem: user clicks, but the system does not really pick it up
- Nova response: improve resumed-turn coherence

**B. Too much effort after click**
- problem: user still has to restate too much
- Nova response: reduce required input after click

**C. Low distinctiveness**
- problem: Continue is not meaningfully better than typing normally
- Nova response: improve selection precision and resumed-turn coherence for that pattern
  (do not add explanation UI, visibility, or conceptual weight)

**D. Wrong timing**
- problem: Continue appears when the user does not need it
- Nova response: tighten admissibility / improve timing precision

**E. Not a suitable pattern**
- problem: this pattern may not belong in Continue scope
- Tree response: remove the pattern from scope

---

## 6. Lumen QA module upgrade

Every broken pattern should produce a failure breakdown.

### Example

**Pattern:** worth_pressure_loop  
**Cases:** 12

**Failure breakdown:**
- weak resumed-turn: 5
- low distinctiveness: 4
- wrong timing: 3

**Conclusion:**
Primary issue = resumed-turn quality

This prevents vague QA summaries and makes tuning direction explicit.

---

## 7. Tree decision panel

Tree should look at a compact habit-status summary:

**PHASE 7 HABIT STATUS**

- Strong patterns: 2
- Emerging patterns: 2
- Broken patterns: 2
- High restart cost broken: 1 ⚠️

**Decision:**
- continue focused tuning
- do not expand scope

---

## 8. Locked tuning principles

### Rule 1

**Fix broken patterns. Do not expand working ones.**

### Rule 2

**Never increase exposure to fix repeat-use.**

### Rule 3

**If a pattern repeatedly fails to form repeat trust after bounded tuning, mark it for Tree de-scope review (do not auto-remove on a single weak window).**

---

## Final insight

**Habit does not form because something is available.**

**Habit forms because something worked last time.**

---

## One-line summary

**Pattern Heatmap is not about where Continue appears.**

**It is about where Continue earns the right to appear again.**
