# HC-OS V1 — Milestone J Lumen QA Plan

**Product:** Wisewave V1 `/chat` (Option B — `POST /api/chat/turn`)  
**Milestone:** J — Micro-Shift / Embodied Effect Layer (`j_microshift`)  
**Owner:** Lumen  
**Mode:** Suppression-first / removal-first / reflection-primary

---

## 0. Purpose

This plan tests whether Milestone **J** can add a **real but minimal** inner opening **without**:

- guidance, coaching, or corrective tone  
- increased **system** presence or “the system caused the shift” feel  
- competing with the **main reflection** or stacking visibly with **H** / **I** / **E** / **F**  
- cross-turn persistence or memory dependence (J must stay **moment-bound**)

**J passes** only if the line is **optional in spirit**: removing it leaves a **fully coherent** reply that is **cleaner or equally good**.

**Does not:** replace Wisewave language lock review or OctopusMind boundary doc; this plan exercises **shipped turn wiring** against those rules.

---

## 1. Core QA question

> **Does this turn need a separate micro-shift line at all — or does the main reflection (and any I carry) already carry the moment?**

**Primary removal test (same spirit as Milestone I):**

If you **mentally delete** the J sentence from `assistant_message`, is the response **cleaner or as good**? If **yes**, J should have been **suppressed** on that turn.

**Secondary experiential test:**

If J **does** appear, does it read as a **faint opening** (“there may be…”, “this may not need to…”) — **not** as advice, permission from the system, or a second reflection?

---

## 2. Shipped implementation (Nova baseline)

| Item | Detail |
|------|--------|
| **Route** | `POST /api/chat/turn` — `app/api/chat/turn/route.ts` |
| **Order** | Main model text → Milestone **I** append (if emitted) → Milestone **J** append (if emitted) |
| **Kill switch** | **`ENABLE_J_MICROSHIFT`** = **`true`**, **`1`**, or **`yes`** (server only). Anything else / unset = **off** |
| **Response** | **`microshift_cue`**: `{ text_en, text_zh, render_mode }` when emitted |
| **Debug** | `debug_milestone_j_enabled`, `debug_milestone_j_build_marker` (**`milestone_j_microshift_v1`**), `debug_milestone_j_outcome`, `debug_milestone_j_suppressed_reason`, `debug_milestone_j_eligibility`, `debug_milestone_j_allow_render_mode`, `debug_milestone_j_reasons`, `debug_milestone_j_rollback_risk` |
| **Metadata** | `wisewave_j_microshift` on assistant message (parity with other Wisewave fields; **no** new `/chat` strip — text lives in **`assistant_message`**) |
| **Engine** | `buildJBoundaryInputForTurn` + `evaluateMilestoneJBoundary` + `pickJMicroshiftTemplate` |

---

## 3. Reference docs (judgment lenses)

- `docs/HC_OS_V1_Milestone_J_Addendum_Micro_Shift_Embodied_Effect_Layer.md`  
- `docs/HC_OS_V1_Milestone_J_Wisewave_Language_Handoff.md`  
- `docs/HC_OS_V1_Milestone_J_OctopusMind_Boundary_Handoff.md`  
- `lib/wisewave-milestone-j-microshift-template-pack-v1.json` + `docs/HC_OS_V1_Milestone_J_Nova_Template_Pack_v1.md`  
- `docs/HC_OS_V1_Milestone_J_Nova_Hosted_Probes_Lumen.md` — Nova hosted probe recipes (I-conflict, E/F stack, EN/ZH J parity) + expected `debug_*` shapes  
- `docs/QA_HANDOFF.md` — operational chat context + dated J note  

**Product rule:**

> **Open a shift, do not direct a shift.**

---

## 4. Where to run (local vs hosted)

| Environment | Use for |
|-------------|---------|
| **Local** | Fast loops: boundary reasons, marker presence, kill switch, copy spot-checks (`ENABLE_J_MICROSHIFT` in `.env.local`, restart Next) |
| **Hosted** | Sign-off: production env flag, real auth/cookies, latency, “would a user notice this as a feature?” |

**Requirement:** The **same** `ENABLE_J_MICROSHIFT` semantics must be verified in **each** environment you report on.

---

## 5. Preconditions

1. **Build** includes J instrumentation (`debug_milestone_j_build_marker === "milestone_j_microshift_v1"`).  
2. **`ENABLE_J_MICROSHIFT`** set **on** for passes that score J **emission**; **off** for kill-switch pass.  
3. **Browser devtools** (or proxy): capture **full** `POST /api/chat/turn` JSON response (debug fields are not all shown in UI).  
4. **Milestones H / I / E / F:** Use **controlled** env combinations so you can **force** or **avoid** overlap (see passes below).  

---

## 6. Required debug fields (Lumen checklist)

For every scored turn, record at minimum:

- `debug_milestone_j_enabled`  
- `debug_milestone_j_outcome` (`emitted` | `suppressed` | `skipped_disabled` | `skipped_no_reflection_state` | `skipped_no_assistant_row` | `skipped_not_computed`)  
- `debug_milestone_j_suppressed_reason` (when suppressed)  
- `debug_milestone_j_eligibility`, `debug_milestone_j_allow_render_mode`, `debug_milestone_j_reasons`  
- **Context:** `debug_milestone_h_outcome`, `debug_milestone_i_outcome`, presence of `recurrence_cue`, `embodiment_cue`  

---

## 7. Pass structure

### Pass 0J — Deployment / build smoke

