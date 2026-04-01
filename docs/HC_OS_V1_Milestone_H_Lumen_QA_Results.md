# HC-OS V1 — Milestone H Lumen QA Results

**Owner:** Lumen  
**Milestone:** H — Minimal Everyday Integration / Micro Awareness  
**Date:** 2026-03-22  
**Environment:** Hosted (`https://wisewave-chatkit-app-v2.vercel.app`)  
**Scope:** Passes 1–9 completed against hosted build with Milestone H enabled, Light Mode deployed, and later EN/ZH parity fix deployed.

**Nova / repo:** This file is the **authoritative Lumen closure record** for Milestone H QA; **`AGENTS.md`** points here for product status.

**2026-03-23:** **Lumen QA round closure** — core passes and stabilization re-QA verified on hosted/browser; see § *Lumen QA round closure*; ongoing **drift monitoring** (not open milestone-test debt for verified items).

---

## Executive summary

Milestone H now appears **passable as a narrowly contained micro-awareness layer**, with the main product rule preserved:

> **Open space, do not steer.**

The strongest outcome is that H now behaves like a **controlled exception** rather than an ambient feature:

- H is optional
- H suppresses correctly in factual / recurrence / consecutive-turn contexts
- H yields to Milestone E recurrence
- H does not break Milestone F embodiment or broader integrated response behavior
- whole-turn lightness improved materially after Wisewave **Reflection Style v2 / Light Mode**
- EN/ZH parity bug in H admissibility was found and fixed during QA

This is **not** a no-caveats all-green milestone. It is a **green-with-watchpoints** milestone.

---

## Final pass board

| Pass | Status | Notes |
|------|--------|-------|
| **Pass 1 — Kill switch** | **PASS** | Hosted verified with `ENABLE_H_CUE=true` and `ENABLE_H_CUE=false` after redeploy. |
| **Pass 2 — H/E conflict** | **PASS** | When `recurrence_cue` emits, H suppresses with `recurrence_overlap_e`. |
| **Pass 3 — Suppression matrix** | **PASS (watchpoint)** | Factual and consecutive-turn suppression worked. Vague case suppressed safely, but debug taxonomy was slightly blunt. |
| **Pass 4 — Experiential gate (original scope)** | **REVISE** | Initial failure was caused mainly by whole-turn heaviness in the main reflection layer, not by the H line alone. |
| **Pass 4 — Re-check (revised cue-only scope)** | **PASS (watchpoint)** | Under revised scope, the H line itself is acceptably light / non-instructive. Kind differentiation remains blunt. |
| **Pass 5 — Whole-turn validation under Light Mode** | **PASS (watchpoints)** | Main reflection became materially lighter; H can now be judged honestly at whole-turn level. |
| **Pass 6 — Duplication / stacked presence** | **PASS (watchpoint)** | H does not duplicate E when recurrence fires; continuity + H is acceptable. E + F stack is near upper visible-weight limit. |
| **Pass 7 — EN/ZH parity** | **PASS after fix (watchpoint)** | Original parity failure found and fixed. Chinese reflective inputs now enter real H gating instead of misfiring as utilitarian/factual. |
| **Pass 8 — Founder demo shape** | **PASS** | Narrow founder-demo path now exists across helpful H, correct suppression, EN, ZH, and silence-better style behavior. |
| **Pass 9 — Regression sniff** | **PASS** | E recurrence, F embodiment, metadata persistence/rehydrate substrate all still behave coherently. |

---

## Key findings by pass

## Pass 1 — Kill switch

### Result
**PASS**

### Verified
- `ENABLE_H_CUE=true` → `debug_milestone_h_enabled: true`
- `ENABLE_H_CUE=false` → `debug_milestone_h_enabled: false`
- disabled path returns `debug_milestone_h_suppressed_reason: milestone_h_disabled`
- `awareness_cue` absent when disabled
- main response remains coherent when H is off

### Conclusion
Milestone H global kill switch behaves correctly on hosted after proper redeploy.

---

## Pass 2 — H / E conflict

### Result
**PASS**

### Verified
On a repeated-pattern turn where Milestone E recurrence emitted:
- `recurrence_cue` present
- `debug_recurrence_cue_emitted: true`
- `awareness_cue` absent
- `debug_milestone_h_suppressed_reason: recurrence_overlap_e`

### Conclusion
Structural H/E conflict rule is working correctly.

---

## Pass 3 — Suppression matrix

