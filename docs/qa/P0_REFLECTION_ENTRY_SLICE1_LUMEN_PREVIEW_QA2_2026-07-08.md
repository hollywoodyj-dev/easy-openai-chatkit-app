# P0 Reflection Entry Slice 1 - Lumen Preview QA2

Date: 2026-07-08 AEST  
Tester: Lumen  
Preview URL: `https://wisewave-chatkit-app-v2-3jiwkyrtf-jing-yangs-projects-db5d1ce8.vercel.app`  
Commit: `0ebf580`  
Build marker: `p0_reflection_entry_v1_slice1_qa2`  
Verdict: **PASS ON PREVIEW**

## Setup

- `ENABLE_P0_REFLECTION_ENTRY=1` is set on Vercel Preview only.
- `P0_REFLECTION_ENTRY_ALLOW_PRODUCTION` is not set.
- Vercel Authentication bypass used via `x-vercel-protection-bypass` header. Secret intentionally not recorded.
- Production remained safe/off after retest:
  - `flag_set: false`
  - `enabled: false`
  - `active: false`
  - `blocked_on_production: false`
  - `vercel_env: production`
  - marker `p0_reflection_entry_v1_slice1_qa2`

## Automated / Guard Checks

- Local `npm run p0:entry:probes`: **PASS, 23/23**.
- Preview guard smoke: **PASS**
  - `flag_set: true`
  - `enabled: true`
  - `active: true`
  - `blocked_on_production: false`
  - `vercel_env: preview`
  - marker `p0_reflection_entry_v1_slice1_qa2`

Note: the repo hosted-probe script requires `P0_TOKEN`; Lumen ran an equivalent Preview API harness using anonymous cookie identity because this chat route supports anonymous sessions and no QA JWT was available.

## Encoding Correction

The earlier QA artifact had false ZH failures caused by the PowerShell inline harness converting literal Chinese strings into `????????`. QA2 used Unicode escapes for ZH prompts, and server debug confirmed real CJK codepoints reached the app.

## Fixture Result

| Fixture | Result | Notes |
|---|---:|---|
| P0-F01 Greeting -> Mirror | PASS | Debug matched. |
| P0-F02 Emotional opening -> Deepen; T2 clears | PASS | T1 Deepen and T2 clear matched. |
| P0-F03 Question request -> Clarify | PASS | Debug matched; no prompt-library/list drift. |
| P0-F04 Writing difficulty -> Mirror | PASS | Debug matched. |
| P0-F05 Advice seeking -> Clarify | PASS | Debug matched; no blank response, no high-severity drift, no direct advice. |
| P0-F06 Document paste -> Deepen | PASS | Debug matched; relationship-first response, no default summary. |
| P0-F07 Safety override | PASS | Debug matched; guarded safety response applied with emergency/crisis boundary. |
| P0-F08 Hi then substance clears T2 | PASS | T2 clears mode after reflection begins. |
| P0-ZH-F02 Emotional opening parity | PASS | `我担心自己撑不下去了` -> `emotional_opening` / `deepen`. |
| P0-ZH-F04 Writing difficulty parity | PASS | `我都不知道从哪里开始。` -> `writing_difficulty` / `mirror`. |

## Decision

Slice 1 is **signed off on Preview**.

Production remains gated. Do not enable Production unless steward/Tree intentionally sets both:

```text
ENABLE_P0_REFLECTION_ENTRY=1
P0_REFLECTION_ENTRY_ALLOW_PRODUCTION=1
```

and redeploys Production.
