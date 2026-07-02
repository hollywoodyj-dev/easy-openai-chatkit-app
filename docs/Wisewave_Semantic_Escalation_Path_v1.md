# Wisewave Semantic Escalation Path v1

**Date:** 2026-07-03  
**Owner:** Tree  
**Status:** Active — part of Semantic Governance Infrastructure (Lock v1.1)

---

## Purpose

When semantic language cannot be classified, approved, or deployed under the Phrase Registry and Distortion Guardrails, it **escalates** — it does not ship by default and is not hotfixed under measurement pressure.

`npm run semantic:check` failures route here. The check runs **standalone** (not a build gate in v1).

---

## Who does what

| Role | Responsibility |
|------|----------------|
| **Proposer** (Nova, steward, Wisewave, Aurora) | Draft a registry entry: phrase, proposed layer, allowed/prohibited surfaces, distortion flags, owner, notes. Set `approval_state: "escalated"`. |
| **Tree** | Rules on layer, surface permission, approval state, and whether live copy may remain grandfathered. |
| **Aurora / Wisewave** | Category and identity questions; distortion-budget judgment when discoverability conflicts with role clarity. |
| **Nova** | Implements only **approved** registry entries. Does not invent, elevate, or normalize new semantic categories. |

---

## Mandatory escalation triggers

Escalate **before release** when any wording:

1. Changes user expectation of Wisewave's **role**, **authority**, **emotional relationship**, or **intended outcome**.
2. Pulls `Reflection AI` or adjacent copy toward a distortion flag (assistant, therapy, coaching, productivity, emotional-support drift).
3. Proposes a **bounded experiment** — requires expiry date, surface limits, and measurement criteria (Distortion budget, Lock rule 7).
4. Cannot be classified into Identity, Misclassification boundary, Category, or Discovery without ambiguity.
5. Fails `semantic:check` (distortion hit, pairing rule, expired experimental entry).

---

## Workflow

1. **Proposer** adds or updates entry in `lib/semantic-governance/phrase-registry.json` with `approval_state: "escalated"`.
2. **Proposer** opens escalation to Tree (agent task board, steward message, or governance doc note) with: phrase, proposed layer, surfaces, distortion flags, live location (URL/file), and why classification is unclear.
3. **Tree** (+ Aurora/Wisewave when identity/category is in question) returns: `approved` | `rejected` | `experimental` (with review date) | remain `escalated`.
4. **Nova** updates registry only — **no public copy change** unless Tree explicitly approves a copy change outside the meaning freeze.
5. Re-run `npm run semantic:check`. Errors must clear or remain routed to escalation; warnings (escalated inventory, acquisition identity-anchor gaps) are reported, not silently ignored.

---

## Approval states

| State | Meaning |
|-------|---------|
| `approved` | May appear on allowed surfaces per registry. Grandfathered live inventory is `approved` for classification only — **not permanent semantic endorsement** (Tree 2026-07-03). |
| `experimental` | Bounded use only; `review` date required. Expired experimental entries **fail** `semantic:check`. |
| `escalated` | Pending Tree ruling. Live copy may remain; warning emitted until resolved. |
| `rejected` | Must not appear on public surfaces. If live, schedule removal when meaning freeze lifts. |

---

## What Nova must not do under escalation

- Patch public copy to make `semantic:check` pass without Tree approval.
- Promote Discovery or Category language into Identity contexts to resolve a warning.
- Treat search or conversion performance as sufficient reason to alter hierarchy.

---

## Related artifacts

- `docs/Wisewave_Semantic_Governance_Lock_v1.1.md`
- `lib/semantic-governance/phrase-registry.json`
- `npm run semantic:check` → `scripts/semantic-governance-check.cjs`
- ZH parity follow-up: `docs/Wisewave_Semantic_Governance_ZH_Parity_Followup.md`
