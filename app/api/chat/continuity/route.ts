import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveChatUserId } from "@/lib/chat-identity";

export const dynamic = "force-dynamic";

/**
 * GET: Latest active insight (continuity) for the current user.
 * Returns { insight: { id, core_pattern, continuity_text, created_at } } or { insight: null }.
 */
export async function GET(request: Request) {
  const { userId } = await resolveChatUserId(request);

  const anyPrisma = prisma as unknown as {
    insight?: {
      findFirst: (args: {
        where: { userId: string; status: string };
        orderBy: { lastSeenAt: "asc" | "desc" };
        select: {
          id: true;
          corePattern: true;
          continuityText: true;
          createdAt: true;
        };
      }) => Promise<{
        id: string;
        corePattern: string;
        continuityText: string;
        createdAt: Date;
      } | null>;
    };
  };

  if (!anyPrisma.insight || typeof anyPrisma.insight.findFirst !== "function") {
    console.warn(
      "[chat/continuity] prisma.insight delegate not available; returning null continuity"
    );
    return NextResponse.json({ insight: null });
  }

  const latest = await anyPrisma.insight.findFirst({
    where: { userId, status: "active" },
    orderBy: { lastSeenAt: "desc" },
    select: {
      id: true,
      corePattern: true,
      continuityText: true,
      createdAt: true,
    },
  });

  if (!latest) {
    return NextResponse.json({ insight: null });
  }

  return NextResponse.json({
    insight: {
      id: latest.id,
      core_pattern: latest.corePattern,
      continuity_text: latest.continuityText,
      created_at: latest.createdAt.toISOString(),
    },
  });
}

