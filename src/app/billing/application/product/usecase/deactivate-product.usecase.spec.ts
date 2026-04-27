import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { DeactivateProductUsecase } from "@billing/application/product/usecase/deactivate-product.usecase";
import { IProductRepository } from "@billing/domain/product/port/product.port";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { createBillingGatewayServiceMock, createProductRepositoryMock, createTransactionManagerMock } from "@mock/tests.mock";
import { ProductFactory } from "@billing/domain/product/factory/product.factory";
import { MockProduct } from "@mock/in-memory.mock";
import { AppException } from "@shared/domain/exception/app.exception";

describe('DeactivateProductUsecase', () => {
    let usecase: DeactivateProductUsecase;
    let productRepository: IProductRepository;
    let transactionManager: ITransactionManager;
    let billingGatewayService: IBillingGatewayService;

    beforeEach(() => {
        productRepository = createProductRepositoryMock();
        transactionManager = createTransactionManagerMock();
        billingGatewayService = createBillingGatewayServiceMock();

        usecase = new DeactivateProductUsecase(
            productRepository,
            transactionManager,
            billingGatewayService
        );
    });

    it('deactivate should deactivate a product and its prices', async () => {
        const product = ProductFactory.rehydrate({ ...MockProduct, externalProductId: 'ext-product-123' });
        (productRepository.findById as Mock).mockResolvedValue(product);

        const result = await usecase.execute(1);

        expect(result.isActive).toBe(false);
        expect(billingGatewayService.deactivateProduct).toHaveBeenCalledWith(product);
        expect(productRepository.save).toHaveBeenCalledWith(product);
    });

    it('deactivate should throw if product not found', async () => {
        (productRepository.findById as Mock).mockResolvedValue(null);
        await expect(usecase.execute(1)).rejects.toThrow(AppException);
    });

    it('deactivate should throw if externalProductId is missing', async () => {
        const productData = { ...MockProduct, externalProductId: null };
        const product = ProductFactory.rehydrate(productData);
        (productRepository.findById as Mock).mockResolvedValue(product);
        await expect(usecase.execute(1)).rejects.toThrow(AppException);
    });
});
