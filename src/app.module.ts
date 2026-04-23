import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { appConfig } from "@root/app.config";
import { AcceptLanguageResolver, HeaderResolver, I18nModule, QueryResolver } from "nestjs-i18n";
import { ClsModule } from 'nestjs-cls';
import { SharedTransportInModule } from "@shared/infrastructure/transport/in/transport-in.module";

import path from "node:path";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [ appConfig ],
            isGlobal: true,
            envFilePath: `devops/.env`,
        }),
        EventEmitterModule.forRoot(),
        I18nModule.forRoot({
            fallbackLanguage: 'pt',
            loaderOptions: {
                path: path.join(process.cwd(), 'public', 'i18n'),
                watch: true,
            },
            resolvers: [
                { use: QueryResolver, options: ["lang"] },
                AcceptLanguageResolver,
                new HeaderResolver(["x-lang"]),
            ],
        }),
        ClsModule.forRoot({
            global: true,
            middleware: { mount: true },
        }),
        SharedTransportInModule,
    ],
    controllers: [ AppController ],
    providers: [
        AppService,
    ],
})
export class AppModule {
}
