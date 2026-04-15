export const quotaRenewalCycle = {
    monthly: "MONTHLY",
    yearly: "YEARLY",
    static: "STATIC",
} as const;

export type QuotaRenewalCycle = typeof quotaRenewalCycle[keyof typeof quotaRenewalCycle];