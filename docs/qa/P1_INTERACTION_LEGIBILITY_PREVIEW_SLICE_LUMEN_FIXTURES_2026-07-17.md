# P1 Interaction Legibility — Preview Slice Lumen Fixtures

**Date:** 2026-07-17  
**Scope:** Plain-text Interaction Legibility preview slice only  
**Authority:** Tree authorization 2026-07-17 (default-off; Preview/internal QA; Production HOLD)  
**Build marker:** `p1_interaction_legibility_v1_preview_slice`  
**Flag:** `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY=1`  
**Production guard:** `NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION` must remain unset until Tree authorizes Production

## Not in scope

- P1.1 First Question Invitation (`Or, if it is easier, Wisewave can ask one question first.`)
- P1.2 Reflection Strategy behaviour
- Chips, cards, buttons, tap targets, prefill, menus, selectable examples
- GR-1 linter changes
- Backend / `POST /api/chat/turn` behaviour changes
- Engagement analytics as success metric

## Enable for Preview QA

1. Set on **Preview** deployment only:
   - `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY=1`
   - `NEXT_PUBLIC_VERCEL_ENV=preview` (or rely on Vercel-injected value)
2. Do **not** set `NEXT_PUBLIC_P1_INTERACTION_LEGIBILITY_ALLOW_PRODUCTION`.
3. Redeploy Preview.
4. Local: add both vars to `.env.local` and restart `npm run dev`.

## EN/ZH copy map

| Key | EN | ZH |
|-----|----|----|
| Opening | You can begin anywhere. | 你可以从任何地方开始。 |
| Examples lead | Many people begin with: | 很多人会从这里开始： |
| Example 1 | Something on their mind | 心里的事 |
| Example 2 | Something they are feeling | 此刻的感受 |
| Example 3 | Something that happened | 发生过的事 |
| Example 4 | Simply saying, "I don't know." | 或者简单说「我不知道」 |

**Excluded (P1.1 only):** Or, if it is easier, Wisewave can ask one question first.

## Render conditions

Show when **all** true:

- Flag enabled (and not blocked on Production)
- `userMessageCount === 0`
- Input field empty (no typing yet)

Hide when **any** true:

- Flag off or Production blocked
- User has sent at least one message
- Input has any non-whitespace content

## DOM / test hook

- Container: `[data-testid="p1-interaction-legibility-preview"]`
- Placement: static text immediately above the input bar (secondary empty-state)

## Fixtures

### IL-P01 — Flag default off

**Setup:** Flag unset.  
**Expected:** No legibility block; P0 permission line unchanged if P0 client flag on.  
**Fail if:** Any legibility copy visible.

### IL-P02 — Empty state visible (EN)

**Setup:** Flag on; fresh empty `/chat`; browser EN.  
**Expected:** Quiet plain text above input with opening + four example lines; no headings like “Get started”; no buttons/chips.  
**Fail if:** Interactive elements; P1.1 invitation line; onboarding container styling.

### IL-P03 — Typing hides copy

**Setup:** IL-P02; type one character in input (do not send).  
**Expected:** Legibility block disappears immediately.  
**Fail if:** Copy remains visible while typing.

### IL-P04 — First expression hides copy

**Setup:** IL-P02; send any user message.  
**Expected:** Legibility block gone; does not return in same thread.  
**Fail if:** Copy persists after first send.

### IL-P05 — ZH parity

**Setup:** Flag on; browser/lang ZH (or ZH locale).  
**Expected:** ZH copy map rows; same show/hide rules as EN.  
**Fail if:** EN-only strings; missing lines.

### IL-P06 — Visual hierarchy

**Setup:** IL-P02.  
**Expected:** Input bar remains primary anchor; legibility text quieter/smaller than conversation bubbles; no card/picker framing.  
**Fail if:** Copy competes with input; therapy/journaling/productivity visual treatment.

### IL-P07 — No turn behaviour change

**Setup:** Send reflection with flag on vs off (Preview).  
**Expected:** Assistant responses equivalent aside from normal variance; no new debug fields for P1 legibility on turn API.  
**Fail if:** Turn route or system prompt changed for this slice.

### IL-P08 — Production guard

**Setup:** Production host with flag=1 but allow key unset.  
**Expected:** Legibility not visible.  
**Fail if:** Copy appears on `wisewave.io` / Production without allow key.

### IL-P09 — P0 coexistence

**Setup:** Both P0 client flag and P1 legibility flag on; empty thread.  
**Expected:** Full legibility block only (no duplicate “You can begin anywhere.” in main column). P0 early-exit/perception rules unchanged.  
**Fail if:** Duplicate opening line; P0 permission + legibility opening both shown.

## Screenshots requested from Lumen

1. Empty thread — legibility visible, input empty  
2. Typing — legibility hidden, input has text  
3. After first user message — legibility hidden, conversation visible  

## Rollback

1. Remove or unset `NEXT_PUBLIC_ENABLE_P1_INTERACTION_LEGIBILITY` on Preview; redeploy.  
2. Or revert commit touching:
   - `lib/wisewave-p1-interaction-legibility.ts`
   - `app/chat/page.tsx` (InteractionLegibilityPreview + visibility wiring)
3. No database migration or server flag required — client-only slice.  
4. P0 behaviour unaffected when legibility flag off.

## Local gate

```bash
npm run test:p1-interaction-legibility
```

## Confirmation checklist (Nova)

- [ ] Static plain text only  
- [ ] Default-off flag with Production guard  
- [ ] No P1.1 invitation copy in codebase/UI  
- [ ] No P1.2 / turn-route changes  
- [ ] Disappears on typing and first expression  
- [ ] EN/ZH copy map implemented  
- [ ] Fully removable via flag or revert  
