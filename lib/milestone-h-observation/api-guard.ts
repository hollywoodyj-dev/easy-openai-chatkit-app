import { NextResponse } from "next/server";
import { checkHObservationApiKey } from "./auth";

export function observationUnauthorized(): NextResponse {
  return NextResponse.json(
    {
      error: "Unauthorized",
      hint: "Send x-h-observation-key or Authorization: Bearer <H_OBSERVATION_API_KEY> when the env var is set.",
    },
    { status: 401 }
  );
}

/** Returns a 401 response if the observation API key check fails; otherwise null. */
export function guardObservationApi(
  request: Request
): NextResponse | null {
  if (!checkHObservationApiKey(request)) {
    return observationUnauthorized();
  }
  return null;
}
