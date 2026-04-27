import { AppException } from "@shared/domain/exception/app.exception";
import { code } from "@shared/domain/constant/code.constant";
import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { Product } from "@billing/domain/product/entity/product.entity";
import { IProductRepository, IDeactivateProductUsecase } from "@billing/domain/product/port/product.port";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";
import { Price } from "@billing/domain/price/entity/price.entity";

export class DeactivateProductUsecase implements IDeactivateProductUsecase {

    constructor(
        private readonly productRepository: IProductRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly billingGatewayService: IBillingGatewayService,
    ) {
    }

    async execute(id: number): Promise<Product> {
        const product = await this.productRepository.findById(id);
        if (!product)
            throw new AppException(code.productNotFoundError, 404, `Product with id ${id} not found`);
        if (!product.externalProductId)
            throw new AppException(code.productExternalIdNotFoundError, 404, `ExternalId not found in Product with id ${id} not found`);

        const metadata = {
            name: "DeactivateProductUsecase.execute",
            data: { id },
            metrics: { productId: String(product.id) },
        };

        product.deactivate();
        product.prices.forEach((price: Price) => price.deactivate());

        return this.transactionManager.run(async () => {
            await this.productRepository.save(product);

            await this.billingGatewayService.deactivateProduct(product);

            await Promise.all(product.prices.map(async (price: Price) => {
                await this.billingGatewayService.deactivatePrice(price);

                if (price.discount)
                    await this.billingGatewayService.deleteDiscount(price.discount);
            }));

            return product;
        }, metadata);
    }

}
