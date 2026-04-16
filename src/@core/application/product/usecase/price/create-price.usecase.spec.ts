import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { CreatePriceUsecase } from '@application/product/usecase/price/create-price.usecase';
import { IPriceRepository } from '@product/port/price.port';
import { IPlanRepository } from '@product/port/plan.port';
import { IProductGatewayService } from '@product/port/product-payment-gateway.port';
import { IProductValidatorService } from '@product/port/product-validator.port';
import {
    createTransactionManagerMock,
    createPlanRepositoryMock,
    createPriceRepositoryMock,
    createProductGatewayServiceMock,
    createProductValidatorServiceMock,
} from '@mock/tests.mock';
import { MockPriceInput, MockPlan } from '@mock/in-memory.mock';
import { PlanFactory } from '@product/factory/plan.factory';
import { AppException } from '@domain/@shared/exception/app.exception';
import { Price } from '@product/entity/price.entity';
import { ITransactionManager } from '@domain/@shared/port/transaction.port';

describe('CreatePriceUsecase', () => {
    let usecase: CreatePriceUsecase;
    let priceRepository: IPriceRepository;
    let planRepository: IPlanRepository;
    let transactionManager: ITransactionManager;
    let productGatewayService: IProductGatewayService;
    let productValidatorService: IProductValidatorService;

    beforeEach(() => {
        priceRepository = createPriceRepositoryMock();
        planRepository = createPlanRepositoryMock();
        transactionManager = createTransactionManagerMock();
        productGatewayService = createProductGatewayServiceMock();
        productValidatorService = createProductValidatorServiceMock();

        usecase = new CreatePriceUsecase(
            priceRepository,
            planRepository,
            transactionManager,
            productGatewayService,
            productValidatorService
        );
    });

    const plan = PlanFactory.rehydrate({ ...MockPlan, externalPlanId: 'ext-123' });

    it('create should create and sync a new price', async () => {
        const input = { ...MockPriceInput, planId: 1 };
        (planRepository.findById as Mock).mockResolvedValue(plan);
        (priceRepository.findByPlanIdAndKey as Mock).mockResolvedValue(null);
        (priceRepository.save as Mock).mockImplementation((p) => {
            Object.assign(p, { _id: 1 });
            if (p.discount) Object.assign(p.discount, { _id: 1, _priceId: 1 });
            return p;
        });

        const result = await usecase.create(input);

        expect(result).toBeInstanceOf(Price);
        expect(productGatewayService.syncPrice).toHaveBeenCalled();
        expect(priceRepository.save).toHaveBeenCalled();
    });

    it('create should throw if plan not found', async () => {
        const input = { ...MockPriceInput, planId: 999 };
        (planRepository.findById as Mock).mockResolvedValue(null);
        await expect(usecase.create(input)).rejects.toThrow(AppException);
    });

    it('create should throw if plan has no externalPlanId', async () => {
        const planData = { ...MockPlan, externalPlanId: null };
        const planWithoutExt = PlanFactory.rehydrate(planData);
        const input = { ...MockPriceInput, planId: 1 };
        (planRepository.findById as Mock).mockResolvedValue(planWithoutExt);
        await expect(usecase.create(input)).rejects.toThrow(AppException);
    });

    it('createBulk should create multiple prices', async () => {
        const inputList = [{ ...MockPriceInput, planId: 1 }];
        (planRepository.findById as Mock).mockResolvedValue(plan);
        (priceRepository.findByPlanIdAndKey as Mock).mockResolvedValue(null);
        (priceRepository.saveBulk as Mock).mockImplementation((prices) => {
            return prices.map((p: any, index: number) => {
                Object.assign(p, { _id: index + 1 });
                if (p.discount) Object.assign(p.discount, { _id: index + 1, _priceId: index + 1 });
                return p;
            });
        });

        const result = await usecase.createBulk(inputList);

        expect(result).toHaveLength(1);
        expect(priceRepository.saveBulk).toHaveBeenCalled();
    });
});
