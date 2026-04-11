export const BillingCycles = {
    monthly: "monthly",
    yearly: "yearly",
} as const;

export type BillingCycle = typeof BillingCycles[keyof typeof BillingCycles];