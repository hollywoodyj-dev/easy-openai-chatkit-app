function getApiKeyFromRequest(request: Request): string | null {
  const header =
    request.headers.get("x-api-key") ??
    (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  return header || null;
}

/**
 * Optional API key auth for Agent Tasks API.
 * Set AGENT_TASKS_API_KEY in env; if set, requests must send it via x-api-key header or Authorization: Bearer <key>.
 * If not set, requests are allowed (for local/dev).
 */
export function checkAgentTasksApiKey(request: Request): boolean {
  const key = process.env.AGENT_TASKS_API_KEY?.trim();
  if (!key) return true;
  return getApiKeyFromRequest(request) === key;
}

/**
 * Admin role: separate key. Set AGENT_TASKS_ADMIN_API_KEY in env.
 * When sent (x-api-key or Authorization: Bearer), caller can use agent=admin to get all tasks and use bulk reply.
 */
export function checkAgentTasksAdminKey(request: Request): boolean {
  const adminKey = process.env.AGENT_TASKS_ADMIN_API_KEY?.trim();
  if (!adminKey) return false;
  return getApiKeyFromRequest(request) === adminKey;
}
