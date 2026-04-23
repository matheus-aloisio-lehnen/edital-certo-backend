import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { IDeleteDiscountUsecase, IDiscountRepository } from "@billing/domain/discount/port/discount.port";
import { ITransactionManager } from "@shared/domain/port/transaction.port";

export class DeleteDiscountUsecase implements IDeleteDiscountUsecase {

    constructor(
        private readonly discountRepository: IDiscountRepository,
        private readonly transactionManager: ITransactionManager,
    ) {
    }

    async delete(id: number): Promise<boolean> {
        const metadata = {
            name: "DeleteDiscountUsecase.delete",
            data: { id },
            metrics: { discountId: String(id) },
        };

        return this.transactionManager.run(async () => {
            const deleted = await this.discountRepository.delete(id);

            if (!deleted)
                throw new AppException(code.discountNotFoundError, 404, `Discount with id ${id} not found`);

            return deleted;
        }, metadata);
    }
}