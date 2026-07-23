import { NextResponse } from "next/server";
import { resolveWisewaveModel } from "@/lib/wisewave-model-router";
import {
  ambientClientKeyOk,
  finalizeAmbientOpenAiText,
  isAmbientMomentApiEnabled,
  parseAmbientMomentRequest,
  resolveAmbientMomentWithoutModel,
  type AmbientMomentResponse,
} from "@/lib/wisewave-ambient-moment";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-ambient-key",
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/ambient/moment
 * Beach Window Meteor Moment — ambient reflection only.
 * No conversation create, no durable memory, no Wisewave turn path.
 */
export async function POST(request: Request) {
  if (!isAmbientMomentApiEnabled()) {
    return json({ error: "ambient_moment_disabled" }, 503);
  }
  if (!ambientClientKeyOk(request)) {
    return json({ error: "unauthorized" }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const parsed = parseAmbientMomentRequest(body);
  if (!parsed.ok) {
    return json({ error: parsed.error }, 400);
  }

  const resolved = resolveAmbientMomentWithoutModel(parsed.value);
  if (!resolved.useOpenAI) {
    return json(stripDebugUnlessDev(resolved.response));
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    // Fall back to template if key missing — Beach Window still gets a line.
    const language = resolved.response.debug?.language ?? "en";
    const text = finalizeAmbientOpenAiText("", language, parsed.value.mode);
    const fallback: AmbientMomentResponse = {
      ...resolved.response,
      text,
      result: "ambient_reflection",
      debug: {
        ...resolved.response.debug!,
        used_template: true,
      },
    };
    return json(stripDebugUnlessDev(fallback));
  }

  try {
    const model = resolveWisewaveModel("chat_turn");
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        max_tokens: 80,
        messages: resolved.openaiMessages,
      }),
    });

    if (!completion.ok) {
      const err = await completion.text().catch(() => "");
      console.error("[ambient/moment] OpenAI error", completion.status, err);
      const language = resolved.response.debug?.language ?? "en";
      const text = finalizeAmbientOpenAiText("", language, parsed.value.mode);
      return json(
        stripDebugUnlessDev({
          ...resolved.response,
          text,
          result: "ambient_reflection",
          debug: { ...resolved.response.debug!, used_template: true },
        })
      );
    }

    const data = (await completion.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    const language = resolved.response.debug?.language ?? "en";
    const text = finalizeAmbientOpenAiText(raw, language, parsed.value.mode);

    return json(
      stripDebugUnlessDev({
        ...resolved.response,
        text,
        result: "ambient_reflection",
      })
    );
  } catch (e) {
    console.error("[ambient/moment] OpenAI request failed", e);
    const language = resolved.response.debug?.language ?? "en";
    const text = finalizeAmbientOpenAiText("", language, parsed.value.mode);
    return json(
      stripDebugUnlessDev({
        ...resolved.response,
        text,
        result: "ambient_reflection",
        debug: { ...resolved.response.debug!, used_template: true },
      })
    );
  }
}

function stripDebugUnlessDev(response: AmbientMomentResponse): AmbientMomentResponse {
  if (process.env.NODE_ENV === "production" && process.env.AMBIENT_MOMENT_DEBUG !== "1") {
    const { debug: _d, ...rest } = response;
    return rest;
  }
  return response;
}
