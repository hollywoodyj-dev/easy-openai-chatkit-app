# P1-FMI Nova Internal Evidence Pack (Section 32) — Tree Review Revision

**Date:** 2026-08-06 (revised for Tree Section 32 Evidence Review)  
**Prior pack date:** 2026-08-05  
**Related Tree task:** `cmsevanmy0000ky04n0b4x13d` — TREE: P1-FMI internal implementation authorized, Preview hold  
**Tree acknowledgement:** `docs/TREE_TO_NOVA_P1_FMI_SECTION_32_EVIDENCE_REVIEW_2026-08-06.md`

**Status**

```text
INTERNAL IMPLEMENTATION COMPLETE
SECTION 32 EVIDENCE REVIEW OPEN (this pack)
HOSTED PREVIEW NOT YET AUTHORIZED
PRODUCTION HOLD
ANALYTICS HOLD
NO DEPLOYMENT AUTHORIZED
```

---

## 1. Files changed

| Path | Role |
|------|------|
| `lib/wisewave-p1-first-mild-insight.ts` | Flag resolution (incl. independent Preview allow), eligibility, appendix, validator, metadata |
| `lib/wisewave-p1-first-mild-insight.test.ts` | Unit evidence for Tree §32 items |
| `app/api/chat/turn/route.ts` | Appendix, finalize, secondary hide, debug, metadata commit |
| `.env.example` | `ENABLE_P1_FIRST_MILD_INSIGHT` + `P1_FMI_ALLOW_HOSTED_PREVIEW` |
| `package.json` | `npm run test:p1-fmi` |
| Locked addendum | `docs/Wisewave_Product_Milestone_P1_FMI_First_Mild_Insight_Nova_Implementation_Addendum_v1_1_LOCKED.md` |

---

## 2. Proposed Hosted Preview flag path (independent of Production)

Tree asked how Hosted Preview can be authorized while Production stays hard-blocked.

### Resolution (`resolveP1FirstMildInsightEnablement`)

| Environment | `ENABLE_P1_FIRST_MILD_INSIGHT=1` | `P1_FMI_ALLOW_HOSTED_PREVIEW=1` | Result |
|-------------|----------------------------------|--------------------------------|--------|
| Local / unset `VERCEL_ENV` | required | ignored | **enabled** |
| Vercel **Preview** | required | **required** | enabled only with both |
| Vercel **Preview** | set | absent | **blocked** |
| Vercel **Production** | any | any | **always hard-blocked** |

There is **no** Production allow key in this gate. Setting `P1_FMI_ALLOW_HOSTED_PREVIEW` on Production does **not** unlock FMI.

### After Tree chooses AUTHORIZE HOSTED PREVIEW (proposed ops)

1. Vercel **Preview** env only: set `ENABLE_P1_FIRST_MILD_INSIGHT=1` and `P1_FMI_ALLOW_HOSTED_PREVIEW=1`.
2. Leave Production unset for both keys (or explicitly `0`).
3. Steward accounts only; no public cohort; no analytics.
4. Lumen runs hosted fixtures FMI-P01→P20.
5. Production remains off until a **separate** Tree Production decision.

**No deployment is performed by Nova under the current gate.**

Debug fields: `debug_p1_fmi_blocked_on_production`, `debug_p1_fmi_blocked_on_preview`, `debug_p1_fmi_allow_hosted_preview_set`.

---

## 3. Tree Section 32 evidence matrix (12 items)

