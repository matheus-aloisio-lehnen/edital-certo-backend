import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreatePriceUsecase } from '@application/product/usecase/price/create-price.usecase';
import { IPriceRepository } from '@domain/product/port/price.port';
import { IPlanRepository } from '@domain/product/port/plan.port';
import { IProductGatewayService } from '@domain/product/port/product-payment-gateway.port';
import { IProductValidatorService } from '@domain/product/port/product-validator.port';
import { createTransactionManagerMock } from '@mock/tests.mock';
import { MockPriceInput, MockPlan } from '@mock/in-memory.mock';
import { PlanFactory } from '@domain/product/factory/plan.factory';
import { AppException } from '@domain/@shared/exception/app.exception';
import { Price } from '@domain/product/entity/price.entity';

describe('CreatePriceUsecase', () => {
    let usecase: CreatePriceUsecase;
    let priceRepository: IPriceRepository;
    let planRepository: IPlanRepository;
    let transactionManager: any;
    let productGatewayService: IProductGatewayService;
    let productValidatorService: IProductValidatorService;

    beforeEach(() => {
        priceRepository = {
            findById: vi.fn(),
            findByPlanIdAndKey: vi.fn(),
            save: vi.fn((price) => Promise.resolve(price)),
            saveBulk: vi.fn((prices) => Promise.resolve(prices)),
        } as any;
        planRepository = {
            findById: vi.fn(),
        } as any;
        transactionManager = createTransactionManagerMock();
        productGatewayService = {
            syncPrice: vi.fn(),
            syncDiscount: vi.fn(),
        } as any;
        productValidatorService = {
            validatePriceKeys: vi.fn(),
            validateDiscountKeys: vi.fn(),
        } as any;

        usecase = new CreatePriceUsecase(
            priceRepository,
            planRepository,
            transactionManager,
            productGatewayService,
            productValidatorService
        );
    });

    const plan = PlanFactory.rehydrate({ ...MockPlan, externalPlanId: 'ext-123' });

    describe('create', () => {
        it('should create and sync a new price', async () => {
            const input = { ...MockPriceInput, planId: 1 };
            (planRepository.findById as any).mockResolvedValue(plan);
            (priceRepository.findByPlanIdAndKey as any).mockResolvedValue(null);

            const result = await usecase.create(input);

            expect(result).toBeInstanceOf(Price);
            expect(productGatewayService.syncPrice).toHaveBeenCalled();
            expect(priceRepository.save).toHaveBeenCalled();
        });

        it('should throw if plan not found', async () => {
            const input = { ...MockPriceInput, planId: 999 };
            (planRepository.findById as any).mockResolvedValue(null);
            await expect(usecase.create(input)).rejects.toThrow(AppException);
        });

        it('should throw if plan has no externalPlanId', async () => {
            const planData = { ...MockPlan, externalPlanId: undefined };
            const planWithoutExt = PlanFactory.rehydrate(planData);
            const input = { ...MockPriceInput, planId: 1 };
            (planRepository.findById as any).mockResolvedValue(planWithoutExt);
            await expect(usecase.create(input)).rejects.toThrow(AppException);
        });
    });

    describe('createBulk', () => {
        it('should create multiple prices', async () => {
            const inputList = [{ ...MockPriceInput, planId: 1 }];
            (planRepository.findById as any).mockResolvedValue(plan);
            (priceRepository.findByPlanIdAndKey as any).mockResolvedValue(null);

            const result = await usecase.createBulk(inputList);

            expect(result).toHaveLength(1);
            expect(priceRepository.saveBulk).toHaveBeenCalled();
        });
    });
});
