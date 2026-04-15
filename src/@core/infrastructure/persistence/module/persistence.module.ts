import { Module } from "@nestjs/common";
import { TransactionManager } from "@app/@core/infrastructure/persistence/database/postgres/typeorm/transaction/transaction.service";
import { transactionPort } from "@domain/@shared/port/transaction.port";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { appConfig } from "@cfg/app.config";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ ConfigModule.forFeature(appConfig) ],
            inject: [ ConfigService ],
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
    ],
    providers: [
        TransactionManager,
        {
            provide: transactionPort,
            useExisting: TransactionManager
        },
    ],
    exports: [ transactionPort ]
})
export class PersistenceModule {
}