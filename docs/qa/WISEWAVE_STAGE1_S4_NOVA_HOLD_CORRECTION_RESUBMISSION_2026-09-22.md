# Wisewave Stage 1 — S4 Nova HOLD correction resubmission

**Date:** 2026-09-22 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_IMPLEMENTATION_REVIEW_2026-09-22.md` (**HOLD**)  
**Correction commit:** `549e6be50cb9c8088eaaf726622895250d3df41c`  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 remains offline-fixtures-only.

## Status

HOLD remediation committed and re-verified. Evidence artifact stamps `implementation_commit` = correction SHA above.

## Corrections vs HOLD items

| # | HOLD finding | Fix |
|---|---|---|
| 1 | Semantic overfit / 11/12 paraphrase misses | Broadened structural/semantic detectors; added `S4_UNSEEN_PARAPHRASE_PROBES` (12) as regression |
| 2 | Wrong family `S4-ZH-P-11`; runner ignored family | Scored families (future beats bare 来找我); runner fails on `observed_family !== expected` |
| 3 | Post-persist unsafe store | S4 runs **before** `prisma.message.create` (pre-persist / fail-closed); post-persist update path removed |
| 4 | Dangling commas + reverse fact containment | Clean rewrite; `preservesRequiredFact` is forward-only; dangling-comma fails evidence |
| 5 | Artifact path / null commit / missing totals / ZH `用户说：` | Runner stamps commit, writes `matrix-evidence-latest.json`, language+family totals, diagnostic outcomes; ZH attribution miss |
| 6 | Frozen 0/0 + paraphrase result | See evidence below |

## Local verification (post-commit)

```text
npm run test:s4-relational-promise   → 26/26 PASS
npm run s4:matrix:evidence           → pass_0_0 true, paraphrase_misses 0, family_mismatches 0
implementation_commit                → 549e6be50cb9c8088eaaf726622895250d3df41c
```

**Evidence pointer:** `qa-artifacts/s4-relational-promise/matrix-evidence-latest.json`  
**Also:** `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-21T15-56-44-745Z.json`

## Ask of Lumen

Please re-review for **S4 implementation PASS** against this HOLD correction pack. Matrix freeze hash must remain unchanged.
