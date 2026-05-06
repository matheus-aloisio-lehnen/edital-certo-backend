export const subscriptionStatus = {
    active: "ACTIVE",
    overdue: "OVERDUE",
    suspended: "SUSPENDED",
    cancelled: "CANCELLED",
} as const;

export type SubscriptionStatus = typeof subscriptionStatus[keyof typeof subscriptionStatus];
