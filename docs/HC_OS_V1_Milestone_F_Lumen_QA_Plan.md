# Lumen QA plan — Milestone F (minimal embodiment bridge)

**Owner:** Lumen  
**Scope:** **`embodiment_cue`** only — optional, invitation-style **grounded next response** layered **after** a visible **pattern cue** (`recurrence_cue`). Does **not** re-audit Milestone E unless F surfaces a regression.

**Shipped implementation (Nova F1/F2):**

- API: `POST /api/chat/turn` may return `embodiment_cue` when `recurrence_cue` is non-null (unless `MILESTONE_F_EMBODIMENT=0` on server).
- UI: `/chat` — **“Optional response”** / **“可选回应提示”** below **Pattern cue**, smaller typography.

**Reference docs (judgment lenses):**

- `docs/HC_OS_V1_Milestone_F_Addendum_Minimal_Embodiment_Bridge.md`
- `docs/HC_OS_V1_Milestone_F_Wisewave_Embodiment_Cue_Quality_Bar.md`
- `docs/HC_OS_V1_Milestone_F_OctopusMind_Embodiment_Boundary.md`
- `docs/HC_OS_V1_Milestone_F_Proof_Spec_v1.json` — `qa_checks`, `show_hide_rules`, `anti_pressure_rules`
- `docs/HC_OS_V1_Milestone_F_Nova_Implementation_Path.md`

**Shared control rule (fail closed on drift):**

> Build and validate only responses that are **singular, optional, grounded, legible, and non-managerial**; reject anything that introduces **action structure**, **directional authority**, or **behavioral sequencing**.

---

## 1. What Milestone F QA must prove

Map to proof spec **`qa_checks`** + acceptance gate in the F addendum:

| # | Claim | Lumen intent |
|---|--------|----------------|
| 1 | One repeated pattern can support **one** grounded next response | Embodiment appears as a **single** opening, not a sequence or plan |
| 2 | Response feels **optional**, not imposed | Tone reads as invitation; user can ignore without friction |
| 3 | Response stays **minimal** — not a behavior layer | No tasks, habits, “next steps” product, or workflow feel **from F** |
| 4 | **Reflection** remains primary | Main assistant message > pattern cue > optional response (visual + felt hierarchy) |
| 5 | Product does **not** read as coaching / tasking / action management | Fail if F copy or placement feels directive or performance-heavy |
| 6 | **EN/ZH** preserve equivalent optionality, tone, low-pressure feel | Not literal translation parity — **functional** parity |
| 7 | Visible response stays **proof-justified** and **autonomy-preserving** | Only when pattern cue is present (v1 rule); debug aligns |

**Closure question (OctopusMind):**

> Can one repeated pattern support one grounded, optional, present-facing response while reflection remains primary and the product does not become coaching, guidance, or behavior management?

---

## 2. Preconditions for testing

1. **Server:** `MILESTONE_F_EMBODIMENT` **unset** or not `0` (embodiment enabled).  
2. **Session:** Use **one continuous** hosted (preferred) or local session; preserve cookies for anonymous flows.  
3. **Substrate:** Reuse **same-family** turns that already produce **`recurrence_cue`** (see E2/E3 QA substrates if needed). **No embodiment without pattern cue** in v1.

---

## 3. Pass structure

### Pass 1 — Gating & API integrity

**Goal:** Embodiment is **tied** to recurrence; no orphan embodiment surface. **Every successful turn** must be **F-debug-legible** (deployment smoke test).

#### Pass 1P — Deployment smoke (run first)

On **any** successful `POST /api/chat/turn` response:

| Check | Pass criteria |
|-------|----------------|
| Build marker | `debug_embodiment_f_build_marker === "milestone_f_v1"` **must** be present |

**If the marker is missing:** the environment does **not** include the current Milestone F turn code — **do not** score Pass 1B/C yet. **Revise = deploy / rebuild / verify branch** (not more conversation turns).

