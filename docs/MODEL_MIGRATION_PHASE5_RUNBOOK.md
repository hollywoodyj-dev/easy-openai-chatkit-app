# Model Migration Phase 5 Runbook

This runbook is for safe OpenAI model migration operations in local, CI, and Vercel environments.

## Scope

Applies to capability-routed model selection implemented in:

- `lib/wisewave-model-router.ts`
- `app/api/chat/turn/route.ts`
- `app/api/chat/reflection/route.ts`
- `app/api/internal/model-compat/route.ts`

## Capability model env vars

Set per capability when you want independent control:

- `OPENAI_MODEL_CHAT_TURN`
- `OPENAI_MODEL_CHAT_SUMMARY`
- `OPENAI_MODEL_REFLECTION_CHECKPOINT`
- `OPENAI_MODEL_REFLECTION_EXTRACT`

Shared fallback:

- `OPENAI_CHAT_MODEL`

Deprecation guard:

- `OPENAI_MODEL_DEPRECATION_MODE=warn|block`
  - `warn` (default): logs warnings, continues serving
  - `block`: throws on deprecated configured model in runtime path

Internal report endpoint auth:

- `OPENAI_MODEL_COMPAT_API_KEY` (optional)

## Local workflow

1. Configure `.env.local` with target model values.
2. Run compatibility report:
   - `npm run model-compat:report`
3. Enforce fail-fast check:
   - `npm run model-compat:check`
4. Run router regression tests:
   - `npm run test:model-router`
5. Run app validation paths:
   - one `/api/chat/turn` request
   - one `/api/chat/reflection` request

### Local anonymous smoke caveat (identity/cookie continuity)

If you test `/api/chat/session`, `/api/chat/messages`, `/api/chat/turn`, and
`/api/chat/reflection` with anonymous access, all calls must share the same cookie jar.
If the session creation call and follow-up calls do not carry the same cookie identity,
you can see:

- `404 {"error":"Conversation not found or access denied"}`

**Full write-up, hosted vs local impact, and `curl` recipe:** `docs/MODEL_MIGRATION_LOCAL_ANONYMOUS_SESSION_SMOKE.md`

**One-command smoke (dev server + DB + `OPENAI_API_KEY` on the server):** `npm run local-anonymous:smoke`  
(optional: `BASE_URL=http://localhost:3000` if not using the default `http://127.0.0.1:3000`).

Recommended approach for manual API smoke:

1. Create session and persist response cookies.
2. Reuse the same cookie jar/header for messages/turn/reflection calls.
3. Keep same origin/protocol/port (`http://localhost:3000` vs `127.0.0.1`) during the sequence.

If `model-compat:check` fails, fix configured model slugs before any deploy.

## CI workflow

CI already includes:

1. `npm run lint`
2. `npm run model-compat:check`
3. `npm run build`

Meaning: deprecated model selection is blocked before build artifacts are accepted.

## Vercel workflow

Deploy command is gated:

- `npm run model-compat:check && vercel --yes`

Recommended release sequence:

1. Set new env values in Vercel project (Preview first).
2. Trigger Preview deploy.
3. Verify:
   - `GET /api/internal/model-compat` is `200`
   - `/api/chat/turn` and `/api/chat/reflection` both succeed
4. Promote to Production.

## Compatibility endpoint usage

Endpoint:

- `GET /api/internal/model-compat`

Auth:

- If `OPENAI_MODEL_COMPAT_API_KEY` is set, send:
  - `x-api-key: <key>` or
  - `Authorization: Bearer <key>`

Expected status:

- `200`: all configured capabilities are non-deprecated
- `409`: one or more capabilities use deprecated models

## Rollback playbook (capability-by-capability)

Use this when one capability regresses while others are stable.

1. Identify failing capability:
   - `chat_turn`, `chat_summary`, `reflection_checkpoint`, or `reflection_extract`
2. Revert only that capability env var to last known-good model.
3. Keep other capability env vars unchanged.
4. Re-run:
   - `npm run model-compat:check`
   - `npm run test:model-router`
5. Redeploy and verify endpoint + user path.

Example rollback:

- Keep:
  - `OPENAI_MODEL_CHAT_TURN=<new>`
  - `OPENAI_MODEL_CHAT_SUMMARY=<new>`
  - `OPENAI_MODEL_REFLECTION_CHECKPOINT=<new>`
- Revert only:
  - `OPENAI_MODEL_REFLECTION_EXTRACT=<previous_stable>`

## Emergency fallback

If multiple capability models fail unexpectedly:

1. Temporarily remove capability-specific env vars.
2. Set a single stable `OPENAI_CHAT_MODEL`.
3. Keep `OPENAI_MODEL_DEPRECATION_MODE=block`.
4. Verify with `npm run model-compat:check`.
5. Restore per-capability settings in controlled steps later.

## Known-safe checks before publish

- `npm run model-compat:report`
- `npm run model-compat:check`
- `npm run test:model-router`
- `npm run build`

All four should pass before promoting production model changes.

