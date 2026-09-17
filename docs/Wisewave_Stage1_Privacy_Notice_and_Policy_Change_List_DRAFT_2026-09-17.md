# Wisewave — Stage 1 Privacy Notice Draft + Policy Change List

**Date:** 2026-09-17  
**Author:** Nova  
**To:** Founder / Steward · privacy/legal review · Tree · Lumen  
**Governed by:** Founder / Steward Response — Stage 1 Specification Submission, 2026-09-17 §3 (Decision 1.2)  
**Parent spec:** `docs/Wisewave_First_Conversation_Return_Mechanism_Stage1_Interaction_Spec_v1_DRAFT.md` §10.6A · §10.9  
**Status:** **DRAFT ONLY** · not published · not a substitute for jurisdiction-specific legal review  
**Authorisation:** Drafting authorised as Stage 2 specification material. Live `/privacy` and `/legal/privacy` updates are required **before** any external Preview user is offered anonymous-to-registered adoption. Not required merely for local/synthetic or controlled internal test identities.

---

## 1. Notice versioning

| Field | Value |
|---|---|
| `noticeVersion` (stored on `AdoptionIntent`) | `ww_keep_adopt_notice_v1` |
| Layered short notice | §2 below (EN + ZH) |
| Full policy targets | `/privacy` (overview) · `/legal/privacy` (full policy) |
| Timing | Live before external Preview Keep flow (Founder 1.2.1) |

---

## 2. Point-of-action layered notice (Keep confirmation)

Shown **before** the user confirms **Keep this reflection**. Informational only — not a second consent wall, not loss-aversion copy.

### 2.1 EN — `KEEP_PRIVACY_LAYER_V1_EN`

**Before you keep this reflection**

If you continue, the reflection you selected will be linked to the account you are creating or using.

Only that selected reflection and the return line you approved will move with your account. Separate model-authored Insight records will not move.

You can also continue without an account, or leave without saving.

[Full privacy notice](/privacy) · [Privacy policy](/legal/privacy)

### 2.2 ZH — `KEEP_PRIVACY_LAYER_V1_ZH`

**在留存这段反思之前**

如果你继续，你选择留存的这段反思将关联到你正在创建或使用的账户。

只会转移这段你选定的反思，以及你批准的返回语句。系统另行生成的 Insight 记录不会转移。

你也可以不注册继续，或不保存直接离开。

[隐私说明](/privacy) · [隐私政策](/legal/privacy)

### 2.3 UX constraints

- Appear on the Keep confirmation step (after invite CTA, before auth completes adoption).
- Neutral tone; no urgency, scarcity, or “you will lose this” framing.
- Link to full policy must be reachable without completing Keep.
- Confirming Keep after seeing this notice records `noticeVersion = ww_keep_adopt_notice_v1` on `AdoptionIntent`.

---

## 3. Full-policy change list (required before external Preview Keep)

These are product-required disclosures for legal/privacy drafting. Exact statutory wording is for legal review.

### 3.1 `/legal/privacy` — add or revise sections

| # | Topic | Required substance |
|---|---|---|
| P1 | Anonymous reflection identity | Explain that chat may begin under a browser-bound anonymous identifier before an account exists; what is stored; that it is not a named account. |
| P2 | Collection timing (APP 5 alignment) | Fact, circumstances and purpose of collection when anonymous reflection begins and when Keep adoption links identity — reasonable steps before or at collection. |
| P3 | Anonymous → registered adoption | When the user chooses Keep: selected conversation, visible transcript messages, timestamps/ordering, and user-approved return line may be linked to the account; purpose = continuity of that chosen reflection. |
| P4 | What does **not** move | Separate model-authored Insight rows; pattern / milestone / profile / inference objects; system-authored Last insight; hidden classification/continuity artefacts not expressly selected; unrelated anonymous conversations. |
| P5 | Adoption audit record | Minimal operational record may hold source anonymous id, destination account id, selected reflection id, consent time, notice version, outcome/error, integrity fields — **not** message content, return-line text, emotional/psychological/safety labels, model insights, or marketing segmentation. |
| P6 | Retention of audit linkage | Maximum **90-day** operational retention for the anonymous identifier on the adoption record; earlier destruction/de-identification when purpose ends; residual non-identifying aggregates only if needed. |
| P7 | Layered notice | Short notice at Keep; link to this policy; informational, not a second consent wall. |
| P8 | Choices | Continue without account; leave without saving; account deletion path (`/legal/data-deletion`) covers adopted reflections under the named account thereafter. |
| P9 | Left-behind Insights | Remain under anonymous retention purpose only; marked continuity-ineligible; destroyed or de-identified when that purpose ends; follow deletion if source anonymous reflection is deleted. |

### 3.2 `/privacy` — overview updates

| # | Change |
|---|---|
| O1 | Add one short bullet: anonymous chat may later be kept into an account **only for the reflection you choose**. |
| O2 | Add one short bullet: model-authored Insight records do **not** move with Keep. |
| O3 | Point to the Keep layered notice pattern and the full policy for retention/adoption detail. |
| O4 | Keep overview non-substitutive (existing “Limits of this overview” stance preserved). |

### 3.3 Not in scope of this change list

- Marketing measurement field dictionary (separate measurement companion).
- Production copy publish without Founder + privacy/legal approval.
- Any Stage 1 product Keep UI code (still unauthorised).

---

## 4. Review gates

| Gate | Required before |
|---|---|
| Draft complete (this doc) | Stage 2 specification package |
| Privacy/legal review | Code handling **real external-user** adoption |
| Founder/Steward approval | Preview gate |
| Live on `/privacy` + `/legal/privacy` | Any external user offered Keep adoption |

---

## 5. Open for legal

- Final APP 5 / APP 11 phrasing for Australian users.
- Whether additional jurisdictions need parallel notice language.
- Exact retention clock start (`completedAt` vs `consentAt`) — product preference documented in purge companion; legal may override.