### Result
**PASS with watchpoint**

### Verified
- factual / utilitarian case suppressed correctly
- consecutive-turn suppression worked correctly
- non-recurrence reflective case could emit H

### Watchpoint
A vague / weak case suppressed safely, but the debug reason was sometimes less semantically specific than ideal. The suppression behavior was safe; the taxonomy was slightly blunt.

---

## Pass 4 — Experiential gate (initial run)

### Result
**REVISE**

### Reason
The H cue text itself was mostly acceptable, but the **main reflection layer** was still too interpretive / resolved / subtly guiding. That contaminated cue-level experiential judgment.

### Main issue found
- too much whole-turn authorial presence
- too much interpretive certainty
- too much subtle guidance in the reflection body

### Outcome
This led directly to the Light Mode corrective split:
- **Pass 4** → cue line only
- **Pass 5** → whole-turn validation under Wisewave Light Mode

---

## Pass 4 — Re-check under revised scope

### Result
**PASS with watchpoint**

### Revised scope
Judge the **H line only**, not whole-turn heaviness.

### Conclusion
Under the revised scope, emitted H lines were light enough:
- non-instructive
- non-therapeutic
- non-analytic
- not heavier than the reflection body

### Watchpoint
Kind differentiation remains blunt; H1 is over-represented and did not give a strong clean read of H3 / H4 / H5 distinction.

---

## Pass 5 — Whole-turn validation under Light Mode

### Result
**PASS with watchpoints**

### Verified
Hosted build showed:
- `debug_milestone_h_light_mode_appendix_applied: true`
- `debug_milestone_h_light_mode_build_marker: milestone_h_light_mode_v1`

Whole-turn behavior improved materially:
- main reflection less resolved
- less guidance pressure
- less authorial heaviness
- H can be mentally removed without dramatically improving the turn
- H can slightly help without becoming the point

### Watchpoints
- some residual heaviness remains in some lines
- selector still appears somewhat biased / blunt in some uncertainty and split cases

---

## Pass 6 — Duplication and stacked presence

### Result
**PASS with watchpoint**

### Verified
- continuity + H can coexist without obvious direct duplication
- consecutive-turn suppression reduces atmospheric buildup
- when recurrence fires, H suppresses correctly

### Watchpoint
E recurrence + F embodiment already creates a visibly layered turn. H suppression on those turns is doing important containment work and should not be loosened casually.

---

## Pass 7 — EN / ZH parity

### Initial result
**REVISE**

### Root issue found
Chinese reflective inputs were being incorrectly suppressed as `utilitarian_or_factual` because JavaScript `\b` does not behave safely for CJK word-boundary detection.

### Nova fix deployed
Commit reported by Nova:
- `0221d53`
- `fix(milestone-h): ZH reflective gating — CJK-safe first-person anchor (Pass 7 parity)`

### Re-check result
**PASS with watchpoint**

### Verified after fix
- Chinese reflective inputs no longer misfire as `utilitarian_or_factual`
- Chinese inputs now enter real H admissibility flow
- suppression, when it happens, is now for real milestone reasons rather than language-heuristic failure

### Watchpoint
`vague_source` may still be somewhat blunt on some uncertainty-shaped inputs, but the EN/ZH parity blocker is resolved.

---

## Pass 8 — Founder demo shape

### Result
**PASS**

### Demo beats covered
- one helpful H case in English
- one correct suppression case
- one helpful H case in Chinese
- one silence-better / suppression case where no H appears

### Conclusion
Milestone H now has a narrow, believable founder-demo path.

---

## Pass 9 — Regression sniff

### Result
**PASS**

### Verified
- E recurrence still emits under repeated-pattern substrate
- F embodiment still emits when recurrence conditions hold
- H suppresses correctly on recurrence turns
- saved message metadata includes H / E / F state in expected persistence substrate

### Watchpoint
Some surrounding continuity / phrasing polish issues remain in adjacent layers, but no clear H-caused regression was observed.

---

## Hosted post-H Day 7 rerun — `milestone_h_v20`

### Result
**PASS**

### Verified (12 reviewed)
- H appeared: **0**
- H suppressed: **12**
- suppression ratio: **100%**

### What changed
All four prior ZH H1 survivors are now suppressed:
- `h-d07-003`
- `h-d07-004`
- `h-d07-006`
- `h-d07-009`

Suppression reason on those rows:
- `h1_zh_avoidance_return_insight_sufficient`

