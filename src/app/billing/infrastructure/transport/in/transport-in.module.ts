import { Module } from "@nestjs/common";

import { ObservabilityModule } from "@shared/infrastructure/observability/observability.module";
import { BillingPersistenceModule } from "@billing/infrastructure/persistence/persistence.module";
import { BillingTransportOutModule } from "@billing/infrastructure/transport/out/transport-out.module";
import { planProviders } from "@billing/infrastructure/transport/in/http/plan/provider/plan.provider";
import { priceProviders } from "@billing/infrastructure/transport/in/http/price/provider/price.provider";
import { discountProviders } from "@billing/infrastructure/transport/in/http/discount/provider/discount.provider";
import { PlanController } from "@billing/infrastructure/transport/in/http/plan/controller/plan.controller";
import { PriceController } from "@billing/infrastructure/transport/in/http/price/controller/price.controller";
import { DiscountController } from "@billing/infrastructure/transport/in/http/discount/controller/discount.controller";

@Module({
    imports: [
        BillingPersistenceModule,
        BillingTransportOutModule,
        ObservabilityModule,
    ],
    controllers: [
        PlanController,
        PriceController,
        DiscountController,
    ],
    providers: [
        ...planProviders,
        ...priceProviders,
        ...discountProviders,
    ],
})
export class BillingTransportInModule {}
