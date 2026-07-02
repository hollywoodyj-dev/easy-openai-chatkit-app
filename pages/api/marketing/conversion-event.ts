import type { NextApiRequest, NextApiResponse } from "next";
import { recordConversionEvent } from "@/lib/record-conversion-event";
import { PERSISTED_CONVERSION_EVENT_NAMES } from "@/lib/wisewave-conversion-tracking";
import { verifyUserToken } from "@/lib/auth";

type Body = {
  eventName?: string;
  /** Auth JWT; verified server-side to attribute the event to an account. */
  token?: string;
  userId?: string;
  sessionId?: string;
  source?: string;
  lp?: string;
  adGroup?: string;
  platform?: string;
  path?: string;
  metadata?: Record<string, string | number | boolean>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const body = (req.body ?? {}) as Body;
  const eventName =
    typeof body.eventName === "string" ? body.eventName.trim() : "";

  if (!eventName || !PERSISTED_CONVERSION_EVENT_NAMES.has(eventName)) {
    return res.status(400).json({ error: "Invalid eventName" });
  }

  // Never persist auth material in event metadata.
  if (body.metadata) {
    delete body.metadata.token;
    delete body.metadata.auth_token;
  }

  const verifiedUserId =
    typeof body.token === "string" && body.token.trim()
      ? verifyUserToken(body.token.trim())
      : null;

  await recordConversionEvent({
    eventName,
    userId: verifiedUserId ?? (typeof body.userId === "string" ? body.userId : null),
    sessionId: typeof body.sessionId === "string" ? body.sessionId : null,
    source: typeof body.source === "string" ? body.source : null,
    lp: typeof body.lp === "string" ? body.lp : null,
    adGroup: typeof body.adGroup === "string" ? body.adGroup : null,
    platform: typeof body.platform === "string" ? body.platform : null,
    path: typeof body.path === "string" ? body.path : null,
    metadata: body.metadata,
  });

  return res.status(204).end();
}
