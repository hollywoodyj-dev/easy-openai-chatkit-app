import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";
import { extractReflectionState } from "@/lib/wisewave-extract";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const DEFAULT_CHAT_MODEL = "gpt-4o";
const RECENT_MESSAGES_COUNT = 8;
const SUMMARY_TRIGGER_EVERY = 10;

const SUMMARY_SYSTEM_PROMPT = `You summarize conversations for memory.
The conversation summary must remain factual, concise, and non-therapeutic.

Purpose:
- preserve neutral context for downstream prompts
- capture the main topic, repeated themes, and relevant user-stated concerns
- support continuity without adding interpretive or supportive tone

Rules:
- use plain, neutral language
- summarize what was discussed, not what the user "really feels" beneath it
- do not diagnose
- do not use therapeutic framing
- do not use healing, coaching, or spiritual language
- do not infer hidden motives unless explicitly stated by the user
- do not add advice, encouragement, or reflective questions
- do not use soft self-help phrases

Avoid language such as:
- vulnerability
- validation
- acceptance
- self-worth
- fear of rejection
- not being enough
- protective mechanism
- inner child
- healing
- being seen
- peace
- ease
- self-acceptance
- letting go
- opening space

Prefer language such as:
- user discussed ongoing pressure to prove themselves
- user linked mental fatigue with repeated striving
- conversation focused on recurring patterns around achievement and pressure
- user asked for a less therapist-like and more grounded tone

Keep the summary under 120 words.
The summary should read like neutral context for a system, not like a therapist, coach, or guide.`;

async function refreshConversationSummary(
  conversationId: string,
  apiKey: string,
  model: string
): Promise<void> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { conversationSummary: true },
  });
  const allMessages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
  const recent = allMessages.slice(-10);
  if (recent.length === 0) return;

  const previousSummary = conversation?.conversationSummary?.trim() ?? "(none)";
  const recentText = recent
    .map((m) => `${m.role}: ${m.message}`)
    .join("\n\n");

  const userContent = `Existing summary:\n${previousSummary}\n\nRecent conversation:\n${recentText}\n\nUpdate the conversation summary.`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SUMMARY_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      max_tokens: 256,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.warn("[chat/turn] Summary refresh failed", res.status, err);
    return;
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const summary = data.choices?.[0]?.message?.content?.trim() ?? "";
  if (!summary) return;

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      conversationSummary: summary,
      summaryUpdatedAt: new Date(),
    },
  });
}

/**
 * Option B turn API: receive user message → save → call OpenAI for reply → save assistant → return.
 * To match the Wisewave (ChatKit workflow) chatbot: set OPENAI_CHAT_SYSTEM_PROMPT to the same
 * instructions as in Agent Builder, and OPENAI_CHAT_MODEL to the workflow model if known.
 *
 * POST body: { session_id, message, metadata?, insight_tags? }
 * Response: { assistant_message } or stream (future).
 */
