# HC-OS V1 — Milestone I Lumen QA Result — Phase C
**Date:** 2026-03-28  
**Run owner:** Lumen  
**Hosted build observed:** `milestone_i_soft_continuity_v23`  
**Phase:** C — Cross-family Transfer Test

## Scope
Phase C from `milestone-i-phase-abc-and-exit-pack-2026-03-27.md`

Buckets:
- **I** Bracing core — 6 cases
- **J** Over-effort core — 6 cases
- **K** Cross confusion — 6 cases

Total: **18 two-turn cases**

## Top-line result
- **Total reviewed:** 18
- **I emitted:** 2
- **I suppressed:** 16
- **Weight guard triggered:** 0
- **Cross-family blocked:** 0
- **Visible drift / memory-feel:** 0 observed

## Bucket summary
- **I Bracing core:** 1 / 6 emitted
- **J Over-effort core:** 1 / 6 emitted
- **K Cross confusion:** 0 / 6 emitted

## The two successful transfer cases
### Bracing success
- `I2` (ZH)
- T1: `事情还没发生，我就已经紧起来了。`
- T2: `现在还是这样，好像在提前防备。`
- Outcome: **emitted**
- Cue: `它似乎还在附近一点。`
- Debug read:
  - `core_thread_family = bracing`
  - `core_confidence = weak`
  - `signature_tier = weak_family`
  - `promotion_state = weak_promotion`
  - `promotion_template_allowance = ultra_light_only`

### Over-effort success
- `J2` (ZH)
- T1: `我会一直逼自己做事。`
- T2: `现在还是停不下来。`
- Outcome: **emitted**
- Cue: `这里好像还带着一点它的痕迹。`
- Debug read:
  - `core_thread_family = over_effort`
  - `core_confidence = weak`
  - `signature_tier = weak_family`
  - `promotion_state = weak_promotion`
  - `promotion_template_allowance = ultra_light_only`

## What Phase C proves
Phase C **does provide initial transfer proof**.

That matters because the official bar required:
1. at least one bracing path successfully carries
2. at least one over-effort path successfully carries
3. no cross-family mis-carry
4. successful cases stay flat in weight

On this run, all four conditions are met:
- one bracing path carried (`I2`)
- one over-effort path carried (`J2`)
- cross confusion stayed suppressed (`K` = 0 / 6)
- no weight guard triggers or visible heaviness appeared

So the correct read is:

**Milestone I has now shown initial cross-family transfer proof.**

## Important limits
This is **not broad family support** yet.

The transfer proof is still narrow because:
- only 2 / 18 emitted
- both successful transfers were **ZH**
- both were only **weak-confidence / ultra-light-only** admissions
- most EN bracing / over-effort variants still suppressed via `thread_not_supported`, `weak_thread_candidate`, `thin_user_message`, or `vague_source`

So the current shape is:
- transfer is now **real**
- transfer is **not yet even or broad**
- the successful corridor is still quite thin

## Bucket reads
### I — Bracing core
Result: **1 / 6 emitted**

Read:
- initial bracing transfer is proven
- but only one ZH case crossed the line
- EN bracing cases mostly remained weak or unsupported

### J — Over-effort core
Result: **1 / 6 emitted**

Read:
- initial over-effort transfer is proven
- again, the clear success came on the ZH side
- most EN cases remained suppressed

### K — Cross-family confusion
Result: **0 / 6 emitted**

Read:
- this is a strong safety result
- no cross-family false carry happened
- one case (`K3`) was explicitly routed away from I due to `awareness_overlap_h`, which is a healthy subordination signal rather than a leak

## Structural debug read
The successful cases shared this pattern:
- routed through a **weak-family** path
- admitted only via **weak_promotion**
- allowed only **ultra-light-only** cueing
- no weight guard / no heavy continuity feel

That is exactly the kind of shape we would want for a first transfer proof.

The unsuccessful majority still show:
- `thread_not_supported`
- `weak_thread_candidate`
- `thin_user_message`
- `vague_source`

So transfer currently exists, but the system is still highly conservative and narrow.

## Pass / revise call
### Phase C judgment: **PASS (initial transfer proof)**
Because the actual phase bar was met:
- at least one bracing success → yes
- at least one over-effort success → yes
- no cross-family mis-carry → yes
- successful cases stayed flat / ultra-light → yes

### But the maturity level is still: **early / narrow**
If someone asks whether Phase C proves broad multi-family stability, the answer is:

**No. It proves initial transfer, not broad transfer maturity.**

## Milestone I implication
This result matters for Milestone I closure logic.

Before Phase C, the transfer requirement was still unproven.
After this run:
- self-blame Phase A exists
- Phase B boundary safety exists
- Phase C initial transfer now exists

So Milestone I is in a stronger structural position than before.

But the honest nuance is:
- transfer proof is still sparse
- EN/ZH experiential evenness is still not demonstrated
- current transfer is still weak-confidence and ZH-led

## Recommended next move
1. Record Phase C as **successful initial transfer proof**
2. Do **not** oversell this as broad two-family maturity
3. Use this result to support a more grounded Milestone I status review against the full exit criteria
4. If further testing happens, the next useful question is not “can transfer happen at all?” but:
   - how stable is EN / ZH parity for transfer,
   - and whether the successful weak-family transfer corridor can widen without raising presence

## One-line conclusion
**Milestone I Phase C passed: hosted `milestone_i_soft_continuity_v23` showed initial ultra-light transfer into both bracing and over-effort with zero cross-family mis-carry, but the proof is still narrow, weak-confidence, and ZH-led rather than broad multi-family maturity.**
