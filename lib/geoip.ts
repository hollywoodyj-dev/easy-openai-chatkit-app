import type { NextApiRequest } from "next";
import { prisma } from "@/lib/prisma";

function getClientIp(req: NextApiRequest): string | null {
  const xff = req.headers["x-forwarded-for"];
  const forwarded = Array.isArray(xff) ? xff[0] : xff;
  const raw =
    forwarded?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    null;

  if (!raw) return null;
  // Strip IPv6 prefix for IPv4-mapped addresses, e.g. ::ffff:127.0.0.1
  if (raw.startsWith("::ffff:")) {
    return raw.slice(7);
  }
  return raw;
}

async function lookupCountryFromIp(ip: string): Promise<string | null> {
  try {
    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/country/`);
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    return text || null;
  } catch {
    return null;
  }
}

export async function updateUserCountryFromRequest(
  userId: string,
  req: NextApiRequest
): Promise<void> {
  const ip = getClientIp(req);
  if (!ip) return;

  const country = await lookupCountryFromIp(ip);
  if (!country) return;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { country },
    });
  } catch (error) {
    console.error("[geoip] Failed to update user country", error);
  }
}

