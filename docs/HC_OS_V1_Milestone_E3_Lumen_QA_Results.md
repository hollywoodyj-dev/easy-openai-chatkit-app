# Lumen QA results — Milestone E3

Scope: E3 continuity legibility rendering (recurrence_cue only) + admissibility gates + anti-heaviness constraints.

Reference docs:
- `docs/E3 Governance Control Note.md`
- `docs/HC_OS_V1_Milestone_E_E3_Addendum_User_Facing_Continuity_Legibility.md`
- `docs/HC_OS_V1_Milestone_E_E3_Wisewave_Continuity_Legibility_Quality_Bar.md`
- `docs/Lumen-friendly QA Checklist — E3 Legibil.md`

---

## Pass 1 — Gate integrity + E3 boundary to `continuity_insight` (hosted)

**Result:** Pass (API/gate layer) with UI-strip follow-up note

**Hosted session:** `cmmz3heyz000jv0460qkix72`

### Gate-fail scenarios tested

1. **Proof not passed yet (strong turn)**
   - **Input (user):** After I finish something important, rest still feels undeserved unless I keep doing more to prove I have earned it.
   - **Observed:**
     - `recurrence_cue: null`
     - `debug_recurrence_aligned_instance_count: 1`
     - All `debug_recurrence_e3_*` fields were **null**
   - **Boundary check (must be unaffected):**
     - `continuity_insight` behaved normally:
       - `continuity_key: "rest_must_be_earned"`
       - `is_continuity_eligible: true`

2. **Vague source turn**
   - **Input (user):** Not sure.
   - **Observed:**
     - `recurrence_cue: null`
     - `debug_is_vague_source: true`
     - E3 debug fields were **null**
   - **Boundary check (must be unaffected):**
     - `continuity_insight` behaved on its normal path:
       - `continuity_key: "fallback_generic"`
       - `is_continuity_eligible: false`

### Meaning

E3 did not surface cue when:
- proof/gates didn’t justify it
- the source was vague

And E3 did not leak into the `continuity_insight` / “Last insight” logic at the API level.

### One note / open item

- I have **not** yet visually confirmed in the browser that the **rendered** “Last insight” strip UI is unchanged.
- API evidence shows E3 is not leaking into Last insight logic.

### Lumen / Tree conclusion

**Pass 1 = Pass**

---

## Pass 2 — Legibility gain + suppression debug legibility (hosted)

**Result:** Pass

**Hosted session:** `cmmz3jw9f000jo04qol6ds3t`

### What passed

1. **Clear legibility gain render**
   - recurrence_cue.text_en: “The pressure to prove your worth may still be present here.”
   - E3 debug (render branch):
     - `debug_recurrence_e3_legibility_state: "light"`
     - `debug_recurrence_e3_present_relevance: 0.85`
     - `debug_recurrence_e3_clarity_gain: 0.65`
     - `debug_recurrence_e3_added_weight_risk: 0.15`
     - `debug_recurrence_e3_proof_threshold_passed: true`

### What did not fully pass initially (cleared by deterministic retest below)

2. **Null-cue suppression reason not debug-legible**
   - Follow-up message: `still feels like I need to earn rest`
   - Observed:
     - `recurrence_cue: null`
     - aligned count reached 3
     - all E3 debug fields were **null**, including:
       - `debug_recurrence_e3_suppressed_reason`

### Open clarification needed (Nova)

For null cues, we need to clarify whether:
- `debug_recurrence_e3_suppressed_reason` is emitted only when E3 gating actually runs (i.e., not when cue is suppressed by upstream anti-repeat / other E2 branches), or
- E3 should emit a suppressed reason for additional upstream suppressions too.

### Update (Nova): clarification resolved

Deterministic hosted Turn 6 evidence confirms that when E3 evaluation runs and suppresses the cue for `low_present_relevance`, `debug_recurrence_e3_suppressed_reason` is emitted as `"low_present_relevance"` (with `debug_recurrence_e3_proof_threshold_passed: true`), so this is E3-owned suppression/debug-legible.

### Additional hosted retest (still not clearable)

Hosted session: `cmmz4a7qc000l204p6s4bj29`

Goal: force low present relevance while preserving recurrence eligibility via a 6-turn A/B/C/D/A sequence.

Intended: A → A → B → C → D → A

Observed continuity drift:
- Turn 4: `continuity_key: "fallback_generic"`
  - `debug_insight_core_pattern`: "When uncertainty appears, the user tends to avoid starting because mistakes feel like they will create more pressure."
- Turn 5: unexpectedly returned to `continuity_key: "rest_must_be_earned"`
  - visible cue already rendered

Final Turn 6 outcome (still did not hit E3-owned suppression):
- `recurrence_cue` still rendered
- `debug_recurrence_e3_prof_threshold_passed: true`
- `debug_recurrence_e3_present_relevance: 0.85`
- `debug_recurrence_e3_suppressed_reason: null`

Conclusion: Pass 2 is **Pass** after the deterministic hosted retest hit the E3-owned `low_present_relevance` suppression branch.

### Additional hosted retest (mid-bucket present relevance still renders)

Hosted session: `cmmz4f4ba000jl04fufcwk2i`

What stayed stable (non-A families):
- Turn 3 → `constant_pressure_keep_up`
- Turn 4 → `replay_for_mistakes`
- Turn 5 → `delayed_reply_means_i_did_something_wrong`

Turn 6 outcome (wanted: E3-owned `low_present_relevance` suppression):
- `recurrence_cue`: **present**
- `continuity_key`: `"rest_must_be_earned"`
- `debug_recurrence_aligned_instance_count`: **3**
- `debug_recurrence_e3_prof_threshold_passed`: **true**
- `debug_recurrence_e3_present_relevance`: **0.6**
- `debug_recurrence_e3_suppressed_reason`: **null**

