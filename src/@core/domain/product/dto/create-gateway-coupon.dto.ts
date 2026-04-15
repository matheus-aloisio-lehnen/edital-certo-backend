// create discount.model.ts on stripe
export type CreateGatewayCouponDto = {
    duration: string; // "once" | "repeating" | "forever"
    duration_in_months?: number | null;
    percent_off?: number | null;
    amount_off?: number | null;
    currency?: string | null;
    metadata?: Record<string, string>; //discount.model.ts id, planid, priice id
};