import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { AppException } from "@shared/domain/exception/app.exception";
import { ITransactionManager } from '@shared/domain/port/transaction.port';
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { IPriceRepository } from "@billing/domain/price/port/price.port";
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { DeactivatePriceUsecase } from "@billing/application/price/usecase/deactivate-price.usecase";
import { createBillingGatewayServiceMock, createPriceRepositoryMock, createTransactionManagerMock } from "@mock/tests.mock";
import { MockPrice } from "@mock/in-memory.mock";

describe('DeactivatePriceUsecase', () => {
    let usecase: DeactivatePriceUsecase;
    let priceRepository: IPriceRepository;
    let transactionManager: ITransactionManager;
    let billingGatewayService: IBillingGatewayService;

    beforeEach(() => {
        priceRepository = createPriceRepositoryMock();
        transactionManager = createTransactionManagerMock();
        billingGatewayService = createBillingGatewayServiceMock();

        usecase = new DeactivatePriceUsecase(
            priceRepository,
            transactionManager,
            billingGatewayService
        );
    });

    it('deactivate should deactivate a price', async () => {
        const price = PriceFactory.rehydrate({ ...MockPrice, externalPriceId: 'ext-p-123' });
        (priceRepository.findById as Mock).mockResolvedValue(price);

        const result = await usecase.execute(1);

        expect(result.isActive).toBe(false);
        expect(billingGatewayService.deactivatePrice).toHaveBeenCalledWith(price);
        expect(priceRepository.save).toHaveBeenCalledWith(price);
    });

    it('deactivate should throw if price not found', async () => {
        (priceRepository.findById as Mock).mockResolvedValue(null);
        await expect(usecase.execute(1)).rejects.toThrow(AppException);
    });

    it('deactivate should throw if externalPriceId is missing', async () => {
        const priceData = { ...MockPrice, externalPriceId: null };
        const price = PriceFactory.rehydrate(priceData);
        (priceRepository.findById as Mock).mockResolvedValue(price);
        await expect(usecase.execute(1)).rejects.toThrow(AppException);
    });
});
