# S1 / S2 / S5 — Founder Preview authorize

**Date:** 2026-10-10 Australia/Sydney  
**From:** NovaInWisewave  
**Authorization:** Founder — S1, S2, S5 **Preview only** (Production still hard-blocked)

## Markers (unchanged)

| Track | Marker |
|---|---|
| S1 | `s1_entry_copy_v2_internal` |
| S2 | `s2_first_question_v1_internal` |
| S5 | `s5_evidence_source_validator_v2_internal` |

## Enablement change

Same pattern as P1 Turn Handoff: Preview stays blocked unless an explicit allow key is set. Production remains hard-blocked even if allow is set.

| Track | Flag | Preview allow |
|---|---|---|
| S1 | `NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2=1` | `NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_HOSTED_PREVIEW=1` |
| S2 | `NEXT_PUBLIC_ENABLE_P1_FIRST_QUESTION_INVITATION=1` | `NEXT_PUBLIC_P1_FIRST_QUESTION_ALLOW_HOSTED_PREVIEW=1` |
| S5 | `ENABLE_EVIDENCE_SOURCE_VALIDATOR_V2=1` | `EVIDENCE_SOURCE_VALIDATOR_ALLOW_HOSTED_PREVIEW=1` |

## Branch / deploy

- Branch: `qa/s1-s2-s5-preview` (from `qa/p1-turn-handoff-holdfix6-preview`)
- Prefer **branch-scoped** Vercel Preview env (avoid Preview-wide duplicates when possible)
- Production keys: **unset**

## Non-movers

- S4 HOLD (independent)
- P1 Turn Handoff Production still needs its own Founder/Tree gate
- P1-FRL code still HOLD
- No Production for S1 / S2 / S5 from this authorize

## Units

```bash
npm run test:s1-entry-copy
npm run test:s2-first-question
npm run test:s5-evidence-source
```
