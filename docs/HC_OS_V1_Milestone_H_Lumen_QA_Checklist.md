# HC-OS V1 — Milestone H QA Checklist

**Owner:** Lumen  
**Milestone:** H — Minimal Everyday Integration / Micro Awareness  
**Product rule:** **Open space, do not steer.**  
**Acceptance line:** User feels **slightly more aware**, **not more managed**.

---

## A. Test metadata

- **Environment:** hosted / local
- **Build / commit:** 
- **Date:** 
- **Tester:** Lumen
- **`ENABLE_H_CUE`:** on / off
- **Auth state:** anonymous / signed-in
- **Language:** EN / ZH
- **Session id / link:** 

---

## B. Core judgment questions

For every test turn, answer:

### Structural gate
- [ ] H was admissible
- [ ] Signal was strong enough
- [ ] H did not duplicate E
- [ ] H did not widen product presence
- [ ] H was justified as a controlled exception

### Experiential gate
- [ ] H felt lighter than silence
- [ ] H did not feel guiding
- [ ] H did not feel therapeutic
- [ ] H did not feel analytic
- [ ] H did not compete with the main reflection

### Overall
- [ ] H improved the moment
- [ ] Or suppression/removal was clearly better

---

## C. Required debug capture per turn

- `debug_milestone_h_build_marker`
- `debug_milestone_h_enabled`
- `debug_milestone_h_outcome`
- `debug_milestone_h_suppressed_reason`
- `debug_milestone_h_kind`
- `recurrence_cue` present: yes / no
- `awareness_cue` present: yes / no

---

## D. Pass checklist

## Pass 0P — Build / deployment smoke

### Objective
Confirm Milestone H instrumentation is present before content judgment.

### Checklist
- [ ] `debug_milestone_h_build_marker === "milestone_h_v1"`
- [ ] `debug_milestone_h_light_mode_build_marker === "milestone_h_light_mode_v1"` (Wisewave Light Mode v2 — main reflection appendix)
- [ ] When `ENABLE_H_CUE` is on: `debug_milestone_h_light_mode_appendix_applied === true` (confirms **Light Mode** is applied to generation, not docs-only)
- [ ] `debug_milestone_h_enabled` returns expected boolean
- [ ] `debug_milestone_h_outcome` is present
- [ ] When suppressed, `debug_milestone_h_suppressed_reason` is present

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Blocked

### Notes
- 

---

## Pass 1 — Kill switch

### Objective
Verify `ENABLE_H_CUE` cleanly turns H on/off.

### H enabled
- [ ] `ENABLE_H_CUE=true` or `1`
- [ ] `debug_milestone_h_enabled === true`
- [ ] `debug_milestone_h_light_mode_appendix_applied === true` (main reflection **Light Mode** on; required for **Pass 5** whole-turn QA)
- [ ] H path active without breaking turn output

### H disabled
- [ ] `ENABLE_H_CUE` unset / false / `0`
- [ ] `debug_milestone_h_enabled === false`
- [ ] `awareness_cue` absent
- [ ] Main response remains coherent

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Fail

### Notes
- 

---

## Pass 2 — H / E conflict rule

### Objective
Verify H suppresses whenever E recurrence is present.

### Checklist
- [ ] Constructed turn where `recurrence_cue` emits
- [ ] `awareness_cue` absent on same turn
- [ ] Suppression reason indicates E overlap
- [ ] Constructed turn with strong reflection but no recurrence
- [ ] H and E never appear together

### Instant fail trigger
- [ ] `recurrence_cue` and `awareness_cue` both present

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Fail

### Notes
- 

---

## Pass 3 — Suppression matrix

### Objective
Prove H is rare and properly disciplined.

### Factual / utilitarian
- [ ] H suppressed on factual turns
- [ ] No awareness cue on utilitarian requests

### Weak / vague signal
- [ ] H suppressed on thin or vague reflective substrate
- [ ] Uncertainty favored suppression

### Already-clean reflection
- [ ] H usually suppressed when the reflection already lands cleanly
- [ ] Any emitted H here was clearly better than silence

### Consecutive turn rule
- [ ] If H emitted on turn 1, H suppressed on turn 2

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Fail

### Notes
- 

---

## Pass 4 — Experiential gate

### Objective
Verify H feels like gentle noticing, not guidance.

### Checklist
- [ ] No instructive tone
- [ ] No therapeutic tone
- [ ] No analytic / explanatory overreach
- [ ] H did not become the focus
- [ ] H did not add noticeable system weight
- [ ] Silence would not have been better in this case

### Tone red flags
- [ ] No “you should”
- [ ] No “you need to”
- [ ] No “try to”
- [ ] No disguised soft-command wording
- [ ] No Chinese phrasing that shifts into teacher/guide posture

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Fail

