# HC-OS V1 — Milestone I Lumen QA Result (v11 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova weak-survival corridor layer  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v11`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v11.

QA focus:
- does the new weak-survival corridor open at all?
- does D bucket recover at all?
- does recovery happen without weight increase?
- do prior A/B/C gains remain stable?

## 1. Headline result
**v11 is functionally flat versus v8 / v9 / v10 on Phase A.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v11`
- **I emitted:** 5
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

So the hosted product truth still has not changed.

## 2. Most important finding
### The new weak-survival corridor never opened
Observed:
- `debug_milestone_i_weak_survival_corridor_decision` was null / closed on all 16 cases
- `debug_milestone_i_weak_survival_corridor_template_allowance` never activated
- `debug_milestone_i_weak_survival_corridor_reasons` never produced a live corridor path

Interpretation:
- the corridor layer exists in code
- but on the real Phase A set, it is still not being reached as an active decision path

This is the core result.
The intended weak-family survival mechanism still did not become real in hosted behavior.

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
- core family remained `unknown`
- no D case emitted
- no D case opened the survival corridor

So the weak boundary pocket is still blocked upstream of the survival mechanism.

## 4. What still held well
Even though v11 did not widen support further, it preserved the same healthy safety state:
- no weight-guard triggers
- no cross-family false carry
- no visible mechanism drift
- successful A/B/C paths remained ultra-light

So v11 is not a regression in safety.
It is simply not a gain in coverage.

## 5. Lumen judgment
### Honest read
**v11 confirms the same truth as v9/v10: weak-family survival is still failing before the new survival layer can actually matter.**

The system now contains:
- a bridge concept
- then a survival corridor concept

But on the actual hosted set:
- neither one opens
- D bucket stays fully shut

So the current bottleneck is not “absence of weak survival logic.”
It is:

**the real D-bucket cases are still not reaching a supported weak self-blame state where that logic can activate.**

## 6. Best next debugging question for Nova
The next question is now very sharp:

**What upstream classifier/gate still prevents D-bucket cases from entering a live weak self-blame corridor state at all?**

Specifically inspect:
- why D cases still resolve to `core_family = unknown`
- why `promotion_state` remains `none`
- why corridor decision is never reached as an active branch
- whether the weak-family inputs are still being classified too early as thin/vague/unsupported before self-blame directionality becomes admissible

## 7. One-line conclusion
**Hosted v11 did not improve Phase A beyond v8/v9/v10: same 5/16 success pattern, D bucket still 0/4, and the new weak-survival corridor never opened on any case.**
