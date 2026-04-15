import { describe, expect, it, vi, beforeEach } from 'vitest';
import { IDiscountRepository } from '@domain/product/port/discount.port';
import { IPriceRepository } from '@domain/product/port/price.port';
import { IProductGatewayService } from '@domain/product/port/product-payment-gateway.port';
import { PriceFactory } from '@domain/product/factory/price.factory';
import { AppException } from '@domain/@shared/exception/app.exception';
import { Discount } from '@domain/product/entity/discount.entity';
import { createTransactionManagerMock } from "@mock/tests.mock";
import { MockDiscountInput, MockPrice } from "@mock/in-memory.mock";
import { CreateDiscountUsecase } from "@application/product/usecase/discount/create-discount.usecase";

describe('CreateDiscountUseCase', () => {
    let usecase: CreateDiscountUsecase;
    let discountRepository: IDiscountRepository;
    let priceRepository: IPriceRepository;
    let transactionManager: any;
    let productGatewayService: IProductGatewayService;

    beforeEach(() => {
        discountRepository = {
            save: vi.fn((discount) => Promise.resolve(discount)),
        } as any;
        priceRepository = {
            findById: vi.fn(),
        } as any;
        transactionManager = createTransactionManagerMock();
        productGatewayService = {
            syncDiscount: vi.fn(),
        } as any;

        usecase = new CreateDiscountUsecase(
            discountRepository,
            priceRepository,
            transactionManager,
            productGatewayService
        );
    });

    it('should create and sync a new discount', async () => {
        const input = { ...MockDiscountInput, priceId: 1 };
        const price = PriceFactory.rehydrate(MockPrice);
        (priceRepository.findById as any).mockResolvedValue(price);

        const result = await usecase.execute(input);

        expect(result).toBeInstanceOf(Discount);
        expect(priceRepository.findById).toHaveBeenCalledWith(1);
        expect(productGatewayService.syncDiscount).toHaveBeenCalled();
        expect(discountRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should throw if priceId is missing', async () => {
        const input = { ...MockDiscountInput, priceId: undefined as any };
        await expect(usecase.execute(input)).rejects.toThrow(AppException);
    });

    it('should throw if price not found', async () => {
        const input = { ...MockDiscountInput, priceId: 999 };
        (priceRepository.findById as any).mockResolvedValue(null);
        await expect(usecase.execute(input)).rejects.toThrow(AppException);
    });
});
