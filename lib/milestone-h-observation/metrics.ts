import type { ObservationDailySummary, ObservationReviewLog } from "./types";

export function buildDailySummary(
  date: string,
  logs: ObservationReviewLog[]
): ObservationDailySummary {
  const totalReviewed = logs.length;
  const hAppearedCount = logs.filter((x) => x.hAppeared).length;
  const hSuppressedCount = totalReviewed - hAppearedCount;

  return {
    date,
    totalReviewed,
    hAppearedCount,
    hSuppressedCount,
    suppressionRatio:
      totalReviewed === 0 ? 0 : hSuppressedCount / totalReviewed,

    removalBetterCount: logs.filter((x) => x.removalResult === "better")
      .length,
    removalSameCount: logs.filter((x) => x.removalResult === "same").length,
    removalWorseCount: logs.filter((x) => x.removalResult === "worse").length,

    guidanceDriftCount: logs.filter((x) => x.guidanceDrift).length,
    interpretiveDriftCount: logs.filter((x) => x.interpretiveDrift).length,
    authorityDriftCount: logs.filter((x) => x.authorityDrift).length,
    weightDriftCount: logs.filter((x) => x.weightDrift).length,
    duplicationDriftCount: logs.filter((x) => x.duplicationDrift).length,

    slightlyNoticeableCount: logs.filter(
      (x) => x.hNoticeability === "slightly_noticeable"
    ).length,
    clearlyNoticeableCount: logs.filter(
      (x) => x.hNoticeability === "clearly_noticeable"
    ).length,

    passCount: logs.filter((x) => x.verdict === "pass").length,
    reviseCount: logs.filter((x) => x.verdict === "revise").length,
    removeCount: logs.filter((x) => x.verdict === "remove").length,
  };
}

export function summaryToMarkdown(summary: ObservationDailySummary): string {
  const pct = (n: number) =>
    `${(n * 100).toFixed(1)}%`;
  return [
    `# Milestone H — Observation daily summary (${summary.date})`,
    "",
    "| Metric | Value |",
    "|--------|-------|",
    `| Total reviewed | ${summary.totalReviewed} |`,
    `| H appeared | ${summary.hAppearedCount} |`,
    `| No H (operator count) | ${summary.hSuppressedCount} |`,
    `| Suppression ratio | ${pct(summary.suppressionRatio)} |`,
    `| Removal: better / same / worse | ${summary.removalBetterCount} / ${summary.removalSameCount} / ${summary.removalWorseCount} |`,
    `| Verdict: pass / revise / remove | ${summary.passCount} / ${summary.reviseCount} / ${summary.removeCount} |`,
    `| Drift (guidance / interpretive / authority / weight / dup) | ${summary.guidanceDriftCount} / ${summary.interpretiveDriftCount} / ${summary.authorityDriftCount} / ${summary.weightDriftCount} / ${summary.duplicationDriftCount} |`,
    `| Noticeability: slightly / clearly | ${summary.slightlyNoticeableCount} / ${summary.clearlyNoticeableCount} |`,
    "",
    "_Human interpretation required — tool does not auto-close Milestone H._",
    "",
  ].join("\n");
}

export function summaryToCsv(summary: ObservationDailySummary): string {
  const headers = [
    "date",
    "totalReviewed",
    "hAppearedCount",
    "hSuppressedCount",
    "suppressionRatio",
    "removalBetterCount",
    "removalSameCount",
    "removalWorseCount",
    "guidanceDriftCount",
    "interpretiveDriftCount",
    "authorityDriftCount",
    "weightDriftCount",
    "duplicationDriftCount",
    "slightlyNoticeableCount",
    "clearlyNoticeableCount",
    "passCount",
    "reviseCount",
    "removeCount",
  ];
  const row = headers.map((h) => {
    const v = summary[h as keyof ObservationDailySummary];
    return typeof v === "number" ? String(v) : `"${String(v)}"`;
  });
  return [headers.join(","), row.join(",")].join("\n");
}
