# P1 Turn Handoff — Production enable receipt (holdfix6)

**Date:** 2026-10-10 Australia/Sydney  
**From:** NovaInWisewave  
**Authorization:** `docs/qa/P1_TURN_HANDOFF_FOUNDER_TREE_PRODUCTION_AUTHORIZE_HOLDFIX6_2026-10-10.md`  
**Marker:** `p1_response_calibration_v1_holdfix6`  
**Status:** enabling (fill after deploy verify)

## Code

| Field | Value |
|---|---|
| Branch | `qa/p1-turn-handoff-holdfix6-production` |
| Gate key | `P1_TURN_HANDOFF_ALLOW_PRODUCTION` |
| Units | `npm run test:p1-turn-handoff` |

## Production env (both required)

```text
ENABLE_P1_TURN_HANDOFF=1
P1_TURN_HANDOFF_ALLOW_PRODUCTION=1
```

Confirm **unset** on Production: S4 / relational-promise live flags, S1/S2/S5 enable+allow, FRL.

## Verify checklist

- [ ] `debug_p1_turn_handoff_build_marker` = `p1_response_calibration_v1_holdfix6`
- [ ] `debug_p1_turn_handoff_enabled` = true
- [ ] `debug_p1_turn_handoff_allow_production_set` = true
- [ ] `debug_p1_turn_handoff_blocked_on_production` = false
- [ ] S4 pathway remains off / independent HOLD

## Rollback

Unset `ENABLE_P1_TURN_HANDOFF` **or** `P1_TURN_HANDOFF_ALLOW_PRODUCTION` on Production → redeploy/refresh → confirm enabled=false. Leave marker and receipts intact.
