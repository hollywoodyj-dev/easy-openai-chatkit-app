## Wisewave Chat – QA Handoff

**Last updated:** 2026-02-08 (implementation follow-up 2026-03-13; Milestone H benchmark reporting note 2026-03-24; v4 benchmark results pointer 2026-03-25)  
**Environment:** Next.js app at `/chat` (Option B – backend turn API + DB persistence)

### 1. High‑level status

- **Backend persistence**:  
  - `POST /api/chat/session` creates a DB `Conversation` (session_id = conversation.id).  
  - `POST /api/chat/turn` saves user + assistant messages and returns `assistant_message`.  
  - `GET /api/chat/messages?session_id=...` returns all saved messages for that conversation.  
  - `GET /api/chat/sessions` returns a per‑user list of recent conversations with a topic preview.

- **Identity / isolation**:  
  - Authenticated users: identified via `Authorization: Bearer <token>` (JWT).  
  - Anonymous users: identified via a long‑lived cookie; separate from logged‑in identities.  
  - `/chat` also scopes `sessionStorage` keys by token, so switching accounts in the same browser does **not** share history.

- **LLM behavior / profile**:  
  - Backend uses a Wisewave‑style system prompt from either `OPENAI_CHAT_SYSTEM_PROMPT` or `OPENAI_CHAT_SYSTEM_PROMPT_FILE`.  
  - Incremental conversation summarization is implemented to maintain continuity without sending full history every turn.

### 2. `/chat` UI status

- **Working now**:
  - On load, `/chat` creates or resumes a session and loads messages.  
  - Left sidebar shows **Conversations** list from `/api/chat/sessions`, auto‑refreshed:  
    - on initial load,  
    - after starting a **New** chat,  
    - after each successful message turn.  
  - Active conversation is highlighted in the list.  
  - Message roles are labeled as **“You”** (user) and **“Wisewave”** (assistant).  
  - Error states (e.g. failure to create session or send message) show inline banners with simple recovery actions.

- **Known behaviors to keep in mind**:
  - Topics in the sidebar are derived from the **first user message** in each conversation (truncated to 60 chars).  
  - Long‑running chats rely on periodic summaries for context; very old turns may be represented only via the summary.

### 3. Open questions / good QA targets for Lumen

- **Profile correctness (production vs local)**  
  - Confirm in **local** and **production** that the assistant consistently behaves like the Wisewave profile (not “generic GPT”).  
  - Verify env vars are set correctly in each env:  
    - Either `OPENAI_CHAT_SYSTEM_PROMPT` (inline text), or  
    - `OPENAI_CHAT_SYSTEM_PROMPT_FILE` pointing to a prompt file path (e.g. `prompts/wisewave-system.txt`).

- **History & session UX**  
  - Confirm that after sending at least one message, the conversation appears in the sidebar with an appropriate topic.  
  - Confirm switching accounts (different JWT tokens) shows **isolated** histories in the sidebar and message view.  
  - Confirm that refreshing `/chat` keeps you in the same active conversation for that account (via `sessionStorage`).  
  - Confirm that starting **New** creates a fresh conversation and the old one remains accessible in the sidebar.

- **Error handling**  
  - Simulate network or API failures (e.g. disable network briefly) and confirm:  
    - Message send failures show a clear error and allow retry.  
    - Session creation failures show a clear error and the **Try again** link works.

### 4. How Lumen should report new findings

When Lumen has new QA results or bugs:

1. Add a dated entry at the bottom of this file, e.g.:
   - `2026‑02‑10 – Found: switching accounts sometimes reuses the same sidebar list. Steps: ... Expected: ... Actual: ...`
2. Clearly mark whether it’s:
   - **Blocker for internal beta**, or  
   - **Nice‑to‑have / polish**, or  
   - **Question / clarification**.
3. Save and commit as part of the QA branch so the dev agent can pick it up from here.

### 5. New findings from Lumen (2026-03-13)

- **2026-03-13 16:15 Sydney — Nice-to-have / polish (product trust)**
  - **Found:** `/chat?token=invalid-test-token` still renders the normal chat shell instead of surfacing a clear auth/token error state.
  - **Steps:** Open `http://127.0.0.1:3000/chat?token=invalid-test-token` in a fresh browser session.
  - **Expected:** User should see a clear invalid/stale token state or be redirected to an appropriate recovery path.
  - **Actual:** Standard chat UI rendered, and the frontend created a token-scoped `sessionStorage` key: `chat_session_id:invalid-test-token`.
  - **Notes:** This does **not** by itself prove backend account access is granted. It does show a trust/clarity gap because a bad token currently looks more valid than it should.

