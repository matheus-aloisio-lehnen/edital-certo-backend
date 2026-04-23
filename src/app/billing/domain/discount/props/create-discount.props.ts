import { DiscountDuration, DiscountType } from "@billing/domain/discount/constant/discount.constant";

export type CreateDiscountProps = {
    priceId?: number;
    name: string;
    value: number;
    type: DiscountType;
    duration: DiscountDuration;
    count?: number;
    campaignStartsAt: Date;
    campaignEndsAt: Date;
    externalDiscountId?: string | null;
};
