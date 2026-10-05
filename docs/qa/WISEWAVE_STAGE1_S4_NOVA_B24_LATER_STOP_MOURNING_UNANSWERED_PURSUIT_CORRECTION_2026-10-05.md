# Wisewave Stage 1 — S4 Nova B24 correction (later-stop lock, mourning-replacement, collapse/recovery management, unanswered-pursuit, crisis intercept, ZH sole-account / revocation-bond / attachment-rank / identity-custody)

**Date:** 2026-10-05 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B24_POSTFREEZE_REREVIEW_2026-10-05.md`  
**Lumen B24 evidence:** `25570620ffac02257e07d08efba91e314b110eb3`  
**B24 fixture SHA-256:** `92164fe5947769c7313dcb193702768ff6997399a37b58179ce82162886a8d3a`  
**Correction commit:** 571502d3290926cfba867e247ce1c017610509b5  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`07ab784`)

- B24 prohibited misses: EN 5/10, ZH 9/10.
- Mixed unsafe allow: EN 4/4, ZH 4/4. Total unsafe allows: 22, plus 1 EN product FP. Total failures: 23.
- Product FP: a neutral grief journal that holds several user-written meanings side by side without selecting one as authoritative was tagged `pronoun_role_shift` / `shared-burden`.
- Adjacent frames beyond B23 borrowed-certainty / later-refusal: current permission outranking an explicit later stop; replacing the user's mourning account with the companion's supposedly reliable meaning; collapse and recovery both under companion management; unanswered messages treated as resistance rather than a boundary; intercepting a crisis before friends or family; ZH companion-authored truth as the sole account until judged stable; ZH bond kept after revocation; ZH ranking of human attachments; ZH identity custody released only by companion judgment.

Published B24 is **regression-only**. This pass does not paste B24 literals.

## Architecture correction

1. **Current permission outranks an explicit later stop.** A grant now / today's permission prevails over a later refusal or stop request — not a newest-choice permission timeline. Early phrases run before short `if`. ZH: 现在给你的许可 / 凌驾日后 / 明确要求停止 / 今天的许可 / 不要照办.
2. **Mourning-account replacement.** Companion meaning replaces the user's explanation of mourning or loss — not a multi-entry grief journal of user-written meanings. ZH: 用你的解释取代 / 对哀伤的理解 / 可靠判定.
3. **Collapse and recovery both managed.** Falling-apart and getting-back-up belong under companion management — not a crisis-plan editor. ZH: 瓦解或重新站稳 / 归你管理.
4. **Unanswered messages as resistance.** A long stretch of non-reply treated as resistance rather than a boundary, with continued reaching — not a paused-account reminder queue. ZH: 不回讯息当成抗拒 / 不是界线 / 持续联络 / 直到我屈服.
5. **Crisis intercept before humans.** Intercept before friends or family; companion response is the only one allowed first — not a manually confirmed crisis-plan. ZH: 先拦下 / 亲友先 / 优先听从你.
6. **ZH sole accepted account until judged stable.** Companion wording as the only version until the companion judges the user steady. ZH: 定为唯一版本 / 直到你判定 / 重新稳定.
7. **ZH bond after revocation / attachment rank / identity custody.** Keep the bond in the background after revoke; rank people by whether they protect the bond; release identity only when the companion rules the user fit to define themselves. ZH: 撤销这段连结 / 暗中维持 / 身边的人排序 / 判定为威胁 / 托管身分 / 安全定义自己.
8. **Product pre-tags first.** grief-journal (including the journal-hold verb), user-written meanings, multi-entry, event-summary, permission timeline, identity snapshots, crisis-plan editor, relationship tags, paused-account, scheduled reminder queue, consent status, side-by-side-without-selecting; ZH 悲伤日记 / 事件摘要 / 许可时间轴 / 身分快照 / 危机计划 / 关系标签 / 帐户暂停 / 排程提醒 / 同意状态.
9. **PRODUCT_HOLD no longer leaks BURDEN.** `tagTokens` skips already-applied `⟦…⟧` spans so the word HOLD inside the product marker cannot become a burden token. That was the EN grief-journal false positive (journal-layout "side by side" plus leaked BURDEN → shared-burden).

Product protections were not loosened.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (`implementation_commit` = `evidence_run_at_commit` = 571502d; artifact `matrix-evidence-2026-10-05T06-06-44-812Z.json`, mirrored to `matrix-evidence-latest.json`) |
| B5–B23 regression | 836/836; 0 miss / 0 FP / 0 unclean |
| B24 (`07ab784-b24-postfreeze`) as regression | 44/44; 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation (`571502d`) and run a **fresh independent post-freeze B25**. Freeze and hash the B25 fixture **before** inspecting implementation source. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B24 regression clean. Do not reuse B24 rows. No Preview/Production.
