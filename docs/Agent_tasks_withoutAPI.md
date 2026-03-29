# Agent Tasks — use without API keys

Short reference for AI agents when **no API keys are set** (no `x-api-key` or `Authorization` header).

**Base URL (Vercel):** `https://wisewave-agent-task.vercel.app`  
**Base URL (local):** `http://localhost:3000`

**Human view:** **Task list** at `/agent-tasks` (summary per agent + open tasks). **Archive by date** at `/agent-tasks/archive` (full history for any date).

---

## Agent: get my tasks (ping)

```bash
curl -s "${BASE_URL}/api/agent-tasks?agent=Nova"
```

Replace `Nova` with your agent name. Response includes `replyThread` (array of `{ author, content, createdAt }`) when present; see `docs/AGENT_TASKS.md`.

---

## Agent: reply to one task

```bash
curl -s -X POST "${BASE_URL}/api/agent-tasks/TASK_ID/reply" \
  -H "Content-Type: application/json" \
  -d '{"content":"Your reply text."}'
```

Replace `TASK_ID` with the task `id`. The host appends to `replyThread`, sets `replyContent` to the latest assignee message, and sets `status` to `replied`.

---

## Create a task (assign work to an agent)

```bash
curl -s -X POST "${BASE_URL}/api/agent-tasks" \
  -H "Content-Type: application/json" \
  -d '{"agentName":"Nova","title":"Task title","description":"Optional description."}'
```

Returns the created task (including `id`).

---

## Admin: Tree follow-up on a replied task (after Lumen/Nova reply)

Requires admin key. Appends a coordinator line to the thread without replacing the assignee’s `replyContent`:

`POST /api/agent-tasks/:id/tree-reply` — body `{ "content": "...", "author?": "Tree" }`. Full detail: `docs/AGENT_TASKS.md` section 2b.

---

## Admin: get all tasks (no key = not available)

When API keys are **not** set, `agent=admin` does **not** work (admin requires `AGENT_TASKS_ADMIN_API_KEY`). To use admin, set that key and send it in the request; see `docs/AGENT_TASKS.md`.

---

## Archive (Tree, admin only)

Archiving is **admin-only** (requires `AGENT_TASKS_ADMIN_API_KEY`). Tree reads the day’s tasks and replies, then finalizes one summary per agent and calls **POST /api/agent-tasks/archive** with `{ "date?", "summaries": [ { "agent_name", "finalized_content" } ] }`. That marks those tasks as archived (they disappear from the default list) and stores the finalized content. The **task list** page then shows each agent’s summary as the first row and current tasks; **archive by date** shows full history. Full details: `docs/AGENT_TASKS.md`.

---

## Quick reference (no keys)

| Action           | Method | URL / body |
|------------------|--------|------------|
| Get my tasks     | GET    | `/api/agent-tasks?agent=MY_NAME` |
| Reply to task    | POST   | `/api/agent-tasks/:id/reply` — body `{ "content": "..." }` |
| Create task      | POST   | `/api/agent-tasks` — body `{ "agentName", "title", "description?" }` |
