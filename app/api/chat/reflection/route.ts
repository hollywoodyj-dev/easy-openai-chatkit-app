import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";

export const dynamic = "force-dynamic";

const REFLECTION_RECENT_MESSAGES = 12;
const DEFAULT_CHAT_MODEL = "gpt-4o";

const REFLECTION_SYSTEM_PROMPT = `You are generating a Wisewave reflection checkpoint for a chat conversation.

Your task is to write a short reflection that feels like a wise inner guide:
clear, grounded, simple, and real.

The reflection must do 3 things:
1. Mirror the user's real inner dynamic
2. Name one core pattern, tension, or loop
3. Offer one grounded direction or opening

Output requirements:
- 2 to 4 sentences only
- preferably under 80 words
- plain, human language
- specific to this actual conversation
- must feel worth saving as a checkpoint
- return only the reflection text

Tone:
- calm
- clear
- warm
- grounded
- lightly wise
- non-clinical
- non-preachy
- non-mystical
- non-therapeutic

Hard rules:
- do not sound like a therapist
- do not diagnose
- do not explain the user too much
- do not summarize the whole conversation
- do not give a list of advice
- do not use abstract self-help language
- do not sound overly certain about hidden motives
- do not use inflated or soft cliché wording

Avoid phrases like:
- protective mechanism
- this may stem from
- important step
- create more space
- embrace moments of just being
- external approval
- self-worth independent of
- gently urging you
- there may be room here
- it seems like there's

Prefer:
- one clear mirror
- one real pattern
- one grounded shift

A strong reflection should make the user feel:
"Yes, that is the real thing."

Return only the reflection text. No bullets. No labels. No quotation marks.`;

function sanitizeReflection(text: string): string {
  return text
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

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
  const userReflection =
    typeof body.user_reflection === "string"
      ? body.user_reflection.trim() || null
      : null;

  // Fetch the most recent messages, then reverse for chronological prompt order.
  const recentMessagesDesc = await prisma.message.findMany({
    where: { conversationId: sessionId },
    orderBy: { createdAt: "desc" },
    take: REFLECTION_RECENT_MESSAGES,
    select: { role: true, message: true },
  });

  const messages = recentMessagesDesc.reverse();

  // Avoid generating generic reflections when there is no actual content.
  if (messages.length === 0 && !userReflection) {
    return NextResponse.json(
      { error: "No conversation content available for reflection" },
      { status: 400 }
    );
  }

  const recentText = messages
    .map((m) => `${m.role}: ${m.message}`)
    .join("\n\n");

  const summaryBlock = conversation.conversationSummary?.trim()
    ? `\nConversation summary:\n${conversation.conversationSummary.trim()}`
    : "";

  const userBlock = userReflection
    ? `\nUser reflection for this checkpoint:\n${userReflection}`
    : "";

  const userContent = `Use the latest conversation signals most heavily.
If a user reflection is provided, treat it as the clearest checkpoint focus.

Conversation so far:
${recentText}${summaryBlock}${userBlock}

Write one Wisewave reflection checkpoint.

Requirements:
- 2 to 4 sentences
- under 80 words if possible
- one real pattern
- one grounded direction
- no therapy tone
- no summary of the whole conversation

Return only the reflection text.`;

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
        max_tokens: 140,
        temperature: 0.5,
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

    summary = sanitizeReflection(
      data.choices?.[0]?.message?.content?.trim() ?? ""
    );
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
    checkpoints: checkpoints.map((c: { id: string; summary: string; userInput: string | null; createdAt: Date }) => ({
      id: c.id,
      summary: c.summary,
      user_input: c.userInput,
      created_at: c.createdAt.toISOString(),
    })),
  });
}
