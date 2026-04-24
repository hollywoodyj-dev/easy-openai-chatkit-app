# Model Migration Phase 1-5 Index

Single reference for Tree/Lumen/Nova on what shipped, where it lives, and how to run go/no-go checks.

## What is shipped (Phase 1-5)

- **Phase 1 - Central router + wiring**
  - Capability-based model resolution is live.
  - Chat turn, summary, extraction, and reflection checkpoint paths are wired to capability keys.
- **Phase 2 - Compatibility guard + internal report**
  - Deprecation detection includes July/October 2026 shutdown slugs.
  - Fine-tuned family deprecation detection is included.
  - Internal endpoint returns compatibility status.
- **Phase 3 - CI/deploy preflight gate**
  - Deprecated configs can fail before build/deploy.
- **Phase 4 - Regression tests**
  - Router invariants and mode behavior are test-locked.
- **Phase 5 - Operations runbook**
  - Local/CI/Vercel workflow and rollback playbook are documented.

## Canonical files

- Router and guards:
  - `lib/wisewave-model-router.ts`
- Runtime wiring:
  - `app/api/chat/turn/route.ts`
  - `app/api/chat/reflection/route.ts`
- Internal compatibility endpoint:
  - `app/api/internal/model-compat/route.ts`
- Preflight script:
  - `scripts/model-compat-check.cjs`
- Tests:
  - `lib/wisewave-model-router.test.ts`
- CI gate:
  - `.github/workflows/ci.yml`
- Runbook:
  - `docs/MODEL_MIGRATION_PHASE5_RUNBOOK.md`

## Env contract

Capability-level (preferred):

- `OPENAI_MODEL_CHAT_TURN`
- `OPENAI_MODEL_CHAT_SUMMARY`
- `OPENAI_MODEL_REFLECTION_CHECKPOINT`
- `OPENAI_MODEL_REFLECTION_EXTRACT`

Fallback:

- `OPENAI_CHAT_MODEL`

Guard mode:

- `OPENAI_MODEL_DEPRECATION_MODE=warn|block`

Internal endpoint auth (optional):

- `OPENAI_MODEL_COMPAT_API_KEY`

## Commands

Primary:

- `npm run model-compat:report`
- `npm run model-compat:check`
- `npm run test:model-router`

Release guard:

- CI runs `npm run model-compat:check` before build.
- Deploy runs `npm run model-compat:check && vercel --yes`.

## Compatibility endpoint

- Route: `GET /api/internal/model-compat`
- Status:
  - `200` -> no deprecated configured capability model
  - `409` -> one or more deprecated configured capability models

## Go/No-Go checklist (Tree/Lumen)

Go only when all are true:

1. `npm run model-compat:check` passes.
2. `npm run test:model-router` passes.
3. `npm run build` passes.
4. `GET /api/internal/model-compat` returns `200` in target environment.
5. Smoke checks pass:
   - one successful `POST /api/chat/turn`
   - one successful `POST /api/chat/reflection`

No-Go if any are true:

- compatibility check fails
- compatibility endpoint returns `409`
- router test fails
- turn/reflection path fails after env change

## Fast rollback (capability-scoped)

If only one path regresses, rollback only that capability env var to previous stable model:

- `chat_turn`
- `chat_summary`
- `reflection_checkpoint`
- `reflection_extract`

Then re-run:

- `npm run model-compat:check`
- `npm run test:model-router`

If multiple paths regress:

1. remove capability-specific vars temporarily
2. set known-stable `OPENAI_CHAT_MODEL`
3. keep `OPENAI_MODEL_DEPRECATION_MODE=block`
4. validate again and redeploy

## Ownership and sequencing

- **Nova**: implementation, preflight checks, rollback execution
- **Lumen**: QA validation and release verdict
- **Tree**: go/no-go decision and scope control

Recommended sequence per migration batch:

1. Preview env update
2. compatibility + tests + build
3. endpoint + API smoke validation
4. Lumen verdict
5. Tree release decision
6. Production promotion

