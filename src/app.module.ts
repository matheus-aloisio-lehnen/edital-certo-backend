import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appConfig } from "@cfg/app.config";
import { AppController } from "@app/app.controller";
import { AppService } from "@app/app.service";
import { Logger } from '@logger/logger.service';
import { Metrics } from "@metrics/metrics.service";
import { Tracer } from "@tracer/tracer.service";
import { provideGlobalPipes } from "@cfg/pipes.options";
import { provideGlobalFilters } from "@cfg/filters.options";
import { RabbitmqAdapter } from './@core/infrastructure/transport/rabbitmq/rabbitmq.adapter';
import { EmailService } from './@core/infrastructure/transport/email/email.service';
import { I18nModule } from "nestjs-i18n";
import { TransactionManager } from "@app/@core/infrastructure/persistence/database/postgres/typeorm/transaction/transaction.adapter";
import path from "node:path";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [ appConfig ],
            isGlobal: true,
            envFilePath: `ops/env/.env.${ process.env.NODE_ENV ?? 'production' }`,
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'pt',
            loaderOptions: {
                path: path.join(process.cwd(), 'public', 'i18n'),
                watch: true,
            },
        }),
    ],
    controllers: [ AppController ],
    providers: [
        AppService,
        Logger,
        Metrics,
        Tracer,
        ...provideGlobalFilters(),
        ...provideGlobalPipes(),
        RabbitmqAdapter,
        EmailService,
        TransactionManager,
    ],
})
export class AppModule {
}
