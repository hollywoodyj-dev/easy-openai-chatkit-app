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
  CHAT_CONTINUITY_ENDPOINT,
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

type ContinuityInsight = {
  id: string;
  core_pattern: string;
  continuity_text: string;
  continuity_key?: string;
  created_at: string;
};

type ReflectionMetadata = {
  trigger_label: string;
  emotion_label: string;
  interpretation_label: string;
  regulation_label: string;
  choice_label: string;
  insight_candidate: string;
};

function formatLabel(value: string): string {
  if (!value || value === "—" || value === "unknown" || value === "uncertain") return "—";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

/** Render metadata only when it adds lightweight human-readable value. Hide when most fields are weak/fallback. */
function isMetadataMeaningful(m: ReflectionMetadata): boolean {
  const weak = new Set([
    "unknown", "uncertain", "", "unclear", "unclear_reflection", "unclear reflection",
    "unable_to_infer", "unable to infer",
  ]);
  const isWeak = (v: string) => !v || weak.has(v.toLowerCase().trim()) || /^unclear\b/i.test(v.trim());
  const t = isWeak(m.trigger_label);
  const e = isWeak(m.emotion_label);
  const i = isWeak(m.interpretation_label);
  const insight = (m.insight_candidate || "").trim().toLowerCase();
  const insightFallback = /not enough|unable to identify|unclear reflection|insufficient|did not include enough|to identify a specific trigger|no.*pattern|insufficient signal|unclear trigger|too ambiguous|too unclear|ambiguous to infer/i.test(insight);
  if (insightFallback && insight.length > 20) return false;
  const meaningfulCount = [t, e, i].filter((x) => !x).length;
  return meaningfulCount >= 2 || (meaningfulCount >= 1 && !insightFallback);
}

/** Stricter guard for regulation cue: cue is coaching-like, so require stronger signal than metadata. */
function isRegulationCueMeaningful(m: ReflectionMetadata): boolean {
  if (!isMetadataMeaningful(m)) return false;
  const weak = new Set([
    "unknown", "uncertain", "", "unclear", "unclear_reflection", "unclear reflection",
    "unable_to_infer", "unable to infer",
    "feeling_off", "feel_off", "vague_discomfort", "vague",
    "something_feels_off", "something_feels_weird", "weird_feeling", "uneasy", "unsettled",
  ]);
  const weakTrigger = /^unclear\b|feeling_off|feel_off|vague|something_feels|weird|uncertain|unknown|uneasy|unsettled/i;
  const isWeak = (v: string) =>
    !v || weak.has(v.toLowerCase().trim()) || /^unclear\b/i.test(v.trim());

  const triggerWeak = isWeak(m.trigger_label);
  const emotionWeak = isWeak(m.emotion_label);
  const interpretationWeak = isWeak(m.interpretation_label);

  const meaningfulTrigger = !triggerWeak;
  const meaningfulEmotion = !emotionWeak;
  const meaningfulInterpretation = !interpretationWeak;

  const triggerIsWeakState = weakTrigger.test(
    (m.trigger_label || "").trim().toLowerCase().replace(/\s+/g, "_")
  );
  const insight = (m.insight_candidate || "").trim().toLowerCase();
  const insightFallback = /not enough|unable to identify|unclear reflection|insufficient|did not include enough|to identify a specific trigger|no.*pattern|insufficient signal|unclear trigger|too ambiguous|too unclear|ambiguous to infer/i.test(insight);
  const meaningfulCount = [meaningfulTrigger, meaningfulEmotion, meaningfulInterpretation].filter(Boolean).length;

  // Require at least two strong fields overall, as before.
  if (meaningfulCount < 2) return false;
  if (triggerIsWeakState || insightFallback) return false;

  // New tightening: regulation cue should only show when there's
  // (a) at least one strong cognitive anchor (trigger or interpretation), and
  // (b) a reasonably specific emotion, not just vague discomfort/uncertainty.
  const hasStrongCognitive = meaningfulTrigger || meaningfulInterpretation;
  const emotionLabel = (m.emotion_label || "").trim().toLowerCase().replace(/\s+/g, "_");
  const emotionIsVague =
    /feeling_off|feel_off|vague|something_feels|weird|uncertain|unknown|uneasy|unsettled/.test(
      emotionLabel
    );

  if (!hasStrongCognitive) return false;
  if (!meaningfulEmotion || emotionIsVague) return false;

  return true;
}

const REGULATION_CUE_MAP: Record<string, string> = {
  pause: "Pause and notice first",
  pause_before_reacting: "Pause and notice before reacting",
  name_emotion: "Name the emotion",
  soften_urgency: "Soften the urgency",
  wait_then_reassess: "Wait a little, then reassess",
  check_facts_first: "Check the facts first",
  wait_before_responding: "Wait before responding",
  one_small_step: "Take one small step",
  delay_reaction: "Delay the reaction",
  reassess: "Reassess from a calmer place",
};
const REGULATION_CUE_MAP_ZH: Record<string, string> = {
  pause: "先停一下，留意当下",
  pause_before_reacting: "在反应前先停一下",
  name_emotion: "先把情绪叫出来",
  soften_urgency: "把紧迫感放轻一点",
  wait_then_reassess: "等一会儿，再重新评估",
  check_facts_first: "先核对事实",
  wait_before_responding: "先别马上回应",
  one_small_step: "只做一个小步骤",
  delay_reaction: "稍微延后你的反应",
  reassess: "从更平稳的角度再看一遍",
};

function regulationLabelToCue(label: string, uiLang: "en" | "zh"): string | null {
  const v = (label || "").trim().toLowerCase().replace(/\s+/g, "_");
  if (!v || ["unknown", "uncertain", "unclear"].includes(v)) return null;
  const map = uiLang === "zh" ? REGULATION_CUE_MAP_ZH : REGULATION_CUE_MAP;
  if (uiLang === "zh") return map[v] ?? null; // avoid English fallback leakage in ZH
  return map[v] ?? formatLabel(label);
}

/** Guard for action prompt: only show when overall reflection is meaningful and choice_label is a concrete alternative. */
function isActionPromptMeaningful(m: ReflectionMetadata): boolean {
  if (!isMetadataMeaningful(m)) return false;
  const raw = (m.choice_label || "").trim().toLowerCase().replace(/\s+/g, "_");
  if (!raw) return false;
  const weak = new Set(["unknown", "uncertain", "unclear"]);
  if (weak.has(raw)) return false;
  // Tie action prompt to the same stronger-signal requirement as regulation cue,
  // so we don't suggest actions off very weak / vague states.
  if (!isRegulationCueMeaningful(m)) return false;
  return true;
}

const ACTION_PROMPT_MAP: Record<string, string> = {
  wait_before_responding: "Wait a little before you respond.",
  one_small_step: "Pick one small, concrete step you can take.",
  check_facts_first: "Check the concrete facts before you decide what to do.",
  wait_then_reassess: "Give it a bit of time, then reassess.",
  acknowledge_existing_effort: "Notice what you have already done before pushing for more.",
  acknowledge_done_work: "Notice what you have already done before pushing for more.",
  reassess: "Step back for a moment and reassess what feels most important right now.",
};
const ACTION_PROMPT_MAP_ZH: Record<string, string> = {
  wait_before_responding: "先等一等再回应。",
  one_small_step: "挑一个你能做的小、具体步骤。",
  check_facts_first: "在你决定之前，先确认具体事实。",
  wait_then_reassess: "给一点时间，然后再重新评估。",
  acknowledge_existing_effort: "先注意到你已经做了什么，而不是立刻想要更多。",
  acknowledge_done_work: "先注意到你已经完成了什么，而不是立刻想要更多。",
  reassess: "退一步，先看看此刻更重要的是什么。",
};

function choiceLabelToActionPrompt(
  label: string,
  uiLang: "en" | "zh"
): string | null {
  const v = (label || "").trim().toLowerCase().replace(/\s+/g, "_");
  if (!v || ["unknown", "uncertain", "unclear"].includes(v)) return null;
  // Only show when we have a deliberately written, user-facing sentence.
  const map = uiLang === "zh" ? ACTION_PROMPT_MAP_ZH : ACTION_PROMPT_MAP;
  return map[v] ?? null;
}

const CONTINUITY_REMINDER_ZH_MAP: Record<string, string> = {
  earned_value_after_effort: "即使你做完了重要的事，你也仍会觉得：休息好像还不算“应得”。",
  delayed_reply_means_i_did_something_wrong:
    "对方回得很快/很慢时，你可能会把它读成：你是不是哪里做错了。",
  rest_must_be_earned: "休息很快会让你觉得：你还得先证明些什么才配停下来。",
  constant_pressure_keep_up: "你可能会觉得，只有一直跟上，你才允许放松。",
  replay_for_mistakes: "不清楚的时候，你很容易开始反复检查自己可能做错了什么。",
  fallback_generic: "当事情不确定时，这个模式会很快又回来。",
};

function continuityKeyToReminderTextZh(key?: string | null): string | null {
  if (!key) return null;
  return CONTINUITY_REMINDER_ZH_MAP[key] ?? null;
}

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
  const [continuity, setContinuity] = useState<ContinuityInsight | null>(null);
  const [hadContinuityAtSessionStart, setHadContinuityAtSessionStart] = useState(false);
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [latestMetadata, setLatestMetadata] = useState<ReflectionMetadata | null>(null);
  const [latestRegulationMetadata, setLatestRegulationMetadata] = useState<ReflectionMetadata | null>(null);
  const [latestIsVagueSource, setLatestIsVagueSource] = useState(false);
  const [metadataExpanded, setMetadataExpanded] = useState(false);

  const uiLang: "en" | "zh" = useMemo(() => {
    // Milestone D baseline: the user-facing language follows the last user input.
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return "en";
    return /[\u4E00-\u9FFF]/.test(lastUser.message) ? "zh" : "en";
  }, [messages]);

  // Temporary internal visibility layer:
  // - Keep visible by default for QA/debug efficiency (Milestone D).
  // - Before publish, flip NEXT_PUBLIC_SHOW_WHAT_WAS_NOTICED_DEFAULT to "0"
  //   (or gate behind a debug token / settings UI once redesigned).
  const showWhatWasNoticedDefault =
    (process.env.NEXT_PUBLIC_SHOW_WHAT_WAS_NOTICED_DEFAULT ?? "1") !== "0";
  const showWhatWasNoticed = useMemo(() => {
    const v = searchParams?.get("noticed")?.trim();
    if (v === "1") return true;
    if (v === "0") return false;
    return showWhatWasNoticedDefault;
  }, [searchParams, showWhatWasNoticedDefault]);

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
    setLatestMetadata(null);
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
      setLatestMetadata(null);
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

  const fetchContinuity = useCallback(async (sid?: string | null): Promise<ContinuityInsight | null> => {
    const query = sid ? `?session_id=${encodeURIComponent(sid)}` : "";
    const res = await fetch(`${CHAT_CONTINUITY_ENDPOINT}${query}`, {
      credentials: "include",
      headers: authHeaders(),
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => ({}));
    const insight = (data.insight ?? null) as
      | {
          id: string;
          core_pattern: string;
          continuity_text: string;
          continuity_key?: string;
          created_at: string;
        }
      | null;
    return insight;
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
      setContinuity(null);
      setHadContinuityAtSessionStart(false);
      return;
    }
    let cancelled = false;
    fetchCheckpoints(sessionId).then((list) => {
      if (!cancelled) setCheckpoints(list);
    });
    fetchContinuity(sessionId).then((insight) => {
      if (cancelled) return;
      setContinuity(insight);
      setHadContinuityAtSessionStart(!!insight);
    });
    return () => { cancelled = true; };
  }, [sessionId, fetchCheckpoints, fetchContinuity]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || !sessionId || loading) return;
    setInput("");
    setLoading(true);
    setError(null);
    try {
      // Live-path debug for regulation cue behavior.
      // Helpful when inspecting weak follow-up turns like "I feel off".
      // Safe to remove once Ticket 9 is fully verified.
      console.debug("[chat/send] before turn", {
        input: text,
        latestRegulationMetadataBefore: latestRegulationMetadata,
      });
      const res = await fetch(CHAT_TURN_ENDPOINT, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
          ...(feedbackDraft.trim()
            ? {
                feedback: {
                  note: feedbackDraft.trim(),
                },
              }
            : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = (data.details as string) || (data.error as string) || res.statusText;
        setError(msg);
        setInput(text);
        return;
      }
      const assistantMessage = (data.assistant_message as string) ?? "";
      const rs = data.reflection_state as ReflectionMetadata | null | undefined;
      const isVagueSource = Boolean(data.debug_is_vague_source);
      const cueMeaningful =
        rs && typeof rs === "object" && !isVagueSource
          ? isRegulationCueMeaningful(rs)
          : false;
      const choiceLabel = rs && typeof rs === "object" ? rs.choice_label : null;
      const actionPrompt =
        rs && typeof rs === "object" ? choiceLabelToActionPrompt(rs.choice_label, "en") : null;
      const actionMeaningful =
        rs && typeof rs === "object" ? isActionPromptMeaningful(rs) : false;
      console.debug("[chat/send] after turn", {
        input: text,
        reflectionState: rs,
        choiceLabel,
        actionPrompt,
        isRegulationCueMeaningful: cueMeaningful,
        isActionPromptMeaningful: actionMeaningful,
      });
      if (rs && typeof rs === "object" && rs.trigger_label != null) {
        setLatestMetadata(rs);
        setLatestIsVagueSource(isVagueSource);
        if (cueMeaningful) {
          setLatestRegulationMetadata(rs);
        } else {
          setLatestRegulationMetadata(null);
        }
      } else {
        setLatestMetadata(null);
        setLatestRegulationMetadata(null);
        setLatestIsVagueSource(false);
      }
      const now = new Date().toISOString();
      setMessages((prev) => [
        ...prev,
        { id: `user-${Date.now()}`, role: "user", message: text, created_at: now },
        { id: `assistant-${Date.now()}`, role: "assistant", message: assistantMessage, created_at: now },
      ]);
      refreshHistorySessions();
      // Continuity timing (Ibu memo): for first-time users, avoid showing "Last insight"
      // immediately on the same turn that creates the first continuity insight.
      // If continuity existed at session start, keep continuity anchored to prior sessions only.
      if (hadContinuityAtSessionStart) {
        // Always refetch with session exclusion rules so current-session insights
        // do not replace the surfaced "last" continuity context.
        fetchContinuity(sessionId).then((insight) => {
          setContinuity(insight);
        });
      }
      // Clear feedback draft after a successful send, so feedback remains opt-in per turn.
      setFeedbackDraft("");
      setFeedbackVisible(false);
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
        {(() => {
          if (!continuity) return null;
          if (uiLang === "zh") {
            const zhText = continuityKeyToReminderTextZh(continuity.continuity_key);
            if (!zhText) return null; // avoid English fallback leakage in ZH
            return (
              <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  上一次洞见
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                  {zhText}
                </p>
              </div>
            );
          }
          return (
            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Last insight
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {continuity.continuity_text}
              </p>
            </div>
          );
        })()}
        {(() => {
          const shouldShowRegulationCue =
            !!latestRegulationMetadata &&
            isRegulationCueMeaningful(latestRegulationMetadata) &&
            !!regulationLabelToCue(latestRegulationMetadata.regulation_label, uiLang);
          if (!shouldShowRegulationCue) return null;
          return (
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-900/10">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5">
              {uiLang === "zh" ? "调节提示" : "Regulation cue"}
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              {uiLang === "zh"
                ? `试试：${regulationLabelToCue(
                    latestRegulationMetadata.regulation_label,
                    uiLang
                  )}`
                : `Try: ${regulationLabelToCue(latestRegulationMetadata.regulation_label, uiLang)}`}
            </p>
          </div>
          );
        })()}
        {(() => {
          if (!latestMetadata) return null;
          const actionPrompt = choiceLabelToActionPrompt(latestMetadata.choice_label, uiLang);
          const shouldShowAction =
            !!actionPrompt &&
            isActionPromptMeaningful(latestMetadata) &&
            !latestIsVagueSource;
          console.debug("[chat/render] action prompt", {
            reflectionState: latestMetadata,
            choiceLabel: latestMetadata.choice_label,
            actionPrompt,
            shouldShowAction,
          });
          if (!shouldShowAction) return null;
          return (
            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-sky-50/60 dark:bg-sky-900/20">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-0.5">
                {uiLang === "zh" ? "下一步" : "Next step"}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {uiLang === "zh" ? `你可以试试：${actionPrompt}` : `You might try: ${actionPrompt}`}
              </p>
            </div>
          );
        })()}
        {showWhatWasNoticed &&
          latestMetadata &&
          isMetadataMeaningful(latestMetadata) &&
          !latestIsVagueSource && (
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30">
            <button
              type="button"
              onClick={() => setMetadataExpanded((v) => !v)}
              className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:underline flex items-center gap-1"
            >
              {uiLang === "zh" ? "你注意到了什么" : "What was noticed"}
              <span className="text-[10px]">{metadataExpanded ? "▼" : "▶"}</span>
            </button>
            {metadataExpanded && (
              <div className="mt-1.5 space-y-1 text-[11px] text-slate-600 dark:text-slate-400 font-sans">
                <div><span className="text-slate-500 dark:text-slate-500">Event</span> {formatLabel(latestMetadata.trigger_label)}</div>
                <div><span className="text-slate-500 dark:text-slate-500">Feeling</span> {formatLabel(latestMetadata.emotion_label)}</div>
                <div><span className="text-slate-500 dark:text-slate-500">Interpretation</span> {formatLabel(latestMetadata.interpretation_label)}</div>
                <div><span className="text-slate-500 dark:text-slate-500">Regulation</span> {formatLabel(latestMetadata.regulation_label)}</div>
                <div><span className="text-slate-500 dark:text-slate-500">Next step</span> {formatLabel(latestMetadata.choice_label)}</div>
                {latestMetadata.insight_candidate?.trim() && (
                  <div className="pt-1 border-t border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300">
                    <span className="text-slate-500 dark:text-slate-500">Insight</span> {latestMetadata.insight_candidate}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {checkpoints.length > 0 && (
          <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-900/10">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Reflection checkpoints
            </p>
            <div className="space-y-2">
              {checkpoints.slice(0, 5).map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-300"
                >
                  <p className="whitespace-pre-wrap">{c.summary}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    {new Date(c.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
              {checkpoints.length > 5 && (
                <p className="text-xs text-slate-400">
                  + {checkpoints.length - 5} more
                </p>
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
            {uiLang === "zh"
              ? "从这里继续，我们会帮你保留这段对话，方便下次接着聊。"
              : "Continue here. This conversation is saved so you can pick up later."}
          </p>
        )}
        {messages.length === 1 && messages[0]?.role === "user" && !loading && (
          <div className="rounded-lg border border-amber-200 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-900/20 px-3 py-2 text-[11px] text-amber-800 dark:text-amber-200">
            Your last message was saved, but the response may not have finished. You can send a new message or resend what you wrote.
          </div>
        )}
        {messages.map((m) => {
          const label =
            m.role === "user"
              ? uiLang === "zh"
                ? "你"
                : "You"
              : m.role === "assistant"
              ? uiLang === "zh"
                ? "玄微"
                : "Wisewave"
              : m.role;
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
          className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 space-y-2"
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
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setFeedbackVisible((v) => !v)}
              className="self-start text-[11px] text-slate-500 dark:text-slate-400 hover:underline"
            >
              {feedbackVisible ? "Hide feedback about last suggestion" : "Add feedback about what happened after the last suggestion"}
            </button>
            {feedbackVisible && (
              <>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {uiLang === "zh"
                    ? "这段反馈会在你下一次发送消息时一起提交。"
                    : "This feedback will be sent with your next message."}
                </p>
                <textarea
                  value={feedbackDraft}
                  onChange={(e) => setFeedbackDraft(e.target.value)}
                  placeholder="Optional: how did the last suggestion or regulation cue land for you?"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 resize-none"
                  rows={2}
                  disabled={loading}
                />
              </>
            )}
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
