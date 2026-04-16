import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { planKey } from "@product/constant/plan-key.constant";
import { priceKey } from "@product/constant/price-key.constant";
import { featureKey } from "@product/constant/feature-key.constant";
import { describe, it, expect, beforeEach } from "vitest";
import { ProductValidatorService } from "./product-validator.service";

describe("ProductValidatorService", () => {
    let service: ProductValidatorService;

    beforeEach(() => {
        service = new ProductValidatorService();
    });

    it("validatePlanKeys should not throw error when all plan keys are unique", () => {
        const keys = [planKey.free, planKey.start, planKey.pro];
        expect(() => service.validatePlanKeys(keys)).not.toThrow();
    });

    it("validatePlanKeys should throw AppException when there are duplicated plan keys", () => {
        const keys = [planKey.free, planKey.start, planKey.free];
        expect(() => service.validatePlanKeys(keys)).toThrow(AppException);
        try {
            service.validatePlanKeys(keys);
        } catch (error: any) {
            expect(error.code).toBe(code.planDuplicatedKeyError);
            expect(error.statusCode).toBe(400);
        }
    });

    it("validatePriceKeys should not throw error when all price keys are unique", () => {
        const keys = [priceKey.startMonthlyBrl, priceKey.startYearlyBrl];
        expect(() => service.validatePriceKeys(keys)).not.toThrow();
    });

    it("validatePriceKeys should throw AppException when there are duplicated price keys", () => {
        const keys = [priceKey.startMonthlyBrl, priceKey.startMonthlyBrl];
        expect(() => service.validatePriceKeys(keys)).toThrow(AppException);
        try {
            service.validatePriceKeys(keys);
        } catch (error: any) {
            expect(error.code).toBe(code.priceDuplicatedKeyError);
            expect(error.statusCode).toBe(400);
        }
    });

    it("validateDiscountKeys should not throw error when all discount keys are unique", () => {
        const keys = ["DISCOUNT_1", "DISCOUNT_2"];
        expect(() => service.validateDiscountKeys(keys)).not.toThrow();
    });

    it("validateDiscountKeys should throw AppException when there are duplicated discount keys", () => {
        const keys = ["DISCOUNT_1", "DISCOUNT_1"];
        expect(() => service.validateDiscountKeys(keys)).toThrow(AppException);
        try {
            service.validateDiscountKeys(keys);
        } catch (error: any) {
            expect(error.code).toBe(code.discountDuplicatedKeyError);
            expect(error.statusCode).toBe(400);
        }
    });

    it("validateFeaturesKeys should not throw error when all feature keys are unique", () => {
        const keys = [featureKey.aiHelp, featureKey.calendar];
        expect(() => service.validateFeaturesKeys(keys)).not.toThrow();
    });

    it("validateFeaturesKeys should throw AppException when there are duplicated feature keys", () => {
        const keys = [featureKey.aiHelp, featureKey.aiHelp];
        expect(() => service.validateFeaturesKeys(keys)).toThrow(AppException);
        try {
            service.validateFeaturesKeys(keys);
        } catch (error: any) {
            expect(error.code).toBe(code.featureDuplicatedKeyError);
            expect(error.statusCode).toBe(400);
        }
    });
});
