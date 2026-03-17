Nova – Hosted Task List Rules
=============================

Role: Nova (AI agent)  
Purpose: Keep Wisewave’s hosted task list in sync with my work and QA results.

Base URL
--------

- Production / default: `https://wisewave-agent-task.vercel.app` (use this unless the user explicitly says “local”).

Agent APIs (no admin key needed)
--------------------------------

### 1. Get my tasks (ping the host)

- Endpoint: `GET /api/agent-tasks?agent=Nova`
- Shell example:

```bash
BASE_URL="https://wisewave-agent-task.vercel.app"
curl -s "$BASE_URL/api/agent-tasks?agent=Nova"
```

- Response shape:
  - `{ "tasks": [ { "id", "agentName", "title", "description", "status", "replyContent", "createdAt", "updatedAt" }, ... ] }`

Use this whenever:

- I need to see what’s currently assigned to Nova.
- I want to confirm whether a Ticket’s task already has a reply before adding one.

### 2. Reply to a task (mark as done / add result)

- Endpoint: `POST /api/agent-tasks/:id/reply`
- Body: `{ "content": "Reply text here." }`
- Effect:
  - Sets `replyContent` for that task.
  - Sets `status` to `replied` (this is effectively “done” for the agent).

Shell example:

```bash
BASE_URL="https://wisewave-agent-task.vercel.app"
TASK_ID="REPLACE_WITH_TASK_ID"

curl -s -X POST "$BASE_URL/api/agent-tasks/$TASK_ID/reply" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Ticket 9 (Regulation cue) – PASS. Strong turns show the cue; weak/fallback (e.g. \"I feel off\", \"...\") stay hidden. Live QA confirmed behavior."
  }'
```

Use this whenever:

- A Ticket / task has reached a clear state (e.g. PASS, Blocked, In Progress with notes).
- The human explicitly asks me to “update the hosted task list” or “reply on the task.”

Agent API keys (optional)
-------------------------

- If `AGENT_TASKS_API_KEY` is set on the host, include it in requests:
  - Header: `x-api-key: <AGENT_TASKS_API_KEY>` **or**
  - Header: `Authorization: Bearer <AGENT_TASKS_API_KEY>`

Example with key:

```bash
curl -s -H "x-api-key: $AGENT_TASKS_API_KEY" \
  "$BASE_URL/api/agent-tasks?agent=Nova"

curl -s -X POST "$BASE_URL/api/agent-tasks/$TASK_ID/reply" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $AGENT_TASKS_API_KEY" \
  -d '{"content":"Your reply text here."}'
```

Admin role (for host / Tree, not default Nova behavior)
-------------------------------------------------------

Admin uses `AGENT_TASKS_ADMIN_API_KEY` and can:

- Get all tasks:

```bash
curl -s -H "x-api-key: $AGENT_TASKS_ADMIN_API_KEY" \
  "$BASE_URL/api/agent-tasks?agent=admin"
```

- Bulk reply multiple tasks:

```bash
curl -s -X POST "$BASE_URL/api/agent-tasks/admin/reply" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $AGENT_TASKS_ADMIN_API_KEY" \
  -d '{
    "updates": [
      { "taskId": "id-for-nova-task",  "content": "Reply for Nova." },
      { "taskId": "id-for-lumen-task", "content": "Reply for Lumen." }
    ]
  }'
```

- Archive a day’s tasks with summaries:

```bash
curl -s -X POST "$BASE_URL/api/agent-tasks/archive" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $AGENT_TASKS_ADMIN_API_KEY" \
  -d '{
    "date": "2026-03-17",
    "summaries": [
      {
        "agent_name": "Nova",
        "finalized_content": "Nova completed Ticket 9 regulation cue fix and QA handoff."
      }
    ]
  }'
```

Default Nova behavior
---------------------

When acting as Nova in this repo:

1. **To inspect my work queue**  
   - Call `GET /api/agent-tasks?agent=Nova`.

2. **When a Ticket is clearly Done / PASS / Blocked**  
   - Identify the matching task by `title`/`description`.  
   - Call `POST /api/agent-tasks/:id/reply` with a concise, high-signal summary:
     - Ticket number
     - Owner
     - State (Done / PASS / Blocked)
     - 1–3 bullet points of what changed / QA result.

3. **Only use admin endpoints if the user explicitly asks for admin/bulk/archive behavior.**

