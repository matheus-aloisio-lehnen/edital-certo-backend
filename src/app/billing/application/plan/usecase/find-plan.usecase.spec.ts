import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createMetricsMock } from "@mock/tests.mock";
import { FindPlanUsecase } from "@billing/application/plan/usecase/find-plan.usecase";
import { PlanFactory } from "@billing/domain/plan/factory/plan.factory";
import { MockPlan } from "@mock/in-memory.mock";
import { IPlanRepository } from "@billing/domain/plan/port/plan.port";
import { IMetrics } from "@shared/domain/port/metrics.port";
import { sortOrder } from "@shared/domain/type/page.type";

describe('FindPlanUsecase', () => {
    let usecase: FindPlanUsecase;
    let planRepository: IPlanRepository;
    let metrics: IMetrics;

    beforeEach(() => {
        planRepository = {
            findAll: vi.fn(),
            findById: vi.fn(),
            findAllActive: vi.fn(),
        } as any;
        metrics = createMetricsMock();
        usecase = new FindPlanUsecase(planRepository, metrics);
    });

    const plan = PlanFactory.rehydrate(MockPlan);

    describe('findAll', () => {
        it('should return a page of plans', async () => {
            const page = { list: [plan], total: 1 };
            (planRepository.findAll as any).mockResolvedValue(page);

            const result = await usecase.findAll({ offset: 1, limit: 10, orderBy: 'id', sortOrder: sortOrder.desc });

            expect(result).toBe(page);
            expect(metrics.increment).toHaveBeenCalledWith('plan.queried.all', expect.any(Object));
        });
    });

    describe('findById', () => {
        it('should return a plan by id', async () => {
            (planRepository.findById as any).mockResolvedValue(plan);

            const result = await usecase.findById(1);

            expect(result).toBe(plan);
            expect(metrics.increment).toHaveBeenCalledWith('plan.queried.by-id', { found: 'true' });
        });
    });
});
