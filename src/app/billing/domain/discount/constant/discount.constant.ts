export const discountDuration = {
    once: "ONCE",
    repeating: "REPEATING",
    forever: "FOREVER",
} as const;

export const discountType = {
    percent: "PERCENT",
    fixed: "FIXED",
} as const;

export type DiscountDuration = typeof discountDuration[keyof typeof discountDuration];
export type DiscountType = typeof discountType[keyof typeof discountType];
