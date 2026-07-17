# Tree Decision — P1 Interaction Legibility Production Rollout

**Date:** 2026-07-17  
**Owner:** Tree  
**Status:** **Production rollout approved** — standalone observation slice

---

## Evidence

**Implementation (Nova):** `3a228eb` on `main`; Lumen hosted Preview PASS on `8b24d1a` / `hur5l61tl` (same slice behaviour).

**Lumen QA:** `docs/qa/P1_INTERACTION_LEGIBILITY_PREVIEW_SLICE_LUMEN_QA_2026-07-17.md` — **PASS** (IL-P02–IL-P09).

**Excluded (confirmed):** no `/api/chat/turn`, system prompt, P1.1, P1.2, GR-1, or analytics changes.

---

## Tree Decision

Approve **Production rollout** for static plain-text Interaction Legibility only.

**Allowed surface:** static text above input on empty `/chat`.

**Allowed copy (EN pattern):**

```text
You can begin anywhere.

Many people begin with:

Something on their mind
Something they are feeling
Something that happened
Simply saying, "I don't know."
```

ZH parity approved for the same static pattern.

---

## Production Flag Authorization

Tree authorizes **Production** env (both required):

```text
NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY=1
NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION=1
```

**Observation rollout** — not a final product conclusion. No other P1 flags authorized.

**Rollback:** unset either key and redeploy. No DB/backend rollback.

---

## P1.1 — ON HOLD

Do **not** authorize P1.1 Slice 1 during this observation.

Interaction Legibility and P1.1 remain **separate**, **mutually exclusive** layers.

P1.1 may be reconsidered **only after** this standalone observation closes (review **2026-07-31**), and only if evidence shows legibility helps understanding but a subset still cannot initiate without Wisewave speaking first.

---

## Non-Authorizations

Light Access Links as controls, buttons, chips, cards, prompt library, mode selector, P1.1, P1.2 implementation, GR-1, analytics, backend/prompt/response/routing/memory changes.

---

## Observation Window

```text
2026-07-17 deployment → 2026-07-31 review
```

**Do not during window:** modify copy, add interactions/chips/buttons/P1.1, merge layers, optimize for clicks, expand empty-state surface.

**Primary question:** Does static Interaction Legibility reduce entry uncertainty while preserving user authorship and Low Presence?

**Do not judge by:** clicks, session length, message volume, retention uplift alone.

**Rollback immediately if:** onboarding feel, category-selection behaviour, performance pressure, lost composer primacy, P1.1 appears, backend/prompt changes.

---

## Governing Line

```text
Approve the smallest production observation.
Do not expand the entry system.
Do not authorize Wisewave to speak first yet.
```

Wisewave: *Interaction Legibility should first be allowed to prove how little is enough.*

---

## Related

| Doc | Path |
|-----|------|
| Lumen Preview QA | `docs/qa/P1_INTERACTION_LEGIBILITY_PREVIEW_SLICE_LUMEN_QA_2026-07-17.md` |
| Lumen fixtures | `docs/qa/P1_INTERACTION_LEGIBILITY_PREVIEW_SLICE_LUMEN_FIXTURES_2026-07-17.md` |
| Tree P1 series | `docs/Wisewave_Tree_Decision_P1_Interaction_Legibility_and_First_Question_2026-07-13.md` |
| Nova pre-deploy checklist | `docs/qa/P1_INTERACTION_LEGIBILITY_PRODUCTION_DEPLOY_CHECKLIST_2026-07-17.md` |
