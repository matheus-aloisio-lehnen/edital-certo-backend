import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { Discount } from "@billing/domain/discount/entity/discount.entity";
import { DiscountFactory } from "@billing/domain/discount/factory/discount.factory";
import { ICreateDiscountUsecase, IDiscountRepository } from "@billing/domain/discount/port/discount.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { IPriceRepository } from "@billing/domain/price/port/price.port";
import { CreateDiscountProps } from "@billing/domain/discount/props/create-discount.props";

export class CreateDiscountUsecase implements ICreateDiscountUsecase {

    constructor(
        private readonly discountRepository: IDiscountRepository,
        private readonly priceRepository: IPriceRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly billingGatewayService: IBillingGatewayService,
    ) {
    }

    async execute(input: CreateDiscountProps): Promise<Discount> {
        const metadata = {
            name: "CreateDiscountUsecase.create",
            data: { input },
            metrics: { priceId: String(input.priceId) },
        };

        return this.transactionManager.run(async () => {
            if (!input.priceId)
                throw new AppException(code.priceIdEmptyError, 400);

            const price = await this.priceRepository.findById(input.priceId);
            if (!price)
                throw new AppException(code.priceNotFoundError, 404, `Price with id ${input.priceId} not found`);

            const discount = await this.discountRepository.save(DiscountFactory.create(input));
            await this.billingGatewayService.syncDiscount(discount);

            return this.discountRepository.save(discount);
        }, metadata);
    }
}
