# Phase 7 Evidence QA Checklist (Instrumentation Gate)

## Purpose

Validate the **evidence layer itself** before dashboarding or behavior tuning:

- `meta.phase_7` coherence (`GET /api/chat/threads`)
- `debug_phase_7` coherence (`POST /api/chat/turn`)
- list-side and turn-side alignment under weak suppression and strong-path re-entry

This checklist is for **instrumentation trust**, not habit proof.

---

## Preconditions

- Server running (`/api/chat/*` reachable).
- Valid token with chat access.
- Phase 7 instrumentation commit deployed (`phase7_v1` taxonomy expected).

Optional env:
- `PHASE7_BASE_URL` (default `http://127.0.0.1:3000`)
- `PHASE7_TOKEN`

---

## Fast Automated Gate (Nova)

Run:

```bash
set PHASE7_BASE_URL=http://127.0.0.1:3000&& set PHASE7_TOKEN=<token>&& node scripts/phase7-evidence-probes.cjs
```

Expected:
- Script exits `0`
- Final line includes `PASS`

What it verifies:
1. Normal list branch emits `meta.phase_7` + normalized exposure fields.
2. Weak-tail suppression emits:
   - `continue_suppressed_last_user_turn: true`
   - `phase_7.weak_case_suppressed_event: 1`
   - `phase_7.zero_surface_success_event: 1`
3. Continue select + `mm` re-entry emits:
   - `debug_phase_7.return_pattern_id: "low_verbal_resumable_return"`
   - `debug_phase_7.short_ack_reentry: true`
   - `debug_phase_7.strong_path_event: true`

---

## Manual Spot Checks (Lumen)

## 1) List-side phase_7 presence

Trigger a normal reflective turn and call `GET /api/chat/threads`.

Expected fields:
- `meta.phase_7.taxonomy_version === "phase7_v1"`
- `meta.phase_7.exposure_denominator_event === 1`
- `meta.phase_7.exposure_numerator_event` matches whether rows surfaced
- `meta.phase_7.option_count` matches `threads.length`

## 2) Weak suppression coherence

After a shallow tail (`Thanks.` / coordination), call `GET /api/chat/threads`.

Expected:
- `meta.continue_suppressed_last_user_turn === true`
- `threads: []`
- `meta.phase_7.weak_case_suppressed_event === 1`
- `meta.phase_7.zero_surface_success_event === 1`
- `meta.phase_7.exposure_numerator_event === 0`

## 3) Strong-path coherence

Flow:
1. Create strong substrate.
2. Select Continue row.
3. Send short re-entry (`mm` / `yeah`) with `phase_3_thread_reentry: true`.

Expected turn fields:
- `debug_phase_7.taxonomy_version === "phase7_v1"`
- `debug_phase_7.return_pattern_id === "low_verbal_resumable_return"` (for low-verbal ack)
- `debug_phase_7.short_ack_reentry === true`
- `debug_phase_7.strong_path_event === true`
- Coherence cross-check:
  - `debug_continue_reentry_continuation_turn === true`
  - `debug_thread_state === "same_thread"`

## 4) Cross-layer consistency check

When turn shows low-verbal re-entry (`debug_phase_7.return_pattern_id` low-verbal),
subsequent `GET /api/chat/threads` should still emit valid `meta.phase_7` with same `taxonomy_version`.

---

## Failure Conditions (Do Not Proceed to Dashboarding)

- Missing `phase_7` payload in any key list branch (normal / suppressed / storage-unavailable).
- `taxonomy_version` mismatch across list-side and turn-side.
- Suppressed weak case missing `weak_case_suppressed_event`.
- `strong_path_event` false in clear short-ack same-thread resumed path.
- Field semantics drift (`option_count` vs `threads.length`, exposure numerator mismatch).

---

## Exit Rule

Only move to Phase 7 dashboard/query work when:

1. Automated probe script passes.
2. Manual spot checks pass in local and hosted.
3. Lumen confirms instrumentation trust gate is **PASS**.

Until then: no interpretation claims about habit formation.