export async function POST(request: Request) {
  const { userId, sessionCookie } = await resolveChatUserId(request);
  let body: {
    session_id?: string;
    message?: string;
    metadata?: unknown;
    insight_tags?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const sessionId = body.session_id;
  const message = body.message;

  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid session_id" },
      { status: 400 }
    );
  }
  if (message === undefined || typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { error: "Missing or invalid message" },
      { status: 400 }
    );
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: sessionId, userId },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found or access denied" },
      { status: 404 }
    );
  }

  const metadata =
    body.metadata !== undefined && body.metadata !== null
      ? (body.metadata as object)
      : undefined;
  const insightTags =
    body.insight_tags !== undefined && body.insight_tags !== null
      ? (body.insight_tags as object)
      : undefined;

  // V1 persistence order: save user message before any AI processing so a failed model call never loses the user's reflection.
  const userMsg = await prisma.message.create({
    data: {
      conversationId: sessionId,
      userId,
      role: "user",
      message: message.trim(),
      metadata: metadata ?? undefined,
      insightTags: insightTags ?? undefined,
    },
  });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 }
    );
  }
  const model = process.env.OPENAI_CHAT_MODEL?.trim() || DEFAULT_CHAT_MODEL;

  // V1 Ticket 2: extraction pipeline — structured reflection state for this message. Failure is non-blocking; we log and continue.
  let reflectionState: {
    trigger_label: string;
    emotion_label: string;
    interpretation_label: string;
    regulation_label: string;
    choice_label: string;
    insight_candidate: string;
  } | null = null;
  const extracted = await extractReflectionState(
    message.trim(),
    apiKey,
    model,
    conversation.conversationSummary
  );
  if (extracted) {
    reflectionState = extracted;
    try {
      await prisma.reflectionRun.create({
        data: {
          conversationId: sessionId,
          messageId: userMsg.id,
          triggerLabel: extracted.trigger_label,
          emotionLabel: extracted.emotion_label,
          interpretationLabel: extracted.interpretation_label,
          regulationLabel: extracted.regulation_label,
          choiceLabel: extracted.choice_label,
          insightCandidate: extracted.insight_candidate || null,
        },
      });
    } catch (e) {
      console.warn("[chat/turn] ReflectionRun save failed", e);
    }
  }

  // 2. Get message count and optionally refresh conversation summary (every SUMMARY_TRIGGER_EVERY messages)
  const allMessages = await prisma.message.findMany({
    where: { conversationId: sessionId },
    orderBy: { createdAt: "asc" },
  });
  const messageCount = allMessages.length;

  if (
    messageCount >= SUMMARY_TRIGGER_EVERY &&
    messageCount % SUMMARY_TRIGGER_EVERY === 0
  ) {
    await refreshConversationSummary(sessionId, apiKey, model);
  }

  // 3. Reload conversation (to get latest summary) and take recent messages for context
  const conversationUpdated = await prisma.conversation.findFirst({
    where: { id: sessionId, userId },
    select: { conversationSummary: true },
  });
  const recent = allMessages.slice(-RECENT_MESSAGES_COUNT);
  const openaiMessages: { role: "user" | "assistant" | "system"; content: string }[] = recent.map(
    (m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.message,
    })
  );

  // Use Wisewave/chatbot instructions: set OPENAI_CHAT_SYSTEM_PROMPT or OPENAI_CHAT_SYSTEM_PROMPT_FILE
  let systemPrompt = process.env.OPENAI_CHAT_SYSTEM_PROMPT?.trim();
  if (!systemPrompt && process.env.OPENAI_CHAT_SYSTEM_PROMPT_FILE?.trim()) {
    try {
      const path = join(process.cwd(), process.env.OPENAI_CHAT_SYSTEM_PROMPT_FILE.trim());
      systemPrompt = readFileSync(path, "utf-8").trim();
    } catch (e) {
      console.warn("[chat/turn] Could not read OPENAI_CHAT_SYSTEM_PROMPT_FILE", e);
    }
  }
  const openaiMessagesForApi: { role: "user" | "assistant" | "system"; content: string }[] = [];
  if (systemPrompt) {
    const continuationHint =
      openaiMessages.length > 0
        ? "\n\nThe following messages are part of an ongoing conversation. Continue naturally and build on what has already been discussed."
        : "";
    const summaryBlock =
      conversationUpdated?.conversationSummary?.trim()
        ? `\n\nConversation summary:\n${conversationUpdated.conversationSummary.trim()}`
        : "";
    openaiMessagesForApi.push({
      role: "system",
      content: systemPrompt + continuationHint + summaryBlock,
    });
  }
  openaiMessagesForApi.push(...openaiMessages);

  let assistantContent: string;
  try {
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: openaiMessagesForApi,
        max_tokens: 2048,
      }),
    });

    if (!completion.ok) {
      const err = await completion.json().catch(() => ({}));
      console.error("[chat/turn] OpenAI error", completion.status, err);
      return NextResponse.json(
        {
          error: "Assistant request failed",
          details: (err as { error?: { message?: string } })?.error?.message,
        },
        { status: completion.status >= 500 ? 500 : 502 }
      );
    }

    const data = (await completion.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    assistantContent =
      data.choices?.[0]?.message?.content?.trim() ?? "";
  } catch (e) {
    console.error("[chat/turn] OpenAI request failed", e);
    return NextResponse.json(
      { error: "Assistant request failed" },
      { status: 502 }
    );
  }

  // V1: persist assistant message after successful generation.
  await prisma.message.create({
    data: {
      conversationId: sessionId,
      userId,
      role: "assistant",
      message: assistantContent,
    },
  });

  const res = NextResponse.json({
    assistant_message: assistantContent,
    ...(reflectionState && { reflection_state: reflectionState }),
  });
  if (sessionCookie) {
    res.headers.append("Set-Cookie", sessionCookie);
  }
  return res;
}
