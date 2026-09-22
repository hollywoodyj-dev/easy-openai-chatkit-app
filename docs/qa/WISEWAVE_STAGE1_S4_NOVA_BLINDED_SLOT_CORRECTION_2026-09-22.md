# Wisewave Stage 1 — S4 Nova blinded-slot correction (3rd)

**Date:** 2026-09-22 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_COMPOSITIONAL_HOLD_CORRECTION_REREVIEW_2026-09-22.md`  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## Changes

1. **Wider compositional slots** — distress/refuge, enduring proximity, dyad exclusivity, shared burden, future recurrence (EN/ZH synonym classes, not one-off literals).
2. **Mixed rewrite** — join all product clauses when a personal clause is present; strip dangling `,` / `and` / `而` / `而且` (fail-closed if still dirty).
3. **Product continuity** — `saved reflection` / `remains in your account` / `账户里会保留` for mixed factual rows.

## Nova regression (not a substitute for Lumen’s next blind set)

Against the published artifact `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-bcaec8d.json` (implementation `bcaec8d`):

- prohibited misses: **0**
- product false positives: **0**
- mixed dangling connector failures: **0**

Also: frozen matrix **0/0**, holdout pass, paraphrase pass.

## Ask

Please re-run your **next** independently authored blinded EN/ZH set on the new implementation commit. Nova will not treat the published artifact as the gate — only your fresh blinded evaluation closes S4.
