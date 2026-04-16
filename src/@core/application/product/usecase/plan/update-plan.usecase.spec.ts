import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { IPlanRepository } from '@product/port/plan.port';
import { IProductGatewayService } from '@product/port/product-payment-gateway.port';
import {
    createTransactionManagerMock,
    createPlanRepositoryMock,
    createProductGatewayServiceMock,
} from '@mock/tests.mock';
import { MockPlan } from '@mock/in-memory.mock';
import { PlanFactory } from '@product/factory/plan.factory';
import { AppException } from '@domain/@shared/exception/app.exception';
import { UpdatePlanUsecase } from "./update-plan.usecase";
import { ITransactionManager } from '@domain/@shared/port/transaction.port';

describe('UpdatePlanUsecase', () => {
    let usecase: UpdatePlanUsecase;
    let planRepository: IPlanRepository;
    let transactionManager: ITransactionManager;
    let productGatewayService: IProductGatewayService;

    beforeEach(() => {
        planRepository = createPlanRepositoryMock();
        transactionManager = createTransactionManagerMock();
        productGatewayService = createProductGatewayServiceMock();

        usecase = new UpdatePlanUsecase(
            planRepository,
            transactionManager,
            productGatewayService
        );
    });

    it('deactivate should deactivate a plan and its prices', async () => {
        const plan = PlanFactory.rehydrate({ ...MockPlan, externalPlanId: 'ext-plan-123' });
        (planRepository.findById as Mock).mockResolvedValue(plan);

        const result = await usecase.deactivate(1);

        expect(result.isActive).toBe(false);
        expect(productGatewayService.deactivatePlan).toHaveBeenCalledWith(plan);
        expect(planRepository.save).toHaveBeenCalledWith(plan);
    });

    it('deactivate should throw if plan not found', async () => {
        (planRepository.findById as Mock).mockResolvedValue(null);
        await expect(usecase.deactivate(1)).rejects.toThrow(AppException);
    });

    it('deactivate should throw if externalPlanId is missing', async () => {
        const planData = { ...MockPlan, externalPlanId: null };
        const plan = PlanFactory.rehydrate(planData);
        (planRepository.findById as Mock).mockResolvedValue(plan);
        await expect(usecase.deactivate(1)).rejects.toThrow(AppException);
    });
});
