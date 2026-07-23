/**
 * Ambient Moment Service — Beach Window Meteor Moments (v0.1).
 * Uses Wisewave language + safety governance without full reflection product behavior.
 * No conversation creation, no durable memory, no pattern/continuity layers.
 */

import { randomUUID } from "crypto";
import { getP0SafetyGuardedResponse } from "@/lib/wisewave-p0-guarded-responses";
import { evaluateP0SafetyOverride } from "@/lib/wisewave-p0-safety-override";

export const AMBIENT_MOMENT_BUILD_MARKER = "ambient_moment_v0_1_beach_window";

export type AmbientMomentMode = "wish" | "truth";
export type AmbientMomentEnvironment = "beach_window";
export type AmbientMomentWeather = "clear" | "cloudy" | "rainy";
export type AmbientMomentLanguage = "en" | "zh";

export type AmbientMomentRequest = {
  event: "meteor_seen";
  mode: AmbientMomentMode;
  environment: AmbientMomentEnvironment;
  scene: {
    timeOfDay: "night";
    weather: AmbientMomentWeather;
    location: "ocean_beach";
  };
  userText?: string;
  language?: AmbientMomentLanguage;
  sessionId?: string;
  tone: "relaxed_poetic_grounded";
};

export type AmbientMomentResult =
  | "ambient_reflection"
  | "safety_redirect"
  | "suppressed";

export type AmbientMomentResponse = {
  momentId: string;
  result: AmbientMomentResult;
  text?: string;
  followupQuestion?: string;
  presentation?: {
    holdMs: number;
    fadeMs: number;
  };
  brandHint?: "wisewave";
  continuePath?: string;
  debug?: {
    build_marker: string;
    safety_triggered?: boolean;
    used_template?: boolean;
    language: AmbientMomentLanguage;
  };
};

export const AMBIENT_PRESENTATION_DEFAULT = {
  holdMs: 22_000,
  fadeMs: 1_800,
} as const;

/** Truth UI copy may stay; governance: reflection, never prediction. */
export const AMBIENT_TRUTH_DISCLAIMER_EN = "A reflection, not a prediction.";
export const AMBIENT_TRUTH_DISCLAIMER_ZH = "这是一句轻省的反照，不是预言。";

const WISH_TEMPLATES_EN = [
  "Let the wish remain simple enough to meet you tomorrow.",
  "Something in this wish may already have begun.",
  "You do not have to carry the whole wish tonight.",
  "Let it be small, real, and still alive in the morning.",
] as const;

const TRUTH_TEMPLATES_EN = [
  "One quiet truth may be this: you do not have to force clarity tonight.",
  "Perhaps you already know which part matters most.",
  "Something becomes clearer when you stop asking it to become certain.",
  "The truth may not be an answer. It may simply be what you can no longer ignore.",
] as const;

const WISH_TEMPLATES_ZH = [
  "愿望不必很大，只需要真实到足以开始。",
  "也许这个愿望里，已经有一小部分正在发生。",
  "今晚不必承载整个愿望，让它先轻轻留在这里。",
  "让它小小的、真实的，到了早晨还在。",
] as const;

const TRUTH_TEMPLATES_ZH = [
  "一个安静的真相也许是：今晚，你不必逼自己马上清楚。",
  "也许你已经知道，哪一部分最值得诚实面对。",
  "真相未必是答案，也可能只是那件你已经无法再忽略的事。",
  "不必把一切说成确定；留下你已经感觉到的那一点就够了。",
] as const;

export function isAmbientMomentApiEnabled(): boolean {
  const raw = process.env.ENABLE_AMBIENT_MOMENT?.trim().toLowerCase();
  if (raw === "0" || raw === "false" || raw === "off" || raw === "no") return false;
  // Default on when unset — Beach Window prototype needs a reachable hosted path.
  return true;
}

export function ambientClientKeyOk(request: Request): boolean {
  const required = process.env.AMBIENT_MOMENT_CLIENT_KEY?.trim();
  if (!required) return true;
  const header = request.headers.get("x-ambient-key")?.trim();
  return Boolean(header && header === required);
}

export function detectAmbientLanguage(
  language: AmbientMomentLanguage | undefined,
  userText: string | undefined
): AmbientMomentLanguage {
  if (language === "en" || language === "zh") return language;
  if (userText && /[\u4e00-\u9fff]/.test(userText)) return "zh";
  return "en";
}

