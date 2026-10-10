# P1-FRL — Preview branch push

**Date:** 2026-10-11 Australia/Sydney  
**From:** NovaInWisewave  
**Branch:** `qa/p1-frl-preview`  
**Commits:** `ec4e8c0` → `0448a41` → `350da09` (typecheck fix)  
**Authorize:** `docs/qa/P1_FRL_FOUNDER_TREE_AUTHORIZE_HOSTED_PREVIEW_2026-10-11.md`

## Pushed

Founder B package: P1-FRL Hosted Preview allow path + Aurora COPY LOCK + S4 B4 freeze (`s4_live_voice_frames_v1_3_b4_internal`). Units on branch: FRL 24/24, S4 80/80.

## Preview env (set)

Branch-scoped on `wisewave-chatkit-app-v2`:

| Key | Value | Branch |
|---|---|---|
| `ENABLE_P1_REFLECTION_LITERACY` | `1` | `qa/p1-frl-preview` |
| `P1_REFLECTION_LITERACY_ALLOW_HOSTED_PREVIEW` | `1` | `qa/p1-frl-preview` |

Production: **unset**. Preview allow does not unlock Production.

First CLI deploy failed typecheck (`utilitarian` not in `P0OpeningType`); fixed in `350da09`. Redeploy after fix.

## Preview URL (READY)

- Deployment: `https://wisewave-chatkit-app-v2-3if3e40zu-jing-yangs-projects-db5d1ce8.vercel.app`
- Inspect: `https://vercel.com/jing-yangs-projects-db5d1ce8/wisewave-chatkit-app-v2/DpvDm33W72JWvdC5L2gDw665cFjq`
- Note: Deployment Protection (Vercel auth) may apply.

## Lumen smoke (when Preview URL live)

Flag-on: FRL-07/08/09/10 + genuine bypass + safety; EN/ZH.  
Confirm `debug_p1_frl_*` enabled / not blocked_on_preview; marker `p1_reflection_literacy_v1_internal`.  
Production isolation: www must stay FRL-off.

## Also on this branch

S4 B4 frames (default-off; no S4 Preview/Production). Harvest7 unlabeled still pending.
