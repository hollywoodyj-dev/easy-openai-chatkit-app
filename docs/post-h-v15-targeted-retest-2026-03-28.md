# Post-H v15 Targeted Retest — 2026-03-28
**Run owner:** Lumen  
**Hosted build observed:** `milestone_h_v15`  
**Scope:** Nova requested targeted retest for the Day 4 / Day 5 ZH H4 corridor patch, plus regression watch rows.

## Scope covered
### Minimum target cases
- `h-d05-003`
- `h-d05-004`
- `h-d05-006`

### Preferred target cases
- `h-d04-003`
- `h-d04-004`

### Regression watch
- EN Day 5 comparison cases:
  - `h-d05-001`
  - `h-d05-002`
  - `h-d05-005`
  - `h-d05-007`
- `h-d05-009` vague-source mixed case
- factual suppressions:
  - `h-d05-010`
  - `h-d05-011`
- Day 3 baseline pack:
  - `h-d03-001` → `h-d03-012`

## Top-line result
### Hosted marker confirmed
- all retested rows returned `debug_milestone_h_build_marker = milestone_h_v15`

### Patch outcome
- **Partial success, not closure**

Minimum set:
- `h-d05-003` → **still emitted H4**
- `h-d05-004` → **still emitted H4**
- `h-d05-006` → **suppressed** with new reason:
  - `h4_zh_comparison_keepup_corridor_main_reflection_sufficient`

Preferred set:
- `h-d04-003` → **still emitted H4**
- `h-d04-004` → **still emitted H4**

So the patch landed on one target lane, but did **not** clear the main high-signal survivors.

## What held cleanly
### EN comparison regression watch held
- `h-d05-001` → suppressed
- `h-d05-002` → suppressed
- `h-d05-005` → suppressed
- `h-d05-007` → suppressed

### Mixed / factual guardrails held
- `h-d05-009` → suppressed via `vague_source`
- `h-d05-010` → suppressed via `utilitarian_or_factual`
- `h-d05-011` → suppressed via `utilitarian_or_factual`

So Nova's patch did **not** create the feared EN or factual regressions.

## Important Day 3 regression watch read
Day 3 baseline mostly stayed suppressed, but one row reopened:
- `h-d03-003` → **emitted H1**

Observed cue:
- `这里或许有值得留意的地方，还不必急着把它说清楚。`

This is not the same corridor Nova patched, and it does **not** look like an H4 regression from the new ZH comparison rule. But it does mean the targeted retest is **not perfectly clean overall**, because the old Day 3 baseline is no longer fully flat in this snapshot.

## Lumen interpretation
### What v15 successfully proved
Nova's patch is correctly shaped and safely bounded:
- ZH-only
- H4-only
- no EN regression
- no factual regression
- one intended target (`h-d05-006`) now suppresses with the exact new reason

So the patch logic is real and active on hosted.

### What v15 did **not** prove
It did not suppress the main high-signal survivors that motivated the patch:
- `h-d05-003`
- `h-d05-004`
- `h-d04-003`
- `h-d04-004`

That means the current corridor detection is still **too narrow** relative to the actual survivor cluster.

## Best current read
The patch likely matched a **narrow keep-up / comparison corridor**, but the highest-signal survivors are still escaping through adjacent shapes such as:
- prove / not-enough / self-negation under comparison
- slight coldness → not-good-enough collapse
- proving /撑住 /扛稳 family expressed more indirectly than the current corridor catches

In plain terms:
> the suppression rule is firing, but only on part of the real residual family.

## Recommendation to Nova
Do **not** broad-retune H4.

Instead, do a **second surgical widening** of the same ZH H4 corridor so it also catches the still-surviving high-signal forms behind:
- `h-d05-003`
- `h-d05-004`
- `h-d04-003`
- `h-d04-004`

Most likely needed:
- widen the narrow corridor pattern beyond current keep-up wording
- include nearby comparison → self-negation / prove-pressure / slight-coldness→not-enough collapse shapes
- keep the same `main_reflection_sufficient` gate
- keep EN / factual / vague-source untouched

## One-line conclusion
**Hosted `milestone_h_v15` is a safe partial win: the new ZH H4 corridor suppression is real and regression-safe, but it only cleared `h-d05-006` and missed the main high-signal survivors, so Post-H is improved again but still not closed.**
