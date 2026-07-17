# Tree Decision Record — P1 Direction, Interaction Legibility, P1.2 Strategy Engine

**Series:** Wisewave + Tree P1 governance (received Nova 2026-07-13)  
**Status:** **Complete — 4 of 4 received** (2026-07-13)  
**Nova stance:** Governance series recorded. **No P1.1 Slice 1 code, no P1.2 behavior, no Production UI** until Tree/steward explicitly opens implementation. **Authorized now:** P1.2 Design v1 document (design-only).

**Canonical memo (2/4):** Tree memo to Nova and Lumen — P1 Direction and P1.2 Reflection Strategy Engine (2026-07-11)

---

## Core principles (Tree 2/4)

```text
Legibility before interaction.
```

```text
Interaction Legibility exists to reduce uncertainty,
not to increase interaction.
```

| Layer | Answers |
|-------|---------|
| **Interaction Legibility** | What kind of thing belongs in this space? / What is this space? |
| **First Question Invitation (P1.1)** | How do I begin? |
| **Reflection Strategy Engine (P1.2)** | How should Wisewave internally respond? (invisible) |

---

## 1/4 — Interaction Legibility reframe (Tree, 2026-07-13)

Entry Examples **not discarded** — reframe as **Interaction Legibility Layer** (plain text only; not chips/buttons/cards/prompt UI/workflow).

Two uncertainties: interaction vs initiation. P1.1 = initiation only.

**Slice 1 coding held** until Tree resolves coexistence of plain-text legibility + optional one-question invitation without increasing presence.

---

## 2/4 — Memo to Nova and Lumen (Tree, 2026-07-11)

**Status:** Governance memo / design and validation direction only — **not** implementation approval, **not** Production approval.

### Track A — closed

- `5479da6` live; Lumen PASS WITH WATCHPOINTS; governance `5cc0bcc`
- No further Track A code unless new defect
- P0 observation window continues; no further P0 architecture work

### GR-1 — separate

- Independent track; no `lib/drift/rules.ts` changes
- Do not combine with P0, P1.1, Interaction Legibility, or P1.2

### P1.1 First Question Invitation — planning confirmed, coding not authorized

- Narrow purpose: help user begin when they genuinely cannot begin
- Governing line: *Wisewave may open the door, but it must not lead the user through it.*
- Allowed: one invitation, one optional first question, one opportunity, then ordinary reflection
- Not allowed: follow-up sequence, guided flow, questionnaire, coaching pattern, prompt library, mode selector, CTR/session optimization, Production UI without Tree approval
- **P1.1 Slice 1 not authorized** — Nova may not begin coding until Tree/steward explicitly requests

### Entry Examples / Interaction Legibility — deferred, not rejected

- Addresses **interaction uncertainty** (P1.1 addresses initiation)
- Hypothesis: non-interactive **interaction legibility layer** — plain text only
- Exploration boundary: no buttons, chips, cards, prompt library, prefill, workflow, mode labels, Production UI

**Example pattern (validation / QA reasoning only — NOT approved for implementation):**

```text
You can begin anywhere.

Many people begin with:

- Something on their mind
- Something they're feeling
- Something that happened
- Simply saying, "I don't know."

Or, if it is easier, Wisewave can ask one question first.
```

### Three-layer entry model (Tree/Wisewave)

```text
Interaction Legibility
  ->
First Question (optional)
  ->
Reflection Strategy Engine
  ->
Conversation
```

Product order:

```text
Recognize the space. -> Enter naturally. -> Reflect. -> Recognize yourself. -> Integrate.
```

Not more interaction — better legibility before interaction begins.

### Product validation before implementation

Tree wants evidence before deciding:

- First Question Invitation only
- Entry Examples / Interaction Legibility only
- constrained coexistence
- mutually exclusive variants

Objective:

```text
Which approach most naturally helps users understand what kind of interaction Wisewave offers while preserving Low Presence?
```

Not: which produces longer conversations.

