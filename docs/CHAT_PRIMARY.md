# /chat as primary persisted interface

**Status:** /chat is the preferred path; /embed is legacy/demo (ChatKit UI).

---

## Confirmed behavior

### 1. User and assistant messages both save correctly

- **POST /api/chat/turn** saves the **user** message first, then calls OpenAI Chat Completions, then saves the **assistant** message. Both rows are written to `Message` with the same `conversationId` and `userId`.
- The client appends the new pair optimistically after a successful turn (no refetch), so the UI updates immediately and persistence is already done on the server.

### 2. Prior messages load by user_id + session_id

- **GET /api/chat/messages?session_id=...** uses `resolveChatUserId(request)` for identity (Bearer token or cookie) and returns messages only for the conversation where `conversation.id === session_id` and `conversation.userId === userId`. Other users cannot see the thread; 404 is returned if the conversation does not exist or does not belong to the caller.

### 3. Session resume behavior

- The client stores the current **session_id** in `sessionStorage` under `chat_session_id`.
- On load, it tries that stored id first: **GET /api/chat/messages?session_id=...** with credentials. If the response is 200, that session is resumed and messages are shown. If 404 or error, storage is cleared and **POST /api/chat/session** is used to create a new conversation.
- **New chat** clears storage and creates a new session, then loads (empty) messages for it.

---

## Error handling (tightened)

- **Session create failure:** Error screen with **Try again** (re-runs init/resume) and **Back** (to /embed).
- **Turn failure:** Error banner with server `error` or `details`, input restored; **Dismiss** clears the banner.
- **Loading:** “Loading session...” during init, resume, or new chat; no indefinite spinner.
- APIs return consistent JSON: `{ error: string, details?: string }` on failure.

---

## Remaining issues that could block adopting /chat as primary

| Issue | Severity | Notes |
|-------|----------|--------|
| **No streaming** | Medium | Response is full JSON `{ assistant_message }`. Streaming would require a new endpoint or response shape. |
| **No file/attachments** | Medium | Turn API is text-only. Would need multipart or base64 handling and model support. |
| **Chat Completions vs ChatKit workflow** | Low–Medium | Set `OPENAI_CHAT_SYSTEM_PROMPT` (or `_FILE`) to your workflow instructions so /chat matches the Wisewave bot. Tools/function-calling in the workflow are not replicated. |
| **Logged-in users on /chat** | Low | Web UI uses cookie only. To tie sessions to a logged-in user, the app would need to send `Authorization: Bearer <JWT>` on session/turn/messages (e.g. from a token in the page or from a wrapper that injects the header). |
| **Session storage is per-tab** | Low | `sessionStorage` is per-origin per-tab. New tab = new session unless the app passes `session_id` in the URL or another mechanism. |

None of these block using /chat as the primary interface for anonymous or cookie-based persisted chat; they are follow-ups (streaming, attachments, auth wiring, cross-tab session) if product requires them.

---

## Env and setup

- `DATABASE_URL` — Postgres with `Conversation` and `Message` (e.g. `npx prisma db push`).
- `OPENAI_API_KEY` — Required for turn.
- `OPENAI_CHAT_MODEL` — Optional; default `gpt-4o`.
- **`OPENAI_CHAT_SYSTEM_PROMPT`** — **Recommended.** Set to the same instructions as your Wisewave/ChatKit workflow (from Agent Builder) so /chat uses the same assistant behavior instead of plain GPT. Use `\n` for new lines in .env.
- **`OPENAI_CHAT_SYSTEM_PROMPT_FILE`** — Optional. Path to a file (relative to project root) containing the system prompt, e.g. `prompts/wisewave-system.txt`. Useful for long instructions.

For logged-in users, send the same Bearer token on **POST /api/chat/session**, **POST /api/chat/turn**, and **GET /api/chat/messages** so `user_id` is stable and sessions are per user.
