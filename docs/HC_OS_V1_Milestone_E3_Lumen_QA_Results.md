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

**Result:** Partial pass / revise

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

### What did not fully pass

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