### P1.2 Reflection Strategy Engine — design-only (formally opened)

- Canonical request doc (referenced): `WISEWAVE_P1_2_REFLECTION_STRATEGY_ENGINE_DESIGN_REQUEST_2026-07-11.md`
- Internal adaptive response layer — **invisible** postures (Mirror, Clarify, Deepen, Slow, Continue)
- Must not become chips, modes, labels, tabs, selectors, user-facing UI, RCL, or P2 Recognition Intelligence
- **Nova deliverable:** `Milestone P1.2 - Reflection Strategy Engine - Design v1` (design doc only — queued after 4/4 series unless Tree directs sooner)
- Nova must not: implement P1.2 behavior, expose postures as UI, merge P1.2 with P1.1/RCL/P2, change guardrail rules

### Nova responsibilities (2/4)

1. Keep P1.1 planning intact; do not begin coding
2. Entry Examples = deferred pending validation, not rejected
3. P1.2 = design-only
4. Prepare P1.2 Design v1 (after series complete unless Tree directs)

### Lumen responsibilities (2/4)

- P1.1: preserve F01–F11 fixture base
- Interaction Legibility: validation thinking (plain-text, non-interactive, Low Presence, no onboarding/coaching/therapy/companion drift, no retention pressure)
- P1.2: future QA fixture implications (strategy selection, suppression, transitions, guardrail/recognition conflicts, accidental visibility)
- No implementation request until Tree opens that stage

### Roadmap (Tree confirms 2/4)

| Milestone | Status |
|-----------|--------|
| P0 — Reflection Entry | Observation |
| P1.1 — First Question Invitation | Planning |
| P1.2 — Reflection Strategy Engine | Design |
| P2 — Recognition Intelligence | — |
| P3 — Living Reflection | — |
| P4 — Integration Intelligence | — |

RCL = independent track.

### Final direction

Next stage should become **more understandable**, not more interactive. **No Production behavior change** approved by this memo.

---

## 3/4 — Tree memo to Nova (design / planning only, 2026-07-11)

**Status:** Design and planning only. **No Production implementation approved.**

### Aurora calibration — three layers must remain separate

| Layer | Purpose (Aurora) |
|-------|------------------|
| **P1.1 First Question Invitation** | Helps the user **begin** |
| **Entry Examples / Interaction Legibility** | Helps the user **understand what belongs here** |
| **P1.2 Reflection Strategy Engine** | Helps Wisewave **internally** choose response posture |

**These must remain separate.**

### Current locks (reaffirmed)

1. **Track A / P0 stability** — closed (`5479da6`, `5cc0bcc`). No further code unless new defect.
2. **GR-1** — separate. No `lib/drift/rules.ts` changes. No guardrail tuning approved.
3. **P1.1** — planning only. Not a questioning system; may help begin, must not lead. **No Slice 1** until Tree/steward explicitly authorizes.
4. **Entry Examples** — deferred, not rejected. Non-interactive Interaction Legibility; plain text only. No buttons, chips, cards, prompt library, workflow, mode labels.
5. **P1.2** — design-only. Nova prepares **`Milestone P1.2 - Reflection Strategy Engine - Design v1`** (after 4/4 unless Tree directs).

### P1.2 Design v1 — required contents

- behavioral taxonomy
- selection logic
- suppression rules
- transition conditions
- interaction with Guardrail Engine
- interaction with Recognition Intelligence
- visibility boundary
- data/analytics boundaries
- QA fixture implications
- future implementation slices clearly marked as **not approved**

### Hard boundaries (Nova must not)

- implement P1.2 behavior
- expose Mirror / Clarify / Deepen / Slow / Continue as UI
- add mode chips or selectors
- merge P1.2 with P1.1, RCL, or P2 Recognition Intelligence
- change Guardrail Engine rules or `lib/drift/rules.ts`

### Aurora watchpoint (3/4)

