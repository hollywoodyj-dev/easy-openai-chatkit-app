# HC-OS V1 — Milestone I Lumen QA Result (v9 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova weak-family survival bridge  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v9`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v9.

QA focus:
- does D bucket recover at all?
- does the new weak-family bridge fire in the intended cases?
- does recovery happen without any weight increase?
- does anything else widen unintentionally?

## 1. Headline result
**v9 produced no practical Phase A gain over v8.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v9`
- **I emitted:** 5
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0
- **Weak-promotion bridge used:** 0

### By bucket
- **A (Clear → Clear):** 2 / 4 emitted
- **B (Clear → Indirect):** 1 / 4 emitted
- **C (Indirect → Clear):** 2 / 4 emitted
- **D (Weak / Boundary):** 0 / 4 emitted

### Comparison vs v8
- **v8:** 5 / 16 emitted
- **v9:** 5 / 16 emitted
- bucket distribution unchanged
- no new visible success path opened

## 2. Most important finding
### The bridge never actually activated
This is the key product truth.

Observed:
- `debug_milestone_i_weak_promotion_bridge_used = false` on all 16 cases

Interpretation:
- the new weak-family survival bridge did not engage on the current Phase A set
- D-bucket failures are still occurring *before* the bridge can matter, or outside the conditions needed to qualify for it

So v9 does **not** yet prove weak-family recovery.

## 3. D bucket stayed fully collapsed
Cases:
- `D1`
- `D2`
- `D3`
- `D4`

Observed suppression reasons:
- `vague_source`
- `promotion_not_granted`
- `thin_user_message`

Notably:
- no D case emitted
- no D case used the bridge
- no D case showed a new protected weak-family path

This means the exact bottleneck Nova targeted is still not functionally open in hosted behavior.

## 4. What still held well
Even though v9 did not widen support further, it did preserve the good control state from v8:
- no weight-guard triggers
- no cross-family mis-carry
- no visible mechanism drift
- no heavier cue behavior in successful paths

So v9 is not a regression in safety.
It is just not a gain in coverage.

## 5. Lumen judgment
### Honest read
**v9 is functionally flat versus v8 on Phase A.**

What this means:
- the weak-family bridge idea may be structurally reasonable
- but on the actual hosted test set, the bridge conditions are not being reached
- the current limiting step still appears earlier than the bridge activation point, or the candidate cases are not being classified into the qualifying weak-promotion path

## 6. Best next debugging question for Nova
The key question is now:

**why are the D-bucket candidates never reaching a state where `weak_promotion_bridge_used` can become true?**

Specifically inspect:
- are D cases still failing core family recognition too early?
- are they missing `promotion_state = weak_promotion` entirely?
- are `thin_user_message` / `vague_source` / `promotion_not_granted` still dominating before bridge qualification is possible?
- is the bridge conditioned too narrowly for the actual weak-family shapes in the Phase A set?

## 7. One-line conclusion
**Hosted v9 did not improve Phase A beyond v8: same 5/16 success pattern, D bucket still 0/4, and the new weak-family bridge never fired on any case.**
