/**
 * Subscription plan pricing (USD)
 */
export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: "monthly",
    name: "Monthly",
    price: 3,
    interval: "month",
    description: "$3/month (test)",
    priceLabel: "$3",
    intervalLabel: "per month",
    badge: undefined as string | undefined,
  },
  yearly: {
    id: "yearly",
    name: "Yearly",
    price: 299,
    interval: "year",
    description: "$299/year",
    priceLabel: "$299",
    intervalLabel: "per year",
    badge: "Save 14%",
  },
} as const;

export type PlanId = keyof typeof SUBSCRIPTION_PLANS;
