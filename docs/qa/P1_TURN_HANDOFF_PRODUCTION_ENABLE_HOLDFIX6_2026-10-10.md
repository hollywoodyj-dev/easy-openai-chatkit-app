# P1 Turn Handoff — Production enable receipt (holdfix6)

**Date:** 2026-10-10 Australia/Sydney  
**From:** NovaInWisewave  
**Authorization:** `docs/qa/P1_TURN_HANDOFF_FOUNDER_TREE_PRODUCTION_AUTHORIZE_HOLDFIX6_2026-10-10.md`  
**Marker:** `p1_response_calibration_v1_holdfix6`  
**Status:** **ENABLED** (controlled observation)

## Code

| Field | Value |
|---|---|
| Branch | `qa/p1-turn-handoff-holdfix6-production` → merged `main` @ `b56c322` |
| Gate key | `P1_TURN_HANDOFF_ALLOW_PRODUCTION` |
| Units | `npm run test:p1-turn-handoff` **15/15** |

## Production env (both required)

```text
ENABLE_P1_TURN_HANDOFF=1
P1_TURN_HANDOFF_ALLOW_PRODUCTION=1
```

Confirmed **unset** / not enabling on Production: S1/S2/S5, S4 relational-promise pathway (S5 probe `enabled: false`).

## Deployment

| Field | Value |
|---|---|
| First Production build (code, env not yet live) | `…-3n01h2uni-…` |
| Redeploy after env | `…-29aiu70re-…` |
| Alias | `https://www.wisewave.io` |

## Verify (www.wisewave.io turn)

| Check | Result |
|---|---|
| `debug_p1_turn_handoff_build_marker` | `p1_response_calibration_v1_holdfix6` |
| `debug_p1_turn_handoff_enabled` | **true** |
| `debug_p1_turn_handoff_flag_set` | **true** |
| `debug_p1_turn_handoff_allow_production_set` | **true** |
| `debug_p1_turn_handoff_blocked_on_production` | **false** |
| `debug_p1_turn_handoff_applied` | **true** |
| S5 enabled | **false** |
| S4 | remains independent HOLD (not authorized) |

## Observation window (Founder)

First 10–15 new written real-user sessions **or** 14 calendar days. No new analytics. Immediate rollback on governance-critical failure.

## Rollback

Unset `ENABLE_P1_TURN_HANDOFF` **or** `P1_TURN_HANDOFF_ALLOW_PRODUCTION` on Production → redeploy/refresh → confirm `enabled=false`. Leave marker and receipts intact.
