# HC-OS V1 — Milestone I Lumen QA Result (v4 Map Retest)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** Hosted API-first retest against Nova thread-family-map update  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v4`

## 0. Scope
This retest was run directly against Nova's new Milestone I thread-family-map engine.

QA focus:
- does indirect ZH self-blame stop collapsing so easily?
- does `core_use_fallback_generic` drop materially?
- do over-effort and bracing start resolving as distinct families?
- are Pass-3-like positives becoming repeatable?
- is EN parity ready to examine yet?

## 1. Headline result
**Hosted v4 improved family recognition internally, but did not yet produce visible Milestone I success.**

### Summary metrics
- **Cases tested:** 8
- **Build observed:** `milestone_i_soft_continuity_v4`
- **I emitted:** 0
- **I suppressed:** 8
- **`core_use_fallback_generic = false`:** 1
- **Visible repeatable positive paths:** 0

So the map work is directionally real, but still not enough to count as product-level stability.

## 2. Strongest positive signal
### One indirect ZH self-blame case was recognized by the new core map
Case:
- `i-v4-02-zh-selfblame-indirect-soft`

Observed:
- `core_thread_family = self_blame`
- `core_confidence = strong`
- `core_reasons = [movement_direction_match, secondary_support]`
- `core_use_fallback_generic = false`

This is important because it proves the new map can now detect one of the target indirect second-turn shapes as a real family rather than generic residue.

### But
The product outcome still was:
- `i_outcome = suppressed`
- `i_suppressed_reason = weak_thread_candidate`

So the new engine improved recognition, but that improvement is **not yet converting into a visible carry-over cue**.

## 3. Self-blame family result
### ZH indirect self-blame
Cases:
- `i-v4-01-zh-selfblame-indirect-core`
- `i-v4-02-zh-selfblame-indirect-soft`
- `i-v4-03-zh-selfblame-indirect-variant`

Observed:
- all three still suppressed
- only one case (`i-v4-02`) escaped generic fallback at the core-map layer
- the other two still landed at `core_thread_family = unknown`

Interpretation:
- collapse frequency dropped slightly, but not enough
- indirect ZH self-blame is **partially improved**, not solved
- repeatability is still missing

### EN self-blame parity
Case:
- `i-v4-08-en-selfblame-indirect-parity`

Observed:
- `i_outcome = suppressed`
- `i_suppressed_reason = thread_not_supported`
- `core_thread_family = unknown`
- `core_use_fallback_generic = true`

Interpretation:
- EN parity is still not ready
- the hosted path still does not reliably recognize this English indirect self-blame shape

## 4. Over-effort family result
### ZH over-effort / rest-guilt
Case:
- `i-v4-04-zh-overeffort-rest-guilt`

Observed:
- `core_reasons = [movement_direction_match, unknown_movement_family]`
- `core_thread_family = unknown`
- `i_outcome = suppressed`

Interpretation:
- this did **not** spill into self-blame, which is good
- but it also did not cluster successfully into a usable over-effort family yet
- current map behavior suggests partial separation attempt without successful resolution

### EN over-effort / rest-guilt
Case:
- `i-v4-05-en-overeffort-rest-guilt`

Observed:
- suppressed by `recurrence_overlap_e`

Interpretation:
- boundary control still dominates here
- that remains healthier than false-positive I carry-over

## 5. Bracing family result
Cases:
- `i-v4-06-zh-bracing-anticipatory-tension`
- `i-v4-07-en-bracing-anticipatory-tension`

Observed:
- both suppressed
- both still landed with `core_thread_family = unknown`
- both stayed in weak-thread territory rather than promoting to a usable bracing path

Interpretation:
- bracing is not yet stably recognized as a distinct supported family in hosted behavior
- separation intent may exist in code, but it is not yet showing up as QA-proof behavior

## 6. Lumen judgment
### Honest read
**This is an internal-logic improvement, not yet a milestone-level QA win.**

What improved:
- one target ZH indirect self-blame case now resolves correctly at the new core-map layer
- generic fallback pressure reduced slightly in at least one meaningful case

What did not improve enough:
- zero I emissions
- zero repeatable positives
- most target cases still fall back to unknown/generic behavior
- EN parity is still clearly premature
- bracing and over-effort are not yet visibly stable as separate working families

## 7. Best next question for Nova
The right next target is now narrower:

**Why does a correctly recognized core family (`self_blame`, `core_use_fallback_generic=false`) still end in `weak_thread_candidate` suppression instead of a usable Milestone I emission?**

That is now the bottleneck.
Not wording.
Not parity.
Not broad family-map expansion.

## 8. One-line conclusion
**Hosted Milestone I v4 proves the new family map can improve internal recognition in at least one real target case, but it still produces 0 visible I emissions, so the update is directionally right without yet being a product-level breakthrough.**
