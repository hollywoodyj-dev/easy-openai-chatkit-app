/**
 * Agent task reply thread: assignee (task.agentName) and Tree (or other coordinators)
 * can alternate without overwriting the assignee's latest reply in `replyContent`.
 */

export type ReplyThreadEntry = {
  author: string;
  content: string;
  createdAt: string;
};

export function parseReplyThread(value: unknown): ReplyThreadEntry[] {
  if (!Array.isArray(value)) return [];
  const out: ReplyThreadEntry[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const author = typeof o.author === "string" ? o.author.trim() : "";
    const content = typeof o.content === "string" ? o.content.trim() : "";
    const createdAt = typeof o.createdAt === "string" ? o.createdAt.trim() : "";
    if (author && content && createdAt) out.push({ author, content, createdAt });
  }
  return out;
}

/** If DB has no thread yet but legacy `replyContent` exists, seed one assignee entry. */
export function mergeLegacyReplyIntoThread(
  thread: ReplyThreadEntry[],
  agentName: string,
  replyContent: string | null,
  legacyTimestamp: Date
): ReplyThreadEntry[] {
  if (thread.length > 0) return thread;
  const c = replyContent?.trim();
  if (!c) return thread;
  return [{ author: agentName, content: c, createdAt: legacyTimestamp.toISOString() }];
}

export function latestAssigneeContent(thread: ReplyThreadEntry[], agentName: string): string | null {
  for (let i = thread.length - 1; i >= 0; i--) {
    if (thread[i].author === agentName) return thread[i].content;
  }
  return null;
}

export function appendAssigneeMessage(
  thread: ReplyThreadEntry[],
  agentName: string,
  content: string
): ReplyThreadEntry[] {
  return [
    ...thread,
    { author: agentName, content, createdAt: new Date().toISOString() },
  ];
}

export function appendCoordinatorMessage(
  thread: ReplyThreadEntry[],
  content: string,
  author: string
): ReplyThreadEntry[] {
  const a = author.trim() || "Tree";
  return [...thread, { author: a, content, createdAt: new Date().toISOString() }];
}

export function formatReplyThreadForDisplay(entries: ReplyThreadEntry[]): string {
  if (entries.length === 0) return "";
  return entries
    .map((e) => {
      const t = new Date(e.createdAt);
      const time = Number.isNaN(t.getTime())
        ? e.createdAt
        : t.toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
      return `[${e.author} · ${time}]\n${e.content}`;
    })
    .join("\n\n—\n\n");
}

/** UI + API consumers: merge stored thread with legacy `reply_content` when `reply_thread` is empty. */
export function buildDisplayThreadEntries(
  replyThread: unknown,
  agentName: string,
  replyContent: string | null,
  updatedAt: Date
): ReplyThreadEntry[] {
  const thread = parseReplyThread(replyThread);
  return mergeLegacyReplyIntoThread(thread, agentName, replyContent, updatedAt);
}

export function formatTaskReplyCell(
  replyThread: unknown,
  agentName: string,
  replyContent: string | null,
  updatedAt: Date
): string {
  const entries = buildDisplayThreadEntries(replyThread, agentName, replyContent, updatedAt);
  if (entries.length > 0) return formatReplyThreadForDisplay(entries);
  return replyContent?.trim() ? replyContent.trim() : "—";
}
