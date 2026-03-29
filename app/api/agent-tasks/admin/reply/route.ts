import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { checkAgentTasksAdminKey } from "@/lib/agent-tasks-auth";
import {
  appendAssigneeMessage,
  latestAssigneeContent,
  mergeLegacyReplyIntoThread,
  parseReplyThread,
} from "@/lib/agent-task-reply-thread";

export const dynamic = "force-dynamic";

const MAX_UPDATES = 50;

/**
 * POST: Admin bulk reply — set replyContent (and status to "replied") for multiple tasks in one request.
 * Body: { updates: [ { taskId: string, content: string }, ... ] }
 * Tasks can belong to different agents. Returns { updated: [ task, ... ] } and any errors per taskId.
 */
export async function POST(request: Request) {
  if (!checkAgentTasksAdminKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized (admin API key required)" },
      { status: 401 }
    );
  }

  let body: { updates?: Array<{ taskId?: string; content?: string }> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const raw = Array.isArray(body.updates) ? body.updates : [];
  if (raw.length === 0) {
    return NextResponse.json(
      { error: "Body must include updates (non-empty array)" },
      { status: 400 }
    );
  }
  if (raw.length > MAX_UPDATES) {
    return NextResponse.json(
      { error: `updates array exceeds maximum ${MAX_UPDATES} items` },
      { status: 400 }
    );
  }

  const updates: Array<{ taskId: string; content: string }> = [];
  for (const u of raw) {
    const taskId = typeof u.taskId === "string" ? u.taskId.trim() : "";
    const content = typeof u.content === "string" ? u.content.trim() : "";
    if (taskId && content) updates.push({ taskId, content });
  }

  if (updates.length === 0) {
    return NextResponse.json(
      { error: "Each update must have taskId and content (non-empty strings)" },
      { status: 400 }
    );
  }

  const updated: Array<{
    id: string;
    agentName: string;
    title: string;
    description: string | null;
    status: string;
    replyContent: string | null;
    replyThread: ReturnType<typeof parseReplyThread>;
    createdAt: string;
    updatedAt: string;
  }> = [];
  const errors: Array<{ taskId: string; error: string }> = [];

  for (const { taskId, content } of updates) {
    try {
      const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
      if (!task) {
        errors.push({ taskId, error: "Task not found" });
        continue;
      }
      let thread = parseReplyThread(task.replyThread);
      thread = mergeLegacyReplyIntoThread(thread, task.agentName, task.replyContent, task.updatedAt);
      thread = appendAssigneeMessage(thread, task.agentName, content);
      const replyContent = latestAssigneeContent(thread, task.agentName) ?? content;
      const u = await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          replyThread: thread as Prisma.InputJsonValue,
          replyContent,
          status: "replied",
          updatedAt: new Date(),
        },
      });
      updated.push({
        id: u.id,
        agentName: u.agentName,
        title: u.title,
        description: u.description,
        status: u.status,
        replyContent: u.replyContent,
        replyThread: parseReplyThread(u.replyThread),
        createdAt: u.createdAt.toISOString(),
        updatedAt: u.updatedAt.toISOString(),
      });
    } catch (e) {
      errors.push({
        taskId,
        error: e instanceof Error ? e.message : "Update failed",
      });
    }
  }

  return NextResponse.json({
    updated,
    errors: errors.length > 0 ? errors : undefined,
  });
}
