"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  CHAT_SESSION_ENDPOINT,
  CHAT_SESSIONS_LIST_ENDPOINT,
  CHAT_MESSAGES_ENDPOINT,
  CHAT_TURN_ENDPOINT,
} from "@/lib/config";

const CHAT_SESSION_STORAGE_KEY = "chat_session_id";

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

/**
 * Preferred persisted chat: session_id from POST /api/chat/session or resumed from sessionStorage.
 * All turns saved via POST /api/chat/turn; messages loaded by user_id + session_id (GET /api/chat/messages).
 */
export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [historySessions, setHistorySessions] = useState<SessionItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async (sid: string): Promise<MessageRow[]> => {
    const res = await fetch(
      `${CHAT_MESSAGES_ENDPOINT}?session_id=${encodeURIComponent(sid)}`,
      { credentials: "include" }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data.error as string) || res.statusText);
    }
    const data = await res.json();
    return (data.messages ?? []) as MessageRow[];
  }, []);

  const createSession = useCallback(async (): Promise<string> => {
    const res = await fetch(CHAT_SESSION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  }, []);

  const initOrResumeSession = useCallback(async () => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(CHAT_SESSION_STORAGE_KEY);
    if (stored) {
      try {
        const list = await fetchMessages(stored);
        setSessionId(stored);
        setMessages(list);
        setError(null);
        setSessionLoading(false);
        return;
      } catch {
        sessionStorage.removeItem(CHAT_SESSION_STORAGE_KEY);
      }
    }
    try {
      const sid = await createSession();
      sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, sid);
      setSessionId(sid);
      const list = await fetchMessages(sid);
      setMessages(list);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create session");
    } finally {
      setSessionLoading(false);
    }
  }, [createSession, fetchMessages]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await initOrResumeSession();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [initOrResumeSession]);

  const startNewChat = useCallback(async () => {
    if (typeof window !== "undefined") sessionStorage.removeItem(CHAT_SESSION_STORAGE_KEY);
    setSessionId(null);
    setMessages([]);
    setError(null);
    setSessionLoading(true);
    try {
      const sid = await createSession();
      if (typeof window !== "undefined") sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, sid);
      setSessionId(sid);
      const list = await fetchMessages(sid);
      setMessages(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create session");
    } finally {
      setSessionLoading(false);
    }
  }, [createSession, fetchMessages]);

  const fetchSessionsList = useCallback(async (): Promise<SessionItem[]> => {
    const res = await fetch(CHAT_SESSIONS_LIST_ENDPOINT, { credentials: "include" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data.error as string) || res.statusText);
    }
    const data = await res.json();
    return (data.sessions ?? []) as SessionItem[];
  }, []);

  const openSession = useCallback(
    async (sid: string) => {
      setShowHistoryPanel(false);
      setSessionLoading(true);
      try {
        if (typeof window !== "undefined") sessionStorage.setItem(CHAT_SESSION_STORAGE_KEY, sid);
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
    [fetchMessages]
  );

  const handleNewChatClick = useCallback(async () => {
    setShowHistoryPanel(true);
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

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || !sessionId || loading) return;
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(CHAT_TURN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      setInput(text);
    } finally {
      setLoading(false);
    }
  }, [input, sessionId, loading]);

  if (sessionLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-white dark:bg-slate-900 p-4">
        <p className="text-slate-500">Loading session...</p>
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
    <main className="flex flex-col h-[100dvh] bg-white dark:bg-slate-900">
      <header className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <h1 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Chat
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleNewChatClick}
            className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
          >
            New chat
          </button>
          <Link
            href="/embed"
            className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
          >
            Legacy (ChatKit)
          </Link>
        </div>
      </header>

      {showHistoryPanel && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowHistoryPanel(false)}>
          <div
            className="w-full max-w-md rounded-xl bg-white dark:bg-slate-800 shadow-xl p-4 max-h-[80dvh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">Chat history</h2>
              <button
                type="button"
                onClick={() => setShowHistoryPanel(false)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              onClick={async () => {
                setShowHistoryPanel(false);
                await startNewChat();
              }}
              className="w-full rounded-lg bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 py-2.5 text-sm font-medium mb-4"
            >
              Start new conversation
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Previous conversations</p>
            <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              {historyLoading ? (
                <p className="text-sm text-slate-500">Loading…</p>
              ) : historySessions.length === 0 ? (
                <p className="text-sm text-slate-500">No previous conversations.</p>
              ) : (
                historySessions.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => openSession(s.id)}
                    className="w-full text-left rounded-lg px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 truncate"
                    title={s.topic}
                  >
                    <span className="block truncate">{s.topic}</span>
                    <span className="block text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      {new Date(s.created_at).toLocaleDateString()}
                    </span>
                  </button>
                ))
              )}
            </div>
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
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {messages.length === 0 && (
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Send a message below. Each turn is saved via the backend.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-4 text-right"
                : "mr-4 text-left"
            }
          >
            <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">
              {m.role}
            </span>
            <div
              className={
                m.role === "user"
                  ? "inline-block rounded-lg bg-slate-200 dark:bg-slate-700 px-3 py-2 text-sm"
                  : "rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm whitespace-pre-wrap"
              }
            >
              {m.message}
            </div>
          </div>
        ))}
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
    </main>
  );
}
