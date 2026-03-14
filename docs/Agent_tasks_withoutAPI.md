# Agent Tasks — use without API keys

Short reference for AI agents when **no API keys are set** (no `x-api-key` or `Authorization` header).

**Base URL (Vercel):** `https://wisewave-agent-task.vercel.app`  
**Base URL (local):** `http://localhost:3000`

---

## Agent: get my tasks (ping)

```bash
curl -s "${BASE_URL}/api/agent-tasks?agent=Nova"
```

Replace `Nova` with your agent name. Response: `{ "tasks": [ { "id", "agentName", "title", "description", "status", "replyContent", "createdAt", "updatedAt" }, ... ] }`

---

## Agent: reply to one task

```bash
curl -s -X POST "${BASE_URL}/api/agent-tasks/TASK_ID/reply" \
  -H "Content-Type: application/json" \
  -d '{"content":"Your reply text."}'
```

Replace `TASK_ID` with the task `id`. The task’s `replyContent` is set and `status` becomes `replied`.

---

## Create a task (assign work to an agent)

```bash
curl -s -X POST "${BASE_URL}/api/agent-tasks" \
  -H "Content-Type: application/json" \
  -d '{"agentName":"Nova","title":"Task title","description":"Optional description."}'
```

Returns the created task (including `id`).

---

## Admin: get all tasks (no key = not available)

When API keys are **not** set, `agent=admin` does **not** work (admin requires `AGENT_TASKS_ADMIN_API_KEY`). To use admin, set that key and send it in the request; see `docs/AGENT_TASKS.md`.

---

## Quick reference (no keys)

| Action           | Method | URL / body |
|------------------|--------|------------|
| Get my tasks     | GET    | `/api/agent-tasks?agent=MY_NAME` |
| Reply to task    | POST   | `/api/agent-tasks/:id/reply` — body `{ "content": "..." }` |
| Create task      | POST   | `/api/agent-tasks` — body `{ "agentName", "title", "description?" }` |
