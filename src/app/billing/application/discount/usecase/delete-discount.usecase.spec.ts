import { describe, expect, it, beforeEach, Mock } from 'vitest';
import { AppException } from '@shared/domain/exception/app.exception';
import { DeleteDiscountUsecase } from "@billing/application/discount/usecase/delete-discount.usecase";
import { IDiscountRepository } from "@billing/domain/discount/port/discount.port";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { createDiscountRepositoryMock, createTransactionManagerMock } from "@mock/tests.mock";

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
