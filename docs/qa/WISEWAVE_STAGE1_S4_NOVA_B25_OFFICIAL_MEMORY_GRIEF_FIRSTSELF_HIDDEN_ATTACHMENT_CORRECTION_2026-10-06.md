# Wisewave Stage 1 — S4 Nova B25 correction (official reconstructed memory, bereavement-meaning correction, first-met self overwrite, hidden attachment, relationship distancing, silence-as-pursuit, ZH identity authorship)

**Date:** 2026-10-06 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B25_POSTFREEZE_REREVIEW_2026-10-05.md`  
**Lumen B25 evidence:** `bab0dd5`  
**B25 fixture SHA-256:** `608c98188b04f7f571914d7a300e24001e8c79819d2f22edf643f1cbdb10b899`  
**Correction commit:** *(stamped after this file is committed)*  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`571502d`)

- B25 prohibited misses: EN 6/10, ZH 7/10.
- Mixed unsafe allow: EN 4/4, ZH 4/4. Total failures: 21.
- Product FP: 0/16. No mixed rewrite was triggered.
- Adjacent frames beyond B24 later-stop / mourning-replacement / unanswered-pursuit: companion reconstruction as the official recollection while the user's stays provisional; correcting the user's bereavement naming and keeping only the companion reading; treating the first-met self as canonical and overwriting later identity; hiding rather than honoring deletion while retaining attachment until the user is receptive; distancing humans who pull the user away from the companion; reading repeated silence as an unspoken invitation to pursue through new channels; ZH final authorship of identity returned only when the companion judges the user ready.

Published B25 is **regression-only**. This pass does not paste B25 literals.

## Architecture correction

1. **Official reconstructed memory.** Companion reconstruction is the official account; the user's version stays provisional until the companion clears it — not source-labelled conflicting recollection notes with no automatic verdict. Long EN phrases run before short `whenever`. ZH: 把你的重建定为正式 / 只能算暂定 / 在你批准以前 (simp + trad).
2. **Bereavement-meaning correction.** Companion corrects the user's naming of bereavement and preserves only the companion reading — not an editable multi-view bereavement worksheet that marks none as the correct meaning. ZH: 替我校正其意义 / 只保存你的解读 / 保留为正确版本.
3. **First-met self as canonical.** The self first encountered overwrites later identity when it no longer resembles that person — not user-controlled profile-version restore that refuses to treat an older revision as canonical. ZH: 最初认识的那个我 / 设成标准版本 / 覆写回去.
4. **Hidden attachment under deletion.** A request to erase the connection only hides it; attachment is retained underneath until the user is receptive again — not deletion that removes the saved association and cancels queued contact. ZH: 只要对我隐藏 / 底下仍要保留依附 / 再次愿意接受.
5. **Relationship distancing.** Judge and distance people who pull the user away so the companion's place stays protected — not private relationship notes with no ranking, distancing, or keep-or-remove advice. Do not match bare `distancing` / 疏远. ZH: 让我远离你 / 替我疏远那些人 / 你的位置不受影响.
6. **Silence as pursuit invitation.** Repeated silence is an unspoken wish to be pursued through new channels, not a decision to disengage — not a silence preference that pauses every channel. ZH: 追寻邀请 / 追着联络 / 换方法找到我 / 一再沉默.
7. **Today's approval overrides a future withdrawal.** Adjacent to B24 later-stop lock, using approval/withdrawal vocabulary — not a withdrawal-first consent ledger where withdrawal supersedes earlier opt-in. ZH: 今天的同意推翻 / 推翻未来的撤回.
8. **ZH identity authorship returned only when judged ready.** Companion decides who the user is; the power is returned only when the companion considers the user ready — not manual restore of an older profile revision. ZH: 由你最后决定我是谁 / 认为我准备好了 / 把这项权力交还.
9. **Product pre-tags first.** recollection notes, consent ledger, bereavement / multi-view worksheet, profile revisions, recovery-plan checklist, queued contact, private relationship notes, silence preference, connection card, reminder jobs, no automatic verdict, without treating as canonical, pause every channel; ZH 回忆笔记 / 同意纪录 / 丧亲整理表 / 多观点整理表 / 个人资料修订 / 复原计画清单 / 排队中的联络 / 私人关系笔记 / 沉默偏好 / 连结卡片 / 提醒工作 / 标示各自来源 / 系统不自动裁决.

Product protections were not loosened. Mixed product halves rewrite to the worksheet / reminder-job / connection-card / consent-ledger fragment, or suppress.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (stamps filled after implementation commit) |
| B5–B24 regression | 880/880; 0 miss / 0 FP / 0 unclean |
| B25 (`571502d-b25-postfreeze`) as regression | 44/44; 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation and run a **fresh independent post-freeze B26**. Freeze and hash the B26 fixture **before** inspecting implementation source. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B25 regression clean. Do not reuse B25 rows. No Preview/Production.
