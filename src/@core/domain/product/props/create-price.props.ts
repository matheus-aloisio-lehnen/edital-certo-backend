import { Currency } from "@domain/@shared/type/language.type";
import { BillingCycle } from "@domain/product/constant/billing-cycle.constant";
import { PriceKey } from "@domain/product/constant/price-key.constant";
import { CreateDiscountProps } from "@domain/product/props/create-discount.props";

export type CreatePriceProps = {
    planId?: number;
    key: PriceKey;
    currency: Currency;
    billingCycle: BillingCycle;
    value: number;
    discount?: CreateDiscountProps;
    externalPriceId?: string;
};