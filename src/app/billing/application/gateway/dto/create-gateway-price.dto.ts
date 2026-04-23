export type GatewayRecurringInterval = 'month' | 'year';
export type CreateGatewayPriceDto = {
    currency: string;
    active: boolean;
    product: string;
    recurring: {
        interval: GatewayRecurringInterval;
    };
    unit_amount: number;
    metadata?: Record<string, string>; //price id
};
