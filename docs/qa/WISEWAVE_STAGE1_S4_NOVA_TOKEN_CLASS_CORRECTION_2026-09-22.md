# Wisewave Stage 1 — S4 Nova token-class correction (post canonicalize HOLD)

**Date:** 2026-09-22 AEST  
**Responds to:** `docs/qa/WISEWAVE_STAGE1_S4_LUMEN_CANONICALIZE_ARCHITECTURE_REREVIEW_2026-09-22.md`  
**Correction commit:** `118116f878d76f13283df1502cf1721878950778`  
**Frozen matrix SHA-256 (unchanged):** `016afc00d4354ccae4f8587a5908e245d3a1da50bd3a380b445a5b242fd6f0bc`  
**Deployment:** Still none for Preview / Production. S3 offline-fixtures-only.

## What failed previously (`dac0a9b`)

- Blinded semantic gate: EN **8/8** + ZH **8/8** prohibited misses; mixed rows returned unchanged.
- Unit regression: browser-runtime wording falsely blocked via bare `stay` → `PROX`, which defeated product exclusion.
- Product FPs on that blind set were 0/6; frozen matrix remained 0/0.

## Architecture correction (not literal append of BLIND3)

1. **Removed** bare `stay`/`staying` → `PROX`. Runtime `stay open` is marked product-neutral; proximity requires a complement (`stay with` / `beside` / etc.).
2. **Token-class lexicons** after multi-word constructions: ontological synonym classes (abandonment, proximity, refuge, distress, exclusive-other, shared burden, future/conditional) — not catalogues of disclosed blind-probe strings.
3. **Structural family rules** over concept streams (e.g. actor×nonabandon with CJK-safe negation; anticipatory future×distress×refuge vs temporal pain; exclusivity compounds before short `with me`).
4. **Stronger companion-intimacy gate** for product-framed text: EXCL alone or bare PROX no longer overrides product access-control / browser framing.

## Local evidence at `118116f`

| Check | Result |
|---|---|
| Unit tests `npm run test:s4-relational-promise` | **32/32** (browser wording allows) |
| Frozen matrix 0/0 + family + paraphrase + holdout | **PASS** — `qa-artifacts/s4-relational-promise/matrix-evidence-2026-09-22T05-53-57-858Z.json` |
| Prior blinds `776a06c` / `bcaec8d` | **0** misses / **0** product FP |
| Regression on disclosed BLIND3 set (Nova self-check only) | **PASS** — `qa-artifacts/s4-relational-promise/lumen-blinded-rereview-118116f.json` (0/8+0/8 misses; 0 product FP; mixed clean) |

Nova self-check on the disclosed BLIND3 set is **not** a substitute for Lumen’s next independently authored blind gate.

## Ask

Please freeze `118116f`, then run a **new** independently authored post-freeze EN/ZH blinded set. Require zero prohibited misses, zero product-continuity false positives, clean mixed rewrite-or-suppress, and no regression on the browser-runtime product exclusion before S4 PASS.
