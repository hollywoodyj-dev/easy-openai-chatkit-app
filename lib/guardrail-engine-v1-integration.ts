import type {
  DisplayLang,
  GuardrailEngineResult,
  LayerCandidate,
  TurnType,
} from "@/lib/guardrail-engine-v1";
import { runtimeGuardrail } from "@/lib/guardrail-engine-v1";

export interface ChatTurnRequestV1 {
  message: string;
  conversation_id?: string;
  user_id?: string;
  lang?: DisplayLang;
  debug?: boolean;
  client_context?: {
    last_insight_seen?: boolean;
  };
}

export interface GenerateLayersInput {
  message: string;
  context: {
    conversation_id: string;
    recent_messages: string[];
    continuity_summary?: string;
  };
  lang: DisplayLang;
}

export interface GeneratedLayerSet {
  candidates: LayerCandidate[];
}

export function detectTurnType(message: string): TurnType {
  const text = message.trim();
  if (!text) return "logistical";
  const lower = text.toLowerCase();
  if (text.length < 20) return "mixed";
  if (
    /^(what|how|when|where|which|who)\b/.test(lower) ||
    /^(什么|怎么|如何|为什么|哪里|哪个|哪個|是否)/.test(text)
  ) {
    return "factual";
  }
  if (text.length > 80) return "reflective";
  return "mixed";
}

export function estimateSignal(message: string): number {
  const lengthFactor = Math.min(message.trim().length / 200, 1);
  return Number(lengthFactor.toFixed(2));
}

/**
 * Minimal default generator stub.
 * Integration point only — real layer generation belongs to model pipeline logic.
 */
export async function generateLayers(input: GenerateLayersInput): Promise<GeneratedLayerSet> {
  return {
    candidates: [
      {
        key: "main_reflection",
        text: input.message,
        eligible: true,
        readability_ok: true,
        weak_input_safe: true,
        guidance_risk: "low",
        authorship_risk: "low",
      },
    ],
  };
}

/**
 * Minimal end-to-end example:
 * generator -> runtime guardrail -> display-layer response.
 */
export async function runGuardrailChain(
  req: ChatTurnRequestV1,
  context: { conversation_id: string; recent_messages: string[]; continuity_summary?: string }
): Promise<GuardrailEngineResult> {
  const lang = req.lang ?? "en";
  const generated = await generateLayers({
    message: req.message,
    context,
    lang,
  });
  return runtimeGuardrail(generated.candidates, {
    turn_type: detectTurnType(req.message),
    lang,
    input_signal_strength: estimateSignal(req.message),
    current_turn_supports_continuity: true,
    enable_h: true,
    enable_i: true,
    enable_j: false,
    max_optional_layers: 1,
    debug: Boolean(req.debug),
  });
}
