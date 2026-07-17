# P1 Interaction Legibility Preview Slice - Lumen QA

**Date:** 2026-07-17  
**Owner:** Lumen  
**Scope:** P1 Interaction Legibility preview slice only  
**Fixture pack:** `docs/qa/P1_INTERACTION_LEGIBILITY_PREVIEW_SLICE_LUMEN_FIXTURES_2026-07-17.md`  
**Local commit checked:** `7740ef2`  
**Hosted retest commits checked:** `3a228eb`, `8b24d1a`  
**Verdict:** **PASS - hosted Preview fixtures IL-P02 through IL-P09 pass.**

## Summary

The slice behavior passes on hosted Preview `hur5l61tl` after Vercel Protection bypass was provided. Static plain text appears on an empty thread, disappears on typing, stays gone after the first expression, has no chips/cards/buttons/selectable examples, does not show the P1.1 invitation line, and does not duplicate the P0 `You can begin anywhere.` line in the empty state.

ZH visual parity was verified with browser locale `zh-CN`: the ZH opening, lead, and four example lines rendered with the same empty-state rule.

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

- Final hosted Preview deployment checked:
  - `https://wisewave-chatkit-app-v2-hur5l61tl-jing-yangs-projects-db5d1ce8.vercel.app/chat`
  - Vercel target: `preview`
  - Created: 2026-07-17 15:52:12 AEST
  - Branch: `qa/p1-legibility-preview`
  - Commit: `8b24d1a23df99c177ec500b2e91c4164482efd8b`
  - Access: Vercel Protection bypass supplied by steward
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
| IL-P02 - Empty state visible EN | PASS HOSTED | Hosted Preview showed the authorized EN opening, lead, and four example lines above the input via `[data-testid="p1-interaction-legibility-preview"]`. |
| IL-P03 - Typing hides copy | PASS HOSTED | Typing into the input removed the P1 legibility block immediately; `Many people begin with:` count became 0. |
| IL-P04 - First expression hides copy | PASS HOSTED | After first user expression, the P1 block stayed gone, input cleared, and conversation became primary. |
| IL-P05 - ZH parity | PASS HOSTED | Browser locale `zh-CN` rendered the ZH opening, lead, and four example lines with the same empty-state rule. |
| IL-P06 - Visual hierarchy | PASS HOSTED | Hosted rendering is quiet static text above the input, no card/picker/onboarding treatment. |
| IL-P07 - No turn behaviour change | PASS HOSTED | First turn completed normally; no P1 UI persisted after send. |
| IL-P08 - Production guard | PASS | Production showed no legibility block, no test hook, and no `Many people begin with:` text. |
| IL-P09 - P0 coexistence | PASS HOSTED | Empty hosted Preview state showed one full legibility block and exactly one `You can begin anywhere.` occurrence. |

## Screenshots

Saved in `qa-artifacts/`:

- `qa-artifacts/p1-il-empty-hosted-preview-2026-07-17.png`
- `qa-artifacts/p1-il-typing-hosted-preview-2026-07-17.png`
- `qa-artifacts/p1-il-after-first-expression-hosted-preview-2026-07-17.png`
- `qa-artifacts/p1-il-zh-empty-hosted-preview-2026-07-17.png`
- `qa-artifacts/p1-il-hosted-preview-state-2026-07-17.json`
- `qa-artifacts/p1-il-empty-local-preview-2026-07-17.png`
- `qa-artifacts/p1-il-typing-local-preview-2026-07-17.png`
- `qa-artifacts/p1-il-after-first-expression-local-preview-2026-07-17.png`

The hosted screenshots are the signoff evidence; the local screenshots remain earlier supporting evidence.

## Detailed Observations

### Empty Thread

Hosted Preview state showed:

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
- Assistant response completed normally: `the uncertainty is less about the reflection itself and more about not knowing where to place your first step.`
- The P1 block was absent.
- `Many people begin with:` was absent.
- Input cleared.

### Production Guard

`https://www.wisewave.io/chat` returned the normal Wisewave page and did not include the P1 legibility test hook or `Many people begin with:` text.

## Hosted Retest Addendum - 2026-07-17 15:45 AEST

