# Lumen QA plan — Milestone H (minimal everyday integration / micro awareness)

**Owner:** Lumen  
**Scope:** **Micro awareness usability** — whether a **single optional awareness line** can appear in **live reflective use** as **light, non-authoritative, and non-duplicative** of Milestone **E** (pattern / recurrence) and the main reflection — without widening product presence, coaching tone, or “feature” feel.

**Does not:** re-audit full Milestone E mechanics unless H surfaces an **E regression** or **H/E conflict** bug.

**Lumen QA outcome:** Record passes and judgment in **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`**. Milestone H **closure** follows addendum **§16 Final acceptance standard** and **§17 governing line** (*slightly more aware, not more managed*).

---

## Shipped implementation (Nova baseline)

- **Server:** `POST /api/chat/turn` — optional **`awareness_cue`** `{ kind, text_en, text_zh }` when selection + gates pass (`lib/wisewave-milestone-h-micro-awareness.ts`).  
- **Kill switch:** **`ENABLE_H_CUE`** = **`true`** or **`1`** enables **Light Mode** main-reflection appendix + H cue path; **unset or any other value = off** (default-off).  
- **API debug (QA):** `debug_milestone_h_enabled`, `debug_milestone_h_build_marker` (`milestone_h_v1`), `debug_milestone_h_outcome` (`emitted` | `suppressed` | skipped), `debug_milestone_h_suppressed_reason`, `debug_milestone_h_kind`. Suppression reasons include **`recurrence_overlap_e`**, **`recurrence_overlap_e_structural`**, **`minimal_affect_low_signal`** (flat hedge / thin affect), **`h1_mild_reflective_insufficient`** (mild/generic reflective only — H1 follow-up), plus **`utilitarian_or_factual`** for task/help/summarize-style asks. **H3** only when **user text** shows uncertainty — not **`emotion_label` alone**.  
- **Persistence (UI rehydrate only):** assistant `metadata.wisewave_micro_awareness` — **not** a separate H state machine; same pattern as recurrence/embodiment strips.  
- **UI:** `/chat` — **Awareness** / **轻量觉察** strip (amber), **after** continuity + pattern + optional response grouping; language follows last user message (EN/ZH baseline). **Stabilization (H-UI-1 / H-UI-2):** when Awareness is visible for that assistant turn, **Regulation cue** and **“What was noticed”** are **hidden** by default to reduce stack weight; use **`?noticed=1`** to force “What was noticed” for QA.  
- **Conflict rule (implemented):** If Milestone **E** **`recurrence_cue`** is emitted on the same turn, **H is suppressed** (`recurrence_overlap_e`). If **E2** proves aligned recurrence (**`debug_recurrence_aligned_instance_count` ≥ 2**) but the strip is **withheld** (E3 legibility, anti-repeat, stale window, low-confidence path, etc.), **H is still suppressed** (`recurrence_overlap_e_structural`).  
- **Consecutive-turn:** If prior assistant message had `wisewave_micro_awareness`, **H suppressed** on next turn.  
- **H2 pattern-to-moment bridge:** **Not** in current minimal engine (H1 / H3 / H4 / H5 only) — see **Pass 6 note**.

**Reference docs (judgment lenses):**

- `docs/HC_OS_V1_Milestone_H_Addendum_Minimal_Everyday_Integration_Micro_Awareness_Layer.md` — §10 Nova, §11 Lumen, §14–§17  
- `docs/HC_OS_V1_Milestone_H_Wisewave_Consciousness_Quality_Boundary_Layer.md` — experiential gate  
- `docs/HC_OS_V1_Milestone_H_OctopusMind_Two_Gate_Structural_Experiential_Doctrine.md` — two-gate stack  
- `docs/HC_OS_V1_Milestone_H_Failure_Case_Library_Top_10_Drift_Scenarios.md` — drift containment  
- **`docs/HC_OS_V1_Milestone_H_Wisewave_Reflection_Style_v2_Light_Mode.md`** — **Pass 5** revision: main reflection **Light Mode** (notice, not conclude) so H can be validated **whole-turn**  
- `AGENTS.md` — Milestone H governance summary  
- **`docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md`** — **Post–closure stabilization** drift QA (Wisewave-strengthened draft): five axes, removal test, whole-turn evaluation; use during **H stabilization**, not as a substitute for this plan’s passes.

**Product rule (all passes):**

> **Open space, do not steer.**

**Two-gate reminder (Lumen questions):**

1. **OctopusMind (structural):** Is H admissible without duplicating E, widening presence, or weak evidence?  
2. **Wisewave (experiential):** If admissible, is **silence** still better? Does H feel **lighter than silence** in this moment?

---

## 1. What Milestone H QA must prove

Map to addendum **§11.2** questions + **§16** acceptance list:

| # | Claim | Lumen intent |
|---|--------|----------------|
| 1 | **Helpful or removable** | Cue **improves** the moment **or** removal would be better — **removal-first** is valid success |
| 2 | **Presence discipline** | Cue does **not** increase perceived **system** presence vs reflection + E/F baseline |
| 3 | **Not guidance** | Does **not** read as instruction, therapy, or analysis |
| 4 | **Not E duplicate** | Does **not** restate pattern / recurrence functionally or experientially |
| 5 | **One-pass readable** | Short, scannable; not a second reflection |
| 6 | **EN / ZH** | Equivalent **restraint** and **lightness** (not literal word-lockstep) |
| 7 | **Controlled exception** | H does **not** feel **expected**, **ambient**, or like a **feature** (see failure library #1, #10) |

**Closure question:**

> Can the product show **at least one** real moment where H **lightly** helps, while **most** eligible turns still **suppress** correctly and the product stays **reflection-first** and **not more managed**?

---

## 2. Preconditions for testing

1. **Build:** Includes Milestone H turn instrumentation (Pass **0P**).  
2. **`ENABLE_H_CUE`:** Set to **`true`** or **`1`** on the **server** (local `.env.local` or **Vercel** project env for hosted QA). Enables **Wisewave Light Mode v2** on the main reflection **and** the awareness cue. Without this, both stay **off** — do not score content passes. Confirm **`debug_milestone_h_light_mode_appendix_applied`** for Pass 5.  
3. **`MILESTONE_F_EMBODIMENT` / `MILESTONE_G_INTEGRATION`:** As needed; H QA judges **interaction** with existing strips, not F/G closure.  
4. **Session:** Hosted (preferred) or local; authenticated or anonymous per your matrix.  
5. **Substrate:** Mix of turns that **do** and **do not** qualify for **E recurrence** — required to validate **H suppression when E fires**. Include, if possible, at least one turn where **`recurrence_cue`** is **absent** but **`debug_recurrence_aligned_instance_count` ≥ 2** (structural recurrence without visible strip) to confirm **`recurrence_overlap_e_structural`**.

---

## 3. Pass structure

### Pass 0P — Deployment / build smoke (run first)

On **any** successful `POST /api/chat/turn` with **`ENABLE_H_CUE` enabled**:

| Check | Pass criteria |
|-------|----------------|
| H build marker | `debug_milestone_h_build_marker === "milestone_h_v1"` **present** |
| Light Mode marker | `debug_milestone_h_light_mode_build_marker === "milestone_h_light_mode_v1"` **present** |
| Light Mode applied | When `ENABLE_H_CUE` on: `debug_milestone_h_light_mode_appendix_applied === true` — confirms **Wisewave Reflection Style v2** is appended to the **system** message (main reflection layer), not documentation-only |
| H enabled flag | `debug_milestone_h_enabled === true` when env is set |
| Outcome shape | `debug_milestone_h_outcome` is a string; when suppressed, `debug_milestone_h_suppressed_reason` is present (or null when emitted) |

**If marker missing:** wrong build / env not applied — **do not** score H content passes yet.

---

### Pass 1 — Kill switch (`ENABLE_H_CUE`)

| Step | Action | Pass criteria |
|------|--------|----------------|
| 1a | **`ENABLE_H_CUE=true`** (or `1`) | Turn succeeds; `debug_milestone_h_enabled: true`; engine may emit or suppress for reasons other than disabled |
| 1b | **Unset** or **`false`** / **`0`** | `debug_milestone_h_enabled: false`; `debug_milestone_h_light_mode_appendix_applied: false`; `debug_milestone_h_outcome` indicates disabled path (e.g. `milestone_h_disabled`); **`awareness_cue`** absent; main reply still coherent |
| 1c | Restore **`true`** for remaining passes | 0P behavior returns |

**Fail if:** kill switch breaks the turn API or leaves inconsistent debug fields.

---

### Pass 2 — H/E conflict (structural gate)

**Goal:** Addendum **§9.2 conflict rule** — if E pattern cue fires, **H must not**. **Stabilization tightening:** if **E2** already proved recurrence (aligned count ≥ 2) but the **strip is withheld**, **H must still not** appear.

| Step | Action | Pass criteria |
|------|--------|----------------|
| 2a | Construct a turn where **`recurrence_cue`** is **emitted** (continuity + E conditions met) | **`awareness_cue`** **absent**; `debug_milestone_h_suppressed_reason` is **`recurrence_overlap_e`** |
| 2b | Construct a turn where **`recurrence_cue`** is **absent** but **`debug_recurrence_aligned_instance_count` ≥ 2** (e.g. E3 suppressed cue, anti-repeat, or stale-window path on a recurrence-qualified substrate) | **`awareness_cue`** **absent**; `debug_milestone_h_suppressed_reason` is **`recurrence_overlap_e_structural`** |
| 2c | Construct a turn with **strong reflection** but **no** structural recurrence (aligned count **&lt; 2** or null) and **no** `recurrence_cue` | H **may** emit — not required every time; if emitted, **no** recurrence strip on same response |

**Fail if:** `recurrence_cue` and `awareness_cue` both present on the same turn **or** structural recurrence (2b) still shows **`awareness_cue`**.

---

### Pass 3 — Suppression matrix (Gate 1)

**Goal:** Addendum **§11.3** categories + failure library **§1–6**.

| Category | Intent | Pass criteria (examples) |
|----------|--------|---------------------------|
| **Factual / utilitarian** | Short factual Q or non-reflective ask | H **suppressed**; no “awareness” where reflection isn’t the point |
| **Vague-source parity** | Same vague-source turns as E (e.g. “I feel off” only) | H **suppressed** when vague-source gate applies |
| **Weak evidence** | Thin / generic insight | `weak_evidence_insight` or **`gate2_experiential_silence`** — **no** H |
| **Consecutive turn** | Send two eligible turns in a row | Second turn: **`consecutive_turn`** suppression if first had H |
| **Clean reflection** | Already complete thought, no added value | Prefer **suppression**; if H appears, **fail** unless Lumen documents why silence wasn’t better |

**Fail if:** H appears where **uncertainty** or **weak signal** should win (OctopusMind **uncertainty rule**).

---

### Pass 4 — Experiential gate (Wisewave / Gate 2) — **H line only**

**Goal:** The **awareness cue** feels like **gentle noticing**, not guidance; **silence** preferred when weight > gain.

| Check | Pass criteria |
|-------|----------------|
| Tone | No **you should**, **you need to**, **try to**, **stop** (ZH equivalents too) |
| Weight | Cue not **more intense** than main reflection; removing strip **does not** improve comprehension → **watchpoint**; if removal **usually** improves → **fail** |
| “Feature” feel | After several sessions, H still feels **rare** and **optional** — not **expected** (failure library **#1**, **#10**) |

**Fail if:** cue feels **instructive**, **therapeutic**, or **analytic** (addendum **§11.4**).

**Note:** If Pass 4 passes on the **H line** but the **whole turn** still feels too heavy, the blocker is usually **main reflection authorial weight** — addressed in **Pass 5** via **Wisewave Light Mode v2** (not by tuning H alone).

**Closure note (2026-03-22):** Original Pass 4 was correctly marked **revise** because whole-turn heaviness contaminated cue evaluation. After Wisewave **Reflection Style v2 / Light Mode** was deployed, Pass 4 was **re-run under the revised cue-only scope** and can be treated as **closed / pass with watchpoint**. Whole-turn judgment now belongs primarily to **Pass 5**.

---

### Pass 5 — Whole-turn validation + H kind (Wisewave Reflection Style v2 — **Light Mode**)

**Primary reference:** **`docs/HC_OS_V1_Milestone_H_Wisewave_Reflection_Style_v2_Light_Mode.md`**

**Why:** Lumen may find the **H cue** restrained while the **main assistant reflection** remains too interpretive, resolved, or guiding — which **contaminates** the experiential test for H. Pass 5 fixes **baseline lightness** so H can be judged **honestly** as *lighter than silence* at the **full-turn** level.

#### 5A — Main reflection: Light Mode (notice, not conclude)

**Goal:** Main body follows Wisewave **§2–§5**: **observational**, **unresolved**, **no subtle prescription**; **1–2 sentences** preferred (mirror + light tension name).

| Check | Pass criteria |
|-------|----------------|
| Governing rule | **Notice, not conclude** — see Wisewave **§2** |
| Resolution pressure | No “cleanest thing”, “what matters”, “truth underneath” (Wisewave **§4 Rule 1**, **§6.2**) |
| Emotional authority | No verdict on how harsh / important / true things are (Wisewave **§4 Rule 2**, **§6.1**) |
| Ambiguity | User uncertainty **not** collapsed into helpful resolution too fast (Wisewave **§4 Rule 4**) |
| H compatibility | If main reflection already sounds like **guidance**, H **cannot** be validated honestly (Wisewave **§9**) |

**Control principle (Wisewave §14):** If the response feels **more helpful than true** to the moment, it is **too heavy** for Milestone H.

#### 5B — Whole turn vs Pass 4 baseline

**Lumen questions (Wisewave §12):**

1. **Primary:** Does the **full response** feel **lighter** than the **Pass 4** baseline (same archetypes)?  
2. **Secondary:** Does the response still feel **valid** if **H is removed**? If **yes**, baseline is light enough.

#### 5C — Nova comparison protocol (Wisewave §11)

Test **both**:

- Full turn: **Light Mode** main reflection **+** `awareness_cue` (when emitted)  
- Full turn: **Light Mode** main reflection **without** H (conceptually strip the line; or compare turns)

**Question:** Does H improve the moment **slightly** **without** making the turn feel **more present**? If **not** → **suppress** (do not tune H in isolation).

#### 5D — H kind usefulness (H1 / H3 / H4 / H5)

**Goal:** When **`debug_milestone_h_kind`** is set, each kind **can** justify itself in one sentence **without** steering — **after** 5A passes.

| Kind | Probe | Pass criteria |
|------|--------|----------------|
| **H1** | Generic reflective moment | Opens space without naming user’s problem |
| **H3** | Uncertainty / pause language in user text | Creates **room**, not homework |
| **H4** | Pressure / effort / proving language | **Softens** push without **fixing** the user |
| **H5** | Tension / divided pull | **Marks** lightly — no cause analysis |

**Pass 5 Wisewave acceptance (Wisewave §10):** Revision is sufficient only if main reflection is **less resolved**, **less subtly advisory**, ambiguity **intact**, turn **lighter before H**, H can be **added** without more **managed** feel, and H can be **removed** without **dramatically improving** the turn.

**Note:** **H2 pattern bridge** is **not** in the current engine — skip H2-specific scenarios until Nova ships it; document as **deferred**.

---

### Pass 6 — Duplication & presence (E + continuity)

**Goal:** H does **not** occupy the **same felt space** as E or **Last insight** (OctopusMind **presence duplication**).

| Check | Pass criteria |
|-------|----------------|
| With **Last insight** only | Strip order: continuity → pattern (if any) → optional response → **awareness**; main message still **center of gravity** |
| Wording | Awareness line does **not** **repeat** continuity text or pattern cue content |
| Stacked weight | If many strips fire, overall turn still **one-pass** readable; not **stacked products** |

**Fail if:** removing **only** `awareness_cue` makes the turn **strictly better** in **most** cases (§11.4 / failure library).

---

### Pass 7 — EN / ZH baseline parity

**Goal:** Addendum **§16** EN/ZH restraint + prior bilingual quality rules.

| Step | Action | Pass criteria |
|------|--------|----------------|
| 7a | Same **archetype** of user message in **English** | H (if emitted): **non-commanding**, **light** |
| 7b | Same archetype in **Chinese** | ZH not **heavier**, **more teacher-like**, or **more explanatory** than EN posture |
| 7c | UI labels | “Awareness” / “轻量觉察” read as **peer** to other strips, not louder |

**Fail if:** category shifts to **guidance** in one language only.

---

### Pass 8 — Founder demo shape (addendum §14)

**Minimum beats (compress if needed; capture JSON + screenshots):**

1. **Normal reflective exchange** — main reply lands.  
2. **Suppression** — factual turn, **E recurrence emitted**, or **structural E2 overlap** (2b) → **no** H; debug shows correct reason (`recurrence_overlap_e` / `recurrence_overlap_e_structural` / other).  
3. **Light help** — one turn where H **helps** without dominating.  
4. **Removal / weight** — one case where H **should not** appear or **removal** is better (document verdict).  
5. **EN** example + **ZH** example.  

**Pass if:** demo shows H as **optional**, **restrained**, **not** the product center.

---

### Pass 9 — Regression sniff (E / F / G)

**Goal:** H did not break recurrence, embodiment, continuity, or G appendix behavior.

| Check | Pass criteria |
|-------|----------------|
| E | `recurrence_cue` still emits under prior E QA expectations when substrate holds |
| F | `embodiment_cue` still gated as before when F enabled |
| G | Integration appendix still applies per G kill-switch when testing G |
| UI | Hydration after refresh: strips still reattach from `metadata` |

**Fail if:** clear **regression** traceable to H merge.

---

## 4. Failure conditions (instant fail triggers)

From addendum **§11.4** — Lumen **fails** H milestone judgment if any hold **persistently**:

- Cue feels **instructive**, **therapeutic**, or like **analysis**  
- Product feels **heavier** because of H  
- H **duplicates** E or **reflection** in function or felt presence  
- EN/ZH **parity** breaks materially  
- **Removing** the cue **consistently** improves the response  
- H becomes **expected** or **ambient** (see failure library)

---

## 5. Evidence capture template (per pass / session)

```yaml
milestone: H
environment: hosted | local
enable_h_cue: "true" | "1" | off
session_id:
pass_id: 0P | 1–9
pass_5_light_mode:
  main_reflection_notice_not_conclude: pass | fail | watchpoint
  lighter_than_pass4_baseline: yes | no | n/a
  valid_if_h_removed: yes | no | unsure
