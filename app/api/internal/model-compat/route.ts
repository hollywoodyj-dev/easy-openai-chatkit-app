import { NextResponse } from "next/server";
import { getWisewaveModelCompatibilityReport } from "@/lib/wisewave-model-router";

export const dynamic = "force-dynamic";

function getApiKeyFromRequest(request: Request): string | null {
  const header =
    request.headers.get("x-api-key") ??
    (request.headers.get("authorization") ?? "")
      .replace(/^Bearer\s+/i, "")
      .trim();
  return header || null;
}

function checkModelCompatApiKey(request: Request): boolean {
  const key = process.env.OPENAI_MODEL_COMPAT_API_KEY?.trim();
  if (!key) return true;
  return getApiKeyFromRequest(request) === key;
}

export async function GET(request: Request) {
  if (!checkModelCompatApiKey(request)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        hint: "Send x-api-key or Authorization: Bearer <OPENAI_MODEL_COMPAT_API_KEY> when the env var is set.",
      },
      { status: 401 }
    );
  }

  const report = getWisewaveModelCompatibilityReport();
  return NextResponse.json(report, { status: report.hasDeprecated ? 409 : 200 });
}

