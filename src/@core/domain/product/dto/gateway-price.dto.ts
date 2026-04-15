import { Currency } from "@domain/@shared/type/language.type";

export type GatewayPrice = {
    id: string;
    active: boolean;
    currency: Currency;
    product: string;        // product id
    unit_amount: number;    // em centavos
    lookup_key: string;
    recurring: {
        interval: "month" | "year"
    };
};