#### Pass 1 — Gating table

| Step | Action | Pass criteria |
|------|--------|----------------|
| 1a | Turn with **no** `recurrence_cue` (e.g. first insight, vague source, or suppressed recurrence) | `embodiment_cue` **absent**; `debug_embodiment_f_outcome` is **`skipped_no_recurrence`**; `debug_embodiment_f_milestone_enabled` is boolean |
| 1b | Turn **with** `recurrence_cue`, Milestone F **enabled** (`debug_embodiment_f_milestone_enabled: true`) | `debug_embodiment_f_outcome` is **`emitted`** **and** `embodiment_cue` **present** (`pattern_key`, `response_state`, `text_en`, `text_zh`) |
| 1c | Turn **with** `recurrence_cue`, F **disabled** (`MILESTONE_F_EMBODIMENT=0`) | `debug_embodiment_f_outcome` is **`skipped_milestone_disabled`**; `debug_embodiment_f_suppressed_reason` is **`milestone_f_disabled`**; no `embodiment_cue` |
| 1d | (Edge) recurrence present but `debug_recurrence_e3_legibility_state` would be null — rare | `debug_embodiment_f_outcome` is **`skipped_no_e3_legibility`**; `debug_embodiment_f_suppressed_reason` explains |
| 1e | Inspect debug when emitted | `debug_embodiment_f_response_state` matches `embodiment_cue.response_state`; `debug_embodiment_f_used_ultra_short` plausible for short / low-confidence turns |

**Fail if:** `embodiment_cue` appears without `recurrence_cue`.

**Interpretation note (Lumen Pass 1B revise):** If recurrence is clearly emitted but **no** `debug_embodiment_f_*` fields and **no** build marker → treat as **undeployed / wrong build**, not a wording issue.

---

### Pass 2 — Optionality & anti-coaching (product meaning)

**Goal:** Wisewave **invitation** bar + OctopusMind **anti-coaching** bar.

| Step | Action | Pass criteria |
|------|--------|----------------|
| 2a | Read **Optional response** copy aloud | Sounds like **may / maybe / it may be enough** — not **you should / you need to / your next step is** |
| 2b | Compare to **Pattern cue** | Embodiment is **softer** and **smaller** in feel than pattern legibility text |
| 2c | Compare to **main reflection** | Reflection still feels like the **main event**; F does not steal the emotional center |
| 2d | Quick “decline” test | User can read reflection only and ignore strip **without** feeling non-compliant |
| 2e | **Decline-friction check** | The cue feels **easier to ignore than to obey**; reading it does not create subtle pressure to comply, improve, or "respond correctly" |

**Fail if:** coaching, therapy, motivation, or performance-optimization vibe (see Wisewave **bad examples** list), **or** if the embodiment cue feels harder to decline than to receive.

---

### Pass 3 — Anti-pressure & silence

**Goal:** F **reduces** or **does not add** pressure; silence elsewhere remains valid.

| Step | Action | Pass criteria |
|------|--------|----------------|
| 3a | Turns where recurrence is **suppressed** (E2 anti-repeat, stale window, E3 `low_present_relevance`, etc.) | **No** embodiment (follows recurrence absence) |
| 3b | Low-confidence / short-user-message turns with recurrence | Prefer **ultra_short**-style lines when `debug_embodiment_f_used_ultra_short: true`; still optional in tone |
| 3c | Optional: set `MILESTONE_F_EMBODIMENT=0` on staging | `embodiment_cue` absent; `debug_embodiment_f_outcome: "skipped_milestone_disabled"`; `debug_embodiment_f_suppressed_reason: "milestone_f_disabled"` when recurrence exists |

**Fail if:** embodiment makes the turn feel **more urgent** or **more obligated** than the reflection alone.

---

### Pass 4 — Reflection-first hierarchy (UI)

**Goal:** **Tertiary** placement per Nova path.

