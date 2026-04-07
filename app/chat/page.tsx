"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CHAT_AUTH_CHECK_ENDPOINT,
  CHAT_MESSAGES_ENDPOINT,
  CHAT_SESSION_ENDPOINT,
  CHAT_SESSIONS_LIST_ENDPOINT,
  CHAT_THREADS_ENDPOINT,
  CHAT_TURN_ENDPOINT,
  CHAT_CONTINUITY_ENDPOINT,
} from "@/lib/config";

type AssistantPayload = {
  main_reflection: string;
  last_insight?: string;
  pattern_surfacing?: string;
  micro_awareness?: string;
  soft_continuity?: string;
  micro_shift?: string;
};

type ChatMessage =
  | {
      id: string;
      role: "user";
      text: string;
      createdAt: string;
    }
  | {
      id: string;
      role: "assistant";
      payload: AssistantPayload;
      createdAt: string;
    };

type TurnResponseBody = {
  conversation_id?: string;
  assistant_message?: string;
  response?: AssistantPayload;
  phase_4?: {
    thread_legibility?: string;
    current_space_marker?: string | null;
  };
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    createdAt: new Date().toISOString(),
    payload: {
      main_reflection: "You can begin anywhere. Even one honest line is enough.",
    },
  },
];

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function safeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

type ApiChatMessage = {
  id: string;
  role: string;
  message: string;
  created_at: string;
};

function mapApiMessagesToState(rows: ApiChatMessage[]): ChatMessage[] {
  const out: ChatMessage[] = [];
  for (const m of rows) {
    if (m.role === "user") {
      out.push({
        id: m.id,
        role: "user",
        text: m.message,
        createdAt: m.created_at,
      });
    } else if (m.role === "assistant") {
      out.push({
        id: m.id,
        role: "assistant",
        payload: { main_reflection: m.message },
        createdAt: m.created_at,
      });
    }
  }
  return out;
}

function extractAssistantPayload(data: TurnResponseBody): AssistantPayload {
  if (data.response?.main_reflection) {
    return data.response;
  }
  if (data.assistant_message) {
    return { main_reflection: data.assistant_message };
  }
  return {
    main_reflection: "Something here still feels present. You can stay with it one line at a time.",
  };
}

