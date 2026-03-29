# HC-OS V1 — Milestone I Lumen QA Result (Pass 3)
**Date:** 2026-03-27  
**Owner:** Lumen  
**Mode:** API-first / Stability-and-parity check  
**Environment:** Hosted (`ENABLE_I_CARRYOVER=true`)  
**Build marker observed:** `milestone_i_soft_continuity_v1`

## 0. Scope
Pass 3 was designed as a small stability/parity checkpoint after Milestone I achieved its first hosted-positive emission path.

Focus:
- does the positive self-blame path repeat?
- does the emitted sentence still feel light enough to keep?
- do nearby variants also work, or collapse?
- is EN parity appearing yet?

## 1. Headline result
Milestone I is now **partially proven**, but still **fragile and narrow**.

### What passed
A hosted-positive Milestone I emission repeated successfully on the same ZH self-blame path:
- `i-p3-01-zh-self-blame-baseline`

Observed:
- `i_outcome = emitted`
- `family_compatible = true`
- `thread_strength = strong`

Emitted sentence:
- `这里流动着一种相似的底色。`

### What failed
Nearby variants and EN parity cases still did not hold.

## 2. Summary metrics
- **Cases tested:** 6
- **I emitted:** 1
- **I suppressed:** 5
- **Confirmed positive path:** 1
- **Nearby variants that collapsed:** 4
- **E-overlap control suppressed:** 1

## 3. Positive case judgment
### Case
- `i-p3-01-zh-self-blame-baseline`

### Full ending
`像是表面上还没有任何新动静，底下那股"多半是我错了"的倾向却没停。事情其实还悬着，心里已经先把责任接过去了。 这里流动着一种相似的底色。`

### Removal-first judgment
If the Milestone I sentence is removed:
- the response becomes slightly cleaner
- but also slightly more reset

Lumen judgment:
- **KEEP (narrowly)**

Why:
- the appended line is atmospheric rather than recall-like
- it increases continuity lightly rather than visibly
- it is more subtle than earlier I-positive wording
- it does not create strong memory-feel, replay-feel, or obvious continuity-mechanism feel

## 4. What still failed
### Suppressed nearby variants
- `i-p3-02-zh-self-blame-near-variant`
- `i-p3-03-zh-self-blame-softer`
- `i-p3-04-en-self-blame-parity`
- `i-p3-05-en-self-blame-parity-variant`

Common pattern:
- `current_family = fallback_generic`
- `family_compatible = false`
- `thread_strength = none`
- `i_suppressed_reason = thread_not_supported`

Interpretation:
- Milestone I can now work on one specific hosted path
- but small wording shifts still collapse second-turn admission
- EN parity is not yet proven

### Control case
- `i-p3-06-zh-rest-worth-control`
- suppressed by `recurrence_overlap_e`

Interpretation:
- rest-worth family still belongs to E in practice under current hosted behavior
- it does not currently provide a usable positive-proof family for I

## 5. Lumen judgment
### Current status
**Milestone I is no longer unproven.**

It now has:
- at least one repeatable hosted-positive carry-over path
- an emitted sentence that can survive removal-first judgment narrowly

### But
Milestone I is **not broadly stable yet**.

It remains:
- narrow
- fragile
- wording-sensitive
- not yet parity-proven in English

## 6. Product checkpoint
This is enough to say:
- the mechanism can work
- the milestone is not purely theoretical
- soft carry-over can be made real without immediately turning into visible continuity behavior

This is **not** enough to say:
- Milestone I is broadly robust
- EN/ZH parity is solved
- positive proof is stable across multiple nearby formulations

## 7. Recommended stop point
Do not keep overfitting tonight.

Use this as the current checkpoint:
- Milestone I has achieved first positive hosted proof
- but only on a narrow ZH self-blame path
- broader stability and EN parity remain open questions

## 8. One-line conclusion
**Milestone I is now partially proven on hosted: one ZH self-blame carry-over path emits and can be kept narrowly, but the milestone remains fragile and not yet broadly stable or parity-proven.**
