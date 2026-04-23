import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreatePlanUsecase } from "@billing/application/plan/usecase/create-plan.usecase";
import { IPlanRepository } from "@billing/domain/plan/port/plan.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { createTransactionManagerMock } from "@mock/tests.mock";
import { MockCreatePlans } from "@mock/in-memory.mock";
import { Plan } from "@billing/domain/plan/entity/plan.entity";

describe('CreatePlanUsecase', () => {
    let usecase: CreatePlanUsecase;
    let planRepository: IPlanRepository;
    let transactionManager: any;
    let billingGatewayService: IBillingGatewayService;

    beforeEach(() => {
        planRepository = {
            save: vi.fn((plan) => Promise.resolve(plan)),
            saveBulk: vi.fn((plans) => Promise.resolve(plans)),
        } as any;
        transactionManager = createTransactionManagerMock();
        billingGatewayService = {
            syncPlan: vi.fn(),
            deactivatePrice: vi.fn(),
            deleteDiscount: vi.fn(),
        } as any;

        usecase = new CreatePlanUsecase(
            planRepository,
            transactionManager,
            billingGatewayService,
        );
    });

    describe('create', () => {
        it('should create and sync a new plan', async () => {
            const input = MockCreatePlans[0];

            const result = await usecase.execute(input);

            expect(result).toBeInstanceOf(Plan);
            expect(billingGatewayService.syncPlan).toHaveBeenCalled();
            expect(planRepository.save).toHaveBeenCalled();
        });
    });

});
