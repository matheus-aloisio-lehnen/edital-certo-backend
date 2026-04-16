import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { IPriceRepository } from '@product/port/price.port';
import { IProductGatewayService } from '@product/port/product-payment-gateway.port';
import {
    createTransactionManagerMock,
    createPriceRepositoryMock,
    createProductGatewayServiceMock,
} from '@mock/tests.mock';
import { MockPrice } from '@mock/in-memory.mock';
import { PriceFactory } from '@product/factory/price.factory';
import { AppException } from '@domain/@shared/exception/app.exception';
import { UpdatePriceUsecase } from "@application/product/usecase/price/update-price.usecase";
import { ITransactionManager } from '@domain/@shared/port/transaction.port';

describe('UpdatePriceUsecase', () => {
    let usecase: UpdatePriceUsecase;
    let priceRepository: IPriceRepository;
    let transactionManager: ITransactionManager;
    let productGatewayService: IProductGatewayService;

    beforeEach(() => {
        priceRepository = createPriceRepositoryMock();
        transactionManager = createTransactionManagerMock();
        productGatewayService = createProductGatewayServiceMock();

        usecase = new UpdatePriceUsecase(
            priceRepository,
            transactionManager,
            productGatewayService
        );
    });

    it('deactivate should deactivate a price', async () => {
        const price = PriceFactory.rehydrate({ ...MockPrice, externalPriceId: 'ext-p-123' });
        (priceRepository.findById as Mock).mockResolvedValue(price);

        const result = await usecase.deactivate(1);

        expect(result.isActive).toBe(false);
        expect(productGatewayService.deactivatePrice).toHaveBeenCalledWith(price);
        expect(priceRepository.save).toHaveBeenCalledWith(price);
    });

    it('deactivate should throw if price not found', async () => {
        (priceRepository.findById as Mock).mockResolvedValue(null);
        await expect(usecase.deactivate(1)).rejects.toThrow(AppException);
    });

    it('deactivate should throw if externalPriceId is missing', async () => {
        const priceData = { ...MockPrice, externalPriceId: null };
        const price = PriceFactory.rehydrate(priceData);
        (priceRepository.findById as Mock).mockResolvedValue(price);
        await expect(usecase.deactivate(1)).rejects.toThrow(AppException);
    });
});