### Read
For **Post-H Day 7 specifically**, `milestone_h_v20` is now a clean pass on the H layer.

---

## Hosted post-H Day 8 rerun — `milestone_h_v20`

### Result
**PROVISIONAL REVISE / WATCH**

### Verified (12 reviewed)
- H appeared: **3**
- H suppressed: **9**
- suppression ratio: **75%**

### Survivors (all H1)
- `h-d08-004`
- `h-d08-006`
- `h-d08-009`

### Read
- Day 7 target lane is fixed on `milestone_h_v20`.
- Day 8 reveals a **new bounded ZH H1 pocket**.

Likely shape:
- urgency / false urgency / anticipatory urgency lane where the main reflection seems sufficient but H1 still enters as a second layer.

### Recommended next step
- use **Day 9** as the next regression/comparison check after identifying this bounded Day 8 pocket.

---

## Hosted post-H Day 7 rerun follow-up — `milestone_h_v20` (logging update)

### Result
**PROVISIONAL WATCH** (bounded reopen, no new corridor class indicated)

### Verified (12 reviewed)
- H appeared: **2**
- H suppressed: **10**
- suppression ratio: **83.3%**

### Survivors (both ZH H1)
- `h-d07-004`
- `h-d07-009`

### Read
- This is a bounded reopen of the same broad ZH H1 duplication / main-reflection-already-sufficient class.
- This does **not** currently read like a new corridor class.
- Under Phase 2 (Detection Only / No Expansion), this is a board/logging signal update, not an automatic optimization trigger.

---

## Hosted post-H Day 8 rerun follow-up — `milestone_h_v20` (logging update)

### Result
**PROVISIONAL WATCH** (bounded pocket confirmed; no broad reopen signal)

### Run note
- Initial pass had transport noise (`POST /api/chat/session` 503 on 7 cases).
- Lumen reran failed cases and merged results before final judgment.
- Final judgment set: **12 reviewed / 12 HTTP 200**.

### Verified (clean set)
- H appeared: **3**
- H suppressed: **9**
- suppression ratio: **75%**

### Survivors
- `h-d08-004` (H1)
- `h-d08-006` (H4)
- `h-d08-009` (H1)

### Read
- Confirms the existing bounded ZH urgency / false-urgency / anticipatory-urgency pocket on Day 8.
- This does **not** currently read as a new corridor class or broad reopen.
- Under Phase 2 (Detection Only / No Expansion), this is logged as board/handoff observation evidence, not an automatic patch request.

---

## Hosted post-H Day 9 rerun follow-up — `milestone_h_v20` (logging update)

### Result
**PROVISIONAL WATCH** (bounded residual pocket confirmation; no broad reopen signal)

### Run note
- Initial pass had transport noise on `h-d09-001` (`POST /api/chat/session` 503).
- Lumen reran the failed case before judgment; rerun returned HTTP 200 with H suppressed.
- Final judgment set: **12 reviewed / 12 HTTP 200**.

### Verified (clean set)
- H appeared: **3**
- H suppressed: **9**
- suppression ratio: **75%**

### Survivors
- `h-d09-004` (H1)
- `h-d09-009` (H1)
- `h-d09-012` (H1)

### Read
- Bounded Day 9 ZH-side residual pocket confirmed.
- This does **not** currently read as a new corridor class or broad reopen.
- Factual/utilitarian suppression remains intact in this pass.
- Under Phase 2 (Detection Only / No Expansion), this is logged as board/handoff observation evidence, not an automatic patch request.

---

## Hosted post-H Day 10 rerun follow-up — `milestone_h_v20` (logging update)

### Result
**PROVISIONAL WATCH / REVISE**

### Run note
- Clean first pass: **12 reviewed / 12 HTTP 200**.

### Verified (clean set)
- H appeared: **4**
- H suppressed: **8**
- suppression ratio: **66.7%**

### Survivors
- `h-d10-004` (H1)
- `h-d10-006` (H4)
- `h-d10-009` (H5)
- `h-d10-012` (H1)

### Read
- Day 10 is not clean and shows broader residual spread than Day 8/9 (survivors are not confined to one subtype).
- This is still observation evidence under Phase 2 detection-only governance.
- This is **not** logged as an automatic patch request.

---

## Hosted post-H Day 11 rerun follow-up — `milestone_h_v20` (logging update)

