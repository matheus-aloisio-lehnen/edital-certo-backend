import { describe, expect, it, vi, beforeEach } from 'vitest';
import { IPriceRepository } from '@domain/product/port/price.port';
import { IMetrics } from '@domain/@shared/port/metrics.port';
import { createMetricsMock } from '@mock/tests.mock';
import { MockPrice } from '@mock/in-memory.mock';
import { PriceFactory } from '@domain/product/factory/price.factory';
import { priceKey } from '@domain/product/constant/price-key.constant';
import { FindPriceUsecase } from "@application/product/usecase/price/find-price.usecase";

describe('FindPriceUsecase', () => {
    let usecase: FindPriceUsecase;
    let priceRepository: IPriceRepository;
    let metrics: IMetrics;

    beforeEach(() => {
        priceRepository = {
            findAll: vi.fn(),
            findById: vi.fn(),
            findByPlanIdAndKey: vi.fn(),
            findAllByPlanId: vi.fn(),
        } as any;
        metrics = createMetricsMock();
        usecase = new FindPriceUsecase(priceRepository, metrics);
    });

    const price = PriceFactory.rehydrate(MockPrice);

    describe('findAll', () => {
        it('should return a page of prices', async () => {
            const page = { list: [price], total: 1 };
            (priceRepository.findAll as any).mockResolvedValue(page);

            const result = await usecase.findAll({ offset: 1, limit: 10 });

            expect(result).toBe(page);
            expect(metrics.increment).toHaveBeenCalledWith('price.queried.all', expect.any(Object));
        });
    });

    describe('findById', () => {
        it('should return a price by id', async () => {
            (priceRepository.findById as any).mockResolvedValue(price);

            const result = await usecase.findById(1);

            expect(result).toBe(price);
            expect(metrics.increment).toHaveBeenCalledWith('price.queried.by-id', { found: 'true' });
        });
    });

    describe('findByPlanIdAndKey', () => {
        it('should return a price by planId and key', async () => {
            (priceRepository.findByPlanIdAndKey as any).mockResolvedValue(price);

            const result = await usecase.findByPlanIdAndKey(1, priceKey.freeMonthlyBrl);

            expect(result).toBe(price);
            expect(metrics.increment).toHaveBeenCalledWith('price.queried.by-key', expect.objectContaining({ found: 'true' }));
        });
    });

});
