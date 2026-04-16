import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { FindDiscountUsecase } from './find-discount.usecase';
import { IDiscountRepository } from '@product/port/discount.port';
import { IMetrics } from '@domain/@shared/port/metrics.port';
import { createMetricsMock, createDiscountRepositoryMock } from '@mock/tests.mock';
import { MockDiscount } from '@mock/in-memory.mock';
import { DiscountFactory } from '@product/factory/discount.factory';

import { PageParams, sortOrder } from '@domain/@shared/type/page.type';

describe('FindDiscountUseCase', () => {
    let usecase: FindDiscountUsecase;
    let discountRepository: IDiscountRepository;
    let metrics: IMetrics;

    beforeEach(() => {
        discountRepository = createDiscountRepositoryMock();
        metrics = createMetricsMock();
        usecase = new FindDiscountUsecase(discountRepository, metrics);
    });

    const discount = DiscountFactory.rehydrate(MockDiscount);

    it('findAll should return a page of discounts', async () => {
        const page = { list: [discount], count: 1, offset: 1, limit: 10 };
        (discountRepository.findAll as Mock).mockResolvedValue(page);

        const result = await usecase.findAll({ offset: 1, limit: 10, orderBy: 'id', sortOrder: sortOrder.desc });

        expect(result).toBe(page);
        expect(metrics.increment).toHaveBeenCalledWith('discount.model.ts.queried.all', expect.any(Object));
    });

    it('findAllByPriceId should return a page of discounts for a priceId', async () => {
        const page = { list: [discount], count: 1, offset: 1, limit: 10 };
        (discountRepository.findAllByPriceId as Mock).mockResolvedValue(page);

        const result = await usecase.findAllByPriceId(1, { offset: 1, limit: 10, orderBy: 'id', sortOrder: sortOrder.desc });

        expect(result).toBe(page);
        expect(metrics.increment).toHaveBeenCalledWith('discount.model.ts.queried.all-by-price-id', expect.any(Object));
    });

    it('findById should return a discount by id', async () => {
        (discountRepository.findById as Mock).mockResolvedValue(discount);

        const result = await usecase.findById(1);

        expect(result).toBe(discount);
        expect(metrics.increment).toHaveBeenCalledWith('discount.model.ts.queried.by-id', { found: 'true' });
    });
});
