import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { Price } from "@billing/domain/price/entity/price.entity";
import { IPriceRepository, IDeactivatePriceUsecase } from "@billing/domain/price/port/price.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";

export class DeactivatePriceUsecase implements IDeactivatePriceUsecase {

    constructor(
        private readonly priceRepository: IPriceRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly billingGatewayService: IBillingGatewayService,
    ) {
    }

    async execute(id: number): Promise<Price> {
        const price = await this.priceRepository.findById(id);

        if (!price)
            throw new AppException(code.priceNotFoundError, 404, `Price with id ${id} not found`);

        if (!price.externalPriceId)
            throw new AppException(code.priceExternalIdNotFoundError, 404, `ExternalId not found in Price with id ${id} not found`);

        const metadata = {
            name: "UpdatePriceUsecase.deactivate",
            data: { id },
            metrics: { priceId: String(price.id), billingCycle: price.billingCycle },
        };

        price.deactivate();

        if (price.discount)
            await this.billingGatewayService.deleteDiscount(price.discount);

        return this.transactionManager.run(async () => {
            await this.priceRepository.save(price);
            await this.billingGatewayService.deactivatePrice(price);
            return price;
        }, metadata);
    }
}
