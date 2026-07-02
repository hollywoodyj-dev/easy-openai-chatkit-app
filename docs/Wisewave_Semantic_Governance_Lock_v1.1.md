# Wisewave Semantic Governance Lock v1.1

**Date:** 2026-07-03 Sydney  
**Owner:** Tree  
**Status:** Active governance lock — received 2026-07-03 via steward (supersedes v1 same day)  
**Supersedes for execution:** v1 (`docs/Wisewave_Semantic_Governance_Lock_v1.md`) and the shorthand `Identity → Category → Discovery` in Milestone S1 (`docs/Wisewave_Semantic_Implementation_Directive_v1.md`)

## Final governance decision

Wisewave Meaning-layer implementation may resume only under the following semantic governance stack:

**Identity Layer → Category Layer → Discovery Layer → Phrase Registry → Distortion Guardrails**

This replaces the weaker shorthand `Identity → Category → Discovery` for execution purposes. The first three layers define semantic order. The final two layers make the hierarchy enforceable.

## Layer definitions

### 1. Identity Layer

The immutable essence of Wisewave.

**Current approved identity anchors:**

- reflection without advice
- low-presence reflection space
- reflects rather than advises

Identity Layer language is primary on source-of-truth documents, product architecture, onboarding logic, product interior, and homepage-level positioning.

**Misclassification boundaries that must remain protected across surfaces:**

- not an assistant
- not a therapist
- not a coach

These are **not** identity anchors — they are boundary language that must stay present where role confusion is at risk. The Phrase Registry should classify them separately (see implementation plan).

### 2. Category Layer

Market-readable translation of the identity.

**Approved current bridge term:**

- Reflection AI

**Governance rule:**

`Reflection AI` is approved as Category Layer bridge language only. It may help users understand the category of the product, but it may not define Wisewave's essence. **It exists for market translation, not internal product definition.**

### 3. Discovery Layer

Search-facing and acquisition-facing language used to help users find Wisewave.

Discovery phrases must remain downstream from Identity and Category. Search or conversion performance is not sufficient reason to promote Discovery or Category language into Identity contexts.

### 4. Phrase Registry

All public semantic phrases must be assigned to:

- layer
- allowed surfaces
- prohibited surfaces
- distortion risk flags
- owner
- approval state
- expiry/review state if experimental

No new semantic phrase may be deployed publicly without registry classification.

### 5. Distortion Guardrails

Semantic guardrails prevent language from creating false role expectations.

**Immediate rejection classes:**

- therapist / treatment / diagnosis framing
- coach / mentor / advisor framing
- assistant / task-completion framing
- companion / emotional-substitution framing
- productivity / optimization framing
- instruction / prescription / advice-giving framing

Any phrase that changes user expectation of Wisewave's role, authority, emotional relationship, or intended outcome must escalate before release.

## `Reflection AI` approval

`Reflection AI` is approved with tightening:

> `Reflection AI` may be used for market translation and discovery, but may not appear as the sole or dominant definition of Wisewave on identity-sensitive surfaces.

**Required pairing rule:**

- On homepage or identity-sensitive surfaces, `Reflection AI` must not appear alone.
- If used, it must be paired with an identity anchor such as `reflection without advice`, `low-presence reflection space`, or `reflects rather than advises`.

**Distortion flags attached to `Reflection AI`:**

- assistant drift
- therapy drift
- coaching drift
- productivity drift
- emotional-support drift

If adjacent copy pulls toward any of these expectations, the phrase must escalate for governance review.

## Surface permission map

### Identity-sensitive surfaces

Identity-primary. Category language may appear only secondarily and with an identity anchor.

- homepage
- onboarding
- product interior
- source-of-truth documents
- internal product/design specs

**Rule:** Do not use `Reflection AI` as the sole or dominant descriptor.

### Acquisition-sensitive surfaces

Category and Discovery language allowed within guardrails.

