import { Module } from "@nestjs/common";

import { ObservabilityModule } from "@shared/infrastructure/observability/observability.module";
import { BillingPersistenceModule } from "@billing/infrastructure/persistence/persistence.module";
import { BillingTransportOutModule } from "@billing/infrastructure/transport/out/transport-out.module";
import { productProviders } from "@billing/infrastructure/transport/in/http/product/provider/product.provider";
import { priceProviders } from "@billing/infrastructure/transport/in/http/price/provider/price.provider";
import { discountProviders } from "@billing/infrastructure/transport/in/http/discount/provider/discount.provider";
import { ProductController } from "@billing/infrastructure/transport/in/http/product/controller/product.controller";
import { PriceController } from "@billing/infrastructure/transport/in/http/price/controller/price.controller";
import { DiscountController } from "@billing/infrastructure/transport/in/http/discount/controller/discount.controller";

@Module({
    imports: [
        BillingPersistenceModule,
        BillingTransportOutModule,
        ObservabilityModule,
    ],
    controllers: [
        ProductController,
        PriceController,
        DiscountController,
    ],
    providers: [
        ...productProviders,
        ...priceProviders,
        ...discountProviders,
    ],
})
export class BillingTransportInModule {}