Interpretation:
- the run reached the E3 evaluation but did not land in the low present-relevance bucket expected to trigger `debug_recurrence_e3_suppressed_reason: "low_present_relevance"`.

### Deterministic clearing: E3-owned `low_present_relevance` suppression (now Pass)

Hosted session: `cmmz586a400l504y94p4i15`

Turn 6 outcome:
- `recurrence_cue`: **null**
- `continuity_key`: `"rest_must_be_earned"`
- `debug_recurrence_aligned_instance_count`: **3**
- `debug_recurrence_e3_prof_threshold_passed`: **true**
- `debug_recurrence_e3_present_relevance`: **0.3**
- `debug_recurrence_e3_suppressed_reason`: **"low_present_relevance"**
- `debug_recurrence_e3_legibility_state`: **null**

### Additional hosted retest (still not clearable)

Hosted session: `cmmz415l300ol504p4kejdcf`

Attempt goal: find an **E3-owned suppression** case (cue null, but E3 gating runs and should explain via `debug_recurrence_e3_suppressed_reason`).

Observed:
- Turn 2: recurrence render (E3 render debug present)
- Turn 3: message  
  `I can already see the same thread pretty clearly here, so saying more about it might not add much right now.`
  - `recurrence_cue: null`
  - all `debug_recurrence_e3_*` fields still **null**
  - `debug_recurrence_aligned_instance_count: 1`

Interpretation:
- this turn appears to have **fallen out of the aligned recurrence path** (so E3 gating likely did not run), rather than proving an E3 suppression branch.

---

## Pass 3 — Legibility gain without added heaviness (hosted)

**Result:** Pass

**Hosted session:** `cmmz3m1dj000l404b9ggi0yl`

### Evidence

**Turn 2 — recurrence render**
- `recurrence_cue.text_en`: “This still feels close to that familiar self-worth pressure.”
- `debug_recurrence_e3_legibility_state`: `light`
- `debug_recurrence_e3_present_relevance`: `0.85`
- `debug_recurrence_e3_clarity_gain`: `0.65`
- `debug_recurrence_e3_added_weight_risk`: `0.15`
- `debug_recurrence_e3_proof_threshold_passed`: `true`

**Turn 3 — persistence render**
- `recurrence_cue.text_en`: “A familiar self-worth pressure still seems to be active here.”
- `debug_recurrence_e3_legibility_state`: `clear`
- `debug_recurrence_e3_present_relevance`: `0.85`
- `debug_recurrence_e3_clarity_gain`: `0.85`
- `debug_recurrence_e3_added_weight_risk`: `0.25`
- `debug_recurrence_e3_proof_threshold_passed`: `true`

### Why this passes

The cue:
- is clearer than E2
- remains short and one-pass readable
- stays lighter than the main reflection
- does not drift into explanation-heavy or authority-heavy language

### Lumen / Tree conclusion

**Pass 3 = Pass**

---

## Pass 4 — Reflection-first + cue stays secondary (hosted)

**Result:** Pass

**Hosted session:** `cmmz3rdny000jj04m1lwbara`

### What I checked
- Compared the **assistant reflection** vs the **E3 recurrence cue** for competition.

### Result
- Reflection remains clearly primary.
- Cue stays secondary (shorter, less interpretive, supports reflection rather than becoming a second analysis).

### Debug sanity
- recurrence: `legibility_state="light"`, `clarity_gain=0.65`, `added_weight_risk=0.15`
- persistence: `legibility_state="clear"`, `clarity_gain=0.85`, `added_weight_risk=0.25`

### Lumen / Tree conclusion
**Pass 4 = Pass**

---

## Pass 5 — Anti-repetition (hosted)

**Result:** Pass

**Hosted session:** `cmmz3tr8x0008l104hvcsx6wo`

### What I checked
- E3 should not “solve legibility” by showing the cue mechanically more often.
- Silence should win when continuity adds little new value.

### Evidence (summary)
- Turn 2: recurrence cue shown (E3 render, legibility state present)
- Turn 3: short same-pattern follow-up → `recurrence_cue: null`, E3 debug null; upstream anti-repeat/silence behavior wins
- Turn 4: stronger substantive follow-up → cue returns (persistence)
- Turn 5: weak repetitive follow-up → `recurrence_cue: null` (no mechanical repeat)

### Lumen / Tree conclusion
**Pass 5 = Pass**

---

## Pass 6 — EN / ZH parity (hosted)

**Result:** Pass

**Hosted session:** `cmmz3vazu000l704z8fpmx0g`

### Evidence (Chinese arc)
- Turn 1: `recurrence_cue: null`, aligned count 1
- Turn 2: recurrence cue with E3 debug present (`legibility_state="light"`, `present_relevance=0.85`, `clarity_gain=0.65`, `added_weight_risk=0.15`)
- Turn 3: short same-family follow-up → `recurrence_cue: null`, E3 debug null, consistent with upstream suppression
- Turn 4: longer substantive recovery → persistence cue with E3 debug present (`legibility_state="clear"`, etc.)

### Note on `text_zh`
Shell output may show mojibake; tone/phase/debug behavior matched the intended parity arc.

### Lumen / Tree conclusion
**Pass 6 = Pass**

---

## Pass 7 — Founder-readability acceptance (hosted)

**Result:** Pass

### Founder-readability verdict
- E3 is easier to understand than E2.
- Cue stays secondary and support-like.
- Silence feels like restraint, not failure.
- Demo remains continuity-layer, not memory/tracking/authority layer.
- EN/ZH follow the same functional arc (baseline parity).

### Lumen / Tree conclusion
**Pass 7 = Pass**


