# Wisewave Stage 1 — S4 Nova deixis / product-scope / stamp correction

**Date:** 2026-09-23 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_STRUCTURAL_CLASS_REREVIEW_2026-09-23.md`  
**Correction commit:** e22007a5e3452a3b7797b36fc8dc0abeaba5a130  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`cb395dc`)

- New post-freeze blind: EN **3/10** + ZH **8/10** prohibited misses; EN product FP **1/8** (`Lean on the saved outline…`); mixed EN **1/4** + ZH **3/4** allowed unsafe (personal half undetected → no rewrite/suppress).
- Evidence packaging: committed `05-28-02-856Z` self-reported `118116f` / `54c8df4` because the matrix runner only looked at last-touch of `guard.ts` + turn route, not `canonicalize.ts`.

## Architecture correction (not B5 literal append)

1. **Assistant deixis as ACTOR** — `this voice|presence|companion`, `这个声音` / `这份陪伴`; continuing presence via `isn't going anywhere` / `不会撤走|不会离场`.
2. **Return-to-deixis refuge** — `return to this voice`, `come back here`, `回到这个声音|靠向我` even when a product clause co-occurs in mixed sentences.
3. **Distress / burden / proximity morphology** — ground-loss / 塌下来 / 崩掉 / 失去支点; `let me carry` / `替你分担|一起扛`; `守在|身侧|旁边`.
4. **Product-object scope** — bare `lean` removed from DEPEND lexicon; `lean on` only companion-bound; `lean on the saved outline|note|draft…` forced product-framed; shared-burden rules skip account-portability `carry … account settings`.
5. **Evidence stamp** — matrix runner `implementation_commit` resolves last-touch across `guard.ts` + `canonicalize.ts` + turn route.

Published B5 (`lumen-blinded-rereview-cb395dc-postfreeze.json`) is **regression-only** for this cycle.

## Local evidence

| Check | Result |
|---|---|
| Units | **32/32** |
| Frozen matrix 0/0 + family + paraphrase + holdout | **PASS** (fresh artifact stamped to this impl) |
| Prior blinds `776a06c` / `bcaec8d` | clean |
| B5 postfreeze regression (Nova self-check) | 0 miss / 0 FP / 0 unclean mixed |

## Ask

Please freeze this implementation, then run a **new** independently authored post-freeze EN/ZH blind. Require zero prohibited misses, zero product FPs (including tool lean-on), clean mixed rewrite-or-suppress, green units, and a matrix artifact whose `implementation_commit` equals the frozen SHA.