| Check | Pass criteria |
|-------|----------------|
| Marker | `debug_milestone_j_build_marker === "milestone_j_microshift_v1"` |
| Flag off | With J **disabled**: `debug_milestone_j_outcome === "skipped_disabled"` and no `microshift_cue` |
| Flag on | With J **enabled**: `debug_milestone_j_enabled === true`; outcome is **not** `skipped_disabled` unless reflection missing |

**Fail if:** marker missing, or flag off still emits `microshift_cue`.

---

### Pass 1 — Kill switch

| Step | Action | Pass criteria |
|------|--------|----------------|
| 1a | `ENABLE_J_MICROSHIFT=true` | Turn succeeds; `debug_milestone_j_enabled === true` |
| 1b | Unset / `false` / `0` | `debug_milestone_j_outcome === "skipped_disabled"`; **no** `microshift_cue`; main reply coherent |
| 1c | Restore on for remaining passes | 0J behavior returns |

---

### Pass 2 — H / I conflict (J loses first)

**Goal:** If **H** (`awareness_cue`) **or** **I** (`debug_milestone_i_outcome === "emitted"`) is active on the **same** turn, **J must not emit**.

| Step | Construct | Pass criteria |
|------|-----------|----------------|
| 2a | Turn where **H emits** (`awareness_cue` present) | **No** `microshift_cue`; reasons include `conflict:h_active` or `conflict:h_and_i_active` as appropriate |
| 2b | Turn where **I emits** (I appended sentence; outcome `emitted`) | **No** `microshift_cue`; reasons include `conflict:i_active` or `conflict:h_and_i_active` |
| 2c | Turn where **neither** H nor I emits (env + substrate) | J **may** emit — not mandatory every time; if emitted, **no** H and **no** I on same response |

**Fail if:** `microshift_cue` appears alongside `awareness_cue` **or** alongside an **emitted** I line on the same turn.

---

### Pass 3 — E / F presence stack (presence risk)

**Goal:** If **`recurrence_cue`** **or** **`embodiment_cue`** is present on the turn, J should be **hard-suppressed** (elevated stack / presence risk).

| Step | Construct | Pass criteria |
|------|-----------|----------------|
| 3a | `recurrence_cue` emitted | **No** `microshift_cue`; `debug_milestone_j_reasons` includes `presence_risk` |
| 3b | `embodiment_cue` emitted (with recurrence as per F rules) | **No** `microshift_cue`; `presence_risk` in reasons |

**Fail if:** J line appears on the same response as recurrence or embodiment cue.

---

### Pass 4 — Non-reflective / utilitarian turns

**Goal:** Factual / utilitarian user messages should **not** get J (`non_reflective_turn` / `no_shift_support`).

| Step | User message style | Pass criteria |
|------|-------------------|----------------|
| 4a | Short definitional / “help me write…” / obvious lookup | `debug_milestone_j_outcome === "suppressed"` or inadmissible eligibility; **no** coaching-like J line |
| 4b | Substantive reflective paragraph | J **may** emit if other gates pass — judge on Pass 5–6 |

---

### Pass 5 — Content / tone (Wisewave bar)

When **`microshift_cue`** is **present**, check **all**:

| # | Check | Fail if |
|---|--------|---------|
| 5.1 | **Non-directive** | Reads like instruction, “you should”, “try”, “let’s”, therapeutic permission-giving |
| 5.2 | **Low system presence** | User could point to J as “what **made** me shift” |
| 5.3 | **Secondary** | J steals attention from the main reflection |
| 5.4 | **Not regulation** | Sounds like H-style regulation / soothing technique |
| 5.5 | **Removal test** | Deleting J does **not** make the reply **worse** in a way that implies J was **necessary** |

---

### Pass 6 — EN / ZH parity (restraint, not literal match)

For **comparable reflective turns** in EN and ZH:

| Check | Pass criteria |
|-------|----------------|
| 6.1 | Same **render_mode** tier behavior is plausible (both `ultra_light` or both `soft` when strength is similar — exact match not required) |
| 6.2 | Neither language reads **more** advisory or **more** “system-led” than the other |
| 6.3 | `text_en` / `text_zh` in `microshift_cue` both present when emitted (parity for QA record) |

---

### Pass 7 — Persistence / continuity (negative)

| Check | Pass criteria |
|-------|----------------|
| 7.1 | J does **not** depend on a **stored J state** from prior turns to “activate” (no cross-turn J layer in implementation) |
| 7.2 | Refresh / reload: J text remains only as part of **saved** `assistant_message` for that turn (no orphan strip requirement) |

---

## 8. Recording results

- Append a **dated** block to **`docs/HC_OS_V1_Milestone_J_Lumen_QA_Results.md`** when that file exists, **or** use **`docs/QA_HANDOFF.md`** section 5 (new findings) with **Pass / Fail**, environment, build marker, and 2–3 example `debug_milestone_j_reasons` lines per verdict.  
- For **blockers**, label explicitly: **internal beta blocker** vs **nice-to-have** vs **question**.

---

## 9. Quick matrix (optional shorthand)

| Case | H | I | E recur. | F embod. | Expect J |
|------|---|----|----------|----------|----------|
| A | off | off | off | off | May emit (if reflective + gates pass) |
| B | on | off | off | off | **No** |
| C | off | on | off | off | **No** |
| D | off | off | on | — | **No** |
| E | off | off | — | on | **No** |
| F | off | off | off | off | **No** if utilitarian user turn |

---

## 10. Closure question (for Tree / Lumen summary)

> Can the product show **occasional** J lines that **lightly open** the moment, while **most** turns correctly **suppress** J — and the user still **owns** the shift (not the system)?

If **no**, default posture remains **off** in production (`ENABLE_J_MICROSHIFT` unset) until gates or copy are tightened.
