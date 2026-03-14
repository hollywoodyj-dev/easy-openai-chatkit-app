import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  replied: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  closed: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

export default async function AgentTasksPage() {
  const [tasks, latestArchive] = await Promise.all([
    prisma.agentTask.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.agentTaskArchive.findFirst({
      orderBy: { archiveDate: "desc" },
      select: { archiveDate: true },
    }),
  ]);

  const archiveSummaries = latestArchive
    ? await prisma.agentTaskArchive.findMany({
        where: { archiveDate: latestArchive.archiveDate },
        orderBy: { agentName: "asc" },
      })
    : [];

  const archiveDate = latestArchive?.archiveDate;
  const startOfDay = archiveDate ? new Date(archiveDate + "T00:00:00.000Z") : null;
  const endOfDay = archiveDate ? new Date(archiveDate + "T23:59:59.999Z") : null;
  const archivedTasks =
    startOfDay && endOfDay
      ? await prisma.agentTask.findMany({
          where: {
            archivedAt: { not: null },
            createdAt: { gte: startOfDay, lte: endOfDay },
          },
          orderBy: [{ agentName: "asc" }, { createdAt: "asc" }],
        })
      : [];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Agent tasks
          </h1>
          <Link
            href="/"
            className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
          >
            Back
          </Link>
        </header>

        {archiveSummaries.length > 0 && (
          <section className="mb-8 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-4">
            <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">
              Archive — {latestArchive!.archiveDate} (finalized by Tree)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
              Latest day&apos;s finalized summaries per agent and the full list of tasks and replies for that day. Older archives are stored and can be queried via API.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Summaries (finalized by Tree)
                </h3>
                <div className="space-y-3">
                  {archiveSummaries.map((s) => (
                    <div
                      key={`${s.agentName}-${s.archiveDate}`}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
                    >
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                        {s.agentName}
                      </p>
                      <p className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                        {s.finalizedContent}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              {archivedTasks.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    Tasks & replies for this day
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left text-sm min-w-[640px]">
                      <colgroup>
                        <col className="w-20" />
                        <col className="min-w-[120px]" />
                        <col className="min-w-[160px]" />
                        <col className="w-24" />
                        <col className="min-w-[180px]" />
                        <col className="w-28" />
                      </colgroup>
                      <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-2 font-medium">Agent</th>
                          <th className="px-4 py-2 font-medium">Title</th>
                          <th className="px-4 py-2 font-medium">Description</th>
                          <th className="px-4 py-2 font-medium">Status</th>
                          <th className="px-4 py-2 font-medium">Reply</th>
                          <th className="px-4 py-2 font-medium">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900">
                        {archivedTasks.map((t) => (
                          <tr
                            key={t.id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          >
                            <td className="px-4 py-2 font-medium text-slate-800 dark:text-slate-200 align-top">
                              {t.agentName}
                            </td>
                            <td className="px-4 py-2 text-slate-800 dark:text-slate-200 align-top break-words">
                              {t.title}
                            </td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-400 align-top break-words whitespace-pre-wrap">
                              {t.description ?? "—"}
                            </td>
                            <td className="px-4 py-2 align-top">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                  STATUS_COLORS[t.status] ?? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {t.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-slate-600 dark:text-slate-400 align-top break-words whitespace-pre-wrap">
                              {t.replyContent ?? "—"}
                            </td>
                            <td className="px-4 py-2 text-slate-500 dark:text-slate-500 text-xs whitespace-nowrap align-top">
                              {t.createdAt.toLocaleDateString()} {t.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Current tasks (not archived)
        </h2>
        {tasks.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 py-8">
            No current tasks. Create tasks via the API or assign work to agents. Archived tasks are hidden; use <code className="text-xs bg-slate-200 dark:bg-slate-700 px-1 rounded">?include_archived=1</code> in the API to include them.
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
                {tasks.map((t) => (
                  <tr
                    key={t.id}
                    className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 align-top">
                      {t.agentName}
                    </td>
                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200 align-top break-words">
                      {t.title}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 align-top break-words whitespace-pre-wrap">
                      {t.description ?? "—"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[t.status] ?? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 align-top break-words whitespace-pre-wrap">
                      {t.replyContent ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-500 text-xs whitespace-nowrap align-top">
                      {t.createdAt.toLocaleDateString()} {t.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-500 text-xs whitespace-nowrap align-top">
                      {t.updatedAt.toLocaleDateString()} {t.updatedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
          Tasks are created and updated via the Agent Tasks API. Only non-archived tasks are shown. Tree can finalize the day and archive via POST /api/agent-tasks/archive (admin key).
        </p>
      </div>
    </main>
  );
}
