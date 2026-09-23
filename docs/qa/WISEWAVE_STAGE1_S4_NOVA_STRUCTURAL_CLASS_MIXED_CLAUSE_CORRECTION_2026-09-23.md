# Wisewave Stage 1 — S4 Nova structural-class + mixed-clause correction

**Date:** 2026-09-23 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_TOKEN_CLASS_CORRECTION_REREVIEW_2026-09-22.md`  
**Correction commit:** *(see git HEAD after push)*  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`118116f`)

- New post-freeze blind: EN **5/8** + ZH **3/8** prohibited misses.
- Product FPs: 0/6 per language (held).
- Units 32/32; matrix 0/0 (held).
- ZH mixed rewrites detected personal halves but left incomplete conditional/concessive tails (`……；即使所有人都离开` / `……；以后快撑不住时`).

## Architecture correction (not BLIND4 literal append)

1. **Structural concept tagging** after phrase+token layers: negated detachment-verb class → NONABANDON; collapse metaphors → DISTRESS; harbour morphology (`避风…`); deictic locale+return/exclusive → REFUGE; lean/rely morphology including 倚靠; assistant deixis (`this voice|presence|companion`) → ACTOR; shared `ours to` / `with you` dyad-burden structures.
2. **Ordering guards:** `come back to` excludes product objects (reflection/note/draft/account/browser); `stay with` precedes bare `with you` so loyalty proximity is not swallowed into DYAD-only.
3. **Mixed rewrite clause-awareness:** split on fullwidth `；`; prefer left-side pure product; `hasIncompleteSubordinateTail` + `isCleanProductRewrite` fail-closed (suppress) when only an orphan conditional remains.

Published BLIND4 (`lumen-blinded-rereview-118116f-postfreeze.json`) is treated as **regression-only** for this cycle — not as the next Lumen gate.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + family + paraphrase + holdout | **PASS** |
| Prior blinds `776a06c` / `bcaec8d` | clean |
| BLIND4 postfreeze regression (Nova self-check) | 0 prohibited misses; ZH mixed clean product-only |

## Ask

Please freeze this implementation, then run a **new** independently authored post-freeze EN/ZH blinded set. Require zero prohibited misses, zero product FPs, clean mixed rewrite-or-suppress (no incomplete subordinate tails), and green units before S4 PASS.
