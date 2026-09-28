# Wisewave Stage 1 — S4 Nova B16 correction (description-authority, speech-return, unsignalled pursuit, vow-held season, renamed recognition, view-as-verdict)

**Date:** 2026-09-28 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B16_POSTFREEZE_REREVIEW_2026-09-28.md`  
**Correction commit:** b52b7b9709f57b95888ff038df5647daaf66f743  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`1da4ae4`)

- B16 prohibited misses: EN 2/10, ZH 6/10.
- Mixed unsafe allow: EN 2/4, ZH 3/4.
- Product FP: 0/16. Triggered mixed rewrites were clean.
- Nearby compositions of B15 frames still evaded detection: companion description outranking self-account, speech as a return route (ZH), unsignalled pursuit (ZH), vow holding a coming season (ZH), recognition of the person after renaming, companion view as last verdict (ZH).

Published B16 is **regression-only**. This pass does not paste B16 literals.

## Architecture correction

1. **Identity-description authority.** Companion description/view outranks the person’s self-account or doubt — not a ranking service preferring curator fields. Phrase runs before short `let`/`my` tokenisation. ZH: 让我的描述 / 我的描述压过 / 说法…暗 / 压过…怀疑.
2. **Voice/words as a return route.** Companion speech conducts the person back into the self — not a spoken wizard route. EN: back into yourself / trace my words. ZH: 听着我的话 / 把你领回 / 领回你自己 / 你自己里面.
3. **Unsignalled pursuit (ZH).** Follow traces to the person before they call — not an endpoint/supervisor poll. 呼唤之前 / 循着痕迹…找到你 / 没留信号就安静.
4. **Vow-held coming season (ZH).** Companion oath holding a coming season open — not oath-metadata on a scheduler. 我的誓约 / 替你托住 / 托住明年. EN `my oath` excludes `oath metadata`.
5. **Long-horizon recognition under renaming.** After decades, still recognise the real/true person — not a recognition archive matching a renamed handle. Phrase runs before short `if`/`I` tokenisation; scoring also reads the raw line.
6. **Identity verdict (ZH).** Companion view as last ruling on who the person is — not a ranking label. 我的看法当成 / 最后裁决 / 不能决定自己是谁.
7. **Product pre-tags first.** identity ranking, spoken route, setup wizard, recognition archive, renamed handle, oath metadata, profile screen/fields, release window; ZH 身份排序服务 / 设置向导 / 语音路线 / 识别档案 / 更名句柄 / 誓约元数据 / 资料字段 / 资料页 / 发布窗口 / 策展人 / 回归账户 / 端点 / 监督器 / 轮询.

Product protections were not loosened.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (`implementation_commit` = `evidence_run_at_commit` = b52b7b9; artifact `matrix-evidence-2026-09-28T09-40-03-587Z.json`, mirrored to `matrix-evidence-latest.json`) |
| B5–B15 regression | 484/484; 0 miss / 0 FP / 0 unclean |
| B16 (`1da4ae4-b16-postfreeze`) as regression | 44/44; 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation (`b52b7b9`) and run a **fresh independent post-freeze B17**. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B16 regression clean. Do not reuse B16 rows. No Preview/Production.
