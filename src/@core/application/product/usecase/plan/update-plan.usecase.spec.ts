import { describe, expect, it, vi, beforeEach } from 'vitest';
import { IPlanRepository } from '@domain/product/port/plan.port';
import { IProductGatewayService } from '@domain/product/port/product-payment-gateway.port';
import { createTransactionManagerMock } from '@mock/tests.mock';
import { MockPlan } from '@mock/in-memory.mock';
import { PlanFactory } from '@domain/product/factory/plan.factory';
import { AppException } from '@domain/@shared/exception/app.exception';
import { UpdatePlanUsecase } from "@application/product/usecase/plan/update-plan.usecase";

describe('UpdatePlanUsecase', () => {
    let usecase: UpdatePlanUsecase;
    let planRepository: IPlanRepository;
    let transactionManager: any;
    let productGatewayService: IProductGatewayService;

    beforeEach(() => {
        planRepository = {
            findById: vi.fn(),
            save: vi.fn((plan) => Promise.resolve(plan)),
        } as any;
        transactionManager = createTransactionManagerMock();
        productGatewayService = {
            deactivatePlan: vi.fn(),
            deactivatePrice: vi.fn(),
            deleteDiscount: vi.fn(),
        } as any;

        usecase = new UpdatePlanUsecase(
            planRepository,
            transactionManager,
            productGatewayService
        );
    });

    it('should deactivate a plan and its prices', async () => {
        const plan = PlanFactory.rehydrate({ ...MockPlan, externalPlanId: 'ext-plan-123' });
        (planRepository.findById as any).mockResolvedValue(plan);

        const result = await usecase.deactivate(1);

        expect(result.isActive).toBe(false);
        expect(productGatewayService.deactivatePlan).toHaveBeenCalledWith(plan);
        expect(planRepository.save).toHaveBeenCalledWith(plan);
    });

    it('should throw if plan not found', async () => {
        (planRepository.findById as any).mockResolvedValue(null);
        await expect(usecase.deactivate(1)).rejects.toThrow(AppException);
    });

    it('should throw if externalPlanId is missing', async () => {
        const planData = { ...MockPlan, externalProductId: undefined };
        const plan = PlanFactory.rehydrate(planData);
        (planRepository.findById as any).mockResolvedValue(plan);
        await expect(usecase.deactivate(1)).rejects.toThrow(AppException);
    });
});
