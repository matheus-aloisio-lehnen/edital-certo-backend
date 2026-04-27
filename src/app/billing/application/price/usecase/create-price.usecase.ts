import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { Price } from "@billing/domain/price/entity/price.entity";
import { Product } from "@billing/domain/product/entity/product.entity";
import { PriceFactory } from "@billing/domain/price/factory/price.factory";
import { IProductRepository } from "@billing/domain/product/port/product.port";
import { ICreatePriceUsecase, IPriceRepository } from "@billing/domain/price/port/price.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { CreatePriceProps } from "@billing/domain/price/props/create-price.props";

export class CreatePriceUsecase implements ICreatePriceUsecase {

    constructor(
        private readonly priceRepository: IPriceRepository,
        private readonly productRepository: IProductRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly billingGatewayService: IBillingGatewayService,
    ) {
    }

    async execute(input: CreatePriceProps): Promise<Price> {
        const metadata = {
            name: "CreatePriceUsecase.create",
            data: { input },
            metrics: { billingCycle: input.billingCycle },
        };

        return this.transactionManager.run(async () => {
            const product = await this.getProduct(input.productId);

            if (!product.externalProductId)
                throw new AppException(code.productExternalIdNotFoundError, 400, `ExternalId not found in Product with id ${product.id} not found`);

            const existingPrice = await this.priceRepository.findByProductIdAndBillingCycle(product.id, input.billingCycle);
            if (existingPrice)
                this.deactivateExistingPrice(existingPrice);

            if (existingPrice)
                await this.priceRepository.save(existingPrice);

            const price = await this.priceRepository.save(PriceFactory.create(input));
            await this.billingGatewayService.syncPrice(product.id, this.getExternalProductId(product), price);

            if (price.discount)
                await this.billingGatewayService.syncDiscount(price.discount);

            return this.priceRepository.save(price);
        }, metadata);
    }

    private async getProduct(productId?: number): Promise<Product> {
        if (!productId)
            throw new AppException(code.productIdEmptyError, 400, "ProductId is required");

        const product = await this.productRepository.findById(productId);
        if (!product)
            throw new AppException(code.productNotFoundError, 404, `Product with id ${productId} not found`);

        return product;
    }

    private getExternalProductId(product: Product): string {
        if (!product.externalProductId)
            throw new AppException(code.productExternalIdNotFoundError, 400, `ExternalId not found in Product with id ${product.id} not found`);

        return product.externalProductId;
    }

    private deactivateExistingPrice(price: Price): void {
        price.deactivate();
    }
}
