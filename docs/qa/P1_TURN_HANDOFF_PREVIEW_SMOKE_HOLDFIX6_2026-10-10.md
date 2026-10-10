# P1 Preview smoke — holdfix6 (Tree option 2)

**Date:** 2026-10-10 Australia/Sydney  
**From:** NovaInWisewave  
**Authorization:** Tree option **2** — P1 Preview only, controlled hosted smoke  
**Verdict:** **PASS** (Preview smoke). Production still hard-blocked. Separate Production decision still required.

## Version lock

| Field | Value |
|---|---|
| Marker | `p1_response_calibration_v1_holdfix6` |
| Branch | `qa/p1-turn-handoff-holdfix6-preview` |
| Head (smoke) | `8ba8e1e` (empty redeploy trigger on top of `01c93d8` metadata cast + `ea249c9` freeze) |
| Units | `npm run test:p1-turn-handoff` **16/16** |
| S4 | Independent HOLD — not a pass criterion for this Preview |

No P1 appendix / detector edits in this Preview window beyond the frozen holdfix6 slice (plus a Prisma metadata cast required for Preview build).

## Enable config (Preview isolation)

| Key | Scope | Value |
|---|---|---|
| `ENABLE_P1_TURN_HANDOFF` | Preview + branch `qa/p1-turn-handoff-holdfix6-preview` | `1` |
| `P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW` | Preview + branch `qa/p1-turn-handoff-holdfix6-preview` | `1` |
| Same keys on Production | **unset / not set** | Production hard-block in code remains |

**Watchpoint:** a Preview-*wide* pair was also set so CLI deploys (no git-branch metadata) could enable the flag. Prefer keeping only the **branch-scoped** pair after Steward removes the Preview-wide duplicates in the Vercel dashboard (`vercel env rm` cannot disambiguate duplicates). Code still blocks Production even if Preview allow is set.

Default-off elsewhere: without both flag + Preview allow, Preview stays blocked (`blocked_on_preview: true`).

## Preview deployment (smoke target)

- URL: `https://wisewave-chatkit-app-v2-qzi9arnnd-jing-yangs-projects-db5d1ce8.vercel.app`
- Inspect: `https://vercel.com/jing-yangs-projects-db5d1ce8/wisewave-chatkit-app-v2/BgPFMmAYgh5XJkX27CUa4Mo8jMgn`
- Deployment id: `dpl_BgPFMmAYgh5XJkX27CUa4Mo8jMgn`
- Target: Preview (Vercel Authentication on; probes used `vercel curl`)
- GitHub-linked twin also Ready: `…-oqzj63cj6-…` (same commit window; flags on)

## Smoke results

Artifact: `qa-artifacts/p1-turn-handoff/preview-smoke-holdfix6-latest.json`  
SHA-256: `6f0535dc5a0f3d09fcca8924e069dc3b2f8c3fd62801213213a50e767549d7e3`  
Script: `scripts/p1-holdfix6-preview-smoke.cjs`

| Case | Result |
|---|---|
| PROD-ISOLATION (`www.wisewave.io`) | PASS — P1 debug fields absent / not applied (branch not merged) |
| TH-11 continue-stuck ZH | PASS — locked reply exact; `continue_stuck_locked_reply: true` |
| TH-10 EN / ZH | PASS — applied; two-sided material held without lock requirement in this smoke |
| TH-13 correction | PASS — correction lock; no stray `}` |
| TH-03 | PASS |
| TH-15 repeat | PASS — second turn `repeat: true` |
| TH-16 missing prior | PASS — `missing_prior: true` |
| CTRL-EN / CTRL-ZH utilitarian | PASS — suppression path |

Real response path confirmed: `vercel_env: preview`, `flag_set/enabled/allow_preview: true`, `blocked_production: false`, marker `p1_response_calibration_v1_holdfix6` on every smoke turn.

## Diff vs local holdfix6 PASS

- Hosted Preview now proves the same marker and TH-11 locked continue-stuck as Lumen local PASS (`docs/qa/P1_TURN_HANDOFF_LUMEN_HOLDFIX6_PASS_2026-10-09.md`).
- No local↔hosted safety regression observed in this slice.
- TH-10 smoke did not require `two_sided` debug true (model path + applied appendix); lock path still covered by units.

## Rollback

1. Unset Preview env: `ENABLE_P1_TURN_HANDOFF` and `P1_TURN_HANDOFF_ALLOW_HOSTED_PREVIEW` (branch-scoped and any Preview-wide duplicates).
2. Redeploy Preview (or leave dormant — without both keys, Preview cannot apply).
3. Do **not** merge to Production / do **not** set Production flags.
4. Production remains hard-blocked in `resolveP1TurnHandoffEnablement()` when `VERCEL_ENV=production`.

## Not authorized

- Production enable or merge decision  
- S4 release / Preview (S4 stays HOLD)  
- Auto next correction cycle
