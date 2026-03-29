# HC-OS V1 — Milestone I Lumen QA Result (Pass 4)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** API-first / Stability + parity + boundary retest  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v1`

## 0. Scope
Pass 4 was run to check whether Milestone I's previously observed narrow hosted-positive path would hold again under a fresh retest, and whether nearby ZH variants / EN parity paths had improved.

Focus:
- does the earlier ZH self-blame positive path repeat again?
- do nearby ZH variants promote from collapse to support?
- does EN parity appear yet?
- do rest-worth boundary cases stay correctly out of I?

## 1. Headline result
Pass 4 came back **fully suppressed**.

### Summary metrics
- **Cases tested:** 8
- **I emitted:** 0
- **I suppressed:** 8
- **Repeated positive path:** 0
- **ZH nearby variants promoted:** 0
- **EN parity positives:** 0
- **Boundary cases correctly kept out of I:** 2

## 2. What happened
### Previously proven narrow ZH path did not repeat
Case:
- `i-p4-01-zh-self-blame-baseline-repeat`

Observed:
- `i_outcome = suppressed`
- `i_suppressed_reason = thread_not_supported`
- `previous_family = replay_for_mistakes`
- `current_family = fallback_generic`
- `thread_strength = none`

This matters because Pass 3 had produced one narrow hosted-positive proof on this family. In Pass 4, that proof did **not** repeat.

## 3. Nearby ZH variants
Cases:
- `i-p4-02-zh-self-blame-compatible-variant`
- `i-p4-03-zh-self-blame-softer-variant`

Observed common pattern:
- `i_outcome = suppressed`
- `i_suppressed_reason = weak_thread_candidate`
- `current_family = fallback_generic`
- `thread_strength = weak`

Interpretation:
- these variants did not fully collapse to `thread_not_supported`
- but they still did not promote into a usable I-positive path
- current hosted behavior can weakly sense thread shape here, but not strongly enough to emit

## 4. EN parity
Cases:
- `i-p4-04-en-self-blame-baseline`
- `i-p4-05-en-self-blame-variant`
- `i-p4-06-en-self-blame-softer`

Observed common pattern:
- `i_outcome = suppressed`
- `i_suppressed_reason = thread_not_supported`
- `current_family = fallback_generic`
- `thread_strength = none`

Interpretation:
- EN parity remains unproven
- the hosted admission path still does not reliably resolve these English second turns into supported thread shapes

## 5. Boundary control
Cases:
- `i-p4-07-zh-rest-worth-boundary`
- `i-p4-08-en-rest-worth-boundary`

Observed:
- both suppressed by `recurrence_overlap_e`

Interpretation:
- this part still looks healthy
- rest-worth remains owned by E rather than leaking into I
- boundary discipline is stronger than positive admission reliability right now

## 6. Lumen judgment
### Current status
**Milestone I is still not stable enough to claim.**

Pass 3 showed one narrow hosted-positive proof. Pass 4 failed to reproduce it.

So the honest read now is:
- the mechanism is **possible**
- but the admission path is still **fragile / non-repeatable**
- current hosted behavior is better described as **intermittently provable** rather than stable

## 7. Product checkpoint
What can be claimed honestly:
- I is not purely theoretical
- boundary control against E overlap is working
- there are hints that some nearby ZH variants are at least weakly recognized

What still cannot be claimed:
- repeatable positive proof
- robust second-turn thread admission
- EN/ZH parity
- milestone-level stability

## 8. Recommended next step
If Nova continues on I, the highest-value target is not broad wording work.
It is the **second-turn family resolution / admission reliability** problem:
- reduce `fallback_generic` on the self-blame family
- convert weak thread candidates into supported threads where appropriate
- only after that, re-check EN parity

## 9. One-line conclusion
**Pass 4 pulled Milestone I back from “narrow positive proof” to “fragile and non-repeatable”: no I cue emitted in 8 hosted cases, boundary control still held, but repeatable admission and EN parity remain unproven.**
