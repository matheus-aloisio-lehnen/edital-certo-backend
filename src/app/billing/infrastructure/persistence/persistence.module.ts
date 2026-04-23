import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { discountRepositoryPort } from "@billing/domain/discount/port/discount.port";
import { planRepositoryPort } from "@billing/domain/plan/port/plan.port";
import { priceRepositoryPort } from "@billing/domain/price/port/price.port";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";
import { PlanModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/plan.model";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";
import { DiscountRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/discount.repository";
import { PlanRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/plan.repository";
import { PriceRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/price.repository";
import { SharedPersistenceModule } from "@shared/infrastructure/persistence/persistence.module";

@Module({
    imports: [
        SharedPersistenceModule,
        TypeOrmModule.forFeature([
            DiscountModel,
            PlanModel,
            PriceModel,
        ]),
    ],
    providers: [
        DiscountRepository,
        PlanRepository,
        PriceRepository,
        { provide: discountRepositoryPort, useExisting: DiscountRepository },
        { provide: planRepositoryPort, useExisting: PlanRepository },
        { provide: priceRepositoryPort, useExisting: PriceRepository },
    ],
    exports: [
        discountRepositoryPort,
        planRepositoryPort,
        priceRepositoryPort,
    ],
})
export class BillingPersistenceModule {}
