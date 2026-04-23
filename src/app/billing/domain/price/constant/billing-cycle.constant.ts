export const billingCycle = {
    monthly: "MONTHLY",
    yearly: "YEARLY",
} as const;

export type BillingCycle = typeof billingCycle[keyof typeof billingCycle];