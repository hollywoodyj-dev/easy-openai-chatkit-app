import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAgentTasksApiKey } from "@/lib/agent-tasks-auth";

export const dynamic = "force-dynamic";

/**
 * POST: Submit a reply for a task; updates the task's replyContent and sets status to "replied".
 * Body: { content: string }
 * Returns the updated task.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAgentTasksApiKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  let body: { content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const content =
    typeof body.content === "string" ? body.content.trim() : "";
  if (!content) {
    return NextResponse.json(
      { error: "Body must include content (non-empty string)" },
      { status: 400 }
    );
  }

  const task = await prisma.agentTask.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const updated = await prisma.agentTask.update({
    where: { id },
    data: {
      replyContent: content,
      status: "replied",
      updatedAt: new Date(),
    },
  });

  return NextResponse.json({
    id: updated.id,
    agentName: updated.agentName,
    title: updated.title,
    description: updated.description,
    status: updated.status,
    replyContent: updated.replyContent,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}
