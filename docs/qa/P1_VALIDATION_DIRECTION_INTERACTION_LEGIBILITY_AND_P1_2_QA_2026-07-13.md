# P1 Validation Direction — Interaction Legibility + P1.2 QA Implications

**Date:** 2026-07-13 (Tree memo 4/4 received Nova 2026-07-13)  
**Owner:** Lumen  
**Status:** **Active validation** — Interaction Legibility only (Tree 2026-07-16)  
**Tree gate:** Pass/hold recommendation required before any P1 code authorization  
**Authority:** [Tree P1 series record](../Wisewave_Tree_Decision_P1_Interaction_Legibility_and_First_Question_2026-07-13.md)

---

## Core principle

```text
Legibility before interaction.
```

## Aurora calibration — three layers (must remain separate)

| Layer | Purpose |
|-------|---------|
| **P1.1 First Question Invitation** | Helps the user **begin** |
| **Entry Examples / Interaction Legibility** | Helps the user **understand what belongs here** |
| **P1.2 Reflection Strategy Engine** | Helps Wisewave **internally** choose response posture |

---

## Lumen scope

Prepare **validation thinking**, not implementation approval.

**Tree 2026-07-16:** Lumen may **proceed** with Interaction Legibility validation now. Deliver a clear **pass/hold** recommendation. Do **not** validate or approve: P1.1 code, P1.2 behavior, Production UI, flags, or GR-1 linter changes.

Do not request Production enablement until Tree explicitly opens that stage.

---

## P1.1 — existing fixture base

**Preserve:** `docs/qa/P1_1_FIRST_QUESTION_INVITATION_LUMEN_FIXTURES_2026-07-11.md` (F01–F11)

P1.1 must remain:

- one invitation
- one optional first question
- no follow-up sequence
- no guided intake
- no questionnaire
- no coaching pattern
- no Production UI without Tree approval

---

## Interaction Legibility — validation criteria

Evaluate whether **plain-text** examples:

| Criterion | Pass intent |
|-----------|-------------|
| Reduce interaction uncertainty | User understands what can be brought into the space |
| Remain non-interactive | No tap targets, chips, cards, prefill, workflow |
| Preserve Low Presence | Visually and experientially quieter than conversation |
| Do not become prompt UI | Not a prompt library or suggestion menu |
| Do not feel like onboarding | No wizard, steps, or “getting started” framing |
| Category boundary | Not coaching, therapy, journaling, productivity, or companion |
| System presence | No increase vs current P0 empty state |
| Retention pressure | No nag, repeat push, or return-loop amplification |
| Directive quality | Understandable without telling user how to reflect |

### Validation question (Tree)

```text
Which approach most naturally helps users understand what kind of interaction Wisewave offers while preserving Low Presence?
```

### Not the validation question

```text
Which approach creates longer conversations?
```

### Reference pattern (validation / QA reasoning only — NOT implementation approved)

```text
You can begin anywhere.

Many people begin with:

- Something on their mind
- Something they're feeling
- Something that happened
- Simply saying, "I don't know."

Or, if it is easier, Wisewave can ask one question first.
```

---

## P1.2 Reflection Strategy Engine — future QA implications

Lumen should identify fixture implications for (when Tree opens implementation):

| Area | QA focus |
|------|----------|
| Strategy selection correctness | Right internal posture for turn context |
| Strategy suppression | Wrong posture suppressed; silence preferred when uncertain |
| Transitions | Mirror / Clarify / Deepen / Slow / Continue handoffs without user-visible mode change |
| Guardrail Engine conflicts | Strategy does not bypass or weaken drift/guardrail suppression |
| Recognition Intelligence conflicts | P1.2 does not leak into P2 user-visible recognition |
| Accidental visibility | Internal strategy never surfaces as UI, copy, debug users see, or analytics narrative |

### Hard boundary

Mirror / Clarify / Deepen / Slow / Continue must remain **invisible**.

They must **not** become user-facing modes, chips, labels, selectors, or UI concepts.

### Aurora watchpoint

> **"Reflection Strategy Engine"** is internal/governance language only. It must not appear as public copy or user-facing product language.

---

## Final direction

```text
Validate legibility before interaction.
Do not approve Production behavior change.
```

---

## Related artifacts

| Doc | Path |
|-----|------|
| P1.1 fixtures | `docs/qa/P1_1_FIRST_QUESTION_INVITATION_LUMEN_FIXTURES_2026-07-11.md` |
| Tree series (1/4–4/4) | `docs/Wisewave_Tree_Decision_P1_Interaction_Legibility_and_First_Question_2026-07-13.md` |
| P1.1 Nova plan | `docs/Wisewave_Product_Milestone_P1_1_First_Question_Invitation_Nova_Implementation_Plan_v1.md` |
| GR-1 fixtures | `docs/qa/WISEWAVE_GUARDRAIL_REVIEW_GR_1_HIGH_SEVERITY_FALSE_POSITIVE_CALIBRATION.md` |