- paid landing pages
- paid search modules
- SEO landing pages
- App Store metadata
- Google Play metadata
- comparison pages
- selected external explainers
- press/partner/analyst materials

**Rule:** Category and Discovery language may improve legibility, but must not create role confusion or override identity anchors. **Where surface constraints allow, identity anchors should remain present.**

## Tree-enforceable rules

1. **Identity supremacy** — No Category or Discovery phrase may override, replace, or outrank the Identity Layer in source-of-truth documents, product architecture, onboarding logic, or internal specifications.
2. **Category containment** — `Reflection AI` is approved only as a Category Layer bridge term. It cannot be used as the sole canonical definition of Wisewave.
3. **Surface access control** — Homepage, onboarding, product interior, and source-of-truth docs are identity-led. Store, paid search, comparison, SEO, and selected external materials may use category language under control.
4. **Discovery subordination** — Discovery phrases may optimize search and acquisition but must remain downstream from Identity and Category.
5. **Phrase Registry required** — No public semantic phrase ships without layer, surface permission, distortion risk classification, owner, and approval state.
6. **Distortion red lines** — Immediately reject wording that implies therapist, coach, assistant, companion, productivity tool, treatment, advice-giving, instruction, emotional substitution, or task-completion utility.
7. **Distortion budget** — If a phrase increases short-term discoverability but creates role confusion, reject it unless explicitly approved as a bounded experiment with expiry, surface limits, and measurement criteria.
8. **Meaning-layer implementation boundary** — Nova may implement only from approved registry terms and approved layer relationships. Nova may not invent, elevate, or normalize new semantic categories during implementation.
9. **Escalation trigger** — Any wording that changes user expectation of role, authority, emotional relationship, or intended outcome must escalate before release.

## Nova implementation boundary

Nova may resume only the governance/infrastructure portion of Meaning-layer implementation.

**Allowed:**

- implement semantic schema with layer fields
- implement surface permission map
- implement Phrase Registry structure
- implement prohibited/distortion phrase checks
- implement validation rules before deployment
- implement escalation path for new phrases
- use `Reflection AI` only where the surface map permits
- preserve approved identity anchors as canonical

**Not allowed:**

- change Identity Layer language without governance approval
- promote `Reflection AI` into identity contexts
- use `Reflection AI` as the sole or dominant definition on identity-sensitive surfaces
- generate unreviewed Discovery phrases into public surfaces
- use role-distorting language in UX or metadata
- treat search or conversion performance as sufficient reason to alter hierarchy
- proceed with CTA verb unification, schema category fields, store metadata, homepage IA, SEO title changes, or public copy expansion before registry/guardrail infrastructure is active

## Operational status

Meaning-layer freeze is partially lifted for governance infrastructure only.

Implementation remains frozen for public semantic expansion until:

1. Phrase Registry exists.
2. Surface permission map exists.
3. Distortion checks exist.
4. Escalation path exists.
5. Tree reviews Nova's implementation plan against this lock.

---

## Nova acknowledgment — 2026-07-03 (v1.1)

Filed same day as v1.1 receipt. **Delta from v1:**

| v1 | v1.1 |
|---|---|
| Six identity anchors (included *not an assistant/therapist/coach*) | **Three** identity anchors only |
| — | *not an assistant / therapist / coach* → **misclassification boundaries** (protected across surfaces, not identity definition) |
| Category rule: bridge only | Added: exists for **market translation, not internal product definition** |
| Acquisition rule: no role confusion | Added: **where surface constraints allow, identity anchors should remain present** |

Working interpretation unchanged otherwise:

- **Paid search:** unchanged posture — campaigns stay live under the 2-week no-touch hold (hold ≠ stop).
- **Implementation plan:** `docs/Wisewave_Semantic_Governance_Infrastructure_Implementation_Plan_v1.md` updated for v1.1 registry schema (separate `misclassification_boundary` layer for the three boundary phrases).
- **Next step:** Tree reviews implementation plan against **this lock (v1.1)** before Nova builds.
