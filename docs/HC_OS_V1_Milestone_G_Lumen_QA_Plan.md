# Lumen QA plan — Milestone G (minimal integration / everyday usefulness)

**Owner:** Lumen  
**Scope:** **Integrated loop quality** — whether reflection, bounded continuity, and minimal embodiment read as **one coherent, everyday-usable support arc** without widening HC-OS into utility, management, or coaching product categories.  

**Does not:** require a full re-audit of Milestone E/F mechanics unless G surfaces a **regression** (use Pass 8 as a sniff).

**Lumen QA outcome:** _TBD_ — record passes and closure judgment in **`docs/HC_OS_V1_Milestone_G_Lumen_QA_Results.md`** when runs complete.

**Closure standard (Wisewave):** Addendum **§11** is the **formal acceptance gate**. Milestone G is **complete** only if **all seven** §11 conditions are satisfied. **G0 shipped ≠ Milestone G complete** (G0 is implementation prep; closure is §11 judgment).

---

## Shipped implementation (Nova G0+ baseline)

- **System prompt:** Milestone G **integration appendix** appended on `POST /api/chat/turn` when **`MILESTONE_G_INTEGRATION`** is unset or not `0` (see `lib/wisewave-milestone-g-integration.ts`).  
- **API debug (QA):** `debug_milestone_g_integration_enabled`, `debug_milestone_g_system_appendix_applied`, `debug_milestone_g_build_marker` (`milestone_g_v1`).  
- **UI:** `/chat` — Last insight + Pattern cue + Optional response grouped with **`role="group"`** and **`display: contents`** (no extra layout mass).  
- **Milestones E/F** remain as built (recurrence, embodiment, persistence, strips) — G QA judges **how they read together**, not only individual layers.

**Reference docs (judgment lenses):**

- `docs/HC_OS_V1_Milestone_G_Addendum_Minimal_Integration_Everyday_Usefulness.md` — acceptance gate §11  
- `docs/HC_OS_V1_Milestone_G_Wisewave_Everyday_Usefulness_Quality_Bar.md`  
- `docs/HC_OS_V1_Milestone_G_OctopusMind_Integration_Boundary.md`  
- `docs/HC_OS_V1_Milestone_G_Proof_Spec_v1.json` — `qa_checks`, `everyday_usefulness_rules`, `show_hide_rules`, `anti_presence_rules`, `founder_demo_requirements`  
- `docs/HC_OS_V1_Milestone_G_Nova_Implementation_Path.md`

**Shared control rule (Nova + Lumen — fail closed on drift):**

> Build and validate only changes that **tighten the coherence, lightness, and everyday fit** of the existing HC-OS loop; **reject** any change whose usefulness depends on **broader utility, management, planning, tracking, or recommendation** behavior.

---

## 1. What Milestone G QA must prove

Map to proof spec **`qa_checks`** + addendum **§11 acceptance gate**:

| # | Claim | Lumen intent |
|---|--------|----------------|
| 1 | **One support loop** | Reflection + continuity + minimal embodiment feel like **one arc**, not three stacked products |
| 2 | **Ordinary life** | Usable in **small, real** moments (pressure spike, uncertainty, relational sting) — not only “ideal reflection” turns |
| 3 | **Not heavier than F** | No meaningful increase in **product mass**, **interpretive weight**, or **system presence** vs Milestone F baseline |
| 4 | **Reflection-first** | Main assistant message remains **center of gravity**; order of reading stays *see → thread → optional opening* |
| 5 | **Silence / restraint** | Valid success states unchanged; integration does **not** fill silence with extra structure |
| 6 | **Category** | Product does **not** read as utility, coaching, tasking, or **management** layer |
| 7 | **EN / ZH** | **Functional** parity: same usability, restraint, reflection-first **feel** (not literal translation lockstep) |

**Closure question (OctopusMind):**

> Can reflection, bounded continuity, and minimal embodiment now function together as one light, trustworthy, everyday support loop while the product remains reflection-first, low-pressure, non-managerial, and clearly **not** a broader utility system?

---

## 2. Preconditions for testing

1. **Environment:** Deploy/build includes **G0** turn instrumentation (see Pass 0P).  
2. **`MILESTONE_G_INTEGRATION`:** Unset or not `0` for “integration appendix **on**” passes; use `0` only for **Pass 1b** kill-switch check.  
3. **`MILESTONE_F_EMBODIMENT`:** As needed for arcs that include embodiment (unset / not `0` unless testing F-off behavior).  
4. **Session:** Hosted (preferred) or local; stable cookies for anonymous flows.  
5. **Substrate:** Reuse **F-bearing** sessions where **Last insight + pattern + optional response** can appear together; also run **ordinary-moment** short user messages per Pass 3.

