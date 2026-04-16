import { describe, expect, it, vi, beforeEach } from 'vitest';
import { FindPlanUsecase } from './find-plan.usecase';
import { IPlanRepository } from '@domain/product/port/plan.port';
import { IMetrics } from '@domain/@shared/port/metrics.port';
import { createMetricsMock } from '@mock/tests.mock';
import { MockPlan } from '@mock/in-memory.mock';
import { PlanFactory } from '@domain/product/factory/plan.factory';
import { planKey } from '@domain/product/constant/plan-key.constant';

import { PageParams, sortOrder } from '@domain/@shared/type/page.type';

describe('FindPlanUsecase', () => {
    let usecase: FindPlanUsecase;
    let planRepository: IPlanRepository;
    let metrics: IMetrics;

    beforeEach(() => {
        planRepository = {
            findAll: vi.fn(),
            findById: vi.fn(),
            findByKey: vi.fn(),
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

    describe('findByKey', () => {
        it('should return a plan by key', async () => {
            (planRepository.findByKey as any).mockResolvedValue(plan);

            const result = await usecase.findByKey(planKey.free);

            expect(result).toBe(plan);
            expect(metrics.increment).toHaveBeenCalledWith('plan.queried.by-key', expect.objectContaining({ found: 'true' }));
        });
    });

});
