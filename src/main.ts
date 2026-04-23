import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppConfig } from "@root/app.config";
import { loggerPort } from "@shared/domain/port/logger.port";
import { registerPrototypes } from "@shared/infrastructure/prototype/prototypes.register";

import { AppModule } from "./app.module";

async function bootstrap() {
    registerPrototypes();

    const app = await NestFactory.create(AppModule, {
        cors: true,
        bufferLogs: true,
    });

    const cfg = app
        .get(ConfigService)
        .get<AppConfig>('app');

    if (cfg?.observability.logs)
        app.useLogger(app.get(loggerPort));

    if (cfg?.swagger.enabled) {
        const options = new DocumentBuilder()
        .setTitle(cfg.swagger.title)
        .setDescription(cfg.swagger.description)
        .setVersion(cfg.swagger.version)
        .build();

        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup(cfg.swagger.path, app, document);
    }

    await app.listen(cfg?.nest.port ?? 3000);
}

void bootstrap();
