import { describe, it, expect } from 'vitest';
import { AppException } from '@domain/@shared/exception/app.exception';
import { code } from '@domain/@shared/constant/code.constant';
import { MockCreatePlans } from '@mock/in-memory.mock';
import { Plan } from "@domain/product/entity/plan.entity";

describe('Plan Entity', () => {
    const validPlanProps = MockCreatePlans[1]; // Plano Start

    it('should create a plan successfully', () => {
        const plan = new Plan(validPlanProps);

        expect(plan.name).toBe(validPlanProps.name);
        expect(plan.key).toBe(validPlanProps.key);
        expect(plan.isActive).toBe(true);
        expect(plan.features).toHaveLength(validPlanProps.features.length);
        expect(plan.prices).toHaveLength(validPlanProps.prices.length);
    });

    it('should throw error if name is empty', () => {
        expect(() => new Plan({ ...validPlanProps, name: '' })).toThrow();
    });

    it('should throw error if key is empty', () => {
        expect(() => new Plan({ ...validPlanProps, key: '' as any })).toThrow(
            new AppException(code.planKeyEmptyError, 400)
        );
    });

    it('should throw error if features are empty', () => {
        expect(() => new Plan({ ...validPlanProps, features: [] })).toThrow(
            new AppException(code.planFeaturesEmptyError, 400)
        );
    });

    it('should throw error if prices are empty', () => {
        expect(() => new Plan({ ...validPlanProps, prices: [] })).toThrow(
            new AppException(code.planPricesEmptyError, 400)
        );
    });

    it('should deactivate plan', () => {
        const plan = new Plan(validPlanProps);
        plan.deactivate();
        expect(plan.isActive).toBe(false);
    });

    it('should link external plan id', () => {
        const plan = new Plan(validPlanProps);
        plan.linkExternalPlanId('ext_plan_123');
        expect(plan.externalPlanId).toBe('ext_plan_123');
    });

    it('should throw error if id is accessed but not set', () => {
        const plan = new Plan(validPlanProps);
        expect(() => plan.id).toThrow(new AppException(code.planIdEmptyError, 400));
    });
});
