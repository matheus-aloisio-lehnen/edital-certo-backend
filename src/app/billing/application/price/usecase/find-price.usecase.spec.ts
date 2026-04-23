import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { IMetrics } from "@shared/domain/port/metrics.port";
import { sortOrder } from '@shared/domain/type/page.type';
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { IPriceRepository } from "@billing/domain/price/port/price.port";
import { FindPriceUsecase } from "@billing/application/price/usecase/find-price.usecase";
import { createMetricsMock, createPriceRepositoryMock } from "@mock/tests.mock";
import { MockPrice } from "@mock/in-memory.mock";

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
});
