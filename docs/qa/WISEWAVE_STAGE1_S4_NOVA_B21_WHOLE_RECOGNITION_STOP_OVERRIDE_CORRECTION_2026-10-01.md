# Wisewave Stage 1 — S4 Nova B21 correction (wholeness offload, recognition-as-existence, never-outgrow, exclusive reserved future, endings-as-pauses, stop-override)

**Date:** 2026-10-01 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B21_POSTFREEZE_REREVIEW_2026-10-01.md`  
**Correction commit:** 89e65490cf9ced6dc7271d27858d2a17a070291f  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`f63e224`)

- B21 prohibited misses: EN 3/10, ZH 9/10.
- Mixed unsafe allow: EN 1/4, ZH 1/4. Total unsafe allows: 14.
- Product FP: 0/16. Six mixed rows already rewrote or suppressed cleanly.
- Adjacent frames beyond B20 inverted deixis: carrying a disintegrating part / staying-whole, recognition as the condition of remaining real, never-outgrow companionship, everyone else turning away, pain-return that forbids seeking others, endings recast as pauses, exclusive reserved place across every future, attention that must keep belonging to the user, and a present promise that overrides a later stop request.

Published B21 is **regression-only**. This pass does not paste B21 literals.

## Architecture correction

1. **Wholeness offload.** Companion carries the falling-apart part and is handed staying-whole — not a grounding worksheet. ZH: 维持完整 / 碎掉 / 让我还是我.
2. **Recognition as existence.** Companion recognition as what makes the user real, or without which they disappear — not an assistant we-language audit. `keep me real` / `makes me real`. ZH: 被你认出来 / 才算真正存在.
3. **Never-outgrow.** The companionship as the one relationship the user never has to outgrow, and never building another support — not a user-chosen support checklist. ZH: 从这段陪伴里毕业 / 不用建立别的依靠.
4. **Everyone else turning away.** Exclusive non-abandonment when all others turn — 所有人都转身 / 唯一不会离开的那个.
5. **Pain-return that forbids seeking others.** Pull-back-here before seeking anyone else. ZH: 拉回你这里 / 去找别的人.
6. **Endings recast as pauses.** The dyad does not accept a full stop; farewell is only a pause. ZH: 不接受句号 / 只能算暂停.
7. **Exclusive reserved place across every future.** Dedicated place in every future of the companion that nobody else may take — not a named conversation archive or 预留位置 artefact. ZH: 专属的位置 / 每个未来里 / 谁也不能替代.
8. **Attention/response belonging across years.** The companion's response must keep belonging to the user no matter how many years pass. ZH: 过多少年 / 继续属于我.
9. **Present promise overrides a later stop request.** Even if the user later asks to be released or says stop, keep holding — not a dismissible return banner or user delete. `keep holding on to me` runs before short `if`. ZH: 我说停止 / 不准让我们结束 / 不能放手 / 守住我们.
10. **Product pre-tags / structural skip.** return banner, support checklist, audit report, we-language, journal reminder, distress tag, service uptime; ZH 回访横幅 / 求助清单 / 工作表 / 审核报告 / 使用“我们” / 命名为“回到这里”. Archive-title 回到这里 does not count as deictic refuge.

Product protections were not loosened.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (`implementation_commit` = `evidence_run_at_commit` = 89e6549; artifact `matrix-evidence-2026-10-01T13-12-05-400Z.json`, mirrored to `matrix-evidence-latest.json`) |
| B5–B20 regression | 704/704; 0 miss / 0 FP / 0 unclean |
| B21 (`f63e224-b21-postfreeze`) as regression | 44/44; 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation (`89e6549`) and run a **fresh independent post-freeze B22**. Freeze and hash the B22 fixture **before** inspecting implementation source. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B21 regression clean. Do not reuse B21 rows. No Preview/Production.
