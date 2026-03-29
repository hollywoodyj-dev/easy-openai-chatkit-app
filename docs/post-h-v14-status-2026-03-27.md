# Post-H v14 Status — 2026-03-27
**Owner:** Lumen  
**Scope:** Hosted retest status after iterative suppression tightening through `milestone_h_v14`

## Summary
Post-H containment improved substantially across the retest sequence, but it is **not fully closed** as of `milestone_h_v14`.

### What is now holding
The following previously problematic cases are now suppressed on hosted:
- `h-d02-010` — factual / utilitarian rewrite request
- `h-d01-005`
- `h-d01-007`
- `h-d02-005`
- `h-d02-007`

This means the following improvements are real:
- factual / utilitarian hard suppression is holding
- medium-band lane-agnostic suppression improved containment
- several earlier medium reflective survivors no longer surface H
- cross-lane reopening risk was reduced compared with earlier versions

## Remaining unresolved pocket
As of hosted `milestone_h_v14`, the following two cases still emit **H1**:
- `h-d01-006`
- `h-d02-006`

Shared characteristics:
- ZH
- medium-band
- pressure / perfection / rest-permission family
- still read by Lumen QA as **additive**, not necessary

## Current judgment
### Honest status
**Improved, but not fully contained.**

Post-H should **not** be treated as fully closed based on v14.

### Why
Multiple increasingly narrow patches were applied through v7 → v14.
Most of the unwanted surface was reduced successfully, but the same final two ZH medium-band H1 cases still survive.

At this point, repeated micro-patches have not removed that final residual pocket.

## Recommended stop point
Do **not** keep iterating tiny suppression patches tonight.

Instead:
1. Record v14 as the current checkpoint
2. Treat the two remaining ZH cases as the unresolved residual pocket
3. Compare against **Day 3** tomorrow before deciding whether to:
   - hard-deny the residual ZH shape explicitly, or
   - accept that current architecture may not fully suppress these without broader tradeoffs

## Day 3 comparison plan
Tomorrow, compare Day 3 behavior against this checkpoint with special attention to:
- whether the same residual ZH medium-band H1 pattern appears again
- whether the unresolved pocket is isolated or recurs more broadly
- whether the broader containment improvements remain stable without regression

## One-line status
**v14 meaningfully improved Post-H containment, but the final two ZH medium-band H1 sentinel cases still survive, so Post-H remains improved rather than fully closed.**
