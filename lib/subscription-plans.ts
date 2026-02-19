/**
 * Subscription plan pricing (USD)
 */
export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: "monthly",
    name: "Monthly",
    price: 29,
    interval: "month",
    description: "$29/month",
    priceLabel: "$29",
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
