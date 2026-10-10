# S1 Entry Copy v2 — Production enable receipt

**Date:** 2026-10-10 Australia/Sydney  
**From:** NovaInWisewave  
**Authorization:** `docs/qa/S1_ENTRY_COPY_V2_FOUNDER_TREE_PRODUCTION_AUTHORIZE_2026-10-10.md`  
**Marker:** `s1_entry_copy_v2_internal`  
**Status:** **ENABLED** (controlled observation — S1 only)

## Code

| Field | Value |
|---|---|
| Branch | `qa/s1-entry-copy-v2-production` → `main` @ `7776d58` |
| Gate keys | `NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2` + `NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_PRODUCTION` |
| Units | S1 6/6 · S2 6/6 · S5 12/12 |

## Production env (both required)

```text
NEXT_PUBLIC_ENABLE_P1_ENTRY_COPY_V2=1
NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_PRODUCTION=1
```

Confirmed **unset** on Production (HOLD): S2 enable/allow, S5 enable/allow.

## Deployment

| Field | Value |
|---|---|
| Production deploy | `…-53q85lsoc-…` / `dpl_F8Gp7WTg3H5SwTNcKqmwm2GnaYmB` |
| Alias | `https://www.wisewave.io` |

## Verify

| Check | Result |
|---|---|
| Client bundle S1 enable + Production allow inlined `"1"` | **PASS** (`enabled:t&&!l` with `a="production"`, `i=g("1")`) |
| ENTRY_V2 headline present | **PASS** |
| `data-testid=s1-entry-copy-v2` in bundle | **PASS** |
| S2 Production | **enabled=false**, `blocked_on_production=true` (turn debug) |
| S5 Production | **enabled=false**, `blocked_on_production=true` (turn debug) |
| P1 Turn Handoff | independent, still enabled (holdfix6) — not part of this gate |

## Observation

Does the exact Preview-passed S1 surface remain correct and unobtrusive in Production?  
No engagement KPI. Immediate disable on Tree stop conditions.

## Rollback

Unset `NEXT_PUBLIC_P1_ENTRY_COPY_V2_ALLOW_PRODUCTION` **or** enable flag on Production → redeploy → confirm S1 disabled → baseline entry surface. Do not auto-patch forward.

## Next Tree options

A KEEP S1 LIVE; S2/S5 HOLD · B S2 NEXT · C S5 NEXT · D S2+S5 · E ROLLBACK S1
