"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CHAT_SESSION_ENDPOINT,
  CHAT_AUTH_CHECK_ENDPOINT,
  CHAT_SESSIONS_LIST_ENDPOINT,
  CHAT_MESSAGES_ENDPOINT,
  CHAT_TURN_ENDPOINT,
  CHAT_REFLECTION_ENDPOINT,
} from "@/lib/config";

const CHAT_SESSION_STORAGE_KEY_PREFIX = "chat_session_id";

type MessageRow = {
  id: string;
  role: string;
  message: string;
  created_at: string;
};

type SessionItem = {
  id: string;
  created_at: string;
  topic: string;
};

type CheckpointRow = {
  id: string;
  summary: string;
  user_input: string | null;
  created_at: string;
};

/**
 * Preferred persisted chat: session_id from POST /api/chat/session or resumed from sessionStorage.
 * All turns saved via POST /api/chat/turn; messages loaded by user_id + session_id (GET /api/chat/messages).
 */
function ChatContent() {
  const searchParams = useSearchParams();
  const token = useMemo(
    () => searchParams?.get("token")?.trim() || null,
    [searchParams]
  );

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [historySessions, setHistorySessions] = useState<SessionItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [mobileConversationsOpen, setMobileConversationsOpen] = useState(false);
  const [checkpoints, setCheckpoints] = useState<CheckpointRow[]>([]);
  const [checkpointInput, setCheckpointInput] = useState("");
  const [checkpointLoading, setCheckpointLoading] = useState(false);
  const [showCheckpointForm, setShowCheckpointForm] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [thinkingDots, setThinkingDots] = useState(0);

  const authHeaders = useCallback((): HeadersInit => {
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }, [token]);

  const sessionStorageKey = useCallback(() => {
    // Scope per account so switching users doesn't reuse the same session_id.
    const suffix = token ? token.slice(0, 24) : "anon";
    return `${CHAT_SESSION_STORAGE_KEY_PREFIX}:${suffix}`;
  }, [token]);

  const fetchMessages = useCallback(async (sid: string): Promise<MessageRow[]> => {
    const res = await fetch(
      `${CHAT_MESSAGES_ENDPOINT}?session_id=${encodeURIComponent(sid)}`,
      { credentials: "include", headers: authHeaders() }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data.error as string) || res.statusText);
    }
    const data = await res.json();
    return (data.messages ?? []) as MessageRow[];
  }, [authHeaders]);

  const createSession = useCallback(async (): Promise<string> => {
    const res = await fetch(CHAT_SESSION_ENDPOINT, {
      method: "POST",
      headers: authHeaders(),
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data.error as string) || res.statusText);
    }
    const data = await res.json();
    const sid = data.session_id;
    if (!sid || typeof sid !== "string") throw new Error("No session_id in response");
    return sid;
  }, [authHeaders]);

  const fetchSessionsList = useCallback(async (): Promise<SessionItem[]> => {
    const res = await fetch(CHAT_SESSIONS_LIST_ENDPOINT, {
      credentials: "include",
      headers: authHeaders(),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data.error as string) || res.statusText);
    }
    const data = await res.json();
    return (data.sessions ?? []) as SessionItem[];
  }, [authHeaders]);

  /** Refresh sidebar conversation list; safe to call on load and after turns. */
  const refreshHistorySessions = useCallback(async () => {
    try {
      const list = await fetchSessionsList();
      setHistorySessions(list);
    } catch {
      setHistorySessions([]);
    }
  }, [fetchSessionsList]);

  const initOrResumeSession = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (token) {
      const res = await fetch(CHAT_AUTH_CHECK_ENDPOINT, {
        credentials: "include",
        headers: authHeaders(),
      });
      if (res.status === 401) {
        setTokenInvalid(true);
        setSessionLoading(false);
        return;
      }
    }
    const stored = sessionStorage.getItem(sessionStorageKey());
    if (stored) {
      try {
        const list = await fetchMessages(stored);
        setSessionId(stored);
        setMessages(list);
        setError(null);
        setSessionLoading(false);
        await refreshHistorySessions();
        return;
      } catch {
        sessionStorage.removeItem(sessionStorageKey());
      }
    }
    try {
      const sid = await createSession();
      sessionStorage.setItem(sessionStorageKey(), sid);
      setSessionId(sid);
      const list = await fetchMessages(sid);
      setMessages(list);
      setError(null);
      await refreshHistorySessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create session");
    } finally {
      setSessionLoading(false);
    }
  }, [token, authHeaders, createSession, fetchMessages, sessionStorageKey, refreshHistorySessions]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await initOrResumeSession();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [initOrResumeSession]);

  const startNewChat = useCallback(async () => {
    setMobileConversationsOpen(false);
    if (typeof window !== "undefined") sessionStorage.removeItem(sessionStorageKey());
    setSessionId(null);
    setMessages([]);
    setError(null);
    setSessionLoading(true);
    try {
      const sid = await createSession();
      if (typeof window !== "undefined") sessionStorage.setItem(sessionStorageKey(), sid);
      setSessionId(sid);
      const list = await fetchMessages(sid);
      setMessages(list);
      await refreshHistorySessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create session");
    } finally {
      setSessionLoading(false);
    }
  }, [createSession, fetchMessages, sessionStorageKey, refreshHistorySessions]);

  const openSession = useCallback(
    async (sid: string) => {
      setMobileConversationsOpen(false);
      setSessionLoading(true);
      try {
        if (typeof window !== "undefined") sessionStorage.setItem(sessionStorageKey(), sid);
        setSessionId(sid);
        const list = await fetchMessages(sid);
        setMessages(list);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load conversation");
      } finally {
        setSessionLoading(false);
      }
    },
    [fetchMessages, sessionStorageKey]
  );

  const handleNewChatClick = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const list = await fetchSessionsList();
      setHistorySessions(list);
    } catch {
      setHistorySessions([]);
    } finally {
      setHistoryLoading(false);
    }
  }, [fetchSessionsList]);

  const fetchCheckpoints = useCallback(async (sid: string): Promise<CheckpointRow[]> => {
    const res = await fetch(
      `${CHAT_REFLECTION_ENDPOINT}?session_id=${encodeURIComponent(sid)}`,
      { credentials: "include", headers: authHeaders() }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.checkpoints ?? []) as CheckpointRow[];
  }, [authHeaders]);

  const saveCheckpoint = useCallback(async () => {
    if (!sessionId || checkpointLoading) return;
    setCheckpointLoading(true);
    setError(null);
    try {
      const res = await fetch(CHAT_REFLECTION_ENDPOINT, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({
          session_id: sessionId,
          user_reflection: checkpointInput.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.details as string) || (data.error as string) || res.statusText);
        return;
      }
      setCheckpointInput("");
      setShowCheckpointForm(false);
      const list = await fetchCheckpoints(sessionId);
      setCheckpoints(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reflection failed");
    } finally {
      setCheckpointLoading(false);
    }
  }, [sessionId, checkpointInput, checkpointLoading, authHeaders, fetchCheckpoints]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  // Simple animated "Thinking.", "Thinking..", "Thinking..." indicator while waiting for a response.
  useEffect(() => {
    if (!loading) {
      setThinkingDots(0);
      return;
    }
    const id = setInterval(() => {
      setThinkingDots((prev) => (prev + 1) % 3);
    }, 500);
    return () => {
      clearInterval(id);
    };
  }, [loading]);

  useEffect(() => {
    if (!sessionId) {
      setCheckpoints([]);
      return;
    }
    let cancelled = false;
    fetchCheckpoints(sessionId).then((list) => {
      if (!cancelled) setCheckpoints(list);
    });
    return () => { cancelled = true; };
  }, [sessionId, fetchCheckpoints]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || !sessionId || loading) return;
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(CHAT_TURN_ENDPOINT, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({ session_id: sessionId, message: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (data.details as string) || (data.error as string) || res.statusText;
        setError(msg);
        setInput(text);
        return;
      }
      const assistantMessage = (data.assistant_message as string) ?? "";
      const now = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, role: "user", message: text, created_at: now },
        { id: `assistant-${Date.now()}`, role: "assistant", message: assistantMessage, created_at: now },
      ]);
      refreshHistorySessions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      setInput(text);
    } finally {
      setLoading(false);
    }
  }, [input, sessionId, loading, authHeaders, refreshHistorySessions]);

  if (sessionLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-white dark:bg-slate-900 p-4">
        <p className="text-slate-500">Loading session...</p>
      </main>
    );
  }

  if (tokenInvalid) {
    return (
      <main className="flex min-h-screen flex-col bg-white dark:bg-slate-900 p-4 items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Invalid or expired sign-in link
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your sign-in link may be invalid or expired. Sign in again to use chat with your account, or continue without an account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/login"
              className="rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-4 py-2 text-sm font-medium"
            >
              Sign in again
            </Link>
            <Link
              href="/chat"
              className="rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Continue without account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (error && !sessionId) {
    return (
      <main className="flex min-h-screen flex-col bg-white dark:bg-slate-900 p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => { setError(null); setSessionLoading(true); initOrResumeSession(); }}
            className="text-slate-700 dark:text-slate-300 underline"
          >
            Try again
          </button>
          <Link href="/embed" className="text-slate-600 dark:text-slate-400 underline">Back</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex h-[100dvh] bg-white dark:bg-slate-900">
      {/* Mobile: conversation list drawer */}
      {mobileConversationsOpen && (
        <div className="fixed inset-0 z-50 sm:hidden" aria-modal="true" role="dialog">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileConversationsOpen(false)}
            aria-label="Close conversations"
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] flex flex-col bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Conversations
              </span>
              <button
                type="button"
                onClick={() => setMobileConversationsOpen(false)}
                className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:underline"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
              {historyLoading ? (
                <p className="px-2 py-1 text-xs text-slate-500">Loading…</p>
              ) : historySessions.length === 0 ? (
                <p className="px-2 py-1 text-xs text-slate-500">No saved conversations yet.</p>
              ) : (
                historySessions.map((s) => {
                  const isActive = s.id === sessionId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => openSession(s.id)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-xs ${
                        isActive
                          ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      title={s.topic}
                    >
                      <span className="block truncate">{s.topic}</span>
                      <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {new Date(s.created_at).toLocaleDateString()}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
            <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => startNewChat()}
                className="w-full text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:underline py-1"
              >
                New conversation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left: conversation list (desktop) */}
      <aside className="hidden sm:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80">
        <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Conversations
          </h2>
          <button
            type="button"
            onClick={() => startNewChat()}
            className="text-xs font-medium text-slate-700 dark:text-slate-200 hover:underline"
          >
            New
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {historyLoading ? (
            <p className="px-2 py-1 text-xs text-slate-500">Loading…</p>
          ) : historySessions.length === 0 ? (
            <p className="px-2 py-1 text-xs text-slate-500">No saved conversations yet.</p>
          ) : (
            historySessions.map((s) => {
              const isActive = s.id === sessionId;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => openSession(s.id)}
                  className={`w-full text-left rounded-lg px-3 py-2 text-xs ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  title={s.topic}
                >
                  <span className="block truncate">{s.topic}</span>
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {new Date(s.created_at).toLocaleDateString()}
                  </span>
                </button>
              );
            })
          )}
        </div>
        <footer className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500">
          <Link
            href={token ? `/embed?token=${encodeURIComponent(token)}` : "/embed"}
            className="hover:underline"
          >
            Legacy (ChatKit)
          </Link>
        </footer>
      </aside>

      {/* Right: active chat */}
      <section className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-800 shrink-0 flex-wrap">
          <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Chat
          </h1>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:underline"
              onClick={() => setShowCheckpointForm((v) => !v)}
              disabled={!sessionId}
              title="Save a reflection checkpoint"
            >
              Checkpoint
            </button>
            <button
              type="button"
              className="text-xs text-slate-600 dark:text-slate-400 hover:underline sm:hidden"
              onClick={() => {
                setMobileConversationsOpen(true);
                handleNewChatClick();
              }}
            >
              Conversations
            </button>
          </div>
        </header>
        {showCheckpointForm && sessionId && (
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Optional: add a note for this reflection</p>
            <textarea
              value={checkpointInput}
              onChange={(e) => setCheckpointInput(e.target.value)}
              placeholder="What stands out to you right now?"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 mb-2"
              rows={2}
              disabled={checkpointLoading}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveCheckpoint}
                disabled={checkpointLoading}
                className="rounded-lg bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
              >
                {checkpointLoading ? "Saving…" : "Save reflection"}
              </button>
              <button
                type="button"
                onClick={() => { setShowCheckpointForm(false); setCheckpointInput(""); }}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm flex items-center justify-between gap-2">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline"
          >
            Dismiss
          </button>
        </div>
        )}
        {checkpoints.length > 0 && (
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-900/10">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Reflection checkpoints</p>
            <div className="space-y-2">
              {checkpoints.slice(0, 5).map((c) => (
                <div key={c.id} className="rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-300">
                  <p className="whitespace-pre-wrap">{c.summary}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
              {checkpoints.length > 5 && (
                <p className="text-xs text-slate-400">+ {checkpoints.length - 5} more</p>
              )}
            </div>
          </div>
        )}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
        {messages.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Send a message below. Each turn is saved via the backend.
          </p>
        )}
        {messages.map((m) => {
          const label =
            m.role === "user" ? "You" : m.role === "assistant" ? "Wisewave" : m.role;
          const isUser = m.role === "user";
          return (
            <div
              key={m.id}
              className={isUser ? "ml-4 text-right" : "mr-4 text-left"}
            >
              <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">
                {label}
              </span>
              <div
                className={
                  isUser
                    ? "inline-block rounded-lg bg-slate-200 dark:bg-slate-700 px-3 py-2 text-sm"
                    : "rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm whitespace-pre-wrap"
                }
              >
                {m.message}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="ml-4 text-left text-xs text-slate-400 dark:text-slate-500">
            Thinking{"." + ".".repeat(thinkingDots)}
          </div>
        )}
        </div>
        <form
        className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "…" : "Send"}
          </button>
        </div>
      </form>
      </section>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col bg-white dark:bg-slate-900 p-4">
          <p className="text-slate-500">Loading…</p>
        </main>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
