# Deploy Agent Tasks to Vercel as wisewave-agent-task

Deploy this app to a **new** Vercel project so the Agent Tasks API is available at **https://wisewave-agent-task.vercel.app** (or your custom domain).

---

## 1. Push code to GitHub

Ensure your latest code (including Agent Task API and Prisma `AgentTask` model) is pushed to your Git repo.

---

## 2. Create a new Vercel project

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New…** → **Project**.
3. **Import** your Git repository (e.g. `chatkit/easy-openai-chatkit-app`).
4. Set **Project Name** to **`wisewave-agent-task`**.
   - Your API will be at: **https://wisewave-agent-task.vercel.app**
5. **Environment variables:** Add the same ones your app needs, at least:
   - **`DATABASE_URL`** — PostgreSQL connection string (create a new Vercel Postgres or use an existing DB; Agent Tasks need the `AgentTask` table).
   - Optional: **`AGENT_TASKS_API_KEY`**, **`AGENT_TASKS_ADMIN_API_KEY`** if you use API keys.
   - Any others your app uses (e.g. `JWT_SECRET`, `OPENAI_API_KEY`) if you want full app features on this deployment.
6. Click **Deploy**.

---

## 3. Run database migrations

After the first deploy, the `AgentTask` table must exist:

- **Vercel Postgres:** In the Vercel project → Storage → your DB → run:
  ```bash
  npx prisma db push
  ```
  from your local repo (with `DATABASE_URL` pointing to that DB), or run a migration.
- **Existing Postgres:** Point `DATABASE_URL` to your DB and run `npx prisma db push` (or your migration) against that DB.

Redeploy if you changed env vars.

---

## 4. Human-facing task list page

Once deployed, humans can view all tasks and status at:

- **https://wisewave-agent-task.vercel.app/agent-tasks**

The page shows a table: Agent, Title, Description, Status, Reply, Created, Updated (latest 200 tasks). No API key required for viewing.

---

## 5. Agent Tasks base URL

Once deployed, the Agent Tasks API base URL is:

- **https://wisewave-agent-task.vercel.app**

Agents can use:

- Get tasks: `GET https://wisewave-agent-task.vercel.app/api/agent-tasks?agent=Nova`
- Reply: `POST https://wisewave-agent-task.vercel.app/api/agent-tasks/:id/reply` with `{ "content": "..." }`
- Create task: `POST https://wisewave-agent-task.vercel.app/api/agent-tasks` with `{ "agentName", "title", "description?" }`

Admin (if you set `AGENT_TASKS_ADMIN_API_KEY`):

- Get all: `GET https://wisewave-agent-task.vercel.app/api/agent-tasks?agent=admin`
- Bulk reply: `POST https://wisewave-agent-task.vercel.app/api/agent-tasks/admin/reply` with `{ "updates": [ { "taskId", "content" }, ... ] }`

---

## Optional: Custom domain

In the Vercel project → **Settings** → **Domains**, add a custom domain (e.g. `agent-tasks.wisewave.io`) and follow Vercel’s DNS instructions. Then use that URL as the base instead of `wisewave-agent-task.vercel.app`.
