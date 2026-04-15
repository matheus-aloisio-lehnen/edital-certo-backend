import { describe, expect, it, vi, beforeEach } from 'vitest';
import { IPriceRepository } from '@domain/product/port/price.port';
import { IProductGatewayService } from '@domain/product/port/product-payment-gateway.port';
import { createTransactionManagerMock } from '@mock/tests.mock';
import { MockPrice } from '@mock/in-memory.mock';
import { PriceFactory } from '@domain/product/factory/price.factory';
import { AppException } from '@domain/@shared/exception/app.exception';
import { UpdatePriceUsecase } from "@application/product/usecase/price/update-price.usecase";

describe('UpdatePriceUsecase', () => {
    let usecase: UpdatePriceUsecase;
    let priceRepository: IPriceRepository;
    let transactionManager: any;
    let productGatewayService: IProductGatewayService;

    beforeEach(() => {
        priceRepository = {
            findById: vi.fn(),
            save: vi.fn((price) => Promise.resolve(price)),
        } as any;
        transactionManager = createTransactionManagerMock();
        productGatewayService = {
            deactivatePrice: vi.fn(),
            deleteDiscount: vi.fn(),
        } as any;

        usecase = new UpdatePriceUsecase(
            priceRepository,
            transactionManager,
            productGatewayService
        );
    });

    it('should deactivate a price', async () => {
        const price = PriceFactory.rehydrate({ ...MockPrice, externalPriceId: 'ext-p-123' });
        (priceRepository.findById as any).mockResolvedValue(price);

        const result = await usecase.deactivate(1);

        expect(result.isActive).toBe(false);
        expect(productGatewayService.deactivatePrice).toHaveBeenCalledWith(price);
        expect(priceRepository.save).toHaveBeenCalledWith(price);
    });

    it('should throw if price not found', async () => {
        (priceRepository.findById as any).mockResolvedValue(null);
        await expect(usecase.deactivate(1)).rejects.toThrow(AppException);
    });

    it('should throw if externalPriceId is missing', async () => {
        const priceData = { ...MockPrice, externalPriceId: undefined };
        const price = PriceFactory.rehydrate(priceData);
        (priceRepository.findById as any).mockResolvedValue(price);
        await expect(usecase.deactivate(1)).rejects.toThrow(AppException);
    });
});
