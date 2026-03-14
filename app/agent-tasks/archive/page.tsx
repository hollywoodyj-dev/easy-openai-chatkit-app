import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  open: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  replied: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  closed: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
};

type PageProps = { searchParams: Promise<{ date?: string }> };

export default async function ArchiveByDatePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const dateParam = params.date?.trim();
  const allDates = await prisma.agentTaskArchive.findMany({
    select: { archiveDate: true },
    distinct: ["archiveDate"],
    orderBy: { archiveDate: "desc" },
    take: 60,
  });

  const archiveDate = dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)
    ? dateParam
    : allDates[0]?.archiveDate ?? null;

  const [archiveSummaries, archivedTasks] = archiveDate
    ? await Promise.all([
        prisma.agentTaskArchive.findMany({
          where: { archiveDate },
          orderBy: { agentName: "asc" },
        }),
        (() => {
          const start = new Date(archiveDate + "T00:00:00.000Z");
          const end = new Date(archiveDate + "T23:59:59.999Z");
          return prisma.agentTask.findMany({
            where: {
              archivedAt: { not: null },
              createdAt: { gte: start, lte: end },
            },
            orderBy: [{ agentName: "asc" }, { createdAt: "asc" }],
          });
        })(),
      ])
    : [[], []];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 p-4 md:p-6">
      <div className="max-w-[1600px] mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Archive by date
          </h1>
          <div className="flex items-center gap-4">
            {allDates.length > 0 && (
              <nav className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 dark:text-slate-400">Date:</span>
                {allDates.map((d) => (
                  <Link
                    key={d.archiveDate}
                    href={d.archiveDate === archiveDate ? "/agent-tasks/archive" : `/agent-tasks/archive?date=${d.archiveDate}`}
                    className={`text-sm px-2 py-1 rounded ${
                      d.archiveDate === archiveDate
                        ? "bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-medium"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {d.archiveDate}
                  </Link>
                ))}
              </nav>
            )}
            <Link
              href="/agent-tasks"
              className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
            >
              Task list
            </Link>
            <Link
              href="/"
              className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
            >
              Back
            </Link>
          </div>
        </header>

        {!archiveDate ? (
          <p className="text-slate-500 dark:text-slate-400 py-8">
            No archive dates yet. After Tree finalizes a day via POST /api/agent-tasks/archive, that date will appear here.
          </p>
        ) : (
          <div className="space-y-6">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Finalized summaries and full tasks & replies for {archiveDate}.
            </p>
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Summaries (finalized by Tree)
                </h2>
                <div className="space-y-3">
                  {archiveSummaries.map((s) => (
                    <div
                      key={`${s.agentName}-${s.archiveDate}`}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 p-3"
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
                  <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Tasks & replies for this day
                  </h2>
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
          </div>
        )}
      </div>
    </main>
  );
}
