import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { AppException } from "@shared/domain/exception/app.exception";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { IProductRepository } from "@billing/domain/product/port/product.port";
import { ProductFactory } from "@billing/domain/product/factory/product.factory";
import { Price } from "@billing/domain/price/entity/price.entity";
import { IPriceRepository } from "@billing/domain/price/port/price.port";
import { CreatePriceUsecase } from "@billing/application/price/usecase/create-price.usecase";
import { createBillingGatewayServiceMock, createProductRepositoryMock, createPriceRepositoryMock, createTransactionManagerMock } from "@mock/tests.mock";
import { MockProduct, MockPriceInput } from "@mock/in-memory.mock";

describe('CreatePriceUsecase', () => {
    let usecase: CreatePriceUsecase;
    let priceRepository: IPriceRepository;
    let productRepository: IProductRepository;
    let transactionManager: ITransactionManager;
    let billingGatewayService: IBillingGatewayService;

    beforeEach(() => {
        priceRepository = createPriceRepositoryMock();
        productRepository = createProductRepositoryMock();
        transactionManager = createTransactionManagerMock();
        billingGatewayService = createBillingGatewayServiceMock();

        usecase = new CreatePriceUsecase(
            priceRepository,
            productRepository,
            transactionManager,
            billingGatewayService,
        );
    });

    const product = ProductFactory.rehydrate({ ...MockProduct, externalProductId: 'ext-123' });

    it('create should create and sync a new price', async () => {
        const input = { ...MockPriceInput, productId: 1 };
        (productRepository.findById as Mock).mockResolvedValue(product);
        (priceRepository.findByProductIdAndBillingCycle as Mock).mockResolvedValue(null);
        (priceRepository.save as Mock).mockImplementation((p) => {
            Object.assign(p, { _id: 1 });
            if (p.discount) Object.assign(p.discount, { _id: 1, _priceId: 1 });
            return p;
        });

        const result = await usecase.execute(input);

        expect(result).toBeInstanceOf(Price);
        expect(billingGatewayService.syncPrice).toHaveBeenCalled();
        expect(priceRepository.save).toHaveBeenCalled();
    });

    it('create should throw if product not found', async () => {
        const input = { ...MockPriceInput, productId: 999 };
        (productRepository.findById as Mock).mockResolvedValue(null);
        await expect(usecase.execute(input)).rejects.toThrow(AppException);
    });

    it('create should throw if product has no externalProductId', async () => {
        const productData = { ...MockProduct, externalProductId: null };
        const productWithoutExt = ProductFactory.rehydrate(productData);
        const input = { ...MockPriceInput, productId: 1 };
        (productRepository.findById as Mock).mockResolvedValue(productWithoutExt);
        await expect(usecase.execute(input)).rejects.toThrow(AppException);
    });
});
