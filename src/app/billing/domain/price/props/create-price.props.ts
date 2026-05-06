import { BillingCycle } from "@billing/domain/price/constant/billing-cycle.constant";
import { BillingType } from "@billing/domain/price/constant/billing-type.constant";
import { CreateDiscountProps } from "@billing/domain/discount/props/create-discount.props";

export type CreatePriceProps = {
    productId?: number;
    cycle: BillingCycle;
    type: BillingType;
    value: number;
    version?: number;
    externalPriceId?: string | null;
    discount?: CreateDiscountProps;
};
