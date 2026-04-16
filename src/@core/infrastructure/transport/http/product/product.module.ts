import { Module } from '@nestjs/common';
import { PersistenceModule } from "@persistence/persistence.module";
import { DiscountController } from "@transport/http/product/discount/controller/discount.controller";
import { FeatureController } from "@transport/http/product/feature/controller/feature.controller";
import { PlanController } from "@transport/http/product/plan/controller/plan.controller";
import { PriceController } from "@transport/http/product/price/controller/price.controller";
import { ProductGatewayService } from "@application/product/service/gateway/product-gateway.service";
import { IProductGatewayClient, productGatewayClientPort, productGatewayServicePort } from "@product/port/product-payment-gateway.port";
import { ProductValidatorService } from "@application/product/service/validator/product-validator.service";
import { productValidatorServicePort } from "@product/port/product-validator.port";
import { discountProviders } from "@transport/http/product/discount/provider/discount.provider";
import { featureProviders } from "@transport/http/product/feature/provider/feature.provider";
import { planProviders } from "@transport/http/product/plan/provider/plan.provider";
import { priceProviders } from "@transport/http/product/price/provider/price.provider";

@Module({
    imports: [PersistenceModule],
    controllers: [DiscountController, FeatureController, PlanController, PriceController],
    providers: [
        {
            provide: ProductGatewayService,
            useFactory: (client: IProductGatewayClient) => new ProductGatewayService(client),
            inject: [productGatewayClientPort],
        },
        {
            provide: ProductValidatorService,
            useFactory: () => new ProductValidatorService(),
        },
        { provide: productGatewayServicePort, useExisting: ProductGatewayService },
        { provide: productValidatorServicePort, useExisting: ProductValidatorService },
        ...discountProviders,
        ...featureProviders,
        ...planProviders,
        ...priceProviders
    ]
})
export class ProductModule {}