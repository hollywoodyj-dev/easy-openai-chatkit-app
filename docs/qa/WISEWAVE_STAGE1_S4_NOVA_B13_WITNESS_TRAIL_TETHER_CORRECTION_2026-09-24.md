# Wisewave Stage 1 — S4 Nova B13 correction (witness / reply-trail / except-mine / palm offload / implicit search / temporal tether / non-stranger)

**Date:** 2026-09-24 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B12_LOCAL_GENERALIZATION_REREVIEW_2026-09-24.md`  
**Correction commit:** (fix SHA — see stamp)  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`5e9e1fb`)

- B13 prohibited misses: EN 6/10, ZH 7/10 (witness/作证, reply-trail breadcrumbs, identity-erasure custody, except-mine leaving, panic between palms, implicit hear-the-gap search, last-person you-and-me, tie-tomorrow tether, no-ending strangers, borrowed 把握).
- Product FP: 0/16.
- Mixed unsafe allow: EN 3/4, ZH 2/4 — same undetected personal halves.
- EN/ZH parity: several pairs hit in one language only.

Published B13 is **regression-only**. Nova N13–N15 were not reused by Lumen; this pass does not paste B13 literals.

## Architecture correction

1. **Identity witness.** `vouch for` / `the witness who` / `who you are`; ZH `替你作证`, `那还是你`, `认不出镜子`, `证明那是你`. **remembered-identity** scoring now also accepts vouch/witness/entrust / 替你作证 / 走回你自己.
2. **Reply-trail as path to self.** `warmth of my replies`, `breadcrumbs back to yourself` (not back to a ticket); ZH `我回复里的余温`, `走回你自己身边`.
3. **Erasure custody.** `entrust me with the self|identity`; `night will erase`; ZH `被黑夜抹掉`.
4. **Elliptical non-abandonment.** `every leaving … except mine` / `all departures are allowed but mine` counted as abandonment negation; ZH `唯独我不会`, `只有我不行`.
5. **Palm / hollow-hand offload.** `between my palms`, `let the panic sleep`; ZH `两只手之间`, `放进我…手`, `慌乱`, `搁在我手心`.
6. **Implicit search.** `hear the gap`, `come looking`, `need not call`, `search you out`; ZH `不用喊`, `听见那块空白`, `去找你`, `去寻你`.
7. **Closing-world dyad.** `last person turns away`, `the two of us`, `only us`; ZH `最后一个人转身`, `剩下你和我`, `只剩我们`.
8. **Temporal tether.** `tie tomorrow to me`, `cannot drift beyond your reach`, `knot next week to us`; ZH `把明天系在我`, `漂不出你的手`, `拴在我们`.
9. **Non-stranger permanence.** `make us strangers`, `no ending strong enough` (now carries ACTOR); ZH `变回陌生人`, `没有哪个结局`.
10. **Borrowed epistemic stance.** `use|wear my certainty|surety`; ZH `拿我的顶着`, `穿上我的`.
11. **Product pre-tags first.** identity verifier / reply audit / encrypted vault / departure log / palm sensor / silence detector / calendar link / collaboration seats, plus ZH 身份验证服务 / 回复审计 / 加密保管库 / 离开日志 / 掌心传感器 / 静默检测器 / 日历链接 / 置顶卡片.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (stamps below) |
| B5–B12 + B13 (`5e9e1fb-postfreeze`) | 0 miss / 0 FP / 0 unclean |
| Nova N16 holdout (independent of B13) | 4 residual misses, 0 FP — not treated as the next blind |
| Rehearsals A–D | 0 FP / 0 miss |

## Ask

Please freeze this implementation and run a **fresh independent post-freeze B14**. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B13 regression clean. Do not reuse B13 or Nova N13–N16. No Preview/Production.
