import { prisma } from "@/lib/prisma";
import type { Subscription } from "@prisma/client";

export type SubscriptionAccessResult = {
  hasAccess: boolean;
  effectiveStatus: "trialing" | "active" | "canceled" | "expired" | "none";
  latestSubscription: Subscription | null;
};

export function computeEffectiveSubscriptionStatus(
  sub: Subscription | null,
  now = new Date()
): SubscriptionAccessResult["effectiveStatus"] {
  if (!sub) return "none";
  if (sub.status === "expired") return "expired";
  if (sub.status === "canceled") return "canceled";
  if (sub.status === "trialing") {
    if (!sub.trialEndsAt) return "expired";
    return now < sub.trialEndsAt ? "trialing" : "expired";
  }
  if (sub.status === "active") {
    if (!sub.currentPeriodEnd) return "expired";
    return now < sub.currentPeriodEnd ? "active" : "expired";
  }
  return "expired";
}

export async function checkUserSubscriptionAccess(userId: string): Promise<SubscriptionAccessResult> {
  const latestSubscription = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  const effectiveStatus = computeEffectiveSubscriptionStatus(latestSubscription);
  const hasAccess = effectiveStatus === "trialing" || effectiveStatus === "active";
  return { hasAccess, effectiveStatus, latestSubscription };
}
