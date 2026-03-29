# Post-H v16 Targeted Retest — 2026-03-28
**Run owner:** Lumen  
**Hosted build observed:** `milestone_h_v16`  
**Scope:** Same targeted retest set used for v15, after Nova widened the surgical ZH H4 comparison corridor.

## Scope covered
### Primary target rows
- `h-d05-003`
- `h-d05-004`
- `h-d05-006`
- `h-d04-003`
- `h-d04-004`

### Regression watch
- EN Day 5 comparison rows:
  - `h-d05-001`
  - `h-d05-002`
  - `h-d05-005`
  - `h-d05-007`
- `h-d05-009` vague-source mixed case
- factual suppressions:
  - `h-d05-010`
  - `h-d05-011`
- Day 3 check including `h-d03-003`

## Top-line result
### Hosted marker confirmed
- all retested rows returned `debug_milestone_h_build_marker = milestone_h_v16`

### Patch outcome
- **Meaningful improvement over v15, but still not fully closed**

Primary targets:
- `h-d05-003` → **suppressed**
  - `h4_zh_comparison_keepup_corridor_main_reflection_sufficient`
- `h-d05-004` → **still emitted H4**
- `h-d05-006` → **suppressed**
  - `h4_zh_comparison_keepup_corridor_main_reflection_sufficient`
- `h-d04-003` → **still emitted H4**
- `h-d04-004` → **suppressed**
  - `h4_zh_comparison_keepup_corridor_main_reflection_sufficient`

So compared with v15:
- before: 1 / 5 target rows suppressed
- now: **3 / 5 target rows suppressed**

## What held cleanly
### EN regression watch held
- `h-d05-001` → suppressed
- `h-d05-002` → suppressed
- `h-d05-005` → suppressed
- `h-d05-007` → suppressed

### Mixed / factual guardrails held
- `h-d05-009` → suppressed via `vague_source`
- `h-d05-010` → suppressed via `utilitarian_or_factual`
- `h-d05-011` → suppressed via `utilitarian_or_factual`

So the v16 widening still looks safely bounded.

## Remaining H4 survivors
### `h-d05-004`
Input:
> 我忍不住拿自己和别人比，越比越停不下来。

Observed H4 still surviving:
> 那种想把事情做对、把局面撑住的用力，或许可以稍微松一点点。

Read:
- still a direct comparison / spiral case
- current widening helped adjacent rows but did not catch this exact "越比越" downward-comparison loop strongly enough

### `h-d04-003`
Input:
> 哪怕一点点冷淡，我就会开始怀疑自己是不是不够好。

Observed H4 still surviving:
> 那种想把事情做对、把局面撑住的用力，或许可以稍微松一点点。

Read:
- still the slight-coldness → self-negation collapse shape
- patch narrowed the family but did not fully capture this rejection-sensitivity / not-good-enough branch

## Day 3 note
`h-d03-003` still emitted **H1**:
- cue: `这段话里真正在用力的地方，也许值得先停一下再整理。`

This does **not** look like the v16 H4 corridor itself regressing; it remains a separate Day 3 H1 issue. But it means the broader retest picture is still not fully flat.

## Lumen interpretation
### What v16 successfully proved
- Nova's widened corridor is real
- it improved the hit rate materially
- it stayed bounded
- it did not reopen EN / factual / vague-source regressions

That is a real step forward.

### What v16 still leaves unresolved
Two high-signal ZH H4 survivors remain:
- `h-d05-004`
- `h-d04-003`

These do not look like a reason to broad-retune H4. They look like **one last narrow residual split** inside the same family cluster:
- comparison spiral / 越比越停不下来
- slight-coldness → not-good-enough collapse

## Recommendation
### If doing one more pass
Do **one last micro-pass**, not a broad patch.

Target only the two remaining survivor shapes:
1. direct comparison spiral (`越比越停不下来` / comparison quickly becoming self-verdict)
2. slight social coldness / distance → immediate self-negation (`冷淡` → `我不够好`)

Keep:
- ZH-only scope
- H4-only scope
- same `main_reflection_sufficient` gate
- EN / factual / vague-source untouched

### If stopping here
v16 is already a meaningful containment improvement and might be acceptable if the team no longer needs near-clean closure on this specific residual lane.

## One-line conclusion
**Hosted `milestone_h_v16` is a strong bounded improvement over v15: 3 of the 5 primary ZH H4 targets now suppress while regressions stay clean, but two high-signal survivors remain (`h-d05-004`, `h-d04-003`), so Post-H is closer but still not fully closed.**
