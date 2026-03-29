import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { checkAgentTasksAdminKey } from "@/lib/agent-tasks-auth";
import {
  appendCoordinatorMessage,
  mergeLegacyReplyIntoThread,
  parseReplyThread,
  latestAssigneeContent,
} from "@/lib/agent-task-reply-thread";

export const dynamic = "force-dynamic";

/**
 * POST: Tree (or coordinator) responds after an assignee reply — appends to `replyThread`
 * without overwriting `replyContent` (assignee's latest message stays for API compatibility).
 * Admin API key only.
 *
 * Body: { content: string, author?: string } — author defaults to "Tree"
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!checkAgentTasksAdminKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized (admin API key required for tree-reply)" },
      { status: 401 }
    );
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing task id" }, { status: 400 });
  }

  let body: { content?: string; author?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content) {
    return NextResponse.json(
      { error: "Body must include content (non-empty string)" },
      { status: 400 }
    );
  }

  const authorLabel =
    typeof body.author === "string" && body.author.trim() ? body.author.trim() : "Tree";

  const task = await prisma.agentTask.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  let thread = parseReplyThread(task.replyThread);
  thread = mergeLegacyReplyIntoThread(thread, task.agentName, task.replyContent, task.updatedAt);

  if (thread.length === 0) {
    return NextResponse.json(
      {
        error:
          "No assignee reply to respond to yet. Wait for the assignee to post via POST /api/agent-tasks/:id/reply, or ensure reply_content is set.",
      },
      { status: 400 }
    );
  }

  thread = appendCoordinatorMessage(thread, content, authorLabel);

  const updated = await prisma.agentTask.update({
    where: { id },
    data: {
      replyThread: thread as Prisma.InputJsonValue,
      replyContent: latestAssigneeContent(thread, task.agentName) ?? task.replyContent,
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
    replyThread: thread,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}
