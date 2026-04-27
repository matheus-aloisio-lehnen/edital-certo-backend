import { BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { CreateDiscountProps } from "@billing/domain/discount/props/create-discount.props";

export type CreatePriceProps = {
    productId?: number;
    billingCycle: BillingCycle;
    value: number;
    discount?: CreateDiscountProps;
    externalPriceId?: string;
};
