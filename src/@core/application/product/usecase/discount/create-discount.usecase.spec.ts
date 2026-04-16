import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { IDiscountRepository } from '@product/port/discount.port';
import { IPriceRepository } from '@product/port/price.port';
import { IProductGatewayService } from '@product/port/product-payment-gateway.port';
import { PriceFactory } from '@product/factory/price.factory';
import { AppException } from '@domain/@shared/exception/app.exception';
import { Discount } from '@product/entity/discount.entity';
import {
    createTransactionManagerMock,
    createDiscountRepositoryMock,
    createPriceRepositoryMock,
    createProductGatewayServiceMock,
} from "@mock/tests.mock";
import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { MockDiscountInput, MockPrice } from "@mock/in-memory.mock";
import { CreateDiscountUsecase } from "@application/product/usecase/discount/create-discount.usecase";

describe('CreateDiscountUseCase', () => {
    let usecase: CreateDiscountUsecase;
    let discountRepository: IDiscountRepository;
    let priceRepository: IPriceRepository;
    let transactionManager: ITransactionManager;
    let productGatewayService: IProductGatewayService;

    beforeEach(() => {
        discountRepository = createDiscountRepositoryMock();
        priceRepository = createPriceRepositoryMock();
        transactionManager = createTransactionManagerMock();
        productGatewayService = createProductGatewayServiceMock();

        usecase = new CreateDiscountUsecase(
            discountRepository,
            priceRepository,
            transactionManager,
            productGatewayService
        );
    });

    it('execute should create and sync a new discount', async () => {
        const input = { ...MockDiscountInput, priceId: 1 };
        const price = PriceFactory.rehydrate(MockPrice);
        (priceRepository.findById as Mock).mockResolvedValue(price);
        (discountRepository.save as Mock).mockImplementation((d: Discount) => {
            Object.assign(d, { _id: 1, _priceId: 1 });
            return d;
        });

        const result = await usecase.execute(input);

        expect(result).toBeInstanceOf(Discount);
        expect(priceRepository.findById).toHaveBeenCalledWith(1);
        expect(productGatewayService.syncDiscount).toHaveBeenCalled();
        expect(discountRepository.save).toHaveBeenCalledTimes(2);
    });

    it('execute should throw if priceId is missing', async () => {
        const input = { ...MockDiscountInput, priceId: undefined as any };
        await expect(usecase.execute(input)).rejects.toThrow(AppException);
    });

    it('execute should throw if price not found', async () => {
        const input = { ...MockDiscountInput, priceId: 999 };
        (priceRepository.findById as Mock).mockResolvedValue(null);
        await expect(usecase.execute(input)).rejects.toThrow(AppException);
    });
});
