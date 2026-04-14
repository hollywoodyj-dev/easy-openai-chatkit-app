# Phase 8 — Nova QA Pass Framework

## Purpose (what this pass is / is not)

**Is:** Guardrail integrity + qualitative “felt” checks + interpretation discipline (habit signal vs guardrail layer).

**Is not:** Proof that a “habit layer” exists, product expansion sign-off, or celebrating reuse ↑ without exposure/ignore-path context.

## Preconditions

- Hosted (or staging) matches prod you care about; token path as in prior Phase 7 work.
- DevTools or scripted calls to `GET /api/chat/threads` and `POST /api/chat/turn` (same shapes as Phase 7).
- Optional: `npm run phase7:evidence:probes` against the same base URL (Nova gate); Lumen still does manual strong/weak scenarios.

## Layer A — Guardrail integrity

Run every meaningful release or Continue-adjacent change.

### A1 — Weak-tail / zero surface

_Addendum §4, §6, diagnosis “non-expansion”_

After a shallow last user turn (e.g. thanks, logistics, coordination — your Phase 5/6 fail sets), `GET /api/chat/threads`:
- `threads` empty where suppression applies; `continue_suppressed_last_user_turn === true` when expected.
- `meta.phase_7`: `weak_case_suppressed_event`, `zero_surface_success_event`, `exposure_numerator_event` coherent with no decorative list.

**Pass criterion:** Zero-surfacing in weak cases remains a success, not a failure to “get data.”

### A2 — Exposure discipline

_Addendum §6, diagnosis §2 “signal validity”_

For the same sessions, confirm you are not inferring habit from “more Continue rows” if denominator / surfacing logic drifts upward without product intent.

**Validity filter:** Would this still look “good” if exposure had not increased? If no → contaminated / inconclusive (diagnosis §2).

### A3 — Ignore-path

_Addendum §7_

New thread / new direction without opening Continue: no nag, no heavier chrome, no “you should continue” gravity.

**Pass criterion:** Ignoring Continue stays frictionless; non-use is not punished.

### A4 — Suppression must not weaken

_Addendum §4_

Compare to known-good Phase 6 baselines: no broadening of weak-case surfacing, no extra marginal options “for metrics.”

## Layer B — Habit signal

Pattern-bound, not global; addendum §1–§3, diagnosis §5.

Only after Layer A is clean for the build under test.

### B1 — Pattern-bound reuse

_Not global CTR_

For one return-pattern family at a time (e.g. delayed-reply / replay / earned-rest — your existing language), run a small fixed script: establish substrate → Continue → short ack → judge first resumed turn.

Do not aggregate across unrelated patterns into one “reuse is up” headline.

### B2 — Strong-path / resumed-turn quality

_Addendum §5 — primary signal_

After Continue + low-verbal ack (`mm` / `yeah`):

**Product:** direction clearly resumes; user need not restate; reply not generic reset.

**JSON coherence (Phase 7):** `debug_phase_7` present; `return_pattern_id` / `short_ack_reentry` / `strong_path_event` align with `debug_continue_reentry_continuation_turn`, `debug_thread_state: same_thread` where applicable (see Phase 7 results doc).

**Pass criterion:** Repeat-use without strong resumed-turn quality = not valid habit evidence (addendum §5).

### B3 — Stability over windows

_Addendum §3_

Same pattern, multiple comparable sessions or days — watch for novelty-only spikes vs sustained behavior. Short spikes alone → no habit claim.

## Layer C — Drift watch

Diagnosis §7 + addendum pressure / object-drift themes.

Short qualitative checklist each cycle:
- Continue feels lighter or heavier psychologically (pressure from familiarity)?
- Any copy, layout, or frequency change that makes Continue feel like a named feature or record rather than a light trace?
- Language on resumed turns drifting toward management / tracking / recommendation (existing milestone boundaries still apply).

Log as **watchpoint / blocker / not applicable** with one example string each.

## Evidence ladder (how to write the verdict)

- **Instrumentation / guardrails** — fields + behaviors in A1–A4.
- **Pattern-bound strong-path samples** — B1–B2, small N, explicit pattern label.
- **Only then** — cautious language: “signal consistent with narrow repeat use under guardrails,” not “users formed a habit.”
- If `reuse ↑` and `exposure ↑` → no credit (addendum §6, diagnosis §4).

## Deliverables for `docs/QA_HANDOFF.md`

When you finish a pass, append one dated block:

- Environment + build/marker if known.
- Layer A summary (`PASS / WATCH / FAIL`) with 1–2 JSON snippets redacted as needed.
- Layer B only if A is PASS; pattern names + N.
- Layer C one paragraph.
- Verdict line: `guardrails PASS, habit signal: not claimed / inconclusive / narrow positive under constraints` (pick one).

## When to skip or shrink

- No Continue-related deploy: Layer A quick smoke (weak suppression + one strong path) only.
- Phase 7 already green and no code touch: 15–20 minute hosted smoke + handoff line `no regression observed`.