> **"Reflection Strategy Engine"** is governance/internal language only. It must **not** be used as public product copy or user-facing UI language.

### Final direction

The next stage should **not** become more interactive. It should become **more understandable**.

---

## 4/4 — Tree memo to Lumen (validation thinking only, 2026-07-11)

**Status:** Validation thinking only. **No Production approval.**

Lumen record: `docs/qa/P1_VALIDATION_DIRECTION_INTERACTION_LEGIBILITY_AND_P1_2_QA_2026-07-13.md`

### Aurora calibration (same as 3/4)

Three layers **must remain separate**: P1.1 (begin) · Interaction Legibility (what belongs) · P1.2 (internal posture).

### Lumen scope

Prepare **validation thinking**, not implementation approval.

### P1.1 — preserve F01–F11

Must remain: one invitation, one optional first question, no follow-up, no guided intake, no questionnaire, no coaching pattern, no Production UI without Tree approval.

### Interaction Legibility — validation criteria

Evaluate plain-text examples against:

- reduces interaction uncertainty
- non-interactive
- Low Presence preserved
- not prompt UI
- not onboarding / coaching / therapy / journaling / productivity / companion framing
- no increased system presence
- no retention pressure
- understandable without becoming directive

**Validation question:**

```text
Which approach most naturally helps users understand what kind of interaction Wisewave offers while preserving Low Presence?
```

**Not:** which approach creates longer conversations.

### P1.2 — future QA fixture implications

Lumen should identify fixtures for:

- strategy selection correctness
- strategy suppression
- transitions (Mirror / Clarify / Deepen / Slow / Continue)
- conflicts with Guardrail Engine
- conflicts with Recognition Intelligence
- accidental visibility of internal strategy

**Hard boundary:** Mirror / Clarify / Deepen / Slow / Continue **invisible** — not user-facing modes, chips, labels, selectors, or UI concepts.

**Aurora watchpoint:** "Reflection Strategy Engine" = internal/governance language only — not public copy or user-facing product language.

### Final direction (4/4)

```text
Validate legibility before interaction.
Do not approve Production behavior change.
```

---

## Series completion summary (Nova)

| Track | Status | Next step |
|-------|--------|-----------|
| Track A / P0 stability | **Closed** | None unless new defect |
| GR-1 | Separate | Tree + OctopusMind after fixture review |
| P1.1 First Question | **ON HOLD** | Reconsider only after observation closes (2026-07-31) |
| Interaction Legibility | **Production observation approved** (2026-07-17 → review 2026-07-31) | Steward: Production flags + redeploy; no copy/P1.1 during window |
| P1.2 Strategy Engine | Design-only | Nova **P1.2 Design v1** doc (authorized) |
| Production | **Closed** | — |

**Nova authorized (design docs only):** ~~prepare~~ **`docs/Wisewave_Product_Milestone_P1_2_Reflection_Strategy_Engine_Design_v1.md`** — **drafted 2026-07-13**

**Nova not authorized:** P1.1 Slice 1 code, P1.2 behavior, any Production UI, GR-1 rule changes.

---

## Tree P1 handoff acceptance (2026-07-16)

Tree accepts the P1 handoff as **complete**.

| Artifact | Tree verdict |
|----------|--------------|
| P1.1 Nova implementation plan | **Accepted** — planning-ready |
| P1.2 Design v1 | **Accepted** — design-only |
| Any implementation | **Not authorized** |

### Nova hold (reaffirmed)

- P1.1 Slice 1 code
- P1.2 behavior implementation
- Interaction Legibility UI
- Production flags / UI
- GR-1 linter changes

### Next dependency chain

1. ~~**Lumen** — validation of **Interaction Legibility only**~~ **Done 2026-07-16 — PASS WITH WATCHPOINTS**
2. **Tree** — receive Lumen recommendation; decide first code move
3. **Tree** — may authorize **P1.1 Slice 1** and/or a **separate default-off plain-text legibility slice** (not combined without explicit approval)

