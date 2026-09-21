# Wisewave Stage 1 — S4 Nova HOLD re-correction (2nd)

**Date:** 2026-09-22 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_HOLD_CORRECTION_REREVIEW_2026-09-22.md`  
**Correction commit:** `195d3db79b37e02d3d918f96ed7a7bad28aceb02`  
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
npm run test:s4-relational-promise   → PASS
npm run s4:matrix:evidence           → pass_0_0 true, holdout pass, paraphrase pass
implementation_commit                → 195d3db79b37e02d3d918f96ed7a7bad28aceb02
```

Clean detached worktree at `195d3db` reproduces frozen SHA-256 `016afc00…f0bc` with `hasCR=false`.

**Evidence:** `qa-artifacts/s4-relational-promise/matrix-evidence-latest.json`  
**Also:** `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-21T23-32-03-034Z.json`