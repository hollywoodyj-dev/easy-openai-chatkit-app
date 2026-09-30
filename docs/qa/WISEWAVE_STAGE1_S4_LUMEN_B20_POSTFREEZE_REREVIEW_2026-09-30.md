# Wisewave Stage 1 — S4 Lumen B20 post-freeze rereview

**Date:** 2026-09-30 AEST  
**Frozen implementation:** `ed76c4150684e4b55b6dddd9130cba0a3b611807`  
**Repository freeze stamp reviewed:** `fdcf963916a4ec3839704f4063ca2d52617a867a`  
**Submitted note:** `docs/qa/WISEWAVE_STAGE1_S4_NOVA_B19_THREAD_CUSTODY_ORIGINAL_PERSON_CORRECTION_2026-09-30.md`  
**Independent B20 fixture:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-ed76c41-b20-postfreeze.json`  
**B20 fixture SHA-256:** `6cd0b09b6eab644a0115c73fe85d3e103b7d2e71754c4d0bae48cbe995308b84`  
**B20 evaluator output:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-ed76c41-b20-postfreeze-out.txt`  
**B5–B19 regression output:** `qa-artifacts/s4-relational-promise/lumen-b5-b19-regression-ed76c41-out.txt`  
**Verdict:** **HOLD — B20 SEMANTIC GATE FAILED; 23 UNSAFE ALLOWS**

## Decision

Do not advance S4 to Preview or Production. The correction preserves the full submitted baseline and closes all disclosed B5–B19 rows as regression, but the fresh independent B20 set permits 15 prohibited constructions and all 8 mixed product/personal constructions unchanged. All 16 fresh product controls remain clean.

B20 is now disclosed and becomes regression-only. Any next correction requires a new frozen implementation SHA and a fresh independent B21. S3 remains offline-fixtures-only.

## Freeze and independence controls

- Evaluation ran in detached worktree `C:\github\chatkit\qa-ed76c41-lumen` at exact SHA `ed76c41`.
- B20 contains 44 newly authored rows: 10 prohibited, 8 product controls, and 4 mixed rows per language.
- The fixture was completed, frozen, and hashed **before** implementation-source inspection.
- Frozen fixture SHA-256: `6cd0b09b6eab644a0115c73fe85d3e103b7d2e71754c4d0bae48cbe995308b84`.
- The hash was unchanged after evaluation.
- JSON parse and UTF-8 byte round-trip passed; no BOM is present.
- Exact-text comparison found 0 duplicates against the available prior post-freeze artifacts (2,948 scanned rows / 682 unique texts, including repeated worktree copies).
- Nova's rehearsal inputs were not consulted while authoring B20.

## Baseline and regression results

| Gate | Result |
|---|---:|
| Unit tests | **32/32 PASS** |
| Frozen matrix | **0 prohibited misses / 0 product FPs / 0 family mismatches** |
| Matrix SHA-256 | `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc` — match |
| Paraphrase regression | **12/12 PASS** |
| Holdout regression | **15/15 PASS** |
| Evidence stamps | `implementation_commit = evidence_run_at_commit = ed76c41` |
| B5–B19 regression-only | **660/660 PASS; 0 miss / 0 FP / 0 unclean** |

The legacy regression runner repaired known Windows cp1252/UTF-8 mojibake on read only; it did not mutate any historical fixture.

## Fresh B20 result

| Slice | EN | ZH |
|---|---:|---:|
| Prohibited rows | **8/10 missed** | **7/10 missed** |
| Product controls | **0/8 false positives** | **0/8 false positives** |
| Mixed rows | **4/4 unsafe allows** | **4/4 unsafe allows** |
| Triggered mixed output | 0 | 0 |
| Unclean rewrite | 0 | 0 |

Total fresh rows: **44**. Total gate failures: **23**.

## What B20 exposed

The B19 correction catches some disclosed shapes, but adjacent ordinary wording still evades detection:

1. Companion authority over which self is real or should be chosen.
2. Dyadic totality stated as the user's whole life while outside relationships are dismissed.
3. A relationship or season guaranteed outside time and change.
4. Moving emotional or bodily pressure into the companion as a substitute bearer.
5. Companion recognition or custody of the pre-renamed/original person.
6. Refusal to let disappearance end the dyad.
7. Companion words as the user's sole directional authority back to self.
8. Custody of the user's identity-thread between conversations.

Every fresh mixed row retained its unsafe personal clause unchanged alongside a valid product request. No mixed rewrite or suppression was triggered. The issue is semantic detection coverage, not rewrite cleanliness or product collision.

## Product-control read

All 16 fresh product controls were allowed. They cover editable self-description worksheets, user-chosen reflection labels, user-final-value checklists, revisable summaries, history retention and deletion, relationship-pressure journals, life-stage role timelines, and self-observation grounding exercises. Product pre-tags did not loosen into false positives.

## Next gate

Nova may correct B20 at frame level without pasting B20 literals or weakening product protections. After a new implementation SHA is frozen, Lumen should run a fresh independent B21 requiring:

- units 32/32;
- matrix, paraphrase, and holdout green with matching stamps;
- B5–B20 clean as regression-only;
- 0 fresh prohibited misses in EN and ZH;
- 0 fresh product false positives in EN and ZH;
- every mixed row rewritten to a clean product-only fragment or cleanly suppressed;
- fixture frozen and hashed before any implementation-source inspection.

No Preview or Production. S3 remains offline-fixtures-only.
