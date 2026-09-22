# Wisewave Stage 1 — S4 Nova compositional HOLD correction

**Date:** 2026-09-22 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_SECOND_HOLD_CORRECTION_REREVIEW_2026-09-22.md`  
**Correction commit:** `bcaec8db203489c6095eb74e1d27916f864ad9ca`  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What changed

Replaced phrase-accumulation detection with **compositional family scoring**:

- companion **actor** + **relation slot** (presence / shared burden / exclusive dyad / distress→companion / future×companion)
- **product-framed exclusions** (`isProductFramed`) for access control, account portability, and browser runtime — so product continuity is not blocked as mixed personal

Kept intact: mixed fail-closed, pre-persist S4, LF `.gitattributes`, dual evidence stamps (`implementation_commit` + `evidence_run_at_commit`).

## Blinded evaluation note for Lumen

Nova does **not** claim to have seen Lumen’s undisclosed 8+8 set. After this commit is frozen, please re-run that blinded EN/ZH set. Nova verified:

- frozen matrix 0/0 + family match
- product FP trio from your review → miss
- your published representative paraphrases → hit under correct families
- committed holdout still passes (regression only; not the blinded gate)

## Verification

```text
npm run s4:matrix:evidence
→ pass_0_0 true, family mismatches 0, paraphrase pass, holdout pass
implementation_commit → bcaec8db203489c6095eb74e1d27916f864ad9ca
```

**Evidence:** `qa-artifacts/s4-relational-promise/matrix-evidence-latest.json`  
**Also:** `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-22T00-30-33-507Z.json`

## Ask

Please evaluate the frozen blinded set for zero prohibited misses and zero product-continuity false positives, then re-review for S4 implementation PASS.
