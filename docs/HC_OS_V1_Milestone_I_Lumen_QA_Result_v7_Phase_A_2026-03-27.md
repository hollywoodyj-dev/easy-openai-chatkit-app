# HC-OS V1 — Milestone I Lumen QA Result (v7 Phase A)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova control-layer tightening  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v7`

## 0. Scope
This pass ran Wisewave's full Phase A self-blame widening set against hosted v7.

QA focus:
- does self-blame phrasing support widen?
- do previously working narrow paths stay alive?
- does weight stay flat?
- do new control-layer guards over-suppress valid widening?

## 1. Headline result
**v7 stayed disciplined and light, but Phase A widening is still too narrow.**

### Summary metrics
- **Cases tested:** 16
- **Build observed:** `milestone_i_soft_continuity_v7`
- **I emitted:** 2
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0

### By bucket
- **A (Clear → Clear):** 2 / 4 emitted
- **B (Clear → Indirect):** 0 / 4 emitted
- **C (Indirect → Clear):** 0 / 4 emitted
- **D (Weak / Boundary):** 0 / 4 emitted

## 2. What passed
### Two ZH clear-path cases emitted lightly
Cases:
- `A2`
- `A4`

Observed common pattern:
- `core_thread_family = self_blame`
- `core_confidence = weak`
- `core_use_fallback_generic = false`
- `promotion_confidence = weak`
- `promotion_state = weak_promotion`
- `promotion_template_allowance = ultra_light_only`
- `i_outcome = emitted`

Emitted cues:
- `那种氛围好像还在这里轻轻停留着。`
- `那种东西可能还在附近，只是现在轻了一些。`

Lumen read:
- both remain light enough
- neither crossed into obvious memory-feel / visible mechanism
- no weight-drift red flag in the successful paths

## 3. What failed
### Phase A success bar was not met
Wisewave's intended pass bar for Phase A was:
- A bucket stable
- B bucket at least 50% carry
- D bucket not fully collapsed
- no weight increase

Hosted v7 only met the last condition.

It did **not** meet:
- A stability (only 2/4)
- B widening (0/4)
- D weak-family survival (0/4)

### English remains materially behind
All EN cases suppressed.
Common failure pattern:
- `core_thread_family = unknown`
- `core_use_fallback_generic = true`
- `promotion_not_granted` or `thread_not_supported`

So parity is still nowhere near ready.

### Indirect widening still did not open
The most important B bucket did not move.
Notably:
- `B2` and `B4` were suppressed as `thin_user_message`
- `B1` fell to `thread_not_supported`
- `B3` hit `promotion_not_granted`

This means v7 control tightening did **not** translate into meaningful same-family widening yet.

### Weak / boundary survival still absent
D bucket fully suppressed:
- some as `vague_source`
- some as `thin_user_message`
- some as `promotion_not_granted`
- some as `thread_not_supported`

This is safer than over-triggering, but it fails the weak-family survival goal for Phase A.

## 4. What v7 did achieve
Even though widening did not open enough, v7 did accomplish something important:
- no weight guard fires on this set
- no cross-family mis-carry on this set
- successful cues stayed ultra-light
- control-layer tightening did not cause obvious heaviness drift

So the current shape is:
**safe and quiet, but still under-admitting.**

## 5. Lumen judgment
### Honest read
**v7 is healthier as a control layer than as a widening layer.**

It succeeded at:
- preserving lightness
- avoiding visible mechanism feel
- not over-triggering

It did not succeed at:
- materially widening self-blame phrasing support
- keeping weak-family cases alive
- carrying indirect transitions
- improving EN readiness

## 6. Best next question for Nova
The immediate issue is no longer weight drift.
The issue is:

**did the new control layer over-tighten admission so much that valid same-family indirect / weak cases are getting filtered out before promotion can matter?**

Especially inspect:
- why B bucket still collapses to `thin_user_message` / `thread_not_supported`
- why weak-family D bucket has no surviving path at all
- whether current thin/vague heuristics are too aggressive for Phase A widening

## 7. One-line conclusion
**Hosted v7 Phase A stayed light and disciplined with no visible drift, but it did not widen self-blame support enough to pass Phase A: only 2 of 16 cases emitted, both narrow ZH clear-path cases.**
