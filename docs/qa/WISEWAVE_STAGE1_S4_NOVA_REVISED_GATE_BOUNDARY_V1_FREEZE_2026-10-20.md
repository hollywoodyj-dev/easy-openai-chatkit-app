# S4 — Nova freeze: `s4_revised_gate_relational_boundary_v1_internal`

**Date:** 2026-10-20 Australia/Sydney  
**Authorization:** Tree B — narrow new-marker correction  
`docs/qa/WISEWAVE_STAGE1_S4_TREE_AUTHORIZE_NARROW_NEW_MARKER_CORRECTION_2026-10-20.md`  
**Module:** `lib/wisewave-relational-promise-revised-gate-boundary.ts`  
**Wire:** `lib/wisewave-relational-promise-guard.ts` (`evaluateRelationalPromiseGuard` only — B4 untouched)

```text
MARKER: s4_revised_gate_relational_boundary_v1_internal
STATUS: LUMEN RE-SCORE PASS 2026-10-20 — ENGINEERING PASS
TARGET: five semantic failure families (NOT 8 fixture strings)
NO ID-FIT · NO FIXTURE REWRITE · B4 UNTOUCHED
NO PREVIEW · NO PRODUCTION (category judgment still required)
Lumen: docs/qa/WISEWAVE_STAGE1_S4_REVISED_GATE_BOUNDARY_V1_LUMEN_RESCORE_2026-10-20.md
```

## Correction target (families)

1. persistent personal knowing / remembering  
2. exclusive understanding relative to human others  
3. obligation to return  
4. ongoing dyadic / “our space” relationship framing  
5. reciprocal personal care / user importance to Wisewave  

EN/ZH parity explicitly addressed for dyadic space + reciprocal care (HS-11/12 asymmetry signal).

## Nova engineering evidence (pre-Lumen)

| Layer | Bar | Nova result |
|---|---|---|
| A B26 | MUST PASS | **PASS** |
| B HS | 0 misses (SHA `81b34767…742e`) | **PASS** — 24/24 |
| C ND | 0 harmful FP (SHA `754b66f9…9f7f`) | **PASS** — 40/40 |

Runner: `npm run s4:revised-gate:evidence`  
Artifact: `qa-artifacts/s4-revised-gate/s4-revised-gate-evidence-latest.json`  
Units: `npm run test:s4-revised-gate` + `lib/wisewave-relational-promise-revised-gate-boundary.test.ts` + existing guard suite **89/89** at freeze.

**Nova does not self-certify the revised gate.** Lumen independent re-score required.

## Explicit non-claims

- Not Preview / Production authorization  
- Not category judgment  
- Not B4 change  
- Not Harvest restart  

If Lumen finds any locked bar fail → HOLD → return to Tree (no automatic second cycle).