Lumen validation scope (Interaction Legibility only):

- Plain-text legibility layer
- Reduces uncertainty about what Wisewave is doing?
- Preserves Low Presence?
- Avoids UI guidance, coaching, or workflow?
- Remains separate from P1.1 and P1.2?

**Out of scope for Lumen at this stage:** P1.1 code, P1.2 behavior, Production UI, flags, GR-1 linter changes.

---

## Lumen Interaction Legibility validation (2026-07-16)

**Verdict:** **PASS WITH WATCHPOINTS** — plain-text Interaction Legibility acceptable as product direction.

**Artifact:** `docs/qa/P1_INTERACTION_LEGIBILITY_LUMEN_VALIDATION_2026-07-16.md`

**Core recommendation to Tree:** Static plain-text layer is valid — reduces uncertainty about what belongs in Wisewave while preserving Low Presence.

**Pass applies to legibility block only** (not the P1.1 "ask one question first" line — that remains separate).

**Watchpoints if implementation authorized:** no chips/cards/buttons/prompt UI; no onboarding headings; avoid therapy/journaling framing on "feeling" line; do not merge P1.1 invitation without Tree approval; text must not persist after user types/expresses.

**Lumen recommendation for Tree next decision:**

- Authorize **P1.1 Slice 1** as first code move, **or**
- Authorize a **separate default-off plain-text legibility slice** first

If P1.1 goes first: P1.1 must not absorb legibility into an interactive prompt system.

**Nova status:** All implementation **still on hold** until Tree explicitly authorizes a slice.

---

## Related records

| Doc | Path |
|-----|------|
| P1.1 Nova plan | `docs/Wisewave_Product_Milestone_P1_1_First_Question_Invitation_Nova_Implementation_Plan_v1.md` |
| P1.1 Lumen fixtures | `docs/qa/P1_1_FIRST_QUESTION_INVITATION_LUMEN_FIXTURES_2026-07-11.md` |
| P0 stability closure | `docs/qa/P0_STABILITY_TRACK_A_DRIFT_SUPPRESSION_FALLBACK_LUMEN_PRODUCTION_QA_2026-07-11.md` |
| GR-1 fixtures (Lumen) | `docs/qa/WISEWAVE_GUARDRAIL_REVIEW_GR_1_HIGH_SEVERITY_FALSE_POSITIVE_CALIBRATION.md` |
| Real-user study | `docs/Wisewave_Real_User_Entry_Study_Easier_Start_Design_2026-07-09.md` |
| P1 addendum (locked) | `docs/Wisewave_Product_Milestone_P1_Reflection_Experience_Implementation_Addendum_v1_LOCKED.md` |
| Roadmap lock (2026-07-09) | `docs/Wisewave_Product_Milestone_Roadmap_Lock_2026-07-09.md` |
| P1.2 design request (referenced, await) | `WISEWAVE_P1_2_REFLECTION_STRATEGY_ENGINE_DESIGN_REQUEST_2026-07-11.md` |
| Lumen validation direction (4/4) | `docs/qa/P1_VALIDATION_DIRECTION_INTERACTION_LEGIBILITY_AND_P1_2_QA_2026-07-13.md` |
| P1.2 Design v1 (Nova deliverable) | `docs/Wisewave_Product_Milestone_P1_2_Reflection_Strategy_Engine_Design_v1.md` |
| Lumen Interaction Legibility validation | `docs/qa/P1_INTERACTION_LEGIBILITY_LUMEN_VALIDATION_2026-07-16.md` |
| Interaction Legibility preview slice (Tree auth 2026-07-17) | `docs/qa/P1_INTERACTION_LEGIBILITY_PREVIEW_SLICE_LUMEN_FIXTURES_2026-07-17.md` |
| Interaction Legibility Production rollout (Tree 2026-07-17) | `docs/Wisewave_Tree_Decision_P1_Interaction_Legibility_Production_Rollout_2026-07-17.md` |
