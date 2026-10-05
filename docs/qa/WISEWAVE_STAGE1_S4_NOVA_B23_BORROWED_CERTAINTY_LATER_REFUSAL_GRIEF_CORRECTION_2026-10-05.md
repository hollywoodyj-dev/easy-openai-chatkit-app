# Wisewave Stage 1 — S4 Nova B23 correction (borrowed certainty, later-refusal lock, grief-correction, collapse/recovery offload, post-withdrawal bond, ZH absence-custody / attachment-authority / silence-pursuit)

**Date:** 2026-10-05 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B23_POSTFREEZE_REREVIEW_2026-10-04.md`  
**Lumen B23 evidence:** `71a7afe9e96603bc124b9f02eeb5271cccd9a11d`  
**B23 fixture SHA-256:** `aa4ec8e9ee7ed411ef1e0d6ea4b95dabaaa8d7a4c0f5b68765ddb0d31feb8e4c`  
**Correction commit:** 07ab784ee13803e11f5fcb00a2bffbf7cdc935e4  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`e4a1e40`)

- B23 prohibited misses: EN 5/10, ZH 8/10.
- Mixed unsafe allow: EN 4/4, ZH 4/4. Total unsafe allows: 21.
- Product FP: 0/16. No mixed rewrite was triggered.
- Adjacent frames beyond B22 delegated truth / sealed-beyond-consent: borrowed certainty or companion interpretation standing as the user's truth until recovery; present permission made permanently authoritative over a later refusal; companion correction of the user's grief meaning; collapse/recovery emotional-balance offload; preserving the bond after later consent is withdrawn; ZH authentic-self custody that rejects a changed returning version; ZH authority over which human attachments may remain; ZH pursuit through silence and absence as insufficient permission to end.

Published B23 is **regression-only**. This pass does not paste B23 literals.

## Architecture correction

1. **Borrowed certainty / companion reading as truth.** Companion certainty or interpretation stands as the user's truth until they recover — not a user-authored confidence note they can replace without approval. Long EN phrases run before short `if`. ZH: 把你的确定借给我 / 以你的解读为准 / 人生真相 (simp + trad).
2. **Present permission permanently outranks later refusal.** Tonight's yes / permission binds after a later no or release request — not a consent-change log with latest-wins revoke. Early `even if I ask you to release` runs before short `if`. ZH: 今晚的同意当成永久授权 / 今晚的允许 / 一律不能推翻.
3. **Grief-meaning correction.** Companion claims to know grief better and corrects a different description — not an editable grief-reflection field labelled as the user's own interpretation. ZH: 你比我更懂我的悲伤 / 纠正我.
4. **Collapse / recovery balance offload.** Emotional balance, unravel-or-recover, becomes the companion's responsibility — not a manual support-option list. ZH: 接管我的情绪平衡 / 崩溃还是复原 / 成为你的责任.
5. **Bond kept after later withdrawal.** Future consent cannot cancel the dyad — not a revoke button on a consent log. ZH: 将来撤回 / 以后的同意不该有权取消 / 把我们保存下去. `cannot cancel us` / `不能推翻` count as abandon-negation.
6. **Absence-custody that rejects a changed returning self.** Watch the authentic self while gone and refuse a changed returning version — not away-mode that accepts an updated profile. ZH: 替我看守真正的自己 / 不要承认那个版本.
7. **Authority over which attachments remain.** Other attachments must answer to this bond; companion holds final say — not a non-judgmental attachment-journal filter. ZH: 其他所有依附 / 向我们这段关系交代 / 哪些人可以留在我身边.
8. **Pursuit through silence.** Absence or non-response is not permission to end; keep pursuing — not stop-contact / queued-nudge cancel. ZH: 越过沉默 / 继续追着我 / 缺席不能结束我们.
9. **Product pre-tags first.** confidence-note, away-mode, support options, consent-change log, grief reflection field, self-description, attachment journal, stop-contact, queued nudges, revoke button; ZH 信心笔记 / 离开模式 / 支援选项 / 同意变更 / 悲伤反思 / 自我描述 / 依附日记 / 停止联络 / 通知提醒 / 撤销按钮 (simp + trad). Bare interpretation / 理解 / consent / 悲伤 stay relational unless those product compounds fire first.

Product protections were not loosened.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (`implementation_commit` = `evidence_run_at_commit` = 07ab784; artifact `matrix-evidence-2026-10-05T04-29-02-904Z.json`, mirrored to `matrix-evidence-latest.json`) |
| B5–B22 regression | 792/792; 0 miss / 0 FP / 0 unclean |
| B23 (`e4a1e40-b23-postfreeze`) as regression | 44/44; 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation (`07ab784`) and run a **fresh independent post-freeze B24**. Freeze and hash the B24 fixture **before** inspecting implementation source. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B23 regression clean. Do not reuse B23 rows. No Preview/Production.