Nova reported the slice was on `main` at commit `3a228eb` and asked Lumen to wait for a fresh Vercel Preview deployment from that commit, with Preview env `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY=1`, a Vercel Protection bypass secret, and the Preview deployment URL.

Lumen confirmed local `HEAD` and commit `3a228eb`:

```text
3a228ebe693a10f1d64a3a3aa6deed8981b641d9 feat(chat): ship P1 Interaction Legibility preview slice (default-off)
```

Vercel deployment list and inspection showed the fresh deployment for this commit as Production, not Preview:

```text
Deployment: https://wisewave-chatkit-app-v2-6e3grdxae-jing-yangs-projects-db5d1ce8.vercel.app
Target: production
Created: Fri Jul 17 2026 15:36:28 AEST
Aliases: https://www.wisewave.io, https://wisewave.io, project aliases, git-main alias
```

The deployment URL `/chat` returned Vercel Login from this machine. No environment variable named like `P0_VERCEL_PROTECTION_BYPASS`, `VERCEL_AUTOMATION_BYPASS_SECRET`, `P0_TOKEN`, or `PROTECTION_BYPASS` was present in the current shell.

Production guard was rechecked after the `3a228eb` production-target deploy:

```text
URL: https://www.wisewave.io/chat
Status: 200
HAS_P1_TESTID=False
HAS_MANY_PEOPLE=False
HAS_BEGIN_ANYWHERE=False
```

Result: production remains clean, but hosted Preview IL-P02 through IL-P09 still cannot be rerun until Steward provides the reachable Preview URL and Vercel Protection bypass.

## Hosted Preview Access Attempt - 2026-07-17 16:10 AEST

Nova/Steward provided a fresh Preview deployment URL:

```text
https://wisewave-chatkit-app-v2-hur5l61tl-jing-yangs-projects-db5d1ce8.vercel.app/chat
```

Vercel inspection confirms this deployment is the intended Preview target:

```text
Deployment: https://wisewave-chatkit-app-v2-hur5l61tl-jing-yangs-projects-db5d1ce8.vercel.app
Target: preview
Status: Ready
Created: Fri Jul 17 2026 15:52:12 AEST
Branch: qa/p1-legibility-preview
Commit checked locally: 8b24d1a23df99c177ec500b2e91c4164482efd8b
```

Access is still blocked from Lumen's environment:

- HTTP request to `/chat` returned the Vercel Login page.
- `agent-browser` also landed on `Login - Vercel` / `https://vercel.com/login?...`.
- No environment variable named like `P0_VERCEL_PROTECTION_BYPASS`, `VERCEL_AUTOMATION_BYPASS_SECRET`, `P0_TOKEN`, or `PROTECTION_BYPASS` was present in the current shell.

Production guard was rechecked again:

```text
URL: https://www.wisewave.io/chat
Status: 200
HAS_P1_TESTID=False
HAS_MANY_PEOPLE=False
HAS_BEGIN_ANYWHERE=False
```

Result: deployment target is now correct (`preview`), but IL-P02 through IL-P07 and IL-P09 cannot be executed, and hosted screenshots cannot be captured, until Steward provides the Vercel Protection bypass secret.

## Hosted Preview Retest - 2026-07-17 16:24 AEST

Steward provided the Vercel Protection bypass secret. Lumen reran hosted Preview QA on `hur5l61tl` with Playwright using the bypass header/cookie path.

Hosted observations:

- Empty EN: P1 block present with authorized opening, lead, and four examples.
- Typing: P1 block absent immediately; typed text remained in input.
- After first expression: P1 block absent; conversation visible; input cleared.
- ZH empty state: `navigator.language=zh-CN`; ZH opening, lead, and four examples rendered.
- No P1.1 invitation line.
- No buttons, links, chips, cards, menus, tap targets, or selectable examples inside the block.
- No onboarding headings (`Get started`, `Choose an option`) and no prompt-picker / therapy / journaling / companion treatment.
- P0 coexistence: empty hosted Preview had exactly one `You can begin anywhere.` occurrence.
- Production guard stayed clean.

State evidence saved:

```text
qa-artifacts/p1-il-hosted-preview-state-2026-07-17.json
```

## Verdict

**PASS**.

Hosted Preview IL-P02 through IL-P09 pass. Production remains clean. P1.1 and GR-1 remain separate and not approved by this result.