### Result
**PROVISIONAL WATCH** (not clean, but narrower residual shape than Day 10)

### Run note
- Clean first pass: **12 reviewed / 12 HTTP 200**.

### Verified (clean set)
- H appeared: **3**
- H suppressed: **9**
- suppression ratio: **75%**

### Survivors
- `h-d11-003` (H1)
- `h-d11-004` (H1)
- `h-d11-006` (H1)

### Read
- Day 11 is not clean, but residual shape is narrower than Day 10.
- Survivors are confined to a bounded H1 pocket (not a broader multi-subtype spread).
- Under Phase 2 (Detection Only / No Expansion), this is logged as board/handoff observation evidence, not an automatic patch request.

---

## Hosted post-H Day 12 rerun follow-up — `milestone_h_v20` (logging update)

### Result
**PROVISIONAL WATCH / REVISE**

### Run note
- Clean first pass: **12 reviewed / 12 HTTP 200**.

### Verified (clean set)
- H appeared: **4**
- H suppressed: **8**
- suppression ratio: **66.7%**

### Survivors
- `h-d12-003` (H4)
- `h-d12-004` (H4)
- `h-d12-006` (H4)
- `h-d12-009` (H1)

### Read
- Day 12 is not clean and shows a bounded H4-dominant residual pocket with one H1 alongside it.
- This is narrower than a broad multi-subtype reopen, but distinct enough to log as a subtype-heavy lane.
- Under Phase 2 (Detection Only / No Expansion), this is logged as board/handoff observation evidence, not an automatic patch request.

---

## Hosted post-H Day 13 rerun follow-up — `milestone_h_v20` (logging update)

### Result
**PROVISIONAL WATCH** (not clean, bounded H1 residual pocket)

### Run note
- Clean first pass: **12 reviewed / 12 HTTP 200**.

### Verified (clean set)
- H appeared: **3**
- H suppressed: **9**
- suppression ratio: **75%**

### Survivors
- `h-d13-003` (H1)
- `h-d13-004` (H1)
- `h-d13-006` (H1)

### Read
- Day 13 is not clean but remains a bounded H1 residual pocket.
- This shape is similar to Day 11 and narrower than Day 10 broad subtype spread or Day 12 H4-dominant pocket.
- Under Phase 2 (Detection Only / No Expansion), this is logged as board/handoff observation evidence, not an automatic patch request.

---

## Hosted post-H Day 14 rerun follow-up — `milestone_h_v20` (logging update)

### Result
**PROVISIONAL WATCH** (not clean, bounded H1 residual pocket)

### Run note
- Clean first pass: **12 reviewed / 12 HTTP 200**.

### Verified (clean set)
- H appeared: **3**
- H suppressed: **9**
- suppression ratio: **75%**

### Survivors
- `h-d14-003` (H1)
- `h-d14-004` (H1)
- `h-d14-006` (H1)

### Read
- Day 14 is not clean but remains a bounded H1 residual pocket.
- Shape closely matches Day 11 and Day 13, rather than Day 10 broad subtype spread or Day 12 H4-dominant pocket.
- Under Phase 2 (Detection Only / No Expansion), this is logged as board/handoff observation evidence, not an automatic patch request.

## Milestone-level judgment

## Overall verdict
**Milestone H: PASSABLE / PROVISIONALLY ACCEPTABLE WITH WATCHPOINTS**

### Why it is passable
The milestone now demonstrates the core intended behavior:
- one small awareness cue can help in a real reflective moment
- H remains optional and suppressible
- H does not dominate the product
- H yields to E
- whole-turn lightness is materially improved under Light Mode
- EN/ZH parity blocker was detected and repaired

### Why it is not “perfectly clean” yet
- Pass 4 originally required real revision
- some gating/debug categories remain blunt (`vague_source`)
- H-kind differentiation is not yet very strong
- stacked weight near E + F remains close to the upper acceptable limit
- some adjacent wording / continuity grammar issues remain outside H proper

---

## Required caution going forward

Milestone H should only be treated as healthy **while all of the following remain true**:

- H stays default-light and suppress-first
- H continues to suppress when E recurrence is present
- Light Mode remains active and does not drift back into helpful-over-true authorial writing
- EN/ZH admissibility parity remains protected
- the team does not widen H into a more ambient or expected layer

---

## One-line conclusion

> **Milestone H now works as a narrowly contained micro-awareness layer, provided the current suppression discipline and Light Mode restraint are preserved.**

