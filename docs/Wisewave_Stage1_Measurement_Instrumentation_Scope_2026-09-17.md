# Wisewave — Measurement-Only Instrumentation Scope (Pre–Stage 1 Gate)

**Date:** 2026-09-17  
**From:** Nova  
**To:** Tree (scope) · Lumen (evidence) · Founder (info)  
**Governed by:** Founder / Steward Response 2026-09-17 §6  
**Evidence baseline:** `docs/qa/WISEWAVE_STAGE0_BASELINE_2026-09-17.md`  
**Status:** Measurement-slice **specification authorised**. Must not change reflection experience, increase persuasion, or become a covert product experiment. **Production instrumentation deployment requires a separate decision.**

---

## 1. Purpose

Repair funnel integrity so Stage 0 / marketing reads stop confounding instrumentation defects with user behaviour — **without** shipping Stage 1 product Keep/warmth/entry experience changes.

---

## 2. Permitted scope

| # | Work item | Notes |
|---|---|---|
| M1 | Repair OAuth `signup_completed` undercount | Stage 0: 4/8 Google missing in 30d cohort join; wire or fix emission on Google (and verify Facebook/X) first-signup path only |
| M2 | Minimum pseudonymous visitor/session/user join field | Single opaque join key for funnel integrity; not a personalisation profile |
| M3 | Distinguish unique users, sessions, and event counts | Reporting contract + dictionary — no double-counting ambiguity |
| M4 | Preserve landing / referrer / campaign metadata already authorised | No new acquisition experiments |
| M5 | Tag verified internal / QA traffic | Deterministic classification only (Founder §8) |
| M6 | Instrument missing state transitions | Without logging reflection content |
| M7 | Controlled production-observation validation window | After Tree + Lumen review; separate deploy decision |

---

## 3. Explicit exclusions

- No message content, emotional labels, or derived psychological features in marketing events.
- No silent cross-device identity resolution.
- No expansion from pseudonymous measurement into personalisation.
- No Stage 1 Keep / adoption / warmth / entry-copy product behaviour.
- No covert A/B or persuasion experiment framed as “instrumentation”.

---

## 4. Conditions (Founder §6)

1. Data dictionary and purpose for each field (this doc §5 — living table).
2. Deterministic internal/QA classification (account IDs, explicit test flags, known sessions, documented operator identities — not behaviour inference).
3. Retention and access controls documented before Production enablement.
4. Tree scope review + Lumen evidence review.
5. Separate deployment decision for any Production instrumentation.

---

## 5. Data dictionary (draft — expand before code)

| Field / event | Purpose | Contains | Must not contain | Retention (draft) |
|---|---|---|---|---|
| `signup_completed` | Account creation funnel integrity | `userId` (when wired), method (`email` \| `oauth_google` \| …), timestamp | Message content; psychology labels | Per existing marketing event policy |
| `visitor_join_id` (proposed opaque) | Join landing → session → user without PII | Pseudonymous id | Email, name, message text | Align with existing cookie/session retention |
| `session_id` / event counts | Funnel denominators | Opaque ids, counters | Reflection body | Existing |
| `is_internal_qa` (or exclusion list join) | Clean external funnel reporting | Boolean / list version | Behavioural guesses | Versioned exclusion list |
| Landing / referrer / campaign | Acquisition attribution already authorised | Existing UTM/referrer fields | New psychographic segments | Existing |
| State-transition events (named TBD) | Close Stage 0 blind spots | Event name, opaque ids, result codes | Reflection content; Insight text | Existing |

**Adoption-related marketing:** when Stage 1 product later ships, use minimised `adoption_completed` + opaque `linkage_id` only — **not** raw anonymous UUID + user cuid in marketing tables (Spec §10.7). That event is **out of this measurement slice** until S6 is authorised.

---

## 6. Historical QA exclusion (Founder §8 — measurement dependency)

Lumen formalises the operational standard. Governing requirements locked now:

- verified account IDs, explicit test flags, known test sessions, documented operator identities;
- do not infer QA from unusual behaviour or low-quality conversations;
- keep raw events auditable; exclude from external-user funnel reporting;
- label exclusions; report raw and cleaned counts during transition;
- version the exclusion list; record who changed it;
- do not exclude merely because Founder contact / early tester unless session was explicitly QA;
- historical estimates that cannot be cleaned → label **uncertain**, do not silently correct.

---

## 7. Delivery sequence

1. Tree records measurement-only scope (this doc).
2. Nova implements M1–M6 behind normal deploy discipline (no Stage 1 product flags).
3. Lumen validates event emission in controlled observation.
4. Separate Production instrumentation deployment decision.
5. Re-run Stage 0 cells that were instrumentation-contaminated.

---

## 8. Authorisation state

| Item | Status |
|---|---|
| Measurement-slice specification | **Authorised** |
| Measurement Production deployment | **Separate decision required** |
| Stage 1 product code / Preview / Production experience | **Not authorised** by this workstream |
