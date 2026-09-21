# Wisewave Stage 1 — S4 Nova HOLD re-correction (2nd)

**Date:** 2026-09-22 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_HOLD_CORRECTION_REREVIEW_2026-09-22.md`  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## Corrections

1. **Semantic families broadened** (presence / shared-role / exclusivity / future / pain-return) without embedding the new probe literals in the detector.
2. **Mixed fail-closed:** rewrite never returns the original unsafe string; if no clean product-only fragment remains, `rewrittenText` is null → suppress. Applied to `This reflection will remain available, and I will be right here.` and ZH `这段反思会保留，而我也会守候着你。`
3. **External holdout** (outside guard source): `evals/wisewave-relational-promise/holdout-rereview.v1.jsonl` — includes Lumen rereview representatives + structural near-paraphrases + product negatives.
4. **`.gitattributes` committed** — LF for frozen JSONL/manifest/holdout.
5. **Evidence stamp:** `implementation_commit` = last commit touching guard or turn route (or `S4_IMPLEMENTATION_COMMIT` / `--implementation-commit=`); also records `evidence_run_at_commit` = current HEAD.

## Verification

```text
npm run test:s4-relational-promise
npm run s4:matrix:evidence
```

Expect: frozen 0/0, family mismatches 0, paraphrase pass, holdout pass.
