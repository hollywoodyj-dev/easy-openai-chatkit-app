# Wisewave Semantic Governance Lock v1

**Date:** 2026-07-03 Sydney
**Owner:** Tree
**Status:** **Superseded by v1.1** — see `docs/Wisewave_Semantic_Governance_Lock_v1.1.md`
**Supersedes for execution:** the shorthand `Identity → Category → Discovery` in Milestone S1 (`docs/Wisewave_Semantic_Implementation_Directive_v1.md`)

## Final governance decision

Meaning-layer implementation may resume only under this stack:

**Identity Layer → Category Layer → Discovery Layer → Phrase Registry → Distortion Guardrails**

The first three layers define semantic order; the final two make the hierarchy enforceable.

## Layer definitions

### 1. Identity Layer — the immutable essence

Approved identity anchors:

- reflection without advice
- low-presence reflection space
- reflects rather than advises
- not an assistant
- not a therapist
- not a coach

Identity language is primary on: source-of-truth documents, product architecture, onboarding logic, product interior, homepage-level positioning.

### 2. Category Layer — market-readable translation

Approved bridge term: **Reflection AI** — Category Layer bridge language **only**. It may help users understand the category; it may not define Wisewave's essence.

### 3. Discovery Layer — search/acquisition-facing language

Must remain downstream from Identity and Category. Search or conversion performance is **not** sufficient reason to promote Discovery/Category language into Identity contexts.

### 4. Phrase Registry

Every public semantic phrase must be assigned: layer · allowed surfaces · prohibited surfaces · distortion risk flags · owner · approval state · expiry/review state (if experimental). No new public phrase without registry classification.

### 5. Distortion Guardrails

Immediate rejection classes:

- therapist / treatment / diagnosis framing
- coach / mentor / advisor framing
- assistant / task-completion framing
- companion / emotional-substitution framing
- productivity / optimization framing
- instruction / prescription / advice-giving framing

Any phrase that changes user expectation of role, authority, emotional relationship, or intended outcome must escalate before release.

## `Reflection AI` approval (with tightening)

> May be used for market translation and discovery, but may not appear as the sole or dominant definition of Wisewave on identity-sensitive surfaces.

**Pairing rule:** on homepage or identity-sensitive surfaces, `Reflection AI` must not appear alone — pair with an identity anchor (e.g. *reflection without advice*, *low-presence reflection space*, *reflects rather than advises*).

**Distortion flags attached:** assistant drift · therapy drift · coaching drift · productivity drift · emotional-support drift. Adjacent copy pulling toward these expectations → escalate.

## Surface permission map

**Identity-sensitive (identity-primary; category only secondary + anchored):** homepage · onboarding · product interior · source-of-truth docs · internal product/design specs. Do not use `Reflection AI` as sole/dominant descriptor.

**Acquisition-sensitive (category/discovery allowed within guardrails):** paid landing pages · paid search modules · SEO landing pages · App Store metadata · Google Play metadata · comparison pages · selected external explainers · press/partner/analyst materials. Must not create role confusion or override identity anchors.

## Tree-enforceable rules (summary)

1. **Identity supremacy** — no Category/Discovery phrase outranks Identity in source-of-truth surfaces.
2. **Category containment** — `Reflection AI` is bridge only, never sole canonical definition.
3. **Surface access control** — identity-led vs acquisition surfaces per map above.
4. **Discovery subordination** — acquisition language stays downstream.
5. **Phrase Registry required** — no public phrase ships unclassified.
6. **Distortion red lines** — immediate rejection classes above.
7. **Distortion budget** — discoverability gains that create role confusion are rejected unless approved as bounded experiments (expiry + surface limits + measurement).
8. **Implementation boundary** — Nova implements only from approved registry terms; never invents/elevates/normalizes new semantic categories.
9. **Escalation trigger** — any wording changing role/authority/relationship/outcome expectation escalates before release.

## Nova implementation boundary

**Allowed (governance infrastructure portion of Meaning layer):**

- semantic schema with layer fields
- surface permission map implementation
- Phrase Registry structure
- prohibited/distortion phrase checks
- validation rules before deployment
- escalation path for new phrases
- `Reflection AI` usage only where surface map permits
- preserve approved identity anchors as canonical

**Not allowed:**

- change Identity Layer language without governance approval
- promote `Reflection AI` into identity contexts
- sole/dominant `Reflection AI` on identity-sensitive surfaces
- unreviewed Discovery phrases on public surfaces
- role-distorting language in UX or metadata
- treat search/conversion performance as reason to alter hierarchy
- **CTA verb unification, schema category fields, store metadata, homepage IA, SEO title changes, or public copy expansion before registry/guardrail infrastructure is active**

## Operational status

Meaning-layer freeze **partially lifted for governance infrastructure only**. Public semantic expansion remains frozen until:

1. Phrase Registry exists.
2. Surface permission map exists.
3. Distortion checks exist.
4. Escalation path exists.
5. **Tree reviews Nova's implementation plan against this lock.**

---

## Nova acknowledgment — 2026-07-03

Filed same day. Working interpretation:

- **Paid search:** unchanged posture — campaigns stay live under the 2-week no-touch hold (hold ≠ stop). Existing paid LP copy predates the lock and is on acquisition-sensitive surfaces; no copy changes will be made under the freeze either way.
- **Existing shipped surfaces** (homepage, `/lp/*`, SEO landings, store copy doc) already lead with identity anchors ("reflection without advice", "quieter space…"); `Reflection AI` currently appears in acquisition surfaces (`/lp/ai-reflection`, `/reflection-ai` SEO page) — consistent with the surface map. No retro-changes without registry classification.
- **Next Nova deliverable:** implementation plan for the five prerequisites (registry structure, surface map, distortion checks, escalation path, validation rules) submitted to Tree for review **before** building — per operational status item 5.
- All prior S1 classifications (Measurement / Infrastructure / Meaning) remain in force; this lock refines what "Meaning" work is admissible.
