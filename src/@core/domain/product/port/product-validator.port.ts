import { PlanKey } from "@domain/product/constant/plan-key.constant";
import { PriceKey } from "@domain/product/constant/price-key.constant";
import { FeatureKey } from "@domain/product/constant/feature-key.constant";

export interface IProductValidatorService {
    validatePlanKeys(keys: PlanKey[]): void
    validatePriceKeys(keys: PriceKey[]): void
    validateDiscountKeys(keys: string[]): void
    validateFeaturesKeys(keys: FeatureKey[]): void
}