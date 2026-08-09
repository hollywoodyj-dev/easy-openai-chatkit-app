# Wisewave Product Milestone P1-FMI

# First Mild Insight

## Nova Implementation Addendum v1.1

**Status:** Locked for Internal Implementation  
**Product:** Wisewave  
**Milestone ID:** P1-FMI  
**Milestone Name:** First Mild Insight  
**Document Type:** Nova Implementation Addendum  
**Owner:** Tree  
**Product Authority:** Founder / Wisewave  
**Implementation:** Nova  
**Semantic Review:** Aurora — PASS  
**Boundary Review:** OctopusMind — PASS WITH REQUIRED CONTRACT TIGHTENING, INCORPORATED  
**QA:** Lumen  
**Date:** 2026-08-05  

## Current Authority State

```text
PRODUCT DIRECTION APPROVED
DESIGN-LOCK AMENDMENT v1.1 INCORPORATED
NOVA INTERNAL IMPLEMENTATION AUTHORIZED
INTERNAL-ONLY
DEFAULT-OFF
EN + ZH
HOSTED PREVIEW NOT AUTHORIZED
ANALYTICS IMPLEMENTATION NOT AUTHORIZED
PRODUCTION HOLD
```

Nova may implement this milestone locally and in internal-only development environments.

Nova may not:

- deploy a hosted Preview
- expose the milestone to a public or QA cohort
- enable Production
- implement analytics
- add a visible insight surface
- modify Entry Legibility, Light Entry Invitation, P1.1, P1.2, Recognition Intelligence, Pattern Visibility, continuity, memory, homepage, subscription, or account flow

Hosted Preview requires a separate Tree gate after Nova returns the complete internal evidence pack defined in Section 32.

## Implementation Oath

Do not create an insight feature.  
Create the earliest moment in which reflection becomes meaningfully clearer.

First Mild Insight is a **response-quality threshold** inside `main_reflection`.  
It is not a visible product object, milestone, achievement, score, card, memory item, pattern label, or engagement event.

## Governing Product Rule

Offer enough clarification for recognition, but not enough interpretation to take authorship away.

## Scope Lock (v1)

- Once per **conversation**, on the earliest eligible reflective user turn
- Not account-level / lifetime / device
- Flag: `ENABLE_P1_FIRST_MILD_INSIGHT` (server, default-off)
- Visible surface: existing `response.main_reflection` only
- No schema migration unless Tree separately approves
- No analytics in this gate

## State Model

```ts
type FMIState =
  | "not_evaluated"
  | "deferred_insufficient_signal"
  | "deferred_missing_context"
  | "suppressed_safety"
  | "suppressed_out_of_scope"
  | "rendered";
```

Weak openings must not permanently close eligibility. `rendered` prevents a second FMI in the same conversation.

## Visible Response Contract

- 1–3 concise sentences preferred
- Sentence 1: accurate mirror; Sentence 2: one grounded relationship; optional Sentence 3: light clarification
- No headings such as “Your Insight” / “Pattern Detected”

## Technical Placement

- Preferred surface: existing `POST /api/chat/turn` generation pipeline
- Internal operational metadata only (`wisewave_p1_fmi` on message metadata)
- Two-stage safety (pre-eligibility + post-generation validator)
- Prefer baseline when validator fails / baseline already lands cleanly (no permanent double-generation in Production architecture)

## During FMI (secondary layers)

Hide: Last Insight, Pattern Surfacing, Soft Continuity; Micro Awareness hide by default; Next Step suppression preferred. Quiet completion — no continuation CTA.

## Rollout Position

Current position: **Nova internal implementation** (this gate closed 2026-08-05).  
Next Tree gate: Hosted Preview authorization after Section 32 pack.

## Nova deliverables

See `docs/qa/P1_FMI_NOVA_INTERNAL_EVIDENCE_PACK_2026-08-05.md`.

## Final Nova Directive

Do not create an insight feature.  
Create the earliest moment in which reflection becomes meaningfully clearer.  
Use the existing `main_reflection`. Add one grounded relationship. Prefer baseline when baseline already lands cleanly. Stop before explanation becomes authority.

## Final Product Line

The first value of Wisewave should not feel like being told something new. It should feel like recognising something that was already there.

---

**Authoritative full body:** Tree-delivered lock paste (2026-08-05) held by steward / Tree records (`AURORA_P1_FMI_*`, `OCTOPUSMIND_P1_FMI_*`, `TREE_P1_FMI_QUALITY_REVISION_*`, `WISEWAVE_P1_FMI_DESIGN_LOCK_AMENDMENT_v1_1_*`). This file is the in-repo operational lock + pointer for Nova/Lumen.
