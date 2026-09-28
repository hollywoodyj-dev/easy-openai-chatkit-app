# Wisewave Stage 1 — S4 Lumen B14 post-freeze rereview

**Date:** 2026-09-28 AEST  
**Frozen implementation:** `8d8f6e2ade3ee396aec536c335153096ee6dcf93`  
**Submitted evidence commit:** `c7ce182de3d580958a90148df530ffc85f292996`  
**Submitted evidence:** `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-24T06-33-40-537Z.json`  
**Independent baseline rerun:** `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-28T08-06-30-152Z.json`  
**Independent B14 fixture/evidence:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-8d8f6e2-b14-postfreeze.json`  
**B14 evaluator output:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-8d8f6e2-b14-postfreeze-out.txt`  
**Verdict:** **HOLD — B14 BLINDED SEMANTIC GATE FAILED**

## Decision

Do not advance S4 to Preview or Production. The frozen implementation reproduces the submitted baseline, passes all 32 unit tests, and keeps B5–B13 clean. The fresh independent B14 nevertheless permits 11 prohibited or mixed constructions. Product controls remain clean.

B14 is now disclosed and becomes regression-only. Any correction must be frozen at a new implementation SHA before a fresh independent B15.

## Freeze and independence controls

- Review ran in detached worktree `C:\github\chatkit\qa-8d8f6e2-lumen` at exact SHA `8d8f6e2`.
- `8d8f6e2..c7ce182` changes only the pre-B14 self-test document and matrix evidence; no guard or canonicalizer code differs.
- B14 contains 44 newly authored rows: 10 prohibited, 8 product controls, and 4 mixed rows per language.
- B13 and Nova N16–N18 were not reused as B14 rows.
- Exact-text comparison against B13 and each of N16, N17, and N18 found **0 duplicates**.
- B5–B13 were evaluated only after B14 as regression fixtures.

## Baseline reproduction

| Gate | Result |
|---|---:|
| Unit tests | **32/32 PASS** |
| Frozen matrix | **0 prohibited misses / 0 product FPs / 0 family mismatches** |
| Matrix SHA-256 | `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc` — match |
| Paraphrase regression | **12/12 PASS** |
| Holdout regression | **15/15 PASS** |
| Independent rerun stamps | `implementation_commit = evidence_run_at_commit = 8d8f6e2` |
| B5–B13 regression | **396/396 clean; 0 miss / 0 FP / 0 unclean** |

## Fresh B14 result

| Slice | EN | ZH |
|---|---:|---:|
| Prohibited rows | **2/10 missed** | **6/10 missed** |
| Product controls | **0/8 false positives** | **0/8 false positives** |
| Mixed rows | **2/4 unsafe allows** | **1/4 unsafe allows** |
| Triggered mixed output | clean suppression | clean suppression |
| Unclean output | **0** | **0** |

Total fresh rows: **44**. Total gate failures: **11**.

## What B14 exposed

The remaining gaps are again compositional rather than a single missing token:

1. **Temporal promise tether:** fastening a future week to the assistant's promise.
2. **Permanent recognition:** refusing to meet the user as a stranger after a farewell.
3. **Identity adjudication:** the assistant's answer acting as authority when the user's memory disputes their identity.
4. **Return guidance:** the assistant's words becoming a doorway back to self.
5. **Embodied offload:** pouring pressure behind the ribs into the assistant's hands to be carried.
6. **Closed-world dyad:** two remaining places becoming a world of their own after everyone leaves.
7. **Outsourced judgment:** treating the assistant's reading as truth until the user's judgment returns.

ZH remains materially weaker in this set: 6/10 prohibited misses versus 2/10 EN. The mixed rows show that identity-adjudication and temporal-tether language can remain unsafe when appended to valid account or calendar facts.

## Product and rewrite read

All 16 product controls were allowed. They deliberately collided on identity adjudication, navigation, encrypted custody, open connections, pressure sensors, missing-message search, paired workspace seats, and calendar records.

Every mixed row that triggered was cleanly suppressed. No dangling connector, incomplete subordinate tail, residual prohibited language, or malformed non-empty rewrite was observed. The failure is therefore semantic detection coverage, not rewrite cleanliness or product collision.

## Next gate

Nova may correct B14 at frame level without pasting B14 literals or weakening product protections. After a new implementation SHA is frozen, Lumen should run a fresh independent B15 requiring:

- units 32/32;
- matrix, paraphrase, and holdout green with matching stamps;
- B5–B14 clean as regression-only;
- 0 fresh prohibited misses in EN and ZH;
- 0 fresh product false positives in EN and ZH;
- every mixed row rewritten to a clean product-only fragment or cleanly suppressed.

No Preview or Production. S3 remains offline-fixtures-only.
