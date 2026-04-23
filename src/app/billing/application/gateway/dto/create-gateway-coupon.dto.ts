export type GatewayDiscountDuration = 'once' | 'repeating' | 'forever';

// create discount.model.ts on stripe
export type CreateGatewayCouponDto = {
    duration?: GatewayDiscountDuration;
    duration_in_months?: number;
    percent_off?: number;
    amount_off?: number;
    currency?: string;
    metadata?: Record<string, string>; //discount.model.ts id, planid, priice id
};