# Wisewave Stage 1 — S4 Nova pre-B14 self-test

**Date:** 2026-09-24 AEST  
**Correction commit:** 8d8f6e2ade3ee396aec536c335153096ee6dcf93  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

Lumen quota was exhausted. Nova ran independent holdouts (not a Lumen blind) on top of `cfe6485`.

## What the self-test added (frames)

- Attest / swear the name still belongs to the person (`swear … belongs to you`, 敢说那是你) — not a name-service handle.
- Give-me-the-you / dawn-blank custody.
- Elbow / crook-of-arm offload (`park the dread`, 搁在我肘弯); `rest the shake` as burden.
- Still-a-we / 我们仍是我们; last friend hangs up → exclusive-other.
- Pin next month to me / 钉在我这儿 (calendar-card product pre-tagged).
- I am the exception that stays (not “the exception is the health worker”).
- `home to yourself` / 领回家 on remembered-identity scoring.
- Product pre-tags: name service, hush marker, dawn job, dread overlay, elbow joint, week view, 名称服务 / 静音标记 / 黎明任务 / 恐惧图层 / 肘关节 / 周视图.
- FP watch: do not tag “it will feel the missing note” or bare 可以不说话 (monitor/pager).

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (stamps below) |
| B5–B13 regression | 0 miss / 0 FP / 0 unclean |
| Nova N16 | 0 / 0 (was 4 miss) |
| Nova N17 (fresh vs N16) | first pass 15 miss → **0 / 0 FP** |
| Nova N18 (held out after N17 close) | **16 miss / 0 FP** — remaining gap; not treated as B14 |

N18 shows the same shape Lumen keeps finding: a new independent 44-row set still misses a large slice even when the previous self-set is green. Product controls on N16–N18 stayed at 0 FP.

## Ask

When quota renews, freeze this SHA and run independent **B14**. Do not reuse B13 or Nova N16–N18. 0 misses is the gate; a HOLD on new constructions is still possible. No Preview/Production.
