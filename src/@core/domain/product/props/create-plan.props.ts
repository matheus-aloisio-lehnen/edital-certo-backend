import { PlanKey } from "@product/constant/plan-key.constant";
import { CreateFeatureProps } from "@product/props/create-feature.props";
import { CreatePriceProps } from "@product/props/create-price.props";

export type CreatePlanProps = {
    name: string;
    key: PlanKey;
    externalProductId?: string | null;
    features: CreateFeatureProps[];
    prices: CreatePriceProps[];
};
