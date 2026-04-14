# Phase 8 — Lumen → Nova Adjustment Note

## Subject
Weak-case suppression is still too permissive in logistics / coordination tails.

## Status
Action needed before any positive Phase 8 interpretation.

## Why this note exists
Initial Phase 8 hosted smoke shows that strong-path Continue behavior is still working, but **Layer A guardrail integrity is not yet clean enough**.

The current issue is not strong-path quality.
The issue is **weak-case surfacing that still appears in contexts that should remain zero-surface**.

That means we should **not** read any reuse signal as evidence of a bounded habit layer yet.

---

## Environment
- Hosted: `https://www.wisewave.io`
- Token-auth path: provided Phase 8 test account
- QA date: 2026-04-14

---

## Main finding
Pure polite closure suppression still works.
But logistics / coordination tails are still surfacing Continue rows when they likely should not.

This is too close to the failure mode described in:
- `docs/phase-8-addendum-protected-habit-layer-guardrails.md`
- `docs/phase-8-octopusmind-strategic-diagnosis.md`

Especially these constraints:
- zero-surfacing in weak cases remains a success condition
- exposure inflation invalidates habit signals
- weak exposure consumes trust budget
- decorative / ambient Continue presence is not acceptable evidence

---

## Repros

### PASS control — pure polite close
**User input**
- `thanks`

**Observed**
- `threads: []`
- `continue_suppressed_last_user_turn: true`
- `meta.phase_7.zero_surface_success_event = 1`
- `meta.phase_7.weak_case_suppressed_event = 1`
- `option_count = 0`

**Interpretation**
- This behavior is correct.

---

### FAIL / WATCH case 1 — logistics tail
**User input**
- `ok I will do it later today`

**Observed**
- Continue surfaced
- label: `still a little open`
- `zero_surface_success_event = 0`
- `weak_case_suppressed_event = 0`
- `option_count = 1`

**Interpretation**
- This should likely suppress.
- The line reads light, but the *behavior* is too permissive.
- It creates exactly the kind of soft decorative carry-over that Phase 8 is trying to avoid.

---

### FAIL / WATCH case 2 — coordination / planning tail
**User input**
- `let us do phase 8 first and come back later`

**Observed**
- Continue surfaced
- label: `not quite settled yet`
- `return_pattern_id = recent_unfinished_return`
- `zero_surface_success_event = 0`
- `weak_case_suppressed_event = 0`
- `option_count = 1`

**Interpretation**
- This is especially risky because the system appears to be interpreting process coordination as admissible emotional return structure.
- Even if the wording is soft, the surfacing is too generous for Phase 8 guardrails.

---

## Important counterpoint
Strong-path is still functioning.

### Strong-path sample
**User input**
- `After a slow reply, I keep replaying what I said and feel like I messed something up.`

**Observed**
- valid Continue row surfaced
- thread label: `Silence still turns inward`
- `POST /api/chat/threads` selection succeeded
- `GET /api/chat/continuity` returned `Still heavy after a wait.`
- after short ack `mm`:
  - `debug_continue_reentry_continuation_turn = true`
  - `debug_phase_7.short_ack_reentry = true`
  - `debug_phase_7.strong_path_event = true`
  - `debug_thread_state = same_thread`

**Interpretation**
- This means the fix target should be narrow.
- We do **not** want broader re-tuning.
- We want tighter suppression / admissibility specifically for weak logistics / coordination tails.

---

## Diagnosis
Current routing seems to be over-crediting:
- deferred action phrasing
- process coordination language
- “come back later” style lines
- lightly unfinished task wording

These likely drift into:
- `recent_unfinished_return`
- or another admissible Continue corridor

when they should remain in the **zero-surface weak-case bucket** unless there is clear reflective / emotional / return-pattern substance.

---

## Recommended adjustment direction

### 1. Tighten weak-case suppression for logistics / coordination tails
Treat inputs like these as suppression-first unless they contain clear reflective self-return structure:
- `later today`
- `come back later`
- `do X first`
- planning / scheduling / coordination wrap-up language
- procedural next-step language

### 2. Do not let “unfinished” semantics alone qualify
A line should **not** become Continue-eligible just because it implies something is unfinished.

Phase 8 needs:
- pattern-bound return relevance
- not generic unfinishedness
- not operational deferral

### 3. Narrow `recent_unfinished_return`
If logistics / process phrasing is getting classified into `recent_unfinished_return`, tighten that boundary.

Suggested principle:
- unfinished **task/process** ≠ unfinished **inner return pattern**

### 4. Preserve strong reflective delayed-reply / replay / earned-rest paths
Do not broaden the fix into a general suppression pass.
The strong-path sample above is good and should remain intact.

---

## Proposed QA acceptance for the fix
These should all zero-surface after the adjustment:
- `ok I will do it later today`
- `let us do phase 8 first and come back later`
- similar planning / coordination / defer-for-later tails

These should still surface when warranted:
- delayed reply / replay / self-blame returns
- earned-rest / permission-to-stop strong paths
- other already-proven strong reflective return patterns

---

## Phase 8 interpretation rule
Until this is fixed, we should treat Phase 8 as:
- **guardrails not yet clean**
- **habit signal not interpretable**

Because if exposure is still too permissive in weak contexts, any reuse read is contaminated.

---

## Bottom line
The current issue is **not** that Continue is too strong.
The issue is that it is still **showing up where Phase 8 needs restraint**.

So the right next move is:
- **tighten suppression / admissibility in logistics + coordination weak tails**
- **retest Layer A**
- **only then resume habit-layer interpretation**
