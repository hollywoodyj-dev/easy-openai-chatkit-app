import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";

export const dynamic = "force-dynamic";

const REFLECTION_RECENT_MESSAGES = 12;
const DEFAULT_CHAT_MODEL = "gpt-4o";

const REFLECTION_SYSTEM_PROMPT = `You are a reflective assistant supporting self-awareness. Given the conversation so far and an optional user reflection, write one concise reflection or insight summary (1-3 sentences) that captures what matters for the user's awareness. Tone: calm, clear, supportive. Output only the reflection text, no preamble.`;

/**
 * POST: Create a reflection checkpoint. Body: { session_id, user_reflection? }.
 * Returns { summary, checkpoint_id }.
 */
export async function POST(request: Request) {
  const { userId, sessionCookie } = await resolveChatUserId(request);
  let body: { session_id?: string; user_reflection?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sessionId = body.session_id?.trim();
  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing or invalid session_id" },
      { status: 400 }
    );
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: sessionId, userId },
    select: { id: true, conversationSummary: true },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found or access denied" },
      { status: 404 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 }
    );
  }

  const model = process.env.OPENAI_CHAT_MODEL?.trim() || DEFAULT_CHAT_MODEL;
  const userReflection = typeof body.user_reflection === "string" ? body.user_reflection.trim() || null : null;

  const messages = await prisma.message.findMany({
    where: { conversationId: sessionId },
    orderBy: { createdAt: "asc" },
    take: REFLECTION_RECENT_MESSAGES,
    select: { role: true, message: true },
  });
  const recentText = messages.length > 0
    ? messages.map((m) => `${m.role}: ${m.message}`).join("\n\n")
    : "(No messages yet)";
  const summaryBlock = conversation.conversationSummary?.trim()
    ? `\nConversation summary:\n${conversation.conversationSummary}`
    : "";
  const userBlock = userReflection ? `\nUser reflection for this checkpoint:\n${userReflection}` : "";
  const userContent = `Conversation so far:\n${recentText}${summaryBlock}${userBlock}\n\nWrite the reflection summary.`;

  let summary: string;
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: REFLECTION_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        max_tokens: 256,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn("[chat/reflection] OpenAI error", res.status, err);
      return NextResponse.json(
        {
          error: "Reflection generation failed",
          details: (err as { error?: { message?: string } })?.error?.message,
        },
        { status: res.status >= 500 ? 500 : 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    summary = data.choices?.[0]?.message?.content?.trim() ?? "";
  } catch (e) {
    console.error("[chat/reflection] OpenAI request failed", e);
    return NextResponse.json(
      { error: "Reflection generation failed" },
      { status: 502 }
    );
  }

  if (!summary) {
    return NextResponse.json(
      { error: "Reflection generation returned empty" },
      { status: 502 }
    );
  }

  const checkpoint = await prisma.reflectionCheckpoint.create({
    data: {
      conversationId: sessionId,
      userId,
      userInput: userReflection,
      summary,
    },
  });

  const response = NextResponse.json({
    summary: checkpoint.summary,
    checkpoint_id: checkpoint.id,
  });
  if (sessionCookie) {
    response.headers.append("Set-Cookie", sessionCookie);
  }
  return response;
}

/**
 * GET: List reflection checkpoints for a session. Query: session_id=...
 * Returns { checkpoints: [{ id, summary, user_input, created_at }] }.
 */
export async function GET(request: Request) {
  const { userId } = await resolveChatUserId(request);
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id" },
      { status: 400 }
    );
  }

  const conversation = await prisma.conversation.findFirst({
    where: { id: sessionId, userId },
    select: { id: true },
  });

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found or access denied" },
      { status: 404 }
    );
  }

  const checkpoints = await prisma.reflectionCheckpoint.findMany({
    where: { conversationId: sessionId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      summary: true,
      userInput: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    checkpoints: checkpoints.map((c) => ({
      id: c.id,
      summary: c.summary,
      user_input: c.userInput,
      created_at: c.createdAt.toISOString(),
    })),
  });
}
