import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAgentTasksAdminKey } from "@/lib/agent-tasks-auth";
import { parseReplyThread } from "@/lib/agent-task-reply-thread";

export const dynamic = "force-dynamic";

/**
 * GET: List archived (finalized) summaries. Query: date=YYYY-MM-DD (optional; default = latest day with data).
 * Returns { date, summaries: [ { agentName, finalizedContent, createdAt } ] } or { dates, summariesByDate }.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get("date")?.trim();

  if (!checkAgentTasksAdminKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized (admin key required for archive)" },
      { status: 401 }
    );
  }

  if (dateParam) {
    const [summaries, tasks] = await Promise.all([
      prisma.agentTaskArchive.findMany({
        where: { archiveDate: dateParam },
        orderBy: { agentName: "asc" },
      }),
      (() => {
        const start = new Date(dateParam + "T00:00:00.000Z");
        const end = new Date(dateParam + "T23:59:59.999Z");
        return prisma.agentTask.findMany({
          where: {
            archivedAt: { not: null },
            createdAt: { gte: start, lte: end },
          },
          orderBy: [{ agentName: "asc" }, { createdAt: "asc" }],
        });
      })(),
    ]);
    return NextResponse.json({
      date: dateParam,
      summaries: summaries.map((s) => ({
        agentName: s.agentName,
        finalizedContent: s.finalizedContent,
        createdAt: s.createdAt.toISOString(),
      })),
      tasks: tasks.map((t) => ({
        id: t.id,
        agentName: t.agentName,
        title: t.title,
        description: t.description,
        status: t.status,
        replyContent: t.replyContent,
        replyThread: parseReplyThread(t.replyThread),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    });
  }

  const latest = await prisma.agentTaskArchive.findFirst({
    orderBy: { archiveDate: "desc" },
    select: { archiveDate: true },
  });
  if (!latest) {
    return NextResponse.json({ date: null, summaries: [], tasks: [], dates: [] });
  }

  const startOfDay = new Date(latest.archiveDate + "T00:00:00.000Z");
  const endOfDay = new Date(latest.archiveDate + "T23:59:59.999Z");
  const [summaries, tasks, dates] = await Promise.all([
    prisma.agentTaskArchive.findMany({
      where: { archiveDate: latest.archiveDate },
      orderBy: { agentName: "asc" },
    }),
    prisma.agentTask.findMany({
      where: {
        archivedAt: { not: null },
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      orderBy: [{ agentName: "asc" }, { createdAt: "asc" }],
    }),
    prisma.agentTaskArchive.findMany({
      select: { archiveDate: true },
      distinct: ["archiveDate"],
      orderBy: { archiveDate: "desc" },
      take: 30,
    }),
  ]);

  return NextResponse.json({
    date: latest.archiveDate,
    summaries: summaries.map((s) => ({
      agentName: s.agentName,
      finalizedContent: s.finalizedContent,
      createdAt: s.createdAt.toISOString(),
    })),
    tasks: tasks.map((t) => ({
      id: t.id,
      agentName: t.agentName,
      title: t.title,
      description: t.description,
      status: t.status,
      replyContent: t.replyContent,
      replyThread: parseReplyThread(t.replyThread),
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
    dates: dates.map((d) => d.archiveDate),
  });
}

/**
 * POST: Archive today's tasks and save finalized content per agent (Tree). Admin only.
 * Body: { date?: "YYYY-MM-DD", summaries: [ { agent_name: string, finalized_content: string } ] }
 * - Creates AgentTaskArchive row per agent for that date (upsert by agentName+archiveDate).
 * - Sets archivedAt = now() on all AgentTasks for that date for those agents.
 */
export async function POST(request: Request) {
  if (!checkAgentTasksAdminKey(request)) {
    return NextResponse.json(
      { error: "Unauthorized (admin key required)" },
      { status: 401 }
    );
  }

  let body: {
    date?: string;
    summaries?: Array<{ agent_name?: string; finalized_content?: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const dateRaw = body.date?.trim();
  const archiveDate = dateRaw || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(archiveDate)) {
    return NextResponse.json(
      { error: "date must be YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const raw = Array.isArray(body.summaries) ? body.summaries : [];
  const summaries: Array<{ agentName: string; finalizedContent: string }> = [];
  for (const s of raw) {
    const agentName = typeof s.agent_name === "string" ? s.agent_name.trim() : "";
    const finalizedContent = typeof s.finalized_content === "string" ? s.finalized_content.trim() : "";
    if (agentName && finalizedContent) summaries.push({ agentName, finalizedContent });
  }
  if (summaries.length === 0) {
    return NextResponse.json(
      { error: "summaries must be a non-empty array of { agent_name, finalized_content }" },
      { status: 400 }
    );
  }

  const startOfDay = new Date(archiveDate + "T00:00:00.000Z");
  const endOfDay = new Date(archiveDate + "T23:59:59.999Z");
  const agentNames = summaries.map((s) => s.agentName);

  for (const { agentName, finalizedContent } of summaries) {
    await prisma.agentTaskArchive.upsert({
      where: {
        agentName_archiveDate: { agentName, archiveDate },
      },
      create: { agentName, archiveDate, finalizedContent },
      update: { finalizedContent },
    });
  }

  const updated = await prisma.agentTask.updateMany({
    where: {
      agentName: { in: agentNames },
      createdAt: { gte: startOfDay, lte: endOfDay },
      archivedAt: null,
    },
    data: { archivedAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    date: archiveDate,
    summaries_count: summaries.length,
    tasks_archived: updated.count,
  });
}
