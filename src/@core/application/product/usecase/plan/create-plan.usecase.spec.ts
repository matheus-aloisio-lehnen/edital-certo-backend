import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreatePlanUsecase } from './create-plan.usecase';
import { IPlanRepository } from '@domain/product/port/plan.port';
import { IProductGatewayService } from '@domain/product/port/product-payment-gateway.port';
import { IProductValidatorService } from '@domain/product/port/product-validator.port';
import { createTransactionManagerMock } from '@mock/tests.mock';
import { MockCreatePlans, MockPlan } from '@mock/in-memory.mock';
import { PlanFactory } from '@domain/product/factory/plan.factory';
import { Plan } from '@domain/product/entity/plan.entity';

describe('CreatePlanUsecase', () => {
    let usecase: CreatePlanUsecase;
    let planRepository: IPlanRepository;
    let transactionManager: any;
    let productGatewayService: IProductGatewayService;
    let productValidatorService: IProductValidatorService;

    beforeEach(() => {
        planRepository = {
            findByKey: vi.fn(),
            findAllByKey: vi.fn(),
            save: vi.fn((plan) => Promise.resolve(plan)),
            saveBulk: vi.fn((plans) => Promise.resolve(plans)),
        } as any;
        transactionManager = createTransactionManagerMock();
        productGatewayService = {
            syncPlan: vi.fn(),
            deactivatePrice: vi.fn(),
            deleteDiscount: vi.fn(),
        } as any;
        productValidatorService = {
            validatePlanKeys: vi.fn(),
            validatePriceKeys: vi.fn(),
            validateDiscountKeys: vi.fn(),
        } as any;

        usecase = new CreatePlanUsecase(
            planRepository,
            transactionManager,
            productGatewayService,
            productValidatorService
        );
    });

    describe('create', () => {
        it('should create and sync a new plan', async () => {
            const input = MockCreatePlans[0];
            (planRepository.findByKey as any).mockResolvedValue(null);

            const result = await usecase.create(input);

            expect(result).toBeInstanceOf(Plan);
            expect(productValidatorService.validatePlanKeys).toHaveBeenCalled();
            expect(productGatewayService.syncPlan).toHaveBeenCalled();
            expect(planRepository.save).toHaveBeenCalled();
        });

        it('should deactivate existing plan before creating a new one with same key', async () => {
            const input = MockCreatePlans[0];
            const existingPlan = PlanFactory.rehydrate(MockPlan);
            (planRepository.findByKey as any).mockResolvedValue(existingPlan);

            await usecase.create(input);

            expect(existingPlan.isActive).toBe(false);
            expect(planRepository.save).toHaveBeenCalled();
        });
    });

    describe('createBulk', () => {
        it('should create multiple plans', async () => {
            const inputList = [MockCreatePlans[0]];
            (planRepository.findAllByKey as any).mockResolvedValue([]);

            const result = await usecase.createBulk(inputList);

            expect(result).toHaveLength(1);
            expect(planRepository.saveBulk).toHaveBeenCalled();
        });
    });
});
