# HC-OS V1 — Milestone H Last-Day QA Finish Plan

**Date:** 2026-03-25  
**Owner:** Lumen  
**Audience:** Chino, Tree, Nova, Wisewave  
**Status:** Final-day execution plan  
**Phase:** Milestone H = **soft pass / stabilization**, not expansion

---

## 0. Purpose

This plan exists to answer one practical question:

> **What exact QA work do we need to finish today so Milestone H can be judged honestly, without scope drift, and without leaving the team in ambiguity?**

This is **not** a new QA framework.  
It compresses the existing stabilization doctrine into a **finishable final-day plan**.

---

## 1. What the docs say clearly

From the stabilization docs, the team position is already consistent:

- Milestone H is **validated / usable**
- Milestone H is **not hard-closed yet**
- Current mode is **containment / stabilization**
- The job is **not to grow H**
- The job is to prove H remains:
  - rare
  - light
  - removable
  - subordinate to reflection
  - subordinate to E
  - easy to suppress

### The most important operational translation

For the final day, success is **not**:
- producing more impressive H examples
- making H appear more often
- improving H “coverage”
- widening the benchmark universe for its own sake

Success **is**:
- confirming the system is stable enough to close or continue observation honestly
- proving the benchmark path is complete and interpretable
- leaving a clean decision package for Tree / Chino

---

## 2. Final-day QA decision goal

By end of today, Lumen should be able to produce **one of three clean outputs**:

1. **CLOSE-READY**  
   Milestone H can move from stabilization toward closure decision.

2. **CONTINUE OBSERVATION**  
   Milestone H is still usable, but needs another short observation window; no new build required.

3. **RETURN TO STABILIZATION / REVISE**  
   Drift or ambiguity is still too material; closure would be dishonest.

If we cannot produce one of those three by end of day, the QA plan failed.

---

## 3. Last-day acceptance frame

Use the stabilization docs as the governing frame:

### Must still be true

- **Suppression-first dominates**
- **Most turns do not need H**
- **H does not guide**
- **H does not explain the user too hard**
- **H does not add system weight**
- **H does not duplicate E or reflection**
- **If removed, the response is usually not better**
- **H remains easy to forget**

### Hard stop conditions

If today’s testing shows any of these repeatedly, do **not** pretend the milestone is ready:

- H feels like a feature
- H appears too often
- removal frequently improves the turn
- H competes with E / reflection / stack clarity
- guidance drift appears
- the system feels heavier under real use

---

## 4. Final-day scope lock

### In scope today

Only work that helps us make the final stabilization judgment:

1. **Daily core 7** — mandatory
2. **Expanded regression 14** — mandatory
3. **Confidence 25+** — recommended if time allows, but can be sampled strategically if today becomes tight
4. **Observation system integrity** — queue, snapshot, review, summary, export all must stay trustworthy
5. **Decision synthesis** — end-of-day verdict package

### Out of scope today

- new H cue types
- new UI ideas
- taxonomy expansion
- feature brainstorming
- trying to make H “nicer” by widening logic
- opening Milestone I work
- running the 14-day post-H enforcement / guardrail dashboard (that starts after H closure)

---

## 5. The right final-day structure

Do **not** run today as one giant blob.
Run it in **four finishable passes**.

---

## PASS A — Benchmark path integrity (must pass first)

### Goal
Prove the hosted observation workflow is stable enough to trust today’s results.

### Required checks

- Queue custom row creation works for benchmark sets
- Case IDs are stable and not rotating unpredictably
- Review page persists case state correctly
- Snapshot save works
- Review submit works
- Summary filter by `benchmarkSet` works
- Export / review list do not mix benchmark rows with passive rows

### Why this pass matters
If the observation system is untrustworthy, the rest of the QA day is contaminated.

### Pass output
- **PASS** = benchmark evidence is trustworthy
- **FAIL** = stop and fix tooling trust before interpreting quality data

---

## PASS B — Daily core 7 completion (must finish)

### Goal
Complete today’s health-check layer and establish whether H is still broadly stable.

### Cases
Use the locked `lumen-daily-core-7` set:

1. prove myself
2. guilt around rest
3. no reply anxiety
4. replay conversations
5. constant pressure
6. weak / ambiguous
7. emotionally loaded everyday

### Required judgment on each case
For each reviewed turn, record:

- Did H appear?
- Should H have been suppressed?
- Any drift axis triggered?
  - guidance
  - interpretive
  - authority
  - weight
  - duplication
- Removal test result:
  - better
  - same
  - worse
- Final verdict:
  - PASS
  - REVISE
  - REMOVE

### Daily-core exit rule
We should not move into confidence language unless the 7-case set still looks healthy.

### Healthy read
- Weak case suppresses correctly
- No obvious therapist / coaching drift
- No obvious H over-emission
- No fresh stack / duplication surprise

---

## PASS C — Expanded regression 14 completion (must finish)

### Goal
Confirm the watchpoint lanes are still contained, especially where H3 has historically been softer.

### Focus clusters
Today’s 14-case set matters less as a raw number and more as a stress test for known weak zones:

- prove / earn / enough variants
- replay / rumination variants
- weak / low-signal suppression
- ordinary no-reply anxiety variants
- guilt / rest body-vs-rule variants

### What we are trying to learn
Not “Can H appear in more places?”

