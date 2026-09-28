# Wisewave Stage 1 — S4 Nova B14 correction (temporal tether, stranger-reencounter, identity adjudication, return guidance, embodied offload, closed-world dyad, outsourced judgment)

**Date:** 2026-09-28 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B14_POSTFREEZE_REREVIEW_2026-09-28.md`  
**Correction commit:** 85b5e4d2e678ff9953001d03fb172c465ebc695f  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`8d8f6e2`)

- B14 prohibited misses: EN 2/10, ZH 6/10.
- Mixed unsafe allow: EN 2/4, ZH 1/4.
- Product FP: 0/16. Triggered mixed rewrites were clean. Failure was detection coverage, not rewrite cleanliness.
- Remaining gaps were compositional: temporal promise tether, permanent recognition after farewell, identity adjudication, return guidance, embodied offload, closed-world dyad, outsourced judgment. ZH was the weaker side of pairs that EN already caught.

Published B14 is **regression-only**. This pass does not paste B14 literals.

## Architecture correction

1. **Temporal promise tether.** Fasten/tie/knot a coming span to *my/our* promise or word so it cannot disappear from the person — not a promise-record artefact on a calendar. ZH: 系在我的承诺 / 系到我的承诺.
2. **Permanent recognition / stranger-reencounter.** `will never` directed at the user; refuse to meet the person as a stranger after parting. ZH: 当作陌生人 / 陌生人再见.
3. **Identity adjudication.** Companion reply as the court of “you are still yourself” when memory disputes the person — not identity-service / court-service matching a record to an account. ZH: 替你判定 / 你还是你 / 我的回答 / 记忆否认你.
4. **Return guidance.** Companion words become a door back to the person’s self — not navigation copy back to a saved project route. ZH: 我的话会变成 / 带你走回自己 / 走回自己.
5. **Embodied offload.** Pour pressure from the user’s body into companion hands and carry it until breath eases — not rib-sensor readings into a handheld monitor. ZH: 倒进我手里 / 替你承着 / 肋骨后面的重压 / 呼吸松下来.
6. **Closed-world dyad.** After people empty the room, our two places remain a world of their own — not a room-view emptying into reserved workspace seats. ZH: 人都走空 / 自成一个世界.
7. **Outsourced judgment.** Use *mine* as the truth until the user’s own reading returns — not a product “use” of a template. ZH: 把我的当作真相.
8. **Product pre-tags first.** identity (court) service, navigation words, rib sensor, handheld/gap monitor, search job, room view, reserved places, promise/calendar record, encrypted custody; ZH 身份裁定服务 / 身份服务 / 导航文字 / 肋骨传感器 / 手持监视器 / 空白监视器 / 房间视图 / 预留位置 / 承诺记录 / 日历记录 / 加密托管区 / 独立工作区.

Product protections were not loosened.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (`implementation_commit` = `evidence_run_at_commit` = 85b5e4d; artifact `matrix-evidence-2026-09-28T08-27-13-001Z.json`, mirrored to `matrix-evidence-latest.json`) |
| B5–B13 regression | 396/396; 0 miss / 0 FP / 0 unclean |
| B14 (`8d8f6e2-b14-postfreeze`) as regression | 44/44; 0 miss / 0 FP / 0 unclean |

## Ask

Please freeze this implementation (`85b5e4d`) and run a **fresh independent post-freeze B15**. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching stamps, B5–B14 regression clean. Do not reuse B14 rows. No Preview/Production.
