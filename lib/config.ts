import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";
export const CHAT_SESSION_ENDPOINT = "/api/chat/session";
export const CHAT_AUTH_CHECK_ENDPOINT = "/api/chat/auth-check";
export const CHAT_SESSIONS_LIST_ENDPOINT = "/api/chat/sessions";
export const CHAT_MESSAGES_ENDPOINT = "/api/chat/messages";
export const CHAT_TURN_ENDPOINT = "/api/chat/turn";
export const CHAT_REFLECTION_ENDPOINT = "/api/chat/reflection";
export const CHAT_CONTINUITY_ENDPOINT = "/api/chat/continuity";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "What can you do?",
    prompt: "What can you do?",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Ask anything...";

export const GREETING = "How can I help you today?";

export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      primary: theme === "dark" ? "#f1f5f9" : "#0f172a",
      level: 1,
    },
  },
  radius: "round",
  // Add other theme options here
  // chatkit.studio/playground to explore config options
});
