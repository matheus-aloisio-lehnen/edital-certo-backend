import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { AppException } from "@shared/domain/exception/app.exception";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { IPlanRepository } from "@billing/domain/plan/port/plan.port";
import { PlanFactory } from "@billing/domain/plan/factory/plan.factory";
import { Price } from "@billing/domain/price/entity/price.entity";
import { IPriceRepository } from "@billing/domain/price/port/price.port";
import { CreatePriceUsecase } from "@billing/application/price/usecase/create-price.usecase";
import { createBillingGatewayServiceMock, createPlanRepositoryMock, createPriceRepositoryMock, createTransactionManagerMock } from "@mock/tests.mock";
import { MockPlan, MockPriceInput } from "@mock/in-memory.mock";

describe('CreatePriceUsecase', () => {
    let usecase: CreatePriceUsecase;
    let priceRepository: IPriceRepository;
    let planRepository: IPlanRepository;
    let transactionManager: ITransactionManager;
    let billingGatewayService: IBillingGatewayService;

    beforeEach(() => {
        priceRepository = createPriceRepositoryMock();
        planRepository = createPlanRepositoryMock();
        transactionManager = createTransactionManagerMock();
        billingGatewayService = createBillingGatewayServiceMock();

        usecase = new CreatePriceUsecase(
            priceRepository,
            planRepository,
            transactionManager,
            billingGatewayService,
        );
    });

    const plan = PlanFactory.rehydrate({ ...MockPlan, externalPlanId: 'ext-123' });

    it('create should create and sync a new price', async () => {
        const input = { ...MockPriceInput, planId: 1 };
        (planRepository.findById as Mock).mockResolvedValue(plan);
        (priceRepository.findByPlanIdAndBillingCycle as Mock).mockResolvedValue(null);
        (priceRepository.save as Mock).mockImplementation((p) => {
            Object.assign(p, { _id: 1 });
            if (p.discount) Object.assign(p.discount, { _id: 1, _priceId: 1 });
            return p;
        });

        const result = await usecase.execute(input);

        expect(result).toBeInstanceOf(Price);
        expect(billingGatewayService.syncPrice).toHaveBeenCalled();
        expect(priceRepository.save).toHaveBeenCalled();
    });

    it('create should throw if plan not found', async () => {
        const input = { ...MockPriceInput, planId: 999 };
        (planRepository.findById as Mock).mockResolvedValue(null);
        await expect(usecase.execute(input)).rejects.toThrow(AppException);
    });

    it('create should throw if plan has no externalPlanId', async () => {
        const planData = { ...MockPlan, externalPlanId: null };
        const planWithoutExt = PlanFactory.rehydrate(planData);
        const input = { ...MockPriceInput, planId: 1 };
        (planRepository.findById as Mock).mockResolvedValue(planWithoutExt);
        await expect(usecase.execute(input)).rejects.toThrow(AppException);
    });
});
