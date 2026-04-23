// discount.model.ts response from stripe
import { Currency } from "@shared/domain/type/language.type";

export type GatewayCoupon = {
    id: string;
    percent_off: number | null;
    amount_off: number | null;
    currency: Currency;
};