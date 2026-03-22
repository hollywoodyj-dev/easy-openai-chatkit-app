# Milestone H — Live QA Scenario Pack Summary

**Status:** Real stabilization finding  
**Owner:** Lumen  
**Scope:** 30-scenario live QA pack  
**Method:** hosted turns + Drift Detection Checklist + Removal Test + PASS / REVISE / REMOVE verdict

---

## Executive conclusion

Milestone H is **workable**, but the scenario pack shows that current stabilization logic is still **too permissive** in some lanes.

### Strongest summary
> **H4 is the cleanest surviving kind, H5 is valid when the inner split is explicit, while H3 is the weakest lane and H1 is still too permissive on mild / low-signal inputs.**

---

## Main findings

## 1. H3 is the clearest stabilization problem
Across the scenario pack, H3 repeatedly leaked into turns where it should not have appeared.

### Failure pattern
H3 appeared on:
- low-signal / vague cases
- practical help requests
- utilitarian requests
- uncertain-but-task-oriented turns

### Why this matters
When H3 leaks, it tends to become:
- subtle instruction
- pause-as-advice
- unnecessary structure
- better removed

### Practical conclusion
**H3 eligibility is too loose and should be tightened significantly.**

---

## 2. H1 is not catastrophic, but still too easy to trigger
H1 often appeared on:
- mild unease
- mild tension
- generic overthinking
- repetition-shaped but weak-evidence turns

### Problem
In many of these cases:
- H was not clearly harmful
- but it was also not clearly necessary
- removal made the response same or better

This violates the stabilization rule:
> keep H only when removing it makes the turn clearly worse

### Practical conclusion
**H1 eligibility should be tightened moderately, especially on low-intensity states.**

---

## 3. H4 is the healthiest current lane
H4 performed best in scenarios involving:
- pressure
- effort tightening
- “must get it right”
- proving / worth-threat structure
- exhaustion + pushing

### Why it works better
- it fits a clearer inner pattern
- it stays relatively light
- it earns its place more often than H1/H3

### Practical conclusion
**H4 is currently the strongest H kind and the best candidate to preserve as the narrow core lane.**

---

## 4. H5 is valid when the split is explicit
H5 did not appear often, but when it did, it was one of the most justified.

Best condition:
- real divided pull
- clear two-sided tension
- explicit stuck-between structure

### Practical conclusion
**H5 is viable, but should remain narrow and explicit.**

---

## 5. Suppression is often healthier than emission
One of the strongest scenario-pack lessons is:

> the system is usually safer when H stays out.

That is not a failure of Milestone H.
It is exactly the stabilization logic H is supposed to respect.

So the scenario pack actually supports:
- stronger suppression
- stricter removal-first judgment
- fewer emitted H moments

---

## Verdict pattern across the pack

### PASS tended to cluster in:
- strong H4 pressure / worth-threat cases
- explicit H5 split cases
- correct suppression on clear low-signal / utilitarian turns

### REVISE tended to cluster in:
- H1 on generic reflective inputs
- plausible but not clearly earned H
- mild weight / craftedness cases

### REMOVE tended to cluster in:
- H3 on low-signal inputs
- H3 on utilitarian/help-request turns
- H1 on very mild unease / tension cases

---

## Operational recommendation

## Tighten immediately
### 1. H3 eligibility
Stronger suppression for:
- utilitarian turns
- practical help requests
- vague / low-signal inputs
- thin uncertainty that is not truly reflective

### 2. H1 eligibility
Stricter threshold for:
- mild unease
- mild tension
- generic “off” states
- lightly reflective but low-clarity inputs

---

## Preserve carefully
### 3. H4 lane
Keep as the main viable H lane for now:
- pressure
- proving
- worth-threat
- effort tightening

### 4. H5 lane
Keep for explicit split / divided-pull cases only.

---

## Recommended product stance after this pack
If the team wants the cleanest stabilization posture, the most honest direction is:

> **narrow H, don’t broaden H**

Meaning:
- fewer H emissions overall
- sharper kind eligibility
- stricter suppression on weak cases
- preserve only the kinds that keep earning themselves

---

## One-line conclusion
**The 30-scenario live QA pack shows that Milestone H is viable, but stabilization should now tighten H3 significantly and H1 moderately, while preserving H4 as the strongest lane and H5 as a narrow explicit-split lane.**
