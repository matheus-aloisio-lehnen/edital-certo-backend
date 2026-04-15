import { PriceKey } from "@domain/product/constant/price-key.constant";

export type CreateGatewayPriceDto = {
    currency: string;
    active: boolean;
    product: string;
    recurring: {
        interval: string;
    };
    unit_amount: number;
    lookup_key: PriceKey;
    metadata?: Record<string, string>; //price id
};
