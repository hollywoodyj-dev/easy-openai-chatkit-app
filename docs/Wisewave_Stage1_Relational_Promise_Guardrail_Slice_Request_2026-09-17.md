# Wisewave — Relational-Promise Guardrail Slice Request (S4)

**Date:** 2026-09-17  
**From:** Nova  
**To:** Tree (narrow scope) · Lumen (EN/ZH coverage + false-positive risk) · Founder (info)  
**Governed by:** Founder / Steward Response 2026-09-17 §5 · Stage 1 Spec §11 · Ruling §13  
**Parent spec:** `docs/Wisewave_First_Conversation_Return_Mechanism_Stage1_Interaction_Spec_v1_DRAFT.md`  
**Status:** Specification and testing of narrowing **authorised**. Production deployment **not** authorised. Warmth (S3) remains unavailable beyond offline fixtures until this guardrail passes.

---

## 1. Why this is urgent and separate

Present-tense finding (accepted by Founder): three of four Addendum §4.4 relational-promise prohibitions currently pass the live drift rules; only the ZH exact `/陪着你/` pattern is caught. This is an **existing Production boundary gap**, not merely a warmth-feature dependency.

Required order (Founder §5):
1. Tree records the narrow scope.
2. Lumen verifies EN/ZH semantic-variant coverage and false-positive risk.
3. Nova implements and tests a separate guardrail-hardening slice.
4. The slice receives its **own** deployment decision.
5. Warmth candidate stays offline-fixtures-only until the guardrail passes.

---

## 2. Narrow scope request (Tree)

| Item | Proposal |
|---|---|
| Slice id | **S4** |
| Flag | `ENABLE_RELATIONAL_PROMISE_GUARD_V2` (+ Preview allow key; Production hard-block precedent) |
| Code surface | Drift / live-suppress rules only — **no** prompt rewrite, **no** warmth appendix, **no** chat UI copy |
| Goal | Semantic-variant coverage EN/ZH for personal loyalty / emotional availability; preserve permitted product continuity |
| Out of scope | Conversational warmth enablement; FMI changes; Continue / adoption; marketing |

---

## 3. Required distinction (Founder verbatim intent)

| Class | Example | Treatment |
|---|---|---|
| Prohibited personal loyalty / emotional availability | “I am always here for you” | **Block** |
| Permitted product continuity | “You can return to this reflection later.” | **Allow** |

Discriminator: **who or what is promised** — product availability (factual) vs Wisewave’s personal presence, loyalty or exclusivity toward this user (relational promise).

Full classification table and adversarial families: Spec §11.2–11.4.

---

## 4. Lumen verification ask

Before Tree clears implementation beyond fixtures:

1. EN/ZH semantic-variant matrix for loyalty / presence / exclusivity / attachment.
2. False-positive risk on every **allowed** factual-availability negative (must not suppress product continuity lines, including locked Keep / re-entry copy that speaks about returning to a reflection).
3. Adversarial families per Spec §11.4 (paraphrase, pronoun shift, implied exclusivity, mixed factual/personal clause).
4. Blind or independent scoring ownership as Lumen prefers; raw counts required.
5. Pass/fail rule for the slice separate from S3 warmth Separation metrics.

---

## 5. Nova implementation posture (when Tree + Lumen clear code)

- Separate flag; default off; Production hard-block pattern.
- Prefer suppression/rewrite path consistent with existing drift live-suppress.
- Do not loosen warmth while testing S4.
- Unit + fixture tests for allowed vs blocked pairs in both languages.
- Debug: `relational_promise_guard_v2` hit/miss + family id.

---

## 6. Authorisation state

| Item | Status |
|---|---|
| Spec + test of narrowing | **Authorised** (Founder §5) |
| Production deployment of S4 | **Separate decision required** |
| S3 warmth beyond offline fixtures | **Blocked** until S4 passes |
| Stage 1 product Keep / Preview | Unrelated — still not authorised |