function Header({
  continueOpen,
  onToggleContinue,
}: {
  continueOpen: boolean;
  onToggleContinue: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[#F7F5F2]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 md:px-8">
        <div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-[#7A7A7A]">Wisewave</div>
          <div className="mt-1 text-sm text-[#4E4E4E]">A quieter kind of intelligence</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#7C9082]/70" />
          <span className="text-sm text-[#7A7A7A]">present</span>
          <button
            onClick={onToggleContinue}
            type="button"
            className={cn(
              "ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[#777] transition",
              continueOpen ? "bg-white" : "bg-white/65 hover:bg-white"
            )}
            aria-label={continueOpen ? "Close Continue" : "Open Continue"}
            aria-expanded={continueOpen}
          >
            ...
          </button>
        </div>
      </div>
    </header>
  );
}

/** Phase 4 — soft orientation only; secondary to main reflection (addendum: current-space marker). */
function CurrentSpaceMarker({
  legibility,
  marker,
}: {
  legibility?: string;
  marker?: string | null;
}) {
  if (legibility !== "low" || !marker?.trim()) return null;
  return (
    <p
      className="mb-2 max-w-[46rem] text-[12px] leading-5 text-[#A8A8A8]"
      aria-live="polite"
    >
      {marker.trim()}
    </p>
  );
}

function InsightAnchor({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <section className="mb-6 max-w-[46rem] rounded-[22px] border border-black/5 bg-white/55 px-4 py-4 shadow-[0_8px_22px_rgba(0,0,0,0.03)] backdrop-blur-sm md:px-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#9A9A9A]">— last insight —</p>
      <p className="mt-2 text-[12px] leading-6 text-[#9A9A9A]">{text}</p>
    </section>
  );
}

function AssistantMessage({ payload }: { payload: AssistantPayload }) {
  const secondaryLine =
    payload.soft_continuity ??
    payload.micro_awareness ??
    payload.pattern_surfacing ??
    payload.last_insight ??
    payload.micro_shift;

  return (
    <div className="max-w-[46rem]">
      <div className="rounded-[28px] bg-white/72 px-5 py-5 shadow-[0_10px_35px_rgba(0,0,0,0.04)] ring-1 ring-black/5 backdrop-blur-sm md:px-6 md:py-6">
        <p className="text-[16px] leading-8 text-[#232323] md:text-[17px]">{payload.main_reflection}</p>
        {secondaryLine ? (
          <>
            <div className="my-4 h-px w-12 bg-black/8" />
            <p className="text-[14px] leading-7 text-[#6A6A6A] md:text-[15px]">{secondaryLine}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="ml-auto max-w-[40rem]">
      <div className="rounded-[24px] bg-[#EEEAE3] px-5 py-4 text-[15px] leading-7 text-[#343434] shadow-[0_8px_24px_rgba(0,0,0,0.03)] ring-1 ring-black/5">
        {text}
      </div>
    </div>
  );
}

function ContinueDrawer({
  open,
  onClose,
  continueRows,
  highlightedId,
  onSelectContinue,
  busyContinueId,
  listLoadError,
}: {
  open: boolean;
  onClose: () => void;
  continueRows: Array<{ id: string; label: string }>;
  highlightedId: string | null;
  onSelectContinue: (continueId: string) => void;
  busyContinueId: string | null;
  listLoadError: string | null;
}) {
  // Continue must be hidden by default. Render nothing when closed (no stray tallies from opacity).
  if (!open) return null;

  return (
    <>
      <button
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-black/10 transition-opacity",
          "pointer-events-auto opacity-100"
        )}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed z-40 rounded-[24px] border border-black/5 bg-[#F8F6F2]/96 p-4 shadow-[0_10px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl transition duration-200",
          "left-1/2 top-[78px] w-[84vw] max-w-[24rem] -translate-x-1/2 md:left-auto md:right-8 md:top-[72px] md:w-[22rem] md:-translate-x-0",
          "pointer-events-auto translate-y-0 opacity-100"
        )}
        role="dialog"
        aria-label="Continue"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm tracking-[0.12em] text-[#6B6B6B]">Continue</p>
          <button onClick={onClose} className="text-sm text-[#7D7D7D]" type="button">
            Close
          </button>
        </div>
        <ul className="space-y-2.5">
          {continueRows.length > 0 ? (
            continueRows.map((row) => (
              <li key={row.id} className="list-none">
                <button
                  type="button"
                  disabled={busyContinueId !== null}
                  onClick={() => onSelectContinue(row.id)}
                  className={cn(
                    "w-full rounded-2xl bg-white/72 px-3.5 py-2.5 text-left text-sm leading-6 text-[#545454] ring-1 ring-black/4 transition",
                    "hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6F8596]/40",
                    busyContinueId !== null && "opacity-60",
                    highlightedId === row.id &&
                      "bg-[#EEF4EF] ring-2 ring-[#7C9082]/35 shadow-[0_0_0_1px_rgba(124,144,130,0.12)]"
                  )}
                >
                  {row.label}
                </button>
              </li>
            ))
          ) : listLoadError ? (
            <li className="rounded-2xl bg-amber-50/90 px-3.5 py-2.5 text-sm leading-6 text-[#6B5344] ring-1 ring-amber-200/80">
              {listLoadError}
            </li>
          ) : (
            <li className="rounded-2xl bg-white/72 px-3.5 py-2.5 text-sm text-[#868686] ring-1 ring-black/4">
              Nothing to continue right now.
            </li>
          )}
        </ul>
      </aside>
    </>
  );
}

function WaitingPulse() {
  return (
    <div className="max-w-[46rem] px-1 py-1">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/55 px-3 py-2 text-sm text-[#7A7A7A] ring-1 ring-black/5 backdrop-blur-sm">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#7C9082]/70" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#7C9082]/50 [animation-delay:160ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#7C9082]/30 [animation-delay:320ms]" />
        </span>
        <span>response continues quietly</span>
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}

function InputBar({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder = "Speak freely.",
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  placeholder?: string;
}) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-black/5 bg-[#F7F5F2]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-4xl px-5 py-4 md:px-8 md:py-5">
        <div className="rounded-[30px] bg-white/78 p-2 shadow-[0_12px_40px_rgba(0,0,0,0.05)] ring-1 ring-black/5 backdrop-blur-sm">
          <div className="flex items-end gap-2 rounded-[24px] px-3 py-2 md:px-4 md:py-3">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit();
                }
              }}
              disabled={disabled}
              rows={1}
              placeholder={placeholder}
              className="max-h-40 min-h-[52px] flex-1 resize-none bg-transparent px-1 py-2 text-[15px] leading-7 text-[#232323] outline-none placeholder:text-[#8B8B8B]"
            />

            <button
              onClick={onSubmit}
              disabled={disabled || !value.trim()}
              className={cn(
                "inline-flex h-11 w-11 items-center justify-center rounded-full transition",
                disabled || !value.trim()
                  ? "bg-[#D9D4CC] text-white"
                  : "bg-[#6F8596] text-white hover:translate-y-[-1px] hover:shadow-md"
              )}
              aria-label="Send message"
              type="button"
            >
              <span className="text-base">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams?.get("token")?.trim() || null, [searchParams]);

  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInvalid, setTokenInvalid] = useState(false);
  const [subscriptionRequired, setSubscriptionRequired] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [minAnchorUntil, setMinAnchorUntil] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [continueDrawerRows, setContinueDrawerRows] = useState<Array<{ id: string; label: string }>>(
    []
  );
  const [threadReentryAnchor, setThreadReentryAnchor] = useState<string | null>(null);
  const [busyContinueId, setBusyContinueId] = useState<string | null>(null);
  const [continueListLoadError, setContinueListLoadError] = useState<string | null>(null);
  const [continueHighlightId, setContinueHighlightId] = useState<string | null>(null);
  const [inputPlaceholder, setInputPlaceholder] = useState("Speak freely.");
  const continueHighlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const continuePlaceholderTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase4Space, setPhase4Space] = useState<{
    thread_legibility: string;
    current_space_marker: string | null;
  } | null>(null);
  const phase3ReentryNextTurnRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (continueHighlightTimerRef.current) clearTimeout(continueHighlightTimerRef.current);
      if (continuePlaceholderTimerRef.current) clearTimeout(continuePlaceholderTimerRef.current);
    };
  }, []);

  const canSend = useMemo(() => input.trim().length > 0 && !isWaiting, [input, isWaiting]);
  const anchorFromMessages = useMemo(() => {
    const assistants = messages.filter((m): m is Extract<ChatMessage, { role: "assistant" }> => m.role === "assistant");
    for (let i = assistants.length - 1; i >= 0; i -= 1) {
      const payload = assistants[i].payload;
      if (payload.last_insight) return payload.last_insight;
    }
    return undefined;
  }, [messages]);
  const anchorText = threadReentryAnchor ?? anchorFromMessages;

  useEffect(() => {
    setPhase4Space(null);
  }, [conversationId]);

  /** Match GET /api/chat/messages: no Content-Type on GET (avoids unnecessary CORS preflight if API host differs). */
  const bearerOnlyHeaders = useMemo((): Record<string, string> => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);
  const jsonWithBearerHeaders = useMemo((): Record<string, string> => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [token]);

  const storageKey = useMemo(() => {
    const suffix = token ? token.slice(0, 24) : "anon";
    return `chat_session_id:${suffix}`;
  }, [token]);

  const handleAuthExpired = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(storageKey);
    }
    setConversationId(undefined);
    setIsWaiting(false);
    setTokenInvalid(true);
    setSubscriptionRequired(false);
    setError(null);
  }, [storageKey]);

  const handleSubscriptionRequired = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(storageKey);
    }
    setConversationId(undefined);
    setIsWaiting(false);
    setSubscriptionRequired(true);
    setTokenInvalid(false);
    setError(null);
  }, [storageKey]);

  useEffect(() => {
    if (!conversationId || sessionLoading) {
      setContinueDrawerRows([]);
      setContinueListLoadError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${CHAT_THREADS_ENDPOINT}?session_id=${encodeURIComponent(conversationId)}`,
          { credentials: "include", headers: bearerOnlyHeaders }
        );
        if (cancelled) return;
        if (!res.ok) {
          let hint =
            res.status === 404
              ? "Session not found for this account (try the same sign-in you use to chat, or refresh)."
              : `Could not load Continue list (HTTP ${res.status}).`;
          try {
            const errBody = (await res.json()) as { code?: string; error?: string };
            if (
              errBody.code === "threads_prisma_error" ||
              errBody.code === "threads_unexpected"
            ) {
              hint = `Could not load Continue (HTTP ${res.status}). Chat still works; if this persists, apply the latest DB migration on the server.`;
            }
          } catch {
            /* keep hint */
          }
          setContinueListLoadError(hint);
          setContinueDrawerRows([]);
          return;
        }
        const data = (await res.json()) as {
          threads?: Array<{ id: string; label?: string | null }>;
          meta?: { thread_storage_unavailable?: boolean };
        };
        if (data.meta?.thread_storage_unavailable) {
          setContinueDrawerRows([]);
          setContinueListLoadError(
            "Continue is not available on this server yet (database update pending). You can keep chatting; run migrations on the host, then reload."
          );
          return;
        }
        const rows = (data.threads ?? [])
          .filter(
            (t) =>
              typeof t.id === "string" &&
              t.id.length > 0 &&
              typeof t.label === "string" &&
              t.label.trim().length > 0
          )
          .map((t) => ({
            id: t.id,
            label: t.label!.trim().slice(0, 200),
          }));
        setContinueDrawerRows(rows);
        setContinueListLoadError(null);
      } catch {
        if (!cancelled) {
          setContinueDrawerRows([]);
          setContinueListLoadError("Could not load Continue (network error).");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId, sessionLoading, messages.length, bearerOnlyHeaders, drawerOpen]);

  const handleSelectContinue = useCallback(
    async (continueId: string) => {
      if (!conversationId || busyContinueId) return;
      setBusyContinueId(continueId);
      setError(null);
      try {
        const act = await fetch(CHAT_THREADS_ENDPOINT, {
          method: "POST",
          headers: jsonWithBearerHeaders,
          credentials: "include",
          body: JSON.stringify({
            session_id: conversationId,
            thread_id: continueId,
          }),
        });
        if (act.status === 401) {
          handleAuthExpired();
          return;
        }
        if (act.status === 402) {
          handleSubscriptionRequired();
          return;
        }
        if (!act.ok) {
          throw new Error(`Continue failed (${act.status})`);
        }
        const cont = await fetch(
          `${CHAT_CONTINUITY_ENDPOINT}?session_id=${encodeURIComponent(conversationId)}`,
          { credentials: "include", headers: bearerOnlyHeaders }
        );
        if (!cont.ok) {
          setThreadReentryAnchor(null);
          setPhase4Space(null);
        } else {
          const cj = (await cont.json()) as {
            insight?: { continuity_text?: string | null; core_pattern?: string | null } | null;
            phase_4?: {
              thread_legibility?: string;
              current_space_marker?: string | null;
            };
          };
          const line =
            cj.insight?.continuity_text?.trim() || cj.insight?.core_pattern?.trim() || null;
          setThreadReentryAnchor(line);
          if (cj.phase_4) {
            setPhase4Space({
              thread_legibility: cj.phase_4.thread_legibility ?? "hidden",
              current_space_marker: cj.phase_4.current_space_marker ?? null,
            });
          }
        }
        phase3ReentryNextTurnRef.current = true;
        setDrawerOpen(false);

        if (continueHighlightTimerRef.current) clearTimeout(continueHighlightTimerRef.current);
        setContinueHighlightId(continueId);
        continueHighlightTimerRef.current = setTimeout(() => {
          setContinueHighlightId(null);
          continueHighlightTimerRef.current = null;
        }, 650);

        setInputPlaceholder("Pick up from here.");
        if (continuePlaceholderTimerRef.current) clearTimeout(continuePlaceholderTimerRef.current);
        continuePlaceholderTimerRef.current = setTimeout(() => {
          setInputPlaceholder("Speak freely.");
          continuePlaceholderTimerRef.current = null;
        }, 5000);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not continue from there.");
      } finally {
        setBusyContinueId(null);
      }
    },
    [
      bearerOnlyHeaders,
      busyContinueId,
      conversationId,
      handleAuthExpired,
      handleSubscriptionRequired,
      jsonWithBearerHeaders,
    ]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isWaiting]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (token) {
          const authRes = await fetch(CHAT_AUTH_CHECK_ENDPOINT, {
            credentials: "include",
            headers: bearerOnlyHeaders,
          });
          if (!cancelled && authRes.status === 401) {
            setTokenInvalid(true);
            setSessionLoading(false);
            return;
          }
          if (!cancelled && authRes.status === 402) {
            handleSubscriptionRequired();
            setSessionLoading(false);
            return;
          }
        }

        let sessionId: string | null =
          typeof window !== "undefined" ? sessionStorage.getItem(storageKey) : null;

        if (!sessionId && token) {
          try {
            const listRes = await fetch(CHAT_SESSIONS_LIST_ENDPOINT, {
              credentials: "include",
              headers: bearerOnlyHeaders,
            });
            if (!cancelled && listRes.ok) {
              const data = (await listRes.json()) as {
                sessions?: Array<{ id: string; topic: string }>;
              };
              const sessions = data.sessions ?? [];
              const withUserTurn = sessions.find((s) => s.topic !== "New conversation");
              if (withUserTurn?.id) {
                sessionId = withUserTurn.id;
                if (typeof window !== "undefined") {
                  sessionStorage.setItem(storageKey, sessionId);
                }
              }
            }
          } catch {
            /* fall through to create session */
          }
        }

        if (!sessionId) {
          const s = await fetch(CHAT_SESSION_ENDPOINT, {
            method: "POST",
            headers: jsonWithBearerHeaders,
            credentials: "include",
            body: "{}",
          });
          if (!cancelled && s.status === 401) {
            handleAuthExpired();
            return;
          }
          if (!cancelled && s.status === 402) {
            handleSubscriptionRequired();
            return;
          }
          const sj = await s.json();
          if (!cancelled && typeof sj.session_id === "string") {
            sessionId = sj.session_id;
            if (typeof window !== "undefined" && sessionId) {
              sessionStorage.setItem(storageKey, sessionId);
            }
          }
        }

        if (!sessionId || cancelled) {
          if (!cancelled) setSessionLoading(false);
          return;
        }

        setConversationId(sessionId);

        const msgRes = await fetch(
          `${CHAT_MESSAGES_ENDPOINT}?session_id=${encodeURIComponent(sessionId)}`,
          {
            credentials: "include",
            headers: bearerOnlyHeaders,
          }
        );

        if (!cancelled && msgRes.status === 401) {
          handleAuthExpired();
          return;
        }
        if (!cancelled && msgRes.status === 402) {
          handleSubscriptionRequired();
          return;
        }

        if (!cancelled && msgRes.ok) {
          const body = (await msgRes.json()) as { messages?: ApiChatMessage[] };
          const loaded = mapApiMessagesToState(body.messages ?? []);
          if (loaded.length > 0) {
            setMessages(loaded);
          } else {
            setMessages(INITIAL_MESSAGES);
          }
        } else if (!cancelled && msgRes.status === 404) {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem(storageKey);
          }
          const s2 = await fetch(CHAT_SESSION_ENDPOINT, {
            method: "POST",
            headers: jsonWithBearerHeaders,
            credentials: "include",
            body: "{}",
          });
          if (!cancelled && s2.status === 401) {
            handleAuthExpired();
            return;
          }
          if (!cancelled && s2.status === 402) {
            handleSubscriptionRequired();
            return;
          }
          if (!cancelled && s2.ok) {
            const sj2 = await s2.json();
            const freshId = typeof sj2.session_id === "string" ? sj2.session_id : null;
            if (freshId) {
              if (typeof window !== "undefined") {
                sessionStorage.setItem(storageKey, freshId);
              }
              setConversationId(freshId);
            }
          }
          setMessages(INITIAL_MESSAGES);
        } else if (!cancelled) {
          setMessages(INITIAL_MESSAGES);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to initialize chat");
      } finally {
        if (!cancelled) setSessionLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [
    bearerOnlyHeaders,
    handleAuthExpired,
    handleSubscriptionRequired,
    jsonWithBearerHeaders,
    storageKey,
    token,
  ]);

  async function handleSubmit() {
    if (!canSend || !conversationId) return;

    const text = input.trim();
    const userMessage: ChatMessage = {
      id: safeId(),
      role: "user",
      text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsWaiting(true);
    setMinAnchorUntil(Date.now() + 700);

    const phase3ThreadReentry = phase3ReentryNextTurnRef.current;

    try {
      const response = await fetch(CHAT_TURN_ENDPOINT, {
        method: "POST",
        headers: jsonWithBearerHeaders,
        credentials: "include",
        body: JSON.stringify({
          session_id: conversationId,
          conversation_id: conversationId,
          message: text,
          ...(phase3ThreadReentry ? { phase_3_thread_reentry: true } : {}),
        }),
      });
      if (response.status === 401) {
        handleAuthExpired();
        return;
      }
      if (response.status === 402) {
        handleSubscriptionRequired();
        return;
      }
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      if (phase3ThreadReentry) {
        phase3ReentryNextTurnRef.current = false;
      }
      const data = (await response.json()) as TurnResponseBody;
      const payload = extractAssistantPayload(data);
      if (data.phase_4) {
        setPhase4Space({
          thread_legibility: data.phase_4.thread_legibility ?? "hidden",
          current_space_marker: data.phase_4.current_space_marker ?? null,
        });
      }
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
        if (typeof window !== "undefined") sessionStorage.setItem(storageKey, data.conversation_id);
      }
      const delay = Math.max(0, minAnchorUntil - Date.now());
      if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
      setMessages((prev) => [
        ...prev,
        {
          id: safeId(),
          role: "assistant",
          payload,
          createdAt: new Date().toISOString(),
        },
      ]);
      setThreadReentryAnchor(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The response did not come through cleanly.");
      setInput(text);
    } finally {
      setIsWaiting(false);
    }
  }

  useEffect(() => {
    if (!tokenInvalid) return;
    router.replace("/subscribe");
  }, [tokenInvalid, router]);

  useEffect(() => {
    if (!subscriptionRequired) return;
    router.replace("/subscribe");
  }, [subscriptionRequired, router]);

  if (tokenInvalid) {
    return (
      <main className="flex min-h-screen flex-col bg-[#F7F5F2] p-4 items-center justify-center">
        <p className="text-sm text-[#5E5E5E]">Session expired. Redirecting to subscriptions...</p>
      </main>
    );
  }

  if (subscriptionRequired) {
    return (
      <main className="flex min-h-screen flex-col bg-[#F7F5F2] p-4 items-center justify-center">
        <p className="text-sm text-[#5E5E5E]">Subscription required. Redirecting...</p>
      </main>
    );
  }

  if (sessionLoading) {
    return (
      <main className="flex min-h-screen flex-col bg-[#F7F5F2] p-4">
        <p className="text-[#7A7A7A]">Loading session...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#1F1F1F]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(200,220,255,0.15),transparent_60%)]" />
        <div className="absolute left-[8%] top-[12%] h-56 w-56 rounded-full bg-[#7C9082]/10 blur-3xl" />
        <div className="absolute bottom-[10%] right-[8%] h-72 w-72 rounded-full bg-[#6F8596]/10 blur-3xl" />
      </div>

      <Header
        continueOpen={drawerOpen}
        onToggleContinue={() => setDrawerOpen((prev) => !prev)}
      />

      <main className="relative mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-10">
        <div>
          <div className="mb-8 max-w-2xl">
          <div className="inline-flex rounded-full border border-black/6 bg-white/60 px-4 py-2 text-[12px] tracking-[0.16em] text-[#7A7A7A] backdrop-blur-sm">
            low presence · human-tech · warm minimal
          </div>
        </div>

        {error ? <ErrorBanner message={error} /> : null}
          <CurrentSpaceMarker
            legibility={phase4Space?.thread_legibility}
            marker={phase4Space?.current_space_marker}
          />
          <InsightAnchor text={anchorText} />

          <div className="space-y-6 md:space-y-8">
            {messages.map((message) =>
              message.role === "user" ? (
                <UserMessage key={message.id} text={message.text} />
              ) : (
                <AssistantMessage key={message.id} payload={message.payload} />
              )
            )}

            {isWaiting ? <WaitingPulse /> : null}
            <div ref={bottomRef} />
          </div>
        </div>
      </main>
      <ContinueDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        continueRows={continueDrawerRows}
        highlightedId={continueHighlightId}
        onSelectContinue={handleSelectContinue}
        busyContinueId={busyContinueId}
        listLoadError={continueListLoadError}
      />

      <InputBar
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={isWaiting}
        placeholder={inputPlaceholder}
      />
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col bg-[#F7F5F2] p-4">
          <p className="text-[#7A7A7A]">Loading…</p>
        </main>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
