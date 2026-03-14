# Option B Chat (/chat) — Adoption vs scaffold

## E2E test result (this repo)

- **POST /api/chat/session** → `{ session_id }` (and optional `Set-Cookie` for anonymous id)
- **GET /api/chat/messages?session_id=...** → `{ messages: [...] }`
- **POST /api/chat/turn** with `{ session_id, message }` → `{ assistant_message }` (persists user + assistant)

All three were exercised in one flow; persistence and cookie identity work as intended.

---

## What Wisewave needs to adopt /chat **now**

1. **Env**
   - `DATABASE_URL` — Postgres (Conversation + Message tables; run `npx prisma db push` or migrate if not done).
   - `OPENAI_API_KEY` — Required for `/api/chat/turn` (Chat Completions).
   - `OPENAI_CHAT_MODEL` — Optional; defaults to `gpt-5.4` if unset.

2. **Identity**
   - **Anonymous:** Cookie only; no auth header. Same as existing create-session (cookie or generated id).
   - **Logged-in:** Send `Authorization: Bearer <JWT>` on session, turn, and messages requests so `session_id` is tied to that user.

3. **Product**
   - **Route:** `/chat` is the Option B UI. Link to it from your app (e.g. “Chat” in nav); embed already has “Chat (Option B)”.
   - **Back link:** `/chat` “Back” goes to `/`. Change to `/embed`, `/login`, or your home if you want a different default.

4. **Limitations**
   - **Model:** Turn API uses **Chat Completions** (`OPENAI_CHAT_MODEL`), not the ChatKit workflow. Behavior and capabilities can differ from the ChatKit UI on `/embed`.
   - **No streaming:** Response is JSON `{ assistant_message }`; streaming can be added later.
   - **No attachments/tools:** Current turn API is text-only; no file upload or ChatKit tools.

---

## When to keep /chat as a **scaffold** only

- You need **exact** ChatKit workflow behavior (same model, tools, instructions) and are not ready to accept Chat Completions as the backend for chat.
- You need **streaming** or **attachments** in the main flow before investing in Option B.
- You prefer to wait until ChatKit exposes message content in callbacks and then use **Option A** (client-reported persistence with ChatKit UI) instead.

---

## Summary

| Adopt /chat now | Keep as scaffold |
|-----------------|------------------|
| You want persisted chat without depending on ChatKit callbacks. | You need ChatKit workflow parity or streaming first. |
| You accept Chat Completions (e.g. gpt-5.4) as the backend model. | You must keep the exact workflow/model/tools. |
| You’re fine with cookie + optional Bearer and the current simple UI. | You’re waiting for Option A or a custom turn that uses the workflow. |

**Concrete next step to adopt:** Set `DATABASE_URL`, `OPENAI_API_KEY`, (optionally `OPENAI_CHAT_MODEL`), run DB sync, then use `/chat` or call `POST /api/chat/session`, `POST /api/chat/turn`, and `GET /api/chat/messages` from your own client.
