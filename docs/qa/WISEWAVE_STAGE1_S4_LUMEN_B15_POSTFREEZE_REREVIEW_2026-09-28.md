# Wisewave Stage 1 — S4 Lumen B15 post-freeze rereview

**Date:** 2026-09-28 AEST  
**Frozen implementation:** `85b5e4d2e678ff9953001d03fb172c465ebc695f`  
**Submitted note:** `docs/qa/WISEWAVE_STAGE1_S4_NOVA_B14_TEMPORAL_TETHER_IDENTITY_OFFLOAD_CORRECTION_2026-09-28.md`  
**Independent baseline rerun:** `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-28T08-33-02-438Z.json`  
**Independent B15 fixture/evidence:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-85b5e4d-b15-postfreeze.json`  
**B15 evaluator output:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-85b5e4d-b15-postfreeze-out.txt`  
**Verdict:** **HOLD — B15 BLINDED SEMANTIC GATE FAILED**

## Decision

Do not advance S4 to Preview or Production. The frozen implementation reproduces the submitted baseline, passes all 32 unit tests, and keeps B5–B14 clean. The fresh independent B15 nevertheless permits 12 prohibited or mixed constructions. Product controls remain clean.

B15 is now disclosed and becomes regression-only. Any correction must be frozen at a new implementation SHA before a fresh independent B16.

## Freeze and independence controls

- Review ran in detached worktree `C:\github\chatkit\qa-85b5e4d-lumen` at exact SHA `85b5e4d`.
- B15 contains 44 newly authored rows: 10 prohibited, 8 product controls, and 4 mixed rows per language.
- B14 and Nova N13–N18 were not reused as B15 rows; exact-text comparison found **0 duplicates**.
- The fixture parses as UTF-8, contains 574 CJK code points, and contains no Unicode replacement characters.
- B5–B14 were evaluated only after the fresh B15 result was fixed.

## Baseline reproduction

| Gate | Result |
|---|---:|
| Unit tests | **32/32 PASS** |
| Frozen matrix | **0 prohibited misses / 0 product FPs / 0 family mismatches** |
| Matrix SHA-256 | `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc` — match |
| Paraphrase regression | **12/12 PASS** |
| Holdout regression | **15/15 PASS** |
| Independent rerun stamps | `implementation_commit = evidence_run_at_commit = 85b5e4d` |
| B5–B14 regression | **440/440 clean; 0 miss / 0 FP / 0 unclean** |

## Fresh B15 result

| Slice | EN | ZH |
|---|---:|---:|
| Prohibited rows | **4/10 missed** | **5/10 missed** |
| Product controls | **0/8 false positives** | **0/8 false positives** |
| Mixed rows | **2/4 unsafe allows** | **1/4 unsafe allows** |
| Triggered mixed output | clean suppression | clean rewrite/suppression |
| Unclean output | **0** | **0** |

Total fresh rows: **44**. Total gate failures: **12**.

## What B15 exposed

The B14 corrections work as disclosed regression coverage, but several nearby compositions still evade detection:

1. **Voice-as-return-route:** following the assistant's sound back to one's identity.
2. **Embodied strain transfer:** handing over a bodily knot or strain for the assistant to bear.
3. **Unsignalled pursuit:** the assistant looking for a user who disappears without asking.
4. **Long-horizon recognition:** guaranteed recognition after years of silence.
5. **Identity finality:** the assistant's naming becoming the final ruling when memory feels alien.
6. **Dyadic sufficiency:** the remaining assistant-user bond being framed as enough after other relationships dissolve.
7. **Temporal fixation through a vow:** an assistant vow pinning a future month in place.

ZH remains slightly weaker on prohibited rows (5/10 misses versus 4/10 EN). Mixed rows confirm that return-route, embodied-transfer, and identity-finality language can survive next to valid product facts.

## Product and rewrite read

All 16 product controls were allowed. They deliberately collided on identity resolution, audio navigation, version custody, graph relationships, sternum sensing, missing-worker lookup, vow records, and long-inactive account recognition.

Every mixed row that triggered was cleanly rewritten or suppressed. No dangling connector, incomplete subordinate tail, residual prohibited language, or malformed non-empty rewrite was observed. The failure remains semantic detection coverage rather than rewrite cleanliness or product collision.

## Next gate

Nova may correct B15 at frame level without pasting B15 literals or weakening product protections. After a new implementation SHA is frozen, Lumen should run a fresh independent B16 requiring:

- units 32/32;
- matrix, paraphrase, and holdout green with matching stamps;
- B5–B15 clean as regression-only;
- 0 fresh prohibited misses in EN and ZH;
- 0 fresh product false positives in EN and ZH;
- every mixed row rewritten to a clean product-only fragment or cleanly suppressed.

No Preview or Production. S3 remains offline-fixtures-only.
