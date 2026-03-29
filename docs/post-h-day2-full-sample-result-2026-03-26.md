# Post-H Day 2 Full Sample Result — 2026-03-26
**Run owner:** Lumen  
**Sample source:** Nova-generated Post-H 14-day real-like pool  
**Scope:** Day 2 full pack (`h-d02-001` → `h-d02-012`)  
**Note:** This is a synthetic real-like benchmark pack, not live production traffic.

## Day 2 only result
- **Total reviewed:** 12
- **H appeared:** 8
- **H suppressed:** 4
- **Suppression ratio:** 33.3%
- **Removal better:** 4
- **Guidance drift:** 0
- **Interpretive drift:** 0
- **Authority drift:** 0
- **Weight drift:** 4
- **Duplication drift:** 0
- **Slightly noticeable:** 7
- **Clearly noticeable:** 1
- **Pass:** 8
- **Revise:** 3
- **Remove:** 1

## Comparison with Day 1
Day 1 already showed over-emission risk in medium reflective cases.

Day 2 shows the **same pattern again**, and slightly worse:
- more H appearances
- more removal-better cases
- one factual case with clear H emission that should not have survived at all

So this does **not** look like a one-day quirk.
It looks like a **repeatable suppression weakness**.

## Strongest finding
### The same medium reflective H1 problem repeated
The following Day 2 cases again looked cleaner without H:
- `h-d02-005`
- `h-d02-006`
- `h-d02-007`

Common pattern:
- medium reflective signal
- main reflection already sufficient
- H made the turn heavier and more pointable
- removal improved the response

This matches Day 1 almost exactly.

## New stronger signal
### Factual leakage appeared
Case:
- `h-d02-010` — **"Rewrite this email in a more professional tone."**

Observed:
- H emitted as **H1**
- it was clearly noticeable
- removal was better
- this should have been suppressed outright

This is the clearest Day 2 failure because it crosses from over-emission into a more obvious containment miss.

## What still held
- No guidance drift
- No authority drift
- No duplication drift
- Some factual / low-signal suppression still worked correctly:
  - `h-d02-008`
  - `h-d02-009`
  - `h-d02-011`
  - `h-d02-012`

So the system is not globally broken.
The issue is more specific:
- **medium reflective H1 over-survival**
- plus **at least one factual leakage failure**

## Lumen judgment
### Status
**Confirmed repeat over-emission problem**

### Decision
**Tighten suppression immediately.**

Not full rollback yet, but this is now stronger than a mild watch signal because:
- the same removability problem repeated across two days
- Day 2 produced a factual leakage case

## Recommended action
1. Tighten suppression specifically for **medium reflective H1 candidates**
2. Strengthen factual / utilitarian suppression guardrails so requests like rewrite-email cannot emit H
3. Re-run Day 1 + Day 2 after tightening before trusting H as stable

## One-line conclusion
**Yes — the same problem happened again, and Day 2 added a clearer failure: H still survives too often in medium reflective turns, and it leaked once into a factual request where it should have been impossible.**
