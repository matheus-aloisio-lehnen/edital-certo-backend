import { describe, expect, it, vi, beforeEach, Mock } from 'vitest';
import { IDiscountRepository } from '@product/port/discount.port';
import { createTransactionManagerMock, createDiscountRepositoryMock } from '@mock/tests.mock';
import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { AppException } from '@domain/@shared/exception/app.exception';
import { DeleteDiscountUsecase } from "@application/product/usecase/discount/delete-discount.usecase";

describe('DeleteDiscountUsecase', () => {
    let usecase: DeleteDiscountUsecase;
    let discountRepository: IDiscountRepository;
    let transactionManager: ITransactionManager;

    beforeEach(() => {
        discountRepository = createDiscountRepositoryMock();
        transactionManager = createTransactionManagerMock();
        usecase = new DeleteDiscountUsecase(discountRepository, transactionManager);
    });

    it('delete should delete a discount', async () => {
        (discountRepository.delete as Mock).mockResolvedValue(true);

        const result = await usecase.delete(1);

        expect(result).toBe(true);
        expect(discountRepository.delete).toHaveBeenCalledWith(1);
    });

    it('delete should throw if discount not found', async () => {
        (discountRepository.delete as Mock).mockResolvedValue(false);
        await expect(usecase.delete(1)).rejects.toThrow(AppException);
    });
});
