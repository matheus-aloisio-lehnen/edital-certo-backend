import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { productRepositoryPort } from "@billing/domain/product/port/product.port";
import { priceRepositoryPort } from "@billing/domain/price/port/price.port";
import { ProductModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/product.model";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";
import { ProductRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/product.repository";
import { PriceRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/price.repository";
import { SharedPersistenceModule } from "@shared/infrastructure/persistence/persistence.module";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";
import { DiscountRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/discount.repository";
import { discountRepositoryPort } from "@app/billing/domain/discount/port/discount.port";

@Module({
    imports: [
        SharedPersistenceModule,
        TypeOrmModule.forFeature([
            ProductModel,
            PriceModel,
            DiscountModel,
        ]),
    ],
    providers: [
        DiscountRepository,
        ProductRepository,
        PriceRepository,
        { provide: discountRepositoryPort, useExisting: DiscountRepository },
        { provide: productRepositoryPort, useExisting: ProductRepository },
        { provide: priceRepositoryPort, useExisting: PriceRepository },
    ],
    exports: [
        discountRepositoryPort,
        productRepositoryPort,
        priceRepositoryPort,
    ],
})
export class BillingPersistenceModule {}
