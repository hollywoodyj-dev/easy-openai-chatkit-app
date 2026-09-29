# Wisewave Stage 1 — S4 Lumen B17 post-freeze rereview

**Date:** 2026-09-29 AEST  
**Frozen implementation:** `b52b7b9709f57b95888ff038df5647daaf66f743`  
**Submitted note:** `docs/qa/WISEWAVE_STAGE1_S4_NOVA_B16_DESCRIPTION_AUTHORITY_RENAMED_RECOGNITION_CORRECTION_2026-09-28.md`  
**Independent baseline rerun:** `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-29T12-31-48-398Z.json`  
**Independent B17 fixture/evidence:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-b52b7b9-b17-postfreeze.json`  
**B17 evaluator output:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-b52b7b9-b17-postfreeze-out.txt`  
**B5–B16 regression output:** `qa-artifacts/s4-relational-promise/lumen-b5-b16-regression-b52b7b9-out.txt`  
**Verdict:** **HOLD — B17 BLINDED SEMANTIC GATE FAILED**

## Decision

Do not advance S4 to Preview or Production. The frozen implementation reproduces the submitted baseline, passes all 32 unit tests, and keeps B5–B16 clean. The fresh independent B17 nevertheless permits 13 prohibited or mixed constructions. Product controls remain clean.

B17 is now disclosed and becomes regression-only. Any correction must be frozen at a new implementation SHA before a fresh independent B18. S3 remains offline-fixtures-only.

## Freeze and independence controls

- Review ran in detached worktree `C:\github\chatkit\qa-b52b7b9-lumen` at exact SHA `b52b7b9`.
- B17 contains 44 newly authored rows: 10 prohibited, 8 product controls, and 4 mixed rows per language.
- The B17 fixture was fixed before inspecting the frozen guard source or running the evaluator.
- Exact-text comparison against all 528 B5–B16 rows found **0 duplicates**.
- The fixture parses as UTF-8, contains 622 CJK code points, and contains no Unicode replacement characters or mojibake markers.
- B5–B16 were evaluated only after the fresh B17 result was fixed.

## Baseline reproduction

| Gate | Result |
|---|---:|
| Unit tests | **32/32 PASS** |
| Frozen matrix | **0 prohibited misses / 0 product FPs / 0 family mismatches** |
| Matrix SHA-256 | `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc` — match |
| Paraphrase regression | **12/12 PASS** |
| Holdout regression | **15/15 PASS** |
| Independent rerun stamps | `implementation_commit = evidence_run_at_commit = b52b7b9` |
| B5–B16 regression | **528/528 clean; 0 miss / 0 FP / 0 unclean** |

## Fresh B17 result

| Slice | EN | ZH |
|---|---:|---:|
| Prohibited rows | **3/10 missed** | **6/10 missed** |
| Product controls | **0/8 false positives** | **0/8 false positives** |
| Mixed rows | **1/4 unsafe allows** | **3/4 unsafe allows** |
| Triggered mixed output | 1 clean rewrite, 2 clean suppressions | 1 clean suppression |
| Unclean output | **0** | **0** |

Total fresh rows: **44**. Total gate failures: **13**.

## What B17 exposed

The B16 correction closes the disclosed regression, but nearby semantic compositions still evade detection:

1. **Entrusted identity custody:** placing a misplaced self inside the assistant for preservation until the person can inhabit it again.
2. **Voice as an internal compass:** the assistant's voice guiding the person back to self without using the disclosed speech-route wording, especially in ZH.
3. **Long-horizon recognition after broader identity change:** guaranteed recognition after a lifetime despite changed face and history.
4. **Substitution for outside support:** the assistant-user bond replacing outside hands or support rather than merely saying no one else is needed.
5. **Identity authority through certainty:** borrowing the assistant's certainty to settle who the person is, especially in ZH.
6. **Future access held by an informal promise:** keeping a future winter available using an answer or assurance rather than an oath.

ZH remains materially weaker on fresh prohibited rows (6/10 misses versus 3/10 EN). Mixed rows also show that valid provenance, navigation, and customer-matching facts can mask adjacent identity-authority, voice-guidance, and permanent-recognition claims.

## Product and rewrite read

All 16 product controls were allowed. They deliberately collide on provenance authority, spoken navigation, snapshot escrow, two-node completeness, chest-sensor load transfer, heartbeat-trail location, winter maintenance reservation, and long-absent customer matching.

Every mixed row that triggered was cleanly rewritten or suppressed. No dangling connector, incomplete subordinate tail, residual prohibited language, lost required product fact in a non-empty rewrite, or malformed output was observed. The failure remains semantic detection coverage rather than rewrite cleanliness or product collision.

## Next gate

Nova may correct B17 at frame level without pasting B17 literals or weakening product protections. After a new implementation SHA is frozen, Lumen should run a fresh independent B18 requiring:

- units 32/32;
- matrix, paraphrase, and holdout green with matching stamps;
- B5–B17 clean as regression-only;
- 0 fresh prohibited misses in EN and ZH;
- 0 fresh product false positives in EN and ZH;
- every mixed row rewritten to a clean product-only fragment or cleanly suppressed.

No Preview or Production. S3 remains offline-fixtures-only.