export function pickAmbientTemplate(
  mode: AmbientMomentMode,
  language: AmbientMomentLanguage,
  seed = Date.now()
): string {
  const pool =
    language === "zh"
      ? mode === "wish"
        ? WISH_TEMPLATES_ZH
        : TRUTH_TEMPLATES_ZH
      : mode === "wish"
        ? WISH_TEMPLATES_EN
        : TRUTH_TEMPLATES_EN;
  return pool[Math.abs(seed) % pool.length]!;
}

export function parseAmbientMomentRequest(body: unknown):
  | { ok: true; value: AmbientMomentRequest }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid JSON body" };
  }
  const b = body as Record<string, unknown>;
  if (b.event !== "meteor_seen") {
    return { ok: false, error: "event must be meteor_seen" };
  }
  if (b.mode !== "wish" && b.mode !== "truth") {
    return { ok: false, error: "mode must be wish or truth" };
  }
  if (b.environment !== "beach_window") {
    return { ok: false, error: "environment must be beach_window" };
  }
  if (b.tone !== "relaxed_poetic_grounded") {
    return { ok: false, error: "tone must be relaxed_poetic_grounded" };
  }
  const scene = b.scene;
  if (!scene || typeof scene !== "object") {
    return { ok: false, error: "scene is required" };
  }
  const s = scene as Record<string, unknown>;
  if (s.timeOfDay !== "night") {
    return { ok: false, error: "scene.timeOfDay must be night" };
  }
  if (s.weather !== "clear" && s.weather !== "cloudy" && s.weather !== "rainy") {
    return { ok: false, error: "scene.weather must be clear, cloudy, or rainy" };
  }
  if (s.location !== "ocean_beach") {
    return { ok: false, error: "scene.location must be ocean_beach" };
  }
  if (
    b.language !== undefined &&
    b.language !== "en" &&
    b.language !== "zh"
  ) {
    return { ok: false, error: "language must be en or zh when set" };
  }

  const userText =
    typeof b.userText === "string" ? b.userText.trim().slice(0, 500) : undefined;

  return {
    ok: true,
    value: {
      event: "meteor_seen",
      mode: b.mode,
      environment: "beach_window",
      scene: {
        timeOfDay: "night",
        weather: s.weather,
        location: "ocean_beach",
      },
      userText: userText || undefined,
      language: b.language as AmbientMomentLanguage | undefined,
      sessionId:
        typeof b.sessionId === "string" ? b.sessionId.trim().slice(0, 128) : undefined,
      tone: "relaxed_poetic_grounded",
    },
  };
}

