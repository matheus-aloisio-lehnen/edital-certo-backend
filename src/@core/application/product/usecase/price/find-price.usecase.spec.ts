import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { IPriceRepository } from '@product/port/price.port';
import { IMetrics } from '@domain/@shared/port/metrics.port';
import { createMetricsMock, createPriceRepositoryMock } from '@mock/tests.mock';
import { MockPrice } from '@mock/in-memory.mock';
import { PriceFactory } from '@product/factory/price.factory';
import { priceKey } from '@product/constant/price-key.constant';
import { FindPriceUsecase } from "@application/product/usecase/price/find-price.usecase";
import { sortOrder } from '@domain/@shared/type/page.type';

describe('FindPriceUsecase', () => {
    let usecase: FindPriceUsecase;
    let priceRepository: IPriceRepository;
    let metrics: IMetrics;

    beforeEach(() => {
        priceRepository = createPriceRepositoryMock();
        metrics = createMetricsMock();
        usecase = new FindPriceUsecase(priceRepository, metrics);
    });

    const price = PriceFactory.rehydrate(MockPrice);

    it('findAll should return a page of prices', async () => {
        const page = { list: [price], count: 1, offset: 1, limit: 10 };
        (priceRepository.findAll as Mock).mockResolvedValue(page);

        const result = await usecase.findAll({ offset: 1, limit: 10, orderBy: 'id', sortOrder: sortOrder.desc });

        expect(result).toBe(page);
        expect(metrics.increment).toHaveBeenCalledWith('price.queried.all', expect.any(Object));
    });

    it('findById should return a price by id', async () => {
        (priceRepository.findById as Mock).mockResolvedValue(price);

        const result = await usecase.findById(1);

        expect(result).toBe(price);
        expect(metrics.increment).toHaveBeenCalledWith('price.queried.by-id', { found: 'true' });
    });

    it('findByPlanIdAndKey should return a price by planId and key', async () => {
        (priceRepository.findByPlanIdAndKey as Mock).mockResolvedValue(price);

        const result = await usecase.findByPlanIdAndKey(1, priceKey.freeMonthlyBrl);

        expect(result).toBe(price);
        expect(metrics.increment).toHaveBeenCalledWith('price.queried.by-key', expect.objectContaining({ found: 'true' }));
    });
});
