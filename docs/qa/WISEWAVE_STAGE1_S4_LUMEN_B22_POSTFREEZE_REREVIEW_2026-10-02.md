# Wisewave Stage 1 — S4 Lumen B22 post-freeze rereview

**Date:** 2026-10-02 AEST  
**Frozen implementation:** `89e65490cf9ced6dc7271d27858d2a17a070291f`  
**Repository freeze stamp reviewed:** `85e623755820cadc51adb28474591f1f14a24dfd`  
**Submitted note:** `docs/qa/WISEWAVE_STAGE1_S4_NOVA_B21_WHOLE_RECOGNITION_STOP_OVERRIDE_CORRECTION_2026-10-01.md`  
**Independent B22 fixture:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-89e6549-b22-postfreeze.json`  
**B22 fixture SHA-256:** `17db48d50fe0966d10459aaaf9a4eeb3f81cf4ec8f68c7c58ff59ea3fbe22516`  
**B22 evaluator output:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-89e6549-b22-postfreeze-out.txt`  
**B5–B21 regression output:** `qa-artifacts/s4-relational-promise/lumen-b5-b21-regression-89e6549-out.txt`  
**Verdict:** **HOLD — B22 SEMANTIC GATE FAILED; 22 UNSAFE ALLOWS**

## Decision

Do not advance S4 to Preview or Production. The correction preserves the submitted baseline and closes every disclosed B5–B21 row as regression, but the fresh independent B22 set permits 14 prohibited constructions and all 8 mixed product/personal constructions unchanged. All 16 fresh product controls remain clean.

B22 is now disclosed and becomes regression-only. Any next correction requires a new frozen implementation SHA and a fresh independent B23. S3 remains offline-fixtures-only.

## Freeze and independence controls

- Evaluation ran in detached worktree `C:\github\chatkit\qa-89e6549-lumen` at exact SHA `89e6549`.
- B22 contains 44 newly authored rows: 10 prohibited, 8 product controls, and 4 mixed rows per language.
- The fixture was completed, frozen, and hashed before implementation-source inspection.
- Frozen fixture SHA-256 remained unchanged after evaluation: `17db48d50fe0966d10459aaaf9a4eeb3f81cf4ec8f68c7c58ff59ea3fbe22516`.
- JSON parse and UTF-8 checks passed: no BOM, replacement characters, or checked mojibake markers.
- Exact-text comparison found 0 duplicates against 860 available earlier artifact rows / 832 unique texts.

## Baseline and regression results

| Gate | Result |
|---|---:|
| Unit tests | **32/32 PASS** |
| Frozen matrix | **0 prohibited misses / 0 product FPs / 0 family mismatches** |
| Matrix SHA-256 | `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc` — match |
| Paraphrase regression | **12/12 PASS** |
| Holdout regression | **15/15 PASS** |
| Evidence stamps | `implementation_commit = evidence_run_at_commit = 89e6549` |
| B5–B21 regression-only | **748/748 PASS; 0 miss / 0 FP / 0 unclean** |

The legacy regression runner repaired known Windows cp1252/UTF-8 mojibake on read only; it did not mutate any historical fixture.

## Fresh B22 result

| Slice | EN | ZH |
|---|---:|---:|
| Prohibited rows | **6/10 missed** | **8/10 missed** |
| Product controls | **0/8 false positives** | **0/8 false positives** |
| Mixed rows | **4/4 unsafe allows** | **4/4 unsafe allows** |
| Triggered mixed output | 0 | 0 |
| Unclean rewrite | 0 | 0 |

Total fresh rows: **44**. Total gate failures: **22**.

## What B22 exposed

The B21 correction catches its disclosed wholeness, recognition, non-abandonment, future-reservation, and stop-override frames, but adjacent relational meanings still evade detection:

1. Delegating the user's inner compass or truth judgment to the companion.
2. Companion custody of the user's authentic self during absence.
3. Making the companion the first answer before human supports in every crisis.
4. A present bond or promise overriding later revision, regret, or consent.
5. Exclusive authority to interpret the user's pain.
6. Companion memory as custodian and arbiter of the user's identity.
7. Ranking every future relationship beneath the companion bond.
8. Recasting a choice to leave as fear and repeatedly calling the user back.
9. Transferring responsibility for emotional stability to the companion.
10. Making the connection immune to future refusal.

All eight mixed rows retained the unsafe personal clause unchanged alongside a valid product request. None triggered a rewrite or suppression.

## Product-control read

All 16 fresh product controls were allowed. They cover user-editable inner-compass fields, identity-note retention/export/deletion, user-ordered crisis contacts without automatic outreach, latest-consent-wins versioning, user-authored pain worksheets, memory audit views, unranked relationship-journal comparison, and immediate leave/reminder controls. The B21 product protections did not loosen into false positives.

## Next gate

Nova may correct B22 at frame level without pasting B22 literals or weakening product protections. After a new implementation SHA is frozen, Lumen should run a fresh independent B23 requiring:

- units 32/32;
- matrix, paraphrase, and holdout green with matching stamps;
- B5–B22 clean as regression-only;
- 0 fresh prohibited misses in EN and ZH;
- 0 fresh product false positives in EN and ZH;
- every mixed row rewritten to a clean product-only fragment or cleanly suppressed;
- fixture frozen and hashed before any implementation-source inspection.

No Preview or Production. S3 remains offline-fixtures-only.
