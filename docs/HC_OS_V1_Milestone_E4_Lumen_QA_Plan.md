# Lumen QA plan — Milestone E4 (minimal consciousness layer proof)

**Owner:** Lumen  
**Scope:** Closure proof only — **no new features**.

**Default Nova expectation:** **No code changes** for E4 unless this plan surfaces a **coherence, boundedness, trust, or regression defect**. If a defect appears, file only the smallest justified fix request.

---

## 1. What E4 QA is proving

**Acceptance statement:**

> The system can help one repeated inner pattern become visible, remain legible, become clearer, and fade appropriately without becoming heavy, intrusive, or memory-first.

**Judgment rule:** Evaluate **whole-layer coherence and quality**, not feature count.

**E4 is a proof-of-transition step, not an expansion step.**
It should prove that Milestone E has crossed from a high-quality reflective slice into a **minimal, bounded, trustworthy continuity layer**.

### Quality lenses

All E4 judgments must use these lenses together:

- reflection-first
- lightness / restraint
- trust / legibility
- boundedness / anti-drift
- quiet decay
- EN / ZH baseline parity
- founder-readable coherence

---

## 2. Required checks → Lumen QA passes

| # | Required check | How to prove |
|---|----------------|--------------|
| 1 | One repeated inner pattern can emerge credibly | Same-family substrate produces a credible recurrence cue only when support is earned |
| 2 | That pattern can remain legible lightly across time | Recurrence remains brief, secondary, and non-history-like across the session arc |
| 3 | That pattern can become clearer without becoming heavier | User-facing legibility improves without denser tone, stronger authority, or more product weight |
| 4 | That pattern can decay quietly when support weakens | Silence / suppression / fade are visibly valid outcomes; null cue can be correct |
| 5 | Reflection remains primary throughout | The main assistant reflection remains the center of gravity; continuity stays subordinate |
| 6 | The experience remains a continuity layer, not history/tracking/memory-first | No surface creep, no unjustified persistence, no memory-forward feel |
| 7 | EN / ZH baseline compatibility holds | Same function and trust behavior in both languages, without requiring literal phrasing parity |
| 8 | E1 + E2 + E3 behave as one coherent layer | Emergence, carry-forward, legibility, and suppression feel like one bounded layer rather than separate tricks |

---

## 3. Minimum successful founder arc (must be explicitly demonstrated)

Pass A cannot be marked complete unless the run shows **all four** of these in one continuous arc:

1. **At least one credible emergence**  
   One repeated inner pattern becomes visible with enough support.

2. **At least one light render**  
   The pattern is surfaced in a way that is easier to notice, but still secondary and non-heavy.

3. **At least one justified silence / decay outcome**  
   The same layer shows restraint when present support weakens; no forced cue.

4. **Reflection-first feel survives throughout**  
   Even when continuity is active, the product still reads as reflection-first rather than continuity-first.

If any of the four are missing, Pass A is incomplete even if individual debug signals look good.

---

## 4. Recommended pass structure

Run on **hosted** if available (preferred), or local with DB if needed, using **one continuous session** with preserved cookie/session context.

### Pass A — Whole-layer founder arc (EN)

Goal: prove that E1 + E2 + E3 now read as one bounded continuity layer.

Required beat sequence:

1. **Emergence** — same-family pattern earns visibility
2. **Persistence** — the pattern remains lightly legible across the next turn(s)
3. **Legibility** — recurrence becomes easier to recognize without becoming denser
4. **Quiet decay / silence** — when support weakens, the layer suppresses or fades naturally
5. **Reflection-first confirmation** — the core product read remains reflective, not analytical or memory-first
6. **Boundedness / trust confirmation** — no sticky carry-forward, no unjustified knowing, no extra surfaces

**Pass A must be judged twice:**
- **Product read:** could a founder understand the layer without explanatory gymnastics?
- **Debug support:** do the internal fields support the visible behavior without contradicting it?

### Pass B — Governance / proof discipline

Explicitly verify:

- proof before retention
- legibility before carry-forward
- memory subordinate to explanation
- silence is valid
- decay is quiet
- no hidden accumulation driving visible behavior
- no last-minute scope creep or feature widening

When cue is null, distinguish:
- **upstream null**: recurrence was not sufficiently supported
- **E3 null**: recurrence may have been recognized, but user-facing suppression was justified

### Pass C — EN / ZH parity baseline

Run a shorter Chinese arc mirroring Pass A:
- one emergence path
- one render path if stable
- one silence / decay path

**Pass C standard:** function parity, trust parity, restraint parity, and reflection-first parity — **not** literal wording equality.

---

## 5. Founder-readable acceptance rule

E4 is **not** accepted if it only makes sense after heavy debug interpretation.

A founder should be able to look at the product behavior and directly see:

- a reflection occurs
- one repeated pattern becomes visible
- that pattern stays lightly legible
- it can become clearer without becoming heavier
- it can fall away when support weakens
- the product still feels reflection-first and bounded

Debug evidence can support the judgment, but must not be the only reason the judgment works.

---

## 6. Evidence capture template (per pass)

Record all of the following:

- environment (hosted / local)
- session id
- user messages or script reference
- UI read:
  - reflection primary?
  - cue visible?
  - one sentence / bounded?
  - heavy or light?
- API / debug evidence as available:
  - `recurrence_cue`
  - `continuity_insight.continuity_key`
  - aligned instance count / recurrence support fields
  - E2 phase / suppression / repeat controls
  - E3 proof threshold / legibility / suppression reason fields
- verdict:
  - Pass / Revise
  - owner: Nova vs test construction vs wording bar
- founder-readable note:
  - does the layer stand on product behavior without debug explanation?

---

## 7. Final output for Tree / OctopusMind / Wisewave

Produce one **E4 closure summary** containing:

- Pass / Revise per required check
- governance verdict
- EN / ZH parity verdict
- founder-demo verdict
- explicit closure recommendation:
  - **Milestone E can close**
  - or **Milestone E should not close pending defect / drift / coherence issue**

---

## 8. Out-of-scope guardrail

E4 QA must not justify:

- new memory features
- broader persistence depth
- more UI surfaces
- new pattern classes
- history tooling
- analytics tooling
- recommendation behavior
- generalized consciousness claims

If QA feedback implies expansion rather than closure proof, reject that feedback as out of scope.

---

## 9. Pass 1 execution note

Pass 1 starts with **Pass A (EN founder arc)**.

Pass 1 target outcome:
- determine whether the current product can already demonstrate the minimum successful founder arc without code changes
- if not, isolate the smallest justified defect or coherence gap

If product evidence is unavailable in the current cycle, Pass 1 remains **In Progress — awaiting product evidence**, not Pass.
