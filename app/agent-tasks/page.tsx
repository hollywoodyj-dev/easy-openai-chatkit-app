import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  replied: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  closed: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

type TaskRow =
  | { type: "summary"; agentName: string; finalizedContent: string }
  | { type: "task"; agentName: string; task: { id: string; title: string; description: string | null; status: string; replyContent: string | null; createdAt: Date; updatedAt: Date } };

export default async function AgentTasksPage() {
  const [tasks, latestSummaries] = await Promise.all([
    prisma.agentTask.findMany({
      where: { archivedAt: null },
      orderBy: [{ agentName: "asc" }, { createdAt: "asc" }],
      take: 500,
    }),
    prisma.agentTaskArchive.findFirst({
      orderBy: { archiveDate: "desc" },
      select: { archiveDate: true },
    }).then((latest) =>
      latest
        ? prisma.agentTaskArchive.findMany({
            where: { archiveDate: latest.archiveDate },
            orderBy: { agentName: "asc" },
          })
        : []
    ),
  ]);

  const summaryByAgent = new Map(
    latestSummaries.map((s) => [s.agentName, s.finalizedContent])
  );
  const tasksByAgent = new Map<string, typeof tasks>();
  for (const t of tasks) {
    if (!tasksByAgent.has(t.agentName)) tasksByAgent.set(t.agentName, []);
    tasksByAgent.get(t.agentName)!.push(t);
  }
  const agentNames = new Set<string>([
    ...summaryByAgent.keys(),
    ...tasksByAgent.keys(),
  ]);
  const rows: TaskRow[] = [];
  for (const agentName of [...agentNames].sort()) {
    const summary = summaryByAgent.get(agentName);
    if (summary) {
      rows.push({ type: "summary", agentName, finalizedContent: summary });
    }
    for (const task of tasksByAgent.get(agentName) ?? []) {
      rows.push({ type: "task", agentName, task });
    }
  }

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Task list
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/agent-tasks/archive"
              className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
            >
              Archive by date
            </Link>
            <Link
              href="/"
              className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
            >
              Back
            </Link>
          </div>
        </header>

        <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
          For each agent: summary (from latest archive) as the first row to start the day; then today&apos;s open tasks. The list fills as the day goes on. Full history: <Link href="/agent-tasks/archive" className="underline">Archive by date</Link>.
        </p>

        {rows.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 py-8">
            No tasks yet. Create tasks via the API or assign work to agents. After Tree archives a day, each agent&apos;s summary will appear here as the first row for the next day.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-sm min-w-[640px]">
              <colgroup>
                <col className="w-20" />
                <col className="min-w-[120px]" />
                <col className="min-w-[160px]" />
                <col className="w-24" />
                <col className="min-w-[180px]" />
                <col className="w-28" />
                <col className="w-28" />
              </colgroup>
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Reply</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {rows.map((row, idx) =>
                  row.type === "summary" ? (
                    <tr
                      key={`summary-${row.agentName}-${idx}`}
                      className="bg-slate-50/80 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 align-top">
                        {row.agentName}
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300 align-top italic">
                        Summary — start for today
                      </td>
                      <td
                        colSpan={5}
                        className="px-4 py-3 text-slate-600 dark:text-slate-400 align-top break-words whitespace-pre-wrap"
                      >
                        {row.finalizedContent}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={row.task.id}
                      className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 align-top">
                        {row.agentName}
                      </td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-200 align-top break-words">
                        {row.task.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 align-top break-words whitespace-pre-wrap">
                        {row.task.description ?? "—"}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            STATUS_COLORS[row.task.status] ?? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {row.task.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400 align-top break-words whitespace-pre-wrap">
                        {row.task.replyContent ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-500 text-xs whitespace-nowrap align-top">
                        {row.task.createdAt.toLocaleDateString()} {row.task.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-500 text-xs whitespace-nowrap align-top">
                        {row.task.updatedAt.toLocaleDateString()} {row.task.updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          Tasks are created and updated via the Agent Tasks API. Tree finalizes the day via POST /api/agent-tasks/archive (admin key); that creates the summary row for the next day.
        </p>
      </div>
    </main>
  );
}
