import { describe, expect, it, beforeEach, Mock } from 'vitest';
import {
    createTransactionManagerMock,
    createDiscountRepositoryMock,
    createPriceRepositoryMock,
    createBillingGatewayServiceMock,
} from "@mock/tests.mock";
import { MockDiscountInput, MockPrice } from "@mock/in-memory.mock";
import { CreateDiscountUsecase } from "@billing/application/discount/usecase/create-discount.usecase";
import { IDiscountRepository } from "@billing/domain/discount/port/discount.port";
import { IPriceRepository } from "@billing/domain/price/port/price.port";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { Discount } from "@billing/domain/discount/entity/discount.entity";
import { AppException } from "@shared/domain/exception/app.exception";

describe('CreateDiscountUseCase', () => {
    let usecase: CreateDiscountUsecase;
    let discountRepository: IDiscountRepository;
    let priceRepository: IPriceRepository;
    let transactionManager: ITransactionManager;
    let billingGatewayService: IBillingGatewayService;

    beforeEach(() => {
        discountRepository = createDiscountRepositoryMock();
        priceRepository = createPriceRepositoryMock();
        transactionManager = createTransactionManagerMock();
        billingGatewayService = createBillingGatewayServiceMock();

        usecase = new CreateDiscountUsecase(
            discountRepository,
            priceRepository,
            transactionManager,
            billingGatewayService
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
        expect(billingGatewayService.syncDiscount).toHaveBeenCalled();
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
