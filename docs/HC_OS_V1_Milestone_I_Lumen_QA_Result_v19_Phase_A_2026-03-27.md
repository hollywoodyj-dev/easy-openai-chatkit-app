# HC-OS V1 — Milestone I Lumen QA Result (v19 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova D4 activation fix  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v19`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v19.

QA focus:
- does D4 finally activate the residual carry shape?
- do v17/v18 survivor cases hold?
- does D2 recover?
- does safety stay flat?

## 1. Headline result
**v19 does not improve on v18, and still does not beat v17.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v19`
- **I emitted:** 7
- **Weak-edge admission opened:** 5
- **Weak survival corridor opened:** 2
- **Residual movement opened:** 5
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
- **v19:** 7 / 16 emitted, D = 1 / 4

So v19 is effectively flat with v18 and still below v17.

## 2. What held
### A3 and D3 still survive
This remains the good news.

Observed:
- `A3` still emits through weak-edge + corridor path
- `D3` still emits through weak-edge + corridor path
- both remain ultra-light
- no safety drift appears

So the v17-era gains in those cases are still preserved.

## 3. What failed
### The D4-focused fix still never activated
Observed on `D4`:
- still suppressed
- `suppressed_reason = thin_user_message`
- no weak-edge admission activation
- no corridor activation
- `debug_milestone_i_weak_edge_residual_carry_shape_used = false`

This means the targeted v19 fix did **not** become real in hosted behavior.

### D2 still did not recover
Observed on `D2`:
- still suppressed
- no recovery back to the v14/v17-style weak-boundary success path

So the D-bucket shape remains weaker than v17.

## 4. Mechanism read
The key product truth is:
- the intended D4 activation path is still not activating on the real D4 case
- the patch did not restore D2
- the only reliable weak-boundary survivor remains `D3`

So v19 does not move the frontier.
It mostly confirms the same picture as v18.

## 5. Safety / weight status
Safety remained clean:
- `weight_guard_triggered = 0`
- `cross_family_blocked = 0`
- no visible mechanism drift
- no heavier cue feel

So v19 is safe, but not stronger.

## 6. Lumen judgment
### Honest read
**v19 is another hold, not a product advance.**

It preserves:
- A3
- D3
- overall lightness

But it does not achieve the intended D4-first frontier fix.
And it does not recover D2.

So the best product version still remains **v17**.

## 7. Best next question for Nova
The next question remains:

**Why does the residual-carry-shape path still never activate on D4 in hosted behavior, even after v19 removed the earlier hard dependency?**

That is still the unresolved frontier.

## 8. One-line conclusion
**Hosted v19 is effectively flat with v18: it preserves A3 and D3, but D4 still does not activate the new residual carry shape, D2 still does not recover, and v17 remains the strongest Phase A product result so far.**
