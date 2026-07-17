# P1 Interaction Legibility Preview Slice - Lumen QA

**Date:** 2026-07-17  
**Owner:** Lumen  
**Scope:** P1 Interaction Legibility preview slice only  
**Fixture pack:** `docs/qa/P1_INTERACTION_LEGIBILITY_PREVIEW_SLICE_LUMEN_FIXTURES_2026-07-17.md`  
**Local commit checked:** `7740ef2`  
**Verdict:** **HOLD - Preview deployment/access not confirmable; local Preview-flag behavior passes.**

## Summary

The slice behavior passes in local Preview-flag conditions: static plain text appears on an empty thread, disappears on typing, stays gone after the first expression, has no chips/cards/buttons, does not show the P1.1 invitation line, and does not duplicate the P0 `You can begin anywhere.` line when both P0 and P1 client flags are enabled.

The actual Vercel Preview deployment could not be verified from this machine. Candidate Preview URLs are behind Vercel Authentication, and no `P0_VERCEL_PROTECTION_BYPASS` / `VERCEL_AUTOMATION_BYPASS_SECRET` was available in the environment. Vercel CLI also showed the fresh 2026-07-17 deployment as `target production`, while the visible `target preview` deployment was from 2026-07-08.

Production guard was checked on `https://www.wisewave.io/chat`: the P1 Interaction Legibility block is not present.

## Environment

### Local Preview-Flag QA

- Base URL: `http://127.0.0.1:3017/chat`
- Env used:
  - `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY=1`
  - `NEXT_PUBLIC_VERCEL_ENV=preview`
  - `NEXT_PUBLIC_ENABLE_P0_REFLECTION_ENTRY=1`
- Browser: `agent-browser`, viewport `1440x1000`
- Test hook: `[data-testid="p1-interaction-legibility-preview"]`

### Vercel / Hosted Checks

- Latest deployment inspected:
  - `https://wisewave-chatkit-app-v2-lsen882u5-jing-yangs-projects-db5d1ce8.vercel.app`
  - Vercel target: `production`
  - Created: 2026-07-17 15:10:58 AEST
  - Aliased to `https://www.wisewave.io`, `https://wisewave.io`, and project aliases
- Candidate Preview deployment inspected:
  - `https://wisewave-chatkit-app-v2-3jiwkyrtf-jing-yangs-projects-db5d1ce8.vercel.app`
  - Vercel target: `preview`
  - Created: 2026-07-08 23:38:03 AEST
- Both candidate deployment URLs returned the Vercel login page from this machine.
- No Vercel Protection bypass secret was present in environment.

## Local Gate

```text
npm run test:p1-interaction-legibility
PASS - 6/6 tests
```

## Fixture Results

| Fixture | Result | Evidence |
|---|---:|---|
| IL-P01 - Flag default off | PASS BY UNIT / PROD GUARD | Unit gate covers off/production guard. Production `www.wisewave.io/chat` had no P1 legibility block. |
| IL-P02 - Empty state visible EN | PASS LOCAL | Local Preview-flag browser showed the authorized EN opening, lead, and four example lines above the input. |
| IL-P03 - Typing hides copy | PASS LOCAL | Typing into the input removed the P1 four-line legibility block immediately. |
| IL-P04 - First expression hides copy | PASS LOCAL | After first user expression, the P1 block stayed gone and the conversation became primary. |
| IL-P05 - ZH parity | PASS BY UNIT / NOT BROWSER-VERIFIED | Unit gate covers ZH copy map. `agent-browser` stayed `navigator.language=en-GB`; visual ZH browser state was not verified. |
| IL-P06 - Visual hierarchy | PASS LOCAL WITH WATCHPOINT | Local rendering is quiet plain text above input, smaller/lighter than conversation and input. |
| IL-P07 - No turn behaviour change | PASS BY SCOPE / LOCAL SMOKE | Slice is client-only. Local first turn completed normally with no P1 UI persistence. |
| IL-P08 - Production guard | PASS | Production showed no legibility block. |
| IL-P09 - P0 coexistence | PASS LOCAL | With P0 and P1 client flags on, empty state showed one full legibility block and only one `You can begin anywhere.` occurrence. |

## Screenshots

Saved in `qa-artifacts/`:

- `qa-artifacts/p1-il-empty-local-preview-2026-07-17.png`
- `qa-artifacts/p1-il-typing-local-preview-2026-07-17.png`
- `qa-artifacts/p1-il-after-first-expression-local-preview-2026-07-17.png`

These screenshots are local Preview-flag evidence, not hosted Preview evidence.

## Detailed Observations

### Empty Thread

Local Preview-flag state showed:

```text
You can begin anywhere.

Many people begin with:

Something on their mind
Something they are feeling
Something that happened
Simply saying, "I don’t know."
```

Observed:

- `data-testid="p1-interaction-legibility-preview"` present.
- No buttons or links inside the block.
- No P1.1 invitation line.
- No onboarding headings such as `Get started` or `Choose an option`.
- No prompt-picker, therapy, journaling, companion, or productivity visual treatment.
- Body text contained exactly one `You can begin anywhere.` occurrence.

### Typing

After typing `I feel a little unsure where to begin`:

- The P1 block was absent.
- `Many people begin with:` was absent.
- Input retained typed text.
- A single P0 permission line remained visible. This appears to be existing P0 behavior, not the P1 legibility block.

### First Expression

After sending the first expression:

- The user message appeared in the conversation.
- Assistant response completed: `What's here first is just uncertainty.`
- The P1 block was absent.
- `Many people begin with:` was absent.
- Input cleared.

### Production Guard

`https://www.wisewave.io/chat` returned the normal Wisewave page and did not include the P1 legibility test hook or `Many people begin with:` text.

## HOLD Reason

This cannot be signed off as Preview QA because the actual protected Preview deployment was not reachable from this environment:

- No automation bypass secret was available.
- Candidate deployment URLs showed the Vercel login page.
- Vercel CLI did not show a fresh 2026-07-17 `target preview` deployment in the visible page; the fresh deployment inspected was `target production`.

## Required Next Step

Provide either:

1. A reachable 2026-07-17 Preview deployment URL plus Vercel Protection bypass secret/cookie path, or
2. Confirmation that the 15:10 deployment is intentionally the Preview test target despite Vercel reporting `target production`.

Then rerun IL-P02 through IL-P09 on the hosted Preview and replace this HOLD with a hosted verdict.

## Verdict

**HOLD** for hosted Preview signoff.

Local implementation behavior is promising and matches the slice boundaries, but Tree's requested Preview/internal QA cannot be completed until hosted Preview access/deployment target is clarified.
