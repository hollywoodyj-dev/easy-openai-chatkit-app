# Wisewave Semantic Implementation Directive v1.0

**Owner:** Tree
**Contributors:** Wisewave · Aurora · Nova · Lumen
**Status:** Execution Directive (Post Semantic Constitution) — received 2026-07-02 via steward
**Milestone framing:** Milestone S1 — Semantic Governance Implementation

> Guiding principle: **Build the measurement layer. Prepare the implementation layer. Freeze the category layer until governance is formally locked.** Implementation must never outrun semantic governance.

---

## Priority 1 — Execute immediately

**A. Behaviour measurement** — GA4 events for `first_reflection_started`, `first_reflection_completed`. These become the primary behavioural KPIs for paid-search-linked acquisition and reflection entry quality. Ads should optimize toward actual reflection behaviour rather than landing-page proxies.

**B. Retention visibility** — `day_7_return`. Measure retention directly; current evidence suggests retention, not acquisition alone, is a primary constraint.

**C. Measurement integrity** — end-to-end consistency across GA4, Google Ads, internal database events, behavioural event naming and parity. Measurement integrity takes priority over campaign expansion.

**D. CTA audit** — full audit of every public CTA (Enter Wisewave / Start a Reflection / Try / Download …). Deliverable: audit only. No wording changes, no optimization, no implementation.

**E. Technical preparation** — Nova may prepare SoftwareApplication schema, structured-data improvements, technical Knowledge Graph support. **No category wording locked inside structured data** until governance approval is complete.

## Priority 2 — Freeze (no implementation)

- **Website:** no homepage information-hierarchy restructure, no site IA change, no Reflection AI hub or hub-equivalent architecture.
- **App Store:** no title / subtitle / primary description hierarchy changes.
- **Google Play:** no naming, category positioning, metadata hierarchy, or store-facing semantic ordering changes.
- **Public metadata:** freeze SEO titles that alter category framing, primary meta descriptions that harden category language, canonical category wording — until the Semantic Registry is operational and approved.

## Priority 3 — Governance decision required (Tree to organize review)

- **Decision A — Semantic hierarchy:** Identity → Category → Discovery (constitutional; governs all public implementation).
- **Decision B — Bridge category approval:** whether "Reflection AI" is approved as bridge / search-facing / AI-search-facing category **without becoming identity language**.
- **Decision C — Surface strategy:** where "Reflection Without Advice", "Reflection AI", and "low-presence reflection space" may appear and in what role (website, App Store, Google Play, search landing pages, comparison pages, external materials).
- **Decision D — Semantic governance activation:** operational use of Identity Layer, Category Layer, Discovery Layer, Phrase Registry, Distortion Budget Framework before large-scale semantic expansion.

## Nova working rule (three states)

| State | Examples | Action |
|-------|----------|--------|
| **A — Measurement** | analytics, GA4, tracking, retention instrumentation, behavioural events | Proceed immediately |
| **B — Infrastructure** | schema, JSON-LD, technical prep, CTA inventory, event plumbing | Proceed, avoid semantic commitments |
| **C — Meaning** | homepage wording, category language, store naming, hub structure, identity phrasing, public semantic hierarchy | Pause and escalate to Tree + Aurora |

**Escalation rule:** Nova escalates immediately if implementation requires choosing category language, changing identity language, introducing new public terminology, modifying semantic hierarchy, changing app-store positioning, introducing Reflection AI as primary identity, or altering public-facing language that could stabilize meaning at scale. Nova never makes these decisions independently.

**Implementation workflow:** Proposal → Semantic Registry Check → Distortion Budget Review → Tree Governance Approval → Nova Implementation → Lumen Validation → Aurora Market Observation → Revision. Implementation must not skip governance.

**Success metrics:** (1) Implementation — event coverage, tracking integrity, schema completion, CTA inventory completion, instrumentation readiness. (2) Behaviour — first reflection started/completed, day-7 return, reflection continuation quality. (3) Governance — frozen items respected, escalations raised, semantic requests paused correctly, zero unauthorized category decisions.

**Operational chain:** Wisewave defines identity truth · Aurora governs semantic language · Tree approves sequencing and decisions · Nova implements systems and instrumentation · Lumen validates evidence and QA.

**Final instruction:** until Tree formally ratifies the Semantic Constitution, Semantic Registry, and Distortion Budget Framework — measurement may evolve, infrastructure may prepare, implementation may be staged, **meaning must remain frozen**.

---

## Nova compliance status — 2026-07-02 (same day as receipt)

Priority 1 was implemented earlier today under Aurora's interim reply (commits `9e7cb2e`, `1f3f5a3`), before this directive formalized it. Status against each item:

| Item | Status | Evidence |
|------|--------|----------|
| **1A** GA4 behaviour events | **DONE** | `/api/chat/turn` returns `conversion_events`; `/chat` mirrors `first_reflection_started`/`_completed` to GA4 with browser ads-attribution context (`skipBeacon` — DB remains source of truth). Pending steward console step: after first production fire, mark GA4 key event → import to Google Ads → consider replacing `paid_landing_primary_cta_click` as primary conversion. |
| **1B** `day_7_return` | **DONE** | Server-side on chat turn: first reflective turn ≥ 7 days after account creation, once-per-user dedupe, registered accounts only; GA4-mirrored. |
| **1C** Measurement integrity | **DONE / ongoing watch** | Event names identical across GA4, DB (`MarketingConversionEvent`), and catalog (`lib/wisewave-conversion-tracking.ts`). Checkout events carry server-verified `userId` (JWT never sent to GA4 or stored in metadata). OAuth `signup_completed` undercount fixed. Known history note: GA4 stream history restarted 2026-07-02 (`G-XCZJHENLZ8`) after dead-stream fix; DB events are the continuous record. |
| **1D** CTA audit | **DONE (audit only)** | `docs/Wisewave_CTA_Audit_2026-07-02.md` — five verb families mapped by surface; zero wording changes; change surface pre-mapped for a one-pass implementation after verb lock. |
| **1E** Technical preparation | **PREPARED, not mounted** | `components/wisewave-site/SoftwareApplicationJsonLd.tsx` — facts-only fields; `applicationCategory` / `description` / `keywords` deliberately absent; file self-documents the freeze. |

**Priority 2 freeze:** respected — no website IA, store metadata, or category-framing changes made or staged.

**Priority 3:** no Nova action; awaiting Tree's governance review outcomes (Decisions A–D).

**Governance metrics to date:** frozen items respected: all; escalations raised: 1 (category-handle hierarchy, via steward → Wisewave/Aurora, 2026-07-02); unauthorized category decisions: 0.