---

## 3. Pass structure

### Pass 0P — Deployment smoke (run first)

On **any** successful `POST /api/chat/turn` response (integration **enabled**):

| Check | Pass criteria |
|-------|----------------|
| G build marker | `debug_milestone_g_build_marker === "milestone_g_v1"` **must** be present |
| G flags | `debug_milestone_g_integration_enabled` is **boolean**; `debug_milestone_g_system_appendix_applied` is **true** when integration is enabled and a normal system prompt path ran |

**If the G marker is missing:** treat as **wrong build / undeployed** — do not score coherence or everyday passes yet. **Revise = deploy / verify branch.**

**If `debug_milestone_g_system_appendix_applied` is false** while `debug_milestone_g_integration_enabled` is true: investigate empty custom system prompt path or error — may be **implementation bug**, not a wording judgment.

---

### Pass 1 — G API / kill-switch integrity

| Step | Action | Pass criteria |
|------|--------|----------------|
| 1a | Default env (G integration on) | Turn succeeds; 0P checks pass |
| 1b | Set **`MILESTONE_G_INTEGRATION=0`** on server | `debug_milestone_g_integration_enabled: false`; `debug_milestone_g_system_appendix_applied: false`; **no** regression to chat success path. **Contract check:** `npm run milestone-g:kill-switch-proof` (defaults env to `0`). **Full proof:** restart server with `=0`, one `POST /api/chat/turn`, capture JSON (see **`docs/HC_OS_V1_Milestone_G_Lumen_QA_Results.md`** Pass 1b). |
| 1c | Restore G on | 0P behavior returns |

**Fail if:** G kill switch breaks turns or leaves inconsistent debug booleans.

---

### Pass 2 — Coherence (one loop, not three layers)

**Goal:** Wisewave **integration** bar + OctopusMind **anti-stacking** bar.

| Step | Action | Pass criteria |
|------|--------|----------------|
| 2a | Read **main reflection** then **header strips** (when present) in order | Feels like **one conversation**: continuity clarifies thread; pattern/optional deepen without **pasting** a second product |
| 2b | **Stitched test** | Continuity does not feel **arbitrarily attached**; embodiment does not feel like **advice bolted on** after a separate “analysis” (see proof spec **integration failure signs**) |
| 2c | **Main body** | Reflection does not **narrate** “first / second / third layer” or meta **system** language (see Wisewave **bad examples**: system-present, utility-like) |
| 2d | **Optional:** screen reader | Support region (`role="group"`) announces a **single** grouped cue area without changing visual weight |

**Fail if:** user thinks “the app added **three different layers** to my turn” (Wisewave **quality bar §1**).

---

### Pass 3 — Ordinary life moments

**Goal:** Proof spec **`everyday_usefulness_rules.valid_when`**; not only long articulate reflections.

| Step | Action | Pass criteria |
|------|--------|----------------|
| 3a | **Short / ordinary** user messages (e.g. brief self-blame, small pressure, uncertainty, relational sting — see G addendum §5) | Loop still **lands**; support feels **receivable** without **more steps** or **more structure** to process |
| 3b | **Invalid check** | Does **not** feel more useful **only** because the system is **doing more** or showing **workflow** (see `invalid_when` in proof spec) |

**Fail if:** “everyday usefulness” shows up as **extra guidance surface** or **management tone** (OctopusMind **utility / management drift**).

---

### Pass 4 — Anti-expansion & anti-presence

**Goal:** OctopusMind **anti-expansion** + proof spec **`anti_presence_rules`**.

| Check | Pass criteria |
|-------|----------------|
| Surface | **No** new panels, workflow chrome, or **system narration** explaining the loop (G0 should add **no** visible sections beyond existing strips) |
| Usefulness | Improvement feels like **easier to receive / clearer**, not **more apparatus** |
| Comparison | Vs Milestone F memory: product does **not** feel **more system-forward** or **more managerial** solely because of G |

**Fail if:** coherence is achieved by **stacking** more visible product mass (proof spec **`show_hide_rules.hide_or_do_not_change_if`**).

---

### Pass 5 — Reflection-first & silence / restraint

**Goal:** Addendum **trust / restraint** + proof **`reflection_first_rule`**.

| Check | Pass criteria |
|-------|----------------|
| Order | Reading order remains: **see what’s happening → recognize thread → optional opening**; no “what should I do now?” **system** pivot |
| Silence | Turns that **should** stay quiet (no recurrence / suppressed cues) remain **valid**; G does **not** **fill** them with integration filler |
| E/F gates | Recurrence still **earned**; embodiment still **optional** and **tertiary** when present |

