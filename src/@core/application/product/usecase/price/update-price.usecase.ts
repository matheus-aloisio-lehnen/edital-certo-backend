import { AppException } from "@domain/@shared/exception/app.exception";
import { code } from "@domain/@shared/constant/code.constant";
import { ITransactionManager } from "@domain/@shared/port/transaction.port";
import { Price } from "@domain/product/entity/price.entity";
import { IPriceRepository, IUpdatePriceUsecase } from "@domain/product/port/price.port";
import { IProductGatewayService } from "@domain/product/port/product-payment-gateway.port";

export class UpdatePriceUsecase implements IUpdatePriceUsecase {

    constructor(
        private readonly priceRepository: IPriceRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly productGatewayService: IProductGatewayService,
    ) {}

    async deactivate(id: number): Promise<Price> {
        const price = await this.priceRepository.findById(id);

        if (!price)
            throw new AppException(code.priceNotFoundError, 404, `Price with id ${id} not found`);

        if (!price.externalPriceId)
            throw new AppException(code.priceExternalIdNotFoundError, 404, `ExternalId not found in Price with id ${id} not found`);

        const metadata = {
            name: "UpdatePriceUsecase.deactivate",
            data: { id },
            metrics: { priceKey: price.key },
        };

        price.deactivate();

        if (price.discount)
            await this.productGatewayService.deleteDiscount(price.discount);

        return this.transactionManager.run(async () => {
            await this.priceRepository.save(price);
            await this.productGatewayService.deactivatePrice(price);
            return price;
        }, metadata);
    }
}