| # | Requirement | Demonstration |
|---|-------------|---------------|
| 1 | Earliest eligible-turn detection | Eligibility runs once per committed user turn; greetings/low-signal defer; first medium+ reflective turn → `eligible`. Test: greeting then later self-expression becomes eligible. |
| 2 | Weak-signal deferral (not permanent close) | `I feel bad.` → `deferred_insufficient_signal`; later turn in same conversation can still qualify. Greeting → `suppressed_out_of_scope` for that turn only. |
| 3 | Low-context advice-seeking | `Should I leave my job?` → `advice_seeking` → `deferred_missing_context` (not forced FMI). |
| 4 | Explicit document-relationship gating | Long paste without personal relationship → `deferred_missing_context`; with “I wrote this after my father…” → relationship true / may become eligible. |
| 5 | Once-per-conversation | Prior assistant `wisewave_p1_fmi.rendered=true` → later turns `suppressed_out_of_scope`. |
| 6 | Retry / regeneration / streaming / parallel idempotency | **Retry/regen:** eligibility keyed by `conversation_id + committed_user_turn_id`; reused from user/assistant metadata (`eligibility_reused`). **Streaming:** turn API is request-scoped; FMI decision is evaluated once per request before generation and finalized once on the successful assistant persist — not re-opened mid-stream. **Parallel:** best-effort via reading prior assistant `rendered` at turn start; concurrent first-eligible posts can race before metadata commit (documented honesty — no separate lock table; no psychological object invented for locking). |
| 7 | Pre + post safety dominance | Pre: `safetyOverrideActive` → `suppressed_safety`, no FMI appendix. Post: `finalizeFMIAfterGeneration` with safety/drift → `suppressed_safety`, `rendered=false`. |
| 8 | Validator rejection → baseline | Failed validator → `validator_failed_use_baseline`, `rendered=false`; response remains ordinary `main_reflection` (no second generation loop in v1). |
| 9 | EN and ZH reviewed separately | Unit fixtures: EN golden pass; ZH golden pass; ZH counselling-drift (`内心深处` / `潜意识` / `疗愈`) fail. Separate ZH appendix when `wantsChinese`. |
| 10 | Debug metadata not in future prompt / memory / continuity / pattern | Model context uses `message` text only (`openaiMessages` maps `m.message`). FMI metadata is operational (`state`, `rendered`, ids, validator booleans) — **no user text, no insight text**. Not merged into continuity/pattern extract paths. Test: metadata JSON must not contain user phrasing. |
| 11 | Analytics unimplemented | No `first_mild_insight_*` events; no FMI analytics module; no new analytics DB. |
| 12 | Clean rollback, no schema reversal | Unset flags + restart. No Prisma migration. Metadata keys inert when disabled. |

---

## 4. Integration map

| Concern | Location |
|---------|----------|
| Eligibility | `evaluateFMIEligibility` / `computeP1FirstMildInsightTurn` |
| Generation hook | FMI system appendix in `app/api/chat/turn/route.ts` |
| Validator | `validateFirstMildInsightCandidate` → `finalizeFMIAfterGeneration` |
| State | `FMIState` + `metadata.wisewave_p1_fmi` |
| Schema | **None** |

---

## 5. Confirmations

- Visible output: **`response.main_reflection` only**
- No new UI / insight field / milestone surface
- No analytics
- Safety dominant pre + post
- Untouched: Entry Legibility, Light Entry Invitation, P1.1, P1.2, Recognition, Pattern Visibility, continuity storage, user-facing memory, homepage, subscription, account

---

## 6. Unit tests

```bash
npm run test:p1-fmi
```

Includes enablement (local / preview-block / preview-allow / production hard-block), classify, eligibility, validator EN+ZH, duplicate render, retry reuse, finalize, metadata hygiene.

---

## 7. Local run

1. `.env.local`: `ENABLE_P1_FIRST_MILD_INSIGHT=1` (do not set Preview allow locally unless simulating).
2. Restart `npm run dev`.
3. Inspect `debug_p1_fmi_*` on `POST /api/chat/turn`.

---

## 8. Rollback

1. Unset `ENABLE_P1_FIRST_MILD_INSIGHT` and `P1_FMI_ALLOW_HOSTED_PREVIEW`.
2. Restart. No DB migration to reverse.

---

## 9. EN / ZH fixture targets (for Lumen hosted QA when authorized)

**EN:** avoidance may not be hardest; meaning of knowing better feels heavier.  
**ZH:** 真正让你难受的，可能不只是迟迟没有行动…（addendum §23）

---

## Final Nova line for Tree

```text
Evidence pack revised for the twelve review requirements.
Hosted Preview unlock is independent via P1_FMI_ALLOW_HOSTED_PREVIEW on Preview only.
Production remains hard-blocked. No deployment performed.
```