| Check | Pass criteria |
|-------|----------------|
| Order | Strip appears **below** Pattern cue; not above reflection body |
| Weight | Type size / contrast **lighter** than Pattern cue |
| Label | “Optional response” / “可选回应提示” reads as **optional**, not a command channel |

**Fail if:** embodiment reads as **primary** or **equal** to reflection or pattern cue.

---

### Pass 5 — Founder demo arc (EN)

**Goal:** One clean story Tree / founder can see without a manual.

**Minimum beats (single session):**

1. User messages establish **recurrence** → **Pattern cue** visible.  
2. Same arc → **Optional response** visible **under** pattern cue.  
3. A turn that **drops** recurrence → **both** strips gone (or pattern gone → embodiment gone).  
4. Narrate: “Reflection first → pattern second → optional opening third.”

**Pass if:** demo matches Milestone F **demo rule** in the addendum (no explanation-heavy defense needed).

---

### Pass 6 — EN/ZH baseline parity

**Goal:** Same **function** and **posture** in Chinese as English.

| Step | Action | Pass criteria |
|------|--------|----------------|
| 6a | Repeat a shortened arc in **Chinese** user input | `text_zh` shown when UI lang is ZH; invitation tone preserved |
| 6b | Tone parity | ZH not **stiffer / more commanding** than EN on the same beat (watch Wisewave **EN/ZH asymmetry** risk) |

**Fail if:** one language feels like **instruction** while the other feels **optional**.

---

### Pass 7 — Regression sniff (Milestone E)

**Goal:** F did not break continuity.

| Check | Pass criteria |
|-------|----------------|
| Recurrence | Same triggers as before F (aligned count, E3 gates); no systematic false positives |
| Last insight / continuity_insight | Unchanged behavior relative to E4 expectations (F must not rewrite) |

**Fail if:** recurrence or continuity **breaks** or **over-surfaces** because of F.

---

## 4. Evidence capture template (per pass / session)

```yaml
milestone: F
environment: hosted | local
session_id: 
pass_id: 1–7
user_messages_summary: 
recurrence_cue_present: yes | no
embodiment_cue_present: yes | no
api_snapshot:
  pattern_key: 
  recurrence_phase: recurrence | persistence | n/a
  embodiment_response_state: light | clear | n/a
  debug_embodiment_f_build_marker: milestone_f_v1 | absent
  debug_embodiment_f_milestone_enabled: true | false
  debug_embodiment_f_outcome: emitted | skipped_no_recurrence | skipped_milestone_disabled | skipped_no_e3_legibility
  debug_embodiment_f_used_ultra_short: true | false | null
  debug_embodiment_f_suppressed_reason: string | null
ui:
  reflection_primary: pass | fail
  pattern_secondary: pass | fail
  embodiment_tertiary: pass | fail
  optional_tone: pass | fail
  anti_coaching: pass | fail
verdict: pass | revise
revise_owner: Nova | test_construction | Wisewave_copy
notes:
```

---

## 5. Verdict & Tree handoff

- **Milestone F QA Pass** only if **Passes 1–7** pass without unresolved **category drift** (coaching / action management / reflection displacement).  
- **Revise:** file minimal Nova issues (copy, gating, placement) or adjust **test construction**; re-run affected passes only.  
- **Tree:** closure when QA + OctopusMind + Wisewave agree the **closure question** is answered **yes**.

---

## 6. Optional results log

After runs, add **`docs/HC_OS_V1_Milestone_F_Lumen_QA_Results.md`** (same style as E3/E4 results).

---

## Related docs

- `docs/HC_OS_V1_Milestone_F_Execution_Addendum.md`
- `docs/HC_OS_V1_Milestone_E3_Lumen_QA_Results.md` — substrate ideas for recurrence-bearing turns
- `docs/HC_OS_V1_Milestone_E2_Lumen_QA_Plan.md` — decay / anti-repeat scenarios