**Fail if:** integration **reduces** silence or **elevates** continuity/embodiment over reflection.

---

### Pass 6 — Founder demo (integration story)

**Goal:** Map **`founder_demo_requirements`** in proof spec + addendum **§9**.

**Minimum beats (can compress like F Pass 5):**

1. **Ordinary life moment** in user text.  
2. **Reflection** lands clearly in main message.  
3. **Last insight** (when applicable) clarifies **familiar thread** without dominating.  
4. **Pattern + optional response** (when emitted) stay **optional** and **under** reflection’s center of gravity.  
5. **Quiet beat:** weakening or non-eligible turn → **no** forced **extra** integration behavior.  
6. Narrate in one sentence: **“One light arc — not a utility product.”**

**Pass if:** founder can say **usable, coherent, still light, not coaching/management** without heavy explanation.

---

### Pass 7 — EN / ZH baseline parity

**Goal:** Proof spec **`parity_rule`** + Wisewave **tone asymmetry** watch.

| Step | Action | Pass criteria |
|------|--------|----------------|
| 7a | Repeat a **short arc** with **Chinese** user input | Same **posture**: reflection-first, optional strips, no commanding / utility drift in ZH |
| 7b | Compare **feel** to EN beat | ZH not **heavier, more explanatory, or more settled** in a way that breaks **parity** (flag **watchpoint** if minor, **fail** if category shifts) |

**Fail if:** one language reads **instructional / utility** while the other stays **optional / light**.

---

### Pass 8 — Regression sniff (Milestones E / F)

**Goal:** G did not break E/F substrate.

| Check | Pass criteria |
|-------|----------------|
| F | `recurrence_cue` / `embodiment_cue` gating and debug **still** align with F QA expectations when F enabled |
| E | Continuity / Last insight behavior **not** rewritten by G appendix in a way that **over-surfaces** or **breaks** E4-style expectations |
| UI | Pattern + Optional response **order** and **hydration** behavior **unchanged** except for intended **semantic grouping** |

**Fail if:** a clear **regression** in recurrence, embodiment, or continuity **caused by** G changes.

---

## 4. Evidence capture template (per pass / session)

```yaml
milestone: G
environment: hosted | local
session_id:
pass_id: 0P | 1–8
user_messages_summary:
ordinary_moment_type: brief_pressure | uncertainty | relational | other | n/a
api_snapshot:
  debug_milestone_g_build_marker: milestone_g_v1 | absent
  debug_milestone_g_integration_enabled: true | false
  debug_milestone_g_system_appendix_applied: true | false
  recurrence_cue_present: yes | no
  embodiment_cue_present: yes | no
  continuity_strip_present: yes | no
ui_loop_read:
  one_arc_coherent: pass | fail | watchpoint
  reflection_primary: pass | fail
  not_three_layers: pass | fail
  not_more_system_present_than_f: pass | fail | watchpoint
  silence_still_valid: pass | fail
category:
  utility_management_drift: absent | present
parity_en_zh: pass | fail | watchpoint
verdict: pass | revise
revise_owner: Nova | test_construction | Wisewave_copy | Tree
notes:
```

---

## 5. Verdict & Tree handoff

- **Milestone G complete (product / Tree)** only when **Wisewave-approved §11** is fully satisfied (all **seven** conditions). Lumen QA should **explicitly tick §11** in results; **do not** equate **G0 code shipped** with milestone closure.  
- **Milestone G QA pass** only if **§11 acceptance gate** is satisfied **and** Passes **0P, 1–8** pass without unresolved **category drift** (utility, management, coaching, system-over-presence).  
- **Revise:** minimal Nova issues (prompt appendix, copy, strip semantics) or adjust **test construction**; re-run affected passes only.  
- **Tree:** closure when QA + OctopusMind + Wisewave agree the **closure question** is answered **yes** and scope stayed **narrow**.

---

## 6. Results log

After runs, maintain **`docs/HC_OS_V1_Milestone_G_Lumen_QA_Results.md`** (same style as Milestone F results).

---

## Related docs

- `docs/HC_OS_V1_Milestone_F_Lumen_QA_Plan.md` — prior milestone pass shape  
- `docs/HC_OS_V1_Milestone_G_Addendum_Minimal_Integration_Everyday_Usefulness.md`  
- `docs/HC_OS_V1_Milestone_F_Execution_Addendum.md` — Successor: Milestone G  
