# Wisewave Semantic Governance — ZH Distortion Check Parity (Follow-up Placeholder)

**Date:** 2026-07-03  
**Owner:** Nova  
**Status:** Placeholder — **not implemented in v1** (Tree condition 5)

---

## Tree ruling

> ZH distortion checks wait until EN is stable, but Nova should leave a documented ZH parity follow-up placeholder.

English distortion patterns ship in `lib/semantic-governance/distortion-check.ts`. Chinese marketing copy exists on some surfaces; ZH guardrails are **not** scanned by `semantic:check` v1.

---

## Follow-up scope (when Tree clears EN-stable gate)

1. **Inventory ZH public phrases** — same Phrase Registry layer/surface classification as EN entries.
2. **Add ZH distortion pattern sets** for the six rejection classes (therapist/treatment, coach/advisor, assistant/task, companion/emotional, productivity, advice/instruction) with negation/boundary allowlists matching EN behavior.
3. **Extend `validate-marketing-copy.ts`** to scan ZH copy sources (identify files: marketing pages, FAQ, store metadata if localized).
4. **Vitest fixtures** — good/bad ZH lines mirroring EN test cases in `distortion-check.test.ts`.
5. **Report** — Tree review before ZH patterns affect pass/fail (recommend warn-only first pass, same as acquisition identity-anchor warnings in EN v1).

---

## EN stability criteria (proposed for Tree confirmation)

- `npm run semantic:check` passes on live EN marketing copy without distortion errors.
- Escalated EN inventory items resolved or explicitly grandfathered.
- At least one hosted observation cycle with no new EN distortion regressions from `semantic:check`.

---

*Nova — placeholder only; no ZH patterns implemented in Semantic Governance Infrastructure v1.*
