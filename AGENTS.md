# Agent instructions (Nova / Cursor)

This file gives AI coding agents **persistent project context**. Update it when milestones or conventions change.

## What this repo is

- **ChatKit starter** — embed workflow (`/embed`, `components/ChatKitPanel.tsx`, `app/api/create-session`).
- **HC-OS V1 reflection chat** — first-class **`/chat`** app with Prisma persistence, structured reflection extraction, continuity (“Last insight”), recurrence/pattern cues (E), optional embodiment (F), and Milestone **G** integration (coherence-first prompt appendix + light UI grouping).  
  Governance and QA live under **`docs/HC_OS_V1_Milestone_*`**.

## Roles (shorthand)

| Name | Meaning in docs |
|------|------------------|
| **Nova** | Implementation / code |
| **Lumen** | QA plans & results |
| **Tree** | Scope / compression / when to ship |
| **Wisewave** | Wording & quality bars |
| **OctopusMind** | Boundaries & anti-expansion rules |

## Code map (HC-OS chat)

| Area | Location |
|------|----------|
| Chat UI | `app/chat/page.tsx` |
| Turn API | `app/api/chat/turn/route.ts` |
| Messages API | `app/api/chat/messages/route.ts` |
| Continuity | `app/api/chat/continuity/route.ts` |
| Wisewave libs | `lib/wisewave-*.ts`, `lib/wisewave-milestone-f-embodiment.ts`, `lib/wisewave-milestone-g-integration.ts` |
| Prisma | `prisma/schema.prisma`, `lib/prisma.ts` |

## Environment (do not commit secrets)

- Copy **`.env.example`** → **`.env.local`** for local dev.
- **`OPENAI_API_KEY`** — required for `/api/chat/turn` and extraction.
- **Milestone flags (server):**
  - **`MILESTONE_F_EMBODIMENT=0`** — disables F `embodiment_cue` on turn responses.
  - **`MILESTONE_G_INTEGRATION=0`** — disables G system-prompt integration appendix; turn JSON should show `debug_milestone_g_integration_enabled: false` and `debug_milestone_g_system_appendix_applied: false`.
- Restart the Next process after changing env vars.

## Build & quality bar

```bash
npm run build
```

Fix new errors before merging. ESLint warnings may exist; don’t introduce new **errors**.

## Governance (read before expanding behavior)

- **Milestone G** closure standard: addendum **`docs/HC_OS_V1_Milestone_G_Addendum_Minimal_Integration_Everyday_Usefulness.md` §11**.  
  **G0** = shipped code slice; **milestone complete** = §11 satisfied (see Lumen results).
- **OctopusMind shared rule (G):** tighten **coherence** and everyday fit of the existing loop; **reject** usefulness that depends on **utility, management, planning, tracking, or recommendation** layers (`docs/HC_OS_V1_Milestone_G_OctopusMind_Integration_Boundary.md`).
- Do **not** add panels, workflows, or “daily system” UX under the name of G without Tree + doc alignment.

## QA artifacts

- Milestone F: `docs/HC_OS_V1_Milestone_F_Lumen_QA_Plan.md`, `..._Results.md`
- Milestone G: `docs/HC_OS_V1_Milestone_G_Lumen_QA_Plan.md`, `..._Results.md`
- Kill-switch helper: `npm run milestone-g:kill-switch-proof`

## Git

- Do not commit **`.env`**, **`.env.local`**, or API keys.
- `tmp-*.js` scripts at repo root are usually local scratch — don’t commit unless intentional.
