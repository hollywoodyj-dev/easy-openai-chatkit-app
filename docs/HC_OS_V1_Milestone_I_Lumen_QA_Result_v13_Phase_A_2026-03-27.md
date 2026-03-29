# HC-OS V1 — Milestone I Lumen QA Result (v13 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova weak-edge-before-promotion reordering  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v13`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v13.

QA focus:
- does the reordered weak path finally activate weak-edge admission on real cases?
- does any of that flow through to the survival corridor?
- does D bucket recover at all?
- does weight stay flat?

## 1. Headline result
**v13 finally activated weak-edge admission on some real weak cases, but still did not recover D bucket or improve overall Phase A results.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v13`
- **I emitted:** 5
- **Weak-edge admission opened:** 4
- **Weak survival corridor opened:** 0
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0

### By bucket
- **A (Clear → Clear):** 2 / 4 emitted
- **B (Clear → Indirect):** 1 / 4 emitted
- **C (Indirect → Clear):** 2 / 4 emitted
- **D (Weak / Boundary):** 0 / 4 emitted

### Comparison
- **v12:** 5 / 16 emitted, weak-edge admission 0, corridor 0
- **v13:** 5 / 16 emitted, weak-edge admission 4, corridor 0

So v13 changed the internal path, but not the product outcome.

## 2. Most important finding
### Weak-edge admission is now real in hosted behavior
This is the first version where the new upstream layer actually activated.

Observed active weak-edge admission cases:
- `A3`
- `B3`
- `C3`
- `D3`

Observed pattern:
- `weak_edge_admission_decision = reject`
- reasons mostly `not_self_blame_family`
- self-turn strength populated (`clear_but_faint` / `faint`)

Interpretation:
- the reordering fix worked
- weak-edge admission is no longer being skipped by earlier promotion gating
- the system is now reaching the intended decision layer on real hosted cases

That is a real debugging improvement.

## 3. But the corridor still never opens
Observed:
- `debug_milestone_i_weak_survival_corridor_decision` remained inactive on all 16 cases
- no corridor allowance ever became active
- no D case emitted

Interpretation:
- the bottleneck has moved forward one stage
- it is no longer "weak-edge admission never runs"
- it is now "weak-edge admission runs, but rejects the real weak cases before corridor entry"

So the current product truth is:
**the system now sees the weak edge, but still does not accept it as self-blame continuity.**

## 4. D bucket status
Cases:
- `D1`
- `D2`
- `D3`
- `D4`

Observed:
- still 0 / 4 emitted
- `D3` now reached weak-edge admission and was rejected as `not_self_blame_family`
- other D cases still died earlier via `vague_source`, `thread_not_supported`, or `thin_user_message`

This means D-bucket remains the unresolved pocket.

## 5. Safety status
Safety remains clean:
- no weight-guard triggers
- no cross-family false carry
- no visible mechanism drift
- successful A/B/C paths remain ultra-light

So v13 is not a regression.
It simply does not yet convert the new internal activation into real weak-edge survival.

## 6. Lumen judgment
### Honest read
**v13 is the first hosted proof that the weak-edge admission layer is alive, but it still rejects the real weak cases, so Phase A remains unchanged in product behavior.**

This is meaningful because it sharpens the next problem:
- before v13: weak-edge logic never activated
- after v13: weak-edge logic activates, but classifies the actual weak cases as not admissible self-blame

## 7. Best next debugging question for Nova
The next question is now extremely precise:

**Why are the weak cases that reach admission still being classified as `not_self_blame_family` instead of admissible faint self-blame?**

Especially inspect:
- `A3`
- `B3`
- `C3`
- `D3`

Those are now the key diagnostic cases.

## 8. One-line conclusion
**Hosted v13 improved the debugging truth but not the product outcome: weak-edge admission now activates on real cases, but still rejects them before corridor entry, so Phase A remains stuck at the same 5/16 result with D bucket 0/4.**
