/**
 * E2 Pass 4 (stale-window) — backdate Insight.createdAt / lastSeenAt for ONE conversation.
 *
 * Use only on local, staging, or explicitly approved QA databases.
 * Do NOT run against production user data without ops + data-owner approval.
 *
 * Usage:
 *   node scripts/e2-qa-backdate-conversation-insights.cjs --conversation-id=<cuid> --dry-run
 *   E2_QA_BACKDATE_CONFIRM=BACKDATE_INSIGHTS_QA node scripts/e2-qa-backdate-conversation-insights.cjs --conversation-id=<cuid> --days-ago=8
 *
 * Optional: --user-id=<id> to further scope rows (must match Insight.userId).
 *
 * Default --days-ago=8 exceeds the provisional 7-day stale threshold in turn/route.ts
 * (E2_NEWEST_ALIGNED_MAX_AGE_MS). Use --days-ago=6 for a negative control (should NOT suppress).
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function parseArgs() {
  const out = {
    conversationId: null,
    daysAgo: 8,
    dryRun: false,
    userId: null,
  };
  for (const a of process.argv.slice(2)) {
    if (a === "--dry-run") out.dryRun = true;
    else if (a.startsWith("--conversation-id="))
      out.conversationId = a.slice("--conversation-id=".length).trim();
    else if (a.startsWith("--days-ago="))
      out.daysAgo = Math.max(0, Number(a.slice("--days-ago=".length)) || 8);
    else if (a.startsWith("--user-id=")) out.userId = a.slice("--user-id=".length).trim();
  }
  return out;
}

async function main() {
  const args = parseArgs();
  if (!args.conversationId) {
    console.error(
      "Usage: node scripts/e2-qa-backdate-conversation-insights.cjs --conversation-id=<id> [--days-ago=8] [--user-id=<id>] [--dry-run]"
    );
    console.error(
      "Writes require: E2_QA_BACKDATE_CONFIRM=BACKDATE_INSIGHTS_QA (see script header)."
    );
    process.exit(1);
  }

  if (!args.dryRun && process.env.E2_QA_BACKDATE_CONFIRM !== "BACKDATE_INSIGHTS_QA") {
    console.error(
      "Refusing to write: set E2_QA_BACKDATE_CONFIRM=BACKDATE_INSIGHTS_QA or pass --dry-run"
    );
    process.exit(1);
  }

  const targetDate = new Date(Date.now() - args.daysAgo * 24 * 60 * 60 * 1000);
  /** @type {{ conversationId: string, userId?: string }} */
  const where = { conversationId: args.conversationId };
  if (args.userId) where.userId = args.userId;

  const rows = await prisma.insight.findMany({
    where,
    select: {
      id: true,
      userId: true,
      createdAt: true,
      lastSeenAt: true,
      corePattern: true,
      isContinuityEligible: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log(`[e2-qa-backdate] conversationId=${args.conversationId} insights=${rows.length}`);
  for (const r of rows) {
    const snippet = (r.corePattern || "").replace(/\s+/g, " ").slice(0, 72);
    console.log(
      `  ${r.id} eligible=${r.isContinuityEligible} createdAt=${r.createdAt.toISOString()} | ${snippet}`
    );
  }

  if (args.dryRun) {
    console.log(
      `\n[dry-run] Would set createdAt + lastSeenAt to ${targetDate.toISOString()} (${args.daysAgo} days ago)`
    );
    return;
  }

  const result = await prisma.insight.updateMany({
    where,
    data: {
      createdAt: targetDate,
      lastSeenAt: targetDate,
    },
  });

  console.log(`[e2-qa-backdate] updated rows: ${result.count}`);
  console.log(
    "Next: send a fresh same-family turn in /chat for this session; expect debug_recurrence_e2_suppressed_stale_window true when days-ago > 7 (provisional)."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
