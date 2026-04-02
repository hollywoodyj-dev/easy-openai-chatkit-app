"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CHAT_AUTH_CHECK_ENDPOINT, CHAT_SESSION_ENDPOINT, CHAT_TURN_ENDPOINT } from "@/lib/config";

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
  threadsOpen,
  onToggleThreads,
}: {
  threadsOpen: boolean;
  onToggleThreads: () => void;
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
            onClick={onToggleThreads}
            type="button"
            className={cn(
              "ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[#777] transition",
              threadsOpen ? "bg-white" : "bg-white/65 hover:bg-white"
            )}
            aria-label={threadsOpen ? "Close recent threads" : "Open recent threads"}
            aria-expanded={threadsOpen}
          >
            ...
          </button>
        </div>
      </div>
    </header>
  );
}

function InsightAnchor({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <section className="mb-6 max-w-[46rem] rounded-[22px] border border-black/5 bg-white/55 px-4 py-4 shadow-[0_8px_22px_rgba(0,0,0,0.03)] backdrop-blur-sm md:px-5">
      <p className="text-[11px] uppercase tracking-[0.18em] text-[#8E8E8E]">- last insight -</p>
      <p className="mt-2 text-[13px] leading-6 text-[#666666]">{text}</p>
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

function ThreadDrawer({
  open,
  onClose,
  threads,
}: {
  open: boolean;
  onClose: () => void;
  threads: string[];
}) {
  return (
    <>
      <button
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-30 bg-black/10 transition-opacity md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden={!open}
      />
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-full w-[84vw] max-w-[22rem] border-l border-black/6 bg-[#F8F6F2]/95 p-5 shadow-[-16px_0_40px_rgba(0,0,0,0.10)] backdrop-blur-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm tracking-[0.12em] text-[#6B6B6B]">Recent threads</p>
          <button onClick={onClose} className="text-sm text-[#7D7D7D] md:hidden" type="button">
            Close
          </button>
        </div>
        <ul className="space-y-3">
          {threads.length > 0 ? (
            threads.map((thread) => (
              <li
                key={thread}
                className="rounded-2xl border border-black/5 bg-white/78 px-3 py-2 text-sm leading-6 text-[#545454]"
              >
                {thread}
              </li>
            ))
          ) : (
            <li className="rounded-2xl border border-black/5 bg-white/78 px-3 py-2 text-sm text-[#868686]">
              No recent thread yet.
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
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
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
              placeholder="Speak freely."
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
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isWaiting, [input, isWaiting]);
  const anchorText = useMemo(() => {
    const assistants = messages.filter((m): m is Extract<ChatMessage, { role: "assistant" }> => m.role === "assistant");
    for (let i = assistants.length - 1; i >= 0; i -= 1) {
      const payload = assistants[i].payload;
      if (payload.last_insight) return payload.last_insight;
    }
    return undefined;
  }, [messages]);
  const recentThreads = useMemo(() => {
    const users = messages.filter((m): m is Extract<ChatMessage, { role: "user" }> => m.role === "user");
    return users
      .slice(-3)
      .reverse()
      .map((u) => (u.text.length > 42 ? `${u.text.slice(0, 42).trim()}...` : u.text));
  }, [messages]);

  const authHeaders = useMemo(() => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isWaiting]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (token) {
          const authRes = await fetch(CHAT_AUTH_CHECK_ENDPOINT, {
            credentials: "include",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
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
        const existing = typeof window !== "undefined" ? sessionStorage.getItem(storageKey) : null;
        if (existing && !cancelled) {
          setConversationId(existing);
          setSessionLoading(false);
          return;
        }
        const s = await fetch(CHAT_SESSION_ENDPOINT, {
          method: "POST",
          headers: authHeaders,
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
          setConversationId(sj.session_id);
          if (typeof window !== "undefined") sessionStorage.setItem(storageKey, sj.session_id);
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
  }, [authHeaders, handleAuthExpired, handleSubscriptionRequired, storageKey, token]);

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

    try {
      const response = await fetch(CHAT_TURN_ENDPOINT, {
        method: "POST",
        headers: authHeaders,
        credentials: "include",
        body: JSON.stringify({
          session_id: conversationId,
          conversation_id: conversationId,
          message: text,
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
      const data = (await response.json()) as TurnResponseBody;
      const payload = extractAssistantPayload(data);
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

  if (tokenInvalid) {
    return (
      <main className="flex min-h-screen flex-col bg-[#F7F5F2] p-4 items-center justify-center">
        <p className="text-sm text-[#5E5E5E]">Session expired. Redirecting to subscriptions...</p>
      </main>
    );
  }

  useEffect(() => {
    if (!subscriptionRequired) return;
    router.replace("/subscribe");
  }, [subscriptionRequired, router]);

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
        threadsOpen={drawerOpen}
        onToggleThreads={() => setDrawerOpen((prev) => !prev)}
      />

      <main className="relative mx-auto max-w-4xl px-5 py-8 md:px-8 md:py-10">
        <div>
          <div className="mb-8 max-w-2xl">
          <div className="inline-flex rounded-full border border-black/6 bg-white/60 px-4 py-2 text-[12px] tracking-[0.16em] text-[#7A7A7A] backdrop-blur-sm">
            low presence · human-tech · warm minimal
          </div>
        </div>

        {error ? <ErrorBanner message={error} /> : null}
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
      <ThreadDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} threads={recentThreads} />

      <InputBar value={input} onChange={setInput} onSubmit={handleSubmit} disabled={isWaiting} />
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
