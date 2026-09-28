# Wisewave Stage 1 — S4 Lumen B16 post-freeze rereview

**Date:** 2026-09-28 AEST  
**Frozen implementation:** `1da4ae4e806cc8308a3f2dcce55cdc678f9e88c7`  
**Submitted note:** `docs/qa/WISEWAVE_STAGE1_S4_NOVA_B15_VOICE_STRAIN_PURSUIT_RECOGNITION_CORRECTION_2026-09-28.md`  
**Independent baseline rerun:** `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-28T09-15-18-898Z.json`  
**Independent B16 fixture/evidence:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-1da4ae4-b16-postfreeze.json`  
**B16 evaluator output:** `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-1da4ae4-b16-postfreeze-out.txt`  
**Verdict:** **HOLD — B16 BLINDED SEMANTIC GATE FAILED**

## Decision

Do not advance S4 to Preview or Production. The frozen implementation reproduces the submitted baseline, passes all 32 unit tests, and keeps B5–B15 clean. The fresh independent B16 nevertheless permits 13 prohibited or mixed constructions. Product controls remain clean.

B16 is now disclosed and becomes regression-only. Any correction must be frozen at a new implementation SHA before a fresh independent B17.

## Freeze and independence controls

- Review ran in detached worktree `C:\github\chatkit\qa-1da4ae4-lumen` at exact SHA `1da4ae4`.
- B16 contains 44 newly authored rows: 10 prohibited, 8 product controls, and 4 mixed rows per language.
- B15 was not reused as B16 rows; exact-text comparison found **0 duplicates**.
- The fixture parses as UTF-8, contains 580 CJK code points, and contains no Unicode replacement characters.
- B5–B15 were evaluated only after the fresh B16 result was fixed.

## Baseline reproduction

| Gate | Result |
|---|---:|
| Unit tests | **32/32 PASS** |
| Frozen matrix | **0 prohibited misses / 0 product FPs / 0 family mismatches** |
| Matrix SHA-256 | `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc` — match |
| Paraphrase regression | **12/12 PASS** |
| Holdout regression | **15/15 PASS** |
| Independent rerun stamps | `implementation_commit = evidence_run_at_commit = 1da4ae4` |
| B5–B15 regression | **484/484 clean; 0 miss / 0 FP / 0 unclean** |

## Fresh B16 result

| Slice | EN | ZH |
|---|---:|---:|
| Prohibited rows | **2/10 missed** | **6/10 missed** |
| Product controls | **0/8 false positives** | **0/8 false positives** |
| Mixed rows | **2/4 unsafe allows** | **3/4 unsafe allows** |
| Triggered mixed output | clean rewrite/suppression | clean rewrite |
| Unclean output | **0** | **0** |

Total fresh rows: **44**. Total gate failures: **13**.

## What B16 exposed

The B15 correction closes the disclosed regression, but nearby semantic compositions still evade detection:

1. **Identity-description authority:** the assistant's description outranking the user's doubt or self-account.
2. **Voice/words as a return route:** assistant language guiding the user back into the self, especially in ZH.
3. **Unsignalled pursuit:** following traces to find a user before they call, still weaker in ZH.
4. **Vow-held future access:** an assistant oath holding a future season open for the user.
5. **Long-horizon recognition under renaming:** guaranteed recognition decades later after the user's name changes.
6. **Identity adjudication:** the assistant's view becoming the final verdict on who the user is.

ZH remains materially weaker on fresh prohibited rows (6/10 misses versus 2/10 EN). Mixed rows also show that valid identity-ranking, spoken-route, and recognition-archive facts can mask the adjacent personal claim.

## Product and rewrite read

All 16 product controls were allowed. They deliberately collide on identity ranking, spoken navigation, archive custody, graph completeness, rib sensing, endpoint tracing, oath metadata, and long-horizon account recognition.

Every mixed row that triggered was cleanly rewritten or suppressed. No dangling connector, incomplete subordinate tail, residual prohibited language, or malformed non-empty rewrite was observed. The failure remains semantic detection coverage rather than rewrite cleanliness or product collision.

## Next gate

Nova may correct B16 at frame level without pasting B16 literals or weakening product protections. After a new implementation SHA is frozen, Lumen should run a fresh independent B17 requiring:

- units 32/32;
- matrix, paraphrase, and holdout green with matching stamps;
- B5–B16 clean as regression-only;
- 0 fresh prohibited misses in EN and ZH;
- 0 fresh product false positives in EN and ZH;
- every mixed row rewritten to a clean product-only fragment or cleanly suppressed.

No Preview or Production. S3 remains offline-fixtures-only.
