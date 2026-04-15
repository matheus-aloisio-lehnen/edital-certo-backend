import { QuotaRenewalCycle } from "@domain/product/constant/quota-renewal-cycle.constant";
import { FeatureKey } from "@domain/product/constant/feature-key.constant";

export type CreateFeatureProps = {
    name: string;
    key: FeatureKey;
    planId?: number;
    order: number;
    quotaRenewalCycle: QuotaRenewalCycle;
    hidden?: boolean;
    isActive?: boolean;
    hasQuota?: boolean;
    quota?: number;
};