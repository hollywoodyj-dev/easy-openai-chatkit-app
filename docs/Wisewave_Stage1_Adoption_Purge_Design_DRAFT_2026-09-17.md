# Wisewave — Stage 1 Adoption Audit Purge Design (DRAFT)

**Date:** 2026-09-17  
**Author:** Nova  
**To:** Founder / Steward · privacy/security review · Tree · Lumen  
**Governed by:** Founder Decision 1.2.3 (maximum 90-day operational retention for anonymous identifier on adoption audit record)  
**Parent spec:** `docs/Wisewave_First_Conversation_Return_Mechanism_Stage1_Interaction_Spec_v1_DRAFT.md` §10.5 · §10.10  
**Status:** **DESIGN ONLY** · no purge job code authorised under Stage 1 product gate  
**Note:** Product governance, not a substitute for jurisdiction-specific legal review. 90 days is an **operational maximum**, not a mandate to retain every record for 90 days.

---

## 1. Record in scope

`AdoptionIntent` (proposed) fields allowed:

| Field | Purpose |
|---|---|
| `anonymousId` | Source anonymous identifier (linkage — purge target) |
| `targetUserId` | Destination account identifier |
| `conversationId` | Selected reflection identifier |
| `consentAt` | Consent timestamp |
| `noticeVersion` | Notice / policy version shown |
| `status` / `failureReason` | Outcome / error code |
| `completedAt` | Success/failure completion time |
| Integrity fields as added | Prove or repair transfer only |

**Must never contain:** message content; `user_return_anchor` text; emotional, psychological or safety labels; model insights, summaries or inferred themes; marketing segmentation.

---

## 2. Retention clock

| Status | Clock start | Action at/before 90 days |
|---|---|---|
| `succeeded` | `completedAt` | Destroy or irreversibly de-identify `anonymousId` linkage |
| `failed` | `consentAt` (or `completedAt` if set) | Same |
| `pending` expired | `consentAt` | Prefer earlier purge when intent TTL ends (proposed 30 minutes) — purpose ended |

**Earlier destruction:** when purpose has ended (e.g. reconciliation complete, intent expired unused), purge sooner unless a documented legal or security hold applies.

---

## 3. De-identification method (preferred)

Do **not** delete the entire row if operational counts still need outcome history. Prefer irreversible de-identification:

1. Replace `anonymousId` with a constant sentinel `purged` **or** a one-way HMAC truncated digest of `(anonymousId + server pepper)` **without** retaining the pepper mapping that would re-identify — prefer sentinel + nulling any secondary anonymous indexes.
2. Set `anonymousIdPurgedAt` (or equivalent metadata) for verification.
3. Retain: `conversationId` (if still needed for ownership reconciliation against live Conversation), `targetUserId`, `status`, `consentAt`, `noticeVersion`, `completedAt`, `failureReason`.
4. If conversation ownership reconciliation no longer needs `conversationId` ↔ anonymous join, conversation id may remain (it is not the anonymous cookie); do not re-store anonymous cookie values.

**Aggregate path:** daily/weekly counters (`adoption_succeeded_count`, `adoption_failed_count` by method) may be retained indefinitely as non-identifying operational metrics.

---

## 4. Insight leave-behind (Decision 1.1 — related lifecycle)

Separate from `AdoptionIntent` purge, but required by the same Founder response:

After successful adoption:
1. Mark left-behind `Insight` rows `isContinuityEligible = false` immediately.
2. Do not merge, copy, relink or recreate from adoption metadata.
3. Keep only for remaining lawful anonymous-retention purpose.
4. Destroy or irreversibly de-identify when that purpose ends.
5. If the source anonymous reflection is deleted, apply the same deletion/de-identification policy to derived Insight rows.

Purge job for Insights is **out of AdoptionIntent job** but must be listed on the same verification checklist when anonymous conversation deletion runs.

---

## 5. Purge job design

| Item | Proposal |
|---|---|
| Name | `adoption-intent-anonymous-purge` |
| Trigger | Scheduled daily (Vercel cron or equivalent) + manual admin dry-run |
| Selection | Rows where `anonymousId` is not already purged **and** clock age ≥ 90 days; **or** `pending` past intent TTL |
| Dry-run | Log counts only; no writes |
| Write mode | Batch update de-identify; transactional per row |
| Idempotence | Re-running on purged rows is a no-op |
| Failure | Alert on job error, partial batch abort, or verification mismatch |

**Access:** job credentials and any admin dry-run path are internal-only; audited.

---

## 6. Failure monitoring

| Signal | Severity |
|---|---|
| Job did not run in 36 hours | High |
| Job exit non-zero | High |
| Rows still holding live `anonymousId` past 90 days | High |
| Unexpected field containing message-like payload length | Critical (schema drift / misuse) |

---

## 7. Verification path

After each successful purge run:

1. **Count check:** `SELECT count(*) WHERE anonymousId NOT IN ('purged', …) AND age > 90d` → must be 0 (except documented legal holds).
2. **Sample check:** N random purged rows — confirm `anonymousId` sentinel, no message/anchor fields present on model.
3. **Aggregate integrity:** succeeded/failed counts for the period still sum.
4. **Lumen evidence:** attach dry-run + one live-run report (non-Production first) before any Production purge deploy decision.
5. **Tree:** scope the job as a separate deployment unit from Stage 1 product Keep UI.

---

## 8. Authorisation state

| Item | Status |
|---|---|
| This design | Submitted |
| Privacy/security review | Pending |
| Purge job implementation | Not authorised by Stage 1 product gate; may ship with S6 only after semantic PASS + Tree + Preview gates as applicable |
| Production purge enablement | Separate deployment decision |
