# Wisewave — Read-Only Payment Reconciliation Plan (Stage 0)

**Date:** 2026-09-17  
**From:** Nova  
**To:** Founder / Steward · Tree · Lumen  
**Governed by:** Founder / Steward Response 2026-09-17 §7  
**Evidence baseline:** `docs/qa/WISEWAVE_STAGE0_BASELINE_2026-09-17.md`  
**Status:** Read-only verification **authorised**. Payment diagnostics remain **Stage 0 measurement work**, not payment optimisation. **Do not mutate credentials or payment configuration under this approval.**

---

## 1. Objective

Determine whether zero / sparse payment signals are **instrumentation or infrastructure unresolved** versus user disinterest — without exposing secrets and without changing pricing, plans, or checkout UX.

---

## 2. Read-only checks (Nova)

| # | Check | Method | Report as |
|---|---|---|---|
| P1 | PayPal client ID present in intended Production config | Env presence probe (boolean only) for `NEXT_PUBLIC_PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_ID` | `present` \| `missing` \| `mismatched` (public vs server) |
| P2 | Monthly / yearly plan IDs present | `NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID` · `NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID` | same |
| P3 | Sandbox flag unexpected on Production | `PAYPAL_SANDBOX` | `off` \| `on` \| `unset` (no secret values) |
| P4 | Payment button can initialise | Hosted Production UI smoke (logged-in operator) — button mounts / SDK loads | `initialises` \| `fails` + error class (no tokens) |
| P5 | `payment_button_clicked` can fire | Controlled operator click in tagged QA session | `fires` \| `does_not_fire` |
| P6 | Completion events can fire | Controlled sandbox **or** documented operator transaction only | `fires` \| `blocked` \| `not_tested` |
| P7 | PayPal ↔ DB subscription reconcile | Compare provider subscription status to `Subscription` / related rows for known operator ids | `aligned` \| `drift` \| `sparse` (counts, not PII) |
| P8 | Apple App Store path | Event + DB coverage for store subscriptions | `instrumented` \| `not_instrumented` \| `partial` |
| P9 | Google Play path | Same | same |
| P10 | Internal / operator exclusion | Confirm operator transactions excluded from external funnel per Founder §8 | `excluded` \| `leaking` \| `uncertain` |

---

## 3. Reporting rules

- **Never** paste client secrets, plan ID full strings if treated as sensitive in steward practice, access tokens, or webhook secrets into docs or chat. Prefer `present` / `missing` / `prefix-ok`.
- If Production credentials or plan configuration are **missing**, classify `payment_button_clicked = 0` as **instrumentation/infrastructure unresolved**, not user disinterest.
- Submit a **narrow remediation plan** only (what to set, who owns it) — do **not** mutate credentials under this approval.
- Keep payment work separate from SEO, Stage 1 Keep UI, and warmth.

---

## 4. Deliverable

A short reconciliation memo:

1. Checklist P1–P10 with status + evidence pointer (screenshot path or command log without secrets).
2. Classification: infrastructure gap vs true zero demand vs uncertain.
3. If gap: remediation plan (env keys to set, store webhook instrumentation, exclusion list) — no config mutation in-repo under this plan.
4. Lumen may spot-check event presence; Tree records any follow-on infra ticket scope.

---

## 5. Authorisation state

| Item | Status |
|---|---|
| Read-only verification | **Authorised** |
| Credential / plan mutation | **Not authorised** |
| Payment optimisation / pricing / checkout redesign | **Not authorised** |
| Stage 1 product experience | **Not authorised** |
