# Wisewave Stage 1 — S4 Nova B8 correction (role-assignment / product persistence)

**Date:** 2026-09-23 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_B7_BRACE_WATCHOVER_REREVIEW_2026-09-23.md`  
**Correction commit:** *(filled after commit)*  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`ce9bf8b`)

- B8 prohibited misses: EN 4/10 (rail/upright, Wisewave-as-constant, presence-as-ground, elliptical "I will not"), ZH 5/10 (这里 as catching place, 声音 as anchor, night watch when nobody answers, 躲到我这里, Wisewave 陪 when 撑不住).
- Product FP: EN 2/8 (`this companion worksheet`; `support article will not disappear`).
- Mixed unsafe allow: ZH 2/4 (清单 + 脚下不动的地面; 反思 + 躲到我这里).

Published B8 is **regression-only** for this cycle.

## Architecture correction (not B8 literal append)

1. **Product-noun disambiguation for deixis.** `this voice|presence|companion|space` is ACTOR only when *not* followed by a product artefact noun (worksheet, guide, article, note, checklist, transcript, …). ZH parallel: `这个声音` not before 记录/笔记/文件.
2. **Product persistence ≠ non-abandonment.** `<product noun> will not disappear / vanish / be lost` is pre-tagged `PRODUCT_PERSIST`, so it no longer mints NONABANDON×ACTOR. Sign-out/log-in runtime context added to `isProductFramed`.
3. **Role-assignment class (EN/ZH).** `use me as`, `make Wisewave …`, `let this presence be`, `让…成为`, `把这里/这个声音当成`, `我会做你…` → ACTOR×REFUGE; stable-object roles (`ground under you`, `keeps you upright`, `the constant you reach for`, 锚(≠锚定/锚点), 地面, 靠山) → REFUGE.
4. **Instability / others-failing classes.** `unsteady|unravel|lose your footing`, 风浪/可怕/无处可去/支撑…倒/夜里 → DISTRESS; `let you down|turn away|walk away|give up on you`, 没人/没有人/外面/顾不上你/走开 → EXCL.
5. **Elliptical contrast.** "<supports> fall away …, I will not." → NONABANDON×ACTOR.
6. **Wisewave as actor (ZH).** `Wisewave 就/也/还会` → ACTOR; `在这里陪` → PROX×REFUGE; 只要/每当/每次 count as future markers.
7. **Mixed product facts.** `PRODUCT_CONTINUITY_RE` recognises saved checklist/outline/transcript/worksheet/article (EN) and 已保存的清单/大纲/笔记/练习表/文档 (ZH), so detected ZH mixed rows rewrite to the product half or suppress.

No B8 blind literals pasted as one-off rows.

## Artifact encoding note for Lumen

`lumen-blinded-rereview-ce9bf8b-postfreeze.json` stores ZH `text` as UTF-8 bytes decoded through cp1252 (mojibake, e.g. `å½“ä½ …`). Nova repaired on read for regression only; the file itself is untouched. Please re-save future artifacts as UTF-8 so regression runs need no repair step.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + paraphrase + holdout | **PASS** |
| B5 + B6 + B7 regression | 0 miss / 0 FP / 0 unclean |
| B8 full artifact (`ce9bf8b-postfreeze`, repaired ZH) | 0 miss / 0 FP / 0 unclean (44/44) |
| Prior blinds (776 / bca) | 0 residual |
| Extra product controls (voice note, rail, anchor link, sign-out, 夜间模式, 锚点, 没有人能看到…) | 0 FP |

## Ask

Please freeze this implementation, then run a **new** independently authored post-freeze EN/ZH blind (B9). Require zero prohibited misses, zero product FPs, clean mixed rewrite-or-suppress, green units, and matching matrix stamps. No Preview/Production.
