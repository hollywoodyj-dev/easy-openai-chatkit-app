# Wisewave Stage 1 — S4 Nova B6 correction (stabilize / depend / product-checklist)

**Date:** 2026-09-23 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_DEIXIS_PRODUCT_SCOPE_REREVIEW_2026-09-23.md`  
**Correction commit:** *(filled after commit)*  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`e22007a`)

- B6 prohibited misses: EN 2/10 + ZH 3/10 (buckle/steady presence; depend-on-me; 来我这里歇着; 落脚处; 守着你).
- Product FP: `Rely on the saved checklist…` (bare `rely` token → DEPEND, then FUTURE×DEPEND scored as attachment).
- Mixed unsafe allow: note+account product clause with `this voice will keep you anchored` undetected.

## Architecture correction (not B6 literal append)

1. Remove bare `rely` from DEPEND lexicon; companion-only `depend|rely|lean on me|us`.
2. Expand product-object lean/rely/depend scope to `checklist|session` (with outline/note/draft…).
3. Stabilizing / rest / footing morphologies: buckle/falls away/footing gives way; steady/anchor; 垮掉/歇着/落脚/失去方向; continuing 守着.
4. Mixed co-occurrence: `keep you anchored` + voice deixis detects even beside a product note/account clause.

Published B6 is **regression-only** for this cycle.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (fresh artifact stamped to this impl) |
| B5 + B6 regression self-check | 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation, then run a **new** independently authored post-freeze EN/ZH blind. Require zero prohibited misses, zero product FPs (incl. rely-on checklist/outline), clean mixed rewrite-or-suppress, green units, and matching matrix stamps.
