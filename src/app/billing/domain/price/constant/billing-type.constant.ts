export const billingType = {
    licensed: "LICENSED",
    metered: "METERED",
} as const;

export type BillingType = typeof billingType[keyof typeof billingType];