- **2026-03-13 16:25 Sydney — Nice-to-have / polish (mobile discoverability)**
  - **Found:** Mobile `/chat` session/history discoverability appears broken by an implementation mismatch.
  - **Steps:** Open authenticated token `/chat` in iPhone 14 emulation, then tap the visible `Conversations` control.
  - **Expected:** Tapping `Conversations` should reveal a mobile conversation list / drawer / panel.
  - **Actual:** No visible history drawer/panel appeared; user stayed in the plain chat view with composer only.
  - **Implementation clue:** The full conversation sidebar markup still exists in the DOM, but it is hidden on mobile via `hidden sm:flex`, while the visible mobile `Conversations` button does not appear to reveal that hidden list.
  - **Notes:** Desktop/token-path baseline remains green; this is a mobile-specific discoverability issue, not a core persisted-chat regression.

### 6. Implementation follow-up (2026-03-13) — what changed

Both 2026-03-13 QA items above have been implemented in the codebase:

- **Invalid-token UX**
  - New API: `GET /api/chat/auth-check`. With `Authorization: Bearer <token>`, it returns **200** for a valid token and **401** for an invalid/expired token. With no Bearer header it returns 200 (anonymous allowed).
  - `/chat` now calls this endpoint when a `token` query param is present; on **401** it shows an **“Invalid or expired sign-in link”** screen with `Sign in again` → `/login` and `Continue without account` → `/chat` (no token), and does **not** create a session or write to `sessionStorage` for that bad token.

- **Mobile Conversations drawer**
  - On viewports below the `sm` breakpoint, tapping **“Conversations”** in the chat header opens a left-side drawer with backdrop, the conversation list (same as the desktop sidebar), a **Close** control, and **New conversation**. Choosing a conversation or starting a new one closes the drawer and updates the main chat view.

### 7. Lumen retest results (2026-03-13)

- **2026-03-13 16:35 Sydney — Retest result: PASS (invalid-token UX)**
  - Retested `http://127.0.0.1:3000/chat?token=invalid-test-token` in a fresh browser session.
  - **Observed:** Dedicated `Invalid or expired sign-in link` screen rendered with the expected recovery actions (`Sign in again`, `Continue without account`).
  - **Observed:** No token-scoped `sessionStorage` key was created for the invalid token.
  - **Conclusion:** The earlier invalid-token trust/clarity issue is resolved in local QA.

- **2026-03-13 16:35 Sydney — Retest result: PASS (mobile Conversations drawer)**
  - Retested authenticated token `/chat` in iPhone 14 emulation.
  - **Observed:** Tapping `Conversations` opened a mobile drawer with backdrop, Close control, `New conversation`, and the real conversation list.
  - **Observed:** After the drawer loaded, conversation items were visible. Tapping `New conversation` closed the drawer and returned to the normal chat view after session loading.
  - **Conclusion:** The earlier mobile session-discoverability issue is resolved in local QA.

- **2026-03-13 16:40 Sydney — Sanity check: PASS (profile correctness on token `/chat`)**
  - Retested on the authenticated token `/chat` path with the prompt: `In one sentence, who are you and what kind of assistant are you?`
  - **Observed reply:** `I'm Wisewave, an AI companion here to support your self-awareness and personal growth through thoughtful conversation.`
  - **Conclusion:** This is positive local evidence that the active `/chat` assistant profile is aligned with the intended Wisewave persona rather than a generic assistant voice.
  - **Caution:** A separate plain `/chat` automation session drifted onto `/embed` and hung on `Loading assistant session...`, so that older surface should not be used as the primary trust signal for the persisted `/chat` path.

- **2026-03-13 16:45 Sydney — Partial switching/isolation check: PASS (token vs anonymous contexts)**
  - Retested authenticated token `/chat` and plain anonymous `/chat` in separate clean browser sessions after today's implementation changes.
  - **Observed (token path):** token-scoped sessionStorage key (`chat_session_id:<token prefix>`) and the richer token-side conversation history were present.
  - **Observed (anonymous path):** `chat_session_id:anon` was used and the visible history was separate/minimal rather than reusing the token-side conversation list.
  - **Conclusion:** This is additional live evidence that account-context separation remains intact after today's changes.
  - **Limitation:** This is not yet a full logout/login switching proof across two distinct authenticated accounts; it is a token-vs-anonymous isolation check.

### 8. Milestone H observation — passive vs benchmark metrics (2026-03-24)

- **Do not mix:** Treat **benchmark-set** suppression ratios (filtered by `benchmarkSet` in the internal observation tool) as **different** from **passive observation** ratios (unfiltered or `benchmarkSet=__passive__`).
- **Record:** Lumen + Wisewave end-of-day benchmark summary and locked reporting rule: **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_End_of_Day_Summary.md`**. **Combined 24–25 interpretation** (closure posture, H4/H3/H1/H5, Tree/Nova brief): **`docs/HC_OS_V1_Milestone_H_Wisewave_Combined_Report_2026-03-24_to_2026-03-25.md`**. **v4 benchmark rerun** (vs v3): **`docs/HC_OS_V1_Milestone_H_Lumen_Wisewave_Benchmark_v4_Results_2026-03-25.md`**.
