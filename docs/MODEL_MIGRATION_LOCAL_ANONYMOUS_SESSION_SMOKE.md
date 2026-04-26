# Local anonymous session smoke (Model Migration — Tree Workstream A)

## Plain-language root cause

**Symptom:** `POST /api/chat/session` succeeds (typically `200`) with a `session_id`, but a later
`GET /api/chat/messages`, `POST /api/chat/turn`, or `POST /api/chat/reflection` returns
`404` with `{"error":"Conversation not found or access denied"}`.

**What is actually wrong:** The conversation row in the database is stored under a **specific
anonymous user id**. That id comes from a **cookie** (`chatkit_session_id`); see
`lib/chat-identity.ts` (`resolveChatUserId`).

- On the **first** request in a new browser (or a script) with no cookie, the server **generates**
  a new anonymous id and, when needed, returns **`Set-Cookie`** so the **same** client can
  identify itself on the next call.
- If the follow-up call **does not** send that cookie, the server treats the request as a
  **different** anonymous user. The `session_id` in the URL/body still points at the
  **first** user’s row, so `Conversation` lookup for `{ id, userId }` fails → **404**.

A Prisma or SQL row for `session_id` alone does **not** prove the **runtime** `userId` matches
that row; the cookie is the link.

## Hosted vs local impact

| Context | What usually happens |
|--------|------------------------|
| **Real browser on `/chat`** | The browser stores and sends the cookie; identity is **stable** across the session; this path matches product behavior. |
| **Manual `curl` / scripts without a cookie jar** | Each “fresh” run can be a new anonymous id, or a later step can miss `Set-Cookie` → same **404** pattern as Lumen hit locally. |
| **API tests with `Authorization: Bearer ...`** | Identity is the **JWT user**, not the anonymous cookie. Flow is **not** the same as anonymous; subscription checks apply to authenticated users. |

**Production (hosted):** The issue is not “Vercel is broken” — it is **missing or inconsistent
client identity** on automated calls. Browsing `/chat` on the same origin is the reference path.

**Local:** Use one **origin** (e.g. stick to `http://127.0.0.1:3000` or `http://localhost:3000`
for the whole chain; mixing them can drop cookies in some setups) and one **cookie store**.

## Evidence: scripted smoke (one identity)

With the app running (`npm run dev` or `npm run start`) and **PostgreSQL** + **`DATABASE_URL`**
set, and **`OPENAI_API_KEY`** on the server for turn + reflection:

```bash
npm run local-anonymous:smoke
```

Override base URL (default `http://127.0.0.1:3000`):

```bash
set BASE_URL=http://localhost:3000&& npm run local-anonymous:smoke
```

## Evidence: `curl` (cookie jar)

```bash
curl -c jar.txt -b jar.txt -X POST http://127.0.0.1:3000/api/chat/session -H "Content-Type: application/json" -d {}
# Read session_id from JSON; then:
curl -c jar.txt -b jar.txt "http://127.0.0.1:3000/api/chat/messages?session_id=SESSION_ID"
```

Reuse **the same** `jar.txt` for every call in the sequence.

## Related

- Phase 5 runbook caveat: `docs/MODEL_MIGRATION_PHASE5_RUNBOOK.md` (local anonymous identity).
- Identity implementation: `lib/chat-identity.ts`.