### Notes
- 

---

## Pass 5 — Cue kind usefulness

### Objective
Validate current implemented H kinds.

### H1 — micro awareness cue
- [ ] Opens space lightly
- [ ] Does not over-name the user
- [ ] Does not become the main point

### H3 — pause-opening
- [ ] Creates room
- [ ] Does not assign work

### H4 — over-effort softening
- [ ] Softens pressure lightly
- [ ] Does not sound corrective or coaching

### H5 — inner-split marking
- [ ] Marks tension lightly
- [ ] No cause analysis
- [ ] No psychologizing

### Deferred
- [ ] H2 pattern-to-moment bridge not currently in engine; documented as deferred

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Fail

### Notes
- 

---

## Pass 6 — Duplication and stacked presence

### Objective
Ensure H does not occupy the same felt space as reflection, continuity, or E.

### Checklist
- [ ] Main reflection remains center of gravity
- [ ] H does not repeat continuity / Last insight
- [ ] H does not repeat pattern / recurrence function
- [ ] Overall turn remains one-pass readable
- [ ] Strip stack does not feel like layered product machinery
- [ ] Removing only H does not make most outputs better

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Fail

### Notes
- 

---

## Pass 7 — EN / ZH parity

### Objective
Verify equivalent restraint and lightness across English and Chinese.

### English
- [ ] H feels light
- [ ] H is non-commanding
- [ ] H is non-authoritative

### Chinese
- [ ] H feels equally light
- [ ] H is not more teacher-like
- [ ] H is not more explanatory
- [ ] H is not more settled / moral / corrective

### Parity
- [ ] EN / ZH preserve equivalent stance
- [ ] Differences are functional, not authority drift

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Fail

### Notes
- 

---

## Pass 8 — Founder demo pack

### Objective
Show the narrowest successful version of H.

### Required demo beats
- [ ] Normal reflective exchange
- [ ] Correct suppression case
- [ ] One helpful H case
- [ ] One removal / silence-better case
- [ ] EN example
- [ ] ZH example

### Demo proves
- [ ] H is optional
- [ ] H is restrained
- [ ] H is not the product center
- [ ] H helps one real moment without changing product identity

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Fail

### Notes
- 

---

## Pass 9 — Regression sniff

### Objective
Confirm H did not damage earlier milestone behavior.

### Checklist
- [ ] E recurrence behavior still works
- [ ] F embodiment behavior still works
- [ ] G integration behavior still works if enabled
- [ ] UI hydration / refresh still reattaches strips correctly
- [ ] Turning H off does not break response integrity

### Verdict
- [ ] Pass
- [ ] Revise
- [ ] Fail

### Notes
- 

---

## E. Instant fail triggers

If any of these recur, Milestone H should be failed or rolled back:

- [ ] H feels instructive
- [ ] H feels therapeutic
- [ ] H feels analytic
- [ ] H duplicates E
- [ ] H duplicates the main reflection
- [ ] H becomes noticeable as a recurring product thing
- [ ] H appears too often
- [ ] Removing H usually improves the response
- [ ] Chinese tone is materially heavier than English
- [ ] Strip stack makes the product feel heavier

---

## F. Per-turn evidence block

```yaml
pass_id:
environment:
enable_h_cue:
language:
user_message_summary:
recurrence_cue_present:
awareness_cue_present:
debug_milestone_h_build_marker:
debug_milestone_h_enabled:
debug_milestone_h_outcome:
debug_milestone_h_suppressed_reason:
debug_milestone_h_kind:
structural_admissible:
experiential_lighter_than_silence:
silence_would_be_better:
feels_guidance:
feels_therapeutic:
feels_analytic:
duplicates_e_or_reflection:
parity_en_zh:
verdict:
notes:
```

---

## G. Final milestone verdict

### Pass only if all are true
- [ ] At least one real-use case shows H helping lightly
- [ ] Most other eligible cases still suppress correctly
- [ ] H does not feel instructive
- [ ] H does not feel therapeutic
- [ ] H does not duplicate E
- [ ] H remains removable without harming response integrity
- [ ] EN / ZH preserve equivalent restraint
- [ ] Product still feels reflection-first
- [ ] Product does not feel more managed

### Final verdict
- [ ] PASS
- [ ] REVISE
- [ ] REMOVE / ROLLBACK

### Recommended owner
- [ ] Nova
- [ ] Wisewave
- [ ] OctopusMind
- [ ] Tree

### Final notes
- 

---

## H. One-line closure rule

> **Milestone H passes only if one micro-awareness cue can help in a real moment while remaining rarer, lighter, and more removable than the instinct to keep it.**
