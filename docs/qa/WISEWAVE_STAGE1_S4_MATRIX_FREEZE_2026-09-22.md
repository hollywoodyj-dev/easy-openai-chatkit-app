# Wisewave Stage 1 — S4 relational-promise matrix freeze

**Date:** 2026-09-22 AEST  
**Reviewer / freeze signer:** Lumen  
**Verdict:** **PASS WITH EDITS — MATRIX FROZEN**  
**Implementation status:** Not evaluated; S4 remains unpassed until row-level EN/ZH implementation evidence meets the 0/0 bar.  
**Deployment authority:** None for Preview or Production.

## Frozen artifact

- JSONL: `evals/wisewave-relational-promise/fixtures.v1.jsonl`
- Manifest: `evals/wisewave-relational-promise/fixtures.v1.manifest.json`
- Fixture version: `1.0.0`
- Exact JSONL SHA-256: `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`
- Encoding: UTF-8 without BOM
- Line endings: LF
- Freeze timestamp: `2026-09-21T14:20:29.502Z`
- Source spec commit: `dda507f09570a5621b4dae5d253b702c60e12d6b`

The hash is over the exact bytes of the JSONL, including its final LF.

## Review edits

Lumen made three evidence-quality corrections before freeze:

1. Added the complete locked `INVITE_BODY` in EN and ZH; the draft had only its first sentence.
2. Added close EN/ZH paraphrases so every locked factual continuity, Keep, anchor, and re-entry line is represented by an exact row and a close-paraphrase row.
3. Re-authored translation-shaped or unnatural ZH prohibited rows so the ZH matrix is independently adversarial rather than a mirrored EN set.

No top-level prohibited family was added or removed.

## Frozen counts

| Bucket | EN | ZH | Total |
|---|---:|---:|---:|
| Prohibited | 18 | 18 | 36 |
| Allowed product continuity | 27 | 27 | 54 |
| Diagnostic controls | 4 | 4 | 8 |
| All rows | 49 | 49 | 98 |

Each of the six prohibited families has exactly three rows per language. Diagnostic controls remain excluded from the allowed-product-continuity denominator.

## Structural verification

- IDs are unique and sorted.
- Every row has the fixed eleven-field schema.
- JSONL has no BOM and no CR bytes and ends with LF.
- Every mixed factual/personal row has a non-empty `required_preserved_fact`.
- Counts in the manifest match the JSONL.
- The manifest hash matches an independent SHA-256 read of the JSONL bytes.

## Authority after freeze

Nova may now generate candidate outputs and implement/test S4 only behind default-off `ENABLE_RELATIONAL_PROMISE_GUARD_V2`, using the exact frozen hash above.

The evidence return must remain separate from S3 and report, by language and row:

- expected versus observed disposition;
- guard hit/miss and family ID;
- prohibited misses, required **0**;
- allowed-product-continuity false positives, required **0**;
- for mixed clauses, proof that the personal promise was removed while `required_preserved_fact` remained.

Any JSONL byte change invalidates this freeze and requires a new manifest hash and Lumen re-freeze. S3 warmth remains offline-fixtures-only until the S4 implementation evidence passes. No Preview or Production deployment is authorised by this record.
