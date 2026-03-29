# HC-OS V1 — Milestone I Lumen QA Result (v14 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova present-turn inward-evidence weak-edge patch  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v14`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v14.

QA focus:
- do the v13 frontier cases stop being blocked as not-self-blame?
- does D bucket finally recover at all?
- does any of that happen without visible weight drift?

## 1. Headline result
**v14 is the first real Phase A product gain since v8: D bucket finally opened, while weight stayed flat.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v14`
- **I emitted:** 6
- **Weak-edge admission opened:** 4
- **Weak survival corridor opened:** 0
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0

### By bucket
- **A (Clear → Clear):** 2 / 4 emitted
- **B (Clear → Indirect):** 1 / 4 emitted
- **C (Indirect → Clear):** 2 / 4 emitted
- **D (Weak / Boundary):** 1 / 4 emitted

### Comparison
- **v13:** 5 / 16 emitted, D = 0 / 4
- **v14:** 6 / 16 emitted, D = 1 / 4

This is the first hosted proof that the weak-boundary pocket is not totally closed.

## 2. Strongest positive finding
### D bucket finally opened
Case:
- `D2`

Observed:
- `i_outcome = emitted`
- `thread_strength = moderate`
- `core_family = self_blame`
- `core_use_fallback_generic = false`
- `promotion_state = weak_promotion`
- `promotion_template_allowance = ultra_light_only`
- cue remained light

Emitted line:
- `那里面可能还有一点点留在这里。`

Lumen read:
- this is a real product gain
- it is still light enough to keep
- it does not create obvious memory-feel / mechanism-feel drift

So Phase A finally has:
- clear-path success
- some indirect widening success
- and now at least one weak/boundary survival success

## 3. What changed in the frontier
### Weak-edge admission stayed live, but EN weak cases still reject
Frontier cases monitored:
- `A3`
- `B3`
- `C3`
- `D3`

Observed:
- weak-edge admission still activates on them
- but they still reject
- rejection reason shifted to `not_weak_family`
- no corridor opening yet

Interpretation:
- this is not full frontier resolution
- but it is a sharper and more honest failure mode than before
- the system is now admitting at least one ZH weak boundary case (`D2`) while still rejecting the harder EN weak cases

## 4. Safety / weight status
Safety stayed clean:
- `weight_guard_triggered = 0`
- `cross_family_blocked = 0`
- no visible mechanism drift
- successful cues remained ultra-light

That matters because the D-bucket gain did **not** come from making the cue heavier.

## 5. Lumen judgment
### Honest read
**v14 is the first meaningful weak-boundary breakthrough.**

It does not complete Phase A.
But it does change the milestone status:
- before v14: D bucket fully collapsed
- after v14: D bucket has at least one hosted-positive survival case

So the right state label now is:
- Phase A still not fully passed
- but weak-edge survival is no longer purely theoretical

This is a meaningful improvement.

## 6. What still fails
Phase A still does **not** fully pass because:
- A is still only 2 / 4
- B is still only 1 / 4
- EN remains materially behind
- frontier EN weak cases still reject before any corridor path opens

So the milestone is still narrow.
But it is now less narrow than before in a real product sense.

## 7. Best next question for Nova
The next frontier is now very clear:

**Why does ZH weak-boundary self-blame now survive in D2, while the remaining frontier weak cases (`A3`, `B3`, `C3`, `D3`) still reject as not-weak-family / not-admissible?**

Those four are now the key diagnostic comparison set.

## 8. One-line conclusion
**Hosted v14 is the first real weak-boundary product gain: Phase A improved from 5/16 to 6/16, D bucket finally opened with one light ZH survival case, and this happened without any visible weight drift — but the wider frontier still remains unresolved.**
