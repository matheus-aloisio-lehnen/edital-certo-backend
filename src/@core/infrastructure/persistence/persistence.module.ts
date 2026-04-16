import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { appConfig } from "@cfg/app.config";
import { TransactionManager } from "@persistence/database/postgres/typeorm/transaction/transaction.service";
import { transactionPort } from "@domain/@shared/port/transaction.port";
import { planRepositoryPort } from "@product/port/plan.port";
import { priceRepositoryPort } from "@product/port/price.port";
import { discountRepositoryPort } from "@product/port/discount.port";
import { featureRepositoryPort } from "@product/port/feature.port";
import { PlanModel } from "@persistence/database/postgres/typeorm/model/product/plan.model";
import { PriceModel } from "@persistence/database/postgres/typeorm/model/product/price.model";
import { DiscountModel } from "@persistence/database/postgres/typeorm/model/product/discount.model";
import { FeatureModel } from "@persistence/database/postgres/typeorm/model/product/feature.model";
import { PlanRepository } from "@persistence/database/postgres/typeorm/repository/product/plan.repository";
import { PriceRepository } from "@persistence/database/postgres/typeorm/repository/product/price.repository";
import { DiscountRepository } from "@persistence/database/postgres/typeorm/repository/product/discount.repository";
import { FeatureRepository } from "@persistence/database/postgres/typeorm/repository/product/feature.repository";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(appConfig)],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const app = configService.get("app");

                return {
                    type: "postgres",
                    host: app?.database.host,
                    port: app?.database.port,
                    username: app?.database.username,
                    password: app?.database.password,
                    database: app?.database.name,
                    synchronize: app?.database.sync,
                    migrationsRun: !app.database.sync,
                    autoLoadEntities: true,
                    namingStrategy: new SnakeNamingStrategy(),
                };
            },
        }),
        TypeOrmModule.forFeature([
            PlanModel,
            PriceModel,
            DiscountModel,
            FeatureModel,
        ]),
    ],
    providers: [
        TransactionManager,
        { provide: transactionPort, useExisting: TransactionManager },

        PlanRepository,
        PriceRepository,
        DiscountRepository,
        FeatureRepository,

        { provide: planRepositoryPort, useExisting: PlanRepository },
        { provide: priceRepositoryPort, useExisting: PriceRepository },
        { provide: discountRepositoryPort, useExisting: DiscountRepository },
        { provide: featureRepositoryPort, useExisting: FeatureRepository },
    ],
    exports: [
        transactionPort,
        planRepositoryPort,
        priceRepositoryPort,
        discountRepositoryPort,
        featureRepositoryPort,
    ],
})
export class PersistenceModule {}