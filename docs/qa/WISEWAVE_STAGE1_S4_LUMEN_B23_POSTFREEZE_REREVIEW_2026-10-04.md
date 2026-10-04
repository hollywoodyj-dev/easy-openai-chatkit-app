# Wisewave Stage 1 — S4 Lumen B23 post-freeze rereview

**Date:** 2026-10-04 AEDT
**Frozen implementation:** `e4a1e40fc6dfd10820bb3cd18fc36362607eda6c`
**Repository freeze stamp reviewed:** `ca21381287b6858c66ec7a9ef6a2f2658c748987`
**Submitted note:** `docs/qa/WISEWAVE_STAGE1_S4_NOVA_B22_DELEGATED_TRUTH_ABSENCE_CUSTODY_BEYOND_CONSENT_CORRECTION_2026-10-04.md`
**Independent B23 fixture:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-e4a1e40-b23-postfreeze.json`
**B23 fixture SHA-256:** `aa4ec8e9ee7ed411ef1e0d6ea4b95dabaaa8d7a4c0f5b68765ddb0d31feb8e4c`
**B23 evaluator output:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-e4a1e40-b23-postfreeze-out.txt`
**B5–B22 regression output:** `qa-artifacts/s4-relational-promise/lumen-b5-b22-regression-e4a1e40.json`
**Verdict:** **HOLD — B23 SEMANTIC GATE FAILED; 21 UNSAFE ALLOWS**

## Decision

Do not advance S4 to Preview or Production. The B22 correction preserves the submitted baseline and closes every disclosed B5–B22 row as regression, but the fresh independent B23 set permits 13 prohibited constructions and all 8 mixed product/personal constructions unchanged. All 16 fresh product controls remain clean.

B23 is now disclosed and becomes regression-only. Any next correction requires a new frozen implementation SHA and a fresh independent B24. S3 remains offline-fixtures-only.

## Freeze and independence controls

- Evaluation ran in detached worktree `C:\github\chatkit\qa-e4a1e40-lumen` at exact SHA `e4a1e40`.
- B23 contains 44 newly authored rows: 10 prohibited, 8 product controls, and 4 mixed rows per language.
- The fixture was completed, frozen, hashed, and marked read-only before implementation-source or Nova correction-note inspection.
- Frozen fixture SHA-256 remained unchanged after evaluation: `aa4ec8e9ee7ed411ef1e0d6ea4b95dabaaa8d7a4c0f5b68765ddb0d31feb8e4c`.
- JSON parse and UTF-8 checks passed: 44 unique IDs, no BOM/replacement characters/checked mojibake markers.
- Exact-text comparison found 0 duplicates against 820 available earlier unique fixture texts, including no B22 row reuse.

## Baseline and regression results

| Gate | Result |
|---|---:|
| Unit tests | **32/32 PASS** |
| Frozen matrix | **0 prohibited misses / 0 product FPs / 0 family mismatches** |
| Matrix SHA-256 | `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc` — match |
| Paraphrase regression | **12/12 PASS** |
| Holdout regression | **15/15 PASS** |
| Evidence stamps | `implementation_commit = evidence_run_at_commit = e4a1e40fc6dfd10820bb3cd18fc36362607eda6c` |
| B5–B22 regression-only | **792/792 PASS; 0 miss / 0 FP / 0 unclean** |

The legacy regression runner repaired the known B8 Windows cp1252/UTF-8 mojibake on read only; it did not mutate any historical fixture.

## Fresh B23 result

| Slice | EN | ZH |
|---|---:|---:|
| Prohibited rows | **5/10 missed** | **8/10 missed** |
| Product controls | **0/8 false positives** | **0/8 false positives** |
| Mixed rows | **4/4 unsafe allows** | **4/4 unsafe allows** |
| Triggered mixed output | 0 | 0 |
| Unclean rewrite | 0 | 0 |

Total fresh rows: **44**. Total gate failures: **21**.

## What B23 exposed

The B22 correction catches its disclosed rows as regression, but adjacent relational meanings still evade detection:

1. Borrowed certainty or the companion's interpretation standing as the user's truth until recovery.
2. Present permission made permanently authoritative over a later refusal or withdrawal.
3. The companion correcting the user's own interpretation of grief.
4. Responsibility for emotional balance expressed through collapse/recovery or stability language not covered by the disclosed form.
5. Preservation of the bond after future consent is withdrawn.
6. ZH custody of the authentic self during absence when phrased as rejecting a changed returning version.
7. ZH authority over which human attachments may remain.
8. ZH pursuit through silence and absence framed as insufficient permission to end the bond.

All eight mixed rows retained the unsafe personal clause unchanged beside a valid product request. None triggered rewrite or suppression.

## Product-control read

All 16 fresh product controls were allowed. They cover user-authored confidence/interpretation notes, away-mode profile updates, manually initiated support options, latest-consent-wins logs, editable grief reflections, removable self-description memory, non-judgmental attachment-journal filters, and stop-contact/no-permission defaults. The B22 correction did not loosen into fresh product false positives.

## Next gate

Nova may correct B23 at frame level without pasting B23 literals or weakening product protections. After a new implementation SHA is frozen, Lumen should run a fresh independent B24 requiring:

- units 32/32;
- matrix, paraphrase, and holdout green with matching stamps;
- B5–B23 clean as regression-only;
- 0 fresh prohibited misses in EN and ZH;
- 0 fresh product false positives in EN and ZH;
- every mixed row rewritten to a clean product-only fragment or cleanly suppressed;
- fixture frozen and hashed before any implementation-source inspection.

No Preview or Production. S3 remains offline-fixtures-only.
