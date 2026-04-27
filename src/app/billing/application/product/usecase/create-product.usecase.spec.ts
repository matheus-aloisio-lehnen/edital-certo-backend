import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CreateProductUsecase } from "@billing/application/product/usecase/create-product.usecase";
import { IProductRepository } from "@billing/domain/product/port/product.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { createTransactionManagerMock } from "@mock/tests.mock";
import { MockCreateProducts } from "@mock/in-memory.mock";
import { Product } from "@billing/domain/product/entity/product.entity";

describe('CreateProductUsecase', () => {
    let usecase: CreateProductUsecase;
    let productRepository: IProductRepository;
    let transactionManager: any;
    let billingGatewayService: IBillingGatewayService;

    beforeEach(() => {
        productRepository = {
            save: vi.fn((product) => Promise.resolve(product)),
            saveBulk: vi.fn((products) => Promise.resolve(products)),
        } as any;
        transactionManager = createTransactionManagerMock();
        billingGatewayService = {
            syncProduct: vi.fn(),
            deactivatePrice: vi.fn(),
            deleteDiscount: vi.fn(),
        } as any;

        usecase = new CreateProductUsecase(
            productRepository,
            transactionManager,
            billingGatewayService,
        );
    });

    describe('create', () => {
        it('should create and sync a new product', async () => {
            const input = MockCreateProducts[0];

            const result = await usecase.execute(input);

            expect(result).toBeInstanceOf(Product);
            expect(billingGatewayService.syncProduct).toHaveBeenCalled();
            expect(productRepository.save).toHaveBeenCalled();
        });
    });

});
