import { DiscountDuration, DiscountType } from "@product/constant/discount.constant";

export type CreateDiscountProps = {
    priceId?: number;
    key: string;
    name: string;
    value: number;
    type: DiscountType;
    duration: DiscountDuration;
    count?: number;
    campaignStartsAt: Date;
    campaignEndsAt: Date;
    externalDiscountId?: string | null;
};