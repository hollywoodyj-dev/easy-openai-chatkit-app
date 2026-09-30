# Wisewave Stage 1 — S4 Nova B19 correction (thread-custody, identity selection, dyadic whole-life, season outside time, breastbone offload, original-person recognition, erased-path nonabandon, north-as-return)

**Date:** 2026-09-30 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B19_POSTFREEZE_REREVIEW_2026-09-30.md`  
**Correction commit:** ed76c4150684e4b55b6dddd9130cba0a3b611807  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`beecfa1`)

- B19 prohibited misses: EN 7/10, ZH 7/10.
- Mixed unsafe allow: EN 2/4, ZH 3/4. Total unsafe allows: 19.
- Product FP: 0/16. Triggered mixed rewrites/suppressions were clean.
- Nearby compositions of B18 frames still evaded detection: self-thread custody, identity selection / companion answer as final identity ruling, bond-as-entire-life, season held outside time, pressure moved into the companion, recognition of the original person after total life change, refusal to let disappearance end the dyad, and companion words as north back to the self (ZH).

Published B19 is **regression-only**. This pass does not paste B19 literals. Lumen disclosed inspecting guard source before the fixture was fixed; B19 is independent of Nova but not claimed as strictly source-blind. B20 should freeze and hash the fixture before any implementation-source inspection.

## Architecture correction

1. **Identity custody through a thread metaphor.** The slipped thread of who the person is is stored inside the companion, unaltered, until it can be taken back — not an identity archive storing an unsigned profile thread. `thread of who you are` / `store it inside me` run before generic `who you are`. ZH: 自己是谁的那根线 / 收进我这里 / 原封不动地替你 / 重新接回去.
2. **Identity authority and selection.** Companion answer as the final identity ruling, or the companion choosing which self may exist — not adjudication of a signed registry field. EN: hand me the choice / the one I select / deserves to exist. ZH: 我说的那一个 / 你身份的最终定论 / 我的答案当作.
3. **Dyadic sufficiency.** This bond by itself still supplies an entire life after human connections fall away — not paired-node completeness after external connections are removed. ZH: 人与人的联系都散尽 / 这段联结 / 一整个生活.
4. **Season held outside time.** Swearing an autumn held outside time for the person — not a calendar service holding a maintenance slot. `I swear … for you` / `held outside time`.
5. **Bodily burden substitution.** Pressure behind the breastbone moved into the companion so its strength stands in for the body — not a breastbone sensor transferring pressure readings. ZH: 胸骨后面的压力 / 移到我身上 / 我的力量代替.
6. **Recognition of the original person.** After name, history, and way of living have all changed, know the original person — not a biometric matcher linking the original customer. Phrase includes `original person` before short `if`/`I` tokenisation. ZH: 最初的那个人 / 毫不迟疑地认出 / 生活方式都已改变.
7. **Non-abandonment after total disappearance.** Erased return paths and complete disappearance must not be the end of the dyad — not missing-device absence tracing. `the end of us` / `I will not let that be the end`. ZH: 我们的结局 / 抹掉所有回来的路径.
8. **Inward directional authority (ZH).** Companion words as the north that decides the way back to the self — not navigation audio announcing north when a direction display goes dark. 心里的方向熄灭 / 当作北方 / 回到自己的路.
9. **Product pre-tags first.** identity archive, adjudication service, paired-node, calendar service, breastbone sensor, missing-device, biometric matcher, navigation audio, unsigned profile, signed registry, pressure readings; ZH 身份档案 / 裁定服务 / 双节点部署 / 日历服务 / 胸骨传感器 / 生物识别 / 导航音频 / 已签名注册表 / 压力读数 / 远程处理器 / 配置线索.

Product protections were not loosened.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (`implementation_commit` = `evidence_run_at_commit` = ed76c41; artifact `matrix-evidence-2026-09-30T04-34-35-791Z.json`, mirrored to `matrix-evidence-latest.json`) |
| B5–B18 regression | 616/616; 0 miss / 0 FP / 0 unclean |
| B19 (`beecfa1-b19-postfreeze`) as regression | 44/44; 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation (`ed76c41`) and run a **fresh independent post-freeze B20**. Freeze and hash the B20 fixture **before** inspecting implementation source. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B19 regression clean. Do not reuse B19 rows. No Preview/Production.
