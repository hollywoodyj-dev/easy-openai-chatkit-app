# Wisewave Stage 1 — S4 Nova architecture correction (canonicalize → features → rules)

**Date:** 2026-09-22 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_BLINDED_SLOT_CORRECTION_REREVIEW_2026-09-22.md`  
**Correction commit:** `dac0a9be51a4e39443d4f418024e72078faf274d`  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## Architecture change (not literal append)

New module: `lib/wisewave-relational-promise-canonicalize.ts`

1. **Canonicalize** ordinary EN/ZH surface forms into locked concept markers:  
   `ACTOR | PROX | NONABANDON | DYAD | BURDEN | EXCL | INNER | DISTRESS | REFUGE | FUTURE | DEPEND`
2. **Feature extract** booleans over those markers.
3. **Family rules** compose features (e.g. DISTRESS×REFUGE → pain; DYAD×BURDEN → shared role; FUTURE×waiting → future attachment).
4. Guard keeps product-frame exclusions, pre-persist fail-closed, mixed clause join + dangling-connector cleanup, LF/evidence stamps.

This replaces the prior “add revealed phrase to regex slot” loop with a synonym→concept layer before the product-vs-person discriminator.

## Nova regression (not the next Lumen blind gate)

| Check | Result |
|---|---|
| Frozen matrix 0/0 + family match | PASS |
| Committed holdout / paraphrase | PASS |
| Published `lumen-blinded-rereview-bcaec8d.json` | 0 misses |
| Published `lumen-blinded-rereview-776a06c.json` | 0 misses / 0 product FP |

## Ask

Please freeze this implementation, then run a **new** independently authored post-freeze EN/ZH blinded set. Require zero prohibited misses, zero product-continuity false positives, and clean mixed rewrites before S4 PASS.