---

## Stabilization addendum — 2026-03-23 live QA scenario pack

A 30-scenario live QA stabilization pack was run against hosted turns using:
- Drift Detection Checklist
- Removal Test
- PASS / REVISE / REMOVE verdicting

### Addendum conclusion

> **Milestone H is viable, but current stabilization logic is still too permissive for H1/H3, while H4 is the strongest surviving lane and H5 is valid when the split is explicit.**

### Main addendum findings
- **H3 is the clearest stabilization problem**: it leaked into low-signal, utilitarian, and help-request turns where suppression should have won.
- **H1 is still too permissive** on mild unease / mild tension / low-intensity reflective inputs where removal often made the response same or better.
- **H4 is the healthiest lane** for pressure / proving / worth-threat structure.
- **H5 remains valid** when the inner split is explicit and concrete.
- The scenario pack supports a stricter stabilization posture: **narrow H, do not broaden H**.

### Recommended stabilization direction
- tighten **H3** eligibility significantly
- tighten **H1** eligibility moderately
- preserve **H4** as the narrow core lane
- preserve **H5** as an explicit-split lane only

### Related stabilization docs
- `docs/HC_OS_V1_Milestone_H_Lumen_Live_QA_Scenario_Pack_Summary.md`
- `docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`
- `docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`

### Re-QA closure note — Batch 2 containment fix confirmed
Nova shipped a containment fix for the Batch 2 leakage pattern (task/help/utilitarian detection, minimal-affect low-signal detection, and narrower H3 routing). Lumen re-checked scenarios **12, 13, 16, and 19** on hosted.

**Confirmed results:**
- Scenario 12 (`I don’t feel anything in particular.`) → `minimal_affect_low_signal`, no H
- Scenario 13 (`I guess it’s okay.`) → `minimal_affect_low_signal`, no H
- Scenario 16 (`Can you summarize this article for me?`) → `utilitarian_or_factual`, no H
- Scenario 19 (`I need help writing an email.`) → `utilitarian_or_factual`, no H

**Conclusion:** the targeted Batch 2 stabilization issue is now **closed on re-QA**.

### Re-QA closure note — H1 mild-substrate suppression (v2) confirmed
Nova later shipped `milestone_h_v2` to address the remaining H1 mild-substrate permissiveness issue. Lumen verified hosted was serving `debug_milestone_h_build_marker: "milestone_h_v2"` and re-ran scenarios **1, 21, 23, 27, and 28**.

**Confirmed results:**
- Scenario 1 (`I feel overwhelmed with everything I need to do lately.`) → `h1_mild_reflective_insufficient`, no H
- Scenario 21 (`I feel slightly uneasy but can’t explain why.`) → `h1_mild_reflective_insufficient`, no H
- Scenario 23 (`I’m a bit tense today.`) → `h1_mild_reflective_insufficient`, no H
- Scenario 27 (`I’m worried I might fail.`) → `h1_mild_reflective_insufficient`, no H
- Scenario 28 (`I don’t trust myself sometimes.`) → `h1_mild_reflective_insufficient`, no H

**Conclusion:** the remaining H1 mild-substrate stabilization issue is now **closed on re-QA in milestone_h_v2**.

### Browser re-check closure note — H-UI-2 verified
Nova later shipped **H-UI-2** so that `What was noticed` is hidden by default when **Awareness** is visible, while preserving QA overrides.

Lumen verified browser behavior on live `/chat`:
- default `/chat` → **Awareness + main reply** (`What was noticed` hidden)
- `/chat?noticed=1` → **Awareness + What was noticed + main reply**
- `/chat?noticed=0` → **Awareness + main reply**

**Conclusion:** H-UI-2 is **working as intended** and the earlier browser-side stack-weight issue is materially reduced under the default H turn UI.

---

## Lumen QA round closure — 2026-03-23

**Milestone H QA is complete for this round** in the following sense:

| Area | Status |
|------|--------|
| **Core passes (1–9)** | **Closed** — pass board and findings recorded above; hosted baseline 2026-03-22 + parity fix. |
| **Stabilization re-QA** | **Verified on hosted / browser** — Batch 2 containment, **`milestone_h_v2`** H1 mild substrate, **H-UI-2** stack composition (see closure notes in this addendum). |
| **Results documentation** | **Updated** in this file for steward / Tree / Nova handoff. |

