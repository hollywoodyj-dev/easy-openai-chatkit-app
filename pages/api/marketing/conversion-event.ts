import type { NextApiRequest, NextApiResponse } from "next";
import { recordConversionEvent } from "@/lib/record-conversion-event";
import { PERSISTED_CONVERSION_EVENT_NAMES } from "@/lib/wisewave-conversion-tracking";

type Body = {
  eventName?: string;
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

  await recordConversionEvent({
    eventName,
    userId: typeof body.userId === "string" ? body.userId : null,
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
