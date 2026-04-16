import { QuotaRenewalCycle } from "@product/constant/quota-renewal-cycle.constant";
import { FeatureKey } from "@product/constant/feature-key.constant";

export type CreateFeatureProps = {
    name: string;
    key: FeatureKey;
    planId?: number;
    quotaRenewalCycle: QuotaRenewalCycle;
    hidden?: boolean;
    isActive?: boolean;
    hasQuota?: boolean;
    quota?: number;
};