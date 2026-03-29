# HC-OS V1 — Milestone I Lumen QA Result (v17 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova residual-movement map patch  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v17`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v17.

QA focus:
- can residual movement make weak-edge survival product-real beyond a single case?
- does D bucket recover meaningfully?
- do frontier weak cases finally survive?
- does safety stay clean?

## 1. Headline result
**v17 is the strongest Phase A product result so far.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v17`
- **I emitted:** 8
- **Weak-edge admission opened:** 5
- **Weak survival corridor opened:** 2
- **Residual movement opened:** 5
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0

### By bucket
- **A (Clear → Clear):** 3 / 4 emitted
- **B (Clear → Indirect):** 1 / 4 emitted
- **C (Indirect → Clear):** 2 / 4 emitted
- **D (Weak / Boundary):** 2 / 4 emitted

### Comparison
- **v14:** 6 / 16 emitted, D = 1 / 4
- **v15:** 5 / 16 emitted, D = 0 / 4
- **v17:** 8 / 16 emitted, D = 2 / 4

This is a real and meaningful product gain.

## 2. Strongest positive findings
### A3 finally survives
This is the first meaningful EN frontier breakthrough in this run set.

Observed on `A3`:
- `weak_edge_admission_decision = admit_strong_weak_edge`
- `weak_survival_corridor_decision = ultra_light_survival`
- `promotion_state = weak_promotion`
- `promotion_template_allowance = ultra_light_only`
- emitted cue stayed light

This matters because A3 had been one of the recurring frontier failures.

### D bucket now reaches 2 / 4
Cases emitted:
- `D2`
- `D3`

Especially important:
- `D3` is the first weak EN boundary case in this frontier set to survive through the weak-edge + corridor path

Observed on `D3`:
- `weak_edge_admission_decision = admit_fragile`
- `weak_survival_corridor_decision = ultra_light_survival`
- `residual_movement_decision = residual_movement_present`
- `promotion_state = weak_promotion`
- emitted cue stayed ultra-light

This is the clearest proof so far that the residual-movement patch is doing real product work.

## 3. What changed mechanistically
The best reading of v17 is:
- weak-edge activation is now product-real
- corridor survival is now product-real
- residual movement can now keep some weak cases alive enough to cross into ultra-light carry-over

That is the first time this whole chain has clearly worked in hosted behavior on more than one narrow path.

## 4. Safety / weight status
Safety stayed clean despite the wider support:
- `weight_guard_triggered = 0`
- `cross_family_blocked = 0`
- no visible mechanism drift
- emitted weak-edge outputs remained light enough to keep

This is crucial.
The support widened **without** obvious weight cost.

## 5. What still fails
Phase A is still **not fully closed**.

Remaining gaps:
- B bucket still only **1 / 4**
- C bucket still only **2 / 4**
- `B3` still rejects
- `C3` still rejects
- `D4` still fails

So the milestone is still uneven.
But it is much healthier than before.

## 6. Lumen judgment
### Honest read
**v17 is the first version that feels like a real Phase A expansion rather than just a debugging improvement.**

Why:
- top-line product result improved materially
- D bucket moved from isolated proof toward repeatable weak-boundary survival
- at least one EN frontier weak case (`A3`) now survives
- one weak EN boundary case (`D3`) now survives through the weak-edge/corridor path
- safety remained flat

This does not yet mean Phase A is closed.
But it does mean:

**Milestone I is no longer just proving weak-edge survival can happen. It is starting to show that weak-edge survival can happen in more than one real shape without becoming heavier.**

## 7. Best next question
The next frontier is now narrower:

**Why do `B3` and `C3` still reject while `A3`, `D2`, and `D3` now survive?**

Those cases now form the most useful comparison cluster.

## 8. One-line conclusion
**Hosted v17 is the strongest Phase A result so far: total emits improved to 8/16, D bucket rose to 2/4, A3 and D3 finally survived through the weak-edge/corridor path, and all of this happened without visible weight drift or safety regression.**