user_messages_summary:
e_recurrence_on_this_turn: yes | no
api_snapshot:
  debug_milestone_h_build_marker: milestone_h_v1 | absent
  debug_milestone_h_enabled: true | false
  debug_milestone_h_outcome: emitted | suppressed | skipped_*
  debug_milestone_h_suppressed_reason: <string | null>
  debug_milestone_h_kind: H1 | H3 | H4 | H5 | null
  recurrence_cue_present: yes | no
  debug_recurrence_aligned_instance_count: <number | null>  # Pass 2b: ≥2 without cue → expect structural H suppression
  awareness_cue_present: yes | no
two_gate_read:
  structural_admissible: pass | fail | n/a
  experiential_lighter_than_silence: pass | fail | n/a
  silence_would_be_better: yes | no | unsure
drift_signals:
  feels_like_feature: yes | no
  feels_guidance: yes | no
  duplicates_e_or_reflection: yes | no
parity_en_zh: pass | fail | watchpoint
verdict: pass | revise | remove_recommend
revise_owner: Nova | Wisewave_copy | OctopusMind_spec | Tree
notes:
```

---

## 6. Verdict & Tree handoff

- **Pass** only if **§16** conditions can be honestly ticked **and** no **§11.4** failure condition dominates across the matrix.  
- **Revise:** targeted Nova (suppression thresholds, templates, debug), Wisewave copy, or Tree sequencing — re-run affected passes only.  
- **Remove / rollback:** if **removal-first** or kill-switch is the **honest** recommendation (failure library **#10**), Tree should treat **global off** as valid outcome until doctrine is fixed.

---

## 7. Results log

Maintain **`docs/HC_OS_V1_Milestone_H_Lumen_QA_Results.md`** after runs (mirror Milestone G/F results style).

---

## Related docs

- `docs/HC_OS_V1_Milestone_G_Lumen_QA_Plan.md` — pass-shape reference  
- `docs/HC_OS_V1_Milestone_H_Wisewave_Reflection_Style_v2_Light_Mode.md` — **Pass 5** main-reflection Light Mode  
- `docs/HC_OS_V1_Milestone_H_Failure_Case_Library_Top_10_Drift_Scenarios.md`  
- `docs/HC_OS_V1_Milestone_H_Lumen_Drift_Detection_Checklist_Stabilization.md` — post-closure drift QA (stabilization; not a substitute for passes 0P–9)  
- `memory.md` / `AGENTS.md` — Nova implementation pointers  
