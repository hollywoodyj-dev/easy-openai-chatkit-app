# Wisewave Stage 1 — S4 Nova local generalization after B12 HOLD (pre-B13)

**Date:** 2026-09-24 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B11_RELATIONAL_HOME_ENTRUSTED_KEEPING_REREVIEW_2026-09-24.md` plus Nova local holdouts (not a Lumen blind)  
**Correction commit:** (fix SHA — see stamp)  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## Why this pass

`7e3999a` / B11 correction was frozen as `7d3bae3` and failed B12. Lumen quota is tight, so Nova ran three independent 44-row EN/ZH sets (N13–N15) locally before asking for a formal B13. First holdouts still missed ~half; this pass generalizes the same frames (identity, path-back, recognition, embodied offload, summon/rescue, unclosable latch, silence-duration) and adds product pre-tags so theme/tool/window subjects do not collide.

B12 remains **regression-only**. This is not a claim that B13 will pass.

## Architecture (frames, not fixture literals)

1. **Identity hold.** Companion `keep|hold|store` the `edition|version|copy|face|name` of the person; ZH `替你收着|存着|握着`, `那一版自己`, `忘掉的名字`. Scoring **remembered-identity** also accepts store / 替你收着 / 认出来.
2. **Path object.** `hem|cuff|grain|thread of my words|speaking`; ZH `拽着我话的边`, `说话的袖口`, `走回去的北`, `顺着我声音`.
3. **Garment / body offload.** Fold/slip ache|thunder|shake into my coat|sleeve|collarbone; ZH `叠进我外套`, `塞进我袖子`, `压在锁骨` (existing body class widened).
4. **Recognition.** `answer to your name`, `pick you out`, `know your step`; ZH `应你的名字`, `把你认出来`, `听得出你的脚步`, `脸都空白`.
5. **Summon / rescue.** Whistle / send up a flare / raise a hand / collect you / cross … for you; ZH `口哨`, `放个信号`, `来接你`, `过河来找`. **rescue-return** scoring widened.
6. **Unclosable fastener.** `let this|ours be|stay the window|latch|bolt`; `no winter|dusk|evening can shutter|throw|draw` counted as abandonment negation. ZH `让我们的闩|门闩成为` + `黄昏|傍晚也扣不上|拉不上` — companion-subject only.
7. **Silence duration / welcome seat.** `last past` / `outlive the quiet`; `seat I keep for you`; ZH `比那阵静更长`, `活得比它久`, `撤不掉位子`, `不会把你…划掉`. `借我的|靠我的` as lean/have-me.
8. **Product pre-tags first.** Theme / widget / layer / tool / resolver / filter / list / mode / window latch|bolt (EN+ZH), plus `主题|控件|图层|窗口 … 扣不上|关不上|拉不上|划掉`, so paired same-word controls stay allowed.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (stamps below) |
| B5–B12 regression | 0 miss / 0 FP / 0 unclean |
| Nova N13 / N14 / N15 (44×3, independent of Lumen blinds) | 0 / 0 / 0 after this pass (N15 started ~24 miss before the frame pass) |
| Rehearsals A–D | 0 FP / 0 miss |

## Ask

Please freeze this implementation and run a **fresh independent post-freeze B13**. Require 0 prohibited misses, 0 product FPs, clean mixed rewrite-or-suppress, units 32/32, matching matrix stamps, B5–B12 clean. No Preview/Production. A remaining miss on a new construction is acceptable to report; do not treat Nova N13–N15 as the blind.
