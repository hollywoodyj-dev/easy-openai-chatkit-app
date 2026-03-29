# HC-OS V1 — Milestone I Lumen QA Result (v12 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova weak-edge admission layer  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v12`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v12.

QA focus:
- does the new weak-edge admission layer open at all?
- does D bucket recover at all?
- does any weak-edge admission reach the survival corridor?
- does all of this stay flat in weight?

## 1. Headline result
**v12 is still functionally flat versus v8 / v9 / v10 / v11 on Phase A.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v12`
- **I emitted:** 5
- **Weak-edge admission opened:** 0
- **Weak survival corridor opened:** 0
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0

### By bucket
- **A (Clear → Clear):** 2 / 4 emitted
- **B (Clear → Indirect):** 1 / 4 emitted
- **C (Indirect → Clear):** 2 / 4 emitted
- **D (Weak / Boundary):** 0 / 4 emitted

### Comparison
- **v8:** 5 / 16 emitted
- **v9:** 5 / 16 emitted
- **v10:** 5 / 16 emitted
- **v11:** 5 / 16 emitted
- **v12:** 5 / 16 emitted

So the hosted product truth remains unchanged.

## 2. Most important finding
### The weak-edge admission layer never opened
Observed:
- `debug_milestone_i_weak_edge_admission_decision` was null / inactive on all 16 cases
- `debug_milestone_i_weak_edge_admission_reasons` never showed a live admitted path
- `debug_milestone_i_weak_edge_self_turn_strength` was not populated into an active admission route on the actual set

Interpretation:
- the weak-edge admission map exists in code
- but on the real Phase A cases, it still never becomes an active hosted decision path

This is the key product truth.
The new upstream admission layer still did not become real in hosted behavior.

## 3. D bucket remains fully collapsed
Cases:
- `D1`
- `D2`
- `D3`
- `D4`

Observed suppression reasons:
- `vague_source`
- `promotion_not_granted`
- `thin_user_message`

Observed structure:
- core family still resolved to `unknown`
- no weak-edge admission decision opened
- no survival corridor decision opened
- no D case emitted

So the weak-boundary pocket is still blocked **before** the new admission layer can matter.

## 4. What still held well
Even though v12 did not widen support further, it preserved the same healthy safety state:
- no weight-guard triggers
- no cross-family false carry
- no visible mechanism drift
- successful A/B/C paths remained ultra-light

So v12 is not a regression in safety.
It is simply not a gain in coverage.

## 5. Lumen judgment
### Honest read
**v12 confirms that the current bottleneck is still earlier than weak-edge admission activation.**

The system now contains:
- bridge logic
- then survival corridor logic
- then weak-edge admission logic upstream of corridor

But on the actual hosted Phase A set:
- none of these weak-edge mechanisms become active
- D bucket remains fully shut

So the problem is no longer "we need one more downstream survival layer."
The product truth now says:

**the real D-bucket cases still are not being recognized as admissible weak self-blame inputs at all.**

## 6. Best next debugging question for Nova
The next question is now extremely sharp:

**What exact earlier classifier or heuristic still prevents D-bucket cases from being seen as weak self-blame candidates before admission logic even begins?**

Specifically inspect:
- why `core_family` still resolves to `unknown`
- why weak-edge self-turn strength does not become an active admission path
- whether D bucket language is still being routed as thin/vague before self-blame directionality becomes eligible
- whether the actual D cases need a different weak self-blame signature than the current map expects

## 7. One-line conclusion
**Hosted v12 did not improve Phase A beyond v8/v9/v10/v11: same 5/16 success pattern, D bucket still 0/4, and the new weak-edge admission layer never activated on any case.**
