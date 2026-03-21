# Milestone E4 — Nova task response (implementation coherence + founder demo)

**Spec:** `docs/HC_OS_V1_Milestone_E_E4_Proof_Spec_v1.json`  
**Owner:** Nova  
**Date:** E4 closure track (no feature expansion per spec)

This document satisfies `output_shape_for_nova.must_return` from the E4 proof spec.

---

## 1. Whole-layer implementation coherence summary

E1, E2, and E3 are implemented as **one continuity slice** on the chat turn path, not three separate products:

| Layer | What it is in code | Where |
|------|-------------------|--------|
| **E1** | Earned recurrence: same **pattern family** across recent eligible insights → optional `recurrence_cue` with mapped **pattern identity** | `app/api/chat/turn/route.ts` (insight save + recurrence block) |
| **E2** | **Bounded substrate** (recent window + age filter), **quiet decay** (stale newest-aligned), **persistence vs recurrence** phase + relevance gates, **anti-repeat** heuristic, **replace-not-accumulate** metadata | Same route; constants `E2_*`; `recurrence_cue.phase`; `wisewave_recurrence` on assistant metadata |
| **E3** | **Legibility-only** pass: light/clear templates + gates (`present_relevance`, `clarity_gain`, `added_weight_risk`) on **`recurrence_cue` only** — does not rewrite `continuity_insight` / Last insight | Same route; `E3_*` templates + `debug_recurrence_e3_*` |

**Coherence properties:**

- **Single emission surface** for user-visible pattern continuity in-chat: `recurrence_cue` on `/api/chat/turn` JSON (UI consumes it as secondary to the main assistant reflection).
- **Shared substrate**: same `recent` insight window and `detectContinuityPatternFamily` (`lib/wisewave-continuity-family.ts`) drives both eligibility for recurrence and family alignment.
- **Ordering**: E2 gates (including silence paths) run before E3; E3 only runs when the turn is already on the “would emit cue” path without upstream suppressions (e.g. anti-repeat).
- **No parallel “memory product”**: no new long-history UI, no analytics surface, no extra pattern taxonomy beyond the existing minimal map + families.

---

## 2. Founder demo support plan

Use **one hosted (or local) session** and walk the founder through this arc (aligns with `founder_demo_requirements` in the JSON spec):

1. **Emergence** — Two substantive user turns in the **same continuity family** → second aligned turn may show first `recurrence_cue` (E1 + E2 recurrence path).
2. **Persistence (when gates pass)** — Third aligned turn with **non-vague**, length above persistence floor → `recurrence_cue.phase === "persistence"` and E3 **clear** legibility when clarity gate passes (see E3 QA Pass 3 evidence).
3. **Clearer legibility (E3)** — Same arc; cue copy is E3 templates (light vs clear), not a second UI layer.
4. **Quiet decay** — Short same-pattern follow-up → cue suppressed (anti-repeat); or **stale-window** path after backdated / aged insights (E2 QA Pass 4 script) → `recurrence_cue: null` without drama.
5. **Reflection-first** — Main assistant message remains the **primary** read; cue stays **one sentence**, secondary placement (`app/chat/page.tsx`).
6. **Boundedness + trust** — Point to **debug fields** only for reviewers: `debug_recurrence_e2_*`, `debug_recurrence_e3_*`, `debug_recurrence_e3_suppressed_reason` (e.g. `low_present_relevance`) proves **silence with justification**, not hidden memory.

**Script sources:** reuse substrates from `docs/HC_OS_V1_Milestone_E2_Lumen_QA_Plan.md` and `docs/HC_OS_V1_Milestone_E3_Lumen_QA_Results.md` (including deterministic E3 Pass 2 suppression script).

---

## 3. Evidence that no hidden feature creep was introduced (E4 scope)

Against `not_allowed` in `HC_OS_V1_Milestone_E_E4_Proof_Spec_v1.json`:

- **No new memory features** — Still bounded to recent eligible insights + same-session messaging; no new long-term recall product.
- **No new UI surfaces for E4** — E3 explicitly avoided new continuity UI; chat still uses existing recurrence strip + reflection.
- **No more persistence depth** — E2 window/decay are **provisional constants** with documented intent; not an open-ended archive.
- **No new pattern classes in E4** — Same `ContinuityPatternFamily` + `PatternId` mapping as prior E milestones.
- **No history / analytics / awareness / embodiment / recommendations** — Not added in E4 track.

Nova’s E4 work is **documentation + coherence proof + demo scripting alignment**, not a new build, unless Lumen/OctopusMind finds a **boundedness or coherence defect** requiring a surgical fix.

---

## 4. Known risks or ambiguities

- **Extractor variance** — `core_pattern` wording can drift family classification; mitigated by shared `detectContinuityPatternFamily` and extractor hints, but not zero-risk.
- **Provisional E2 numbers** — 10d / 7d / char thresholds are tuning knobs; OctopusMind may later lock different values without changing the *structure* of the proof.
- **Generic pattern** — Maps to **low** confidence path; may suppress surfacing more often; intentional under-claiming.
- **Full demo needs DB** — Recurrence requires persisted eligible insights; local/hosted DB must be reachable (see session `503` handling elsewhere).
- **E3 debug typo in some logs** — Some older QA notes reference `debug_recurrence_e3_prof_threshold_passed`; API field is `debug_recurrence_e3_proof_threshold_passed` — use the latter for evidence.

---

## 5. Next action

| Owner | Action |
|-------|--------|
| **Lumen** | Run E4 acceptance per **`docs/HC_OS_V1_Milestone_E4_Lumen_QA_Plan.md`** against `required_checks` + `governance_checks` in the proof spec, using **Wisewave** quality bar and **OctopusMind** mandate docs. |
| **Tree** | Milestone close only when proof + governance + quality bar align — not on partial QA. |
| **Nova** | **Hold** on implementation unless a regression or proof failure is filed; then **smallest** fix only. |
| **Wisewave / OctopusMind** | Final wording + structural closure judgment per published E4 docs. |

---

## Related docs

- `docs/HC_OS_V1_Milestone_E_E4_Addendum_Minimal_Consciousness_Layer_Proof.md`
- `docs/HC_OS_V1_Milestone_E_E4_Wisewave_Final_Continuity_Layer_Quality_Bar.md`
- `docs/HC_OS_V1_Milestone_E_E4_OctopusMind_Closure_Mandate.md`
- `docs/HC_OS_V1_Milestone_E_Execution_Addendum.md`
