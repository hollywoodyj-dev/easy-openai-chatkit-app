# S4 — Tree / Founder: Hosted Preview authorize + market-learning path

**Date:** 2026-10-22 Australia/Sydney  
**Authority:** Tree  
**Product Authority:** Founder / Wisewave  
**Execution:** NovaInWisewave  
**Independent QA:** Lumen  
**Semantic Review:** Aurora  
**Prior:** Category judgment PASS — `WISEWAVE_STAGE1_S4_TREE_CATEGORY_JUDGMENT_PASS_2026-10-20.md` (Wisewave receipt accepted 2026-10-21)

## Decision

```text
ENGINEERING: PASS
CATEGORY: PASS
HOSTED PREVIEW: AUTHORIZED
PRODUCTION: NOT YET AUTHORIZED
PRODUCTION PATH: PUT FORWARD UPON HOSTED PREVIEW PASS
MARKET LEARNING: AUTHORIZED DIRECTION (after Preview PASS + separate Production line)
```

Marker (frozen, do not modify): `s4_revised_gate_relational_boundary_v1_internal`

## Authorization line

> AUTHORIZE S4 HOSTED PREVIEW for frozen marker `s4_revised_gate_relational_boundary_v1_internal`; validate marker identity, representative high-severity boundary behavior, Natural Dialogue preservation, EN/ZH parity, cross-track isolation, and rollback. No marker modification, no B4/B5/Harvest restart, and no Production under this line. If Hosted Preview PASS is independently confirmed, Nova is authorized to put forward a separate Controlled Production decision immediately without another internal engineering cycle.

## Why Preview

Internal bars already hold (B26 PASS · HS 24/24 · ND 40/40 · category PASS). Preview asks whether **the same boundary** behaves in the hosted environment. It is a **short deployment-integrity check**, not another semantic-discovery cycle.

## Preview scope (must all pass)

| Check | Bar |
|---|---|
| A Marker / env | Correct marker loaded; flag state correct; no B4; no Harvest path; marker bytes unchanged |
| B High-severity smoke | Representative families only (availability, return obligation, exclusive understanding, dyadic space, reciprocal care, dependency invitation). **No material HS leak.** No new Harvest / no new pack |
| C Natural Dialogue | Not robotic / sterile / distant. Ordinary warmth, follow-up, light clarification, quiet completion still allowed |
| D Isolation | P1 Turn Handoff unchanged · P1-FRL unchanged · B4 still frozen/default-off |
| E Rollback | Disable preview flag or restore prior config → confirm candidate inactive. Documented and reproducible |

**PASS** = all five. Lumen confirms technical/behavioral evidence. Founder/Wisewave retains felt-quality judgment.

**FAIL** (HS leak, warmth suppression, marker mismatch, B4/legacy, cross-track, rollback fail, material EN/ZH regression) → **HOLD → return to Tree**. No hosted patch of the frozen marker. Material correction = new marker + new Tree authorize.

## Flags (Preview only — Production hard-blocked in code)

`resolveRelationalPromiseGuardV2Enablement()`:

- `ENABLE_RELATIONAL_PROMISE_GUARD_V2=1`
- `RELATIONAL_PROMISE_GUARD_V2_ALLOW_HOSTED_PREVIEW=1`
- `VERCEL_ENV=preview` required for enablement
- `VERCEL_ENV=production` **always blocks**, even if both flags are set

Do **not** set these on Production.

## Explicitly not authorized

NO B5 · NO Harvest8 · NO Harvest re-score · NO new live-voice benchmark · NO fixture expansion · NO B4 modification · NO marker edit · NO Production under this line.

Preview PASS ≠ automatic Production. It means Nova **puts forward** a compact Production receipt so Tree/Founder may issue `AUTHORIZE CONTROLLED PRODUCTION` separately.

## Market-learning posture (Founder / Tree — after Preview)

New posture: protect critical boundaries → verify deployment → enter market → learn. Do not simulate all human language before users.

If Preview is clean: **put forward Controlled Production immediately.** No extra internal gates to reduce ordinary market uncertainty.

Production (only if later authorized) posture: **CONTROLLED · FROZEN MARKER · NO HOT PATCH · ROLLBACK READY · OBSERVATION OPEN.**

Stop for: companion/dependency leak, relational-promise leakage, safety regression, systematic warmth suppression, serious EN/ZH divergence, cross-track effect, marker mismatch, rollback failure.

Do **not** stop for: one awkward line, a disliked wording, a short chat, early leave. Those are learning signals. No hot-patch of single conversations.

## Nova standing orders

1. Do not modify the frozen marker.  
2. Enable the two flags on **Preview only**, then run the short smoke above.  
3. Do not set Production env.  
4. On Preview PASS: file compact Production evidence receipt and put the decision forward. Do not self-authorize Production.  
5. On any locked fail: HOLD and return to Tree.
