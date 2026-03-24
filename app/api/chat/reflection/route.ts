import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";
import { normalizeModelTextForStorage } from "@/lib/normalize-model-text";
import { REFLECTION_SYSTEM_PROMPT } from "@/lib/wisewave-prompts";

export const dynamic = "force-dynamic";

// Use delegate type so TS recognizes reflectionCheckpoint (generated client may be out of sync in IDE)
type ReflectionCheckpointDelegate = {
  create: (args: {
    data: { conversationId: string; userId: string; userInput: string | null; summary: string };
  }) => Promise<{ id: string; summary: string }>;
  findMany: (args: {
    where: { conversationId: string };
    orderBy: { createdAt: "asc" | "desc" };
    take: number;
    select: { id: true; summary: true; userInput: true; createdAt: true };
  }) => Promise<Array<{ id: string; summary: string; userInput: string | null; createdAt: Date }>>;
};
const db = prisma as typeof prisma & { reflectionCheckpoint: ReflectionCheckpointDelegate };

const REFLECTION_RECENT_MESSAGES = 12;
const DEFAULT_CHAT_MODEL = "gpt-5.4";

function sanitizeReflection(text: string): string {
  return text
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

function sanitizeChineseOutputLeaks(text: string): string {
  // Narrow, explicit cleanup for common mixed-language leak words in ZH mode.
  const replacements: Array<[RegExp, string]> = [
    [/\bobeying\b/gi, "遵循"],
    [/\bobey\b/gi, "遵循"],
    [/\bobet\b/gi, "遵循"],
    [/\btrigger(?:_label)?\b/gi, "触发点"],
    [/\bemotion(?:_label)?\b/gi, "情绪"],
    [/\binterpretation(?:_label)?\b/gi, "解读"],
    [/\bregulation(?:_label)?\b/gi, "调节"],
    [/\bchoice(?:_label)?\b/gi, "下一步"],
    [/\binsight(?:_candidate)?\b/gi, "洞见"],
    [/\bpattern\b/gi, "模式"],
    [/\bloop\b/gi, "循环"],
    [/\bpressure\b/gi, "压力"],
    [/\brule\b/gi, "规则"],
  ];

  let cleaned = text;
  for (const [regex, value] of replacements) {
    cleaned = cleaned.replace(regex, value);
  }

  return cleaned
    .replace(/\b(?:Event|Feeling|Interpretation|Regulation|Next step|Insight)\s*:\s*/gi, "")
    .replace(/\s{2,}/g, " ")
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

  const wantsChinese = /[\u4E00-\u9FFF]/.test(`${recentText}\n${userReflection ?? ""}`);
  const reflectionLanguageInstruction = wantsChinese
    ? "\n\nLanguage rule: Respond in Chinese only. Do not include English words."
    : "\n\nLanguage rule: Respond in English only. Do not include Chinese characters.";

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
          { role: "user", content: userContent + reflectionLanguageInstruction },
        ],
        max_completion_tokens: 140,
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
    if (summary) {
      summary = normalizeModelTextForStorage(summary);
    }
    if (wantsChinese && summary) {
      summary = sanitizeChineseOutputLeaks(summary);
    }
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

  const checkpoint = await db.reflectionCheckpoint.create({
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

  const checkpoints = await db.reflectionCheckpoint.findMany({
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
