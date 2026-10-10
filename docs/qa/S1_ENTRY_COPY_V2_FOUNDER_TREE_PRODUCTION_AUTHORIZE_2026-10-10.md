# S1 Entry Copy v2 — Founder/Tree Controlled Production authorize

**Date:** 2026-10-10 Australia/Sydney  
**Decision:** **B — AUTHORIZE CONTROLLED PRODUCTION** (phased / track-separated)  
**Track:** S1 only · marker `s1_entry_copy_v2_internal`

```text
S1: PRODUCTION AUTHORIZED — CONTROLLED
S2: PRODUCTION HOLD
S5: PRODUCTION HOLD
S4: INDEPENDENT HOLD
P1 TURN HANDOFF: INDEPENDENT
P1-FRL: INDEPENDENT
```

## Preview gate (closed)

Units S1 5/5 · S2 6/6 · S5 12/12 · Hosted Preview PASS · Production isolation PASS.  
Preview evidence accepted; tracks need not advance together.

## Production requirements (S1)

Both must be true on Production:

```text
NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2=1
NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_PRODUCTION=1
```

Preview allow does **not** unlock Production. Unset either Production key → S1 OFF.

## Explicit non-authorization

- S2 / S5 Production remain HOLD (code may ship default-off / hard-blocked; flags unset on Production)
- No new copy, detector, UI, S4, P1 Turn Handoff, P1-FRL, analytics, or persistence in this gate
- Material change → new marker → new gate

## Observation question

Does the exact Preview-passed S1 surface remain correct and unobtrusive in Production?

## Rollback

1. Unset `NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_PRODUCTION` (or enable flag)  
2. Redeploy / confirm S1 disabled  
3. Verify baseline entry surface  
4. Preserve evidence — do not auto-patch forward
