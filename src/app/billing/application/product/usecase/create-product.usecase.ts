import { ITransactionManager } from "@shared/domain/port/transaction.port";
import { Product } from "@billing/domain/product/entity/product.entity";
import { ProductFactory } from "@billing/domain/product/factory/product.factory";
import { ICreateProductUsecase, IProductRepository } from "@billing/domain/product/port/product.port";
import { CreateProductProps } from "@billing/domain/product/props/create-product.props";
import { IBillingGatewayService } from "@billing/application/gateway/port/billing-gateway.port";

export class CreateProductUsecase implements ICreateProductUsecase {

    constructor(
        private readonly productRepository: IProductRepository,
        private readonly transactionManager: ITransactionManager,
        private readonly billingGatewayService: IBillingGatewayService,
    ) {
    }

    async execute(input: CreateProductProps): Promise<Product> {
        const metadata = {
            name: "CreateProductUsecase.create",
            data: { input },
            metrics: { productName: input.name },
        };

        return this.transactionManager.run(async () => {
            const product = await this.productRepository.save(ProductFactory.create(input));
            await this.billingGatewayService.syncProduct(product);

            return this.productRepository.save(product);
        }, metadata);
    }

}
