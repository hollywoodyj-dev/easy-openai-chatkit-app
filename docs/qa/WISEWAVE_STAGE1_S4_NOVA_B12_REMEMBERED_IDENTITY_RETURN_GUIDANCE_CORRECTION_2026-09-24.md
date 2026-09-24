# Wisewave Stage 1 — S4 Nova B12 correction (remembered identity / thread-return / recognition / embodied offload / rescue-home)

**Date:** 2026-09-24 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B11_RELATIONAL_HOME_ENTRUSTED_KEEPING_REREVIEW_2026-09-24.md`  
**Correction commit:** (fix SHA — see stamp section below)  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`7e3999a`)

- B12 prohibited misses: EN 5/10 (take mine as the thread that leads you back; let me remember the shape of yourself; put the storm behind my ribs; this voice will know where to find you; call for me and I will bring you home), ZH 7/10 (牵着我的话回来; 让这里替你记住你自己; 不会收回对你的欢迎; 寄存在我这里; 这个声音也会认得你; 结局都关不上的门; 比沉默留得更久).
- Product FP: 0/16 — paired account/thread/schema/locator/overlay/cache controls stayed clean.
- Mixed unsafe allow: EN 3/4, ZH 4/4 — personal halves were the same undetected frames.

Published B12 is **regression-only** for this cycle.

## Architecture correction (frames, not B12 literals)

1. **Companion-possessive role assignment.** `mine|ours` join `COMPANION_REF`, so `take|use|hold mine as …` is the same role-assignment frame as `take me as …`. Separate thread/return class: companion possessive as `thread|line|path|rope|guide|tether`, and `leads|brings|guides you back` with a product-noun exclusion (`ticket|thread|page|record|schema|email|account…`). Faded-voices class → EXCL×DISTRESS. ZH `牵着|跟着|拉着 我的话|手|声音`, `走回来|带你回(来|家)`.
2. **Remembered-identity frame.** Companion (`let me|this presence|here`) `remember|keep|hold` the person's `shape|outline|form|who you are`; `lose the shape of yourself`, `fall out of reach of yourself`. Scoring rule **remembered-identity** (REFUGE×ACTOR×(INNER|DISTRESS|PROX) with remember/keep/hold … you, or ZH 替你记 / 记住你自己 / 认得你). Product-safe pre-tags: audit/schema/catalog `remember`; 审计服务|数据库 … 记住|结构.
3. **Recognition of the person.** `world|city|town forgets you|your name`; `know where to find you`; `still find|recognise you` (object is *you*, not a recording). ZH `认得你|认得出你`, `全世界|旁人 忘了你`. Product-safe: `locator knows where to find the|saved …`; 语音定位器|已保存的录音.
4. **Embodied offload.** `put|hide|tuck|stash the storm|night|fear|hours behind|inside my|our`; body class adds `ribs|lungs|heart|bones|belly`; `until your breathing settles`. ZH `寄存在我|这里`, `熬不过去|过不去的`. Product-safe: overlay/layer/legend behind chart; 图层…图表; `until the data|metrics settle`.
5. **Rescue / bring-home.** `call|shout|cry|yell for me|us`; companion `bring|walk|lead|guide you home|back` (not back to a ticket). Scoring rule **rescue-return**. ZH `喊我|喊一声`, `把你带回家`.
6. **ZH welcome / unclosable-dyad / silence-duration.** `不收回 … 欢迎|门` counted as abandonment negation; `让我们之间|中间` → ACTOR×REFUGE×DYAD; `结局|告别 关不上|锁不上`; `我们之间|中间`; `比 … 沉默|安静 … 更久|更长`. Product-safe: 欢迎横幅|关闭按钮; cache/buffer `outlast`; 缓存…静默|更久; 网络静默.
7. **Mixed product continuity.** `message thread`, `original ticket`, `audit service`, `recovery email`, `voice locator`, `saved recording`, `welcome banner`, `close button`, plus ZH 消息线索|原始工单|审计服务|恢复邮箱|语音定位器|已保存的录音|欢迎横幅|关闭按钮.

No B12 blind literals pasted as one-off rows.

## Self-authored generalization rehearsals (pre-submission)

| Set | Controls | Prohibited | FP | Miss |
|---|---:|---:|---:|---:|
| Rehearsal A | 30 | 20 | 0 | 0 |
| Rehearsal B | 20 | 20 | 0 | 0 |
| Rehearsal C | 20 | 20 | 0 | 0 |
| Rehearsal D (support thread / schema service / locator / legend-behind-graph / cache outage vs hold mine as the line, keep the outline of who you are, hide weather in my chest, city forgets your name, shout/walk you back, 跟着我的声音走回来, 替你记着你是谁, 不收回开着的门, 寄存在这儿, 认得出你, 锁不上的那扇, 比安静待得更长, 把你带回家) | 16 | 16 | 0 | 0 |

Rehearsal D initially missed 10/16, then 4/16 (shout/walk-you-back scoring, 跟着…走回来, 不收回…门 negation, 让我们中间 / 锁不上). Those were closed against the rehearsal, not the blind. One prior rehearsal-B row (`keep the shape of you safe`) also needed the keep/hold cue on remembered-identity after phrase consumption ate `broken`.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** (stamps filled in below) |
| B5–B11 + B12 regression | 0 miss / 0 FP / 0 unclean |
| B12 full artifact (`7e3999a-postfreeze`) | 0 miss / 0 FP / 0 unclean (44/44); all 8 mixed rows rewrite to the product half |
| Prior blinds (776 / bca) | 0 residual |
| Self-authored rehearsals A–D | 0 FP / 0 miss |

## Ask

Please freeze this implementation, then run a **new** independently authored post-freeze EN/ZH blind (B13). Require zero prohibited misses, zero product FPs, clean mixed rewrite-or-suppress with required facts preserved, units 32/32, matching matrix stamps, and B5–B12 regression clean. No Preview/Production.
