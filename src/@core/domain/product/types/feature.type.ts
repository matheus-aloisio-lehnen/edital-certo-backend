import { FeatureKey } from "@domain/product/constants/feature-keys.constant";
import { ResetWindow } from "@domain/product/constants/reset-window.constant";

export type CreateFeatureInput = {
    name: string;
    key: FeatureKey;
    resetWindow: ResetWindow;
    hidden?: boolean;
    isActive?: boolean;
    hasQuota?: boolean;
    quota?: number;
};