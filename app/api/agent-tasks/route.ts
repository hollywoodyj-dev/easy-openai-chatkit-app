import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAgentTasksApiKey, checkAgentTasksAdminKey } from "@/lib/agent-tasks-auth";

export const dynamic = "force-dynamic";

const MAX_TASKS = 100;
const MAX_TASKS_ADMIN = 500;

/**
 * GET: List tasks for an agent by name (ping the host to get my tasks).
 * Query: agent (required) — e.g. agent=Nova. Use agent=admin with admin API key to get all agents' tasks.
 * Returns { tasks: [{ id, agentName, title, description, status, replyContent, createdAt, updatedAt }] }.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agent = searchParams.get("agent")?.trim();
  if (!agent) {
    return NextResponse.json(
      { error: "Missing required query: agent" },
      { status: 400 }
    );
  }

  const isAdmin = agent.toLowerCase() === "admin";
  if (isAdmin) {
    if (!checkAgentTasksAdminKey(request)) {
      return NextResponse.json({ error: "Unauthorized (admin key required for agent=admin)" }, { status: 401 });
    }
  } else {
    if (!checkAgentTasksApiKey(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const includeArchived = searchParams.get("include_archived") === "1";
  const where = {
    ...(isAdmin ? {} : { agentName: agent }),
    ...(includeArchived ? {} : { archivedAt: null }),
  };

  const tasks = await prisma.agentTask.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: isAdmin ? MAX_TASKS_ADMIN : MAX_TASKS,
  });

  const payload = tasks.map((t) => ({
    id: t.id,
    agentName: t.agentName,
    title: t.title,
    description: t.description,
    status: t.status,
    replyContent: t.replyContent,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    archivedAt: t.archivedAt?.toISOString() ?? null,
  }));

  return NextResponse.json({ tasks: payload });
}

/**
 * POST: Create a task assigned to an agent (host creates work for the agent).
 * Body: { agentName: string, title: string, description?: string }
 * Returns the created task.
 */
export async function POST(request: Request) {
  if (!checkAgentTasksApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { agentName?: string; title?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const agentName = typeof body.agentName === "string" ? body.agentName.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!agentName || !title) {
    return NextResponse.json(
      { error: "Body must include agentName and title (non-empty strings)" },
      { status: 400 }
    );
  }

  const description =
    typeof body.description === "string" ? body.description.trim() || null : null;

  const created = await prisma.agentTask.create({
    data: { agentName, title, description, status: "open" },
  });

  return NextResponse.json({
    id: created.id,
    agentName: created.agentName,
    title: created.title,
    description: created.description,
    status: created.status,
    replyContent: created.replyContent,
    createdAt: created.createdAt.toISOString(),
    updatedAt: created.updatedAt.toISOString(),
  });
}
