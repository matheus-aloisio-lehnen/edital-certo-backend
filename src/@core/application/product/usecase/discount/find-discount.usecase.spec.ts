import { describe, expect, it, vi, beforeEach } from 'vitest';
import { FindDiscountUsecase } from './find-discount.usecase';
import { IDiscountRepository } from '@domain/product/port/discount.port';
import { IMetrics } from '@domain/@shared/port/metrics.port';
import { createMetricsMock } from '@mock/tests.mock';
import { MockDiscount } from '@mock/in-memory.mock';
import { DiscountFactory } from '@domain/product/factory/discount.factory';

describe('FindDiscountUseCase', () => {
    let usecase: FindDiscountUsecase;
    let discountRepository: IDiscountRepository;
    let metrics: IMetrics;

    beforeEach(() => {
        discountRepository = {
            findAll: vi.fn(),
            findAllByPriceId: vi.fn(),
            findById: vi.fn(),
        } as any;
        metrics = createMetricsMock();
        usecase = new FindDiscountUsecase(discountRepository, metrics);
    });

    const discount = DiscountFactory.rehydrate(MockDiscount);

    describe('findAll', () => {
        it('should return a page of discounts', async () => {
            const page = { list: [discount], total: 1 };
            (discountRepository.findAll as any).mockResolvedValue(page);

            const result = await usecase.findAll({ offset: 1, limit: 10 });

            expect(result).toBe(page);
            expect(metrics.increment).toHaveBeenCalledWith('discount.model.ts.queried.all', expect.any(Object));
        });
    });

    describe('findAllByPriceId', () => {
        it('should return a page of discounts for a priceId', async () => {
            const page = { list: [discount], total: 1 };
            (discountRepository.findAllByPriceId as any).mockResolvedValue(page);

            const result = await usecase.findAllByPriceId(1, { offset: 1, limit: 10 });

            expect(result).toBe(page);
            expect(metrics.increment).toHaveBeenCalledWith('discount.model.ts.queried.all-by-price-id', expect.any(Object));
        });
    });

    describe('findById', () => {
        it('should return a discount by id', async () => {
            (discountRepository.findById as any).mockResolvedValue(discount);

            const result = await usecase.findById(1);

            expect(result).toBe(discount);
            expect(metrics.increment).toHaveBeenCalledWith('discount.model.ts.queried.by-id', { found: 'true' });
        });
    });
});
