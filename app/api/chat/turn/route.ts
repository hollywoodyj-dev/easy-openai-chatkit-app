import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";
import { extractReflectionState } from "@/lib/wisewave-extract";
import { CHAT_SYSTEM_PROMPT as WISEWAVE_CHAT_PROMPT } from "@/lib/wisewave-prompts";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const DEFAULT_CHAT_MODEL = "gpt-5.4";
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

// Light user-facing rephrasing for continuity text:
// 1) detect a small set of common pattern families
// 2) map each family to a short, natural reminder template
// 3) keep continuity selection logic unchanged
function lowerFirst(s: string): string {
  return s ? s.charAt(0).toLowerCase() + s.slice(1).trim() : s;
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).trim() : s;
}

function sentence(s: string): string {
  const trimmed = s.trim().replace(/[.]+$/, "");
  return trimmed ? trimmed + "." : trimmed;
}

type ContinuityPatternFamily =
  | "earned_value_after_effort"
  | "delayed_reply_means_i_did_something_wrong"
  | "rest_must_be_earned"
  | "constant_pressure_keep_up"
  | "replay_for_mistakes"
  | "fallback_generic";

function detectContinuityPatternFamily(corePattern: string): ContinuityPatternFamily {
  const text = corePattern.trim().toLowerCase();

  if (
    /even after .*the user tends to interpret their (worth|value) as still needing to be earned/.test(
      text
    ) ||
    /prove (myself|yourself|themselves|your worth)/.test(text) ||
    /earn(ed)? (my|their|your) place/.test(text)
  ) {
    return "earned_value_after_effort";
  }

  if (
    /reply is delayed/.test(text) &&
    /(did something wrong|prove (myself|yourself|themselves) again|must prove)/.test(text)
  ) {
    return "delayed_reply_means_i_did_something_wrong";
  }

  if (/rest.*earned/.test(text) || /pause.*before feeling finished/.test(text)) {
    return "rest_must_be_earned";
  }

  if (
    /constant pressure/.test(text) ||
    /must always keep up/.test(text) ||
    /always perform/.test(text)
  ) {
    return "constant_pressure_keep_up";
  }

  if (
    /replay/.test(text) ||
    /did something wrong/.test(text) ||
    /searching for mistakes|missteps/.test(text)
  ) {
    return "replay_for_mistakes";
  }

  return "fallback_generic";
}

function rewriteEarnedValueAfterEffort(corePattern: string): string {
  const normalized = corePattern.trim().replace(/\s+/g, " ");

  const m = normalized.match(
    /^Even after (.*?), the user tends to interpret their (worth|value) as still needing to be earned[.]?$/i
  );
  if (m) {
    const afterPart = lowerFirst(m[1]);
    return sentence(
      `Even after ${afterPart}, it can still feel like your value has to be earned again.`
    );
  }

  return "Doing a lot can still leave the feeling that it is not enough yet.";
}

function fallbackContinuityReminder(corePattern: string): string {
  const text = corePattern.trim();

  const cleaned = text
    .replace(/\bthe user\b/gi, "you")
    .replace(/\btends to\b/gi, "can often")
    .trim();

  if (
    /you can often interpret|you can often assume|interpret their|value as/i.test(
      cleaned
    )
  ) {
    return sentence(
      "This pattern can come back quickly, especially when things feel uncertain."
    );
  }

  return sentence(cleaned);
}

function continuityReminderFromFamily(
  family: ContinuityPatternFamily,
  corePattern: string
): string {
  switch (family) {
    case "earned_value_after_effort":
      return rewriteEarnedValueAfterEffort(corePattern);

    case "delayed_reply_means_i_did_something_wrong":
      return "A delayed reply can quickly start to feel like proof you did something wrong.";

    case "rest_must_be_earned":
      return "Rest can quickly start to feel like something you still have to earn.";

    case "constant_pressure_keep_up":
      return "It can start to feel like you are only allowed to relax when you are keeping up.";

    case "replay_for_mistakes":
      return "Unclear moments can quickly turn into checking for what you might have done wrong.";

    case "fallback_generic":
    default:
      return fallbackContinuityReminder(corePattern);
  }
}

