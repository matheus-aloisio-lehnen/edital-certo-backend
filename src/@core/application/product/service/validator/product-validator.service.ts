import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { PlanKey } from "@product/constant/plan-key.constant";
import { PriceKey } from "@product/constant/price-key.constant";
import { FeatureKey } from "@product/constant/feature-key.constant";
import { IProductValidatorService } from "@product/port/product-validator.port";

export class ProductValidatorService implements IProductValidatorService {

    validatePlanKeys(keys: PlanKey[]): void {
        const seen = new Set<PlanKey>();

        for (const key of keys) {
            if (seen.has(key))
                throw new AppException(code.planDuplicatedKeyError, 400, `Duplicated plan key: ${key}`);
            seen.add(key);
        }
    }

    validatePriceKeys(keys: PriceKey[]): void {
        const seen = new Set<PriceKey>();

        for (const key of keys) {
            if (seen.has(key))
                throw new AppException(code.priceDuplicatedKeyError, 400, `Duplicated price key: ${key}`);
            seen.add(key);
        }
    }

    validateDiscountKeys(keys: string[]): void {
        const seen = new Set<string>();

        for (const key of keys) {
            if (seen.has(key))
                throw new AppException(code.discountDuplicatedKeyError, 400, `Duplicated discount key: ${key}`);
            seen.add(key);
        }
    }

    validateFeaturesKeys(keys: FeatureKey[]): void {
        const seen = new Set<FeatureKey>();

        for (const key of keys) {
            if (seen.has(key))
                throw new AppException(code.featureDuplicatedKeyError, 400, `Duplicated feature key: ${key}`);
            seen.add(key);
        }
    }

}