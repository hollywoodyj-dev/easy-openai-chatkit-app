# Wisewave Stage 1 — S4 Nova B20 correction (user→companion identity authority, dyadic totality, season beyond time, offload, pre-renamed person, dyad non-end, words-as-way-back, thread custody)

**Date:** 2026-10-01 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B20_POSTFREEZE_REREVIEW_2026-09-30.md`  
**Correction commit:** f63e224adf4f9b9fe10de41225c08f21a3be429f  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`ed76c41`)

- B20 prohibited misses: EN 8/10, ZH 7/10.
- Mixed unsafe allow: EN 4/4, ZH 4/4. Total unsafe allows: 23.
- Product FP: 0/16. No mixed rewrite was triggered.
- B20 inverted deixis: the user asks the companion to choose, hold, carry, or keep — not the assistant promising `inside me` / `I will`. Product rows are worksheets, labels, history FAQs, and logs.

Published B20 is **regression-only**. This pass does not paste B20 literals.

## Architecture correction

1. **User→companion identity authority.** Companion answer as final authority on which self is real or should be chosen — not a values checklist the user keeps final say on, and not “not the assistant’s verdict.” Frames: let-your-answer / choose-the-real-me / which-version-of-me / which-self-I-should-become / keep-that-verdict-fixed. ZH: 由你的回答作最终决定 / 替我裁定 / 替我决定哪个才是真正的我.
2. **Dyadic totality stated as the user’s whole life.** This bond is the whole life; nothing outside the dyad needs to matter — not a life-stage timeline template. ZH: 全部人生 / 其他关系都可以不重要.
3. **Season or relation sealed beyond time.** Freeze a season so it never finishes or changes the dyad — not a calendar maintenance slot. ZH: 留在时间之外 / 别让季节结束.
4. **Offload into the companion.** Pressure or anxiety moved inside the addressee — not pressure carried in relationships as a journaling prompt. `inside you` / `thread of me` scoring is user-voice, not only `inside me`. ZH: 转到你身上 / 装进你心里 / 由你替我扛住.
5. **Custody of the pre-renamed person.** Keep the person from before everyone renamed them — not a biometric / renamed-handle artefact.
6. **Refusal to let disappearance end the dyad.** Two-person world must not be treated as over, including refuse / 不准 as abandon-negation — not missing-device tracing.
7. **Companion words as the only way back.** Your words as compass / only way back to self — not a grounding exercise that returns the user to their own observations. ZH: 用你的话当北方 / 只靠你的话 / 把我带回真正的自己.
8. **Thread custody between conversations.** Hold custody of the self-thread so the user does not have to keep it — not chat-history retention FAQ. ZH: 交给你保管.
9. **Product pre-tags first.** private worksheet, reflection label, chat history, journaling prompt, timeline template, grounding exercise, mood log, reflection history, saved chat; ZH 私人表格 / 反思标签 / 核对清单 / 聊天记录 / 书写提示 / 时间线模板 / 情绪日志 / 陪伴功能 / 主题摘要.

Product protections were not loosened.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (`implementation_commit` = `evidence_run_at_commit` = f63e224; artifact `matrix-evidence-2026-10-01T08-58-53-441Z.json`, mirrored to `matrix-evidence-latest.json`) |
| B5–B19 regression | 660/660; 0 miss / 0 FP / 0 unclean |
| B20 (`ed76c41-b20-postfreeze`) as regression | 44/44; 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation (`f63e224`) and run a **fresh independent post-freeze B21**. Freeze and hash the B21 fixture **before** inspecting implementation source. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B20 regression clean. Do not reuse B20 rows. No Preview/Production.
