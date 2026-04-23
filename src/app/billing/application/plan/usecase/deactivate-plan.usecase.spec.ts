import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { DeactivatePlanUsecase } from "@billing/application/plan/usecase/deactivate-plan.usecase";
import { IPlanRepository } from "@billing/domain/plan/port/plan.port";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { createBillingGatewayServiceMock, createPlanRepositoryMock, createTransactionManagerMock } from "@mock/tests.mock";
import { PlanFactory } from "@billing/domain/plan/factory/plan.factory";
import { MockPlan } from "@mock/in-memory.mock";
import { AppException } from "@shared/domain/exception/app.exception";

describe('UpdatePlanUsecase', () => {
    let usecase: DeactivatePlanUsecase;
    let planRepository: IPlanRepository;
    let transactionManager: ITransactionManager;
    let billingGatewayService: IBillingGatewayService;

    beforeEach(() => {
        planRepository = createPlanRepositoryMock();
        transactionManager = createTransactionManagerMock();
        billingGatewayService = createBillingGatewayServiceMock();

        usecase = new DeactivatePlanUsecase(
            planRepository,
            transactionManager,
            billingGatewayService
        );
    });

    it('deactivate should deactivate a plan and its prices', async () => {
        const plan = PlanFactory.rehydrate({ ...MockPlan, externalPlanId: 'ext-plan-123' });
        (planRepository.findById as Mock).mockResolvedValue(plan);

        const result = await usecase.execute(1);

        expect(result.isActive).toBe(false);
        expect(billingGatewayService.deactivatePlan).toHaveBeenCalledWith(plan);
        expect(planRepository.save).toHaveBeenCalledWith(plan);
    });

    it('deactivate should throw if plan not found', async () => {
        (planRepository.findById as Mock).mockResolvedValue(null);
        await expect(usecase.execute(1)).rejects.toThrow(AppException);
    });

    it('deactivate should throw if externalPlanId is missing', async () => {
        const planData = { ...MockPlan, externalPlanId: null };
        const plan = PlanFactory.rehydrate(planData);
        (planRepository.findById as Mock).mockResolvedValue(plan);
        await expect(usecase.execute(1)).rejects.toThrow(AppException);
    });
});
