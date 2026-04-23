import { describe, it, expect } from 'vitest';
import { PlanFactory } from "@billing/domain/plan/factory/plan.factory";
import { MockCreateInputPlans, MockPlan } from "@mock/in-memory.mock";
import { Plan } from "@billing/domain/plan/entity/plan.entity";

describe('PlanFactory', () => {
    it('create should create a plan successfully', () => {
        const plan = PlanFactory.create(MockCreateInputPlans[0]);
        expect(plan).toBeInstanceOf(Plan);
        expect(plan.name).toBe(MockCreateInputPlans[0].name);
    });

    it('createBulk should create bulk plans successfully', () => {
        const plans = PlanFactory.createBulk(MockCreateInputPlans);
        expect(plans).toHaveLength(MockCreateInputPlans.length);
        expect(plans[0]).toBeInstanceOf(Plan);
    });

    it('rehydrate should rehydrate a plan successfully', () => {
        const plan = PlanFactory.rehydrate(MockPlan);
        expect(plan).toBeInstanceOf(Plan);
        expect(plan.id).toBe(MockPlan.id);
        expect(plan.name).toBe(MockPlan.name);
        expect(plan.prices).toHaveLength(1);
    });

    it('rehydrateBulk should rehydrate bulk plans successfully', () => {
        const plans = PlanFactory.rehydrateBulk([MockPlan]);
        expect(plans).toHaveLength(1);
        expect(plans[0]).toBeInstanceOf(Plan);
    });
});
