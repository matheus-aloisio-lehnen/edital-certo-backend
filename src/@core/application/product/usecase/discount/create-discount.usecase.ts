import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { Discount } from "@product/entity/discount.entity";
import { DiscountFactory } from "@product/factory/discount.factory";
import { ICreateDiscountUsecase, IDiscountRepository } from "@product/port/discount.port";
import { IProductGatewayService } from "@product/port/product-payment-gateway.port";
import { IPriceRepository } from "@product/port/price.port";
import { CreateDiscountProps } from "@product/props/create-discount.props";

export class CreateDiscountUsecase implements ICreateDiscountUsecase {

    constructor(
        private readonly discountRepository: IDiscountRepository,
        private readonly priceRepository: IPriceRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly productGatewayService: IProductGatewayService,
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
            await this.productGatewayService.syncDiscount(price.currency, discount);

            return this.discountRepository.save(discount);
        }, metadata);
    }
}