# HC-OS V1 — Milestone I Lumen QA Result (v8 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova admission rebalance  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v8`

## 0. Scope
This pass reran Wisewave's full Phase A self-blame widening set against hosted v8.

QA focus:
- did deferring thin/vague/minimal-affect prechecks recover valid same-family widening?
- did B/C buckets open without weight drift?
- did successful v7 paths remain light?
- did D weak-family boundary survival improve at all?

## 1. Headline result
**v8 materially improved Phase A coverage without visible weight drift.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v8`
- **I emitted:** 5
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0

### By bucket
- **A (Clear → Clear):** 2 / 4 emitted
- **B (Clear → Indirect):** 1 / 4 emitted
- **C (Indirect → Clear):** 2 / 4 emitted
- **D (Weak / Boundary):** 0 / 4 emitted

### Direct comparison vs v7
- **v7:** 2 / 16 emitted
- **v8:** 5 / 16 emitted

So the targeted admission rebalance did real work.

## 2. Strongest positive change
### B and C buckets finally opened
This is the key improvement over v7.

New successful widening paths:
- `B2` — ZH clear → indirect
- `C2` — ZH indirect → clear
- `C4` — ZH indirect → clear

Observed common pattern in the successful widened paths:
- `core_thread_family = self_blame`
- `core_confidence = weak`
- `core_use_fallback_generic = false`
- `thread_strength = moderate`
- `promotion_confidence = weak`
- `promotion_state = weak_promotion`
- `promotion_template_allowance = ultra_light_only`
- `i_outcome = emitted`

This is exactly the kind of narrow widening Phase A was meant to test:
more supported same-family phrasing shapes, but still only via ultra-light carry-over.

## 3. Weight / visibility read
### No visible drift showed up in the successful cases
Important control signals:
- `weight_guard_triggered = 0`
- no cue visibly shifted into heavy / explanatory / memory-like territory
- successful carry-over remained ultra-light
- no obvious "system knows you" jump

Lumen read:
- coverage improved while presence stayed flat enough
- this is the first widening step today that looks directionally healthy rather than merely safer or merely more permissive

## 4. What still failed
### Phase A still does not fully pass
Wisewave's intended Phase A bar was:
- A bucket stable
- B bucket at least 50% carry
- D bucket not fully collapsed
- no weight increase

Hosted v8 now meets only part of that:
- **weight stayed flat** → yes
- **A stable** → not yet (2/4)
- **B at least 50% carry** → not yet (1/4)
- **D not fully collapsed** → not yet (0/4)

So v8 is a real improvement, but still not a Phase A pass.

### English remains materially behind
All EN cases still suppressed.
Common failure pattern:
- `core_thread_family = unknown`
- `core_use_fallback_generic = true`
- `thread_not_supported` or `promotion_not_granted`

So parity remains clearly premature.

### Weak / boundary bucket still fully collapsed
D bucket stayed at 0 / 4.
This means:
- weak-family survival is still not there
- admission got better for moderate same-family paths
- but not yet for true weak / boundary cases

## 5. What changed technically in product truth
Nova's stated v8 adjustment was narrow: defer thin/vague/minimal-affect prechecks until after thread detection.

Hosted results match that claim.
The visible effect was:
- previously over-killed moderate same-family ZH paths can now reach promotion
- successful widening comes through as `weak_promotion` + `ultra_light_only`
- the change did not cause obvious over-triggering

So the current real hosted shape is:
**better admission for credible moderate same-family paths, without obvious weight cost.**

## 6. Lumen judgment
### Honest read
**v8 is the first real widening improvement after v7 over-tightened admission.**

What it achieved:
- recovered multiple ZH widening paths
- kept cues light
- avoided visible weight drift
- did not relax into false carry on this set

What it still has not achieved:
- full A-bucket stability
- enough B-bucket indirect success
- any D-bucket weak-family survival
- meaningful EN readiness

## 7. Best next question for Nova
The next bottleneck is now clearer:

**How do we preserve the current flat weight while helping true weak / boundary self-blame cases survive just enough to avoid total collapse?**

Secondary question:
- can one more narrow phrasing-support pass improve B bucket without touching cue weight?

The main warning:
- do not buy D-bucket survival by making cues more present

## 8. One-line conclusion
**Hosted v8 is a real Phase A improvement over v7: support widened from 2/16 to 5/16, including the first successful B and C bucket paths, while weight stayed flat — but Phase A still is not fully passed because B remains too low, D fully collapses, and EN is still absent.**
