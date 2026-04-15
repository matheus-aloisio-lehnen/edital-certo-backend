import { describe, expect, it, vi, beforeEach } from 'vitest';
import { IDiscountRepository } from '@domain/product/port/discount.port';
import { createTransactionManagerMock } from '@mock/tests.mock';
import { AppException } from '@domain/@shared/exception/app.exception';
import { DeleteDiscountUsecase } from "@application/product/usecase/discount/delete-discount.usecase";

describe('DeleteDiscountUsecase', () => {
    let usecase: DeleteDiscountUsecase;
    let discountRepository: IDiscountRepository;
    let transactionManager: any;

    beforeEach(() => {
        discountRepository = {
            delete: vi.fn(),
        } as any;
        transactionManager = createTransactionManagerMock();
        usecase = new DeleteDiscountUsecase(discountRepository, transactionManager);
    });

    it('should delete a discount', async () => {
        (discountRepository.delete as any).mockResolvedValue(true);

        const result = await usecase.delete(1);

        expect(result).toBe(true);
        expect(discountRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw if discount not found', async () => {
        (discountRepository.delete as any).mockResolvedValue(false);
        await expect(usecase.delete(1)).rejects.toThrow(AppException);
    });
});
