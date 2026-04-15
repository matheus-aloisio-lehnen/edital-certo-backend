import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { appConfig } from "@cfg/app.config";
import { AppController } from "@app/app.controller";
import { AppService } from "@app/app.service";
import { provideGlobalPipes } from "@cfg/pipes.options";
import { provideGlobalFilters } from "@cfg/filters.options";
import { I18nModule } from "nestjs-i18n";
import { EventModule } from "@event/module/event.module";
import { ObservabilityModule } from "@observability/module/observability.module";
import { PersistenceModule } from "@persistence/module/persistence.module";
import { TransportModule } from "@transport/module/transport.module";
import { ClsModule } from 'nestjs-cls';

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
        ClsModule.forRoot({
            global: true,
            middleware: { mount: true },
        }),
        EventModule,
        ObservabilityModule,
        PersistenceModule,
        TransportModule,
    ],
    controllers: [ AppController ],
    providers: [
        AppService,
        ...provideGlobalFilters(),
        ...provideGlobalPipes(),
    ],
})
export class AppModule {
}