function toContinuityReminderText(corePattern: string): string {
  const family = detectContinuityPatternFamily(corePattern);
  return continuityReminderFromFamily(family, corePattern);
}

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
      max_completion_tokens: 256,
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
 * POST body: {
 *   session_id,
 *   message,
 *   metadata?,
 *   insight_tags?,
 *   feedback?    // optional: feedback about a prior suggested action/outcome
 * }
 * Response: {
 *   assistant_message,
 *   reflection_state?,
 *   debug_*?,
 *   feedback_saved?: boolean
 * }
 */
export async function POST(request: Request) {
  const { userId, sessionCookie } = await resolveChatUserId(request);
  let body: {
    session_id?: string;
    message?: string;
    metadata?: unknown;
    insight_tags?: unknown;
    feedback?: unknown;
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
  const rawFeedback =
    body.feedback !== undefined && body.feedback !== null
      ? (body.feedback as unknown)
      : undefined;

  // V1 persistence order: save user message before any AI processing so a failed model call never loses the user's reflection.
  let userMsg;
  try {
    userMsg = await prisma.message.create({
      data: {
        conversationId: sessionId,
        userId,
        role: "user",
        message: message.trim(),
        metadata: metadata ?? undefined,
        insightTags: insightTags ?? undefined,
      },
    });
    console.debug("[ticket7][chat/turn] message_save", {
      sessionId,
      userMessageId: userMsg.id,
      assistantMessageId: null,
      phase: "user",
      success: true,
    });
  } catch (e) {
    console.error("[chat/turn] user message save failed", e);
    console.debug("[ticket7][chat/turn] message_save", {
      sessionId,
      userMessageId: null,
      assistantMessageId: null,
      phase: "user",
      success: false,
      errorType:
        e instanceof Error
          ? e.name
          : typeof e === "object" && e !== null
          ? "object"
          : "unknown",
    });
    return NextResponse.json(
      { error: "Failed to save user message" },
      { status: 500 }
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
  // Ticket 7: lightweight, structured log for extraction outcome.
  console.debug("[ticket7][chat/turn] extraction", {
    sessionId,
    userMessageId: userMsg.id,
    hasReflectionState: !!reflectionState,
  });

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

  // Use Wisewave reflection-style prompt by default; override with OPENAI_CHAT_SYSTEM_PROMPT or OPENAI_CHAT_SYSTEM_PROMPT_FILE
  let systemPrompt = process.env.OPENAI_CHAT_SYSTEM_PROMPT?.trim();
  if (!systemPrompt && process.env.OPENAI_CHAT_SYSTEM_PROMPT_FILE?.trim()) {
    try {
      const path = join(process.cwd(), process.env.OPENAI_CHAT_SYSTEM_PROMPT_FILE.trim());
      systemPrompt = readFileSync(path, "utf-8").trim();
    } catch (e) {
      console.warn("[chat/turn] Could not read OPENAI_CHAT_SYSTEM_PROMPT_FILE", e);
    }
  }
  if (!systemPrompt) {
    systemPrompt = WISEWAVE_CHAT_PROMPT;
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
    const reflectionBlock =
      reflectionState && reflectionState.insight_candidate.trim()
        ? `\n\nLatest reflection state (for this user message):\n- trigger_label: ${reflectionState.trigger_label}\n- emotion_label: ${reflectionState.emotion_label}\n- interpretation_label: ${reflectionState.interpretation_label}\n- regulation_label: ${reflectionState.regulation_label}\n- choice_label: ${reflectionState.choice_label}\n- insight_candidate: ${reflectionState.insight_candidate}`
        : "";
    openaiMessagesForApi.push({
      role: "system",
      content: systemPrompt + continuationHint + summaryBlock + reflectionBlock,
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
        max_completion_tokens: 2048,
      }),
    });

    if (!completion.ok) {
      const err = await completion.json().catch(() => ({}));
      console.error("[chat/turn] OpenAI error", completion.status, err);
      console.debug("[ticket7][chat/turn] generation_error", {
        sessionId,
        userMessageId: userMsg.id,
        status: completion.status,
      });
      return NextResponse.json(
        {
          assistant_message:
            "I had trouble generating a response just now. You can try sending that again or rephrasing it a bit.",
        },
        { status: 200 }
      );
    }

    const data = (await completion.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    assistantContent =
      data.choices?.[0]?.message?.content?.trim() ?? "";
  } catch (e) {
    console.error("[chat/turn] OpenAI request failed", e);
    console.debug("[ticket7][chat/turn] generation_error", {
      sessionId,
      userMessageId: userMsg.id,
      networkFailure: true,
    });
    return NextResponse.json(
      {
        assistant_message:
          "I had trouble generating a response just now. You can try sending that again or rephrasing it a bit.",
      },
      { status: 200 }
    );
  }

  // V1: persist assistant message after successful generation.
  let assistantMsgId: string | null = null;
  try {
    const assistantMsg = await prisma.message.create({
      data: {
        conversationId: sessionId,
        userId,
        role: "assistant",
        message: assistantContent,
      },
    });
    assistantMsgId = assistantMsg.id;
    console.debug("[ticket7][chat/turn] message_save", {
      sessionId,
      userMessageId: userMsg.id,
      assistantMessageId: assistantMsgId,
      phase: "assistant",
      success: true,
    });
  } catch (e) {
    console.error("[chat/turn] assistant message save failed", e);
    console.debug("[ticket7][chat/turn] message_save", {
      sessionId,
      userMessageId: userMsg.id,
      assistantMessageId: null,
      phase: "assistant",
      success: false,
      errorType:
        e instanceof Error
          ? e.name
          : typeof e === "object" && e !== null
          ? "object"
          : "unknown",
    });
    // Assistant save failure should not break the user-facing reply.
  }

  // --- Debug / QA: track per-turn insight save + full eligibility decision chain ---
  let debugInsightId: string | null = null;
  let debugIsContinuityEligible: boolean | null = null;
  let debugInsightCorePattern: string | null = null;
  let debugHasStrongPatternCue: boolean | null = null;
  let debugIsFlatRestatement: boolean | null = null;
  let debugIsVagueSource: boolean | null = null;
  let debugAllLabelsWeak: boolean | null = null;
  let debugIsSystemy: boolean | null = null;
  let debugIsVeryShort: boolean | null = null;
  let debugIsTooShortAndFlat: boolean | null = null;
  let debugIsTooGeneric: boolean | null = null;
  let feedbackSaved: boolean = false;

  // Ticket 4: save one durable insight when we have a good candidate.
  if (reflectionState && reflectionState.insight_candidate.trim()) {
    const corePattern = reflectionState.insight_candidate.trim();
    const continuityText = toContinuityReminderText(corePattern);

    const sourceLower = message.trim().toLowerCase();
    const vagueSourcePatterns = [
      "feel off",
      "feels off",
      "something feels weird",
      "i'm tired",
      "i am tired",
      "not sure",
      "not sure what's wrong",
      "not sure what is wrong",
      "i don't know",
      "i dont know",
      "i don't know. i just feel off",
      "everything feels a bit off",
      "i feel strange",
      "feel strange",
      "i'm low",
      "i am low",
      "im low",
      "i'm not okay",
      "i am not okay",
      "today feels odd",
      "today feels a bit odd",
      "i can't explain it",
      "cant explain it",
      "...",
    ];
    const isVagueSource = vagueSourcePatterns.some((p) =>
      sourceLower.includes(p)
    );

    const lower = corePattern.toLowerCase();

    // For continuity, we want a genuinely reusable pattern, not just a vague
    // state summary that happens to be well phrased.
    const hasStrongPatternCue =
      /(inner rule|rule that|demand|pressure|loop|automatic habit|keeps .* (going|building)|treats .* as|turns .* into|have to prove|has to prove|must prove|prove (myself|yourself|themselves)|prove your worth|worth (still )?needs? to be earned|worth must be earned|earn (my|your|their) place|not enough even after|still not enough after|after accomplishing a lot|effort still (doesn't|does not) count|accomplishment doesn't settle it|doing a lot but still not enough)/i.test(
        corePattern
      );
    const hasTriggerStructure = /\bwhen\b|\bwhenever\b|\bevery time\b/i.test(
      corePattern
    );
    const looksLikeVagueStateSummary =
      /feels off|feel off|tired\b|weird\b|something (may be|is) wrong|cannot identify what is happening|not sure what(?:'s| is) wrong|vague sense/i.test(
        lower
      );
    // Sentences that technically look like "when X then Y" but where X is still
    // just a vague state ("feels off", "is tired", "not sure what's wrong").
    // These are useful for the immediate reflection, but too weak as durable,
    // resurfaced continuity insights.
    const hasVagueTriggerRule = /^when\b[^.]*\b(feels? off|feel off|something feels weird|is tired|feels tired|cannot identify what is happening|not sure what(?:'s| is) wrong|everything feels a bit off)[^.]*\./i.test(
      lower
    );

    // Positive durability requirement: only treat as continuity-grade if there
    // is a clearly reusable pattern, not just a cleaned-up vague-state summary.
    const hasDurablePattern =
      hasStrongPatternCue ||
      (hasTriggerStructure && !looksLikeVagueStateSummary && !hasVagueTriggerRule);

    const weakLabels = new Set(["unknown", "uncertain"]);
    const allLabelsWeak =
      weakLabels.has(reflectionState.trigger_label) &&
      weakLabels.has(reflectionState.emotion_label) &&
      weakLabels.has(reflectionState.interpretation_label) &&
      weakLabels.has(reflectionState.regulation_label) &&
      weakLabels.has(reflectionState.choice_label);
    const bannedPhrases = [
      "too ambiguous to infer",
      "unable to infer",
      "insufficient signal",
      "insufficient information",
      "not enough information",
      "unclear trigger",
      "unclear emotion",
      "user reflection is ambiguous",
    ];
    const isSystemy =
      lower.startsWith("as an ai") ||
      lower.startsWith("the model") ||
      lower.includes("insufficient signal") ||
      bannedPhrases.some((p) => lower.includes(p));

    const isVeryShort = corePattern.length < 24;
    const isTooShortAndFlat =
      isVeryShort &&
      !corePattern.includes(",") &&
      !corePattern.includes(".") &&
      !/(rule|pressure|loop|demand|pattern|reaction|uncertainty|habit)/i.test(
        corePattern
      );

    const isTooGeneric =
      lower === "you were upset today." ||
      lower === "you were upset today" ||
      lower === "you had a hard conversation." ||
      lower === "you had a hard conversation" ||
      lower === "you feel emotions strongly." ||
      lower === "you feel emotions strongly";

    const genericStarts = [
      "you feel",
      "you felt",
      "you were",
      "you had",
      "the user feels",
      "the user had",
    ];
    // Treat "the user feels..." as flat only when there is no strong pattern
    // cue (rule/loop/pressure/proving/keep up, etc.). For strong cases like
    // "have to prove myself", we want them to stay eligible.
    const isFlatRestatement =
      genericStarts.some((p) => lower.startsWith(p)) &&
      !hasStrongPatternCue &&
      !/(rule|pressure|loop|demand|pattern|reaction|uncertainty|habit)/i.test(
        corePattern
      );

    // For strongly patterned, non-vague sources (like "prove myself" / "constant
    // pressure"), we allow eligibility even if the extractor labels are all
    // "unknown"/"uncertain" — the text pattern itself carries enough durability.
    const labelsMustBeStrong = !hasStrongPatternCue || isVagueSource;

    let isContinuityEligible =
      (!labelsMustBeStrong || !allLabelsWeak) &&
      !isSystemy &&
      !isTooShortAndFlat &&
      !isTooGeneric &&
      !isFlatRestatement &&
      // Positive durability rule: require a reusable pattern (inner rule / loop /
      // pressure / trigger→interpretation link). If the insight is only a vague-
      // state summary, it remains non-eligible even if wording is clean.
      hasDurablePattern;

    // v4 default-deny for weak vague-state sources:
    // If the *source* input is a vague state ("feel off", "tired", "not sure
    // what's wrong", etc.), then continuity is *off by default*. Only allow
    // an override when there is an especially clear, strong pattern: explicit
    // rule/pressure language *and* a trigger→interpretation chain, and it is
    // not just a cleaned-up vague-state summary.
    if (isVagueSource) {
      const strongOverride =
        hasStrongPatternCue &&
        hasTriggerStructure &&
        !looksLikeVagueStateSummary &&
        !hasVagueTriggerRule;

      if (!strongOverride) {
        isContinuityEligible = false;
      }
    }

    // Capture full decision chain for this turn (debug only).
    debugInsightCorePattern = corePattern;
    debugHasStrongPatternCue = hasStrongPatternCue;
    debugIsFlatRestatement = isFlatRestatement;
    debugIsVagueSource = isVagueSource;
    debugAllLabelsWeak = allLabelsWeak;
    debugIsSystemy = isSystemy;
    debugIsVeryShort = isVeryShort;
    debugIsTooShortAndFlat = isTooShortAndFlat;
    debugIsTooGeneric = isTooGeneric;
    try {
      const anyPrisma = prisma as unknown as {
        insight?: {
          create: (args: {
            data: {
              userId: string;
              conversationId: string;
              sourceMessageId: string;
              corePattern: string;
              continuityText: string;
              status: string;
              confidenceScore: number | null;
              isContinuityEligible: boolean;
            };
          }) => Promise<{ id: string }>;
        };
      };

      if (!anyPrisma.insight || typeof anyPrisma.insight.create !== "function") {
        console.warn(
          "[chat/turn] prisma.insight delegate not available; skipping insight save"
        );
      } else {
        const created = await anyPrisma.insight.create({
          data: {
            userId,
            conversationId: sessionId,
            sourceMessageId: userMsg.id,
            corePattern,
            continuityText,
            status: "active",
            confidenceScore: null,
            isContinuityEligible,
          },
        });
        debugInsightId = created?.id ?? null;
        debugIsContinuityEligible = isContinuityEligible;
      }
    } catch (e) {
      console.warn("[chat/turn] Insight save failed", e);
    }
  }
  // Ticket 7: structured log for insight + continuity decision.
  console.debug("[ticket7][chat/turn] insight_continuity", {
    sessionId,
    userMessageId: userMsg.id,
    hasReflectionState: !!reflectionState,
    insightCreated: !!debugInsightId,
    insightId: debugInsightId,
    isContinuityEligible: debugIsContinuityEligible,
  });

  // Ticket 6 (Milestone B): optional feedback capture about prior action outcome.
  // Only persist when feedback.note exists, is a string, and is non-empty after trim.
  // Otherwise do not save; feedback_saved stays false.
  const note =
    rawFeedback &&
    typeof rawFeedback === "object" &&
    "note" in rawFeedback &&
    typeof (rawFeedback as { note?: unknown }).note === "string"
      ? ((rawFeedback as { note: string }).note || "").trim()
      : "";
  if (note) {
    try {
      const anyPrisma = prisma as unknown as {
        feedback?: {
          create: (args: {
            data: {
              userId: string;
              conversationId: string;
              sourceMessageId: string;
              payload: unknown;
            };
          }) => Promise<unknown>;
        };
      };

      if (!anyPrisma.feedback || typeof anyPrisma.feedback.create !== "function") {
        console.warn(
          "[chat/turn] prisma.feedback delegate not available; skipping feedback save"
        );
      } else {
        await anyPrisma.feedback.create({
          data: {
            userId,
            conversationId: sessionId,
            sourceMessageId: userMsg.id,
            payload: { note },
          },
        });
        feedbackSaved = true;
      }
    } catch (e) {
      console.warn("[chat/turn] Feedback save failed", e);
    }
  }

  const res = NextResponse.json({
    assistant_message: assistantContent,
    ...(reflectionState && { reflection_state: reflectionState }),
    // Debug-only fields to help QA distinguish:
    // - whether this turn created an Insight row
    // - whether that row was continuity-eligible
    // - full decision chain for that eligibility
    debug_insight_id: debugInsightId,
    debug_is_continuity_eligible: debugIsContinuityEligible,
    debug_insight_core_pattern: debugInsightCorePattern,
    debug_has_strong_pattern_cue: debugHasStrongPatternCue,
    debug_is_flat_restatement: debugIsFlatRestatement,
    debug_is_vague_source: debugIsVagueSource,
    debug_all_labels_weak: debugAllLabelsWeak,
    debug_is_systemy: debugIsSystemy,
    debug_is_very_short: debugIsVeryShort,
    debug_is_too_short_and_flat: debugIsTooShortAndFlat,
    debug_is_too_generic: debugIsTooGeneric,
    feedback_saved: feedbackSaved,
  });
  if (sessionCookie) {
    res.headers.append("Set-Cookie", sessionCookie);
  }
  return res;
}
