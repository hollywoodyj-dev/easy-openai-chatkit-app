# Agent Task List — Host / AI Agent Protocol

This describes an **online task list** hosted by this app.

**Setup:** Ensure the `AgentTask` table exists (run `npx prisma db push` or create a migration). If you use `AGENT_TASKS_API_KEY`, set it in `.env` or your deployment environment.

An **AI agent** can use HTTP requests (commands) to:

1. **Ping the host** to get tasks under the agent’s name.
2. **Reply** with content; the host updates that task with the reply.

## Base URL

- Local: `http://localhost:3000` (or your dev origin)
- Production: `https://your-domain.com`

- **Agents:** use `AGENT_TASKS_API_KEY` (see **Auth**).
- **Admin:** use `AGENT_TASKS_ADMIN_API_KEY` to get all tasks and to submit bulk replies (see **Admin role**).

---

## 1. Get my tasks (ping the host)

**Command (curl):**

```bash
curl -s "${BASE_URL}/api/agent-tasks?agent=Nova"
```

Replace `Nova` with the agent’s name. Optional: add header if using API key:

```bash
curl -s -H "x-api-key: YOUR_AGENT_TASKS_API_KEY" "${BASE_URL}/api/agent-tasks?agent=Nova"
```

**Response:** `{ "tasks": [ { "id", "agentName", "title", "description", "status", "replyContent", "createdAt", "updatedAt" }, ... ] }`

- `status`: `open` | `in_progress` | `replied` | `closed`
- `replyContent`: set when the agent has submitted a reply.

---

## 2. Reply to a task (update task with my content)

**Command (curl):**

```bash
curl -s -X POST "${BASE_URL}/api/agent-tasks/TASK_ID/reply" \
  -H "Content-Type: application/json" \
  -d '{"content":"Your reply text here."}'
```

With API key:

```bash
curl -s -X POST "${BASE_URL}/api/agent-tasks/TASK_ID/reply" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_AGENT_TASKS_API_KEY" \
  -d '{"content":"Your reply text here."}'
```

Replace `TASK_ID` with the task `id` from the list. The host will:

- Set the task’s `replyContent` to the given `content`.
- Set the task’s `status` to `replied`.
- Return the updated task JSON.

---

## 3. Create a task (host assigns work to an agent)

The host (or an automated process with the API key) can create a task for an agent:

```bash
curl -s -X POST "${BASE_URL}/api/agent-tasks" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_AGENT_TASKS_API_KEY" \
  -d '{"agentName":"Nova","title":"Review QA_HANDOFF.md","description":"Check section 6 and confirm retest steps."}'
```

Response is the created task (including `id`). The agent can then fetch it with the “get my tasks” call and reply using that `id`.

---

## Auth

- **Optional:** Set `AGENT_TASKS_API_KEY` in the server environment.
- If set, every **agent** request (get my tasks, reply to one task) must send that value either:
  - Header: `x-api-key: <key>`, or
  - Header: `Authorization: Bearer <key>`
- If not set, the API allows unauthenticated access (suitable for local/dev only).

---

## Admin role

A separate key **`AGENT_TASKS_ADMIN_API_KEY`** grants **admin** capabilities:

1. **Get all agents’ tasks (ping as admin)**  
   Use the same GET endpoint with `agent=admin` and the **admin** key:
   ```bash
   curl -s -H "x-api-key: YOUR_AGENT_TASKS_ADMIN_API_KEY" "${BASE_URL}/api/agent-tasks?agent=admin"
   ```
   Returns **all** tasks (all agent names), up to 500, newest first.

2. **Bulk reply — set multiple tasks (possibly for different agents) in one request**  
   POST to the admin reply endpoint with an array of `{ taskId, content }`:
   ```bash
   curl -s -X POST "${BASE_URL}/api/agent-tasks/admin/reply" \
     -H "Content-Type: application/json" \
     -H "x-api-key: YOUR_AGENT_TASKS_ADMIN_API_KEY" \
     -d '{
       "updates": [
         { "taskId": "id-for-nova-task", "content": "Reply for Nova." },
         { "taskId": "id-for-lumen-task", "content": "Reply for Lumen." }
       ]
     }'
   ```
   Response: `{ "updated": [ task, ... ], "errors": [ { "taskId", "error" }, ... ] }`  
   Each updated task’s `replyContent` is set and `status` becomes `replied`. Tasks can belong to different agents; you identify them by `taskId` from the admin “get all” response.

---

## Summary for the AI agent

| Role   | Action           | Method | URL / body |
|--------|------------------|--------|------------|
| Agent  | Get my tasks     | GET    | `/api/agent-tasks?agent=MY_NAME` |
| Agent  | Reply to one task| POST   | `/api/agent-tasks/:id/reply` with body `{ "content": "..." }` |
| Admin  | Get all tasks    | GET    | `/api/agent-tasks?agent=admin` (admin key required) |
| Admin  | Set multiple tasks (bulk reply) | POST | `/api/agent-tasks/admin/reply` with body `{ "updates": [ { "taskId", "content" }, ... ] }` (admin key required) |

After an agent (or admin) replies, the corresponding task’s `replyContent` is set and `status` becomes `replied`.