/** Clamp ambient copy: prefer 1 sentence, max 2; drop trailing question marks when possible. */
export function clampAmbientMomentText(
  text: string,
  language: AmbientMomentLanguage
): string {
  let t = text
    .replace(/^["'\s]+|["'\s]+$/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  // Strip common oracle / fortune framing if the model leaks it.
  t = t
    .replace(/\b(your destiny|the universe says|i predict|fortune tells)\b/gi, "")
    .replace(/(命运|占卜|预言|算命)/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  const parts = t
    .split(/(?<=[.!?。！？])\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  t = parts.slice(0, 2).join(language === "zh" ? "" : " ").trim();

  if (language === "zh") {
    if ([...t].length > 60) {
      t = [...t].slice(0, 58).join("").replace(/[，,、\s]+$/u, "") + "。";
    }
  } else {
    const words = t.split(/\s+/);
    if (words.length > 32) {
      t = words.slice(0, 30).join(" ").replace(/[,:;]+$/u, "") + ".";
    }
  }

  return t;
}

export function buildAmbientMomentSystemPrompt(
  mode: AmbientMomentMode,
  language: AmbientMomentLanguage
): string {
  const langLine =
    language === "zh"
      ? "Respond entirely in Simplified Chinese."
      : "Respond entirely in English.";

  const modeLine =
    mode === "wish"
      ? "The user made a quiet wish under a night beach sky. Reflect gently so the wish can stay small and real."
      : "The user asked for a quiet truth. Truth means a reflective sentence grounded in their present words — never prediction, revelation, fate, or hidden certainty.";

  return [
    "You write Ambient Moment lines for Beach Window — a calm ocean night, not a chat product.",
    "Ambient Moment Language Profile:",
    "- Prefer exactly one sentence. Two short sentences maximum.",
    "- EN: about 8–28 words. ZH: about 12–45 characters when possible (hard cap ~60).",
    "- Calm, grounded, minimal. Soft poetic tone is ok; never mystical authority.",
    "- No advice, therapy, coaching, companion warmth, fortune-telling, tarot, or destiny language.",
    "- No pattern naming, last-insight style, continuity, or multi-turn deepening.",
    "- Do not ask a follow-up question.",
    "- Do not invent a full reflection session.",
    modeLine,
    langLine,
    "Return only the moment text. No labels, no quotes wrappers, no markdown.",
  ].join("\n");
}

export function buildAmbientMomentUserPrompt(args: {
  mode: AmbientMomentMode;
  weather: AmbientMomentWeather;
  userText?: string;
  language: AmbientMomentLanguage;
}): string {
  const weather =
    args.weather === "rainy"
      ? "light rain over the ocean"
      : args.weather === "cloudy"
        ? "soft cloud cover"
        : "clear night";

  if (args.userText) {
    return args.language === "zh"
      ? `场景：海边夜晚，${weather}。模式：${args.mode === "wish" ? "许愿" : "问一个真相"}。用户写下：${args.userText}`
      : `Scene: night ocean beach, ${weather}. Mode: ${args.mode}. The user wrote: ${args.userText}`;
  }

  return args.language === "zh"
    ? `场景：海边夜晚，${weather}。模式：${args.mode === "wish" ? "许愿" : "问一个真相"}。用户没有写下具体文字，请给一句很轻的环境回应。`
    : `Scene: night ocean beach, ${weather}. Mode: ${args.mode}. The user left no extra words — offer one light ambient line.`;
}

export type AmbientMomentResolution = {
  response: AmbientMomentResponse;
  openaiMessages?: { role: "system" | "user"; content: string }[];
  useOpenAI: boolean;
};

export function resolveAmbientMomentWithoutModel(
  req: AmbientMomentRequest
): AmbientMomentResolution {
  const language = detectAmbientLanguage(req.language, req.userText);
  const momentId = randomUUID();

  if (req.userText) {
    const safety = evaluateP0SafetyOverride({
      userMessage: req.userText,
      wantsChinese: language === "zh",
    });
    if (safety.triggered) {
      return {
        useOpenAI: false,
        response: {
          momentId,
          result: "safety_redirect",
          text: getP0SafetyGuardedResponse(language === "zh"),
          presentation: { ...AMBIENT_PRESENTATION_DEFAULT },
          brandHint: "wisewave",
          // continuePath present for client but must not auto-display.
          continuePath: "/chat",
          debug: {
            build_marker: AMBIENT_MOMENT_BUILD_MARKER,
            safety_triggered: true,
            used_template: false,
            language,
          },
        },
      };
    }
  }

  // Empty / very short text → curated templates (no model call).
  const trimmed = req.userText?.trim() ?? "";
  if (trimmed.length < 8) {
    const text = clampAmbientMomentText(
      pickAmbientTemplate(req.mode, language),
      language
    );
    return {
      useOpenAI: false,
      response: {
        momentId,
        result: "ambient_reflection",
        text,
        presentation: { ...AMBIENT_PRESENTATION_DEFAULT },
        brandHint: "wisewave",
        continuePath: "/chat",
        debug: {
          build_marker: AMBIENT_MOMENT_BUILD_MARKER,
          used_template: true,
          language,
        },
      },
    };
  }

  return {
    useOpenAI: true,
    openaiMessages: [
      {
        role: "system",
        content: buildAmbientMomentSystemPrompt(req.mode, language),
      },
      {
        role: "user",
        content: buildAmbientMomentUserPrompt({
          mode: req.mode,
          weather: req.scene.weather,
          userText: trimmed,
          language,
        }),
      },
    ],
    response: {
      momentId,
      result: "ambient_reflection",
      presentation: { ...AMBIENT_PRESENTATION_DEFAULT },
      brandHint: "wisewave",
      continuePath: "/chat",
      debug: {
        build_marker: AMBIENT_MOMENT_BUILD_MARKER,
        used_template: false,
        language,
      },
    },
  };
}

export function finalizeAmbientOpenAiText(
  raw: string,
  language: AmbientMomentLanguage,
  fallbackMode: AmbientMomentMode
): string {
  const clamped = clampAmbientMomentText(raw, language);
  if (!clamped || clamped.length < 4) {
    return clampAmbientMomentText(
      pickAmbientTemplate(fallbackMode, language),
      language
    );
  }
  return clamped;
}
