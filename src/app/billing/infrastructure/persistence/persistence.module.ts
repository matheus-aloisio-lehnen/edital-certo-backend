import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { discountRepositoryPort } from "@billing/domain/discount/port/discount.port";
import { productRepositoryPort } from "@billing/domain/product/port/product.port";
import { priceRepositoryPort } from "@billing/domain/price/port/price.port";
import { DiscountModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/discount.model";
import { ProductModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/product.model";
import { PriceModel } from "@billing/infrastructure/persistence/database/postgres/typeorm/model/price.model";
import { DiscountRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/discount.repository";
import { ProductRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/product.repository";
import { PriceRepository } from "@billing/infrastructure/persistence/database/postgres/typeorm/repository/price.repository";
import { SharedPersistenceModule } from "@shared/infrastructure/persistence/persistence.module";

@Module({
    imports: [
        SharedPersistenceModule,
        TypeOrmModule.forFeature([
            DiscountModel,
            ProductModel,
            PriceModel,
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