Instead:
- Is H3 still too generic?
- Is H over-firing on soft substrate?
- Is replay / rumination still the softest lane?
- Is suppression still stronger than the temptation to keep a mildly useful cue?

### Regression exit rule
If the 14-case layer shows repeated removal-better outcomes or frequent weight drift, closure today is not honest.

---

## PASS D — Decision confidence pack (finish if feasible, sample if needed)

### Goal
End the day with enough breadth that Tree / Chino can trust the final recommendation.

### Preferred full version
Run the full `lumen-confidence-25` benchmark set.

### If time becomes tight
Use a **targeted confidence sample** instead of pretending partial work is full completion.

#### Minimum acceptable targeted sample
Take at least:
- 4 prove / earn family
- 4 guilt / rest family
- 4 no-reply family
- 4 replay / rumination family
- 4 constant-pressure / adjacent pressure family
- 2 weak / ambiguous / low-signal controls
- 2 emotionally loaded everyday cases

That gives a **24-case near-equivalent sample** with family coverage.

### Important rule
If we do not finish the full 25+, label it honestly as:

> **targeted confidence sample, not full confidence set**

---

## 6. Exact QA lens for final-day judging

For every H appearance, use this order:

### 1. Removal test first

> If I remove H, is the response better, same, slightly worse, or clearly worse?

Interpretation:
- better -> remove
- same -> remove
- slightly worse -> remove
- clearly worse -> keep

### 2. Drift axes second

Check whether the cue creates:
- guidance drift
- interpretive drift
- authority drift
- weight drift
- duplication drift

### 3. Whole-turn judgment third

Do **not** score the cue in isolation.
Judge the whole response stack:
- reflection
- E/F/H layering if present
- overall readability
- whether the system feels more present than the user’s own awareness

### 4. Noticeability last

Ask:

> Does H feel like something the user could start noticing as a product behavior?

If yes, that is a stabilization warning even if the line is locally decent.

---

## 7. Final-day targets

These are the numbers / conditions we should be able to speak to by end of day.

### Quantitative targets

- Benchmark evidence path = working cleanly
- Daily core 7 = completed
- Expanded regression 14 = completed
- Confidence 25+ = completed **or** honestly labeled targeted sample
- Suppression ratio remains in the stabilization-safe zone in benchmark interpretation
- No benchmark/passive metric mixing

### Qualitative targets

- 0 clear guidance drift cases
- no repeated authority drift pattern
- replay / rumination watchpoint explicitly assessed
- weak-input suppression explicitly confirmed
- at least one real case where keeping H is justified
- majority of benchmark cases show either:
  - H absent correctly, or
  - H present but not better when removed only in rare justified cases

---

## 8. Final-day deliverables

By the end of the day, Lumen should leave these artifacts:

### Required

1. **Benchmark completion status**
   - core 7
   - regression 14
   - confidence 25 or targeted sample

2. **End-of-day judgment note**
   - CLOSE-READY / CONTINUE OBSERVATION / RETURN TO STABILIZATION

3. **Top watchpoints list**
   - max 3 items
   - concrete, not vague

4. **Decision rationale**
   - one short paragraph on why closure is or is not honest

### Strongly recommended

5. **Benchmark summary doc update** in repo docs
6. **QA results doc update** with final-day note
7. **If needed:** a short Tree-facing closure block with the exact recommendation

---

## 9. Honest finish criteria

Today counts as a successful QA day if:

- the locked benchmark path is run cleanly
- the known watchpoint lanes are tested
- the observation system remains trustworthy
- the team receives a clean end-state recommendation
- no one has to guess whether H is ready

Today does **not** require forcing a hard-close.

A final answer of:
- **continue observation**, or
- **return to stabilization**

is fully acceptable **if that is the honest result**.

---

## 10. My recommendation for today’s execution order

### Order
1. Finish / verify **Daily core 7**
2. Run **Expanded regression 14**
3. Run **Confidence 25+** or targeted confidence sample
4. Pull benchmark-filtered summary
5. Write final end-of-day judgment

### Why this order
It keeps the day:
- smallest-to-largest
- trust-first
- finishable under time pressure
- aligned with stabilization doctrine

---

## 11. Bottom-line decision rule

> **On the last day, the right QA plan is not the plan that tests the most. It is the plan that leaves the least ambiguity about whether Milestone H is stable enough to stop noticing.**

---

## 12. Recommended final verdict template

Use this exact shape at end of day:

### Milestone H final-day QA verdict

- **Benchmark path:** trustworthy / not trustworthy
- **Daily core 7:** complete / incomplete
- **Expanded regression 14:** complete / incomplete
- **Confidence layer:** complete / targeted sample / incomplete
- **Main watchpoint:** <one sentence>
- **Suppression discipline:** healthy / borderline / weak
- **Removal-first discipline:** healthy / borderline / weak
- **Closure recommendation:** CLOSE-READY / CONTINUE OBSERVATION / RETURN TO STABILIZATION
- **Reason:** <2–4 sentence honest explanation>

---

## Related docs

- `docs/HC_OS_V1_Milestone_H_Stabilization_Playbook_Short.md`
- `docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`
- `docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`
- `docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`
- `docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`
- `docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_End_of_Day_Summary.md`
- `docs/post-h-guardrail-pack.md` — post-H 14-day enforcement + drift guardrails (after closure)
