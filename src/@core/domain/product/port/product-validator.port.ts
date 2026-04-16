import { PlanKey } from "@product/constant/plan-key.constant";
import { PriceKey } from "@product/constant/price-key.constant";
import { FeatureKey } from "@product/constant/feature-key.constant";

export const productValidatorServicePort = Symbol('productValidatorServicePort');

export interface IProductValidatorService {
    validatePlanKeys(keys: PlanKey[]): void
    validatePriceKeys(keys: PriceKey[]): void
    validateDiscountKeys(keys: string[]): void
    validateFeaturesKeys(keys: FeatureKey[]): void
}