# HC-OS V1 — Milestone I Lumen QA Result (v15 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova local weak-confidence fallback patch  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v15`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v15.

QA focus:
- do frontier weak cases advance beyond admission rejection?
- does corridor finally activate on real frontier weak cases?
- does D bucket improve further?
- does weight remain flat?

## 1. Headline result
**v15 changed the internal weak-edge path further, but did not improve the Phase A product result.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v15`
- **I emitted:** 5
- **Weak-edge admission opened:** 6
- **Weak survival corridor opened:** 2
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0

### By bucket
- **A (Clear → Clear):** 2 / 4 emitted
- **B (Clear → Indirect):** 1 / 4 emitted
- **C (Indirect → Clear):** 2 / 4 emitted
- **D (Weak / Boundary):** 0 / 4 emitted

### Comparison
- **v14:** 6 / 16 emitted, D = 1 / 4
- **v15:** 5 / 16 emitted, D = 0 / 4

So v15 is a product regression versus v14, even though its internal debug path got richer.

## 2. Strongest technical change
### Frontier weak cases finally advanced further internally
This is the main internal gain.

Observed:
- weak-edge admission opened on 6 cases
- corridor opened on 2 cases

Frontier diagnostics:
- `A3` → `weak_edge_admission_decision = admit_strong_weak_edge`, then `weak_survival_corridor_decision = suppress`
- `D3` → `weak_edge_admission_decision = admit_fragile`, then `weak_survival_corridor_decision = suppress`

Corridor suppression reason:
- `no_live_movement_now`

Interpretation:
- v15 successfully moved some frontier weak cases one stage deeper than v14
- the system now reaches corridor evaluation in at least part of the frontier
- but that deeper activation still does **not** convert into product-visible carry-over

## 3. Product outcome got worse
### D2 regressed
Most important product regression:
- `D2` no longer emitted
- now suppressed as `weak_thread_candidate`
- `weak_edge_admission_decision = reject`
- rejection reason: `insufficient_self_turn_strength`

This matters because:
- v14 gave the first real weak-boundary product gain via `D2`
- v15 lost that gain

So the system became internally more active on some frontier cases, but less effective on the one weak-boundary case that had actually turned product-real.

## 4. Safety status
Safety still stayed clean:
- `weight_guard_triggered = 0`
- `cross_family_blocked = 0`
- no visible mechanism drift
- no heavier cue behavior in the successful cases

So this is not a safety regression.
It is a coverage regression / routing regression.

## 5. Lumen judgment
### Honest read
**v15 is more legible internally, but worse in product truth than v14.**

What improved internally:
- weak-edge admission opened more often
- corridor finally activated on some frontier weak cases

What worsened in product behavior:
- D bucket fell back from 1 / 4 to 0 / 4
- total emits fell from 6 to 5
- the first real weak-boundary gain (`D2`) was lost

## 6. Best next debugging question for Nova
The new frontier question is now:

**Why did the local weak-confidence fallback help frontier activation but break the previously successful D2 weak-boundary path?**

The most important comparison set is now:
- `D2` in v14 vs v15
- plus `A3` / `D3` where corridor now activates but suppresses

That should show whether the new local confidence logic improved path depth at the cost of destabilizing the one weak-boundary case that had already become product-real.

## 7. One-line conclusion
**Hosted v15 is a debugging-layer improvement but a product-layer regression: weak-edge admission opened on more cases and corridor finally activated on 2 frontier weak cases, but Phase A fell back from 6/16 to 5/16 and D bucket lost the real gain achieved in v14.**
