# P1 Turn Handoff — Founder / Tree Controlled Production Authorization

**Date:** 2026-10-10 Australia/Sydney  
**Product Authority:** Founder / Wisewave  
**Execution:** Nova  
**Review:** Tree · Aurora · Lumen  
**Decision:** **B — AUTHORIZE CONTROLLED PRODUCTION**

## Final lock

| Field | Value |
|---|---|
| Marker | `p1_response_calibration_v1_holdfix6` **ONLY** |
| Local | PASS |
| Hosted Preview | PASS / CLOSED |
| Production | **AUTHORIZED — CONTROLLED** |
| Production allow gate | `P1_TURN_HANDOFF_ALLOW_PRODUCTION` (minimum explicit; server-side) |
| S4 | **HOLD / INDEPENDENT** |
| Rollback | Required and immediate |

## Enablement (Production)

Both required; unset either → OFF:

```text
ENABLE_P1_TURN_HANDOFF=1
P1_TURN_HANDOFF_ALLOW_PRODUCTION=1
```

Hard rules: default-off; server-side only; Preview allow does **not** unlock Production; no client flag; no implicit enable.

## Non-bundled

Do not ship with this gate: S4, FMI changes, FRL, Carry, Return Anchor, Reminder, new analytics, UI changes, marker change. Marker change expires this authorization.

## Observation

Observation gate, not a success declaration. Window: first 10–15 new written real-user sessions **or** 14 calendar days. No new analytics under this gate. See Founder decision body for stop conditions and review pack.

## Founder line

> We have tested whether it can run as designed.  
> Now we may carefully test whether it belongs in the real experience.  
> Production is an observation gate, not a declaration of success.
