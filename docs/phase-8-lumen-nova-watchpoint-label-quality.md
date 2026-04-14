# Phase 8 — Lumen → Nova Watchpoint

## Subject
Strong-path label quality is still uneven: some surfaced labels are too faint / generic.

## Status
Watchpoint only — not a guardrail failure, not a reopen of the weak-tail suppression issue.

## Why this note exists
The broader Phase 8 hosted pass improved materially after the weak-tail suppression fix.

Current state:
- Layer A guardrails passed in the tested weak cases
- strong-path reentry still works across delayed-reply and earned-rest families
- the main remaining issue in this slice is **label quality** on some surfaced Continue rows

This is not about exposure inflation anymore.
It is about whether the visible row language is **specific enough to feel earned**, while still staying light.

---

## What is working
Strong-path routing / reentry still looks good.

Observed in hosted testing:
- Continue row surfaced
- selection worked
- continuity anchor loaded
- post-select `mm` remained coherent
- `debug_phase_7.short_ack_reentry = true`
- `debug_phase_7.strong_path_event = true`
- `debug_thread_state = same_thread`
- `debug_continue_reentry_thread_label_preserved = true`

So this note is **not** asking for routing changes.

---

## Watchpoint
Some labels on otherwise valid strong paths still read too faint / generic.

### Examples observed
- `still a faint pull here`
- `this still feels nearby`

These appeared on cases that otherwise behaved correctly.

---

## Why this matters in Phase 8
Phase 8 is trying to preserve:
- selectivity
- boundedness
- non-expansion
- lightness without decorative drift

A label can fail quietly even when the mechanics are correct.

If the row language is too generic:
- it can feel ambient rather than earned
- it becomes less pattern-bound
- it risks soft decorative presence
- it weakens the trust signal of why this Continue row exists

So this is not a technical failure.
It is a **quality / trust-shape watchpoint**.

---

## Important constraint
Do **not** fix this by making labels heavier, longer, more explanatory, or more object-like.

We do **not** want:
- feature-ish naming
- mini summaries
- title-like phrasing
- memory-like wording
- heavier conceptual language

The direction should remain:
- light
- trace-like
- pattern-bound
- quietly specific

---

## Likely issue shape
Current label generation sometimes falls back to residue lines that are valid in tone but too weak in identity.

That means:
- the row is not wrong enough to suppress
- but not distinct enough to feel strongly grounded in a specific return pattern

This is especially noticeable when compared to stronger rows like:
- `Slow reply still pulls inward`
- `Rest still does not feel earned here`
- `Earned rest still feels out of reach`

Those feel more credible because they remain light **and** pattern-specific.

---

## Suggested adjustment direction

### 1. Improve specificity floor for strong-path labels
If a row is already admitted as a strong path, its label should clear a slightly stronger specificity bar than:
- `still a faint pull here`
- `this still feels nearby`

### 2. Prefer family-shaped light labels over generic residue
Where possible, keep labels lightly tied to the actual return family:
- delayed reply / replay / self-blame
- earned rest / permission to stop
- interrupted articulation / shut-down while explaining

### 3. Do not broaden surfacing to solve this
This is a label-quality issue, not a frequency issue.
Do not increase option count or exposure.

---

## QA framing
This is a **watchpoint**, not a blocker.

Current state is:
- guardrails cleaner
- strong-path functioning
- label-quality still uneven

So the right posture is:
- note it
- tighten carefully if easy
- avoid overreacting

---

## Bottom line
Phase 8 no longer looks blocked by weak-tail overexposure in this slice.
The remaining issue is that some otherwise-valid Continue rows are still **too faint in wording to feel fully earned**.

That should be improved carefully, without adding weight.
