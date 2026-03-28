# Post-H Nova Patch Brief — After Day 4 + Day 5
**Date:** 2026-03-28  
**Owner:** Lumen  
**Hosted build baseline:** `milestone_h_v14`

## Patch goal
Tighten one narrow residual Post-H opening without disturbing the broader gains already holding on hosted.

## Current honest read
This is **not** broad instability anymore.

The remaining problem is now reading as a **narrow ZH-side H4 admission corridor**, with a smaller adjacent ZH H1 edge from Day 4.

Broad containment that is already working:
- EN cases are holding in Day 4 and Day 5
- factual suppression is holding
- vague-source suppression is holding
- no clear noticeability / authority / interpretation drift in these two packs

So this should be a **surgical patch**, not a broad retune.

## What to patch
### Primary target
Reduce **ZH H4 admission** for comparison / self-measurement / keep-up-pressure language where the main reflection already carries enough weight and the H4 cue is removable.

### Secondary target
Keep an eye on the nearby **ZH H1 edge** seen on Day 4, but do not broaden the patch so much that it harms the now-stable suppression gains.

## Evidence cases
### Day 5 — strongest proof of the main residual corridor
These three all survived and all read removable:
- `h-d05-003` — ZH high-signal reflective → H4
- `h-d05-004` — ZH high-signal reflective → H4
- `h-d05-006` — ZH medium reflective → H4

Observed H4 text families:
- `想把一切都扛稳的劲儿，在这里也许不必绷得那么满。`
- `那种想把事情做对、把局面撑住的用力，或许可以稍微松一点点。`

### Day 4 — adjacent evidence showing the neighborhood is still too open
- `h-d04-003` — ZH high-signal reflective → H4
- `h-d04-004` — ZH high-signal reflective → H4
- `h-d04-006` — ZH medium reflective → H1
- `h-d04-012` — ZH low-signal mixed → H1

Interpretation:
- Day 5 narrows the picture and suggests the main issue is H4 on ZH comparison / keep-up shapes
- Day 4 shows there is nearby H1 softness too, but patching should start with the clearer H4 corridor first

## Working hypothesis
The current ZH routing still treats certain comparison / self-measurement / pressure-to-keep-up language as sufficiently admissible for a light easing H4 cue, even when:
- the reflection already lands the point
- the cue adds little new value
- removal makes the response cleaner

This looks less like a wording problem and more like an **admission threshold problem** in this specific semantic corridor.

## Desired patch behavior
For ZH cases in this corridor:
- if the response already has an adequate main reflection,
- and the H4 cue would mainly function as a soft easing add-on,
- prefer **suppression** over H4 emission.

In plain terms:
> when the system detects ZH comparison / self-measurement / catching-up pressure, it should be harder than it is now for H4 to survive as an added "ease the pressure" line.

## Non-goals
Do **not**:
- broadly weaken H4 everywhere
- retune EN paths based on this evidence
- reopen factual suppression work
- chase Day 4's low-signal H1 case with a big cross-lane rewrite before the H4 corridor is handled

## Suggested implementation direction
Prefer one of these narrow strategies:
1. **ZH corridor deny / dampener**
   - detect comparison / self-measurement / keep-up-pressure semantics in ZH
   - if main reflection is already sufficient, raise the bar for H4 survival

2. **Removability-weighted H4 suppression**
   - in this corridor, treat generic easing / loosening / hold-it-together H4 phrasing as presumptively suppressible unless a stronger necessity signal is present

3. **ZH H4 template admission tightening**
   - specifically reduce admission for the reusable H4 easing templates now surviving in this corridor
   - do not change H4 globally unless needed

## Acceptance target for next hosted retest
Minimum success:
- suppress all three Day 5 survivors:
  - `h-d05-003`
  - `h-d05-004`
  - `h-d05-006`

Preferred success:
- also suppress the matching Day 4 H4 survivors:
  - `h-d04-003`
  - `h-d04-004`

Stretch success:
- avoid reopening Day 4 `h-d04-012` or other low-signal mixed cases
- preserve Day 5 holds on:
  - EN reflective comparison cases
  - factual cases
  - vague-source mixed cases

## Regression watchlist
After patching, explicitly verify these still hold:
- all EN Day 5 comparison cases stay stable and not heavier
- `h-d05-009` stays suppressed via `vague_source`
- `h-d05-010` / `h-d05-011` stay suppressed as factual
- Day 3 clean behavior does not regress

## One-line brief for Nova
**Patch the narrow ZH H4 admission corridor around comparison / self-measurement / keep-up pressure language; prefer suppression when the main reflection is already sufficient, and do not broad-retune H4 or disturb the factual / EN gains already holding on `milestone_h_v14`.**

---

## Nova implementation note (2026-03-28)

- **Shipped in repo:** `milestone_h_v15` in `lib/wisewave-milestone-h-micro-awareness.ts`.
- **Suppression reason:** `h4_zh_comparison_keepup_corridor_main_reflection_sufficient`.
- **Scope:** ZH user message (CJK present) + H4 + corridor (`constant_pressure_keep_up` **or** narrow comparison/keep-up regex on user+insight) + main reflection already materially sufficient per existing global heuristic.
