/**
 * V1 Wisewave reflection extraction: one model call to get structured labels + insight candidate.
 * Used by /api/chat/turn before response generation. Failures are logged and return null.
 */

import { normalizeModelTextForStorage } from "@/lib/normalize-model-text";

export type ExtractedReflectionState = {
  trigger_label: string;
  emotion_label: string;
  interpretation_label: string;
  regulation_label: string;
  choice_label: string;
  insight_candidate: string;
};

const EXTRACTION_SYSTEM_PROMPT = `You are a reflection extraction system for a consciousness-guiding chat product.
Given a user's reflection message (and optional conversation summary), output a single JSON object with exactly these keys:
- trigger_label: short snake_case label for the trigger or event (e.g. delayed_reply, conflict_at_work, unclear_feedback)
- emotion_label: dominant emotion (e.g. anxiety, sadness, frustration, shame, uncertainty)
- interpretation_label: likely automatic interpretation (e.g. self_blame, rejection, loss_of_control, not_important, worth_threat)
- regulation_label: one grounding cue (e.g. pause_before_reacting, name_emotion, soften_urgency, wait_then_reassess)
- choice_label: one small conscious alternative (e.g. wait_before_responding, one_small_step, check_facts_first)
- insight_candidate: one short durable insight sentence (e.g. "When silence appears, the user tends to interpret it as personal rejection.")
  - insight_candidate must be written in English regardless of the input language (English canonical internal meaning)
  - Continuity downstream: when the user is clearly continuing a theme about rest, breaks, deserving to stop, or proving worth before relaxing, keep explicit **rest** and/or **break/relax** (or **sleep/downtime**) wording in insight_candidate—not only vague pronouns like "it"—so short follow-ups stay classifiable as the same durable pattern.

Rules:
- Output only valid JSON. No markdown, no code fence, no extra text.
- Use short snake_case for labels. insight_candidate is a single clear sentence.
- Be specific to the user's message, not generic.
- If something is unclear, use a neutral label (e.g. "uncertain") but always include all six keys.`;

const DEFAULT_STATE: ExtractedReflectionState = {
  trigger_label: "unknown",
  emotion_label: "uncertain",
  interpretation_label: "uncertain",
  regulation_label: "pause",
  choice_label: "reassess",
  insight_candidate: "",
};

function parseExtractionOutput(raw: string): ExtractedReflectionState | null {
  const trimmed = raw.trim();
  const stripped = trimmed.replace(/^```json\s*|\s*```$/g, "").trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const o = parsed as Record<string, unknown>;
  const trigger_label =
    typeof o.trigger_label === "string" ? o.trigger_label : DEFAULT_STATE.trigger_label;
  const emotion_label =
    typeof o.emotion_label === "string" ? o.emotion_label : DEFAULT_STATE.emotion_label;
  const interpretation_label =
    typeof o.interpretation_label === "string"
      ? o.interpretation_label
      : DEFAULT_STATE.interpretation_label;
  const regulation_label =
    typeof o.regulation_label === "string" ? o.regulation_label : DEFAULT_STATE.regulation_label;
  const choice_label =
    typeof o.choice_label === "string" ? o.choice_label : DEFAULT_STATE.choice_label;
  const insight_candidate =
    typeof o.insight_candidate === "string"
      ? o.insight_candidate.trim()
      : DEFAULT_STATE.insight_candidate;

  return {
    trigger_label: normalizeModelTextForStorage(trigger_label),
    emotion_label: normalizeModelTextForStorage(emotion_label),
    interpretation_label: normalizeModelTextForStorage(interpretation_label),
    regulation_label: normalizeModelTextForStorage(regulation_label),
    choice_label: normalizeModelTextForStorage(choice_label),
    insight_candidate: normalizeModelTextForStorage(insight_candidate),
  };
}

/**
 * Call OpenAI to extract structured reflection state from the user message.
 * Returns null on failure or invalid JSON; logs failures.
 */
export async function extractReflectionState(
  userMessage: string,
  apiKey: string,
  model: string,
  conversationSummary?: string | null
): Promise<ExtractedReflectionState | null> {
  const summaryBlock = conversationSummary?.trim()
    ? `\nConversation summary (for context only):\n${conversationSummary.trim()}`
    : "";
  const userContent = `User reflection message:\n${userMessage}${summaryBlock}\n\nOutput the JSON object with the six keys.`;

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
          { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        max_completion_tokens: 320,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.warn("[wisewave-extract] OpenAI error", res.status, err);
      return null;
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      console.warn("[wisewave-extract] Empty model response");
      return null;
    }

    const state = parseExtractionOutput(content);
    if (!state) {
      console.warn("[wisewave-extract] Invalid or malformed JSON", content.slice(0, 200));
      return null;
    }
    return state;
  } catch (e) {
    console.error("[wisewave-extract] Request failed", e);
    return null;
  }
}
