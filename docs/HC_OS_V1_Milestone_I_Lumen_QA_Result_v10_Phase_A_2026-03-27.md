# HC-OS V1 — Milestone I Lumen QA Result (v10 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova upstream weak-family qualification tweak  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v10`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v10.

QA focus:
- does D bucket open after the upstream qualification tweak?
- does `weak_promotion_bridge_used` finally activate?
- does any weak-family recovery happen without weight increase?
- do prior A/B/C gains hold steady?

## 1. Headline result
**v10 is functionally flat versus v8 / v9 on Phase A.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v10`
- **I emitted:** 5
- **Weak bridge used:** 0
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

So the hosted product truth remains unchanged across the last three Phase A reruns.

## 2. Most important finding
### The weak-family bridge still did not activate
Observed:
- `debug_milestone_i_weak_promotion_bridge_used = false` on all 16 cases

Interpretation:
- the upstream qualification tweak did not move the weak-family cases into a bridge-eligible state on the real Phase A set
- D-bucket is still not reaching the conditions required for weak-family recovery

This is the key result.
Not only did D stay flat — the intended recovery mechanism still never fired.

## 3. D bucket remains the locked pocket
Cases:
- `D1`
- `D2`
- `D3`
- `D4`

Observed suppression reasons:
- `vague_source`
- `thread_not_supported`
- `promotion_not_granted`
- `thin_user_message`

Observed structure:
- core family remained `unknown`
- no D case reached bridge use
- no D case emitted

So the weak/boundary pocket is still blocked upstream of the bridge.

## 4. What still held well
Even though v10 did not widen support further, it preserved the same good safety profile:
- no weight-guard triggers
- no cross-family false carry
- no visible mechanism drift
- successful paths remained ultra-light

So v10 is not a regression in safety.
It is just not a gain in product behavior.

## 5. Lumen judgment
### Honest read
**v10 confirms the weak-family bottleneck is still earlier than bridge activation.**

The latest narrow tweak did not change hosted truth.
That strongly suggests:
- D cases are still not entering a supported self-blame family path at the right stage
- or the bridge qualification still does not match the real D-bucket shapes in this test set

## 6. Best next debugging question for Nova
The next question is now very sharp:

**What exact upstream condition is preventing D-bucket cases from ever reaching `weak_promotion_bridge_used=true`?**

More specifically:
- are D cases still failing family recognition outright?
- are they missing `promotion_state = weak_promotion`?
- are they dying at `thread_not_supported` / `thin_user_message` / `vague_source` before a supported weak-family state exists?
- does `hasFaintSelfBlameDirection` still not trigger on the actual D-bucket wording shapes?

## 7. One-line conclusion
**Hosted v10 did not improve Phase A beyond v8/v9: same 5/16 success pattern, D bucket still 0/4, and the weak-family bridge still never activated on any case.**
