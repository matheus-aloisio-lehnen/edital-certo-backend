import { PlanKey } from "@domain/product/constant/plan-key.constant";
import { CreateFeatureProps } from "@domain/product/props/create-feature.props";
import { CreatePriceProps } from "@domain/product/props/create-price.props";

export type CreatePlanProps = {
    name: string;
    key: PlanKey;
    externalProductId?: string | null;
    features: CreateFeatureProps[];
    prices: CreatePriceProps[];
};
