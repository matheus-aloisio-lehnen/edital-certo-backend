import { describe, it, expect } from 'vitest';
import { AppException } from '@shared/domain/exception/app.exception';
import { code } from '@shared/domain/constant/code.constant';
import { MockCreatePlans } from '@mock/in-memory.mock';
import { Plan } from "@billing/domain/plan/entity/plan.entity";

describe('Plan', () => {
    const validPlanProps = MockCreatePlans[1];

    it('constructor should create a plan successfully', () => {
        const plan = new Plan(validPlanProps);

        expect(plan.name).toBe(validPlanProps.name);
        expect(plan.isActive).toBe(true);
        expect(plan.prices).toHaveLength(validPlanProps.prices.length);
    });

    it('validate should throw error if name is empty', () => {
        expect(() => new Plan({ ...validPlanProps, name: '' })).toThrow();
    });

    it('validate should throw error if prices are empty', () => {
        expect(() => new Plan({ ...validPlanProps, prices: [] })).toThrow(
            new AppException(code.planPricesEmptyError, 400)
        );
    });

    it('deactivate should deactivate plan', () => {
        const plan = new Plan(validPlanProps);
        plan.deactivate();
        expect(plan.isActive).toBe(false);
    });

    it('linkExternalPlanId should link external plan id', () => {
        const plan = new Plan(validPlanProps);
        plan.linkExternalPlanId('ext_plan_123');
        expect(plan.externalPlanId).toBe('ext_plan_123');
    });

    it('id getter should throw error if id is not set', () => {
        const plan = new Plan(validPlanProps);
        expect(() => plan.id).toThrow(new AppException(code.planIdEmptyError, 400));
    });
});
