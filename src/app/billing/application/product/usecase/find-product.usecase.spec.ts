import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createMetricsMock } from "@mock/tests.mock";
import { FindProductUsecase } from "@billing/application/product/usecase/find-product.usecase";
import { ProductFactory } from "@billing/domain/product/factory/product.factory";
import { MockProduct } from "@mock/in-memory.mock";
import { IProductRepository } from "@billing/domain/product/port/product.port";
import { IMetrics } from "@shared/domain/port/metrics.port";
import { sortOrder } from "@shared/domain/type/page.type";

describe('FindProductUsecase', () => {
    let usecase: FindProductUsecase;
    let productRepository: IProductRepository;
    let metrics: IMetrics;

    beforeEach(() => {
        productRepository = {
            findAll: vi.fn(),
            findById: vi.fn(),
            findAllActive: vi.fn(),
        } as any;
        metrics = createMetricsMock();
        usecase = new FindProductUsecase(productRepository, metrics);
    });

    const product = ProductFactory.rehydrate(MockProduct);

    describe('findAll', () => {
        it('should return a page of products', async () => {
            const page = { list: [product], total: 1 };
            (productRepository.findAll as any).mockResolvedValue(page);

            const result = await usecase.findAll({ offset: 1, limit: 10, orderBy: 'id', sortOrder: sortOrder.desc });

            expect(result).toBe(page);
            expect(metrics.increment).toHaveBeenCalledWith('product.queried.all', expect.any(Object));
        });
    });

    describe('findById', () => {
        it('should return a product by id', async () => {
            (productRepository.findById as any).mockResolvedValue(product);

            const result = await usecase.findById(1);

            expect(result).toBe(product);
            expect(metrics.increment).toHaveBeenCalledWith('product.queried.by-id', { found: 'true' });
        });
    });
});
