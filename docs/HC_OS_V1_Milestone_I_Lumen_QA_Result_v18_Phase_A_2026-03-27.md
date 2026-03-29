# HC-OS V1 — Milestone I Lumen QA Result (v18 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova D4-first residual-carry-shape patch  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v18`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v18.

QA focus:
- does `D4` improve?
- do v17 gains hold?
- does the new residual carry shape debug path actually activate?
- does safety stay flat?

## 1. Headline result
**v18 is a mixed result: it preserves some v17 gains, but it does not improve the frontier and is not stronger than v17 overall.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v18`
- **I emitted:** 7
- **Weak-edge admission opened:** 4
- **Weak survival corridor opened:** 2
- **Residual movement opened:** 4
- **Residual carry shape used:** 0
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0

### By bucket
- **A (Clear → Clear):** 3 / 4 emitted
- **B (Clear → Indirect):** 1 / 4 emitted
- **C (Indirect → Clear):** 2 / 4 emitted
- **D (Weak / Boundary):** 1 / 4 emitted

### Comparison
- **v17:** 8 / 16 emitted, D = 2 / 4
- **v18:** 7 / 16 emitted, D = 1 / 4

So v18 did not improve on v17.

## 2. What held from v17
### A3 and D3 remained alive
This is important.

Observed:
- `A3` still emitted through weak-edge + corridor path
- `D3` still emitted through weak-edge + corridor path
- both stayed ultra-light
- no weight drift appeared

So v18 did preserve part of the v17 expansion.

## 3. What failed
### D4 did not improve
This was the main targeted frontier patch.

Observed on `D4`:
- still suppressed
- `suppressed_reason = thin_user_message`
- no weak-edge admission activation
- no corridor activation
- `debug_milestone_i_weak_edge_residual_carry_shape_used = false`

This means the new D4-specific patch did **not** fire on the actual hosted D4 case.

### D2 regressed
Observed on `D2`:
- no longer emitted
- reverted to suppression

So D bucket dropped from:
- **v17: 2 / 4**
- **v18: 1 / 4**

## 4. Mechanism read
The key product truth is:
- the new residual-carry-shape patch never actually activated
- the intended D4 fix did not become real in hosted behavior
- meanwhile one earlier weak-boundary success (`D2`) was lost

So this is not a clean frontier advance.
It is a partial hold with one regression.

## 5. Safety / weight status
Safety remained clean:
- `weight_guard_triggered = 0`
- `cross_family_blocked = 0`
- no visible mechanism drift
- no heavier cues

So v18 did not introduce safety damage.

## 6. Lumen judgment
### Honest read
**v18 is not the new best version. v17 remains the stronger product result.**

Why:
- v18 kept A3 and D3 alive
- but failed to improve D4
- and lost D2
- the targeted new patch never fired on its intended case

So the frontier did not move in the way this patch intended.

## 7. Best next question for Nova
The next question is now very concrete:

**Why did the new residual carry shape path never activate on `D4`, and why did the same patch also fail to preserve `D2`?**

That is the real follow-up.

## 8. One-line conclusion
**Hosted v18 is a mixed hold, not an improvement: A3 and D3 remain alive, but D4 did not move, the new residual-carry-shape path never fired, and D2 regressed, so v17 remains the strongest Phase A product result so far.**
