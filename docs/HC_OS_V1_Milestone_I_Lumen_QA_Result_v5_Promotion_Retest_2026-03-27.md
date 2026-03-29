# HC-OS V1 — Milestone I Lumen QA Result (v5 Promotion Retest)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova promotion-rule update  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v5`

## 0. Scope
This retest was run directly against Nova's promotion-rule fix for the v4 bottleneck.

QA focus:
- does the exact v4 blocker now emit?
- do promotion debug fields explain suppression clearly when emission does not happen?
- are there signs of broader repeatability beyond one rescued case?
- does boundary discipline still hold?

## 1. Headline result
**v5 produced the first clean hosted rescue of the exact v4 blocker case.**

### Summary metrics
- **Cases tested:** 7
- **Build observed:** `milestone_i_soft_continuity_v5`
- **I emitted:** 1
- **Promotion state present (`strong_promotion` / `weak_promotion`):** 5 cases reached promotion evaluation
- **Promotion granted to visible emission:** 1
- **Boundary control still held:** 1 E-overlap suppression case

This is a real step forward.
Not broad stability yet, but a meaningful fix to the precise v4 failure.

## 2. Strongest success
### The v4 blocker now emits on hosted
Case:
- `i-v5-01-zh-selfblame-v4-blocker`

Observed:
- `core_thread_family = self_blame`
- `core_confidence = strong`
- `core_use_fallback_generic = false`
- `thread_strength = strong`
- `promotion_state = strong_promotion`
- `promotion_reasons = [strong_family_promotable]`
- `i_outcome = emitted`

Emitted sentence:
- `这感觉还是同一个空间，只是换了一个角度。`

Full ending:
- `像是外面的安静还没结束，里面那股"先算到自己头上"的力也就一直悬着。事情还没明朗，心里已经开始提前承担了。 这感觉还是同一个空间，只是换了一个角度。`

Lumen judgment:
- **KEEP (narrowly positive)**

Why:
- it feels like light carry-over rather than mechanical recall
- it is softer than explicit memory language
- it directly answers the v4 bottleneck: recognized family is now actually promotable into visible I behavior

## 3. What still did not convert
### Other indirect ZH self-blame variants
Cases:
- `i-v5-02-zh-selfblame-indirect-core`
- `i-v5-03-zh-selfblame-indirect-variant`

Observed:
- both suppressed by `promotion_not_granted`
- both still had `core_thread_family = unknown`
- promotion debug clearly reported `no_supported_family`

Interpretation:
- this is better than the earlier opaque suppression path
- but repeatability is still limited
- the rescue currently applies to one narrow wording shape, not the whole family cluster

### Bracing / over-effort
Cases:
- `i-v5-05-zh-bracing`
- `i-v5-06-zh-overeffort`

Observed:
- both suppressed by `promotion_not_granted`
- both still reported `no_supported_family`

Interpretation:
- promotion logic is now clearer
- but family recognition outside the rescued self-blame pocket is still immature

### EN self-blame parity
Case:
- `i-v5-04-en-selfblame-parity`

Observed:
- still suppressed by `thread_not_supported`
- no usable promotion stage reached

Interpretation:
- EN parity is still not ready to claim

## 4. Boundary control
### E overlap still holding
Case:
- `i-v5-07-en-overeffort-boundary`

Observed:
- suppressed by `recurrence_overlap_e`

Interpretation:
- this remains healthy
- the promotion fix did not accidentally blow open the E/I boundary

## 5. Lumen judgment
### Honest read
**v5 is the first update today that creates a visible product-level Milestone I gain.**

Specifically:
- the exact v4 blocker is fixed on hosted
- promotion debug now makes failure reasons legible
- one narrow self-blame path can now move all the way from recognition to render

### But
Milestone I is still **narrow, not stable**.

Why:
- only 1 of 7 cases emitted
- nearby ZH variants still fail
- bracing and over-effort still do not resolve cleanly
- EN parity is still absent

## 6. Best next question for Nova
The bottleneck has narrowed again:

- v4 problem: recognized family was not promotable
- v5 fix: one recognized family is now promotable and emits
- next problem: **expand supported-family recognition so more nearby variants reach promotion at all**

So the next high-value target is:
- widen supported self-blame recognition beyond one narrow indirect phrasing cluster
- then revisit bracing / over-effort families
- only after that, revisit EN parity

## 7. One-line conclusion
**Hosted Milestone I v5 is a real improvement: it fixes the exact v4 blocker and produces one clean visible self-blame carry-over emission, but the gain is still narrow and far from broad family stability or parity.**