**Posture going forward:** **ongoing drift monitoring** (Lumen Drift Detection Checklist, Tree stabilization execution loop, removal-first spot checks) — **not** open-ended unresolved **milestone test debt** for the items verified above.

**Wisewave — observation mode (passive, 1–3 days min):** **`docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`** — per-entry log + daily summary; Tree decision / Lumen logging; *“Is H stable enough to be forgotten?”*; pin rule *if H is noticeable, it is not ready.*

**Not the same as hard milestone closure:** Formal **H → CLOSED** and **Milestone I preparation** still belong to **Tree’s exit gate** in **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`**. This section means **targeted Lumen QA work for the shipped stabilization fixes is done**; Tree may still run calendar / founder gates before signing hard close.

### Addendum — Nova `milestone_h_v3` 7-case rerun (hosted)

**Lumen (post-deploy):** Same 7-case batch on hosted; marker **`milestone_h_v3`** confirmed; Light Mode on; **encoding/apostrophe garbling cleared** on turn output; **`vague_source`** suppression still correct.

**Scores:** v2 **4 PASS / 3 REVISE / 0 FAIL** → v3 **5 PASS / 2 REVISE / 0 FAIL**.

**Verdict:** v3 counted as a **successful follow-up iteration**; H3 less repetitive (guilt/rest, everyday affect); H4 still strong. **Ongoing watchpoint:** H3 precision on **prove myself** and **replay** threads (uneven, not broken). Detail: **`docs/HC_OS_V1_Milestone_H_Lumen_7case_Followup_Nova_2026-02-08.md`** (closure section).

### Addendum — End-of-day benchmark suites (2026-03-24)

Lumen completed three filtered benchmark sets on hosted (`lumen-daily-core-7`, `lumen-regression-14`, `lumen-confidence-25`) using the **custom observation row** path; Wisewave concurred on conclusions and **reporting separation** (passive vs benchmark suppression ratios). Full tables and locked reporting rule: **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_End_of_Day_Summary.md`**.

### Addendum — Combined interpretation (2026-03-24 → 2026-03-25)

**Lumen + Wisewave:** End-of-day **v3** picture (24th) plus **25th** reruns → combined read: **H viable, not closure-clean**; preserve **H4**, tighten **H3** significantly and **H1** moderately, keep **H5** narrow, **stabilization not hard-close**; 7-case workable, 14 soft, 25 not release-confidence clean. Full synthesis and Tree/Nova action brief: **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`**.

### Addendum — **`milestone_h_v4`** benchmark rerun (2026-03-25)

Lumen re-ran **7 / 14 / 25** suites vs earlier **v3** same-day baseline: **+1 PASS** (7), **+2 PASS** (14), **+1 / −1** (25); **`h3_permissiveness_narrowing`** confirmed in targeted cases; **confidence 25** still revise-heavy; **replay/rumination** still soft. Wisewave **agreed** — real narrowing effect, **not** closure-clean. Detail: **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_v4_Results_2026-03-25.md`**.

---

## Next phase (Tree / Wisewave)

Lumen QA = **soft pass**, not hard milestone closure. **Do not open Milestone I** until Tree’s stabilization **exit gate** is met.

**Tree (ACTIVE — execution):** **`docs/HC_OS_V1_Milestone_H_Tree_Stabilization_Plan_Execution.md`** — principles, four streams, metrics, daily loop, escalation, exit criteria, Milestone I preparation gate.

**Wisewave:** **`docs/HC_OS_V1_Milestone_H_Wisewave_Status_Soft_Pass_and_Stabilization_Phase.md`** — controlled exception vs ambient, stabilization checklist, “when H is truly passed.”

**OctopusMind (Gate 1, Lumen-aligned tightening):** **`docs/HC_OS_V1_Milestone_H_OctopusMind_Lumen_Closure_Doctrine.md`** — insertion/suppression boundaries, confidence discipline, anti-drift, proof logic, H/E conflict, kill-switch, and the five “OctopusMind must answer” lines.

**Lumen — drift detection (stabilization, draft by Wisewave):** **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — guidance / interpretive / authority / weight / duplication axes; removal test; whole-turn evaluation; strict verdict format; EN/ZH parity drift.

**Observation log (Wisewave — no-change monitoring):** **`docs/HC_OS_V1_Milestone_H_Observation_Log_Template_Wisewave.md`** — complements drift checklist; 10–20 sampled entries/day; Tree close / continue / return decision block.
