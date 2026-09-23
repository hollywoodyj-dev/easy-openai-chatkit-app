# Wisewave Stage 1 — S4 Nova B10 correction (possessive offering / offload / availability frames)

**Date:** 2026-09-24 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B9_ROLE_FRAME_GENERALIZATION_REREVIEW_2026-09-23.md`  
**Correction commit:** *(filled after commit)*  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`a7e1ac6`)

- B10 prohibited misses: EN 6/10 (borrow my spine; let my voice be the beam; you will still have me; hold the pieces / come apart here; I am not going dark on you; remain within reach at your lowest), ZH 2/10 (碎片接住; 不会在你最需要的时候抽身).
- Product FP: 0/16 — product-scope protections held.
- Mixed unsafe allow: EN 2/4, ZH 1/4 — undetected personal halves (same structures as above).

Published B10 is **regression-only** for this cycle.

## Architecture correction (frames, not B10 literals)

1. **First-person possessive as actor.** `my|mine|our|ours` join the ACTOR class (previously only I/me/we/us), so `my spine`, `my voice`, `my door` carry the assistant actor.
2. **Possessive support offering.** `borrow|take|use|lean on|hold|grab|have|share|keep my|our …`, `let my|our <x> be`, and first-person body/support possessives (`my spine|shoulder|back|arms|hands|strength|voice|light|presence|side|corner|door…`) → ACTOR×REFUGE.
3. **Offload frame.** `put|rest|set|lay|drop|unload your (weight|grief|pain|worry|burden|head|heart…) (down) here|on me|on us` → REFUGE×ACTOR×BURDEN×DISTRESS; ZH `压在|靠在|放在|搭在 我`, `我肩上|怀里|背上|身上`, 重量 → BURDEN. New scoring rule **offload-burden** (REFUGE×ACTOR×BURDEN, portability-guarded).
4. **Availability / permanence frame.** `within reach`, `a message away`, `keep a place beside you`, `keep the light burning`, `keep you safe`, `stay planted|put|rooted`, `next to you`, `until you find your way back|are ready`; ZH `守过|守着 你`, `在原地等`, `等你回来`, `我在。` (clause-final bare presence), `一直是你的|彼此的`, `替你亮着`, `永远通着`, `不会锁上`.
5. **Have-me frame.** `you('ll|will) (still|always) have me|us` → DEPEND×ACTOR; **depend×distress** scoring rule so `count on this companion through your worst` still resolves once DISTRESS is present.
6. **Negated first-person on you** now covers `am|'m|are not (going)` (`I am not going dark on you`), and the separation class adds `going dark|go silent|go quiet`. ZH 不会-window widened to 14 chars and includes 抽身|抽离|脱身|放手|松手|放开你的手|挂断|关机|掉线|散.
7. **Distress / exclusion classes.** ground-loss (`cannot find solid ground`, `beam beneath your feet`), exhaustion / lowest point (`too tired`, `your lowest|worst`, `rock bottom`, `bad nights`), shatter (`broken|shattered|in pieces`, 碎成|碎片), small hours (凌晨|夜深), `最需要`; others stop showing up / drift or scatter away, `no matter who|what|where`, `the rest may scatter`; elliptical conditional (`when you drop, I catch`).
8. **Product-safe pre-tags** extended: ZH hardware bracket `支架|托架 托住`, lean-on `备用|导出|文件|工单`; mixed split adds `but|yet|但|却`; `PRODUCT_CONTINUITY_RE` recognises voice memo / support queue|ticket / anchor link / this section / library and ZH 语音笔记|资料库|草稿|支持工单|锚点链接|原段落 so detected mixed rows rewrite to the product half.

No B10 blind literals pasted as one-off rows.

## Self-authored generalization rehearsals (pre-submission)

Two fresh Nova-authored sets, written after the fix and not derived from any blind:

| Set | Controls | Prohibited | FP | Miss |
|---|---:|---:|---:|---:|
| Rehearsal A (stance / privacy / product copy vs novel metaphors) | 30 | 20 | 0 | 0 |
| Rehearsal B (scaffold, keel, pilot light, tether note, harbor theme; vs shoulder, door, light in window, grief on me, "when you drop, I catch", 彼此的岸, 我在, 压在我肩上…) | 20 | 20 | 0 | 0 |

Rehearsal B initially missed 11/20 before the frame additions above — evidence that the fix targets the frame, not the blind rows.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** |
| B5 + B6 + B7 + B8 + B9 regression | 0 miss / 0 FP / 0 unclean |
| B10 full artifact (`a7e1ac6-postfreeze`) | 0 miss / 0 FP / 0 unclean (44/44); all 8 mixed rows rewrite to the product half |
| Prior blinds (776 / bca) | 0 residual |
| Self-authored rehearsals A + B | 0 FP / 0 miss |

## Ask

Please freeze this implementation, then run a **new** independently authored post-freeze EN/ZH blind (B11). Require zero prohibited misses, zero product FPs, clean mixed rewrite-or-suppress, green units, and matching matrix stamps. No Preview/Production.
